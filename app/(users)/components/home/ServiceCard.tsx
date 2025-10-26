import { API_URL } from "@/api/api";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Image } from "expo-image";
import { TouchableOpacity } from "react-native";
import { styles } from "./home-styles";
import { ServiceCardProps } from "./types";

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onBookService,
  userToken,
}) => {
  const handlePress = () => {
    onBookService(service);
  };

  return (
    <ThemedView style={styles.serviceCard}>
      <Image
        source={{
          uri: `${API_URL.replace(/\/api\/?$/, "")}/${service.image?.replace(
            /^\/?/,
            ""
          )}`,
        }}
        style={styles.serviceImage}
        contentFit="cover"
      />
      <ThemedView style={styles.serviceInfo}>
        <ThemedText type="defaultSemiBold" style={styles.brandText}>
          {service.brand}
        </ThemedText>
        <ThemedText type="defaultSemiBold" style={styles.serviceTypeText}>
          {service.service_type}
        </ThemedText>
        <ThemedText style={styles.descriptionText} numberOfLines={2}>
          {service.description}
        </ThemedText>
        <ThemedView style={styles.priceContainer}>
          <ThemedText type="defaultSemiBold" style={styles.priceText}>
            ₱{service.base_price}
          </ThemedText>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={handlePress}
          >
            <ThemedText style={styles.bookButtonText}>Book Now</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};