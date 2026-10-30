import React from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppointmentCard from '../components/AppointmentCard';
import ErrorMessage from '../components/ErrorMessage';
import LoadingView from '../components/LoadingView';
import { colors, fontSize, spacing } from '../constants/theme';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { getApiErrorMessage } from '../services/apiClient';
import {
  useGetAppointmentsQuery,
  useGetDoctorsQuery,
} from '../services/bookingApi';
import type { Appointment } from '../types';

type MyAppointmentsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'MyAppointments'
>;

const sortByDateAndTime = (appointments: Appointment[]): Appointment[] =>
  [...appointments].sort((first, second) =>
    `${first.date} ${first.startTime}`.localeCompare(
      `${second.date} ${second.startTime}`,
    ),
  );

const MyAppointmentsScreen = ({ navigation }: MyAppointmentsScreenProps) => {
  const appointmentsQuery = useGetAppointmentsQuery();
  const doctorsQuery = useGetDoctorsQuery();

  const appointments = sortByDateAndTime(appointmentsQuery.data ?? []);

  const getDoctorName = (doctorId: string): string =>
    doctorsQuery.data?.find(doctor => doctor.id === doctorId)?.name ?? 'Doctor';

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <FlatList
        data={appointments}
        keyExtractor={appointment => appointment.id}
        contentContainerStyle={styles.listContent}
        refreshing={appointmentsQuery.isFetching}
        onRefresh={appointmentsQuery.refetch}
        ListHeaderComponent={
          appointmentsQuery.error ? (
            <ErrorMessage
              message={getApiErrorMessage(appointmentsQuery.error)}
              onRetry={appointmentsQuery.refetch}
            />
          ) : undefined
        }
        ListEmptyComponent={
          appointmentsQuery.isLoading ? (
            <LoadingView message="Loading appointments..." />
          ) : (
            <Text style={styles.emptyText}>You have no appointments yet.</Text>
          )
        }
        renderItem={({ item }) => (
          <AppointmentCard
            appointment={item}
            doctorName={getDoctorName(item.doctorId)}
            onPress={() =>
              navigation.navigate('AppointmentDetails', {
                appointmentId: item.id,
              })
            }
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    gap: spacing.sm,
    padding: spacing.lg,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});

export default MyAppointmentsScreen;
