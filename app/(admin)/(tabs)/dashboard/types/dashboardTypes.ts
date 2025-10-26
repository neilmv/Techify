export interface DashboardStats {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  pendingBookings: number;
}

export interface ServiceStat {
  service_type: string;
  booking_count: number;
}

export interface RecentBooking {
  id: number;
  user_id: number;
  service_id: number;
  issue_description: string;
  date: string;
  time_slot: string;
  status: string;
  created_at: string;
  admin_notes: string | null;
  customer_name: string;
  email: string;
  brand: string;
  service_type: string;
}