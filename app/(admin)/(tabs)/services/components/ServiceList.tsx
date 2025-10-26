import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { Service } from '../types/service.types';
import { ServiceCard } from './ServiceCard';

interface ServiceListProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (serviceId: number) => void;
  refreshing: boolean;
  onRefresh: () => void;
}

export const ServiceList: React.FC<ServiceListProps> = ({
  services,
  onEdit,
  onDelete,
  refreshing,
  onRefresh,
}) => {
  return (
    <FlatList
      data={services}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ServiceCard
          service={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
      numColumns={3}
      columnWrapperStyle={{
        justifyContent: 'flex-start',
        paddingHorizontal: 12,
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#4f46e5']}
          tintColor="#4f46e5"
        />
      }
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ 
        paddingVertical: 8,
        paddingHorizontal: 4,
      }}
    />
  );
};