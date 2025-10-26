import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const EmptyState: React.FC = () => {
  return (
    <View style={styles.container}>
      <Ionicons name="calendar-outline" size={64} color="#cbd5e1" />
      <Text style={styles.title}>No Bookings Found</Text>
      <Text style={styles.subtitle}>
        There are no bookings matching your current filters.{'\n'}
        Try adjusting your search criteria or check back later.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#475569',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default EmptyState;