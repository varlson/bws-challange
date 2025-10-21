import { useCallback, useMemo, useState, type ReactNode } from "react";
import type { User } from "../types/types";
import { AuthContext } from "./AppContexts";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // ⚙️ useCallback memoriza as funções (só recria quando necessário)
  const login = useCallback((username: string) => {
    setUser({ name: username });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  // 💾 useMemo memoriza o objeto `value`
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
