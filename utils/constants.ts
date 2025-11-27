const API_VERSION = 'v1';
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  `https://pinpoint-api.fly.dev/api/${API_VERSION}`;
