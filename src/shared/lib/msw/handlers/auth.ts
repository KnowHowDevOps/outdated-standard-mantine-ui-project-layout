import { http, HttpResponse } from "msw";
import { getMockConfig } from "../config";
import { createMockResponse, createMockError } from "../utils";

const config = getMockConfig();

/**
 * Authentication-related mock handlers
 */
export const authHandlers = [
  // Login endpoint
  http.post(`${config.baseUrl}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };

    // Simulate authentication logic
    if (body.email === "admin@example.com" && body.password === "password") {
      return createMockResponse({
        user: {
          id: "1",
          email: "admin@example.com",
          name: "Admin User",
          role: "admin",
        },
        token: "mock-jwt-token-12345",
        refreshToken: "mock-refresh-token-67890",
      });
    }

    if (body.email === "user@example.com" && body.password === "password") {
      return createMockResponse({
        user: {
          id: "2",
          email: "user@example.com",
          name: "Regular User",
          role: "user",
        },
        token: "mock-jwt-token-54321",
        refreshToken: "mock-refresh-token-09876",
      });
    }

    return createMockError({
      message: "Invalid credentials",
      status: 401,
      code: "INVALID_CREDENTIALS",
    });
  }),

  // Logout endpoint
  http.post(`${config.baseUrl}/auth/logout`, () => {
    return createMockResponse({ message: "Logged out successfully" });
  }),

  // Refresh token endpoint
  http.post(`${config.baseUrl}/auth/refresh`, async ({ request }) => {
    const body = (await request.json()) as { refreshToken: string };

    if (body.refreshToken?.startsWith("mock-refresh-token")) {
      return createMockResponse({
        token: `mock-jwt-token-refreshed-${Date.now()}`,
        refreshToken: `mock-refresh-token-refreshed-${Date.now()}`,
      });
    }

    return createMockError({
      message: "Invalid refresh token",
      status: 401,
      code: "INVALID_REFRESH_TOKEN",
    });
  }),

  // Get current user
  http.get(`${config.baseUrl}/auth/me`, ({ request }) => {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return createMockError({
        message: "Unauthorized",
        status: 401,
        code: "UNAUTHORIZED",
      });
    }

    // Mock user based on token
    const token = authHeader.replace("Bearer ", "");
    if (token.includes("12345")) {
      return createMockResponse({
        id: "1",
        email: "admin@example.com",
        name: "Admin User",
        role: "admin",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
      });
    }

    if (token.includes("54321") || token.includes("refreshed")) {
      return createMockResponse({
        id: "2",
        email: "user@example.com",
        name: "Regular User",
        role: "user",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
      });
    }

    return createMockError({
      message: "Invalid token",
      status: 401,
      code: "INVALID_TOKEN",
    });
  }),
];
