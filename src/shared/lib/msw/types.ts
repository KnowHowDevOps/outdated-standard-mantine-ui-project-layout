/**
 * Types for MSW configuration
 */

export interface MockConfig {
  /**
   * Whether MSW is enabled
   */
  enabled: boolean;

  /**
   * Base URL for mocked APIs
   */
  baseUrl?: string;

  /**
   * Delay for mock responses (in milliseconds)
   */
  delay?: number | "real" | { min: number; max: number };

  /**
   * Whether to log mock requests
   */
  logging?: boolean;

  /**
   * Environment where mocks should be active
   */
  environment?: "development" | "test" | "storybook" | "all";
}

export interface MockResponse<T = any> {
  data: T;
  status?: number;
  headers?: Record<string, string>;
}

export interface MockError {
  message: string;
  status: number;
  code?: string;
  type?: string;
}
