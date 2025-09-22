import { email, minLength } from "../../../entities/form";
import { FormValues } from "./types";

export const validateSampleForm = {
  name: minLength(2),
  email,
};

export const initialFormValues: FormValues = {
  name: "",
  email: "",
};
