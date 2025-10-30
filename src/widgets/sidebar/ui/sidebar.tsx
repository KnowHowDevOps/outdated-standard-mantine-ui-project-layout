import { NavLink, Stack, Text } from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconExposure,
  IconHome,
  IconInfoCircle,
  IconLogin,
  IconRegistered,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import { Link, useLocation } from "@tanstack/react-router";
import { useAuthSessionContext } from "../../../processes/auth-session";
import { t } from "@lingui/core/macro";

export function Sidebar() {
  const location = useLocation();
  const { isAuthenticated } = useAuthSessionContext();

  return (
    <Stack gap="md">
      <Text size="sm" fw={500}>
        {t`Navigation`}
      </Text>

      <NavLink
        component={Link}
        to="/"
        label={t`Home`}
        leftSection={<IconHome size="1rem" />}
        active={location.pathname === "/"}
      />

      <NavLink
        component={Link}
        to="/about"
        label={t`About`}
        leftSection={<IconInfoCircle size="1rem" />}
        active={location.pathname === "/about"}
      />

      <NavLink
        component={Link}
        to="/examples"
        label={t`Examples`}
        leftSection={<IconExposure size="1rem" />}
        active={location.pathname === "/examples"}
      />

      {!isAuthenticated && (
        <>
          <NavLink
            component={Link}
            to="/login"
            label={t`Login`}
            leftSection={<IconLogin size="1rem" />}
            active={location.pathname === "/login"}
          />
        </>
      )}

      {!isAuthenticated && (
        <>
          <NavLink
            component={Link}
            to="/register"
            label={t`Register`}
            leftSection={<IconChevronRight size="1rem" />}
            active={location.pathname === "/register"}
          />
        </>
      )}

      {isAuthenticated && (
        <>
          <Text size="sm" fw={500} mt="md">
            {t`Account`}
          </Text>
          <NavLink
            component={Link}
            to="/profile"
            label={t`Profile`}
            leftSection={<IconUser size="1rem" />}
            active={location.pathname === "/profile"}
          />
        </>
      )}

      {isAuthenticated && (
        <>
          <Text size="sm" fw={500} mt="md">
            {t`Settings`}
          </Text>
          <NavLink
            component={Link}
            to="/settings"
            label={t`Settings`}
            leftSection={<IconSettings size="1rem" />}
            active={location.pathname === "/settings"}
          />
        </>
      )}
    </Stack>
  );
}
