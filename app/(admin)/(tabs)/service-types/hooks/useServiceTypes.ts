import { adminAPI } from '@/api/api';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { ServiceType, ServiceTypeFormData } from '../types/serviceTypes';


export const useServiceTypes = () => {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadServiceTypes = useCallback(async () => {
    try {
      const response = await adminAPI.fetchServiceTypes();
      setServiceTypes(response.data);
    } catch (error: any) {
      console.error('Error loading service types:', error);
      const errorMessage = error.response?.data?.message || 'Failed to load service types';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const createServiceType = useCallback(async (data: ServiceTypeFormData) => {
    setSubmitting(true);
    try {
      const response = await adminAPI.createServiceType(data);
      await loadServiceTypes();
      Alert.alert('Success', response.data.message || 'Service type created successfully');
      return true;
    } catch (error: any) {
      console.error('Error creating service type:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create service type';
      Alert.alert('Error', errorMessage);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [loadServiceTypes]);

  const updateServiceType = useCallback(async (id: number, data: ServiceTypeFormData) => {
    setSubmitting(true);
    try {
      const response = await adminAPI.updateServiceType(id, data);
      await loadServiceTypes();
      Alert.alert('Success', response.data.message || 'Service type updated successfully');
      return true;
    } catch (error: any) {
      console.error('Error updating service type:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update service type';
      Alert.alert('Error', errorMessage);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [loadServiceTypes]);

  const deleteServiceType = useCallback(async (id: number) => {
    try {
      await adminAPI.deleteServiceType(id);
      await loadServiceTypes();
      Alert.alert('Success', 'Service type deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error deleting service type:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete service type';
      Alert.alert('Error', errorMessage);
      return false;
    }
  }, [loadServiceTypes]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadServiceTypes();
  }, [loadServiceTypes]);

  return {
    serviceTypes,
    loading,
    refreshing,
    submitting,
    loadServiceTypes,
    createServiceType,
    updateServiceType,
    deleteServiceType,
    onRefresh,
  };
};