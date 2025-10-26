import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RecentBooking } from '../types/dashboardTypes';

interface RecentBookingItemProps {
  booking: RecentBooking;
  index: number;
}
const goToBookings = () => {
  window.location.href = "/(admin)/(tabs)/bookings"
}
const RecentBookingItem: React.FC<RecentBookingItemProps> = ({ booking }) => {
  return (
    <TouchableOpacity
      style={styles.bookingItem}
      onPress={goToBookings}
    >
      <View style={styles.bookingAvatar}>
        <Text style={styles.bookingAvatarText}>
          {booking.customer_name?.charAt(0).toUpperCase() || "U"}
        </Text>
      </View>
      <View style={styles.bookingInfo}>
        <Text style={styles.bookingCustomer}>
          {booking.customer_name || "Unknown User"}
        </Text>
        <Text style={styles.bookingService}>
          {booking.service_type} - {booking.brand}
        </Text>
        <Text style={styles.bookingDate}>
          {new Date(booking.date).toLocaleDateString()} • {booking.time_slot}
        </Text>
        <Text style={styles.bookingIssue} numberOfLines={1}>
          {booking.issue_description || "No description provided"}
        </Text>
      </View>
      <View
        style={[
          styles.bookingStatus,
          {
            backgroundColor:
              booking.status === "Completed"
                ? "#10b981"
                : booking.status === "In Progress"
                ? "#f59e0b"
                : booking.status === "Confirmed"
                ? "#3b82f6"
                : "#6b7280",
          },
        ]}
      >
        <Text style={styles.bookingStatusText}>{booking.status}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bookingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  bookingAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bookingAvatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingCustomer: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  bookingService: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  bookingDate: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
  },
  bookingIssue: {
    fontSize: 12,
    color: '#cbd5e1',
    fontStyle: 'italic',
  },
  bookingStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  bookingStatusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
});

export default RecentBookingItem;