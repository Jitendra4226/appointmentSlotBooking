import { skipToken } from '@reduxjs/toolkit/query';
import {
  useGetAppointmentsQuery,
  useGetDoctorScheduleQuery,
} from '../services/bookingApi';
import type { DateString } from '../types';
import { generateTimeSlots } from '../utils/generateTimeSlots';

export const useAvailableSlots = (
  doctorId: string | undefined,
  date: DateString,
) => {
  const scheduleQuery = useGetDoctorScheduleQuery(doctorId ?? skipToken);
  const appointmentsQuery = useGetAppointmentsQuery();

  const schedule = scheduleQuery.data;
  const appointments = appointmentsQuery.data;
  const slots =
    schedule && appointments
      ? generateTimeSlots({ schedule, date, appointments })
      : [];

  return {
    schedule,
    slots,
    isLoading: scheduleQuery.isFetching || appointmentsQuery.isLoading,
    error: scheduleQuery.error ?? appointmentsQuery.error,
    retry: () => {
      scheduleQuery.refetch();
      appointmentsQuery.refetch();
    },
  };
};
