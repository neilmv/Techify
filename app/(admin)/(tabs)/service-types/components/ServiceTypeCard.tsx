import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { ServiceType } from '../types/serviceTypes';


interface ServiceTypeCardProps {
  serviceType: ServiceType;
  onEdit: (serviceType: ServiceType) => void;
  onDelete: (serviceType: ServiceType) => void;
}

export const ServiceTypeCard: React.FC<ServiceTypeCardProps> = ({
  serviceType,
  onEdit,
  onDelete,
}) => {
  const handleDeletePress = () => {
    Alert.alert(
      'Delete Service Type',
      `Are you sure you want to delete "${serviceType.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(serviceType),
        },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Ionicons name="cube-outline" size={24} color="#4f46e5" />
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onEdit(serviceType)}
          >
            <Ionicons name="create-outline" size={18} color="#6b7280" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDeletePress}
          >
            <Ionicons name="trash-outline" size={18} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.cardTitle}>{serviceType.name}</Text>
      <Text style={styles.cardDescription}>
        {serviceType.description || 'No description provided'}
      </Text>
      
      <View style={styles.cardFooter}>
        <View style={styles.serviceCount}>
          <Ionicons name="stats-chart-outline" size={14} color="#9ca3af" />
          <Text style={styles.serviceCountText}>
            {serviceType.services_count || 0} services
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  serviceCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceCountText: {
    fontSize: 12,
    color: '#9ca3af',
    marginLeft: 4,
  },
});