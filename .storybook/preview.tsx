import type { Preview } from "@storybook/react";
import { MantineProvider } from "@mantine/core";
import { initialize, mswLoader } from "msw-storybook-addon";
import { handlers } from "../src/shared/lib/msw/handlers";

// Import Mantine styles
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

// Initialize MSW for Storybook
initialize({
  onUnhandledRequest: "bypass",
});

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    msw: {
      handlers,
    },
  },
  decorators: [
    (Story) => (
      <MantineProvider>
        <Story />
      </MantineProvider>
    ),
  ],
  loaders: [mswLoader],
};

export default preview;
