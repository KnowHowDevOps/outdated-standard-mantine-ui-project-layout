import axios, { AxiosError } from "axios";

export type AppErrorType =
  | "network"
  | "timeout"
  | "canceled"
  | "auth"
  | "validation"
  | "client"
  | "server"
  | "unknown";

export interface AppError {
  type: AppErrorType;
  message: string;
  status?: number;
  code?: string | number;
  details?: any;
  requestId?: string;
  retryable?: boolean;
  cause?: unknown;
}

function extractRequestId(from: any): string | undefined {
  const headers = (from?.headers ?? {}) as Record<
    string,
    string | string[] | undefined
  >;
  const id =
    headers["x-request-id"] ??
    headers["x-correlation-id"] ??
    headers.traceparent ??
    headers["x-amzn-trace-id"] ??
    undefined;
  if (Array.isArray(id)) {
    return id[0];
  }
  if (typeof id === "string") {
    return id;
  }
  return undefined;
}

function flattenValidationErrors(errors: any): string[] {
  if (!errors) {
    return [];
  }
  // If array of messages
  if (Array.isArray(errors)) {
    return errors.map(String);
  }
  // If object of field -> [messages]
  if (typeof errors === "object") {
    const out: string[] = [];
    for (const key of Object.keys(errors)) {
      const val = (errors as any)[key];
      if (Array.isArray(val)) {
        out.push(...val.map(String));
      } else if (typeof val === "string") {
        out.push(val);
      } else if (val && typeof val === "object") {
        out.push(...flattenValidationErrors(val));
      }
    }
    return out;
  }
  return [String(errors)];
}

export function normalizeAxiosError(err: unknown): AppError {
  // Axios cancellation
  if (axios.isCancel(err)) {
    return {
      type: "canceled",
      message: "Request was canceled",
      code: (err as any)?.code,
      cause: err,
      retryable: false,
    };
  }

  const isAxios = axios.isAxiosError(err);
  const ax = err as AxiosError;

  // Network or timeout
  if (isAxios && !ax.response) {
    const code = ax.code;
    const isTimeout =
      code === "ECONNABORTED" || /timeout/i.test(ax.message || "");
    return {
      type: isTimeout ? "timeout" : "network",
      message: isTimeout
        ? "Request timed out"
        : "Network error. Please check your connection",
      code,
      cause: err,
      retryable: true,
      requestId: extractRequestId(ax),
    };
  }

  if (isAxios && ax.response) {
    const { status, data } = ax.response as { status: number; data: any };
    const hdrRequestId = extractRequestId(ax.response as any);

    // Try to extract common shapes: Spring Boot, RFC7807, OAuth2, custom
    const message =
      (typeof data === "string" ? data : undefined) ??
      data?.message ??
      data?.detail ??
      data?.error_description ??
      data?.error ??
      data?.title ??
      ax.message ??
      "Request failed";

    const errors = flattenValidationErrors(
      (data as any)?.errors ?? (data as any)?.violations
    );

    let type: AppErrorType = "unknown";
    let retryable = false;
    if (status === 401 || status === 403) {
      type = "auth";
    } else if (status === 400 || status === 422) {
      type = errors.length ? "validation" : "client";
    } else if (status === 404) {
      type = "client";
    } else if (status === 408) {
      type = "timeout";
      retryable = true;
    } else if (status === 429) {
      type = "server";
      retryable = true;
    } else if (status >= 500) {
      type = "server";
      retryable = true;
    } else if (status >= 400) {
      type = "client";
    }

    const combinedMessage = errors.length
      ? `${message}: ${errors.join(", ")}`
      : message;

    return {
      type,
      message: combinedMessage,
      status,
      code: (data?.code as any) ?? ax.code,
      details: data,
      requestId: hdrRequestId,
      retryable,
      cause: err,
    };
  }

  // Non-axios or unknown error
  const anyErr = err as any;
  return {
    type: "unknown",
    message: anyErr?.message || "Unexpected error",
    code: anyErr?.code,
    cause: err,
    retryable: false,
  };
}

export type FieldErrors = Record<string, string[]>;

function normalizeFieldKey(key: string): string {
  if (!key) {
    return key;
  }
  // Convert propertyPath like "user.email" -> "email"
  const parts = key.split(".");
  const last = parts[parts.length - 1];
  // Unify common backend variants to our snake_case form field names
  if (last === "passwordConfirmation" || last === "password-confirmation") {
    return "password_confirmation";
  }
  return last;
}

export function getFieldErrors(err: unknown): FieldErrors {
  const appErr = normalizeAxiosError(err);
  const data = (appErr as any).details;
  const out: FieldErrors = {};
  if (!data) {
    return out;
  }

  // RFC7807-style violations: [{ field/propertyPath, message }]
  const violations = (data as any)?.violations as Array<any> | undefined;
  if (Array.isArray(violations)) {
    for (const v of violations) {
      const field = normalizeFieldKey(
        (v as any)?.field || (v as any)?.propertyPath || (v as any)?.name || ""
      );
      const msg =
        (v as any)?.message ||
        (v as any)?.reason ||
        (v as any)?.detail ||
        (v as any)?.error ||
        "Invalid value";
      if (!field) {
        continue;
      }
      (out[field] = out[field] || []).push(String(msg));
    }
  }

  // errors: { field: [messages] } or { field: "message" }
  const errorsObj = (data as any)?.errors as
    | Record<string, unknown>
    | undefined;
  if (errorsObj && typeof errorsObj === "object" && !Array.isArray(errorsObj)) {
    for (const key of Object.keys(errorsObj)) {
      const field = normalizeFieldKey(key);
      const val = (errorsObj as Record<string, unknown>)[key];
      if (Array.isArray(val)) {
        (out[field] = out[field] || []).push(...(val as unknown[]).map(String));
      } else if (val != null) {
        (out[field] = out[field] || []).push(String(val));
      }
    }
  }

  return out;
}

export function toMantineErrors(err: unknown): Record<string, string> {
  const map = getFieldErrors(err);
  const res: Record<string, string> = {};
  for (const k of Object.keys(map)) {
    if (map[k] && map[k].length) {
      res[k] = map[k][0];
    }
  }
  return res;
}

export function getErrorMessage(
  err: unknown,
  fallback = "Something went wrong"
): string {
  const appErr = normalizeAxiosError(err);
  // Optionally include request id for server/unknown cases to aid debugging
  if (
    appErr.requestId &&
    (appErr.type === "server" || appErr.type === "unknown")
  ) {
    return `${appErr.message} (ref: ${appErr.requestId})`;
  }
  return appErr.message || fallback;
}
