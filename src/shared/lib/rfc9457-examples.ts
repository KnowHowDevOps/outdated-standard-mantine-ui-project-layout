/**
 * RFC 9457 Problem Details Examples
 *
 * This file demonstrates how to create and handle RFC 9457 Problem Details
 * in various scenarios. These examples show best practices for both client
 * and server-side Problem Details usage.
 */

import {
  createProblemDetail,
  validateProblemDetail,
  type ProblemDetail,
} from "./http-error";

/**
 * Example 1: Basic validation error Problem Details
 */
export function createValidationErrorExample(): ProblemDetail {
  return createProblemDetail({
    type: "https://example.com/problems/validation-error",
    title: "Validation Error",
    status: 400,
    detail: "The request contains invalid or missing data",
    instance: "/api/users",
    code: "VALIDATION_ERROR",
    fields: [
      {
        field: "email",
        message: "Invalid email format",
        code: "INVALID_FORMAT",
        rejectedValue: "not-an-email",
      },
      {
        field: "age",
        message: "Age must be between 18 and 120",
        code: "OUT_OF_RANGE",
        rejectedValue: 15,
      },
    ],
  });
}

/**
 * Example 2: Authentication error Problem Details
 */
export function createAuthenticationErrorExample(): ProblemDetail {
  return createProblemDetail({
    type: "https://example.com/problems/authentication-required",
    title: "Authentication Required",
    status: 401,
    detail:
      "Valid authentication credentials are required to access this resource",
    instance: "/api/protected-resource",
    code: "AUTH_REQUIRED",
    extensions: {
      authMethods: ["Bearer", "Basic"],
      loginUrl: "https://example.com/login",
    },
  });
}

/**
 * Example 3: Rate limiting error Problem Details
 */
export function createRateLimitErrorExample(): ProblemDetail {
  return createProblemDetail({
    type: "https://example.com/problems/rate-limit-exceeded",
    title: "Rate Limit Exceeded",
    status: 429,
    detail: "Too many requests have been made in a short period",
    instance: "/api/data",
    code: "RATE_LIMIT_EXCEEDED",
    extensions: {
      retryAfter: 60,
      limit: 100,
      remaining: 0,
      resetTime: "2024-01-01T12:00:00Z",
    },
  });
}

/**
 * Example 4: Server error with trace information
 */
export function createServerErrorExample(): ProblemDetail {
  return createProblemDetail({
    type: "https://example.com/problems/internal-server-error",
    title: "Internal Server Error",
    status: 500,
    detail: "An unexpected error occurred while processing the request",
    instance: "/api/complex-operation",
    code: "INTERNAL_ERROR",
    extensions: {
      traceId: "trace-12345678-abcd-efgh",
      spanId: "span-87654321",
      errorId: "err-uuid-1234",
      supportContact: "support@example.com",
    },
  });
}

/**
 * Example 5: Business logic error Problem Details
 */
export function createBusinessLogicErrorExample(): ProblemDetail {
  return createProblemDetail({
    type: "https://example.com/problems/insufficient-funds",
    title: "Insufficient Funds",
    status: 422,
    detail: "The account does not have sufficient funds for this transaction",
    instance: "/api/transactions",
    code: "INSUFFICIENT_FUNDS",
    extensions: {
      accountBalance: 50.0,
      requestedAmount: 100.0,
      currency: "USD",
      accountId: "acc-12345",
    },
  });
}

/**
 * Example 6: Conflict error Problem Details
 */
export function createConflictErrorExample(): ProblemDetail {
  return createProblemDetail({
    type: "https://example.com/problems/resource-conflict",
    title: "Resource Conflict",
    status: 409,
    detail:
      "The resource cannot be updated due to a conflict with the current state",
    instance: "/api/documents/123",
    code: "RESOURCE_CONFLICT",
    extensions: {
      conflictReason: "Document has been modified by another user",
      lastModified: "2024-01-01T10:30:00Z",
      currentVersion: 5,
      requestedVersion: 3,
    },
  });
}

/**
 * Example 7: Multiple validation errors with nested structure
 */
export function createComplexValidationErrorExample(): ProblemDetail {
  return createProblemDetail({
    type: "https://example.com/problems/validation-error",
    title: "Validation Error",
    status: 400,
    detail: "Multiple validation errors occurred",
    instance: "/api/users",
    code: "VALIDATION_ERROR",
    fields: [
      {
        field: "profile.firstName",
        message: "First name is required",
        code: "REQUIRED_FIELD",
      },
      {
        field: "profile.lastName",
        message: "Last name must be at least 2 characters",
        code: "MIN_LENGTH",
        rejectedValue: "A",
      },
      {
        field: "contacts.email",
        message: "Invalid email format",
        code: "INVALID_FORMAT",
        rejectedValue: "invalid-email",
      },
      {
        field: "contacts.phone",
        message: "Phone number format is invalid",
        code: "INVALID_FORMAT",
        rejectedValue: "123",
      },
    ],
    extensions: {
      validationContext: "user-registration",
      strictMode: true,
    },
  });
}

/**
 * Example 8: Service unavailable with retry information
 */
export function createServiceUnavailableExample(): ProblemDetail {
  return createProblemDetail({
    type: "https://example.com/problems/service-unavailable",
    title: "Service Temporarily Unavailable",
    status: 503,
    detail: "The service is temporarily unavailable due to maintenance",
    instance: "/api/payment-processing",
    code: "SERVICE_UNAVAILABLE",
    extensions: {
      retryAfter: 300, // 5 minutes
      maintenanceWindow: {
        start: "2024-01-01T02:00:00Z",
        end: "2024-01-01T04:00:00Z",
      },
      alternativeEndpoint: "https://backup.example.com/api/payment-processing",
    },
  });
}

/**
 * Utility function to validate all examples
 */
export function validateAllExamples(): {
  example: string;
  valid: boolean;
  errors: string[];
}[] {
  const examples = [
    { name: "Validation Error", problemDetail: createValidationErrorExample() },
    {
      name: "Authentication Error",
      problemDetail: createAuthenticationErrorExample(),
    },
    { name: "Rate Limit Error", problemDetail: createRateLimitErrorExample() },
    { name: "Server Error", problemDetail: createServerErrorExample() },
    {
      name: "Business Logic Error",
      problemDetail: createBusinessLogicErrorExample(),
    },
    { name: "Conflict Error", problemDetail: createConflictErrorExample() },
    {
      name: "Complex Validation Error",
      problemDetail: createComplexValidationErrorExample(),
    },
    {
      name: "Service Unavailable",
      problemDetail: createServiceUnavailableExample(),
    },
  ];

  return examples.map(({ name, problemDetail }) => {
    const validation = validateProblemDetail(problemDetail);
    return {
      example: name,
      valid: validation.valid,
      errors: validation.errors,
    };
  });
}

/**
 * Example of how to handle Problem Details on the client side
 */
export function handleProblemDetailExample(problemDetail: ProblemDetail): void {
  console.log("Handling Problem Detail:", {
    type: problemDetail.type,
    title: problemDetail.title,
    status: problemDetail.status,
    detail: problemDetail.detail,
    code: problemDetail.code,
  });

  // Handle specific problem types
  switch (problemDetail.type) {
    case "https://example.com/problems/validation-error":
      console.log("Validation errors:", problemDetail.fields);
      break;
    case "https://example.com/problems/authentication-required":
      console.log("Redirect to login:", problemDetail.loginUrl);
      break;
    case "https://example.com/problems/rate-limit-exceeded":
      console.log("Retry after:", problemDetail.retryAfter, "seconds");
      break;
    case "https://example.com/problems/service-unavailable":
      console.log(
        "Try alternative endpoint:",
        problemDetail.alternativeEndpoint
      );
      break;
    default:
      console.log("Generic error handling");
  }
}

/**
 * Example of creating Problem Details for common HTTP status codes
 */
export const commonProblemDetails = {
  badRequest: (
    detail: string,
    fields?: Array<{ field: string; message: string }>
  ) =>
    createProblemDetail({
      type: "https://example.com/problems/bad-request",
      title: "Bad Request",
      status: 400,
      detail,
      fields,
    }),

  unauthorized: (detail: string = "Authentication required") =>
    createProblemDetail({
      type: "https://example.com/problems/unauthorized",
      title: "Unauthorized",
      status: 401,
      detail,
    }),

  forbidden: (detail: string = "Access denied") =>
    createProblemDetail({
      type: "https://example.com/problems/forbidden",
      title: "Forbidden",
      status: 403,
      detail,
    }),

  notFound: (resource: string) =>
    createProblemDetail({
      type: "https://example.com/problems/not-found",
      title: "Not Found",
      status: 404,
      detail: `The requested ${resource} was not found`,
    }),

  conflict: (detail: string) =>
    createProblemDetail({
      type: "https://example.com/problems/conflict",
      title: "Conflict",
      status: 409,
      detail,
    }),

  unprocessableEntity: (
    detail: string,
    fields?: Array<{ field: string; message: string }>
  ) =>
    createProblemDetail({
      type: "https://example.com/problems/unprocessable-entity",
      title: "Unprocessable Entity",
      status: 422,
      detail,
      fields,
    }),

  tooManyRequests: (retryAfter: number) =>
    createProblemDetail({
      type: "https://example.com/problems/too-many-requests",
      title: "Too Many Requests",
      status: 429,
      detail: "Rate limit exceeded",
      extensions: { retryAfter },
    }),

  internalServerError: (detail: string = "An internal server error occurred") =>
    createProblemDetail({
      type: "https://example.com/problems/internal-server-error",
      title: "Internal Server Error",
      status: 500,
      detail,
    }),

  serviceUnavailable: (retryAfter?: number) =>
    createProblemDetail({
      type: "https://example.com/problems/service-unavailable",
      title: "Service Unavailable",
      status: 503,
      detail: "The service is temporarily unavailable",
      extensions: retryAfter ? { retryAfter } : {},
    }),
};
