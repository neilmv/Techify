import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ServiceTypeCardProps {
  serviceType: string;
  count: number;
  totalBookings: number;
}

const ServiceTypeCard: React.FC<ServiceTypeCardProps> = ({
  serviceType,
  count,
  totalBookings,
}) => {
  const percentage = totalBookings > 0 ? (count / totalBookings) * 100 : 0;

  return (
    <View style={styles.serviceTypeCard}>
      <View style={styles.serviceTypeContent}>
        <Text style={styles.serviceTypeName}>{serviceType}</Text>
        <View style={styles.serviceTypeStats}>
          <Text style={styles.serviceTypeCount}>{count}</Text>
          <Text style={styles.serviceTypePercentage}>
            ({percentage.toFixed(0)}%)
          </Text>
        </View>
      </View>
      <View style={styles.serviceTypeBar}>
        <View
          style={[styles.serviceTypeProgress, { width: `${percentage}%` }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  serviceTypeCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  serviceTypeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceTypeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  serviceTypeStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  serviceTypeCount: {
    fontSize: 16,
    color: '#4f46e5',
    fontWeight: 'bold',
  },
  serviceTypePercentage: {
    fontSize: 12,
    color: '#64748b',
  },
  serviceTypeBar: {
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  serviceTypeProgress: {
    height: '100%',
    backgroundColor: '#4f46e5',
    borderRadius: 3,
  },
});

export default ServiceTypeCard;