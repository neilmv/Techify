import { Router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { DashboardStats } from '../types/dashboardTypes';
import StatCard from './StatCard';

interface StatsGridProps {
  stats: DashboardStats;
  router: Router;
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats, router }) => {
  return (
    <View style={styles.statsGrid}>
      <View style={styles.row}>
        <View style={styles.cardContainer}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers?.toLocaleString() || '0'}
            change={12}
            icon="people-outline"
            color="#4f46e5"
            onPress={() => router.push('/(admin)/(tabs)/users')}
          />
        </View>
        <View style={styles.cardContainer}>
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings?.toLocaleString() || '0'}
            change={8}
            icon="calendar-outline"
            color="#10b981"
            onPress={() => router.push('/(admin)/(tabs)/bookings')}
          />
        </View>
        <View style={styles.cardContainer}>
          <StatCard
            title="Total Revenue"
            value={`₱${stats.totalRevenue.toLocaleString()}`}
            change={15}
            icon="cash-outline"
            color="#f59e0b"
            onPress={() => router.push('/(admin)/(tabs)/service-types')}
          />
        </View>
        <View style={styles.cardContainer}>
          <StatCard
            title="Pending Bookings"
            value={stats.pendingBookings?.toLocaleString() || '0'}
            change={-5}
            icon="time-outline"
            color="#ef4444"
            onPress={() => router.push('/(admin)/(tabs)/bookings')}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsGrid: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  cardContainer: {
    flex: 1,
    minWidth: 250, // Minimum width for each card
    maxWidth: 300, // Maximum width for each card
  },
});

export default StatsGrid;