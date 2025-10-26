import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";

export const API_URL = "http://192.168.100.111:3000/api";
export const API = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Add auth token to requests
API.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Error adding auth token:", error);
  }
  return config;
});

// Handle response errors
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("API Error:", error.response?.data);

    if (error.response?.status === 401) {
      try {
        await AsyncStorage.multiRemove(["userToken", "userData"]);
        setTimeout(() => {
          Alert.alert(
            "Session Expired",
            "Your session has expired. Please login again.",
            [
              {
                text: "OK",
                onPress: () => {
                  if (typeof window !== "undefined") {
                    window.location.href = "/admin/login";
                  }
                },
              },
            ]
          );
        }, 100);
      } catch (storageError) {
        console.error("Error clearing storage:", storageError);
      }
    }

    if (!error.response) {
      console.error("Network error:", error.message);
      throw new Error("Network error. Please check your connection.");
    }

    return Promise.reject(error);
  }
);

// Admin API endpoints
export const adminAPI = {
  getDashboardStats: () => API.get("/admin/dashboard/stats"),
  getUsers: (params?: any) => API.get("/admin/users", { params }),
  deleteUser: (id: number) => API.delete(`/admin/users/${id}`),
  getAllBookings: (params?: any) => API.get("/admin/bookings", { params }),
  updateBookingStatus: (bookingId: number, data: any) =>
    API.patch(`/admin/bookings/${bookingId}/status`, data),
  getRevenueAnalytics: (params?: any) =>
    API.get("/admin/dashboard/analytics/revenue", { params }),

  // Services management
  getServices: () => API.get("/admin/services"),
  getServiceTypes: () => API.get("/services/types"),
  createService: (data: any) => API.post("/admin/services", data),
  updateService: (id: number, data: any) =>
    API.put(`/admin/services/${id}`, data),
  deleteService: (id: number) => API.delete(`/admin/services/${id}`),

  // Service Types management
  fetchServiceTypes: () => API.get("/admin/service-types"),
  createServiceType: (data: any) => API.post("/admin/service-types", data),
  updateServiceType: (id: number, data: any) =>
    API.put(`/admin/service-types/${id}`, data),
  deleteServiceType: (id: number) => API.delete(`/admin/service-types/${id}`),

  uploadServiceImage: (formData: FormData) =>
    API.post("/admin/services/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 3000,
    }),
};

export const servicesAPI = {
  getAll: () => API.get("/services"),
  getTypes: () => API.get("/services/types"),
  getById: (id: number) => API.get(`/services/${id}`),
};

export const bookingsAPI = {
  create: (data: any) => API.post("/bookings", data),
  getAll: () => API.get("/bookings"),
  getByUser: (userId: number) => API.get(`/bookings/user/${userId}`),
};

export const paymentsAPI = {
  create: (data: any) => API.post("/payments", data),
  getAll: () => API.get("/payments"),
};

export const historyAPI = {
  getRepairHistory: () => API.get("/history"),
};

export const authAPI = {
  login: (data: any) => API.post("/auth/login", data),
  register: (data: any) => API.post("/auth/register", data),
  getProfile: () => API.get("/auth/profile"),
  updateProfile: (data: any) => API.patch("/auth/profile", data),
  updateProfilePicture: (formData: any) =>
    API.patch("/auth/profile/picture", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};
