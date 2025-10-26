export interface ServiceType {
  id: number;
  name: string;
  description: string;
  services_count?: number;
}

export interface ServiceTypeFormData {
  name: string;
  description: string;
}