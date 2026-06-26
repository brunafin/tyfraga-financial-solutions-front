import { createContext } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (password: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);
