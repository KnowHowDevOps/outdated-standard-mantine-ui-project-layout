import { StrictMode } from "react";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRouter, RouterProvider } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "../routeTree.gen";
import { theme } from "./theme";
import { queryClient } from "../shared/lib";
import { AuthSessionProvider } from "../processes/auth-session";
import { ErrorBoundary } from "../shared/ui";

// Import Mantine styles
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  return (
    <StrictMode>
      <ErrorBoundary>
        <MantineProvider theme={theme}>
          <Notifications />
          <QueryClientProvider client={queryClient}>
            <AuthSessionProvider>
              <RouterProvider router={router} />
              <ReactQueryDevtools initialIsOpen={false} />
            </AuthSessionProvider>
          </QueryClientProvider>
        </MantineProvider>
      </ErrorBoundary>
    </StrictMode>
  );
}
