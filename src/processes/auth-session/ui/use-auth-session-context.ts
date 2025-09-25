import { useContext } from "react";
import { AuthSessionContext } from "./auth-session-context";

export function useAuthSessionContext() {
  const context = useContext(AuthSessionContext);
  if (!context) {
    throw new Error(
      "useAuthSessionContext must be used within AuthSessionProvider"
    );
  }
  return context;
}
