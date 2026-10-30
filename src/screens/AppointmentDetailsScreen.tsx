import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../components/AppButton';
import AppointmentCard from '../components/AppointmentCard';
import ErrorMessage from '../components/ErrorMessage';
import LoadingView from '../components/LoadingView';
import SlotPicker from '../components/SlotPicker';
import { colors, fontSize, spacing } from '../constants/theme';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { getApiErrorMessage } from '../services/apiClient';
import {
  useCancelAppointmentMutation,
  useGetAppointmentsQuery,
  useGetDoctorsQuery,
  useRescheduleAppointmentMutation,
} from '../services/bookingApi';
import type { DateString, TimeSlot } from '../types';
import { validateAppointmentChange } from '../utils/bookingValidation';
import {
  formatDisplayDate,
  formatTimeForDisplay,
  getTodayDateString,
} from '../utils/dateTimeUtils';

type AppointmentDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'AppointmentDetails'
>;

const AppointmentDetailsScreen = ({ route }: AppointmentDetailsScreenProps) => {
  const { appointmentId } = route.params;

  const [isRescheduling, setIsRescheduling] = useState(false);
  const [selectedDate, setSelectedDate] = useState<DateString>(
    getTodayDateString(),
  );
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const appointmentsQuery = useGetAppointmentsQuery();
  const doctorsQuery = useGetDoctorsQuery();
  const [cancelAppointment, { isLoading: isCancelling }] =
    useCancelAppointmentMutation();
  const [rescheduleAppointment, { isLoading: isSavingNewTime }] =
    useRescheduleAppointmentMutation();

  const appointment = appointmentsQuery.data?.find(
    item => item.id === appointmentId,
  );
  const doctorName =
    doctorsQuery.data?.find(doctor => doctor.id === appointment?.doctorId)
      ?.name ?? 'Doctor';

  if (!appointment) {
    return (
      <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        <View style={styles.content}>
          {appointmentsQuery.isLoading ? (
            <LoadingView message="Loading appointment..." />
          ) : (
            <ErrorMessage message="Appointment not found." />
          )}
        </View>
      </SafeAreaView>
    );
  }

  const changeBlockedReason = validateAppointmentChange(appointment);

  const handleSelectDate = (date: DateString) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const startRescheduling = () => {
    setIsRescheduling(true);
    setActionError(null);
  };

  const stopRescheduling = () => {
    setIsRescheduling(false);
    setSelectedSlot(null);
    setActionError(null);
  };

  const cancelCurrentAppointment = async () => {
    setActionError(null);
    try {
      await cancelAppointment(appointment.id).unwrap();
      Alert.alert(
        'Appointment cancelled',
        'The slot is now free for other patients.',
      );
    } catch (error) {
      setActionError(getApiErrorMessage(error));
    }
  };

  const handleCancelPress = () => {
    Alert.alert('Cancel appointment?', 'This cannot be undone.', [
      { text: 'Keep appointment', style: 'cancel' },
      {
        text: 'Cancel appointment',
        style: 'destructive',
        onPress: cancelCurrentAppointment,
      },
    ]);
  };

  const handleConfirmNewTime = async () => {
    if (!selectedSlot) {
      return;
    }

    setActionError(null);
    try {
      await rescheduleAppointment({
        id: appointment.id,
        date: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
      }).unwrap();

      stopRescheduling();
      Alert.alert(
        'Appointment rescheduled',
        `New time: ${formatDisplayDate(selectedDate)} at ${formatTimeForDisplay(
          selectedSlot.startTime,
        )}.`,
      );
    } catch (error) {
      setSelectedSlot(null);
      setActionError(getApiErrorMessage(error));
    }
  };

  const renderActions = () => {
    if (changeBlockedReason) {
      return <Text style={styles.infoText}>{changeBlockedReason}</Text>;
    }

    if (!isRescheduling) {
      return (
        <View style={styles.actions}>
          <AppButton
            title="Reschedule"
            variant="outline"
            onPress={startRescheduling}
          />
          <AppButton
            title="Cancel Appointment"
            variant="danger"
            onPress={handleCancelPress}
            isLoading={isCancelling}
          />
        </View>
      );
    }

    return (
      <View>
        <SlotPicker
          doctorId={appointment.doctorId}
          doctorName={doctorName}
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
          selectedSlot={selectedSlot}
          onSelectSlot={setSelectedSlot}
        />
        <View style={styles.actions}>
          <AppButton
            title="Confirm New Time"
            onPress={handleConfirmNewTime}
            isLoading={isSavingNewTime}
            disabled={!selectedSlot}
          />
          <AppButton
            title="Keep Current Time"
            variant="outline"
            onPress={stopRescheduling}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppointmentCard appointment={appointment} doctorName={doctorName} />
        {actionError ? <ErrorMessage message={actionError} /> : null}
        {renderActions()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    gap: spacing.md,
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  infoText: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    textAlign: 'center',
  },
});

export default AppointmentDetailsScreen;
