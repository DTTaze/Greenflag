import { CacheService, SET_CACHE_POLICY } from 'mvc-common-toolkit';
import { Repository } from 'typeorm';

import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { systemConfigCacheKey } from '@shared/cache-key';
import { CACHE_TTL, INJECTION_TOKEN } from '@shared/constants';
import { SYSTEM_CONFIG_KEY } from '@shared/enums';
import { OperationResult } from '@shared/helpers/operation-result.helper';
import { BaseCRUDService } from '@shared/services/base-crud.service';

import { UpdateSystemConfigDto } from './system-config.dto';
import { SystemConfig } from './system-config.entity';

@Injectable()
export class SystemConfigService
  extends BaseCRUDService<SystemConfig>
  implements OnModuleInit
{
  private readonly logger = new Logger(SystemConfigService.name);

  constructor(
    @InjectRepository(SystemConfig)
    configRepo: Repository<SystemConfig>,
    @Inject(INJECTION_TOKEN.REDIS_SERVICE)
    private readonly cacheService: CacheService,
  ) {
    super(configRepo);
  }

  async onModuleInit() {
    this.logger.log('Checking and seeding default system configurations...');

    const defaults = [
      {
        key: SYSTEM_CONFIG_KEY.MAX_IMAGE_SIZE_MB,
        value: '10',
        description: 'Maximum upload image size in megabytes',
      },

      {
        key: SYSTEM_CONFIG_KEY.POST_EXPIRE_DAYS,
        value: '7',
        description: 'Number of days before pending posts expire',
      },
      {
        key: SYSTEM_CONFIG_KEY.BANNED_WORDS,
        value: JSON.stringify(['chửi thề', 'thuốc giả', 'lừa đảo']),
        description: 'List of banned keywords on the forum (JSON array)',
      },
      {
        key: SYSTEM_CONFIG_KEY.AI_AUTO_MODERATION_ENABLED,
        value: 'false',
        description:
          'Trạng thái hoạt động của tự động hóa AI kiểm duyệt bài viết và bình luận trực tiếp',
      },
      {
        key: SYSTEM_CONFIG_KEY.AI_MODERATION_POST_ROLES,
        value: JSON.stringify(['FARMER']),
        description:
          'Danh sách các vai trò cần được AI lọc và kiểm duyệt trước khi đăng bài viết (JSON array)',
      },
      {
        key: SYSTEM_CONFIG_KEY.AI_MODERATION_COMMENT_ROLES,
        value: JSON.stringify(['FARMER']),
        description:
          'Danh sách các vai trò cần được AI lọc và kiểm duyệt trước khi bình luận (JSON array)',
      },
      {
        key: SYSTEM_CONFIG_KEY.AI_CRON_MODERATION_ENABLED,
        value: 'false',
        description:
          'Trạng thái hoạt động của Cron Job quét duyệt bài viết và bình luận chạy nền',
      },
      {
        key: SYSTEM_CONFIG_KEY.AI_CRON_DELAY_MINUTES,
        value: '15',
        description:
          'Số phút trễ trước khi quét các bài viết/bình luận PENDING',
      },
    ];

    for (const item of defaults) {
      const existsRes = await this.findOne({ key: item.key });
      if (!existsRes.success || !existsRes.data) {
        await this.create({
          key: item.key,
          value: item.value,
          description: item.description,
          isActive: true,
        });
        this.logger.log(`Seeded configuration key: ${item.key}`);
      }
    }
  }

  async get(key: string): Promise<string | null> {
    const cacheKey = systemConfigCacheKey(key);
    try {
      const cached = await this.cacheService.get(cacheKey);
      if (cached) {
        return cached;
      }
    } catch (err) {
      this.logger.warn(
        `Failed to get cache for key ${cacheKey}: ${err.message}`,
      );
    }

    const configRes = await this.findOne({ key });
    if (configRes.success && configRes.data && configRes.data.isActive) {
      const config = configRes.data;
      try {
        await this.cacheService.set(cacheKey, config.value, {
          policy: SET_CACHE_POLICY.WITH_TTL,
          value: CACHE_TTL.THIRTY_DAYS,
        });
      } catch (err) {
        this.logger.warn(
          `Failed to set cache for key ${cacheKey}: ${err.message}`,
        );
      }
      return config.value;
    }
    return null;
  }

  async getNumber(key: string, defaultValue: number): Promise<number> {
    const val = await this.get(key);
    if (val === null) return defaultValue;
    const num = Number(val);
    return isNaN(num) ? defaultValue : num;
  }

  override async create(
    dto: Partial<SystemConfig>,
  ): Promise<OperationResult<SystemConfig>> {
    const resultRes = await super.create(dto);
    if (resultRes.success && resultRes.data) {
      const result = resultRes.data;
      if (result.key) {
        try {
          await this.cacheService.del(systemConfigCacheKey(result.key));
        } catch (err) {
          this.logger.warn(
            `Failed to delete cache for key system_config:${result.key}: ${err.message}`,
          );
        }
      }
    }
    return resultRes;
  }

  override async updateByID(
    id: number | string,
    dto: Partial<SystemConfig>,
  ): Promise<OperationResult<SystemConfig>> {
    const existingRes = await this.findByID(id);
    const existing = existingRes.success ? existingRes.data : null;

    const resultRes = await super.updateByID(id, dto);
    const result = resultRes.success ? resultRes.data : null;

    if (existing && existing.key) {
      try {
        await this.cacheService.del(systemConfigCacheKey(existing.key));
      } catch (err) {
        this.logger.warn(
          `Failed to delete cache for key system_config:${existing.key}: ${err.message}`,
        );
      }
    }
    if (result && result.key && result.key !== existing?.key) {
      try {
        await this.cacheService.del(systemConfigCacheKey(result.key));
      } catch (err) {
        this.logger.warn(
          `Failed to delete cache for key system_config:${result.key}: ${err.message}`,
        );
      }
    }
    return resultRes;
  }

  override async deleteByID(
    entityID: number | string,
  ): Promise<OperationResult<void>> {
    const existingRes = await this.findByID(entityID);
    const existing = existingRes.success ? existingRes.data : null;

    const deleteRes = await super.deleteByID(entityID);
    if (existing && existing.key) {
      try {
        await this.cacheService.del(systemConfigCacheKey(existing.key));
      } catch (err) {
        this.logger.warn(
          `Failed to delete cache for key system_config:${existing.key}: ${err.message}`,
        );
      }
    }
    return deleteRes;
  }

  async updateByKey(
    key: string,
    dto: UpdateSystemConfigDto,
  ): Promise<OperationResult<SystemConfig>> {
    const configRes = await this.findOne({ key });
    if (!configRes.success || !configRes.data) {
      return OperationResult.fail('not_found', 'Configuration not found');
    }
    return this.updateByID(configRes.data.id, dto);
  }

  async deleteByKey(key: string): Promise<OperationResult<void>> {
    const configRes = await this.findOne({ key });
    if (!configRes.success || !configRes.data) {
      return OperationResult.fail('not_found', 'Configuration not found');
    }
    return this.deleteByID(configRes.data.id);
  }
}
