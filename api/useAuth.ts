import { authService } from "@/api/authService";
import { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const [authenticated, userData] = await Promise.all([
        authService.isAuthenticated(),
        authService.getCurrentUser(),
      ]);

      setIsAuthenticated(authenticated);
      setUser(userData);
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAuthState = async () => {
    await checkAuth();
  };

  const logout = async () => {
    console.log("🚪 useAuth: Logout initiated");
    
    try {
      setIsAuthenticated(false);
      setUser(null);
      
      await authService.logout();
      
      console.log("✅ useAuth: Logout completed");
    } catch (error: any) {
      console.error("❌ useAuth: Logout error:", error);
      if (Platform.OS === 'web') {
        alert(`Logout failed: ${error.message}`);
      } else {
        Alert.alert("Error", "Failed to logout. Please try again.");
      }
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    isLoading,
    isAuthenticated,
    user,
    checkAuth,
    updateAuthState,
    logout,
  };
};