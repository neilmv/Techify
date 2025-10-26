import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import { ServiceList } from "./components/ServiceList";
import { useServiceMutations } from "./hooks/useServiceMutations";
import { CreateServiceData, Service } from "./types/service.types";

import { ServiceFilters } from "./components/ServiceFilters";
import { ServiceForm } from "./components/ServiceForm";
import { useServices } from "./hooks/useService";
import { styles } from "./styles/serviceStyles";

export default function ServicesScreen() {
  const {
    services,
    serviceTypes,
    filteredServices,
    loading,
    error,
    filters,
    fetchServices,
    updateFilters,
  } = useServices();

  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const mutations = useServiceMutations(() => {
    fetchServices();
    setShowForm(false);
    setEditingService(null);
  });

  const handleCreateService = async (data: CreateServiceData) => {
    await mutations.createService(data);
  };

  const handleUpdateService = async (data: CreateServiceData) => {
    if (!editingService) return;
    await mutations.updateService(editingService.id, data);
  };

  const handleDeleteService = async (serviceId: number) => {
    try {
      await mutations.deleteService(serviceId);
    } catch (error: any) {
      console.log("❌ Delete service error caught in screen:", error.message);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingService(null);
  };

  if (loading && services.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={{ marginTop: 16, color: "#64748b" }}>
          Loading services...
        </Text>
      </View>
    );
  }

  if (error && services.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#ef4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchServices}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Updated Header */}
      <LinearGradient
        colors={['#4f46e5', '#6366f1']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Services Management</Text>
            <Text style={styles.headerSubtitle}>
              Manage your repair services and pricing
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowForm(true)}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Content */}
      <View style={styles.content}>
        <ServiceFilters
          filters={filters}
          serviceTypes={serviceTypes}
          onFiltersChange={updateFilters}
        />

        {filteredServices.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="construct-outline" size={64} color="#cbd5e1" />
            <Text style={styles.emptyStateText}>
              {services.length === 0
                ? "No services found. Add your first service to get started."
                : "No services match your filters."}
            </Text>
          </View>
        ) : (
          <ServiceList
            services={filteredServices}
            onEdit={handleEdit}
            onDelete={handleDeleteService}
            refreshing={loading}
            onRefresh={fetchServices}
          />
        )}
      </View>

      {/* Service Form Modal */}
      <ServiceForm
        visible={showForm}
        service={editingService}
        serviceTypes={serviceTypes}
        onSubmit={editingService ? handleUpdateService : handleCreateService}
        onClose={handleCloseForm}
        loading={mutations.loading}
      />
    </View>
  );
}