import { HelloWave } from "@/components/hello-wave";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Image } from "expo-image";
import { styles } from "./home-styles";

export const HomeHeader = () => {
  return (
    <>
      {/* Elegant Logo Header */}
      <ThemedView style={styles.headerContainer}>
        <Image
          source={require("@/assets/images/techifydubai_cover.jpg")}
          style={styles.logoImage}
          contentFit="contain"
        />
      </ThemedView>

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Tech Repair Services</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.welcomeContainer}>
        <ThemedText style={styles.welcomeText}>
          Professional repair services for all your devices. Book your
          appointment today!
        </ThemedText>
      </ThemedView>
    </>
  );
};