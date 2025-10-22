import { useCallback, useMemo, useState, type ReactNode } from "react";
import type { User } from "../types/types";
import { AuthContext } from "./AppContexts";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({
    name: "Varlson",
    usermame: "varlson",
  });

  const login = useCallback((username: string, name: string) => {
    setUser({ name: name, usermame: username });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user, login, logout] // só recria quando algo realmente muda
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
