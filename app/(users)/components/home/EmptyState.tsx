import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./home-styles";

interface EmptyStateProps {
  selectedServiceType: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ selectedServiceType }) => {
  return (
    <ThemedView style={styles.emptyContainer}>
      <Ionicons name="construct-outline" size={48} color="#666" />
      <ThemedText style={styles.emptyText}>
        No services found for {selectedServiceType}
      </ThemedText>
    </ThemedView>
  );
};