/**
 * Development tools for MSW
 * These utilities are only available in development mode
 */

import { setupMocks, stopMocks, resetMocks, getMockInstance } from "./setup";
import { getMockConfig } from "./config";

/**
 * MSW development tools (only available in development)
 */
export const mswDevTools = {
  /**
   * Get current MSW status
   */
  getStatus() {
    const config = getMockConfig();
    const instance = getMockInstance();

    return {
      enabled: config.enabled,
      running: instance.isRunning,
      config,
      instance,
    };
  },

  /**
   * Start MSW
   */
  async start() {
    if (!import.meta.env.DEV) {
      console.warn("MSW dev tools are only available in development mode");
      return;
    }

    await setupMocks();
    console.log("🎭 MSW: Started via dev tools");
  },

  /**
   * Stop MSW
   */
  stop() {
    if (!import.meta.env.DEV) {
      console.warn("MSW dev tools are only available in development mode");
      return;
    }

    stopMocks();
    console.log("🎭 MSW: Stopped via dev tools");
  },

  /**
   * Reset MSW handlers
   */
  reset() {
    if (!import.meta.env.DEV) {
      console.warn("MSW dev tools are only available in development mode");
      return;
    }

    resetMocks();
    console.log("🎭 MSW: Handlers reset via dev tools");
  },

  /**
   * Toggle MSW on/off
   */
  async toggle() {
    if (!import.meta.env.DEV) {
      console.warn("MSW dev tools are only available in development mode");
      return;
    }

    const { running } = this.getStatus();

    if (running) {
      this.stop();
    } else {
      await this.start();
    }
  },

  /**
   * Log current configuration
   */
  logConfig() {
    const status = this.getStatus();
    console.group("🎭 MSW Configuration");
    console.log("Enabled:", status.enabled);
    console.log("Running:", status.running);
    console.log("Config:", status.config);
    console.groupEnd();
  },
};

// Make MSW dev tools available globally in development
if (import.meta.env.DEV && typeof window !== "undefined") {
  (window as any).mswDevTools = mswDevTools;

  console.log(
    "🎭 MSW Dev Tools available at window.mswDevTools\n" +
      "Commands:\n" +
      "  - mswDevTools.getStatus() - Get current status\n" +
      "  - mswDevTools.start() - Start MSW\n" +
      "  - mswDevTools.stop() - Stop MSW\n" +
      "  - mswDevTools.toggle() - Toggle MSW on/off\n" +
      "  - mswDevTools.reset() - Reset handlers\n" +
      "  - mswDevTools.logConfig() - Log configuration"
  );
}
