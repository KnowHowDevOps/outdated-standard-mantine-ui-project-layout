import type { Meta, StoryObj } from "@storybook/react";
import { http, HttpResponse } from "msw";
import { UserCard } from "./UserCard";

const meta: Meta<typeof UserCard> = {
  title: "Components/UserCard",
  component: UserCard,
  parameters: {
    layout: "centered",
    msw: {
      handlers: [
        http.get("/api/users/1", () => {
          return HttpResponse.json({
            id: "1",
            name: "John Doe",
            email: "john@example.com",
            role: "admin",
            status: "active",
            avatar:
              "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png",
            createdAt: "2023-01-01T00:00:00Z",
            updatedAt: "2023-01-01T00:00:00Z",
          });
        }),
      ],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    user: {
      control: "object",
    },
    onEdit: { action: "edit" },
    onDelete: { action: "delete" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    user: {
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
  },
};

export const RegularUser: Story = {
  args: {
    user: {
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
  },
};

export const InactiveUser: Story = {
  args: {
    user: {
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
  },
};

export const WithoutAvatar: Story = {
  args: {
    user: {
      id: "4",
      name: "Alice Cooper",
      email: "alice@example.com",
      role: "moderator",
      status: "active",
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z",
    },
  },
};
