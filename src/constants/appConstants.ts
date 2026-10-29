export const USE_MOCK_API = true;
export const SHOW_DOUBLE_BOOKING_DEMO = true;
export const BOOKING_DAYS_AHEAD = 7;

export const API_BASE_URL = 'http://localhost:4000/api';
export const API_TIMEOUT_MS = 10000;

export const API_ENDPOINTS = {
  doctors: '/doctors',
  doctorSchedule: (doctorId: string) => `/doctors/${doctorId}/schedule`,
  appointments: '/appointments',
  cancelAppointment: (appointmentId: string) =>
    `/appointments/${appointmentId}/cancel`,
  rescheduleAppointment: (appointmentId: string) =>
    `/appointments/${appointmentId}/reschedule`,
};
