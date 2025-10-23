import { API } from "@/api/api";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView } from "react-native";
import { EmptyState } from "../components/home/EmptyState";
import { styles } from "../components/home/home-styles";
import { HomeHeader } from "../components/home/HomeHeader";
import { LoadingState } from "../components/home/LoadingState";
import { ServiceCard } from "../components/home/ServiceCard";
import { ServiceFilter } from "../components/home/ServiceFilter";
import { Service, ServiceType } from "../components/home/types";

export default function HomeScreen() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [selectedServiceType, setSelectedServiceType] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus();
    fetchData();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      setUserToken(token);
    } catch (error) {
      console.error("Error checking auth status:", error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [servicesRes, typesRes] = await Promise.all([
        API.get("/services"),
        API.get("/services/types"),
      ]);
      setServices(servicesRes.data);
      setServiceTypes(typesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const filteredServices =
    selectedServiceType === "All"
      ? services
      : services.filter(
          (service) => service.service_type === selectedServiceType
        );

  const handleBookService = (service: Service) => {
    if (!userToken) {
      Alert.alert("Login Required", "Please login to book a service", [
        { text: "Cancel", style: "cancel" },
        { text: "Login", onPress: () => router.push("/(auth)/login") },
      ]);
      return;
    }
    router.push({
      pathname: "../components/booking/booking",
      params: { service: JSON.stringify(service) },
    });
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <HomeHeader />
      
      <ServiceFilter
        serviceTypes={serviceTypes}
        selectedServiceType={selectedServiceType}
        onServiceTypeChange={setSelectedServiceType}
      />

      {/* Services Grid */}
      <ThemedView style={styles.servicesContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Available Services
        </ThemedText>

        {filteredServices.length === 0 ? (
          <EmptyState selectedServiceType={selectedServiceType} />
        ) : (
          <ThemedView style={styles.servicesGrid}>
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onBookService={handleBookService}
                userToken={userToken}
              />
            ))}
          </ThemedView>
        )}
      </ThemedView>
    </ScrollView>
  );
}