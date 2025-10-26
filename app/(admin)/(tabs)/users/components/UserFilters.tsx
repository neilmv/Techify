import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { UserFilters as UserFiltersType } from '../types/usersTypes';

interface UserFiltersProps {
  filters: UserFiltersType;
  onFiltersChange: (filters: Partial<UserFiltersType>) => void;
  onSearch: (searchTerm: string) => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  filters,
  onFiltersChange,
  onSearch,
}) => {
  const [searchText, setSearchText] = React.useState(filters.search);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.length === 0 || text.length >= 3) {
      onSearch(text);
    }
  };

  const clearSearch = () => {
    setSearchText('');
    onSearch('');
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users by name or email..."
            placeholderTextColor="#94a3b8"
            value={searchText}
            onChangeText={handleSearch}
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <Ionicons name="close-circle" size={20} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filters.sortBy === 'created_at' && styles.filterButtonActive
          ]}
          onPress={() => onFiltersChange({ sortBy: 'created_at', sortOrder: 'desc' })}
        >
          <Ionicons 
            name="time" 
            size={16} 
            color={filters.sortBy === 'created_at' ? '#4f46e5' : '#64748b'} 
          />
          <Text style={[
            styles.filterButtonText,
            filters.sortBy === 'created_at' && styles.filterButtonTextActive
          ]}>
            Newest
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filters.sortBy === 'name' && styles.filterButtonActive
          ]}
          onPress={() => onFiltersChange({ sortBy: 'name', sortOrder: 'asc' })}
        >
          <Ionicons 
            name="person" 
            size={16} 
            color={filters.sortBy === 'name' ? '#4f46e5' : '#64748b'} 
          />
          <Text style={[
            styles.filterButtonText,
            filters.sortBy === 'name' && styles.filterButtonTextActive
          ]}>
            Name
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInputContainer: {
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
    fontSize: 16,
    color: '#0f172a',
    marginLeft: 12,
    marginRight: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: '#eef2ff',
    borderColor: '#4f46e5',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  filterButtonTextActive: {
    color: '#4f46e5',
  },
});

export default UserFilters;