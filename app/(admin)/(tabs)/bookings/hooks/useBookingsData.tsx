import { adminAPI } from '@/api/api';
import { useEffect, useState } from 'react';
import { Booking, BookingsResponse, BookingStatus, Filters } from '../types/bookingsTypes';

export const useBookingsData = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    status: '',
    service_type: '',
    date_from: '',
    date_to: '',
    search: '',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBookings: 0,
    hasNext: false,
    hasPrev: false,
  });

  const fetchBookings = async (page: number = 1, filterParams: Filters = filters) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        ...filterParams,
      };

      const response = await adminAPI.getAllBookings(params);
      const data: BookingsResponse = response.data;

      setBookings(data.bookings);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const updateBookingStatus = async (bookingId: number, status: BookingStatus, adminNotes?: string) => {
    try {
      await adminAPI.updateBookingStatus(bookingId, { status, adminNotes });
      
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId ? { ...booking, status } : booking
      ));
      
      return true;
    } catch (error) {
      console.error('Error updating booking status:', error);
      return false;
    }
  };

  const applyFilters = (newFilters: Partial<Filters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    fetchBookings(1, updatedFilters);
  };

  const clearFilters = () => {
    const clearedFilters: Filters = {
      status: '',
      service_type: '',
      date_from: '',
      date_to: '',
      search: '',
    };
    setFilters(clearedFilters);
    fetchBookings(1, clearedFilters);
  };

  const loadMore = () => {
    if (pagination.hasNext && !loading) {
      fetchBookings(pagination.currentPage + 1, filters);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings(1, filters);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return {
    bookings,
    loading,
    refreshing,
    filters,
    pagination,
    fetchBookings,
    updateBookingStatus,
    applyFilters,
    clearFilters,
    loadMore,
    onRefresh,
  };
};