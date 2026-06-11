import { IsString } from 'class-validator';

import { registerAs } from '@nestjs/config';

import { validateConfig } from '@shared/helpers/validate-config.helper';

class GroqConfig {
  @IsString()
  apiKey: string;

  @IsString()
  modelName: string;
}

export const groqConfig = registerAs('groq', () => {
  const config = {
    apiKey: process.env.GROQ_API_KEY || '',
    modelName: process.env.GROQ_MODEL_NAME || 'llama3-8b-8192',
  };

  validateConfig(config, GroqConfig);

  return config;
});

export default groqConfig;
