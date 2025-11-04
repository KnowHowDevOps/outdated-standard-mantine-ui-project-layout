/**
 * MSW setup and initialization
 */

import { getMockConfig, isMockingEnabled } from "./config";

// Browser worker for development and Storybook
let worker: any = null;

// Node server for testing
let server: any = null;

/**
 * Setup MSW based on environment
 */
export async function setupMocks(): Promise<void> {
  if (!isMockingEnabled()) {
    console.log("🎭 MSW: Mocking is disabled");
    return;
  }

  const config = getMockConfig();

  // Lazy load handlers
  const { handlers } = await import("./handlers");

  // Check if we're in a test environment (Node.js with jsdom/happy-dom)
  const isTestEnvironment =
    config.environment === "test" ||
    process.env.NODE_ENV === "test" ||
    (typeof process !== "undefined" && process.env.VITEST);

  // Browser environment (development, Storybook) - but not tests
  if (typeof window !== "undefined" && !isTestEnvironment) {
    if (!worker) {
      const { setupWorker } = await import("msw/browser");
      worker = setupWorker(...handlers);
    }

    try {
      await worker.start({
        onUnhandledRequest: "bypass",
        serviceWorker: {
          url: "/mockServiceWorker.js",
        },
      });

      if (config.logging) {
        console.log("🎭 MSW: Browser worker started successfully");
        console.log(`🎭 MSW: Mocking ${handlers.length} API endpoints`);
        console.log("🎭 MSW: Configuration:", config);
      }
    } catch (error) {
      console.error("🎭 MSW: Failed to start browser worker:", error);
    }
  }
  // Node environment (testing) or test environment
  else {
    if (!server) {
      const { setupServer } = await import(
        /* @vite-ignore */ "msw/node"
      );
      server = setupServer(...handlers);
    }

    try {
      server.listen({
        onUnhandledRequest: "bypass",
      });

      if (config.logging) {
        console.log("🎭 MSW: Node server started successfully");
        console.log(`🎭 MSW: Mocking ${handlers.length} API endpoints`);
      }
    } catch (error) {
      console.error("🎭 MSW: Failed to start node server:", error);
    }
  }
}

/**
 * Stop MSW
 */
export function stopMocks(): void {
  if (worker) {
    worker.stop();
    if (getMockConfig().logging) {
      console.log("🎭 MSW: Browser worker stopped");
    }
  }

  if (server) {
    server.close();
    if (getMockConfig().logging) {
      console.log("🎭 MSW: Node server stopped");
    }
  }
}

/**
 * Reset MSW handlers (useful for testing)
 */
export function resetMocks(): void {
  if (worker) {
    worker.resetHandlers();
  }

  if (server) {
    server.resetHandlers();
  }

  if (getMockConfig().logging) {
    console.log("🎭 MSW: Handlers reset");
  }
}

/**
 * Add runtime handlers (useful for dynamic mocking)
 */
export function addMockHandlers(...newHandlers: any[]): void {
  if (worker) {
    worker.use(...newHandlers);
  }

  if (server) {
    server.use(...newHandlers);
  }

  if (getMockConfig().logging) {
    console.log(`🎭 MSW: Added ${newHandlers.length} runtime handlers`);
  }
}

/**
 * Get the current MSW instance (for advanced usage)
 */
export function getMockInstance() {
  return {
    worker,
    server,
    isRunning: !!(worker || server),
  };
}

export { isMockingEnabled };
