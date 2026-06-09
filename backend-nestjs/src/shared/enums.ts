export enum ROLE {
  ADMIN = 'admin',
  PARTNER = 'partner',
  USER = 'user',
}

export enum ITEM_STATUS {
  AVAILABLE = 'available',
  SOLD_OUT = 'sold_out',
  PENDING = 'pending',
}

export enum PRODUCT_CATEGORY {
  RECYCLED = 'recycled',
  HANDICRAFT = 'handicraft',
  ORGANIC = 'organic',
  PLANTS = 'plants',
  OTHER = 'other',
}

export enum PRODUCT_CONDITION {
  NEW = 'new',
  USED = 'used',
}

export enum PRODUCT_POST_STATUS {
  PUBLIC = 'public',
  PRIVATE = 'private',
  PENDING = 'pending',
  REJECTED = 'rejected',
}

export enum DELIVERY_ORDER_STATUS {
  READY_TO_PICK = 'ready_to_pick',
  PICKING = 'picking',
  MONEY_COLLECT_PICKING = 'money_collect_picking',
  PICKED = 'picked',
  STORING = 'storing',
  TRANSPORTING = 'transporting',
  SORTING = 'sorting',
  DELIVERING = 'delivering',
  DELIVERED = 'delivered',
  MONEY_COLLECT_DELIVERING = 'money_collect_delivering',
  DELIVERY_FAIL = 'delivery_fail',
  WAITING_TO_RETURN = 'waiting_to_return',
  RETURN = 'return',
  RETURN_TRANSPORTING = 'return_transporting',
  RETURN_SORTING = 'return_sorting',
  RETURNING = 'returning',
  RETURN_FAIL = 'return_fail',
  RETURNED = 'returned',
  CANCEL = 'cancel',
  EXCEPTION = 'exception',
  LOST = 'lost',
  DAMAGE = 'damage',
}

export enum EVENT_STATUS {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  FINISHED = 'finished',
}

export enum TASK_DIFFICULTY {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EVENT = 'event',
}

export enum TASK_VISIBILITY {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export enum TASK_SUBMIT_STATUS {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum TRANSACTION_STATUS {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

export enum CONFIG_KEY {
  APP = 'app',
  DATABASE = 'database',
  CLOUDINARY = 'cloudinary',
}

export enum SYSTEM_CONFIG_KEY {
  MAX_IMAGE_SIZE_MB = 'max_image_size_mb',
  POST_EXPIRE_DAYS = 'post_expire_days',
  BANNED_WORDS = 'banned_words',
  AI_AUTO_MODERATION_ENABLED = 'ai_auto_moderation_enabled',
  AI_MODERATION_POST_ROLES = 'ai_moderation_post_roles',
  AI_MODERATION_COMMENT_ROLES = 'ai_moderation_comment_roles',
  AI_CRON_MODERATION_ENABLED = 'ai_cron_moderation_enabled',
  AI_CRON_DELAY_MINUTES = 'ai_cron_delay_minutes',
}

export enum METADATA_KEY {
  MAX_CONCURRENCY_CALL = 'max_concurrency_call',
  RATE_LIMITING = 'rate_limiting',
  USER_ID_EXTRACTOR = 'user_id_extractor',
  MAX_ATTEMPTS_ALLOWED = 'max_attempts_allowed',
}

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

export enum SOCIAL_PROVIDER {
  GOOGLE = 'google',
}

export enum VERIFY_OTP_ACTION {
  REGISTER = 'register',
  RESET_PASSWORD = 'reset_password',
}

export enum EMAIL_TEMPLATE {
  EMAIL_VERIFICATION = 'email_verification',
  EMAIL_RESET_PASSWORD = 'email_reset_password',
}
