import { createFileRoute } from "@tanstack/react-router";
import {
  Container,
  Title,
  Text,
  Table,
  Card,
  Group,
  Button,
  Badge,
  Avatar,
  TextInput,
  ActionIcon,
  Pagination,
} from "@mantine/core";
import {
  IconSearch,
  IconPlus,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import { useState } from "react";

export const Route = createFileRoute("/users")({
  component: Users,
});

// Mock data for demonstration
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "active",
    avatar:
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    status: "active",
    avatar:
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "User",
    status: "inactive",
    avatar:
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png",
  },
];

function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const getStatusColor = (status: string) => {
    return status === "active" ? "green" : "red";
  };

  const rows = mockUsers.map((user) => (
    <Table.Tr key={user.id}>
      <Table.Td>
        <Group gap="sm">
          <Avatar size={40} src={user.avatar} radius={40} />
          <div>
            <Text fz="sm" fw={500}>
              {user.name}
            </Text>
            <Text fz="xs" c="dimmed">
              {user.email}
            </Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td>
        <Badge color={user.role === "Admin" ? "blue" : "gray"} variant="light">
          {user.role}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Badge color={getStatusColor(user.status)} variant="light">
          {user.status}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap={0} justify="flex-end">
          <ActionIcon variant="subtle" color="gray">
            <IconPencil size="1rem" stroke={1.5} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="red">
            <IconTrash size="1rem" stroke={1.5} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container size="xl">
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={1}>User Management</Title>
          <Text c="dimmed" mt="xs">
            Manage user accounts, roles, and permissions
          </Text>
        </div>
        <Button leftSection={<IconPlus size="1rem" />}>Add User</Button>
      </Group>

      <Card padding="lg" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <TextInput
            placeholder="Search users..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.currentTarget.value)}
            leftSection={<IconSearch size="1rem" />}
            style={{ flex: 1, maxWidth: 400 }}
          />
        </Group>

        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>User</Table.Th>
              <Table.Th>Role</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>

        <Group justify="center" mt="md">
          <Pagination total={1} value={currentPage} onChange={setCurrentPage} />
        </Group>
      </Card>
    </Container>
  );
}
