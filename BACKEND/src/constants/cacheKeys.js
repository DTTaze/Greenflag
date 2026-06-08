/**
 * CACHE KEYS SCHEMA (DDD Pattern)
 * Format: [BoundedContext]:[Aggregate]:[Entity]:[Identifier]
 */

const CACHE_KEYS = {
  // 1. IDENTITY DOMAIN (Quản lý người dùng, phân quyền)
  IDENTITY: {
    USER_BY_ID: (id) => `identity:user:id:${id}`,
    USER_BY_PUBLIC_ID: (publicId) => `identity:user:public_id:${publicId}`,
    ALL_USERS: "identity:user:all",
    USER_AVATAR: (id) => `identity:user:avatar:${id}`,
    AVATARS_ALL: "identity:avatar:all",
    ROLE_BY_ID: (id) => `identity:role:id:${id}`,
    ALL_ROLES: "identity:role:all",
    RANK_BY_ID: (id) => `identity:rank:id:${id}`,
  },

  // 2. MISSION DOMAIN (Nhiệm vụ xanh, check-in, bằng chứng)
  MISSION: {
    TASK_BY_ID: (id) => `mission:task:id:${id}`,
    TASK_BY_PUBLIC_ID: (publicId) => `mission:task:public_id:${publicId}`,
    ALL_TASKS: "mission:task:all",
    USER_TASK: (idOrUserId, taskId) =>
      taskId
        ? `mission:user_task:user:${idOrUserId}:task:${taskId}`
        : `mission:user_task:id:${idOrUserId}`, // Thay cho taskuser
    SUBMISSION: (submitId) => `mission:submission:id:${submitId}`, // Thay cho tasksubmit
    TASKS_BY_USER_ID: (userId) => `mission:task:user:${userId}`,
    TASKS_BY_TYPE: (type) => `mission:task:type:${type}`,
    TASKS_BY_DIFFICULTY: (difficulty) => `mission:task:difficulty:${difficulty}`,
    TASKS_BY_STATUS: (status) => `mission:task:status:${status}`,
    TASKS_BY_CUSTOMER: (customerId) => `mission:task:customer:${customerId}`,
  },

  // 3. COMMERCE DOMAIN (Cửa hàng, Vật phẩm, C2C, Giao dịch)
  COMMERCE: {
    ITEM_BY_ID: (id) => `commerce:item:id:${id}`,
    ALL_ITEMS: "commerce:item:all",
    ITEM_BY_PUBLIC_ID: (publicId) => `commerce:item:public_id:${publicId}`,
    ITEMS_BY_USER_ID: (userId) => `commerce:item:user:${userId}`,
    PRODUCT_BY_ID: (id) => `commerce:product:id:${id}`,
    PRODUCT_BY_PUBLIC_ID: (publicId) => `commerce:product:public_id:${publicId}`,
    ALL_PRODUCTS: "commerce:product:all",
    COIN_BY_ID: (id) => `commerce:coin:id:${id}`,
    DELIVERY_BY_USER_ID: (userId) => `commerce:delivery:user:${userId}`,
    DELIVERY_BY_ID: (id) => `commerce:delivery:id:${id}`,
    DELIVERY_ORDERS_BY_SELLER_ID: (sellerId) => `commerce:delivery_order:seller:${sellerId}`,
    DELIVERY_ORDERS_BY_BUYER_ID: (buyerId) => `commerce:delivery_order:buyer:${buyerId}`,
    RECEIVER_INFO_BY_ID: (id) => `commerce:receiver_info:id:${id}`,
    ALL_RECEIVER_INFO: "commerce:receiver_info:all",
    TRANSACTION_BY_ID: (id) => `commerce:transaction:id:${id}`,
    TRANSACTIONS_BY_USER_ID: (userId) => `commerce:transaction:user:${userId}`,
    TRANSACTION_BUYER: (buyerId) => `commerce:transaction:buyer_id:${buyerId}`,
    TRANSACTION_SELLER: (sellerId) => `commerce:transaction:seller_id:${sellerId}`,
  },

  // 4. EVENT DOMAIN (Sự kiện, Tổ chức)
  EVENT: {
    CAMPAIGN_BY_ID: (id) => `event:campaign:id:${id}`,
    ALL_CAMPAIGNS: "event:campaign:all",
    CAMPAIGN_USER_BY_ID: (id) => `event:campaign_user:id:${id}`,
    ALL_CAMPAIGN_USERS: "event:campaign_user:all",
  },

  // 5. SYSTEM DOMAIN (Rate limit, Config chung)
  SYSTEM: {
    RATE_LIMIT: (ipOrUserId) => `system:ratelimit:${ipOrUserId}`,
    LOGIN_ATTEMPTS_IP: (ip) => `system:ratelimit:ip:${ip}`,
    LOGIN_ATTEMPTS_EMAIL: (email) => `system:ratelimit:email:${email}`,
    LOGIN_ATTEMPTS_IP_EMAIL: (ip, email) => `system:ratelimit:ip_email:${ip}:${email}`,
    LOGIN_ATTEMPTS_IP_UA: (ip, ua) => `system:ratelimit:ip_ua:${ip}:${ua}`,
    IMAGE_BY_ID: (id) => `system:image:id:${id}`,
    ALL_IMAGES: "system:image:all",
  },
};

const CACHE_TTL = Object.freeze({
  DEFAULT: 60 * 60, // 1 hour
  ONE_HOUR: 60 * 60, // 1 hour
  FIVE_MINUTES: 300, // 5 minutes
  ONE_DAY: 60 * 60 * 24, // 24 hours
});

module.exports = { CACHE_KEYS, CACHE_TTL };
