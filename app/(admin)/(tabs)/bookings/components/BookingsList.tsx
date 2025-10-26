import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Booking, BookingStatus } from '../types/bookingsTypes';
import BookingCard from './BookingCard';
import EmptyState from './EmptyState';

interface BookingsListProps {
  bookings: Booking[];
  loading: boolean;
  refreshing: boolean;
  pagination: {
    hasNext: boolean;
    hasPrev: boolean;
    totalBookings: number;
  };
  onRefresh: () => void;
  onLoadMore: () => void;
  onUpdateStatus: (bookingId: number, status: BookingStatus, adminNotes?: string) => Promise<boolean>;
}

const BookingsList: React.FC<BookingsListProps> = ({
  bookings,
  loading,
  refreshing,
  pagination,
  onRefresh,
  onLoadMore,
  onUpdateStatus,
}) => {
  const renderBookingItem = ({ item }: { item: Booking }) => (
    <BookingCard booking={item} onUpdateStatus={onUpdateStatus} />
  );

  const renderFooter = () => {
    if (!pagination.hasNext) {
      return (
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Showing {bookings.length} of {pagination.totalBookings} bookings
          </Text>
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={styles.loadMoreButton}
        onPress={onLoadMore}
        disabled={loading}
      >
        <Text style={styles.loadMoreText}>
          {loading ? 'Loading more bookings...' : 'Load More Bookings'}
        </Text>
      </TouchableOpacity>
    );
  };

  if (bookings.length === 0 && !loading) {
    return <EmptyState />;
  }

  return (
    <FlatList
      data={bookings}
      renderItem={renderBookingItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      refreshing={refreshing}
      onRefresh={onRefresh}
      ListFooterComponent={renderFooter}
      ListHeaderComponent={() => (
        <View style={styles.listHeader}>
          <Text style={styles.resultsText}>
            {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'} found
          </Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  listHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  resultsText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    textAlign: 'center',
  },
  loadMoreButton: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  loadMoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4f46e5',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
});

export default BookingsList;