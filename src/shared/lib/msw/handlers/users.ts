import { http, HttpResponse } from "msw";
import { getMockConfig } from "../config";
import { createMockResponse, createMockError } from "../utils";

const config = getMockConfig();

// Mock users data
const mockUsers = [
  {
    id: "1",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    email: "user@example.com",
    name: "Regular User",
    role: "user",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
  },
  {
    id: "3",
    email: "john.doe@example.com",
    name: "John Doe",
    role: "user",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    createdAt: "2024-01-03T00:00:00Z",
    updatedAt: "2024-01-03T00:00:00Z",
  },
  {
    id: "4",
    email: "jane.smith@example.com",
    name: "Jane Smith",
    role: "moderator",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
    createdAt: "2024-01-04T00:00:00Z",
    updatedAt: "2024-01-04T00:00:00Z",
  },
];

/**
 * User-related mock handlers
 */
export const userHandlers = [
  // Get all users with pagination
  http.get(`${config.baseUrl}/users`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const search = url.searchParams.get("search") || "";
    const role = url.searchParams.get("role") || "";

    let filteredUsers = mockUsers;

    // Apply search filter
    if (search) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply role filter
    if (role) {
      filteredUsers = filteredUsers.filter((user) => user.role === role);
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return createMockResponse({
      data: paginatedUsers,
      pagination: {
        page,
        limit,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limit),
      },
    });
  }),

  // Get user by ID
  http.get(`${config.baseUrl}/users/:id`, ({ params }) => {
    const { id } = params;
    const user = mockUsers.find((u) => u.id === id);

    if (!user) {
      return createMockError({
        message: "User not found",
        status: 404,
        code: "USER_NOT_FOUND",
      });
    }

    return createMockResponse(user);
  }),

  // Create new user
  http.post(`${config.baseUrl}/users`, async ({ request }) => {
    const body = (await request.json()) as {
      email: string;
      name: string;
      role?: string;
    };

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === body.email);
    if (existingUser) {
      return createMockError({
        message: "User with this email already exists",
        status: 409,
        code: "USER_EXISTS",
      });
    }

    const newUser = {
      id: String(mockUsers.length + 1),
      email: body.email,
      name: body.name,
      role: body.role || "user",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${body.name}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);

    return createMockResponse(newUser, { status: 201 });
  }),

  // Update user
  http.put(`${config.baseUrl}/users/:id`, async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as {
      email?: string;
      name?: string;
      role?: string;
    };

    const userIndex = mockUsers.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      return createMockError({
        message: "User not found",
        status: 404,
        code: "USER_NOT_FOUND",
      });
    }

    // Check if email is being changed and already exists
    if (body.email && body.email !== mockUsers[userIndex].email) {
      const existingUser = mockUsers.find((u) => u.email === body.email);
      if (existingUser) {
        return createMockError({
          message: "User with this email already exists",
          status: 409,
          code: "USER_EXISTS",
        });
      }
    }

    const updatedUser = {
      ...mockUsers[userIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    mockUsers[userIndex] = updatedUser;

    return createMockResponse(updatedUser);
  }),

  // Delete user
  http.delete(`${config.baseUrl}/users/:id`, ({ params }) => {
    const { id } = params;
    const userIndex = mockUsers.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return createMockError({
        message: "User not found",
        status: 404,
        code: "USER_NOT_FOUND",
      });
    }

    mockUsers.splice(userIndex, 1);

    return createMockResponse({ message: "User deleted successfully" });
  }),
];
