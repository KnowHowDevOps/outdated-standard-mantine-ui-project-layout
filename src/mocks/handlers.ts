import { http, HttpResponse } from "msw";
import type { User } from "@/schemas/user";

// Mock data
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    status: "active",
    avatar:
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "user",
    status: "active",
    avatar:
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "user",
    status: "inactive",
    avatar:
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "4",
    name: "Alice Cooper",
    email: "alice@example.com",
    role: "moderator",
    status: "active",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david@example.com",
    role: "user",
    status: "suspended",
    avatar:
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
];

export const handlers = [
  // Get all users with pagination and filtering
  http.get("*/users", ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const search = url.searchParams.get("search");
    const role = url.searchParams.get("role");
    const status = url.searchParams.get("status");

    let filteredUsers = [...mockUsers];

    // Apply filters
    if (search) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (role) {
      filteredUsers = filteredUsers.filter((user) => user.role === role);
    }

    if (status) {
      filteredUsers = filteredUsers.filter((user) => user.status === status);
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const users = filteredUsers.slice(startIndex, endIndex);

    return HttpResponse.json({
      users,
      total: filteredUsers.length,
      page,
      limit,
    });
  }),

  // Get single user
  http.get("*/users/:id", ({ params }) => {
    const { id } = params;
    const user = mockUsers.find((u) => u.id === id);

    if (!user) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(user);
  }),

  // Create user
  http.post("*/users", async ({ request }) => {
    const userData = (await request.json()) as Omit<
      User,
      "id" | "createdAt" | "updatedAt"
    >;

    const newUser: User = {
      ...userData,
      id: String(mockUsers.length + 1),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);
    return HttpResponse.json(newUser, { status: 201 });
  }),

  // Update user
  http.patch("*/users/:id", async ({ params, request }) => {
    const { id } = params;
    const updateData = (await request.json()) as Partial<User>;

    const userIndex = mockUsers.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    const updatedUser = {
      ...mockUsers[userIndex],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    mockUsers[userIndex] = updatedUser;
    return HttpResponse.json(updatedUser);
  }),

  // Delete user
  http.delete("*/users/:id", ({ params }) => {
    const { id } = params;
    const userIndex = mockUsers.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    mockUsers.splice(userIndex, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  // Health check endpoint
  http.get("*/health", () => {
    return HttpResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      services: {
        database: "healthy",
        cache: "healthy",
        auth: "healthy",
      },
    });
  }),
];
