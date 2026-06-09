import {
  CONFIG_KEY,
  ENTITY_STATUS,
  HEADER_KEY,
  METADATA_KEY,
  PARTNER_AUTH_TYPE,
  PARTNER_DIRECTION,
  PARTNER_TYPE,
} from './enums';

export const INJECTION_TOKEN = {
  AUDIT_SERVICE: Symbol.for('AUDIT_SERVICE'),
  HTTP_SERVICE: Symbol.for('HTTP_SERVICE'),
  REDIS_SERVICE: Symbol.for('REDIS_SERVICE'),
  SYNC_TASK_QUEUE: Symbol.for('SYNC_TASK_QUEUE'),
  CLOUDINARY_SERVICE: Symbol.for('CLOUDINARY_SERVICE'),
  MAIL_TRANSPORTER: Symbol.for('MAIL_TRANSPORTER'),
};

export const QUEUE_NAME = {
  COMMERCE: 'COMMERCE_QUEUE',
};

export const JOB_NAME = {
  PROCESS_ITEM_PURCHASE: 'process-item-purchase',
};

export const CACHE_TTL = {
  FIVE_MINUTES: 300,
  TEN_MINUTES: 600,
  ONE_HOUR: 3600,
  ONE_DAY: 86400,
  THIRTY_DAYS: 2592000,
};

export const getStorageFolder = () => ({
  TASK_SUBMIT: `${process.env.APP_NAME || 'greenflag'}/task_submits`,
  EVENT: `${process.env.APP_NAME || 'greenflag'}/events`,
  AVATAR: `${process.env.APP_NAME || 'greenflag'}/avatars`,
  MEDIA: `${process.env.APP_NAME || 'greenflag'}/media`,
});

export const ERR_CODE = {
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR'.toLowerCase(),
  NOT_FOUND: 'NOT_FOUND'.toLowerCase(),
  BAD_REQUEST: 'BAD_REQUEST'.toLowerCase(),
  ALREADY_EXISTS: 'ALREADY_EXISTS'.toLowerCase(),
  UNPROCESSABLE_ENTITY: 'UNPROCESSABLE_ENTITY'.toLowerCase(),
  FORBIDDEN: 'FORBIDDEN'.toLowerCase(),
  UNAUTHORIZED: 'UNAUTHORIZED'.toLowerCase(),
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS'.toLowerCase(),
  USER_NOT_FOUND: 'USER_NOT_FOUND'.toLowerCase(),
  ACCOUNT_IS_NOT_ACTIVE: 'ACCOUNT_IS_NOT_ACTIVE'.toLowerCase(),
  OTP_ALREADY_SENT: 'OTP_ALREADY_SENT'.toLowerCase(),
  INVALID_OTP: 'INVALID_OTP'.toLowerCase(),
  PASSWORD_SAME_AS_OLD: 'PASSWORD_SAME_AS_OLD'.toLowerCase(),
  PASSWORD_INCORRECT: 'PASSWORD_INCORRECT'.toLowerCase(),
  PASSWORD_OR_USERNAME_INCORRECT:
    'PASSWORD_OR_USERNAME_INCORRECT'.toLowerCase(),
  PASSWORD_CONFIRMATION_MISMATCH:
    'PASSWORD_CONFIRMATION_MISMATCH'.toLowerCase(),
  COIN_NOT_FOUND: 'coin_not_found',
  INSUFFICIENT_BALANCE: 'insufficient_balance',
  RANK_NOT_FOUND: 'rank_not_found',
  USER_PROFILE_NOT_FOUND: 'user_profile_not_found',
  TYPE_NOT_FOUND: 'type_not_found',
  TASK_NOT_FOUND: 'task_not_found',
  TASK_USER_NOT_FOUND: 'task_user_not_found',
  TASK_COMPLETED: 'task_completed',
  TASK_SUBMIT_NOT_FOUND: 'task_submit_not_found',
  TASK_ALREADY_SUBMITTED: 'task_already_submitted',
  EVENT_NOT_FOUND: 'event_not_found',
  EVENT_FULL: 'event_full',
  EVENT_ALREADY_JOINED: 'event_already_joined',
  EVENT_NOT_JOINED: 'event_not_joined',
  EVENT_USER_NOT_FOUND: 'event_user_not_found',
  EVENT_CHECKIN_ALREADY: 'event_checkin_already',
  EVENT_CHECKOUT_ALREADY: 'event_checkout_already',
  EVENT_NOT_CHECKED_IN: 'event_not_checked_in',
  DELIVERY_ACCOUNT_NOT_FOUND: 'delivery_account_not_found',
  RECEIVER_INFO_NOT_FOUND: 'receiver_info_not_found',
  DELIVERY_ORDER_NOT_FOUND: 'delivery_order_not_found',
  PRODUCT_NOT_FOUND: 'product_not_found',
  ITEM_NOT_FOUND: 'item_not_found',
  TRANSACTION_NOT_FOUND: 'transaction_not_found',
  CARRIER_CONFIG_INVALID: 'carrier_config_invalid',
  ITEM_ALREADY_SOLD: 'item_already_sold',
};

export const APP_ACTION = {
  API_CALL: 'API_CALL'.toLowerCase(),
  HANDLE_EXCEPTION: 'HANDLE_EXCEPTION'.toLowerCase(),
  SEND_TO_PARTNER: 'SEND_TO_PARTNER'.toLowerCase(),
  LOGIN: 'LOGIN'.toLowerCase(),
  FORGOT_PASSWORD: 'FORGOT_PASSWORD'.toLowerCase(),
  RESET_PASSWORD: 'RESET_PASSWORD'.toLowerCase(),
  CHANGE_PASSWORD: 'CHANGE_PASSWORD'.toLowerCase(),
  SOCIAL_LOGIN: 'SOCIAL_LOGIN'.toLowerCase(),
  REGISTER: 'REGISTER'.toLowerCase(),
  SEND_EMAIL: 'SEND_EMAIL'.toLowerCase(),
  BAN_TOO_MANY_FAILED_ATTEMPTS: 'BAN_TOO_MANY_FAILED_ATTEMPTS'.toLowerCase(),
};

export const DEFAULT_FAILED_ATTEMPTS_BAN = 3;

export const RESERVED_USERNAMES = ['admin', 'moderator', 'system', 'root'];

export {
  CONFIG_KEY,
  ENTITY_STATUS,
  HEADER_KEY,
  METADATA_KEY,
  PARTNER_AUTH_TYPE,
  PARTNER_DIRECTION,
  PARTNER_TYPE,
};

export const ENV_KEY = {
  PORT: CONFIG_KEY.APP + '.port',
  NODE_ENV: CONFIG_KEY.APP + '.nodeEnv',
  SERVICE_NAME: CONFIG_KEY.APP + '.serviceName',
  ENABLE_CORS: CONFIG_KEY.APP + '.enableCors',
  ENABLE_SWAGGER: CONFIG_KEY.APP + '.enableSwagger',
  APP_PUBLIC_URL: CONFIG_KEY.APP + '.appPublicUrl',
  APP_NAME: CONFIG_KEY.APP + '.appName',

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

  GOOGLE_CLIENT_ID: CONFIG_KEY.APP + '.googleClientId',
  GOOGLE_CLIENT_SECRET: CONFIG_KEY.APP + '.googleClientSecret',
  GOOGLE_CALLBACK_URL: CONFIG_KEY.APP + '.googleCallbackUrl',

  SMTP_HOST: CONFIG_KEY.EMAIL + '.smtpHost',
  SMTP_PORT: CONFIG_KEY.EMAIL + '.smtpPort',
  SMTP_SECURE: CONFIG_KEY.EMAIL + '.smtpSecure',
  SMTP_USERNAME: CONFIG_KEY.EMAIL + '.smtpUsername',
  SMTP_PASSWORD: CONFIG_KEY.EMAIL + '.smtpPassword',
  ADMIN_EMAILS: CONFIG_KEY.EMAIL + '.adminEmails',

  GHN_URL: CONFIG_KEY.APP + '.ghnUrl',
};

export const DEFAULT_MAX_CONCURRENT_CALL = 1;
