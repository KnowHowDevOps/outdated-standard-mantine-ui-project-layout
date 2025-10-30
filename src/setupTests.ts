import "@testing-library/jest-dom";
import { setupMocks, stopMocks, resetMocks } from "@/shared/lib/msw";

// Setup MSW for testing
beforeAll(async () => {
  await setupMocks();
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
