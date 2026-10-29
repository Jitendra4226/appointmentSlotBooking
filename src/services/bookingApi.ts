import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ENDPOINTS } from '../constants/appConstants';
import type {
  Appointment,
  BookAppointmentRequest,
  Doctor,
  DoctorSchedule,
  RescheduleAppointmentRequest,
} from '../types';
import { ApiError, apiClient, getApiErrorMessage } from './apiClient';

interface ApiRequest {
  url: string;
  method?: 'get' | 'post' | 'patch';
  data?: unknown;
}

interface ApiRequestError {
  status?: number;
  message: string;
}

const axiosBaseQuery: BaseQueryFn<
  ApiRequest,
  unknown,
  ApiRequestError
> = async ({ url, method = 'get', data }) => {
  try {
    const response = await apiClient.request({ url, method, data });
    return { data: response.data };
  } catch (error) {
    return {
      error: {
        status: error instanceof ApiError ? error.status : undefined,
        message: getApiErrorMessage(error),
      },
    };
  }
};

export const bookingApi = createApi({
  reducerPath: 'bookingApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['Appointments'],
  endpoints: builder => ({
    getDoctors: builder.query<Doctor[], void>({
      query: () => ({ url: API_ENDPOINTS.doctors }),
    }),
    getDoctorSchedule: builder.query<DoctorSchedule, string>({
      query: doctorId => ({ url: API_ENDPOINTS.doctorSchedule(doctorId) }),
    }),
    getAppointments: builder.query<Appointment[], void>({
      query: () => ({ url: API_ENDPOINTS.appointments }),
      providesTags: ['Appointments'],
    }),
    bookAppointment: builder.mutation<Appointment, BookAppointmentRequest>({
      query: request => ({
        url: API_ENDPOINTS.appointments,
        method: 'post',
        data: request,
      }),
      invalidatesTags: ['Appointments'],
    }),
    cancelAppointment: builder.mutation<Appointment, string>({
      query: appointmentId => ({
        url: API_ENDPOINTS.cancelAppointment(appointmentId),
        method: 'patch',
      }),
      invalidatesTags: ['Appointments'],
    }),
    rescheduleAppointment: builder.mutation<
      Appointment,
      RescheduleAppointmentRequest
    >({
      query: ({ id, ...newTime }) => ({
        url: API_ENDPOINTS.rescheduleAppointment(id),
        method: 'patch',
        data: newTime,
      }),
      invalidatesTags: ['Appointments'],
    }),
  }),
});

export const {
  useGetDoctorsQuery,
  useGetDoctorScheduleQuery,
  useGetAppointmentsQuery,
  useBookAppointmentMutation,
  useCancelAppointmentMutation,
  useRescheduleAppointmentMutation,
} = bookingApi;
