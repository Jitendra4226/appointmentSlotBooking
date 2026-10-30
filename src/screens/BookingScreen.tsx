import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../components/AppButton';
import DoctorCard from '../components/DoctorCard';
import ErrorMessage from '../components/ErrorMessage';
import LoadingView from '../components/LoadingView';
import SlotPicker from '../components/SlotPicker';
import {
  API_ENDPOINTS,
  SHOW_DOUBLE_BOOKING_DEMO,
} from '../constants/appConstants';
import {
  colors,
  fontSize,
  fontWeight,
  radius,
  spacing,
} from '../constants/theme';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { apiClient, getApiErrorMessage } from '../services/apiClient';
import {
  useBookAppointmentMutation,
  useGetDoctorsQuery,
} from '../services/bookingApi';
import type { DateString, Doctor, TimeSlot } from '../types';
import { validatePatientName } from '../utils/bookingValidation';
import {
  formatDisplayDate,
  formatTimeForDisplay,
  getTodayDateString,
} from '../utils/dateTimeUtils';

type BookingScreenProps = NativeStackScreenProps<RootStackParamList, 'Booking'>;

const DEMO_PATIENT_NAME = 'Another Patient';

const BookingScreen = ({ navigation }: BookingScreenProps) => {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>();
  const [selectedDate, setSelectedDate] = useState<DateString>(
    getTodayDateString(),
  );
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [patientName, setPatientName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const doctorsQuery = useGetDoctorsQuery();
  const [bookAppointment, { isLoading: isBooking }] =
    useBookAppointmentMutation();

  const doctors = doctorsQuery.data ?? [];
  const selectedDoctor: Doctor | undefined =
    doctors.find(doctor => doctor.id === selectedDoctorId) ?? doctors[0];

  const clearSlotSelection = () => {
    setSelectedSlot(null);
    setBookingError(null);
  };

  const handleSelectDoctor = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    clearSlotSelection();
  };

  const handleSelectDate = (date: DateString) => {
    setSelectedDate(date);
    clearSlotSelection();
  };

  const handleSelectSlot = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setBookingError(null);
  };

  const handleChangeName = (name: string) => {
    setPatientName(name);
    if (nameError) {
      setNameError(validatePatientName(name));
    }
  };

  const handleBookAppointment = async () => {
    const nameValidationError = validatePatientName(patientName);
    setNameError(nameValidationError);

    if (nameValidationError || !selectedDoctor || !selectedSlot) {
      return;
    }

    try {
      const appointment = await bookAppointment({
        doctorId: selectedDoctor.id,
        patientName,
        date: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
      }).unwrap();

      clearSlotSelection();
      Alert.alert(
        'Appointment booked',
        `${selectedDoctor.name} on ${formatDisplayDate(
          appointment.date,
        )} at ${formatTimeForDisplay(appointment.startTime)}.`,
        [
          { text: 'OK' },
          {
            text: 'My Appointments',
            onPress: () => navigation.navigate('MyAppointments'),
          },
        ],
      );
    } catch (error) {
      setSelectedSlot(null);
      setBookingError(getApiErrorMessage(error));
    }
  };

  const handleSimulateOtherPatient = async () => {
    if (!selectedDoctor || !selectedSlot) {
      return;
    }

    try {
      await apiClient.post(API_ENDPOINTS.appointments, {
        doctorId: selectedDoctor.id,
        patientName: DEMO_PATIENT_NAME,
        date: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
      });
      Alert.alert(
        'Another patient booked this slot',
        'This screen still shows it as free. Tap "Book Appointment" to see the double booking being blocked.',
      );
    } catch (error) {
      Alert.alert('Demo failed', getApiErrorMessage(error));
    }
  };

  const renderDoctors = () => {
    if (doctorsQuery.isLoading) {
      return <LoadingView message="Loading doctors..." />;
    }
    if (doctorsQuery.error) {
      return (
        <ErrorMessage
          message={getApiErrorMessage(doctorsQuery.error)}
          onRetry={doctorsQuery.refetch}
        />
      );
    }
    return doctors.map(doctor => (
      <DoctorCard
        key={doctor.id}
        doctor={doctor}
        isSelected={doctor.id === selectedDoctor?.id}
        onPress={() => handleSelectDoctor(doctor.id)}
      />
    ));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.headerLabel}>HEALTHCARE</Text>
        <Text style={styles.headerTitle}>Book Appointment</Text>
        <Text style={styles.headerSubtitle}>
          Find a doctor and schedule your visit.
        </Text>
        <AppButton
          title="My Appointments"
          variant="outline"
          onPress={() => navigation.navigate('MyAppointments')}
        />

        <Text style={styles.sectionTitle}>Select Doctor</Text>
        <View style={styles.doctorList}>{renderDoctors()}</View>

        {selectedDoctor ? (
          <SlotPicker
            doctorId={selectedDoctor.id}
            doctorName={selectedDoctor.name}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            selectedSlot={selectedSlot}
            onSelectSlot={handleSelectSlot}
          />
        ) : null}

        <Text style={styles.sectionTitle}>Patient Details</Text>
        <TextInput
          value={patientName}
          onChangeText={handleChangeName}
          placeholder="Patient full name"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="words"
          style={[styles.nameInput, nameError ? styles.nameInputError : null]}
        />
        {nameError ? <Text style={styles.nameError}>{nameError}</Text> : null}

        <View style={styles.bookingActions}>
          {bookingError ? <ErrorMessage message={bookingError} /> : null}
          <AppButton
            title="Book Appointment"
            onPress={handleBookAppointment}
            isLoading={isBooking}
            disabled={!selectedSlot}
          />
          {SHOW_DOUBLE_BOOKING_DEMO && selectedSlot ? (
            <Pressable
              accessibilityRole="button"
              hitSlop={8}
              onPress={handleSimulateOtherPatient}
            >
              <Text style={styles.demoLink}>
                Demo: let another patient book this slot first
              </Text>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  headerLabel: {
    color: colors.primary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    letterSpacing: 1.5,
    marginTop: spacing.md,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.display,
    fontWeight: fontWeight.extraBold,
    marginTop: spacing.xs,
  },
  headerSubtitle: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  doctorList: {
    gap: spacing.sm,
  },
  nameInput: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  nameInputError: {
    borderColor: colors.danger,
  },
  nameError: {
    color: colors.danger,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  bookingActions: {
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  demoLink: {
    color: colors.primary,
    fontSize: fontSize.sm,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default BookingScreen;
