const getEnv = (key, defaultValue = "") => {
  // Try Next.js env configuration
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return process.env[key];
  }
  // Try Vite client-side env variables
  try {
    if (
      typeof import.meta !== "undefined" &&
      import.meta.env &&
      import.meta.env[key]
    ) {
      return import.meta.env[key];
    }
  } catch {
    // Ignore error in non-supported environments
  }
  return defaultValue;
};

export const VITE_BACKEND_URL = getEnv(
  "VITE_BACKEND_URL",
  "http://localhost:6060",
);
export const VITE_GOOGLE_CLIENT_ID = getEnv("VITE_GOOGLE_CLIENT_ID", "");
export const VITE_GOOGLE_REDIRECT_URI = getEnv("VITE_GOOGLE_REDIRECT_URI", "");
export const VITE_GOOGLE_SCOPE = getEnv("VITE_GOOGLE_SCOPE", "email profile");
