import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { User } from "../types/User";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token") || null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const userData = null;
          setUser(userData);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          localStorage.removeItem("token");
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email: string, password: string) => {
    // const response = await authService.login(email, password);
    localStorage.setItem("token", "mocked_token"); // Mocked token for demonstration
    setToken("mocked_token");
    setUser(null); // Mocked user data, replace with actual user data from response
  };

  const register = async (email: string, password: string, name: string) => {
    // const response = await api.register(email, password, name);
    // setToken(response.token);
    // setUser(response.user);
    // localStorage.setItem("token", response.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
