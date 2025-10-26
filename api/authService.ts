import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Platform } from "react-native";

export interface UserData {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  profile_picture?: string;
  role: number;
  created_at: string;
}

class AuthService {
  private readonly TOKEN_KEY = "userToken";
  private readonly USER_DATA_KEY = "userData";

  // Login
  async login(token: string, userData: UserData): Promise<void> {
    await AsyncStorage.multiSet([
      [this.TOKEN_KEY, token],
      [this.USER_DATA_KEY, JSON.stringify(userData)],
    ]);
  }

  async logout(redirectToLogin: boolean = true): Promise<void> {
    try {
      console.log("AuthService: Starting logout process");
      
      await AsyncStorage.multiRemove([this.TOKEN_KEY, this.USER_DATA_KEY]);
      
      console.log("AuthService: Storage cleared successfully");
      
      if (redirectToLogin) {
        console.log("AuthService: Redirecting to login page");
        
        if (Platform.OS === 'web') {
          window.location.href = '/(admin)/login';
        } else {
          setTimeout(() => {
            router.replace("/(admin)/login");
          }, 100);
        }
      }
    } catch (error) {
      console.error("AuthService: Logout error:", error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<UserData | null> {
    try {
      const userData = await AsyncStorage.getItem(this.USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  }

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error("Get token error:", error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  async isAdmin(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.role === 1;
  }
}

export const authService = new AuthService();