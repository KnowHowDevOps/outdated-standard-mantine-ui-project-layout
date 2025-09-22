import React from "react";

import { createRootRoute, Outlet } from "@tanstack/react-router";

import { AppLayout } from "../shared/ui/app-layout";

const env = import.meta.env;
const TanStackRouterDevtools =
  env.NODE_ENV === "production"
    ? () => null // Render nothing in production
    : React.lazy(() =>
        // Lazy load in development
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        }))
      );

function RootComponent() {
  return (
    <AppLayout>
      <Outlet />
      <TanStackRouterDevtools />
    </AppLayout>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
