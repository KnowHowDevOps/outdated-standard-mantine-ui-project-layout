import {
  Badge,
  Button,
  Card,
  Container,
  Grid,
  Group,
  List,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconRocket, IconStar } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";

import { SampleFormFeature } from "@/features/sample-form";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const showNotification = () => {
    notifications.show({
      title: "Welcome!",
      message: "This is a Mantine UI notification example",
      icon: <IconCheck size="1rem" />,
      color: "green",
    });
  };

  return (
    <Container
      component="main"
      size="lg"
      data-testid="home-container"
      aria-label="Home page"
    >
      <Stack gap="xl">
        <div>
          <Group mb="md">
            <IconRocket size="2rem" color="var(--mantine-color-blue-6)" />
            <Title order={1} data-testid="home-title">
              Welcome to Mantine UI Template
            </Title>
          </Group>
          <Text size="lg" c="dimmed" data-testid="home-subtitle">
            A modern React template with TypeScript, Vite, TanStack Router, and
            Mantine UI
          </Text>
        </div>

        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              data-testid="quick-start-card"
            >
              <Group justify="space-between" mb="xs">
                <Text fw={500}>Quick Start</Text>
                <Badge color="pink" variant="light">
                  Ready
                </Badge>
              </Group>

              <Text size="sm" c="dimmed" mb="md">
                Everything is set up and ready to go. Start building your
                application!
              </Text>

              <List
                spacing="xs"
                size="sm"
                center
                data-testid="quick-start-list"
                icon={
                  <IconCheck size="1rem" color="var(--mantine-color-green-6)" />
                }
              >
                <List.Item>TypeScript configured</List.Item>
                <List.Item>Mantine UI components ready</List.Item>
                <List.Item>TanStack Router setup</List.Item>
                <List.Item>TanStack Query integrated</List.Item>
                <List.Item>Testing environment ready</List.Item>
              </List>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              data-testid="features-card"
            >
              <Group justify="space-between" mb="xs">
                <Text fw={500}>Features</Text>
                <Badge color="blue" variant="light">
                  Modern
                </Badge>
              </Group>

              <Text size="sm" c="dimmed" mb="md">
                Built with the latest tools and best practices for modern web
                development.
              </Text>

              <List
                spacing="xs"
                size="sm"
                center
                data-testid="features-list"
                icon={
                  <IconStar size="1rem" color="var(--mantine-color-yellow-6)" />
                }
              >
                <List.Item>React 19 with concurrent features</List.Item>
                <List.Item>Vite for lightning-fast development</List.Item>
                <List.Item>Feature-Sliced Design architecture</List.Item>
                <List.Item>Testing setup</List.Item>
                <List.Item>CI/CD with GitHub Actions</List.Item>
              </List>
            </Card>
          </Grid.Col>
        </Grid>

        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          data-testid="try-components-card"
        >
          <Group justify="space-between" mb="md">
            <div>
              <Text fw={500}>Try Mantine Components</Text>
              <Text size="sm" c="dimmed">
                Test the notification system and other Mantine features
              </Text>
            </div>
            <Button
              onClick={showNotification}
              leftSection={<IconCheck size="1rem" />}
              data-testid="show-notification-btn"
            >
              Show Notification
            </Button>
          </Group>
        </Card>

        <SampleFormFeature />
      </Stack>
    </Container>
  );
}
