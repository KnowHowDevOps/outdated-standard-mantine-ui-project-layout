export const clientBuildEnv: Record<string, string | undefined> = {
  VITE_API_URL_SERVER: import.meta.env.VITE_API_URL_SERVER,
};

export const getConfig = (
  key: string,
  fallback?: string
): string | undefined => {
  return clientBuildEnv[key] ?? fallback;
};
