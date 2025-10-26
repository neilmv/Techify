export interface ServiceType {
  id: number;
  name: string;
  description: string;
}

export interface Service {
  id: number;
  service_type_id: number;
  brand: string;
  description: string;
  base_price: number;
  image?: string;
  service_type?: string;
}

export interface CreateServiceData {
  service_type_id: number;
  brand: string;
  description: string;
  base_price: number;
  image?: string;
}

export interface UpdateServiceData extends CreateServiceData {}

export interface ServiceFilters {
  search: string;
  service_type: string;
}

export interface ServicesState {
  services: Service[];
  serviceTypes: ServiceType[];
  loading: boolean;
  error: string | null;
  filters: ServiceFilters;
}

export interface ServiceFormErrors {
  service_type_id?: string;
  brand?: string;
  description?: string;
  base_price?: string;
  image?: string;
}