import { adminAPI } from '@/api/api';
import { useEffect, useState } from 'react';
import { User, UserFilters, UsersResponse } from '../types/usersTypes';

export const useUsers = () => {
  const [state, setState] = useState({
    users: [] as User[],
    loading: true,
    error: null as string | null,
    filters: {
      search: '',
      sortBy: 'created_at' as const,
      sortOrder: 'desc' as const,
    } as UserFilters,
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalUsers: 0,
      hasNext: false,
      hasPrev: false,
    },
  });

  const fetchUsers = async (page: number = 1, search: string = '') => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await adminAPI.getUsers({ 
        page, 
        limit: 10, 
        search 
      });
      
      const data: UsersResponse = response.data;
      
      setState(prev => ({
        ...prev,
        users: data.users,
        pagination: data.pagination,
        loading: false,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.response?.data?.message || 'Failed to fetch users',
        loading: false,
      }));
    }
  };

  const updateFilters = (newFilters: Partial<UserFilters>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters },
    }));
  };

  const searchUsers = (searchTerm: string) => {
    updateFilters({ search: searchTerm });
    fetchUsers(1, searchTerm);
  };

  const refreshUsers = () => {
    fetchUsers(state.pagination.currentPage, state.filters.search);
  };

  const loadNextPage = () => {
    if (state.pagination.hasNext && !state.loading) {
      fetchUsers(state.pagination.currentPage + 1, state.filters.search);
    }
  };

  const loadPrevPage = () => {
    if (state.pagination.hasPrev && !state.loading) {
      fetchUsers(state.pagination.currentPage - 1, state.filters.search);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    ...state,
    fetchUsers,
    updateFilters,
    searchUsers,
    refreshUsers,
    loadNextPage,
    loadPrevPage,
  };
};