import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const API_URL = 'http://your-ip-address:3000/api';
export const API = axios.create({
  baseURL: 'http://your-ip-address:3000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Add auth token to requests
API.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error adding auth token:', error);
  }
  return config;
});

// Handle response errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('API Error:', error.response?.data);
    if (error.response?.status === 401) {
      // Token expired or invalid
      AsyncStorage.multiRemove(['userToken', 'userData']);
      // You might want to redirect to login here
    }
    return Promise.reject(error);
  }
);

// Services API
export const servicesAPI = {
  getAll: () => API.get('/services'),
  getTypes: () => API.get('/services/types'),
  getById: (id: number) => API.get(`/services/${id}`),
};

// Bookings API
export const bookingsAPI = {
  create: (data: any) => API.post('/bookings', data),
  getAll: () => API.get('/bookings'),
  getByUser: (userId: number) => API.get(`/bookings/user/${userId}`),
};

// Payments API
export const paymentsAPI = {
  create: (data: any) => API.post('/payments', data),
  getAll: () => API.get('/payments'),
};

// History API
export const historyAPI = {
  getRepairHistory: () => API.get('/history'),
};

// Auth API
export const authAPI = {
  login: (data: any) => API.post('/auth/login', data),
  register: (data: any) => API.post('/auth/register', data),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (data: any) => API.patch('/auth/profile', data),
  updateProfilePicture: (formData: any) => API.patch('/auth/profile/picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};