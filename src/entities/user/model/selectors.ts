import { User } from "./types";

// User business logic selectors
export const getUserDisplayName = (user: User): string => {
  return (
    user.full_name ||
    `${user.first_name} ${user.last_name}`.trim() ||
    user.email
  );
};

export const getUserInitials = (user: User): string => {
  const name = getUserDisplayName(user);
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const isUserActive = (user: User): boolean => {
  return user.status === "ACTIVE";
};

export const isUserAdmin = (user: User): boolean => {
  return user.role === "ADMIN";
};

export const isUserAccountOwner = (user: User): boolean => {
  return user.is_account_owner === true;
};

export const isUserEmailVerified = (user: User): boolean => {
  return user.is_email_verified === true;
};

export const hasUserPendingEmailChange = (user: User): boolean => {
  return user.has_pending_email_change === true;
};
