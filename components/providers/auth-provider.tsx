"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type User = {
  id: string;
  email: string;
  name?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    email: string,
    password: string,
    name?: string
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (name: string) => Promise<{
    success: boolean;
    data?: User;
    error?: string;
  }>;
  updatePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<{
    success: boolean;
    error?: string;
    status?: number;
  }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthStatus = async () => {
    try {
      console.log("Checking auth status...");
      const response = await fetch("/api/auth/session");
      const data = await response.json();
      console.log("Auth status response:", data);

      if (data.authenticated && data.user) {
        console.log("User is authenticated, setting user state:", data.user);
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        console.log("User is not authenticated");
        setUser(null);
        setIsAuthenticated(false);
      }

      setIsLoading(false);
      return true; // Return success
    } catch (error) {
      console.error("Error checking auth status:", error);
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      throw error; // Propagate the error
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        return false;
      }

      const userData = await response.json();
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        return false;
      }

      const userData = await response.json();
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateProfile = async (name: string) => {
    try {
      console.log("Updating profile with name:", name);

      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();
      console.log("Profile update response:", data);

      if (!response.ok) {
        console.error("Profile update failed:", data.error);
        return {
          success: false,
          error: data.error || "Failed to update profile",
        };
      }

      console.log("Updating user state with new name:", data.name);

      // First, directly update the user state for immediate feedback
      setUser((prev) => {
        if (!prev) return data;
        const updatedUser = {
          ...prev,
          name: data.name,
        };
        console.log("Previous user state:", prev);
        console.log("Updated user state:", updatedUser);
        return updatedUser;
      });

      // Then, refresh the session to make sure all components have the latest data
      // This is important to ensure consistency between the client state and server state
      try {
        console.log("Refreshing session data...");
        await checkAuthStatus();
        console.log("Session refresh complete");
      } catch (refreshError) {
        console.error("Error refreshing session:", refreshError);
        // Even if refresh fails, we already updated the local state
      }

      return { success: true, data };
    } catch (error) {
      console.error("Profile update error:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      };
    }
  };

  const updatePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      const response = await fetch("/api/user/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || "Failed to update password",
          status: response.status,
        };
      }

      return { success: true };
    } catch (error) {
      console.error("Password update error:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
