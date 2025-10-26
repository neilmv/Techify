import { adminAPI } from "@/api/api";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DashboardHeaderProps {
  pendingBookings: number;
}

interface PendingBooking {
  id: number;
  customer_name: string;
  email: string;
  phone?: string;
  service_type: string;
  brand: string;
  date: string;
  time: string;
  status: string;
  base_price: number;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  pendingBookings,
}) => {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [pendingBookingsList, setPendingBookingsList] = useState<
    PendingBooking[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("📡 Fetching pending bookings...");

      const response = await adminAPI.getAllBookings({
        status: "Pending",
        limit: 10,
      });

      console.log("✅ Pending bookings response:", response.data);
      setPendingBookingsList(response.data.bookings || []);
    } catch (err: any) {
      console.error("❌ Error fetching pending bookings:", err);
      setError("Failed to load pending bookings");
      setPendingBookingsList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationPress = async () => {
    if (!showNotifications) {
      await fetchPendingBookings();
    }
    setShowNotifications(!showNotifications);
  };

  const handleViewAllBookings = () => {
    setShowNotifications(false);
    if (Platform.OS === 'web') {
      window.location.href = '/(admin)/(tabs)/bookings';
    } else {
      router.push("/(admin)/(tabs)/bookings");
    }
  };

  const handleBookingPress = (bookingId: number) => {
    setShowNotifications(false);
    if (Platform.OS === 'web') {
      window.location.href = `/(admin)/(tabs)/bookings?booking=${bookingId}`;
    } else {
      router.push(`/(admin)/(tabs)/bookings?booking=${bookingId}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    if (!showNotifications) return;

    const handleClickOutside = (event: MouseEvent) => {
      const popup = document.querySelector('[data-notification-popup]');
      const button = document.querySelector('[data-notification-button]');
      
      if (
        popup && 
        button &&
        !popup.contains(event.target as Node) &&
        !button.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  const Backdrop = () => (
    <TouchableOpacity
      style={styles.backdrop}
      activeOpacity={1}
      onPress={() => setShowNotifications(false)}
    />
  );

  return (
    <View style={styles.headerContainer}>
      <LinearGradient
        colors={['#4f46e5', '#6366f1']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Dashboard</Text>
            <Text style={styles.headerSubtitle}>
              Overview of your business performance
            </Text>
          </View>

          <View style={styles.notificationContainer}>
            <TouchableOpacity
              style={styles.notificationButton}
              onPress={handleNotificationPress}
              data-notification-button="true"
            >
              <Ionicons name="notifications-outline" size={24} color="#fff" />
              {pendingBookings > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {pendingBookings > 99 ? "99+" : pendingBookings}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {showNotifications && Platform.OS !== 'web' && <Backdrop />}

            {/* Notification Popup */}
            {showNotifications && (
              <View style={styles.notificationPopup} data-notification-popup="true">
                {/* Header */}
                <View style={styles.popupHeader}>
                  <Text style={styles.popupTitle}>Pending Bookings</Text>
                  <Text style={styles.pendingCount}>
                    {pendingBookingsList.length} pending
                  </Text>
                </View>

                {/* Bookings List */}
                <ScrollView
                  style={styles.bookingsList}
                  showsVerticalScrollIndicator={false}
                >
                  {loading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color="#4f46e5" />
                      <Text style={styles.loadingText}>Loading bookings...</Text>
                    </View>
                  ) : error ? (
                    <View style={styles.errorContainer}>
                      <Ionicons
                        name="alert-circle-outline"
                        size={32}
                        color="#ef4444"
                      />
                      <Text style={styles.errorText}>{error}</Text>
                    </View>
                  ) : pendingBookingsList.length > 0 ? (
                    pendingBookingsList.map((booking) => (
                      <TouchableOpacity
                        key={booking.id}
                        style={styles.bookingItem}
                        onPress={() => handleBookingPress(booking.id)}
                      >
                        <View style={styles.bookingIcon}>
                          <Ionicons
                            name="calendar-outline"
                            size={16}
                            color="#4f46e5"
                          />
                        </View>
                        <View style={styles.bookingInfo}>
                          <Text style={styles.customerName}>
                            {booking.customer_name}
                          </Text>
                          <Text style={styles.serviceType}>
                            {booking.service_type} • {booking.brand}
                          </Text>
                          <Text style={styles.bookingTime}>
                            {formatDate(booking.date)} • {formatTime(booking.time)}
                          </Text>
                          {booking.phone && (
                            <Text style={styles.phoneText}>📞 {booking.phone}</Text>
                          )}
                        </View>
                        <View style={styles.bookingStatus}>
                          <View style={styles.pendingDot} />
                          <Text style={styles.statusText}>Pending</Text>
                        </View>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <View style={styles.emptyState}>
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={48}
                        color="#cbd5e1"
                      />
                      <Text style={styles.emptyStateTitle}>
                        No Pending Bookings
                      </Text>
                      <Text style={styles.emptyStateText}>
                        All bookings are up to date!
                      </Text>
                    </View>
                  )}
                </ScrollView>

                {/* Footer */}
                {pendingBookingsList.length > 0 && !loading && !error && (
                  <TouchableOpacity
                    style={styles.viewAllButton}
                    onPress={handleViewAllBookings}
                  >
                    <Text style={styles.viewAllText}>View All Bookings</Text>
                    <Ionicons name="arrow-forward" size={16} color="#4f46e5" />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
      </LinearGradient>

      {/* Global backdrop for web */}
      {showNotifications && Platform.OS === 'web' && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9998,
            backgroundColor: 'transparent'
          }}
          onClick={() => setShowNotifications(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'relative',
    zIndex: 10000,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    position: 'relative',
    zIndex: 10001,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e0e7ff',
    marginTop: 4,
  },
  notificationContainer: {
    position: "relative",
    zIndex: 10002,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: "relative",
    cursor: "pointer",
    zIndex: 10003,
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: "#4f46e5",
    zIndex: 10004,
  },
  notificationBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 9999,
  },
  notificationPopup: {
    position: "absolute",
    top: 55,
    right: 0,
    width: 380,
    maxHeight: 450,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    overflow: "hidden",
    zIndex: 10005,
  },
  popupHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    backgroundColor: "#fafafa",
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  pendingCount: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  bookingsList: {
    maxHeight: 320,
  },
  bookingItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    cursor: "pointer",
  },
  bookingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f8faff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  bookingInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 2,
  },
  serviceType: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 2,
  },
  bookingTime: {
    fontSize: 12,
    color: "#94a3b8",
    marginBottom: 2,
  },
  phoneText: {
    fontSize: 12,
    color: "#64748b",
  },
  bookingStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  pendingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#f59e0b",
    marginRight: 4,
  },
  statusText: {
    fontSize: 11,
    color: "#f59e0b",
    fontWeight: "500",
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: "#64748b",
  },
  errorContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    marginTop: 8,
    fontSize: 14,
    color: "#ef4444",
    textAlign: "center",
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748b",
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    backgroundColor: "#fafafa",
    cursor: "pointer",
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4f46e5",
    marginRight: 8,
  },
});

export default DashboardHeader;