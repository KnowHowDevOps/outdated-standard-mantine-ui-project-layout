import {
  Card,
  Group,
  Text,
  Badge,
  Avatar,
  ActionIcon,
  Stack,
} from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { getStatusColor, getRoleColor } from "@/theme";
import type { User } from "@/schemas/user";

interface UserCardProps {
  user: User;
  onEdit?: (userId: string) => void;
  onDelete?: (userId: string) => void;
}

export function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  return (
    <Card
      padding="lg"
      radius="md"
      withBorder
      shadow="sm"
      style={{ height: "100%" }}
    >
      <Group justify="space-between" mb="md">
        <Group>
          <Avatar
            size={50}
            src={user.avatar}
            radius={50}
            color={getRoleColor(user.role)}
          >
            {user.name.charAt(0).toUpperCase()}
          </Avatar>
          <Stack gap={4}>
            <Text fw={600} size="lg" lineClamp={1}>
              {user.name}
            </Text>
            <Text size="sm" c="dimmed" lineClamp={1}>
              {user.email}
            </Text>
          </Stack>
        </Group>

        <Group gap="xs">
          {onEdit && (
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={() => onEdit(user.id)}
              aria-label={`Edit ${user.name}`}
              size="md"
            >
              <IconPencil size="1rem" stroke={1.5} />
            </ActionIcon>
          )}
          {onDelete && (
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={() => onDelete(user.id)}
              aria-label={`Delete ${user.name}`}
              size="md"
            >
              <IconTrash size="1rem" stroke={1.5} />
            </ActionIcon>
          )}
        </Group>
      </Group>

      <Group justify="space-between" mt="md" mb="sm">
        <Badge
          color={getRoleColor(user.role)}
          variant="light"
          size="sm"
          radius="sm"
        >
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </Badge>
        <Badge
          color={getStatusColor(user.status)}
          variant="filled"
          size="sm"
          radius="sm"
        >
          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
        </Badge>
      </Group>

      <Text size="xs" c="dimmed" mt="auto">
        Created: {new Date(user.createdAt).toLocaleDateString()}
      </Text>
    </Card>
  );
}
