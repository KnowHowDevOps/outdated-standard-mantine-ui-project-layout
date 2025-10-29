import React from "react";
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconX,
  IconAlertTriangle,
  IconInfoCircle,
  IconWifi,
  IconClock,
  IconShield,
  IconExclamationMark,
} from "@tabler/icons-react";
import {
  normalizeAxiosError,
  getErrorMessage,
  getErrorTitle,
  shouldShowError,
  type AppError,
  type AppErrorType,
  type ProblemDetail,
} from "./http-error";

interface NotificationOptions {
  title?: string;
  message: string;
  autoClose?: number | false;
}

interface ErrorNotificationOptions {
  title?: string;
  autoClose?: number | false;
  showRetryButton?: boolean;
  onRetry?: () => void;
}

/**
 * Gets appropriate icon for error type
 */
function getErrorIcon(errorType: AppErrorType): React.ReactNode {
  switch (errorType) {
    case "network":
      return <IconWifi size="1rem" />;
    case "timeout":
      return <IconClock size="1rem" />;
    case "auth":
      return <IconShield size="1rem" />;
    case "validation":
      return <IconExclamationMark size="1rem" />;
    case "server":
    case "client":
    case "unknown":
    default:
      return <IconX size="1rem" />;
  }
}

/**
 * Gets appropriate color for error type
 */
function getErrorColor(errorType: AppErrorType): string {
  switch (errorType) {
    case "network":
    case "timeout":
      return "orange";
    case "auth":
      return "grape";
    case "validation":
      return "yellow";
    case "server":
    case "client":
    case "unknown":
    default:
      return "red";
  }
}

/**
 * Gets appropriate auto-close duration for error type
 */
function getErrorAutoClose(errorType: AppErrorType): number | false {
  switch (errorType) {
    case "network":
    case "timeout":
      return 8000; // Longer for network issues
    case "validation":
      return false; // Keep validation errors visible
    case "auth":
      return 10000; // Longer for auth issues
    case "server":
      return 8000;
    default:
      return 6000;
  }
}

/**
 * Formats Problem Details for display in notifications
 */
function formatProblemDetailForNotification(appError: AppError): {
  title: string;
  message: string;
} {
  const problemDetail = appError.details as ProblemDetail;

  if (!problemDetail) {
    return {
      title: getErrorTitle(appError),
      message: appError.message,
    };
  }

  // Use Problem Details title if available
  const title = problemDetail.title || getErrorTitle(appError);

  // Construct message from Problem Details
  let message = problemDetail.detail || appError.message;

  // Add reference information for debugging
  const refId = appError.correlationId || appError.requestId;
  if (refId && (appError.type === "server" || appError.type === "unknown")) {
    message += ` (ref: ${refId})`;
  }

  return { title, message };
}

export const notificationService = {
  success: ({
    title = "Success",
    message,
    autoClose = 4000,
  }: NotificationOptions) => {
    notifications.show({
      title,
      message,
      color: "green",
      icon: <IconCheck size="1rem" />,
      autoClose,
    });
  },

  error: ({
    title = "Error",
    message,
    autoClose = 6000,
  }: NotificationOptions) => {
    notifications.show({
      title,
      message,
      color: "red",
      icon: <IconX size="1rem" />,
      autoClose,
    });
  },

  /**
   * Enhanced error notification that handles axios errors with RFC 9457 Problem Details support
   */
  errorFromAxios: (error: unknown, options: ErrorNotificationOptions = {}) => {
    const appError = normalizeAxiosError(error);

    // Don't show notification for canceled requests
    if (!shouldShowError(error)) {
      return;
    }

    const { title: defaultTitle, message: defaultMessage } =
      formatProblemDetailForNotification(appError);
    const title = options.title || defaultTitle;
    const message = defaultMessage;
    const autoClose = options.autoClose ?? getErrorAutoClose(appError.type);
    const color = getErrorColor(appError.type);
    const icon = getErrorIcon(appError.type);

    const notificationId = `error-${Date.now()}`;

    notifications.show({
      id: notificationId,
      title,
      message,
      color,
      icon,
      autoClose,
      withCloseButton: true,
      // Add retry action for retryable errors
      ...(appError.retryable &&
        options.onRetry && {
          action: {
            label: "Retry",
            onClick: () => {
              notifications.hide(notificationId);
              options.onRetry?.();
            },
          },
        }),
    });

    return notificationId;
  },

  warning: ({
    title = "Warning",
    message,
    autoClose = 5000,
  }: NotificationOptions) => {
    notifications.show({
      title,
      message,
      color: "yellow",
      icon: <IconAlertTriangle size="1rem" />,
      autoClose,
    });
  },

  info: ({
    title = "Info",
    message,
    autoClose = 4000,
  }: NotificationOptions) => {
    notifications.show({
      title,
      message,
      color: "blue",
      icon: <IconInfoCircle size="1rem" />,
      autoClose,
    });
  },

  loading: ({
    title = "Loading",
    message,
  }: Omit<NotificationOptions, "autoClose">) => {
    return notifications.show({
      id: "loading",
      title,
      message,
      loading: true,
      autoClose: false,
      withCloseButton: false,
    });
  },

  updateLoading: (
    id: string,
    {
      title,
      message,
      type = "success",
    }: NotificationOptions & { type?: "success" | "error" }
  ) => {
    const config = {
      success: { color: "green", icon: <IconCheck size="1rem" /> },
      error: { color: "red", icon: <IconX size="1rem" /> },
    };

    notifications.update({
      id,
      title,
      message,
      loading: false,
      autoClose: 4000,
      ...config[type],
    });
  },

  hide: (id: string) => {
    notifications.hide(id);
  },

  clean: () => {
    notifications.clean();
  },
};
