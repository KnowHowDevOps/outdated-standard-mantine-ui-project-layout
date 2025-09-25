import { modals } from "@mantine/modals";
import { t } from "@lingui/core/macro";

export interface OpenConfirmOptions {
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColor?: string;
  danger?: boolean;
  onConfirm: () => void | Promise<void>;
}

export function openConfirm({
  title = t`Confirm Action`,
  message = t`Are you sure you want to proceed?`,
  confirmLabel = t`Confirm`,
  cancelLabel = t`Cancel`,
  confirmColor = "blue",
  danger = false,
  onConfirm,
}: OpenConfirmOptions) {
  return modals.openConfirmModal({
    title,
    children: message,
    labels: { confirm: confirmLabel, cancel: cancelLabel },
    confirmProps: { color: danger ? "red" : confirmColor },
    onConfirm,
  });
}
