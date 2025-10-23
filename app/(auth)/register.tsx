import { API } from "@/api/api";
import CustomButton from "@/components/CustomButton";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from "react-native";

const RegisterScreen: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setEmailError("");
    
    if (text && !validateEmail(text)) {
      setEmailError("Please enter a valid email address");
    }
  };

  const handleRegister = async () => {
    // Reset errors
    setEmailError("");

    // Validation
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const response = await API.post("/auth/register", { name, email, password });
      Alert.alert("Success", "Account created! Please login.");
      router.replace("/login");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message;
      
      if (err.response?.status === 409) {
        // Email already exists
        setEmailError("Email already exists");
        Alert.alert("Registration Failed", "This email is already registered. Please use a different email or login.");
      } else {
        Alert.alert("Registration Failed", errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Stack.Screen options={{ title: "Register" }} />
      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>

        <TextInput
          placeholder="Full Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        
        <View>
          <TextInput
            placeholder="Email"
            style={[styles.input, emailError ? styles.inputError : null]}
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        </View>

        <TextInput
          placeholder="Password"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <CustomButton
          title={loading ? "Registering..." : "Register"}
          onPress={handleRegister}
          disabled={loading}
        />

        <Text style={styles.switchText} onPress={() => router.push("/login")}>
          Already have an account? <Text style={styles.switchHighlight}>Login</Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

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
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    marginBottom: 24, 
    textAlign: "center" 
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 8,
  },
  inputError: {
    borderColor: "#ef4444",
    backgroundColor: "#fef2f2",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    marginBottom: 12,
    marginLeft: 4,
  },
  switchText: { 
    textAlign: "center", 
    marginTop: 16, 
    color: "#666" 
  },
  switchHighlight: { 
    color: "#4A90E2", 
    fontWeight: "600" 
  },
});