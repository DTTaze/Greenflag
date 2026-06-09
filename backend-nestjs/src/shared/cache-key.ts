export function rateLimitCacheKey(
  method: string,
  endpoint: string,
  requestIp: string,
): string {
  return `rate-limit:${method}:${endpoint}:${requestIp}`;
}

export function otpCacheKey(userId: string, action: string): string {
  return `otp:${userId}:${action}`;
}

export function resetPasswordCacheKey(email: string): string {
  return `reset-password:${email}`;
}

export function failedAttemptCacheKey(
  userId: string,
  routeIdentifier: string,
): string {
  return `failed-attempts:${userId}:${routeIdentifier}`;
}

export function systemConfigCacheKey(key: string): string {
  return `system_config:${key}`;
}

export const CACHE_KEYS = {
  SHIPPING: {
    GHN_PROVINCES: () => 'shipping:ghn:provinces',
    GHN_DISTRICTS: (provinceId: number | string) =>
      `shipping:ghn:districts:${provinceId}`,
    GHN_WARDS: (districtId: number | string) =>
      `shipping:ghn:wards:${districtId}`,
    GHTK_PROVINCES: () => 'shipping:ghtk:provinces',
    GHTK_DISTRICTS: (provinceId: number | string) =>
      `shipping:ghtk:districts:${provinceId}`,
    GHTK_WARDS: (districtId: number | string) =>
      `shipping:ghtk:wards:${districtId}`,
  },
};
