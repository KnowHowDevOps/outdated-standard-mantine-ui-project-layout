export interface Account {
  id?: string;
  name: string;
  email: string;
  timezone?: string;
  currency_code?: string;
  password?: string;
  is_account_email_confirmed?: boolean;
  requires_manual_verification?: boolean;
}
