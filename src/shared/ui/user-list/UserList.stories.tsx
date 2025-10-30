import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { UserList } from "./UserList";

// Create a query client for stories
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const meta: Meta<typeof UserList> = {
  title: "UI/UserList",
  component: UserList,
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    pageSize: {
      control: { type: "number", min: 5, max: 50, step: 5 },
    },
    showSearch: {
      control: "boolean",
    },
    showRoleFilter: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof UserList>;

// Default story uses the standard MSW handlers
export const Default: Story = {
  args: {
    pageSize: 10,
    showSearch: true,
    showRoleFilter: true,
  },
};

// Story with custom mock data
export const WithCustomData: Story = {
  args: {
    pageSize: 5,
    showSearch: true,
    showRoleFilter: true,
  },
  parameters: {
    msw: {
      handlers: [
        http.get("/api/users", () => {
          return HttpResponse.json({
            data: [
              {
                id: "1",
                name: "Alice Johnson",
                email: "alice@company.com",
                role: "admin",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
                createdAt: "2024-01-01T00:00:00Z",
              },
              {
                id: "2",
                name: "Bob Smith",
                email: "bob@company.com",
                role: "user",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
                createdAt: "2024-01-02T00:00:00Z",
              },
              {
                id: "3",
                name: "Carol Davis",
                email: "carol@company.com",
                role: "moderator",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carol",
                createdAt: "2024-01-03T00:00:00Z",
              },
            ],
            pagination: {
              page: 1,
              limit: 5,
              total: 3,
              totalPages: 1,
            },
          });
        }),
      ],
    },
  },
};

// Loading state story
export const Loading: Story = {
  args: {
    pageSize: 10,
    showSearch: true,
    showRoleFilter: true,
  },
  parameters: {
    msw: {
      handlers: [
        http.get("/api/users", async () => {
          // Simulate a long loading time
          await new Promise((resolve) => setTimeout(resolve, 10000));
          return HttpResponse.json({
            data: [],
            pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
          });
        }),
      ],
    },
  },
};

// Error state story
export const Error: Story = {
  args: {
    pageSize: 10,
    showSearch: true,
    showRoleFilter: true,
  },
  parameters: {
    msw: {
      handlers: [
        http.get("/api/users", () => {
          return HttpResponse.json(
            {
              type: "https://example.com/problems/server-error",
              title: "Internal Server Error",
              status: 500,
              detail: "The server encountered an unexpected condition.",
              instance: "/api/users",
              timestamp: new Date().toISOString(),
            },
            { status: 500 }
          );
        }),
      ],
    },
  },
};

// Empty state story
export const Empty: Story = {
  args: {
    pageSize: 10,
    showSearch: true,
    showRoleFilter: true,
  },
  parameters: {
    msw: {
      handlers: [
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
        }),
      ],
    },
  },
};

// Minimal UI story
export const Minimal: Story = {
  args: {
    pageSize: 10,
    showSearch: false,
    showRoleFilter: false,
  },
};
