import { API } from "@/api/api";
import CustomButton from "@/components/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from "react-native";

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert("Error", "Please fill all fields");
    try {
      setLoading(true);
      const res = await API.post("/auth/login", { email, password });

      await AsyncStorage.setItem("userToken", res.data.token);
      await AsyncStorage.setItem("userData", JSON.stringify(res.data.user));

      setLoading(false);
      Alert.alert("Success", `Welcome back, ${res.data.user.name}`);
      router.replace("/"); // navigate to main
    } catch (err: any) {
      setLoading(false);
      Alert.alert(
        "Login Failed",
        typeof err.response?.data === "string"
          ? err.response.data
          : JSON.stringify(err.response?.data) || err.message
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Stack.Screen options={{ title: "Login" }} />
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back</Text>

        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <CustomButton
          title={loading ? "Logging in..." : "Login"}
          onPress={handleLogin}
          disabled={loading}
        />

        <Text style={styles.switchText} onPress={() => router.push("/register")}>
          Don't have an account? <Text style={styles.switchHighlight}>Register</Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f0f4f8",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 24, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  switchText: { textAlign: "center", marginTop: 16, color: "#666" },
  switchHighlight: { color: "#4A90E2", fontWeight: "600" },
});
