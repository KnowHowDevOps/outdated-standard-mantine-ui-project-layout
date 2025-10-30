import { Avatar, Button, Group, Menu, Text, Title } from "@mantine/core";
import { IconLogout, IconSettings, IconUser } from "@tabler/icons-react";
import { useAuthSessionContext } from "@/processes/auth-session";
import { getUserDisplayName, getUserInitials } from "@/entities/user";
import { notificationService } from "@/shared/lib";
import { t } from "@lingui/core/macro";

interface HeaderProps {
  title?: string;
}

export function Header({ title = t`Mantine UI Template` }: HeaderProps) {
  const { user, logout, isAuthenticated } = useAuthSessionContext();

  const handleLogout = async () => {
    try {
      await logout();
      notificationService.success({
        message: t`You have been logged out successfully`,
      });
    } catch (error) {
      notificationService.error({
        title: t`Logout Failed`,
        message: t`Failed to logout. Please try again.`,
      });
    }
  };

  return (
    <Group h="100%" px="md" justify="space-between">
      <Title order={3}>{title}</Title>

      {isAuthenticated && user ? (
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Button
              variant="subtle"
              leftSection={<Avatar size="sm">{getUserInitials(user)}</Avatar>}
            >
              {getUserDisplayName(user)}
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>{t`Account`}</Menu.Label>
            <Menu.Item
              leftSection={<IconUser size={14} />}
            >{t`Profile`}</Menu.Item>
            <Menu.Item leftSection={<IconSettings size={14} />}>
              {t`Settings`}
            </Menu.Item>

            <Menu.Divider />

            <Menu.Item
              leftSection={<IconLogout size={14} />}
              onClick={handleLogout}
              color="red"
            >
              {t`Logout`}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ) : (
        <Text size="sm" c="dimmed">
          {t`Not authenticated`}
        </Text>
      )}
    </Group>
  );
}
