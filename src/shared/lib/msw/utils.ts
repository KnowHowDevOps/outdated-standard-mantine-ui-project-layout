import { HttpResponse } from "msw";
import { getMockConfig } from "./config";
import type { MockResponse, MockError } from "./types";

const config = getMockConfig();

/**
 * Create a mock HTTP response with consistent formatting
 */
export function createMockResponse<T = any>(
  data: T,
  options: {
    status?: number;
    headers?: Record<string, string>;
  } = {}
): HttpResponse {
  const { status = 200, headers = {} } = options;

  // Add delay if configured
  if (config.delay && config.delay !== "real") {
    const delay =
      typeof config.delay === "number"
        ? config.delay
        : Math.random() * (config.delay.max - config.delay.min) +
          config.delay.min;

    // Note: MSW v2 handles delays differently, this is for demonstration
    // In practice, you might want to use setTimeout or MSW's built-in delay
  }

  // Log the mock response if logging is enabled
  if (config.logging) {
    console.log(`🎭 MSW Mock Response (${status}):`, data);
  }

  return HttpResponse.json(data, {
    status,
    headers: {
      "Content-Type": "application/json",
      "X-Mock-Response": "true",
      ...headers,
    },
  });
}

/**
 * Create a mock HTTP error response with RFC 9457 Problem Details format
 */
export function createMockError(error: MockError): HttpResponse {
  const { message, status, code, type } = error;

  const problemDetails = {
    type: type || `https://example.com/problems/${code || "generic-error"}`,
    title: getStatusText(status),
    status,
    detail: message,
    instance: `/api/error/${Date.now()}`,
    ...(code && { code }),
    timestamp: new Date().toISOString(),
  };

  // Log the mock error if logging is enabled
  if (config.logging) {
    console.error(`🎭 MSW Mock Error (${status}):`, problemDetails);
  }

  return HttpResponse.json(problemDetails, {
    status,
    headers: {
      "Content-Type": "application/problem+json",
      "X-Mock-Response": "true",
    },
  });
}

/**
 * Get HTTP status text for a given status code
 */
function getStatusText(status: number): string {
  const statusTexts: Record<number, string> = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    409: "Conflict",
    422: "Unprocessable Entity",
    500: "Internal Server Error",
    502: "Bad Gateway",
    503: "Service Unavailable",
  };

  return statusTexts[status] || "Unknown Error";
}

/**
 * Create a delayed response (useful for testing loading states)
 */
export function createDelayedResponse<T>(
  data: T,
  delay: number,
  options?: { status?: number; headers?: Record<string, string> }
): Promise<HttpResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(createMockResponse(data, options));
    }, delay);
  });
}

/**
 * Generate mock pagination metadata
 */
export function createPaginationMeta(
  page: number,
  limit: number,
  total: number
) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1,
  };
}

/**
 * Generate a random ID for mock data
 */
export function generateMockId(): string {
  return `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Simulate network conditions (slow, fast, offline)
 */
export function simulateNetworkCondition(
  condition: "slow" | "fast" | "offline" = "fast"
) {
  const delays = {
    fast: 50,
    slow: 2000,
    offline: Infinity,
  };

  return delays[condition];
}
