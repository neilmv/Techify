export interface Service {
  id: number;
  service_type: string;
  brand: string;
  description: string;
  base_price: number;
  image: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface BookingFormData {
  service: Service | null;
  issueDescription: string;
  selectedDate: string;
  selectedTime: string;
  currentUser: User | null;
}

export interface BookingScreenProps {
  onBookingSuccess: () => void;
}