import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ActivityIndicator } from "react-native";
import { styles } from "./home-styles";

export const LoadingState = () => {
  return (
    <ThemedView style={styles.loadingContainer}>
      <ActivityIndicator size="large" />
      <ThemedText style={styles.loadingText}>Loading services...</ThemedText>
    </ThemedView>
  );
};