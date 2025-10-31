import "@testing-library/jest-dom";
import { setupMocks, stopMocks, resetMocks } from "@/shared/lib/msw";
import { i18n } from "@lingui/core";
import { messages } from "../locales/en";

// Setup MSW for testing
beforeAll(async () => {
  await setupMocks();
  // Setup Lingui for tests
  i18n.load("en", messages);
  i18n.activate("en");
});

// Reset handlers after each test
afterEach(() => {
  resetMocks();
});

// Clean up MSW after all tests
afterAll(() => {
  stopMocks();
});

// Mock window.matchMedia for Mantine components
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
