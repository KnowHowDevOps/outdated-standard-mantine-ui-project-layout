import type { Meta, StoryObj } from "@storybook/react";

import { SampleFormFeature } from "./sample-form-feature";

const meta: Meta<typeof SampleFormFeature> = {
  title: "Features/SampleFormFeature",
  component: SampleFormFeature,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "This feature demonstrates a modal form using Mantine components with form validation, notifications, and modal interactions. It follows Feature-Sliced Design architecture with separated model and UI layers.",
      },
    },
  },
};
