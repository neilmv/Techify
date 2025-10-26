import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ServiceTypeCard } from './components/ServiceTypeCard';
import { ServiceTypeModal } from './components/ServiceTypeModal';
import { useServiceTypes } from './hooks/useServiceTypes';
import { ServiceType, ServiceTypeFormData } from './types/serviceTypes';



export default function ServiceTypesScreen() {
  const {
    serviceTypes,
    loading,
    refreshing,
    submitting,
    loadServiceTypes,
    createServiceType,
    updateServiceType,
    deleteServiceType,
    onRefresh,
  } = useServiceTypes();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingServiceType, setEditingServiceType] = useState<ServiceType | null>(null);
  const [formData, setFormData] = useState<ServiceTypeFormData>({
    name: '',
    description: ''
  });

  useEffect(() => {
    loadServiceTypes();
  }, []);

  const handleCreate = () => {
    setEditingServiceType(null);
    setFormData({ name: '', description: '' });
    setModalVisible(true);
  };

  const handleEdit = (serviceType: ServiceType) => {
    setEditingServiceType(serviceType);
    setFormData({
      name: serviceType.name,
      description: serviceType.description
    });
    setModalVisible(true);
  };

  const handleDelete = async (serviceType: ServiceType) => {
    await deleteServiceType(serviceType.id);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Service type name is required');
      return;
    }

    let success = false;
    
    if (editingServiceType) {
      success = await updateServiceType(editingServiceType.id, formData);
    } else {
      success = await createServiceType(formData);
    }

    if (success) {
      setModalVisible(false);
      setFormData({ name: '', description: '' });
      setEditingServiceType(null);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingServiceType(null);
    setFormData({ name: '', description: '' });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={styles.loadingText}>Loading service types...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#4f46e5', '#6366f1']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Service Types</Text>
            <Text style={styles.headerSubtitle}>
              Manage your service categories and types
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleCreate}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {serviceTypes.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="construct-outline" size={64} color="#9ca3af" />
            <Text style={styles.emptyStateTitle}>No Service Types</Text>
            <Text style={styles.emptyStateText}>
              Get started by creating your first service type
            </Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={handleCreate}
            >
              <Text style={styles.emptyStateButtonText}>Create Service Type</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.grid}>
            {serviceTypes.map((serviceType) => (
              <ServiceTypeCard
                key={serviceType.id}
                serviceType={serviceType}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Modal */}
      <ServiceTypeModal
        visible={modalVisible}
        editingServiceType={editingServiceType}
        formData={formData}
        submitting={submitting}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        onFormDataChange={setFormData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e0e7ff',
    marginTop: 4,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: 400,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  emptyStateButton: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  grid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});