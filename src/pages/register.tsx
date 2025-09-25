import { Container, Text, Title, Anchor } from "@mantine/core";
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { RegisterForm } from "@/features/authentication";
import { useAuthSessionContext } from "@/processes/auth-session";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const { isAuthenticated } = useAuthSessionContext();

  // Redirect to home if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <Container size={420} my={40}>
      <Title ta="center" order={1} mb="md">
        Create your account
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account?{" "}
        <Anchor size="sm" component={Link} to="/login">
          Sign in
        </Anchor>
      </Text>

      <RegisterForm />
    </Container>
  );
}
