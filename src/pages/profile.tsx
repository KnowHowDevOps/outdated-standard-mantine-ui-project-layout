import {
  Avatar,
  Badge,
  Button,
  Card,
  Container,
  Group,
  Stack,
  Text,
  Title,
  Grid,
  List,
  ThemeIcon,
} from "@mantine/core";
import {
  IconUser,
  IconMail,
  IconCalendar,
  IconShield,
  IconCheck,
  IconX,
  IconEdit,
} from "@tabler/icons-react";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuthSessionContext } from "@/processes/auth-session";
import {
  getUserDisplayName,
  getUserInitials,
  isUserActive,
  isUserAdmin,
  isUserEmailVerified,
} from "@/entities/user";
import { t } from "@lingui/core/macro";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, isAuthenticated } = useAuthSessionContext();

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  return (
    <Container size="lg">
      <Stack gap="xl">
        <div>
          <Title order={1} mb="md">
            {t`Profile`}
          </Title>
          <Text c="dimmed">
            {t`Manage your account information and preferences`}
          </Text>
        </div>

        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Stack align="center" gap="md">
                <Avatar size={80} radius="xl">
                  {getUserInitials(user)}
                </Avatar>

                <div style={{ textAlign: "center" }}>
                  <Title order={3}>{getUserDisplayName(user)}</Title>
                  <Text size="sm" c="dimmed">
                    {user.email}
                  </Text>
                </div>

                <Group gap="xs">
                  <Badge
                    color={isUserActive(user) ? "green" : "red"}
                    variant="light"
                  >
                    {isUserActive(user) ? t`Active` : t`Inactive`}
                  </Badge>
                  {isUserAdmin(user) && (
                    <Badge color="blue" variant="light">
                      {t`Admin`}
                    </Badge>
                  )}
                </Group>

                <Button
                  leftSection={<IconEdit size="1rem" />}
                  variant="light"
                  fullWidth
                >
                  {t`Edit Profile`}
                </Button>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack gap="md">
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">
                  {t`Account Information`}
                </Title>

                <List spacing="md">
                  <List.Item
                    icon={
                      <ThemeIcon color="blue" size={24} radius="xl">
                        <IconUser size="1rem" />
                      </ThemeIcon>
                    }
                  >
                    <div>
                      <Text fw={500}>{t`Full Name`}</Text>
                      <Text size="sm" c="dimmed">
                        {user.first_name} {user.last_name}
                      </Text>
                    </div>
                  </List.Item>

                  <List.Item
                    icon={
                      <ThemeIcon color="green" size={24} radius="xl">
                        <IconMail size="1rem" />
                      </ThemeIcon>
                    }
                  >
                    <div>
                      <Group gap="xs">
                        <Text fw={500}>{t`Email Address`}</Text>
                        {isUserEmailVerified(user) ? (
                          <IconCheck
                            size="1rem"
                            color="var(--mantine-color-green-6)"
                          />
                        ) : (
                          <IconX
                            size="1rem"
                            color="var(--mantine-color-red-6)"
                          />
                        )}
                      </Group>
                      <Text size="sm" c="dimmed">
                        {user.email}
                      </Text>
                      {!isUserEmailVerified(user) && (
                        <Text size="xs" c="red">
                          {t`Email not verified`}
                        </Text>
                      )}
                    </div>
                  </List.Item>

                  {user.timezone && (
                    <List.Item
                      icon={
                        <ThemeIcon color="orange" size={24} radius="xl">
                          <IconCalendar size="1rem" />
                        </ThemeIcon>
                      }
                    >
                      <div>
                        <Text fw={500}>{t`Timezone`}</Text>
                        <Text size="sm" c="dimmed">
                          {user.timezone}
                        </Text>
                      </div>
                    </List.Item>
                  )}

                  <List.Item
                    icon={
                      <ThemeIcon color="violet" size={24} radius="xl">
                        <IconShield size="1rem" />
                      </ThemeIcon>
                    }
                  >
                    <div>
                      <Text fw={500}>{t`Role`}</Text>
                      <Text size="sm" c="dimmed">
                        {user.role || t`User`}
                      </Text>
                    </div>
                  </List.Item>
                </List>
              </Card>

              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">
                  {t`Account Status`}
                </Title>

                <List spacing="sm">
                  <List.Item
                    icon={
                      isUserEmailVerified(user) ? (
                        <IconCheck
                          size="1rem"
                          color="var(--mantine-color-green-6)"
                        />
                      ) : (
                        <IconX size="1rem" color="var(--mantine-color-red-6)" />
                      )
                    }
                  >
                    <Text size="sm">
                      {t`Email`}{" "}
                      {isUserEmailVerified(user)
                        ? t`verified`
                        : t`not verified`}
                    </Text>
                  </List.Item>

                  <List.Item
                    icon={
                      isUserActive(user) ? (
                        <IconCheck
                          size="1rem"
                          color="var(--mantine-color-green-6)"
                        />
                      ) : (
                        <IconX size="1rem" color="var(--mantine-color-red-6)" />
                      )
                    }
                  >
                    <Text size="sm">
                      {t`Account`}{" "}
                      {isUserActive(user) ? t`active` : t`inactive`}
                    </Text>
                  </List.Item>

                  {user.is_account_owner && (
                    <List.Item
                      icon={
                        <IconCheck
                          size="1rem"
                          color="var(--mantine-color-blue-6)"
                        />
                      }
                    >
                      <Text size="sm">{t`Account owner`}</Text>
                    </List.Item>
                  )}
                </List>
              </Card>
            </Stack>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}
