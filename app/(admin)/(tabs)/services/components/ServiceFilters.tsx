import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { TextInput, View } from 'react-native';
import { filterStyles } from '../styles/serviceStyles';
import { ServiceFilters as Filters, ServiceType } from '../types/service.types';

interface ServiceFiltersProps {
  filters: Filters;
  serviceTypes: ServiceType[];
  onFiltersChange: (filters: Filters) => void;
}

export const ServiceFilters: React.FC<ServiceFiltersProps> = ({
  filters,
  serviceTypes,
  onFiltersChange,
}) => {
  const updateFilter = (key: keyof Filters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <View style={filterStyles.filters}>
      <View style={filterStyles.filterRow}>
        <TextInput
          style={filterStyles.searchInput}
          placeholder="Search by brand or description..."
          value={filters.search}
          onChangeText={(value) => updateFilter('search', value)}
        />
        
        <View style={filterStyles.picker}>
          <Picker
            selectedValue={filters.service_type}
            onValueChange={(value) => updateFilter('service_type', value)}
            style={filterStyles.pickerInput}
          >
            <Picker.Item label="All Types" value="" />
            {serviceTypes.map(type => (
              <Picker.Item
                key={type.id}
                label={type.name}
                value={type.name}
              />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  );
};