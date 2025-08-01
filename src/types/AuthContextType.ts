import type { LoginData } from "./LoginData";
import type { RegisterData } from "./RegisterData";
import type { User } from "./User";

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}
