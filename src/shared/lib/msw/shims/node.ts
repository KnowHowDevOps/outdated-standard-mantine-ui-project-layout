// Shim for `msw/node` in browser builds to avoid resolution errors during Vite production build.
// This should never be executed in runtime browser code; it's only here to satisfy bundler resolution.

export function setupServer(..._handlers: any[]) {
  return {
    listen: (_opts?: any) => {},
    close: () => {},
    resetHandlers: () => {},
    use: (..._newHandlers: any[]) => {},
  } as const;
}
