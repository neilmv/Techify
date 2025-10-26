import { Ionicons } from '@expo/vector-icons';
import { Router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RecentBooking } from '../types/dashboardTypes';
import RecentBookingItem from './RecentBookingItem';

interface RecentBookingsProps {
  recentBookings: RecentBooking[];
  router: Router;
}

const RecentBookings: React.FC<RecentBookingsProps> = ({
  recentBookings,
  router,
}) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Bookings</Text>
        <TouchableOpacity onPress={() => router.push("/(admin)/(tabs)/bookings")}>
          <Text style={styles.seeAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.recentBookings}>
        {recentBookings && recentBookings.length > 0 ? (
          recentBookings
            .slice(0, 5)
            .map((booking, index) => (
              <RecentBookingItem
                key={booking.id || index}
                booking={booking}
                index={index}
              />
            ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color="#cbd5e1" />
            <Text style={styles.emptyStateText}>No recent bookings</Text>
            <Text style={styles.emptyStateSubtext}>
              Bookings will appear here once customers make appointments
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    padding: 24,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  seeAllText: {
    fontSize: 14,
    color: '#4f46e5',
    fontWeight: '500',
  },
  recentBookings: {
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#475569',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default RecentBookings;