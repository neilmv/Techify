import { API, API_URL, authAPI } from "@/api/api";
import EditProfileModal from "@/components/EditProfileModal";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  profile_picture?: string;
  created_at: string;
}

interface Stats {
  totalBookings: number;
  completedBookings: number;
  pendingBookings: number;
}

interface Booking {
  id: number;
  user_id: number;
  status: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      // First check if user is authenticated
      const token = await AsyncStorage.getItem("userToken");
      const userData = await AsyncStorage.getItem("userData");
      
      setUserToken(token);
      
      if (!token) {
        router.replace("/(auth)/login");
        return;
      }
      
      if (userData) {
        const userObj = JSON.parse(userData);
        setUser(userObj);
      } else {
        try {
          const profileResponse = await authAPI.getProfile();
          if (profileResponse.data) {
            setUser(profileResponse.data);
            await AsyncStorage.setItem("userData", JSON.stringify(profileResponse.data));
          }
        } catch (profileError) {
          console.error("Error fetching profile:", profileError);
        }
      }
      
      await loadStats();
    } catch (error) {
      console.error("Auth check failed:", error);
      router.replace("/(auth)/login");
    }
  };

  const loadStats = async () => {
    try {
      if (!userToken) {
        console.log("No token available");
        return;
      }

      const response = await API.get("/bookings");
      const userBookings: Booking[] = response.data;
      
      setStats({
        totalBookings: userBookings.length,
        completedBookings: userBookings.filter((b) => b.status === "Completed").length,
        pendingBookings: userBookings.filter((b) => 
          b.status === "Pending" || b.status === "Confirmed" || b.status === "In Progress"
        ).length,
      });
    } catch (error: any) {
      console.error("Error fetching stats:", error);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        Alert.alert("Session Expired", "Please login again", [
          { text: "OK", onPress: () => router.replace("/(auth)/login") }
        ]);
        await AsyncStorage.multiRemove(["userToken", "userData"]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.multiRemove(["userToken", "userData"]);
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const pickImage = async () => {
    try {
      if (!userToken) {
        Alert.alert("Authentication Required", "Please login again");
        return;
      }

      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Camera roll permission needed.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const selectedImage = result.assets[0];
        setSaving(true);

        const formData = new FormData();
        formData.append("profile_picture", {
          uri: selectedImage.uri,
          type: "image/jpeg",
          name: "profile.jpg",
        } as any);

        const response = await authAPI.updateProfilePicture(formData);
        if (response.data.user) {
          const updatedUser = response.data.user;
          setUser(updatedUser);
          await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));
        }
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update profile picture"
      );
    } finally {
      setSaving(false);
    }
  };


  const handleSaveProfile = async (userData: {
    name: string;
    phone: string;
    address: string;
  }) => {
    try {
      if (!userToken) {
        Alert.alert("Authentication Required", "Please login again");
        return;
      }

      setSaving(true);
      const response = await authAPI.updateProfile(userData);
      if (response.data.user) {
        const updatedUser = response.data.user;
        setUser(updatedUser);
        await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));
        setEditModalVisible(false);
        await loadStats();
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Loading profile...</ThemedText>
      </ThemedView>
    );
  }

  const menuItems = [
    {
      icon: "person-outline",
      title: "Edit Profile",
      onPress: () => setEditModalVisible(true),
    },
    {
      icon: "settings-outline",
      title: "Settings",
      onPress: () => Alert.alert("Coming Soon"),
    },
    {
      icon: "help-circle-outline",
      title: "Help & Support",
      onPress: () => Alert.alert("Coming Soon"),
    },
    {
      icon: "document-text-outline",
      title: "Terms & Privacy",
      onPress: () => Alert.alert("Coming Soon"),
    },
  ];

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Logo */}
        <ThemedView style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/techifydubai_cover.jpg")}
            style={styles.logoImage}
            contentFit="contain"
          />
        </ThemedView>

        {/* Profile Header */}
        <ThemedView style={styles.profileHeader}>
          <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
            {user.profile_picture ? (
              <Image
                source={{
                  uri: `${API_URL.replace(
                    /\/api\/?$/,
                    ""
                  )}/${user.profile_picture.replace(/^\/?/, "")}`,
                }}
                style={styles.avatarImage}
                contentFit="cover"
              />
            ) : (
              <ThemedView style={styles.avatar}>
                <ThemedText style={styles.avatarText}>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </ThemedText>
              </ThemedView>
            )}
          </TouchableOpacity>
          <ThemedText type="title" style={styles.userName}>
            {user.name}
          </ThemedText>
          <ThemedText style={styles.userEmail}>{user.email}</ThemedText>
          {user.phone && (
            <ThemedText style={styles.userPhone}>📱 {user.phone}</ThemedText>
          )}
        </ThemedView>

        {/* Stats */}
        <ThemedView style={styles.statsContainer}>
          {[
            {
              icon: "calendar",
              label: "Total Bookings",
              value: stats.totalBookings,
            },
            {
              icon: "checkmark-circle",
              label: "Completed",
              value: stats.completedBookings,
            },
            { 
              icon: "time", 
              label: "Pending", 
              value: stats.pendingBookings 
            },
          ].map((s, i) => (
            <ThemedView key={i} style={styles.statCard}>
              <Ionicons name={s.icon as any} size={24} color="#4A90E2" />
              <ThemedText style={styles.statNumber}>{s.value}</ThemedText>
              <ThemedText style={styles.statLabel}>{s.label}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>

        {/* Quick Actions */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Quick Actions
          </ThemedText>
          <ThemedView style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push("/(users)/(tabs)")}
            >
              <Ionicons name="add-circle" size={28} color="#4A90E2" />
              <ThemedText style={styles.actionText}>New Booking</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push("/(users)/(tabs)/bookings")}
            >
              <Ionicons name="list" size={28} color="#4A90E2" />
              <ThemedText style={styles.actionText}>My Bookings</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>

        {/* Menu Items */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Account
          </ThemedText>
          <ThemedView style={styles.menuContainer}>
            {menuItems.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.menuItem}
                onPress={item.onPress}
              >
                <ThemedView style={styles.menuItemLeft}>
                  <Ionicons name={item.icon as any} size={22} color="#666" />
                  <ThemedText style={styles.menuItemText}>
                    {item.title}
                  </ThemedText>
                </ThemedView>
                <Ionicons name="chevron-forward" size={18} color="#999" />
              </TouchableOpacity>
            ))}
          </ThemedView>
        </ThemedView>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <ThemedText style={styles.logoutText}>Logout</ThemedText>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Profile Modal */}
      <EditProfileModal
        visible={editModalVisible}
        user={user}
        onClose={() => setEditModalVisible(false)}
        onSave={handleSaveProfile}
        saving={saving}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  logoContainer: { alignItems: "center", marginTop: 20, marginBottom: 20 },
  logoImage: { width: 200, height: 60 },
  profileHeader: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  avatarContainer: { marginBottom: 16 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: { width: 100, height: 100, borderRadius: 50 },
  avatarText: { fontSize: 32, color: "#fff", fontWeight: "bold" },
  userName: { fontSize: 24, marginBottom: 4 },
  userEmail: { fontSize: 16, color: "#666", marginBottom: 2 },
  userPhone: { fontSize: 14, color: "#666" },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  statCard: {
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 5,
  },
  statNumber: { fontSize: 20, marginTop: 4, marginBottom: 2 },
  statLabel: { fontSize: 12, color: "#666", textAlign: "center" },
  section: { marginBottom: 24, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, marginBottom: 16 },
  actionsGrid: { flexDirection: "row", justifyContent: "space-between" },
  actionCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 5,
  },
  actionText: { marginTop: 8, fontSize: 14, fontWeight: "500" },
  menuContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuItemLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  menuItemText: { fontSize: 16 },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: "#fef2f2",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  logoutText: { fontSize: 16, fontWeight: "600", color: "#ef4444" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});