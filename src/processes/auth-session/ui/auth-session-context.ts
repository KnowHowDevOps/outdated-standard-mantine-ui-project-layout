import { createContext } from "react";
import type { useAuthSession } from "../model/use-auth-session";

export type AuthSessionContextType = ReturnType<typeof useAuthSession>;

export const AuthSessionContext = createContext<AuthSessionContextType | null>(
  null
);
