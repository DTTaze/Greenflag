import { ChatGroq } from '@langchain/groq';

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SystemConfigService } from '@modules/system-config/system-config.service';

import { ENV_KEY } from '@shared/constants';
import { SYSTEM_CONFIG_KEY } from '@shared/enums';

@Injectable()
export class ModerationService {
  private readonly logger = new Logger(ModerationService.name);
  private chatModel: any;

  constructor(
    private readonly systemConfigService: SystemConfigService,
    private readonly configService: ConfigService,
  ) {
    const groqApiKey = this.configService.get<string>(ENV_KEY.GROQ_API_KEY);
    const groqModel = this.configService.get<string>(ENV_KEY.GROQ_MODEL_NAME);

    this.chatModel = new ChatGroq({
      apiKey: groqApiKey,
      model: groqModel,
      temperature: 0.1,
    });
  }

  async moderatePostContent(
    content: string,
    images?: string[],
  ): Promise<{ isSafe: boolean; reason?: string }> {
    // 1. Text Filter: Check content against BANNED_WORDS using case-insensitive Regex
    const bannedWordsStr = await this.systemConfigService.get(
      SYSTEM_CONFIG_KEY.BANNED_WORDS,
    );
    let bannedWords: string[] = ['chửi thề', 'thuốc giả', 'lừa đảo'];
    if (bannedWordsStr) {
      try {
        const parsed = JSON.parse(bannedWordsStr);
        if (Array.isArray(parsed)) {
          bannedWords = parsed;
        } else if (typeof parsed === 'string') {
          bannedWords = parsed.split(',').map((w) => w.trim());
        }
      } catch (err) {
        this.logger.warn(`Failed to parse BANNED_WORDS config: ${err.message}`);
      }
    }

    // Clean and escape words for regex safety
    const cleanBannedWords = bannedWords
      .map((w) => w.trim())
      .filter((w) => w.length > 0);

    if (cleanBannedWords.length > 0) {
      const escapedWords = cleanBannedWords.map((w) =>
        w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      );
      const regex = new RegExp(`(${escapedWords.join('|')})`, 'gi');
      const matches = content.match(regex);
      if (matches && matches.length > 0) {
        const uniqueMatches = Array.from(new Set(matches));
        return {
          isSafe: false,
          reason: `Chứa từ ngữ nhạy cảm: ${uniqueMatches.join(', ')}`,
        };
      }
    }

    // 2. Implement chatModel (LLM Moderation) if text check passes
    try {
      let prompt = `You are an AI content moderator for a Vietnamese agricultural forum. 
Evaluate the following post for NSFW, violence, spam, scams, or malicious content.

CRITICAL INSTRUCTIONS:
1. Return ONLY a valid JSON object. Do not wrap it in markdown tags (like \`\`\`json).
2. If the content is NOT safe, the "reason" field MUST be explained entirely IN VIETNAMESE.

JSON Schema:
{ 
  "isSafe": boolean, 
  "reason": "Giải thích chi tiết bằng tiếng Việt lý do vi phạm nếu isSafe = false. Nếu an toàn, hãy để chuỗi rỗng." 
}

Post Content:
"""
${content}
"""`;

      if (images && images.length > 0) {
        prompt += `\n\nAttached Images URLs for context:\n${images.map((url, i) => `${i + 1}. ${url}`).join('\n')}`;
      }

      const response = await this.chatModel.invoke(prompt);
      const rawOutput = response.content as string;

      // Cleanup fallback in case LLM still outputs markdown tags
      const cleanJson = rawOutput
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();
      const result = JSON.parse(cleanJson);

      if (result && typeof result.isSafe === 'boolean') {
        if (!result.isSafe) {
          return {
            isSafe: false,
            reason:
              result.reason ||
              'Bị từ chối bởi bộ lọc AI do vi phạm tiêu chuẩn cộng đồng.',
          };
        }
      }
    } catch (err) {
      this.logger.error(`Error during LLM moderation: ${err.message}`);
    }

    // 3. Fallback Image safety check
    if (images && images.length > 0) {
      this.logger.log(
        `Performing fallback safety audit on ${images.length} images...`,
      );
      for (const imageUrl of images) {
        const lowerUrl = imageUrl.toLowerCase();
        if (
          lowerUrl.includes('nsfw') ||
          lowerUrl.includes('violence') ||
          lowerUrl.includes('spam')
        ) {
          return {
            isSafe: false,
            reason: `Hình ảnh chứa nội dung vi phạm: ${imageUrl}`,
          };
        }
      }
    }

    return { isSafe: true };
  }
}
