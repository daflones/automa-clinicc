import { useState, createContext, useContext } from "react";
import { User } from "@/lib/types";

// Definindo o tipo do contexto de autenticação
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Criando o contexto com um valor padrão
const defaultUser: User = {
  id: "1",
  username: "admin",
  name: "Administrador",
  role: "ADMIN"
};

// Criando valores padrão para o contexto
const defaultAuth: AuthContextType = {
  user: defaultUser,
  isLoading: false,
  login: async () => {},
  logout: async () => {}
};

// Criando o contexto com valores padrão
const AuthContext = createContext<AuthContextType>(defaultAuth);

// Hook personalizado para usar o contexto
export function useAuth() {
  return useContext(AuthContext);
}

// Provider para envolver os componentes e fornecer os valores do contexto
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(defaultUser);
  const [isLoading, setIsLoading] = useState(false);

  // Função simplificada de login (para desenvolvimento)
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulando um login bem-sucedido para desenvolvimento
      if (username === "admin" && password === "admin123") {
        const userData: User = {
          id: "1",
          username: "admin",
          name: "Administrador",
          role: "ADMIN"
        };
        setUser(userData);
      } else if (username === "secretaria" && password === "secretaria123") {
        const userData: User = {
          id: "2",
          username: "secretaria",
          name: "Ana Secretária",
          role: "SECRETARIA"
        };
        setUser(userData);
      } else if (username === "profissional" && password === "profissional123") {
        const userData: User = {
          id: "3",
          username: "profissional",
          name: "Dra. Amanda Silva",
          role: "PROFISSIONAL"
        };
        setUser(userData);
      } else {
        throw new Error("Credenciais inválidas");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Função simplificada de logout (para desenvolvimento)
  const logout = async () => {
    setUser(null);
  };

  // Valores a serem fornecidos pelo contexto
  const value = {
    user,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
