import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  Avatar,
  Badge,
  Button,
  Group,
  Text,
  Loader,
  Alert,
  TextInput,
  Select,
} from "@mantine/core";
import { IconSearch, IconAlertCircle } from "@tabler/icons-react";
import { apiClient } from "@/shared/lib/axios-config";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  createdAt: string;
}

interface UserListResponse {
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface UserListProps {
  /**
   * Number of users to display per page
   */
  pageSize?: number;
  /**
   * Whether to show search functionality
   */
  showSearch?: boolean;
  /**
   * Whether to show role filter
   */
  showRoleFilter?: boolean;
}

export function UserList({
  pageSize = 10,
  showSearch = true,
  showRoleFilter = true,
}: UserListProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["users", page, pageSize, search, roleFilter],
    queryFn: async (): Promise<UserListResponse> => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
        ...(search && { search }),
        ...(roleFilter && { role: roleFilter }),
      });

      const response = await apiClient.get(`/users?${params}`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <Group justify="center" p="xl">
        <Loader size="lg" />
        <Text>Loading users...</Text>
      </Group>
    );
  }

  if (error) {
    return (
      <Alert
        icon={<IconAlertCircle size="1rem" />}
        title="Error loading users"
        color="red"
        variant="light"
      >
        <Text size="sm" mb="md">
          {error instanceof Error
            ? error.message
            : "An unexpected error occurred"}
        </Text>
        <Button size="xs" onClick={() => refetch()}>
          Try again
        </Button>
      </Alert>
    );
  }

  const users = data?.data || [];

  const roleColors: Record<string, string> = {
    admin: "red",
    moderator: "blue",
    user: "green",
  };

  return (
    <div>
      {(showSearch || showRoleFilter) && (
        <Group mb="md" gap="md">
          {showSearch && (
            <TextInput
              placeholder="Search users..."
              leftSection={<IconSearch size="1rem" />}
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              style={{ flex: 1 }}
            />
          )}
          {showRoleFilter && (
            <Select
              placeholder="Filter by role"
              data={[
                { value: "", label: "All roles" },
                { value: "admin", label: "Admin" },
                { value: "moderator", label: "Moderator" },
                { value: "user", label: "User" },
              ]}
              value={roleFilter}
              onChange={(value) => setRoleFilter(value || "")}
              clearable
            />
          )}
        </Group>
      )}

      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>User</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Joined</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {users.map((user) => (
            <Table.Tr key={user.id}>
              <Table.Td>
                <Group gap="sm">
                  <Avatar src={user.avatar} size="sm" radius="xl" />
                  <Text size="sm" fw={500}>
                    {user.name}
                  </Text>
                </Group>
              </Table.Td>
              <Table.Td>
                <Text size="sm" c="dimmed">
                  {user.email}
                </Text>
              </Table.Td>
              <Table.Td>
                <Badge
                  color={roleColors[user.role] || "gray"}
                  variant="light"
                  size="sm"
                >
                  {user.role}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Text size="sm" c="dimmed">
                  {new Date(user.createdAt).toLocaleDateString()}
                </Text>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      {users.length === 0 && (
        <Text ta="center" c="dimmed" py="xl">
          No users found
        </Text>
      )}

      {data?.pagination && (
        <Group justify="space-between" mt="md">
          <Text size="sm" c="dimmed">
            Showing {users.length} of {data.pagination.total} users
          </Text>
          <Group gap="xs">
            <Button
              size="xs"
              variant="light"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <Text size="sm">
              Page {page} of {data.pagination.totalPages}
            </Text>
            <Button
              size="xs"
              variant="light"
              disabled={page >= data.pagination.totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </Group>
        </Group>
      )}
    </div>
  );
}
