import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ServiceStat } from '../types/dashboardTypes';
import ServiceTypeCard from './ServiceTypeCard';

interface ServiceDistributionProps {
  servicesStats: ServiceStat[];
  totalBookingsFromServices: number;
}

const ServiceDistribution: React.FC<ServiceDistributionProps> = ({
  servicesStats,
  totalBookingsFromServices,
}) => {
  if (!servicesStats || servicesStats.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Service Distribution</Text>
        <Text style={styles.totalBookingsText}>
          Total: {totalBookingsFromServices} bookings
        </Text>
      </View>
      <View style={styles.serviceTypesContainer}>
        {servicesStats.map((service, index) => (
          <ServiceTypeCard
            key={index}
            serviceType={service.service_type}
            count={service.booking_count}
            totalBookings={totalBookingsFromServices}
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
  totalBookingsText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  serviceTypesContainer: {
    gap: 12,
  },
});

export default ServiceDistribution;