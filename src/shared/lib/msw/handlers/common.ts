import { http, HttpResponse } from "msw";
import { getMockConfig } from "../config";
import { createMockResponse, createMockError } from "../utils";

const config = getMockConfig();

/**
 * Common API mock handlers (health checks, etc.)
 */
export const commonHandlers = [
  // Health check endpoint
  http.get(`${config.baseUrl}/health`, () => {
    return createMockResponse({
      status: "ok",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      environment: config.environment,
    });
  }),

  // API version endpoint
  http.get(`${config.baseUrl}/version`, () => {
    return createMockResponse({
      version: "1.0.0",
      buildDate: "2024-01-01T00:00:00Z",
      commit: "mock-commit-hash",
    });
  }),

  // Generic error simulation endpoint (for testing error handling)
  http.get(`${config.baseUrl}/simulate-error/:status`, ({ params }) => {
    const status = parseInt(params.status as string, 10);

    const errorMessages: Record<number, string> = {
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

    return createMockError({
      message: errorMessages[status] || "Unknown Error",
      status,
      code: `ERROR_${status}`,
    });
  }),

  // File upload simulation
  http.post(`${config.baseUrl}/upload`, async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return createMockError({
        message: "No file provided",
        status: 400,
        code: "NO_FILE",
      });
    }

    // Simulate file processing
    return createMockResponse({
      id: `file-${Date.now()}`,
      filename: file.name,
      size: file.size,
      type: file.type,
      url: `https://example.com/files/file-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    });
  }),

  // Search endpoint (generic)
  http.get(`${config.baseUrl}/search`, ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get("q") || "";
    const type = url.searchParams.get("type") || "all";

    if (!query) {
      return createMockError({
        message: "Search query is required",
        status: 400,
        code: "MISSING_QUERY",
      });
    }

    // Mock search results
    const results = [
      {
        id: "1",
        type: "user",
        title: "John Doe",
        description: "Regular user account",
        url: "/users/1",
      },
      {
        id: "2",
        type: "document",
        title: "API Documentation",
        description: "Complete API reference guide",
        url: "/docs/api",
      },
      {
        id: "3",
        type: "article",
        title: "Getting Started Guide",
        description: "Learn how to use the platform",
        url: "/articles/getting-started",
      },
    ]
      .filter((result) => type === "all" || result.type === type)
      .filter(
        (result) =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.description.toLowerCase().includes(query.toLowerCase())
      );

    return createMockResponse({
      query,
      type,
      results,
      total: results.length,
    });
  }),
];
