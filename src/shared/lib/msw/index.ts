/**
 * MSW (Mock Service Worker) configuration and setup
 *
 * This module provides API mocking capabilities that can be enabled/disabled
 * via environment variables and app configuration.
 */

export {
  setupMocks,
  isMockingEnabled,
  stopMocks,
  resetMocks,
  addMockHandlers,
} from "./setup";
export { handlers } from "./handlers";
export { getMockConfig } from "./config";
export { createMockResponse, createMockError } from "./utils";
export type { MockConfig, MockResponse, MockError } from "./types";

// Development tools (only in development)
if (import.meta.env.DEV) {
  import("./dev-tools");
}
