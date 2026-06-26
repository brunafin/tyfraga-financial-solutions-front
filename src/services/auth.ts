import { api } from "./api";
import { tokenStorage } from "./token";

export const AuthService = {
  getToken(): string | null {
    return tokenStorage.get();
  },

  setToken(token: string): void {
    tokenStorage.set(token);
  },

  clearToken(): void {
    tokenStorage.clear();
  },

  isAuthenticated(): boolean {
    return tokenStorage.hasToken();
  },

  async login(password: string): Promise<void> {
    const response = await api.post<{ access_token: string }>("/auth/login", {
      password,
    });
    this.setToken(response.data.access_token);
  },

  logout(): void {
    this.clearToken();
  },
};
