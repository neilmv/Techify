import { API } from "@/api/api";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
} from "react-native";

interface Booking {
  id: number;
  customer_name: string;
  brand: string;
  service_type: string;
  issue_description: string;
  date: string;
  time_slot: string;
  status: string;
  created_at: string;
}

export default function BookingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus();
    fetchBookings();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      setUserToken(token);
    } catch (error) {
      console.error("Error checking auth status:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await API.get("/bookings");
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      Alert.alert("Error", "Failed to load bookings");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "#10b981";
      case "in progress":
        return "#f59e0b";
      case "confirmed":
        return "#3b82f6";
      case "cancelled":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "checkmark-circle";
      case "in progress":
        return "build";
      case "confirmed":
        return "checkmark-done";
      case "cancelled":
        return "close-circle";
      default:
        return "time";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <ThemedView style={styles.bookingCard}>
      <ThemedView style={styles.bookingHeader}>
        <ThemedView style={styles.serviceInfo}>
          <ThemedText type="defaultSemiBold" style={styles.brandText}>
            {booking.brand}
          </ThemedText>
          <ThemedText style={styles.serviceTypeText}>
            {booking.service_type}
          </ThemedText>
        </ThemedView>
        <ThemedView
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(booking.status) + "20" },
          ]}
        >
          <Ionicons
            name={getStatusIcon(booking.status) as any}
            size={16}
            color={getStatusColor(booking.status)}
          />
          <ThemedText
            style={[
              styles.statusText,
              { color: getStatusColor(booking.status) },
            ]}
          >
            {booking.status}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.bookingDetails}>
        <ThemedView style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <ThemedText style={styles.detailText}>
            {formatDate(booking.date)} at {booking.time_slot}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.detailRow}>
          <Ionicons name="document-text-outline" size={16} color="#666" />
          <ThemedText style={styles.detailText} numberOfLines={2}>
            {booking.issue_description}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.detailRow}>
          <Ionicons name="person-outline" size={16} color="#666" />
          <ThemedText style={styles.detailText}>
            Booked by: {booking.customer_name}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.bookingFooter}>
        <ThemedText style={styles.dateText}>
          Created: {formatDate(booking.created_at)}
        </ThemedText>
        <TouchableOpacity style={styles.detailsButton}>
          <ThemedText style={styles.detailsButtonText}>View Details</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>
          Loading your bookings...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: colorScheme === "dark" ? "#000" : "#fff" },
      ]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header with background */}
      <ThemedView style={[styles.headerContainer]}>
        <Image
          source={require("@/assets/images/techifydubai_cover.jpg")}
          style={styles.logoImage}
          contentFit="contain"
        />
        <ThemedView style={styles.headerContent}>
          <ThemedText type="title" style={styles.headerTitle}>
            My Bookings
          </ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Manage and track your repair appointments
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.content}>
        {bookings.length === 0 ? (
          <ThemedView style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color="#9ca3af" />
            <ThemedText type="subtitle" style={styles.emptyTitle}>
              No Bookings Yet
            </ThemedText>
            <ThemedText style={styles.emptyText}>
              You haven't made any bookings yet. Start by booking a repair
              service!
            </ThemedText>
            <TouchableOpacity
              style={styles.bookNowButton}
              onPress={() => router.push("/(tabs)")}
            >
              <ThemedText style={styles.bookNowButtonText}>
                Book a Service
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        ) : (
          <ThemedView style={styles.bookingsContainer}>
            <ThemedView style={styles.statsContainer}>
              <ThemedView style={styles.statCard}>
                <ThemedText type="defaultSemiBold" style={styles.statNumber}>
                  {bookings.length}
                </ThemedText>
                <ThemedText style={styles.statLabel}>Total Bookings</ThemedText>
              </ThemedView>
              <ThemedView style={styles.statCard}>
                <ThemedText type="defaultSemiBold" style={styles.statNumber}>
                  {bookings.filter((b) => b.status === "Completed").length}
                </ThemedText>
                <ThemedText style={styles.statLabel}>Completed</ThemedText>
              </ThemedView>
            </ThemedView>

            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Recent Bookings
            </ThemedText>

            <ThemedView style={styles.bookingsList}>
              {bookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </ThemedView>
          </ThemedView>
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 200,
    overflow: "hidden",
    position: "relative",
  },
  headerImage: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
    opacity: 0.8,
  },
  headerContent: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 28,
    marginBottom: 8,
  },
  headerSubtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 16,
  },
  content: {
    padding: 20,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#fff",
    minHeight: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: "center",
    padding: 40,
    marginTop: 20,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  bookNowButton: {
    backgroundColor: "#4A90E2",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  bookNowButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  bookingsContainer: {
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    color: "#4A90E2",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  sectionTitle: {
    marginBottom: 16,
    fontSize: 18,
  },
  bookingsList: {
    gap: 16,
  },
  bookingCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: "#4A90E2",
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  brandText: {
    fontSize: 18,
    marginBottom: 4,
  },
  serviceTypeText: {
    fontSize: 14,
    color: "#666",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  bookingDetails: {
    gap: 12,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    flex: 1,
    lineHeight: 20,
  },
  bookingFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  dateText: {
    fontSize: 12,
    color: "#999",
  },
  detailsButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
  },
  detailsButtonText: {
    fontSize: 14,
    color: "#4A90E2",
    fontWeight: "500",
  },
    headerContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 16,
  },
  logoImage: {
    width: "80%",
    maxWidth: 350,
    height: undefined,
    aspectRatio: 6,
    resizeMode: "contain",
  },
});
