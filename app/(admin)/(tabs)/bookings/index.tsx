import React from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';

import { useBookingsData } from './hooks/useBookingsData';

import BookingsHeader from './components/BookingHeader';
import BookingsList from './components/BookingsList';
import FiltersBar from './components/FiltersBar';
import LoadingState from './components/LoadingState';
import { styles } from './styles/bookingStyles';

const BookingsScreen = () => {
  const {
    bookings,
    loading,
    refreshing,
    filters,
    pagination,
    updateBookingStatus,
    applyFilters,
    clearFilters,
    loadMore,
    onRefresh,
  } = useBookingsData();

  if (loading && bookings.length === 0) {
    return <LoadingState />;
  }

  return (
    <View style={styles.container}>
      <BookingsHeader
        totalBookings={pagination.totalBookings}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
      
      <FiltersBar
        filters={filters}
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#4f46e5"
            colors={['#4f46e5']}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <BookingsList
          bookings={bookings}
          loading={loading}
          refreshing={refreshing}
          pagination={pagination}
          onRefresh={onRefresh}
          onLoadMore={loadMore}
          onUpdateStatus={updateBookingStatus}
        />
      </ScrollView>
    </View>
  );
};

export default BookingsScreen;