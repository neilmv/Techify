export interface Service {
  id: number;
  service_type: string;
  brand: string;
  description: string;
  base_price: number;
  image: string;
}

export interface ServiceType {
  id: number;
  name: string;
  description: string;
}

export interface ServiceCardProps {
  service: Service;
  onBookService: (service: Service) => void;
  userToken: string | null;
}

export interface ServiceFilterProps {
  serviceTypes: ServiceType[];
  selectedServiceType: string;
  onServiceTypeChange: (type: string) => void;
}