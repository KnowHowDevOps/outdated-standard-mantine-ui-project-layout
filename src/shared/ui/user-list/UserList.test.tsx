import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";
import { http, HttpResponse } from "msw";
import { addMockHandlers } from "@/shared/lib/msw";
import { UserList } from "./UserList";

// Create a fresh query client for each test
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

// Test wrapper component
function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = createTestQueryClient();
  return (
    <MantineProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MantineProvider>
  );
}

describe("UserList", () => {
  it("renders loading state initially", () => {
    render(
      <TestWrapper>
        <UserList />
      </TestWrapper>
    );

    expect(screen.getByText("Loading users...")).toBeInTheDocument();
  });

  it("renders users when data is loaded", async () => {
    // Add custom mock handler for this test
    addMockHandlers(
      http.get("/api/users", () => {
        return HttpResponse.json({
          data: [
            {
              id: "1",
              name: "Test User",
              email: "test@example.com",
              role: "user",
              avatar: "https://example.com/avatar.jpg",
              createdAt: "2024-01-01T00:00:00Z",
            },
          ],
          pagination: {
            page: 1,
            limit: 10,
            total: 1,
            totalPages: 1,
          },
        });
      })
    );

    render(
      <TestWrapper>
        <UserList />
      </TestWrapper>
    );

    // Wait for the user to appear
    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });

    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("user")).toBeInTheDocument();
  });

  it("renders error state when API fails", async () => {
    // Add custom mock handler that returns an error
    addMockHandlers(
      http.get("/api/users", () => {
        return HttpResponse.json(
          {
            type: "https://example.com/problems/server-error",
            title: "Internal Server Error",
            status: 500,
            detail: "The server encountered an unexpected condition.",
          },
          { status: 500 }
        );
      })
    );

    render(
      <TestWrapper>
        <UserList />
      </TestWrapper>
    );

    // Wait for the error to appear
    await waitFor(() => {
      expect(screen.getByText("Error loading users")).toBeInTheDocument();
    });

    expect(screen.getByText("Try again")).toBeInTheDocument();
  });

  it("renders empty state when no users exist", async () => {
    // Add custom mock handler that returns empty data
    addMockHandlers(
      http.get("/api/users", () => {
        return HttpResponse.json({
          data: [],
          pagination: {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
          },
        });
      })
    );

    render(
      <TestWrapper>
        <UserList />
      </TestWrapper>
    );

    // Wait for the empty state to appear
    await waitFor(() => {
      expect(screen.getByText("No users found")).toBeInTheDocument();
    });
  });

  it("hides search and filter when disabled", () => {
    render(
      <TestWrapper>
        <UserList showSearch={false} showRoleFilter={false} />
      </TestWrapper>
    );

    expect(
      screen.queryByPlaceholderText("Search users...")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Filter by role")).not.toBeInTheDocument();
  });
});
