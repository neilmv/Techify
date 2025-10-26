export type BookingStatus = 'Pending' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';

export interface Booking {
  id: number;
  user_id: number;
  service_id: number;
  issue_description: string;
  date: string;
  time_slot: string;
  status: BookingStatus;
  created_at: string;
  admin_notes: string | null;
  customer_name: string;
  email: string;
  phone: string;
  profile_picture?: string;
  brand: string;
  base_price: number;
  service_type: string;
}

export interface BookingsResponse {
  bookings: Booking[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalBookings: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface Filters {
  status: string;
  service_type: string;
  date_from: string;
  date_to: string;
  search: string;
}