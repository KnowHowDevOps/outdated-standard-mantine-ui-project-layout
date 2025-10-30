// Shared lib public API
export { queryClient } from "./query-client";
export { api } from "./client";
export { publicApi } from "./public-client";
export * from "./auth-token";
export { notificationService } from "./notifications";
export * from "./dates";
export * from "./helpers";
export * from "./string-helper";
export * from "./pagination";
export * from "./http-error";
export * from "./use-form-mutation";
export * from "./error-utils";
export * from "./use-error-handler";
export * from "./rfc9457-examples";

// MSW (Mock Service Worker) utilities - only available via direct import
// export * from "./msw"; // Commented out to prevent inclusion in production build
