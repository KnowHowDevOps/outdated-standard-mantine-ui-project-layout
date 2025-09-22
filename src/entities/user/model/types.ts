// User entity types
export type IdParam = string | undefined | number;

export interface User {
  id?: IdParam;
  account_id?: IdParam;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  timezone?: string;
  password?: string;
  is_email_verified?: boolean;
  has_pending_email_change?: boolean;
  enforce_email_confirmation_during_registration?: boolean;
  pending_email?: string;
  last_login_at?: string;
  status?: "ACTIVE" | "INACTIVE";
  role?: "ADMIN";
  is_account_owner?: boolean;
  locale?: string;
  name: string; // Computed property for display
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}
