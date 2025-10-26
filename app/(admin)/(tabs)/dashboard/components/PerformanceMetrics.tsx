import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DashboardStats } from '../types/dashboardTypes';

interface PerformanceMetricsProps {
  stats: DashboardStats;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ stats }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Performance Metrics</Text>
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Ionicons name="checkmark-done" size={24} color="#10b981" />
          <Text style={styles.metricValue}>
            {stats.totalBookings > 0
              ? Math.round((stats.pendingBookings / stats.totalBookings) * 100)
              : 0}
            %
          </Text>
          <Text style={styles.metricLabel}>Pending Rate</Text>
        </View>
        <View style={styles.metricCard}>
          <Ionicons name="time" size={24} color="#f59e0b" />
          <Text style={styles.metricValue}>{stats.totalBookings}</Text>
          <Text style={styles.metricLabel}>Total Bookings</Text>
        </View>
        <View style={styles.metricCard}>
          <Ionicons name="star" size={24} color="#f59e0b" />
          <Text style={styles.metricValue}>{stats.totalUsers}</Text>
          <Text style={styles.metricLabel}>Active Users</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    padding: 24,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 8,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
});

export default PerformanceMetrics;