import { useAuth } from "@/api/useAuth";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function AdminLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { isLoading, isAuthenticated, user, checkAuth } = useAuth();

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (isLoading) return;

      const isAdminRoute = segments[0] === "(admin)";
      const isLoginRoute = segments[1] === "login";

      if (!isAdminRoute) return;

      if (!isAuthenticated || !user) {
        if (!isLoginRoute) {
          router.replace("/(admin)/login");
        }
        return;
      }

      if (user.role !== 1) {
        if (!isLoginRoute) {
          router.replace("/(admin)/login");
        }
        return;
      }

      if (isLoginRoute) {
        router.replace("/(admin)/(tabs)/dashboard");
      }
    };

    checkAdminAccess();
  }, [segments, isLoading, isAuthenticated, user]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}