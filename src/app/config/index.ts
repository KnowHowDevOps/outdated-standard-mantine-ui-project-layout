export const clientBuildEnv: Record<string, string | undefined> = {
  VITE_API_URL_SERVER: import.meta.env.VITE_API_URL_SERVER,
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_ENABLE_MSW: import.meta.env.VITE_ENABLE_MSW,
  VITE_MSW_DELAY: import.meta.env.VITE_MSW_DELAY,
  VITE_MSW_LOGGING: import.meta.env.VITE_MSW_LOGGING,
};

export const getConfig = (
  key: string,
  fallback?: string
): string | undefined => {
  return clientBuildEnv[key] ?? fallback;
};

/**
 * App configuration with type safety
 */
export const appConfig = {
  api: {
    baseUrl: getConfig("VITE_API_BASE_URL", "/api"),
    serverUrl: getConfig("VITE_API_URL_SERVER"),
  },
  msw: {
    enabled: getConfig("VITE_ENABLE_MSW") === "true",
    delay: getConfig("VITE_MSW_DELAY")
      ? parseInt(getConfig("VITE_MSW_DELAY")!, 10)
      : undefined,
    logging: getConfig("VITE_MSW_LOGGING") === "true",
  },
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,
} as const;
