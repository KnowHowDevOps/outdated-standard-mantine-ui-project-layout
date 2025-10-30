import { Alert, Button, Container, Stack, Title } from "@mantine/core";
import { IconAlertCircle, IconRefresh } from "@tabler/icons-react";
import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?:
    | ReactNode
    | ((error: Error, errorInfo: ErrorInfo, retry: () => void) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({ errorInfo });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private retry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        // If fallback is a function, call it with error details
        if (typeof this.props.fallback === "function") {
          return this.props.fallback(
            this.state.error,
            this.state.errorInfo || ({} as ErrorInfo),
            this.retry
          );
        }
        // Otherwise, render the fallback ReactNode directly
        return this.props.fallback;
      }

      return (
        <Container size="sm" py="xl">
          <Stack align="center" gap="lg">
            <Title order={2}>Something went wrong</Title>

            <Alert
              icon={<IconAlertCircle size="1rem" />}
              title="Application Error"
              color="red"
              variant="light"
            >
              {this.state.error?.message || "An unexpected error occurred"}
            </Alert>

            <Button
              leftSection={<IconRefresh size="1rem" />}
              onClick={this.retry}
            >
              Try Again
            </Button>
          </Stack>
        </Container>
      );
    }

    return this.props.children;
  }
}
