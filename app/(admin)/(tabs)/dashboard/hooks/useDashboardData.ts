import { adminAPI } from '@/api/api';
import { useEffect, useState } from 'react';
import { Animated } from 'react-native';
import { DashboardStats, RecentBooking, ServiceStat } from '../types/dashboardTypes';

export const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
  });
  const [servicesStats, setServicesStats] = useState<ServiceStat[]>([]);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const fetchDashboardData = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      console.log('API Response:', response.data);

      const apiData = response.data;

      setStats({
        totalUsers: apiData.stats.totalUsers || 0,
        totalBookings: apiData.stats.totalBookings || 0,
        totalRevenue: parseFloat(apiData.stats.totalRevenue) || 0,
        pendingBookings: apiData.stats.pendingBookings || 0,
      });

      setServicesStats(apiData.servicesStats || []);
      setRecentBookings(apiData.recentBookings || []);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  return {
    stats,
    servicesStats,
    recentBookings,
    loading,
    refreshing,
    fetchDashboardData,
    onRefresh,
    fadeAnim,
  };
};