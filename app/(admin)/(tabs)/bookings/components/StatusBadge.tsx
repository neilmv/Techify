import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BookingStatus } from '../types/bookingsTypes';

interface StatusBadgeProps {
  status: BookingStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: BookingStatus) => {
    switch (status) {
      case 'Completed':
        return { color: '#059669', bgColor: '#d1fae5', icon: '✓' };
      case 'In Progress':
        return { color: '#d97706', bgColor: '#fef3c7', icon: '⚡' };
      case 'Confirmed':
        return { color: '#2563eb', bgColor: '#dbeafe', icon: '✓' };
      case 'Cancelled':
        return { color: '#dc2626', bgColor: '#fee2e2', icon: '✕' };
      default:
        return { color: '#6b7280', bgColor: '#f3f4f6', icon: '⏱' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <View style={[styles.badge, { backgroundColor: config.bgColor }]}>
      <Text style={[styles.badgeIcon, { color: config.color }]}>
        {config.icon}
      </Text>
      <Text style={[styles.badgeText, { color: config.color }]}>
        {status}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  badgeIcon: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});

export default StatusBadge;