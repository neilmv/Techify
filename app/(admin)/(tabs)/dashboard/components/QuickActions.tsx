import { Router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QuickAction from './QuickAction';

interface QuickActionsProps {
  router: Router;
}

const QuickActions: React.FC<QuickActionsProps> = ({ router }) => {
  const quickActions = [
    {
      title: "Manage Bookings",
      description: "View and update bookings",
      icon: "calendar",
      color: "#4f46e5",
      onPress: () => router.push("/(admin)/(tabs)/bookings"),
    },
    {
      title: "User Management",
      description: "Manage system users",
      icon: "people",
      color: "#10b981",
      onPress: () => router.push("/(admin)/(tabs)/users"),
    },
    {
      title: "Service Catalog",
      description: "Manage repair services",
      icon: "construct",
      color: "#f59e0b",
      onPress: () => router.push("/(admin)/(tabs)/services"),
    },
    {
      title: "Revenue Analytics",
      description: "View business insights",
      icon: "bar-chart",
      color: "#ef4444",
      onPress: () => router.push("/(admin)/(tabs)/analytics"),
    },
  ];

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.quickActionsGrid}>
        {quickActions.map((action, index) => (
          <QuickAction
            key={index}
            title={action.title}
            description={action.description}
            icon={action.icon}
            color={action.color}
            onPress={action.onPress}
          />
        ))}
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
  quickActionsGrid: {
    gap: 12,
  },
});

export default QuickActions;