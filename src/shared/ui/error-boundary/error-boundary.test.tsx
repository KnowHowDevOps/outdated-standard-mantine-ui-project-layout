import {
  describe,
  it,
  expect,
  beforeEach,
  beforeAll,
  afterAll,
  vi,
} from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MantineProvider } from "@mantine/core";
import { ErrorBoundary } from "./error-boundary";

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MantineProvider>{children}</MantineProvider>
);

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test error message");
  }
  return <div>No error</div>;
};

// Mock window.location.reload
const mockReload = vi.fn();
Object.defineProperty(window, "location", {
  value: {
    reload: mockReload,
  },
  writable: true,
});

// Mock console.error to avoid noise in tests
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = vi.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe("ErrorBoundary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children when there is no error", () => {
    render(
      <TestWrapper>
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      </TestWrapper>
    );

    expect(screen.getByText("No error")).toBeInTheDocument();
  });

  it("renders error UI when child component throws", () => {
    render(
      <TestWrapper>
        <ErrorBoundary>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      </TestWrapper>
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Application Error")).toBeInTheDocument();
    expect(screen.getByText("Test error message")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /try again/i })
    ).toBeInTheDocument();
  });

  it("renders custom fallback when provided", () => {
    const customFallback = <div>Custom error fallback</div>;

    render(
      <TestWrapper>
        <ErrorBoundary fallback={customFallback}>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      </TestWrapper>
    );

    expect(screen.getByText("Custom error fallback")).toBeInTheDocument();
    expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
  });

  it("displays generic message when error has no message", () => {
    const ThrowErrorWithoutMessage = () => {
      throw new Error();
    };

    render(
      <TestWrapper>
        <ErrorBoundary>
          <ThrowErrorWithoutMessage />
        </ErrorBoundary>
      </TestWrapper>
    );

    expect(
      screen.getByText("An unexpected error occurred")
    ).toBeInTheDocument();
  });

  it("resets error state when try again button is clicked", async () => {
    const user = userEvent.setup();
    let shouldThrow = true;

    function ConditionalThrowError() {
      if (shouldThrow) {
        throw new Error("Test error message");
      }
      return <div>Component rendered successfully</div>;
    }

    render(
      <TestWrapper>
        <ErrorBoundary>
          <ConditionalThrowError />
        </ErrorBoundary>
      </TestWrapper>
    );

    // Verify error UI is shown
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();

    // Stop throwing error
    shouldThrow = false;

    const retryButton = screen.getByRole("button", { name: /try again/i });
    await user.click(retryButton);

    // After clicking retry, the component should render successfully
    expect(
      screen.getByText("Component rendered successfully")
    ).toBeInTheDocument();
    expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
  });

  it("logs error to console", () => {
    render(
      <TestWrapper>
        <ErrorBoundary>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      </TestWrapper>
    );

    expect(console.error).toHaveBeenCalledWith(
      "Error caught by boundary:",
      expect.any(Error),
      expect.any(Object)
    );
  });
});
