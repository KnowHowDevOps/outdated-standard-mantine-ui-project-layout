import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { describe, expect, it } from "vitest";

import { SampleFormFeature } from "./sample-form-feature";

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MantineProvider>
    <Notifications />
    {children}
  </MantineProvider>
);

describe("SampleFormFeature", () => {
  it("renders the feature with title and description", () => {
    render(
      <TestWrapper>
        <SampleFormFeature />
      </TestWrapper>
    );

    expect(screen.getByText("Sample Form Feature")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Click the plus button to open a modal with a sample form/
      )
    ).toBeInTheDocument();
  });

  it("opens modal when plus button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <SampleFormFeature />
      </TestWrapper>
    );

    const plusButton = screen.getByRole("button");
    await user.click(plusButton);

    expect(screen.getByText("Sample Form")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("validates form fields", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <SampleFormFeature />
      </TestWrapper>
    );

    // Open modal
    const plusButton = screen.getByRole("button");
    await user.click(plusButton);

    // Try to submit empty form
    const submitButton = screen.getByRole("button", { name: /submit/i });
    await user.click(submitButton);

    expect(
      screen.getByText("Name must have at least 2 letters")
    ).toBeInTheDocument();
    expect(screen.getByText("Invalid email")).toBeInTheDocument();
  });
});
