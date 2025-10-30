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
  correlationId?: string;
  retryable?: boolean;
  cause?: unknown;
}

/**
 * RFC 9457 Problem Details structure (updated from RFC 7807)
 * @see https://www.rfc-editor.org/rfc/rfc9457.html
 */
export interface ProblemDetail {
  // Standard RFC 9457 members
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;

  // Common extension members (allowed by RFC 9457)
  code?: string | number;
  method?: string;
  correlationId?: string;
  requestId?: string;
  timestamp?: string;
  traceId?: string;

  // Validation-specific extensions
  fields?: Array<{
    field: string;
    rejectedValue?: any;
    message: string;
    code?: string;
  }>;
  violations?: Array<{
    field?: string;
    propertyPath?: string;
    message: string;
    code?: string;
    rejectedValue?: any;
  }>;

  // Additional extension members (RFC 9457 allows arbitrary extensions)
  [key: string]: any;
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

function extractCorrelationId(from: any): string | undefined {
  const headers = (from?.headers ?? {}) as Record<
    string,
    string | string[] | undefined
  >;
  const id = headers["x-correlation-id"] ?? headers["correlation-id"];
  if (Array.isArray(id)) {
    return id[0];
  }
  if (typeof id === "string") {
    return id;
  }
  return undefined;
}

/**
 * Checks if the response data follows RFC 9457 Problem Details format
 * More robust validation according to the specification
 */
function isProblemDetail(data: any): data is ProblemDetail {
  if (!data || typeof data !== "object") {
    return false;
  }

  // Must have at least one of the standard members
  const hasStandardMember =
    data.type !== undefined ||
    data.title !== undefined ||
    data.detail !== undefined ||
    data.status !== undefined ||
    data.instance !== undefined;

  if (!hasStandardMember) {
    return false;
  }

  // Validate types of standard members if present
  if (data.type !== undefined && typeof data.type !== "string") {
    return false;
  }
  if (data.title !== undefined && typeof data.title !== "string") {
    return false;
  }
  if (data.detail !== undefined && typeof data.detail !== "string") {
    return false;
  }
  if (data.status !== undefined && typeof data.status !== "number") {
    return false;
  }
  if (data.instance !== undefined && typeof data.instance !== "string") {
    return false;
  }

  return true;
}

/**
 * Extracts error code from various response formats according to RFC 9457
 */
function extractErrorCode(data: any, axiosCode?: string): string | undefined {
  // Direct code property (extension member)
  if (data?.code !== undefined) {
    return String(data.code);
  }

  // Extract from type URI according to RFC 9457 recommendations
  if (data?.type && typeof data.type === "string") {
    // Handle various URI formats
    const uriPatterns = [
      /^https?:\/\/[^/]+\/problems\/(.+)$/, // https://example.com/problems/validation-error
      /^urn:problem-type:(.+)$/, // urn:problem-type:validation-error
      /^urn:problem:(.+)$/, // urn:problem:validation_error (legacy)
      /^about:blank#(.+)$/, // about:blank#validation-error
    ];

    for (const pattern of uriPatterns) {
      const match = data.type.match(pattern);
      if (match) {
        return match[1].toUpperCase().replace(/[-_]/g, "_");
      }
    }

    // If it's just a simple identifier
    if (!data.type.includes("/") && !data.type.includes(":")) {
      return data.type.toUpperCase().replace(/[-_]/g, "_");
    }
  }

  return axiosCode;
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
        ? "Request timed out. Please try again."
        : "Network error. Please check your connection and try again.",
      code,
      cause: err,
      retryable: true,
      requestId: extractRequestId(ax),
    };
  }

  if (isAxios && ax.response) {
    const { status, data } = ax.response as { status: number; data: any };
    const hdrRequestId = extractRequestId(ax.response as any);
    const hdrCorrelationId = extractCorrelationId(ax.response as any);

    // Handle RFC 7807 Problem Details format
    if (isProblemDetail(data)) {
      return handleProblemDetail(
        data,
        status,
        hdrRequestId,
        hdrCorrelationId,
        err
      );
    }

    // Fallback to legacy error handling for non-RFC 7807 responses
    return handleLegacyError(
      data,
      status,
      ax,
      hdrRequestId,
      hdrCorrelationId,
      err
    );
  }

  // Non-axios or unknown error
  const anyErr = err as any;
  return {
    type: "unknown",
    message: anyErr?.message || "An unexpected error occurred",
    code: anyErr?.code,
    cause: err,
    retryable: false,
  };
}

/**
 * Handles RFC 9457 Problem Details responses
 */
function handleProblemDetail(
  data: ProblemDetail,
  status: number,
  requestId?: string,
  correlationId?: string,
  cause?: unknown
): AppError {
  const code = extractErrorCode(data);
  const type = determineErrorType(status, code);
  const retryable = isRetryableError(status, code);

  // Use RFC 9457 fields for message construction
  const message = constructProblemDetailMessage(data);

  return {
    type,
    message,
    status: status || data.status,
    code,
    details: data,
    requestId: requestId || data.requestId || data.traceId,
    correlationId: correlationId || data.correlationId,
    retryable,
    cause,
  };
}

/**
 * Handles legacy (non-RFC 7807) error responses
 */
function handleLegacyError(
  data: any,
  status: number,
  ax: AxiosError,
  requestId?: string,
  correlationId?: string,
  cause?: unknown
): AppError {
  const type = determineErrorType(status);
  const retryable = isRetryableError(status);

  // Try to extract message from various legacy formats
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
    data?.errors ?? data?.violations ?? data?.fields
  );

  const combinedMessage = errors.length
    ? `${message}. ${errors.join(", ")}`
    : message;

  return {
    type: errors.length && type === "client" ? "validation" : type,
    message: combinedMessage,
    status,
    code: extractErrorCode(data, ax.code),
    details: data,
    requestId,
    correlationId,
    retryable,
    cause,
  };
}

/**
 * Constructs user-friendly message from RFC 9457 Problem Details
 */
function constructProblemDetailMessage(data: ProblemDetail): string {
  // Start with title or detail according to RFC 9457 guidance
  let message = data.title || data.detail || "An error occurred";

  // Add field-specific errors if present (from fields array)
  if (data.fields && data.fields.length > 0) {
    const fieldMessages = data.fields.map((field) => {
      const fieldName = normalizeFieldKey(field.field);
      return `${fieldName}: ${field.message}`;
    });
    message += `. ${fieldMessages.join(", ")}`;
  }

  // Also handle violations array (common extension)
  if (data.violations && data.violations.length > 0) {
    const violationMessages = data.violations.map((violation) => {
      const rawFieldName = violation.field || violation.propertyPath || "field";
      const fieldName = normalizeFieldKey(rawFieldName);
      return `${fieldName}: ${violation.message}`;
    });

    if (data.fields && data.fields.length > 0) {
      message += `, ${violationMessages.join(", ")}`;
    } else {
      message += `. ${violationMessages.join(", ")}`;
    }
  }

  return message;
}

/**
 * Determines error type based on HTTP status and error code (RFC 9457 compliant)
 */
function determineErrorType(
  status: number,
  code?: string | number
): AppErrorType {
  // Check specific error codes first (more comprehensive patterns)
  if (code) {
    const codeStr = String(code).toUpperCase();

    // Authentication/Authorization patterns
    if (
      codeStr.includes("AUTH") ||
      codeStr.includes("UNAUTHORIZED") ||
      codeStr.includes("FORBIDDEN") ||
      codeStr.includes("TOKEN") ||
      codeStr.includes("CREDENTIAL")
    ) {
      return "auth";
    }

    // Validation patterns
    if (
      codeStr.includes("VALIDATION") ||
      codeStr.includes("INVALID") ||
      codeStr.includes("CONSTRAINT") ||
      codeStr.includes("FORMAT") ||
      codeStr.includes("REQUIRED") ||
      codeStr.includes("MALFORMED")
    ) {
      return "validation";
    }

    // Timeout patterns
    if (
      codeStr.includes("TIMEOUT") ||
      codeStr.includes("DEADLINE") ||
      codeStr.includes("EXPIRED")
    ) {
      return "timeout";
    }

    // Network patterns
    if (
      codeStr.includes("NETWORK") ||
      codeStr.includes("CONNECTION") ||
      codeStr.includes("UNREACHABLE")
    ) {
      return "network";
    }

    // Rate limiting patterns
    if (
      codeStr.includes("RATE") ||
      codeStr.includes("LIMIT") ||
      codeStr.includes("QUOTA") ||
      codeStr.includes("THROTTLE")
    ) {
      return "server"; // Rate limiting is server-side
    }
  }

  // Fallback to HTTP status codes (RFC 9457 compatible)
  if (status === 401) {
    return "auth"; // Unauthorized
  } else if (status === 403) {
    return "auth"; // Forbidden
  } else if (status === 400) {
    return "validation"; // Bad Request (often validation)
  } else if (status === 422) {
    return "validation"; // Unprocessable Entity
  } else if (status === 404) {
    return "client"; // Not Found
  } else if (status === 408) {
    return "timeout"; // Request Timeout
  } else if (status === 409) {
    return "client"; // Conflict
  } else if (status === 410) {
    return "client"; // Gone
  } else if (status === 413) {
    return "client"; // Payload Too Large
  } else if (status === 414) {
    return "client"; // URI Too Long
  } else if (status === 415) {
    return "client"; // Unsupported Media Type
  } else if (status === 429) {
    return "server"; // Too Many Requests (rate limiting)
  } else if (status >= 500 && status < 600) {
    return "server"; // Server errors
  } else if (status >= 400 && status < 500) {
    return "client"; // Other client errors
  }

  return "unknown";
}

/**
 * Determines if an error is retryable based on status and code (RFC 9457 compliant)
 */
function isRetryableError(status: number, code?: string | number): boolean {
  const codeStr = code ? String(code).toUpperCase() : "";

  // Explicitly non-retryable codes
  if (
    codeStr.includes("VALIDATION") ||
    codeStr.includes("INVALID") ||
    codeStr.includes("MALFORMED") ||
    codeStr.includes("UNAUTHORIZED") ||
    codeStr.includes("FORBIDDEN") ||
    codeStr.includes("NOT_FOUND") ||
    codeStr.includes("CONFLICT") ||
    codeStr.includes("GONE")
  ) {
    return false;
  }

  // Explicitly retryable codes
  if (
    codeStr.includes("TIMEOUT") ||
    codeStr.includes("NETWORK") ||
    codeStr.includes("CONNECTION") ||
    codeStr.includes("RATE") ||
    codeStr.includes("LIMIT") ||
    codeStr.includes("THROTTLE") ||
    codeStr.includes("UNAVAILABLE") ||
    codeStr.includes("OVERLOAD")
  ) {
    return true;
  }

  // Status-based retry logic (RFC 9457 compatible)
  switch (status) {
    // Retryable client errors
    case 408: // Request Timeout
    case 429: // Too Many Requests
      return true;

    // Non-retryable client errors
    case 400: // Bad Request
    case 401: // Unauthorized
    case 403: // Forbidden
    case 404: // Not Found
    case 405: // Method Not Allowed
    case 406: // Not Acceptable
    case 409: // Conflict
    case 410: // Gone
    case 411: // Length Required
    case 412: // Precondition Failed
    case 413: // Payload Too Large
    case 414: // URI Too Long
    case 415: // Unsupported Media Type
    case 416: // Range Not Satisfiable
    case 417: // Expectation Failed
    case 418: // I'm a teapot
    case 421: // Misdirected Request
    case 422: // Unprocessable Entity
    case 423: // Locked
    case 424: // Failed Dependency
    case 426: // Upgrade Required
    case 428: // Precondition Required
    case 431: // Request Header Fields Too Large
    case 451: // Unavailable For Legal Reasons
      return false;

    // Retryable server errors
    case 500: // Internal Server Error (sometimes retryable)
    case 502: // Bad Gateway
    case 503: // Service Unavailable
    case 504: // Gateway Timeout
    case 507: // Insufficient Storage
    case 508: // Loop Detected
    case 510: // Not Extended
    case 511: // Network Authentication Required
      return true;

    // Non-retryable server errors
    case 501: // Not Implemented
    case 505: // HTTP Version Not Supported
    case 506: // Variant Also Negotiates
    case 509: // Bandwidth Limit Exceeded
      return false;

    default:
      // Unknown status codes: retry server errors, don't retry client errors
      if (status >= 500) {
        return true;
      }
      return false;
  }
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
  const data = appErr.details;
  const out: FieldErrors = {};
  if (!data) {
    return out;
  }

  // RFC 9457 Problem Details fields array
  if (isProblemDetail(data) && data.fields) {
    for (const fieldError of data.fields) {
      const field = normalizeFieldKey(fieldError.field);
      if (field) {
        (out[field] = out[field] || []).push(fieldError.message);
      }
    }
  }

  // RFC 9457 Problem Details violations array (common extension)
  if (isProblemDetail(data) && data.violations) {
    for (const violation of data.violations) {
      const field = normalizeFieldKey(
        violation.field || violation.propertyPath || ""
      );
      if (field) {
        (out[field] = out[field] || []).push(violation.message);
      }
    }
  }

  // Legacy RFC7807-style violations: [{ field/propertyPath, message }]
  const violations = data?.violations as Array<Record<string, any>> | undefined;
  if (Array.isArray(violations)) {
    for (const v of violations) {
      const field = normalizeFieldKey(
        v?.field || v?.propertyPath || v?.name || ""
      );
      const msg =
        v?.message || v?.reason || v?.detail || v?.error || "Invalid value";
      if (!field) {
        continue;
      }
      (out[field] = out[field] || []).push(String(msg));
    }
  }

  // Legacy errors: { field: [messages] } or { field: "message" }
  const errorsObj = data?.errors as Record<string, unknown> | undefined;
  if (errorsObj && typeof errorsObj === "object" && !Array.isArray(errorsObj)) {
    for (const key of Object.keys(errorsObj)) {
      const field = normalizeFieldKey(key);
      const val = errorsObj[key];
      if (Array.isArray(val)) {
        (out[field] = out[field] || []).push(...val.map(String));
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
  let message = appErr.message || fallback;

  // Include reference ID for server/unknown errors to aid debugging
  const refId = appErr.correlationId || appErr.requestId;
  if (refId && (appErr.type === "server" || appErr.type === "unknown")) {
    message += ` (ref: ${refId})`;
  }

  return message;
}

/**
 * Gets a user-friendly error title based on error type
 */
export function getErrorTitle(err: unknown): string {
  const appErr = normalizeAxiosError(err);

  switch (appErr.type) {
    case "network":
      return "Connection Error";
    case "timeout":
      return "Request Timeout";
    case "auth":
      return "Authentication Error";
    case "validation":
      return "Validation Error";
    case "server":
      return "Server Error";
    case "client":
      return "Request Error";
    case "canceled":
      return "Request Canceled";
    default:
      return "Error";
  }
}

/**
 * Determines if an error should be shown to the user
 */
export function shouldShowError(err: unknown): boolean {
  const appErr = normalizeAxiosError(err);

  // Don't show canceled requests
  if (appErr.type === "canceled") {
    return false;
  }

  // Always show other errors
  return true;
}

/**
 * Gets retry configuration for an error (RFC 9457 compliant)
 */
export function getRetryConfig(err: unknown): {
  retryable: boolean;
  delay?: number;
  maxRetries?: number;
  backoffMultiplier?: number;
} {
  const appErr = normalizeAxiosError(err);

  if (!appErr.retryable) {
    return { retryable: false };
  }

  switch (appErr.type) {
    case "timeout":
      return {
        retryable: true,
        delay: 1000,
        maxRetries: 3,
        backoffMultiplier: 1.5,
      };
    case "network":
      return {
        retryable: true,
        delay: 2000,
        maxRetries: 2,
        backoffMultiplier: 2.0,
      };
    case "server":
      // Rate limiting gets longer delay and exponential backoff
      if (appErr.status === 429) {
        return {
          retryable: true,
          delay: 5000,
          maxRetries: 3,
          backoffMultiplier: 2.0,
        };
      }
      // Other server errors
      return {
        retryable: true,
        delay: 3000,
        maxRetries: 2,
        backoffMultiplier: 1.5,
      };
    default:
      return { retryable: false };
  }
}

/**
 * Creates a Problem Details object according to RFC 9457
 */
export function createProblemDetail(options: {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  code?: string | number;
  correlationId?: string;
  requestId?: string;
  fields?: Array<{
    field: string;
    message: string;
    code?: string;
    rejectedValue?: any;
  }>;
  extensions?: Record<string, any>;
}): ProblemDetail {
  const {
    type,
    title,
    status,
    detail,
    instance,
    code,
    correlationId,
    requestId,
    fields,
    extensions = {},
  } = options;

  const problemDetail: ProblemDetail = {
    ...(type && { type }),
    ...(title && { title }),
    ...(status && { status }),
    ...(detail && { detail }),
    ...(instance && { instance }),
    ...(code && { code }),
    ...(correlationId && { correlationId }),
    ...(requestId && { requestId }),
    ...(fields && fields.length > 0 && { fields }),
    timestamp: new Date().toISOString(),
    ...extensions,
  };

  return problemDetail;
}

/**
 * Validates a Problem Details object according to RFC 9457
 */
export function validateProblemDetail(data: any): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data || typeof data !== "object") {
    errors.push("Problem detail must be an object");
    return { valid: false, errors };
  }

  // Check required structure (at least one standard member)
  const hasStandardMember =
    data.type !== undefined ||
    data.title !== undefined ||
    data.detail !== undefined ||
    data.status !== undefined ||
    data.instance !== undefined;

  if (!hasStandardMember) {
    errors.push(
      "Problem detail must have at least one standard member (type, title, detail, status, or instance)"
    );
  }

  // Validate types
  if (data.type !== undefined && typeof data.type !== "string") {
    errors.push("'type' must be a string");
  }
  if (data.title !== undefined && typeof data.title !== "string") {
    errors.push("'title' must be a string");
  }
  if (data.detail !== undefined && typeof data.detail !== "string") {
    errors.push("'detail' must be a string");
  }
  if (data.status !== undefined && typeof data.status !== "number") {
    errors.push("'status' must be a number");
  }
  if (data.instance !== undefined && typeof data.instance !== "string") {
    errors.push("'instance' must be a string");
  }

  // Validate status code range
  if (data.status !== undefined && (data.status < 100 || data.status > 599)) {
    errors.push("'status' must be a valid HTTP status code (100-599)");
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Extracts extension members from a Problem Details object
 */
export function extractExtensionMembers(
  data: ProblemDetail
): Record<string, any> {
  const standardMembers = new Set([
    "type",
    "title",
    "status",
    "detail",
    "instance",
  ]);

  const extensions: Record<string, any> = {};

  for (const [key, value] of Object.entries(data)) {
    if (!standardMembers.has(key)) {
      extensions[key] = value;
    }
  }

  return extensions;
}
