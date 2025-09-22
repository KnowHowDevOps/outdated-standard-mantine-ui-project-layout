import { createContext, useContext } from "react";
import { useAuthSession } from "../model/use-auth-session";

type AuthSessionContextType = ReturnType<typeof useAuthSession>;

const AuthSessionContext = createContext<AuthSessionContextType | null>(null);

interface AuthSessionProviderProps {
  children: React.ReactNode;
}

export function AuthSessionProvider({ children }: AuthSessionProviderProps) {
  const authSession = useAuthSession();

  return (
    <AuthSessionContext.Provider value={authSession}>
      {children}
    </AuthSessionContext.Provider>
  );
}

export function useAuthSessionContext() {
  const context = useContext(AuthSessionContext);
  if (!context) {
    throw new Error(
      "useAuthSessionContext must be used within AuthSessionProvider"
    );
  }
  return context;
}
