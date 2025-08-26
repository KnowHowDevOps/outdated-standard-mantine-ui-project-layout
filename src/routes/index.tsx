import { createFileRoute } from "@tanstack/react-router";
import {
  Container,
  Title,
  Text,
  Grid,
  Card,
  Group,
  ThemeIcon,
  SimpleGrid,
  Progress,
} from "@mantine/core";
import {
  IconUsers,
  IconServer,
  IconActivity,
  IconCheckbox,
} from "@tabler/icons-react";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      diff: 12,
      icon: IconUsers,
      color: "blue",
    },
    {
      title: "Active Services",
      value: "8",
      diff: 2,
      icon: IconServer,
      color: "green",
    },
    {
      title: "System Health",
      value: "98%",
      diff: 1,
      icon: IconActivity,
      color: "orange",
    },
    {
      title: "Tests Passing",
      value: "142/150",
      diff: -2,
      icon: IconCheckbox,
      color: "red",
    },
  ];

  return (
    <Container size="xl">
      <Title order={1} mb="xl">
        Dashboard
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} mb="xl">
        {stats.map((stat) => (
          <Card key={stat.title} padding="lg" radius="md" withBorder>
            <Group justify="apart">
              <Text size="sm" c="dimmed" fw={500} tt="uppercase">
                {stat.title}
              </Text>
              <ThemeIcon
                color={stat.color}
                variant="light"
                size={38}
                radius="md"
              >
                <stat.icon size="1.8rem" stroke={1.5} />
              </ThemeIcon>
            </Group>

            <Text fw={700} fz="xl" mt="md">
              {stat.value}
            </Text>

            <Text c="dimmed" fz="sm" mt="xs">
              {stat.diff > 0 ? "+" : ""}
              {stat.diff}% from last month
            </Text>
          </Card>
        ))}
      </SimpleGrid>

      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card padding="lg" radius="md" withBorder>
            <Title order={3} mb="md">
              System Overview
            </Title>
            <Text c="dimmed" mb="lg">
              Welcome to the Admin UI. This is your central dashboard for
              managing user services and monitoring system health.
            </Text>

            <Title order={4} mb="sm">
              Service Status
            </Title>
            <Text size="sm" c="dimmed" mb="xs">
              Authentication Service
            </Text>
            <Progress value={95} color="green" mb="sm" />

            <Text size="sm" c="dimmed" mb="xs">
              User Management
            </Text>
            <Progress value={87} color="blue" mb="sm" />

            <Text size="sm" c="dimmed" mb="xs">
              Notification Service
            </Text>
            <Progress value={78} color="orange" mb="sm" />
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card padding="lg" radius="md" withBorder>
            <Title order={3} mb="md">
              Quick Actions
            </Title>
            <Text c="dimmed">
              Use the navigation menu to access user management, system
              settings, and other administrative functions.
            </Text>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
