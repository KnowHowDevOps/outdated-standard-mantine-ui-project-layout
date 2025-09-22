import { email, minLength, confirmPassword } from "../../../entities/form";

export const loginValidation = {
  email,
  password: minLength(6),
};

export const registerValidation = {
  first_name: minLength(2),
  last_name: minLength(2),
  email,
  password: minLength(6),
  password_confirmation: confirmPassword,
};
