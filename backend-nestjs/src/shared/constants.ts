export const INJECTION_TOKEN = {
  AUDIT_SERVICE: Symbol.for('AUDIT_SERVICE'),
  HTTP_SERVICE: Symbol.for('HTTP_SERVICE'),
  REDIS_SERVICE: Symbol.for('REDIS_SERVICE'),
  SYNC_TASK_QUEUE: Symbol.for('SYNC_TASK_QUEUE'),
};

export const ERR_CODE = {
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR'.toLowerCase(),
  NOT_FOUND: 'NOT_FOUND'.toLowerCase(),
  BAD_REQUEST: 'BAD_REQUEST'.toLowerCase(),
  ALREADY_EXISTS: 'ALREADY_EXISTS'.toLowerCase(),
  UNPROCESSABLE_ENTITY: 'UNPROCESSABLE_ENTITY'.toLowerCase(),
  FORBIDDEN: 'FORBIDDEN'.toLowerCase(),
  UNAUTHORIZED: 'UNAUTHORIZED'.toLowerCase(),
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS'.toLowerCase(),
};

export const APP_ACTION = {
  API_CALL: 'API_CALL'.toLowerCase(),
  HANDLE_EXCEPTION: 'HANDLE_EXCEPTION'.toLowerCase(),
  SEND_TO_PARTNER: 'SEND_TO_PARTNER'.toLowerCase(),
};

export enum CONFIG_KEY {
  APP = 'app',
  DATABASE = 'database',
}

export const ENV_KEY = {
  PORT: CONFIG_KEY.APP + '.port',
  NODE_ENV: CONFIG_KEY.APP + '.nodeEnv',
  SERVICE_NAME: CONFIG_KEY.APP + '.serviceName',
  ENABLE_CORS: CONFIG_KEY.APP + '.enableCors',
  ENABLE_SWAGGER: CONFIG_KEY.APP + '.enableSwagger',

  DB_HOST: CONFIG_KEY.DATABASE + '.host',
  DB_PORT: CONFIG_KEY.DATABASE + '.port',
  DB_USERNAME: CONFIG_KEY.DATABASE + '.username',
  DB_PASSWORD: CONFIG_KEY.DATABASE + '.password',
  DB_SCHEMA: CONFIG_KEY.DATABASE + '.schema',
  DB_SYNCHRONIZE: CONFIG_KEY.DATABASE + '.synchronize',
  DB_LOGGING: CONFIG_KEY.DATABASE + '.logging',

  REDIS_HOST: CONFIG_KEY.APP + '.redisHost',
  REDIS_PORT: CONFIG_KEY.APP + '.redisPort',
  REDIS_PASSWORD: CONFIG_KEY.APP + '.redisPassword',

  JWT_SECRET: CONFIG_KEY.APP + '.jwtSecret',
  JWT_EXPIRATION: CONFIG_KEY.APP + '.jwtExpiration',

  AUDIT_WEBHOOK_URL: CONFIG_KEY.APP + '.auditWebhookUrl',
};

export enum METADATA_KEY {
  MAX_CONCURRENCY_CALL = 'max_concurrency_call',
  RATE_LIMITING = 'rate_limiting',
}

export const DEFAULT_MAX_CONCURRENT_CALL = 1;

export enum HEADER_KEY {
  CAPTCHA_TOKEN = 'X-Captcha-Token',
  LOG_ID = 'X-Log-ID',
  SESSION_TOKEN = 'X-Session-Token',
  ACCESS_KEY_ID = 'X-Access-Key-ID',
  ACCESS_KEY_SECRET = 'X-Access-Key-Secret',
  PARTNER_ACCESS_SECRET = 'X-Partner-Access-Secret',
}

export enum ENTITY_STATUS {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}

export enum PARTNER_DIRECTION {
  INBOUND = 'inbound',
  OUTBOUND = 'outbound',
}

export enum PARTNER_TYPE {
  INTERNAL = 'internal',
  EXTERNAL = 'external',
}

export enum PARTNER_AUTH_TYPE {
  ID_AND_SECRET = 'idAndSecret',
  MASTER_TOKEN = 'masterToken',
  API_KEY = 'apiKey',
}
