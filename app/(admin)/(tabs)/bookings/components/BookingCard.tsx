import { API_URL } from "@/api/api";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Toast } from "../../../../../components/Toast";
import { Booking, BookingStatus } from "../types/bookingsTypes";
import StatusBadge from "./StatusBadge";
interface BookingCardProps {
  booking: Booking;
  onUpdateStatus: (
    bookingId: number,
    status: BookingStatus,
    adminNotes?: string
  ) => Promise<boolean>;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onUpdateStatus,
}) => {
  const [updating, setUpdating] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const statusOptions: { label: string; value: BookingStatus; icon: string }[] =
    [
      { label: "Pending", value: "Pending", icon: "time-outline" },
      {
        label: "Confirmed",
        value: "Confirmed",
        icon: "checkmark-circle-outline",
      },
      { label: "In Progress", value: "In Progress", icon: "build-outline" },
      {
        label: "Completed",
        value: "Completed",
        icon: "checkmark-done-outline",
      },
      { label: "Cancelled", value: "Cancelled", icon: "close-circle-outline" },
    ];

  const handleStatusUpdate = async (newStatus: BookingStatus) => {
    setUpdating(true);
    const success = await onUpdateStatus(booking.id, newStatus);
    setUpdating(false);
    setShowActions(false);

    if (success) {
      setToastMessage(`✅ Status updated to ${newStatus}`);
      setToastType("success");
      setShowToast(true);
    } else {
      setToastMessage("❌ Failed to update booking status");
      setToastType("error");
      setShowToast(true);
    }
  };

  const toggleActions = () => {
    if (showActions) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setShowActions(false));
    } else {
      setShowActions(true);
      Animated.timing(animation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case "Laptop Repair":
        return "laptop-outline";
      case "Phone Repair":
        return "phone-portrait-outline";
      case "Desktop Repair":
        return "desktop-outline";
      case "Appliance Repair":
        return "hardware-chip-outline";
      default:
        return "construct-outline";
    }
  };

  const actionMenuScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const actionMenuOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.card}>
      <Toast
        message={toastMessage}
        visible={showToast}
        type={toastType}
        onHide={() => setShowToast(false)}
      />
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.customerInfo}>
          <View style={styles.avatar}>
            {booking.profile_picture ? (
              <Image
                source={{
                  uri: `${API_URL.replace(/\/api$/, "")}${
                    booking.profile_picture
                  }`,
                }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <Text style={styles.avatarText}>
                {booking.customer_name?.charAt(0).toUpperCase() || "C"}
              </Text>
            )}
          </View>
          <View style={styles.customerDetails}>
            <Text style={styles.customerName}>{booking.customer_name}</Text>
            <Text style={styles.customerEmail}>{booking.email}</Text>
          </View>
        </View>
        <StatusBadge status={booking.status} />
      </View>

      {/* Service Details */}
      <View style={styles.serviceSection}>
        <View style={styles.serviceInfo}>
          <View style={styles.serviceIcon}>
            <Ionicons
              name={getServiceIcon(booking.service_type)}
              size={20}
              color="#4f46e5"
            />
          </View>
          <View style={styles.serviceDetails}>
            <Text style={styles.serviceText}>{booking.service_type}</Text>
            <Text style={styles.brandText}>{booking.brand}</Text>
          </View>
        </View>
        <Text style={styles.price}>₱{booking.base_price.toLocaleString()}</Text>
      </View>

      {/* Booking Details */}
      <View style={styles.detailsSection}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#64748b" />
          <Text style={styles.detailText}>
            {formatDate(booking.date)} • {booking.time_slot}
          </Text>
        </View>

        {booking.issue_description && (
          <View style={styles.detailRow}>
            <Ionicons name="document-text-outline" size={16} color="#64748b" />
            <Text style={styles.issueText} numberOfLines={2}>
              {booking.issue_description}
            </Text>
          </View>
        )}

        <View style={styles.detailRow}>
          <Ionicons name="call-outline" size={16} color="#64748b" />
          <Text style={styles.detailText}>
            {booking.phone || "No phone provided"}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsSection}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={toggleActions}
          disabled={updating}
        >
          <Ionicons name="ellipsis-horizontal" size={20} color="#64748b" />
        </TouchableOpacity>

        {showActions && (
          <Animated.View
            style={[
              styles.actionsMenu,
              {
                opacity: actionMenuOpacity,
                transform: [{ scale: actionMenuScale }],
              },
            ]}
          >
            {statusOptions
              .filter((option) => option.value !== booking.status)
              .map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.actionMenuItem}
                  onPress={() => handleStatusUpdate(option.value)}
                  disabled={updating}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={18}
                    color="#4f46e5"
                  />
                  <Text style={styles.actionMenuText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
          </Animated.View>
        )}
      </View>

      {updating && (
        <View style={styles.updatingOverlay}>
          <View style={styles.updatingContent}>
            <Ionicons name="refresh" size={20} color="#4f46e5" />
            <Text style={styles.updatingText}>Updating status...</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    overflow: "visible",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  customerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#4f46e5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowColor: "#4f46e5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 2,
  },
  customerEmail: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  serviceSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  serviceInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  serviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#eef2ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  serviceDetails: {
    flex: 1,
  },
  serviceText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 2,
  },
  brandText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#059669",
  },
  detailsSection: {
    gap: 12,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  detailText: {
    fontSize: 14,
    color: "#64748b",
    marginLeft: 8,
    flex: 1,
    fontWeight: "500",
  },
  issueText: {
    fontSize: 14,
    color: "#64748b",
    marginLeft: 8,
    flex: 1,
    fontStyle: "italic",
    fontWeight: "500",
  },
  actionsSection: {
    position: "relative",
    zIndex: 1,
  },
  actionButton: {
    alignSelf: "flex-end",
    padding: 8,
    borderRadius: 10,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    zIndex: 2,
  },
  actionsMenu: {
    position: "absolute",
    top: -160,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    zIndex: 10,
    minWidth: 180,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  actionMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  actionMenuText: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 10,
    fontWeight: "500",
  },
  updatingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
  },
  updatingContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  updatingText: {
    fontSize: 14,
    color: "#4f46e5",
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default BookingCard;