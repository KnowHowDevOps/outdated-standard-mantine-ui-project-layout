import type { MockConfig } from "./types";
import { getEnv } from "@/shared/lib/env";

/**
 * Get MSW configuration from environment variables and app config
 */
export function getMockConfig(): MockConfig {
  const isEnabled = getEnv("VITE_ENABLE_MSW") === "true";
  const isDev = (import.meta as any).DEV;
  const isTest =
    (import.meta as any).MODE === "test" ||
    (globalThis as any)?.process?.env?.NODE_ENV === "test";
  const isStorybook =
    typeof window !== "undefined" &&
    window.location?.pathname?.includes("storybook");

  // Determine current environment
  let environment: MockConfig["environment"] = "development";
  if (isTest) {
    environment = "test";
  } else if (isStorybook) {
    environment = "storybook";
  }

  return {
    // Enable MSW in test environment by default, or when explicitly enabled
    enabled: isTest || isEnabled || isDev || isStorybook,
    baseUrl: getEnv("VITE_API_BASE_URL", "/api") || "/api",
    delay: getEnv("VITE_MSW_DELAY")
      ? parseInt(getEnv("VITE_MSW_DELAY")!, 10)
      : isDev
        ? 500
        : 0, // Add realistic delay in development, no delay in tests
    logging: getEnv("VITE_MSW_LOGGING") === "true" || (isDev && !isTest),
    environment,
  };
}

/**
 * Check if mocking should be enabled for current environment
 */
export function isMockingEnabled(): boolean {
  const config = getMockConfig();
  return config.enabled;
}
