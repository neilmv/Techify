import { LoadingState } from '@/app/(users)/components/home/LoadingState';
import { useRouter } from 'expo-router';
import React from 'react';
import { Animated, RefreshControl } from 'react-native';
import DashboardHeader from './components/DashboardHeader';
import PerformanceMetrics from './components/PerformanceMetrics';
import QuickActions from './components/QuickActions';
import RecentBookings from './components/RecentBookings';
import ServiceDistribution from './components/ServiceDistribution';
import StatsGrid from './components/StatsGrid';
import { useDashboardData } from './hooks/useDashboardData';
import { styles } from './styles/dashboardStyles';

export default function DashboardScreen() {
  const router = useRouter();
  const {
    stats,
    servicesStats,
    recentBookings,
    loading,
    refreshing,
    fetchDashboardData,
    onRefresh,
    fadeAnim
  } = useDashboardData();

  if (loading) {
    return <LoadingState />;
  }

  const totalBookingsFromServices = servicesStats.reduce(
    (total, service) => total + service.booking_count,
    0
  );

  return (
    <Animated.ScrollView
      style={[styles.container, { opacity: fadeAnim }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      <DashboardHeader pendingBookings={stats.pendingBookings} />
      
      <StatsGrid stats={stats} router={router} />
      
      <QuickActions router={router} />
      
      <ServiceDistribution 
        servicesStats={servicesStats}
        totalBookingsFromServices={totalBookingsFromServices}
      />
      
      <RecentBookings 
        recentBookings={recentBookings}
        router={router}
      />
      
      <PerformanceMetrics stats={stats} />
    </Animated.ScrollView>
  );
}