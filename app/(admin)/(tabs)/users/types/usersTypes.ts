export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  role: number;
  profile_picture: string | null;
  created_at: string;
  bookings_count?: number;
  last_booking_date?: string;
}

export interface UsersResponse {
  users: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface UserFilters {
  search: string;
  sortBy: 'name' | 'email' | 'created_at' | 'bookings_count';
  sortOrder: 'asc' | 'desc';
}