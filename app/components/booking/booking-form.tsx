import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Animated, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { styles, timeSlots } from './styles/booking-styles';
import { BookingFormData } from './types/types';


interface BookingFormProps {
  formData: BookingFormData;
  onFormDataChange: (data: Partial<BookingFormData>) => void;
  onSubmit: () => void;
  loading: boolean;
  fadeAnim: Animated.Value;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  formData,
  onFormDataChange,
  onSubmit,
  loading,
  fadeAnim
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { service, issueDescription, selectedDate, selectedTime, currentUser } = formData;

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      onFormDataChange({ selectedDate: date.toISOString().split('T')[0] });
    }
  };

  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isToday = (dateString: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  };

  const isFormValid = issueDescription && selectedDate && selectedTime && issueDescription.length >= 10;

  if (!service) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Loading service information...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <Animated.ScrollView 
      style={[styles.scrollView, { opacity: fadeAnim }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Service Card */}
      <ThemedView style={styles.serviceCard}>
        <ThemedView style={styles.serviceHeader}>
          <ThemedView style={styles.serviceIcon}>
            <Ionicons name="build-outline" size={24} color="#4A90E2" />
          </ThemedView>
          <ThemedView style={styles.serviceInfo}>
            <ThemedText type="title" style={styles.brandText}>
              {service.brand}
            </ThemedText>
            <ThemedText type="subtitle" style={styles.serviceTypeText}>
              {service.service_type}
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.priceTag}>
            <ThemedText style={styles.priceText}>
              ₱{service.base_price}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      {/* User Info Card */}
      {currentUser && (
        <ThemedView style={styles.userCard}>
          <ThemedView style={styles.userHeader}>
            <Ionicons name="person-circle-outline" size={20} color="#7F8C8D" />
            <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
              Booking For
            </ThemedText>
          </ThemedView>
          <ThemedText style={styles.userName}>{currentUser.name}</ThemedText>
          <ThemedText style={styles.userEmail}>{currentUser.email}</ThemedText>
        </ThemedView>
      )}

      {/* Issue Description Card */}
      <ThemedView style={styles.card}>
        <ThemedView style={styles.cardHeader}>
          <Ionicons name="document-text-outline" size={20} color="#7F8C8D" />
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            Issue Description
          </ThemedText>
        </ThemedView>
        <TextInput
          style={styles.textInput}
          placeholder="Describe the specific issue you're experiencing with your device..."
          value={issueDescription}
          onChangeText={(text) => onFormDataChange({ issueDescription: text })}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          placeholderTextColor="#95A5A6"
        />
        <ThemedView style={styles.charCounter}>
          <ThemedText style={styles.charText}>
            {issueDescription.length}/500 characters
          </ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Schedule Card */}
      <ThemedView style={styles.card}>
        <ThemedView style={styles.cardHeader}>
          <Ionicons name="calendar-outline" size={20} color="#7F8C8D" />
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            Schedule Appointment
          </ThemedText>
        </ThemedView>

        {/* Date Selection */}
        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>Preferred Date</ThemedText>
          <TouchableOpacity 
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar" size={18} color="#4A90E2" />
            <ThemedText style={styles.dateText}>
              {selectedDate ? formatDisplayDate(selectedDate) : 'Select a date'}
            </ThemedText>
            <Ionicons name="chevron-forward" size={18} color="#BDC3C7" />
          </TouchableOpacity>
          {isToday(selectedDate) && (
            <ThemedView style={styles.todayBadge}>
              <ThemedText style={styles.todayText}>Today</ThemedText>
            </ThemedView>
          )}
        </ThemedView>

        {/* Time Selection */}
        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>Preferred Time</ThemedText>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.timeSlotsContainer}
          >
            {timeSlots.map((time: any) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeSlot,
                  selectedTime === time && styles.timeSlotSelected
                ]}
                onPress={() => onFormDataChange({ selectedTime: time })}
              >
                <ThemedText 
                  style={[
                    styles.timeSlotText,
                    selectedTime === time && styles.timeSlotTextSelected
                  ]}
                >
                  {time}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ThemedView>
      </ThemedView>

      {/* Booking Summary Card */}
      <ThemedView style={styles.summaryCard}>
        <ThemedView style={styles.cardHeader}>
          <Ionicons name="receipt-outline" size={20} color="#7F8C8D" />
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            Booking Summary
          </ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.summaryContent}>
          <ThemedView style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>Service</ThemedText>
            <ThemedText style={styles.summaryValue}>
              {service.brand} {service.service_type}
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>Scheduled Date</ThemedText>
            <ThemedText style={styles.summaryValue}>
              {selectedDate ? formatDisplayDate(selectedDate) : 'Not selected'}
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>Time Slot</ThemedText>
            <ThemedText style={styles.summaryValue}>
              {selectedTime || 'Not selected'}
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.divider} />
          <ThemedView style={styles.summaryRow}>
            <ThemedText type="defaultSemiBold" style={styles.totalLabel}>
              Total Amount
            </ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.totalValue}>
              ₱{service.base_price}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      {/* Action Button */}
      <TouchableOpacity 
        style={[
          styles.bookButton,
          !isFormValid && styles.bookButtonDisabled
        ]}
        onPress={onSubmit}
        disabled={loading || !isFormValid}
      >
        {loading ? (
          <ThemedText style={styles.bookButtonText}>
            <Ionicons name="time-outline" size={18} /> Processing...
          </ThemedText>
        ) : (
          <ThemedText style={styles.bookButtonText}>
            <Ionicons name="checkmark-circle-outline" size={18} /> Confirm Booking
          </ThemedText>
        )}
      </TouchableOpacity>

      <ThemedView style={styles.footerNote}>
        <ThemedText style={styles.footerText}>
          💡 You'll receive a confirmation email with appointment details and preparation instructions.
        </ThemedText>
      </ThemedView>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate ? new Date(selectedDate) : new Date()}
          mode="date"
          display="spinner"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}
    </Animated.ScrollView>
  );
};