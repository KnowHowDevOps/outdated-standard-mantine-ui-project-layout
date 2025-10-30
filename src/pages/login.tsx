import {
  Center,
  Container,
  Paper,
  Stack,
  Text,
  Title,
  Anchor,
} from "@mantine/core";
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { LoginForm } from "@/features/authentication";
import { useAuthSessionContext } from "@/processes/auth-session";
import { t } from "@lingui/core/macro";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { isAuthenticated } = useAuthSessionContext();

  // Redirect to home if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <Container size={420} my={40}>
      <Title ta="center" order={1} mb="md">
        {t`Welcome back!`}
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        {t`Do not have an account yet?`}{" "}
        <Anchor size="sm" component={Link} to="/register">
          {t`Create account`}
        </Anchor>
      </Text>

      <LoginForm />

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Stack gap="sm">
          <Text size="sm" c="dimmed" ta="center">
            {t`Demo Credentials (if available):`}
          </Text>
          <Text size="xs" c="dimmed" ta="center">
            {t`Email: demo@example.com`}
          </Text>
          <Text size="xs" c="dimmed" ta="center">
            {t`Password: password123`}
          </Text>
        </Stack>
      </Paper>
    </Container>
  );
}
