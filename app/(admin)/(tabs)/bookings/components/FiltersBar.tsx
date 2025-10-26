import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { Filters } from '../types/bookingsTypes';

interface FiltersBarProps {
  filters: Filters;
  onApplyFilters: (filters: Partial<Filters>) => void;
  onClearFilters: () => void;
}

const FiltersBar: React.FC<FiltersBarProps> = ({
  filters,
  onApplyFilters,
  onClearFilters,
}) => {
  const [localFilters, setLocalFilters] = useState<Filters>(filters);
  const [showFilters, setShowFilters] = useState(false);
  const searchTimeoutRef = useRef<number | null>(null);

  const statusOptions = [
    { label: 'All Status', value: '', icon: 'list-outline' },
    { label: 'Pending', value: 'Pending', icon: 'time-outline' },
    { label: 'Confirmed', value: 'Confirmed', icon: 'checkmark-circle-outline' },
    { label: 'In Progress', value: 'In Progress', icon: 'build-outline' },
    { label: 'Completed', value: 'Completed', icon: 'checkmark-done-outline' },
    { label: 'Cancelled', value: 'Cancelled', icon: 'close-circle-outline' },
  ];

  const serviceTypeOptions = [
    { label: 'All Services', value: '', icon: 'construct-outline' },
    { label: 'Laptop Repair', value: 'Laptop Repair', icon: 'laptop-outline' },
    { label: 'Phone Repair', value: 'Phone Repair', icon: 'phone-portrait-outline' },
    { label: 'Desktop Repair', value: 'Desktop Repair', icon: 'desktop-outline' },
    { label: 'Appliance Repair', value: 'Appliance Repair', icon: 'hardware-chip-outline' },
  ];

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      onApplyFilters(localFilters);
    }, 500) as unknown as number;

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [localFilters.search]);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApply = () => {
    onApplyFilters(localFilters);
    setShowFilters(false);
  };

  const handleClear = () => {
    const clearedFilters = {
      status: '',
      service_type: '',
      date_from: '',
      date_to: '',
      search: '',
    };
    setLocalFilters(clearedFilters);
    onClearFilters();
    setShowFilters(false);
  };

  const handleSearchChange = (text: string) => {
    setLocalFilters(prev => ({ ...prev, search: text }));
  };

  const handleSearchSubmit = () => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    onApplyFilters(localFilters);
  };

  const handleClearSearch = () => {
    setLocalFilters(prev => ({ ...prev, search: '' }));
    onApplyFilters({ ...localFilters, search: '' });
  };

  const hasActiveFilters = filters.status || filters.service_type || filters.date_from || filters.date_to || filters.search;

  const activeFilterCount = [
    filters.status,
    filters.service_type,
    filters.date_from,
    filters.date_to,
    filters.search
  ].filter(Boolean).length;

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#94a3b8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search bookings, customers..."
            placeholderTextColor="#94a3b8"
            value={localFilters.search}
            onChangeText={handleSearchChange}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
          {localFilters.search ? (
            <TouchableOpacity
              onPress={handleClearSearch}
              style={styles.clearSearchButton}
            >
              <Ionicons name="close-circle" size={20} color="#94a3b8" />
            </TouchableOpacity>
          ) : null}
        </View>
        
        <View style={styles.filterButtonContainer}>
          <TouchableOpacity
            style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]}
            onPress={() => setShowFilters(true)}
          >
            <Ionicons 
              name="filter" 
              size={20} 
              color={hasActiveFilters ? '#fff' : '#4f46e5'} 
            />
            {hasActiveFilters && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Active Filters Indicator */}
      {hasActiveFilters && (
        <View style={styles.activeFiltersContainer}>
          <Text style={styles.activeFiltersText}>
            Active filters: {activeFilterCount}
          </Text>
          <TouchableOpacity onPress={handleClear}>
            <Text style={styles.clearAllText}>Clear all</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Filters Popover */}
      <Modal
        visible={showFilters}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFilters(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowFilters(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.popoverContainer}>
                {/* Popover Arrow */}
                <View style={styles.popoverArrow} />
                
                <View style={styles.popoverContent}>
                  <View style={styles.popoverHeader}>
                    <Text style={styles.popoverTitle}>Filters</Text>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setShowFilters(false)}
                    >
                      <Ionicons name="close" size={20} color="#64748b" />
                    </TouchableOpacity>
                  </View>

                  <ScrollView 
                    style={styles.popoverScroll}
                    showsVerticalScrollIndicator={false}
                  >
                    {/* Status Filter */}
                    <View style={styles.filterSection}>
                      <Text style={styles.filterSectionTitle}>Status</Text>
                      <View style={styles.optionsGrid}>
                        {statusOptions.map((option) => (
                          <TouchableOpacity
                            key={option.value}
                            style={[
                              styles.optionButton,
                              localFilters.status === option.value && styles.optionButtonActive,
                            ]}
                            onPress={() => setLocalFilters(prev => ({ ...prev, status: option.value }))}
                          >
                            <Ionicons 
                              name={option.icon as any} 
                              size={16} 
                              color={localFilters.status === option.value ? '#4f46e5' : '#64748b'} 
                            />
                            <Text
                              style={[
                                styles.optionButtonText,
                                localFilters.status === option.value && styles.optionButtonTextActive,
                              ]}
                            >
                              {option.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    {/* Service Type Filter */}
                    <View style={styles.filterSection}>
                      <Text style={styles.filterSectionTitle}>Service Type</Text>
                      <View style={styles.optionsGrid}>
                        {serviceTypeOptions.map((option) => (
                          <TouchableOpacity
                            key={option.value}
                            style={[
                              styles.optionButton,
                              localFilters.service_type === option.value && styles.optionButtonActive,
                            ]}
                            onPress={() => setLocalFilters(prev => ({ ...prev, service_type: option.value }))}
                          >
                            <Ionicons 
                              name={option.icon as any} 
                              size={16} 
                              color={localFilters.service_type === option.value ? '#4f46e5' : '#64748b'} 
                            />
                            <Text
                              style={[
                                styles.optionButtonText,
                                localFilters.service_type === option.value && styles.optionButtonTextActive,
                              ]}
                            >
                              {option.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </ScrollView>

                  <View style={styles.popoverActions}>
                    <TouchableOpacity 
                      style={styles.secondaryButton} 
                      onPress={handleClear}
                    >
                      <Text style={styles.secondaryButtonText}>Clear All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.primaryButton} 
                      onPress={handleApply}
                    >
                      <Text style={styles.primaryButtonText}>Apply</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '500',
  },
  clearSearchButton: {
    padding: 2,
  },
  filterButtonContainer: {
    position: 'relative',
  },
  filterButton: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  activeFiltersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 4,
  },
  activeFiltersText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  clearAllText: {
    fontSize: 14,
    color: '#4f46e5',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 100,
    paddingRight: 20,
  },
  popoverContainer: {
    position: 'relative',
    width: 320,
    maxHeight: 500,
  },
  popoverArrow: {
    position: 'absolute',
    top: -8,
    right: 20,
    width: 16,
    height: 16,
    backgroundColor: '#fff',
    transform: [{ rotate: '45deg' }],
    borderTopLeftRadius: 4,
  },
  popoverContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
    overflow: 'hidden',
  },
  popoverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  popoverTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  closeButton: {
    padding: 4,
  },
  popoverScroll: {
    maxHeight: 350,
  },
  filterSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    marginBottom: 8,
    minWidth: '48%',
  },
  optionButtonActive: {
    backgroundColor: '#eef2ff',
    borderColor: '#4f46e5',
  },
  optionButtonText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    marginLeft: 6,
  },
  optionButtonTextActive: {
    color: '#4f46e5',
    fontWeight: '600',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateInputContainer: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 6,
  },
  dateInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#0f172a',
  },
  popoverActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  secondaryButtonText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default FiltersBar;