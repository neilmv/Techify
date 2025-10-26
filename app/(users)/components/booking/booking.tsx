import { API } from '@/api/api';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Animated, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BookingForm } from './booking-form';
import { styles } from './styles/booking-styles';
import { BookingFormData } from './types/types';

export default function BookingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [formData, setFormData] = useState<BookingFormData>({
    service: null,
    issueDescription: '',
    selectedDate: '',
    selectedTime: '',
    currentUser: null,
  });
  const [loading, setLoading] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const initializeScreen = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const userData = await AsyncStorage.getItem('userData');
        
        setUserToken(token);
        
        if (userData) {
          setFormData(prev => ({ ...prev, currentUser: JSON.parse(userData) }));
        }

        if (!token) {
          Alert.alert('Login Required', 'Please login to book a service', [
            { text: 'OK', onPress: () => router.replace('/(auth)/login') }
          ]);
          return;
        }

        if (params.service) {
          setFormData(prev => ({ ...prev, service: JSON.parse(params.service as string) }));
        }

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setFormData(prev => ({ ...prev, selectedDate: tomorrow.toISOString().split('T')[0] }));
        
        setAuthChecked(true);
        
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.error('Error initializing screen:', error);
        Alert.alert('Error', 'Failed to initialize booking screen');
      }
    };

    initializeScreen();
  }, [params.service]);

  const handleFormDataChange = (updatedData: Partial<BookingFormData>) => {
    setFormData(prev => ({ ...prev, ...updatedData }));
  };

  const isPastDate = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(dateString);
    return selected < today;
  };

  const handleBooking = async () => {
    const { service, issueDescription, selectedDate, selectedTime, currentUser } = formData;

    if (!service || !issueDescription || !selectedDate || !selectedTime) {
      Alert.alert('Please Complete All Fields', 'Please fill in all required information to proceed with your booking.');
      return;
    }

    if (isPastDate(selectedDate)) {
      Alert.alert('Invalid Date', 'Please select a future date for your booking.');
      return;
    }

    if (!currentUser) {
      Alert.alert('Authentication Error', 'User information not found. Please login again.');
      return;
    }

    if (issueDescription.length < 10) {
      Alert.alert('Detailed Description Needed', 'Please provide a more detailed description of the issue (at least 10 characters).');
      return;
    }

    try {
      setLoading(true);
      
      const bookingData = {
        service_id: service.id,
        issue_description: issueDescription,
        date: selectedDate,
        time_slot: selectedTime,
      };

      await API.post('/bookings', bookingData);

      Alert.alert(
        'Booking Confirmed! 🎉',
        `Your ${service.brand} ${service.service_type} repair is scheduled for ${selectedDate} at ${selectedTime}. You will receive a confirmation email shortly.`,
        [{ 
          text: 'View Details', 
          onPress: () => router.back() 
        }]
      );
    } catch (error: any) {
      console.error('Booking error:', error);
      Alert.alert(
        'Booking Failed', 
        error.response?.data?.message || 'We encountered an issue while processing your booking. Please try again in a moment.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!authChecked) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText type="subtitle">Preparing your booking...</ThemedText>
      </ThemedView>
    );
  }

  if (!userToken) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Redirecting to login...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Schedule Service',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#2C3E50" />
            </TouchableOpacity>
          ),
          headerTitleStyle: styles.headerTitle,
        }} 
      />
      
      <BookingForm
        formData={formData}
        onFormDataChange={handleFormDataChange}
        onSubmit={handleBooking}
        loading={loading}
        fadeAnim={fadeAnim}
      />
    </ThemedView>
  );
}