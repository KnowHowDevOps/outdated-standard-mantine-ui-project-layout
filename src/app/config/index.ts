const readEnvVar = (key: string): string | undefined => {
  try {
    if (
      typeof window !== "undefined" &&
      window &&
      (window as any)[key] != null
    ) {
      const v = (window as any)[key];
      return typeof v === "string" ? v : String(v);
    }
  } catch {}
  return (import.meta as any).env?.[key] as string | undefined;
};

export const clientBuildEnv: Record<string, string | undefined> = {
  VITE_API_URL_SERVER: readEnvVar("VITE_API_URL_SERVER"),
  VITE_API_BASE_URL: readEnvVar("VITE_API_BASE_URL"),
  VITE_ENABLE_MSW: readEnvVar("VITE_ENABLE_MSW"),
  VITE_MSW_DELAY: readEnvVar("VITE_MSW_DELAY"),
  VITE_MSW_LOGGING: readEnvVar("VITE_MSW_LOGGING"),
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
