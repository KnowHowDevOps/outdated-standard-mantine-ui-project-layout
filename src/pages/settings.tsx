import {
  Button,
  Card,
  Container,
  Group,
  Stack,
  Switch,
  Text,
  Title,
  Select,
  Divider,
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconSettings, IconInfoCircle } from "@tabler/icons-react";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuthSessionContext } from "@/processes/auth-session";
import { FormField } from "@/shared/ui";
import { useFormMutation } from "@/shared/lib";
import { t } from "@lingui/core/macro";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

interface SettingsForm {
  timezone: string;
  locale: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
}

function SettingsPage() {
  const { user, isAuthenticated } = useAuthSessionContext();

  const form = useForm<SettingsForm>({
    initialValues: {
      timezone: user?.timezone ?? "UTC",
      locale: user?.locale ?? "en",
      emailNotifications: true,
      pushNotifications: false,
      marketingEmails: false,
    },
  });

  const mutation = useFormMutation<void, SettingsForm>(
    form,
    async (values) => {
      // Here you would typically call an API to update settings
      console.log("Updating settings:", values);
    },
    {
      notifySuccess: {
        title: t`Settings Updated`,
        message: t`Your preferences have been saved successfully`,
      },
      notifyError: {
        title: t`Update Failed`,
        fallback: t`Failed to update settings. Please try again.`,
      },
    }
  );

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  const handleSubmit = async (values: SettingsForm) => {
    await mutation.mutateAsync(values);
  };

  const timezones = [
    { value: "UTC", label: "UTC" },
    { value: "America/New_York", label: t`Eastern Time (ET)` },
    { value: "America/Chicago", label: t`Central Time (CT)` },
    { value: "America/Denver", label: t`Mountain Time (MT)` },
    { value: "America/Los_Angeles", label: t`Pacific Time (PT)` },
    { value: "Europe/London", label: t`London (GMT)` },
    { value: "Europe/Paris", label: t`Paris (CET)` },
    { value: "Asia/Tokyo", label: t`Tokyo (JST)` },
    { value: "Australia/Sydney", label: t`Sydney (AEST)` },
  ];

  const locales = [
    { value: "en", label: t`English` },
    { value: "es", label: "Español" },
    { value: "fr", label: "Français" },
    { value: "de", label: "Deutsch" },
    { value: "it", label: "Italiano" },
    { value: "pt", label: "Português" },
    { value: "ja", label: "日本語" },
    { value: "ko", label: "한국어" },
    { value: "zh", label: "中文" },
  ];

  return (
    <Container size="md">
      <Stack gap="xl">
        <div>
          <Group mb="md">
            <IconSettings size="2rem" color="var(--mantine-color-blue-6)" />
            <Title order={1}>{t`Settings`}</Title>
          </Group>
          <Text c="dimmed">
            {t`Manage your account preferences and notification settings`}
          </Text>
        </div>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="lg">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={3} mb="md">
                {t`Regional Settings`}
              </Title>

              <Stack gap="md">
                <FormField
                  type="select"
                  name="timezone"
                  label={t`Timezone`}
                  data={timezones}
                  form={form}
                  searchable
                />

                <FormField
                  type="select"
                  name="locale"
                  label={t`Language`}
                  data={locales}
                  form={form}
                  searchable
                />
              </Stack>
            </Card>

            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={3} mb="md">
                {t`Notification Preferences`}
              </Title>

              <Stack gap="md">
                <Group justify="space-between">
                  <div>
                    <Text fw={500}>{t`Email Notifications`}</Text>
                    <Text size="sm" c="dimmed">
                      {t`Receive important updates via email`}
                    </Text>
                  </div>
                  <Switch
                    {...form.getInputProps("emailNotifications", {
                      type: "checkbox",
                    })}
                  />
                </Group>

                <Divider />

                <Group justify="space-between">
                  <div>
                    <Text fw={500}>{t`Push Notifications`}</Text>
                    <Text size="sm" c="dimmed">
                      {t`Get notified about activity in your browser`}
                    </Text>
                  </div>
                  <Switch
                    {...form.getInputProps("pushNotifications", {
                      type: "checkbox",
                    })}
                  />
                </Group>

                <Divider />

                <Group justify="space-between">
                  <div>
                    <Text fw={500}>{t`Marketing Emails`}</Text>
                    <Text size="sm" c="dimmed">
                      {t`Receive newsletters and promotional content`}
                    </Text>
                  </div>
                  <Switch
                    {...form.getInputProps("marketingEmails", {
                      type: "checkbox",
                    })}
                  />
                </Group>
              </Stack>
            </Card>

            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={3} mb="md">
                {t`Account Actions`}
              </Title>

              <Stack gap="md">
                <Alert icon={<IconInfoCircle size="1rem" />} color="blue">
                  {t`These actions will affect your account permanently. Please proceed with caution.`}
                </Alert>

                <Group>
                  <Button variant="outline" color="orange">
                    {t`Change Password`}
                  </Button>
                  <Button variant="outline" color="red">
                    {t`Delete Account`}
                  </Button>
                </Group>
              </Stack>
            </Card>

            <Group justify="flex-end">
              <Button type="submit" loading={mutation.isPending}>
                {t`Save Settings`}
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </Container>
  );
}
