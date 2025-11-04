export const readEnvVar = (key: string): string | undefined => {
  if (typeof window !== "undefined" && (window as any)[key] != null) {
    const v = (window as any)[key];
    return typeof v === "string" ? v : String(v);
  }
  return (import.meta as any).env?.[key] as string | undefined;
};

export const getEnv = (key: string, fallback?: string): string | undefined => {
  const v = readEnvVar(key);
  return v ?? fallback;
};
