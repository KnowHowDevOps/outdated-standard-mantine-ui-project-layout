import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...handlers);

// Start the worker in development mode
if (import.meta.env.DEV) {
  worker.start({
    onUnhandledRequest: "warn",
  });
}
