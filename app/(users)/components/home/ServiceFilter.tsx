import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ScrollView, TouchableOpacity } from "react-native";
import { styles } from "./home-styles";
import { ServiceFilterProps } from "./types";

export const ServiceFilter: React.FC<ServiceFilterProps> = ({
  serviceTypes,
  selectedServiceType,
  onServiceTypeChange,
}) => {
  return (
    <ThemedView style={styles.filterContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
      >
        <TouchableOpacity
          style={[
            styles.filterChip,
            selectedServiceType === "All" && styles.filterChipActive,
          ]}
          onPress={() => onServiceTypeChange("All")}
        >
          <ThemedText
            style={[
              styles.filterText,
              selectedServiceType === "All" && styles.filterTextActive,
            ]}
          >
            All Services
          </ThemedText>
        </TouchableOpacity>
        {serviceTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.filterChip,
              selectedServiceType === type.name && styles.filterChipActive,
            ]}
            onPress={() => onServiceTypeChange(type.name)}
          >
            <ThemedText
              style={[
                styles.filterText,
                selectedServiceType === type.name && styles.filterTextActive,
              ]}
            >
              {type.name}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ThemedView>
  );
};