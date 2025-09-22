import React from "react";
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconX,
  IconAlertTriangle,
  IconInfoCircle,
} from "@tabler/icons-react";

interface NotificationOptions {
  title?: string;
  message: string;
  autoClose?: number | false;
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
