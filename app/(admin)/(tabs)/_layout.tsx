import { useAuth } from "@/api/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function AdminTabsLayout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { logout, user } = useAuth();
  const [activeRoute, setActiveRoute] = useState("dashboard");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    {
      key: "dashboard",
      title: "Dashboard",
      icon: "speedometer",
      route: "/(admin)/(tabs)/dashboard",
    },
    {
      key: "bookings",
      title: "Bookings",
      icon: "calendar",
      route: "/(admin)/(tabs)/bookings",
    },
    {
      key: "users",
      title: "Users",
      icon: "people",
      route: "/(admin)/(tabs)/users",
    },
    {
      key: "services",
      title: "Services",
      icon: "construct",
      route: "/(admin)/(tabs)/services",
    },
    {
      key: "service_types",
      title: "Service Types",
      icon: "bar-chart",
      route: "/(admin)/(tabs)/service-types",
    },
  ];

  const handleLogoutConfirm = () => {
    setShowLogoutModal(true);
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const CustomDrawerContent = (props: any) => {
    return (
      <View style={[styles.drawerContainer, { paddingTop: insets.top + 20 }]}>
        {/* Header */}
        <View style={styles.drawerHeader}>
          <LinearGradient
            colors={["#fff", "#ffff", "#fff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoContainer}
          >
            <Image
              style={styles.logoImage}
              source={require("@/assets/images/download.png")}
              resizeMode="contain"
            />
          </LinearGradient>

          <View style={styles.headerText}>
            <Text style={styles.companyName}>GoFix</Text>
            <Text style={styles.companySubtitle}>Admin Panel</Text>
            {user && <Text style={styles.userEmail}>{user.email}</Text>}
          </View>
        </View>

        {/* Navigation Items */}
        <ScrollView
          style={styles.menuContainer}
          showsVerticalScrollIndicator={false}
        >
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.menuItem,
                activeRoute === item.key && styles.menuItemActive,
              ]}
              onPress={() => {
                setActiveRoute(item.key);
                router.push(item.route as any);
                props.navigation.closeDrawer();
              }}
            >
              <View style={styles.menuItemContent}>
                <Ionicons
                  name={item.icon as any}
                  size={22}
                  color={activeRoute === item.key ? "#4f46e5" : "#6b7280"}
                />
                <Text
                  style={[
                    styles.menuItemText,
                    activeRoute === item.key && styles.menuItemTextActive,
                  ]}
                >
                  {item.title}
                </Text>
              </View>
              {activeRoute === item.key && (
                <View style={styles.activeIndicator} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Footer */}
        <View style={styles.drawerFooter}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogoutConfirm}
          >
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
          <Text style={styles.versionText}>v1.0.0</Text>
        </View>

        {/* Logout Confirmation Modal */}
        <Modal
          visible={showLogoutModal}
          transparent={true}
          animationType="fade"
          onRequestClose={handleCancelLogout}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Confirm Logout</Text>
                <Text style={styles.modalSubtitle}>
                  Are you sure you want to logout from the admin panel?
                </Text>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={handleCancelLogout}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.logoutModalButton]}
                  onPress={handleLogout}
                >
                  <Text style={styles.logoutModalButtonText}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#4f46e5" />
      <Drawer
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            width: width * 0.8,
            maxWidth: 320,
          },
          drawerType: Platform.OS === "web" ? "permanent" : "front",
          overlayColor: "transparent",
          swipeEnabled: Platform.OS !== "web",
        }}
        drawerContent={(props: any) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
            drawerLabel: "Dashboard",
          }}
        />
        <Drawer.Screen
          name="bookings"
          options={{
            title: "Bookings",
            drawerLabel: "Bookings",
          }}
        />
        <Drawer.Screen
          name="users"
          options={{
            title: "Users",
            drawerLabel: "Users",
          }}
        />
        <Drawer.Screen
          name="services"
          options={{
            title: "Services",
            drawerLabel: "Services",
          }}
        />
        <Drawer.Screen
          name="service-types"
          options={{
            title: "Service Types",
            drawerLabel: "Service Types",
          }}
        />
        
      </Drawer>
    </>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    overflow: "hidden",
    shadowColor: "#4f46e5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  logoImage: {
    width: "80%",
    height: "80%",
    borderRadius: 16,
  },

  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 28,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    backgroundColor: "#fff",
  },
  headerText: {
    flex: 1,
  },
  companyName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
  },
  companySubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  userEmail: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4,
  },
  menuContainer: {
    flex: 1,
    paddingVertical: 20,
  },
  menuItem: {
    marginHorizontal: 12,
    marginVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  menuItemActive: {
    backgroundColor: "#f8faff",
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6b7280",
    marginLeft: 12,
  },
  menuItemTextActive: {
    color: "#4f46e5",
    fontWeight: "600",
  },
  activeIndicator: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: "#4f46e5",
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#fef2f2",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ef4444",
    marginLeft: 12,
  },
  versionText: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  modalIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fef2f2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#fee2e2",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  cancelButton: {
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  logoutModalButton: {
    backgroundColor: "#ef4444",
    shadowColor: "#ef4444",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  logoutModalButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});
