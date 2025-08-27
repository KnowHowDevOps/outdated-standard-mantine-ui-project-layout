import {
  AppShell as MantineAppShell,
  Burger,
  Group,
  Text,
  NavLink,
  ScrollArea,
  rem,
  ActionIcon,
  useMantineColorScheme,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, useLocation } from "@tanstack/react-router";
import {
  IconDashboard,
  IconUsers,
  IconSettings,
  IconSun,
  IconMoon,
} from "@tabler/icons-react";
import type { ReactNode } from "react";

interface NavigationItem {
  icon: typeof IconDashboard;
  label: string;
  to: string;
  description?: string;
}

interface AppShellProps {
  children: ReactNode;
}

const navigationItems: NavigationItem[] = [
  {
    icon: IconDashboard,
    label: "Dashboard",
    to: "/",
    description: "System overview and metrics",
  },
  {
    icon: IconUsers,
    label: "Users",
    to: "/users",
    description: "Manage user accounts and permissions",
  },
  {
    icon: IconSettings,
    label: "Settings",
    to: "/settings",
    description: "Application configuration",
  },
];

export function AppShell({ children }: AppShellProps) {
  const [opened, { toggle }] = useDisclosure();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const location = useLocation();

  const isActiveRoute = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <MantineAppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <MantineAppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
              aria-label="Toggle navigation"
            />
            <Text
              size="lg"
              fw={600}
              c="adminBlue.6"
              style={{ letterSpacing: "0.5px" }}
            >
              Admin UI
            </Text>
          </Group>

          <Group>
            <Tooltip
              label={`Switch to ${colorScheme === "dark" ? "light" : "dark"} mode`}
              position="bottom"
            >
              <ActionIcon
                onClick={() => toggleColorScheme()}
                variant="subtle"
                size="lg"
                aria-label="Toggle color scheme"
              >
                {colorScheme === "dark" ? (
                  <IconSun size="1.2rem" />
                ) : (
                  <IconMoon size="1.2rem" />
                )}
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </MantineAppShell.Header>

      <MantineAppShell.Navbar p="md">
        <MantineAppShell.Section grow my="md" component={ScrollArea}>
          <Text size="xs" fw={500} c="dimmed" tt="uppercase" mb="md" px="sm">
            Navigation
          </Text>

          {navigationItems.map((item) => (
            <Tooltip
              key={item.to}
              label={item.description}
              position="right"
              disabled={opened}
              openDelay={500}
            >
              <NavLink
                component={Link}
                to={item.to}
                label={item.label}
                leftSection={
                  <item.icon style={{ width: rem(18), height: rem(18) }} />
                }
                active={isActiveRoute(item.to)}
                mb="xs"
                style={(theme) => ({
                  borderRadius: theme.radius.md,
                  fontWeight: isActiveRoute(item.to) ? 600 : 500,
                })}
              />
            </Tooltip>
          ))}
        </MantineAppShell.Section>

        <MantineAppShell.Section>
          <Text size="xs" c="dimmed" ta="center">
            v0.0.0
          </Text>
        </MantineAppShell.Section>
      </MantineAppShell.Navbar>

      <MantineAppShell.Main>{children}</MantineAppShell.Main>
    </MantineAppShell>
  );
}
