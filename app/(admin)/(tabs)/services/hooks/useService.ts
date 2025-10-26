import { adminAPI } from '@/api/api';
import { useEffect, useState } from 'react';
import { Service, ServiceFilters, ServiceType } from '../types/service.types';

export const useServices = () => {
  const [state, setState] = useState({
    services: [] as Service[],
    serviceTypes: [] as ServiceType[],
    loading: true,
    error: null as string | null,
    filters: {
      search: '',
      service_type: '',
    } as ServiceFilters,
  });

  const fetchServices = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await adminAPI.getServices();
      setState(prev => ({ 
        ...prev, 
        services: response.data.services || [],
        loading: false 
      }));
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        error: error.response?.data?.message || 'Failed to fetch services',
        loading: false 
      }));
    }
  };

  const fetchServiceTypes = async () => {
    try {
      const response = await adminAPI.getServiceTypes();
      setState(prev => ({ 
        ...prev, 
        serviceTypes: response.data || []
      }));
    } catch (error: any) {
      console.error('Error fetching service types:', error);
      setState(prev => ({ 
        ...prev, 
        serviceTypes: [] 
      }));
    }
  };

  const updateFilters = (newFilters: Partial<ServiceFilters>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters }
    }));
  };

  const getFilteredServices = () => {
    const { services, filters } = state;
    return services.filter(service => {
      const matchesSearch = !filters.search || 
        service.brand.toLowerCase().includes(filters.search.toLowerCase()) ||
        service.description.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesType = !filters.service_type || 
        service.service_type === filters.service_type;

      return matchesSearch && matchesType;
    });
  };

  useEffect(() => {
    fetchServices();
    fetchServiceTypes();
  }, []);

  return {
    ...state,
    filteredServices: getFilteredServices(),
    fetchServices,
    updateFilters,
  };
};