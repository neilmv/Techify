import { adminAPI } from '@/api/api';
import { useState } from 'react';
import { Alert } from 'react-native';
import { CreateServiceData, Service, UpdateServiceData } from '../types/service.types';

export const useServiceMutations = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createService = async (data: CreateServiceData): Promise<Service | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.createService(data);
      Alert.alert('Success', 'Service created successfully');
      onSuccess?.();
      return response.data.service;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create service';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateService = async (id: number, data: UpdateServiceData): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await adminAPI.updateService(id, data);
      Alert.alert('Success', 'Service updated successfully');
      onSuccess?.();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update service';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await adminAPI.deleteService(id);
      Alert.alert('Success', 'Service deleted successfully');
      onSuccess?.();
    } catch (err: any) {
      console.log('Delete service error details:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });

      let errorMessage = 'Failed to delete service';
      
      if (err.response?.status === 400) {
        errorMessage = err.response?.data?.message || 'This service has existing bookings and cannot be deleted.';
      } else if (err.response?.status === 404) {
        errorMessage = 'Service not found';
      } else if (!err.response) {
        errorMessage = 'Network error. Please check your connection.';
      } else {
        errorMessage = err.response?.data?.message || 'Failed to delete service';
      }

      setError(errorMessage);
      Alert.alert('Error', errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createService,
    updateService,
    deleteService,
  };
};