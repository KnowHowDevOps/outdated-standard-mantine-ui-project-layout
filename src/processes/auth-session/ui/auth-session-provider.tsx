import { useAuthSession } from "../model/use-auth-session";
import { AuthSessionContext } from "./auth-session-context";

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
