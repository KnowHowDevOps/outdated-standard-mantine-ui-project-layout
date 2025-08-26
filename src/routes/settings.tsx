import { createFileRoute } from "@tanstack/react-router";
import {
  Container,
  Title,
  Text,
  Card,
  Switch,
  TextInput,
  Button,
  Group,
  Stack,
  Select,
  Textarea,
  Divider,
} from "@mantine/core";
import { useState } from "react";

export const Route = createFileRoute("/settings")({
  component: Settings,
});

function Settings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [theme, setTheme] = useState("light");

  return (
    <Container size="md">
      <Title order={1} mb="xl">
        Settings
      </Title>

      <Stack gap="xl">
        <Card padding="lg" radius="md" withBorder>
          <Title order={3} mb="md">
            General Settings
          </Title>

          <Stack gap="md">
            <TextInput
              label="Application Name"
              defaultValue="Admin UI"
              description="The name displayed in the application header"
            />

            <Select
              label="Default Theme"
              value={theme}
              onChange={(value) => setTheme(value || "light")}
              data={[
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
                { value: "auto", label: "Auto (System)" },
              ]}
              description="Choose the default theme for the application"
            />

            <TextInput
              label="API Base URL"
              defaultValue="https://api.example.com"
              description="Base URL for API requests"
            />
          </Stack>
        </Card>

        <Card padding="lg" radius="md" withBorder>
          <Title order={3} mb="md">
            Notifications
          </Title>

          <Stack gap="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" fw={500}>
                  Email Notifications
                </Text>
                <Text size="xs" c="dimmed">
                  Receive notifications via email
                </Text>
              </div>
              <Switch
                checked={emailNotifications}
                onChange={(event) =>
                  setEmailNotifications(event.currentTarget.checked)
                }
              />
            </Group>

            <Group justify="space-between">
              <div>
                <Text size="sm" fw={500}>
                  Push Notifications
                </Text>
                <Text size="xs" c="dimmed">
                  Receive browser push notifications
                </Text>
              </div>
              <Switch
                checked={pushNotifications}
                onChange={(event) =>
                  setPushNotifications(event.currentTarget.checked)
                }
              />
            </Group>
          </Stack>
        </Card>

        <Card padding="lg" radius="md" withBorder>
          <Title order={3} mb="md">
            User Service Configuration
          </Title>

          <Stack gap="md">
            <TextInput
              label="Service Endpoint"
              defaultValue="https://userservice.example.com/api/v1"
              description="Primary user service endpoint"
            />

            <TextInput
              label="API Key"
              type="password"
              placeholder="Enter API key"
              description="API key for user service authentication"
            />

            <Select
              label="Service Version"
              defaultValue="v1"
              data={[
                { value: "v1", label: "Version 1.0" },
                { value: "v2", label: "Version 2.0 (Beta)" },
              ]}
              description="Select the API version to use"
            />
          </Stack>
        </Card>

        <Card padding="lg" radius="md" withBorder>
          <Title order={3} mb="md">
            System Information
          </Title>

          <Stack gap="sm">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Version
              </Text>
              <Text size="sm">1.0.0</Text>
            </Group>

            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Build
              </Text>
              <Text size="sm">2025.01.20</Text>
            </Group>

            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Environment
              </Text>
              <Text size="sm">Development</Text>
            </Group>
          </Stack>
        </Card>

        <Group justify="flex-end">
          <Button variant="outline">Cancel</Button>
          <Button>Save Settings</Button>
        </Group>
      </Stack>
    </Container>
  );
}
