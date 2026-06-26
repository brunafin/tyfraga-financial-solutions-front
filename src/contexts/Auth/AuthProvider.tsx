import { useCallback, useMemo, useState, type ReactNode } from "react";
import { AuthService } from "../../services/auth";
import { AuthContext } from "./AuthContext";

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    AuthService.isAuthenticated()
  );

  const login = useCallback(async (password: string) => {
    await AuthService.login(password);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    AuthService.logout();
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      login,
      logout,
    }),
    [isAuthenticated, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
