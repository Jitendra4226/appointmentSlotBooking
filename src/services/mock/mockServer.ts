import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { API_ENDPOINTS } from '../../constants/appConstants';
import type {
  Appointment,
  BookAppointmentRequest,
  DoctorSchedule,
  RescheduleAppointmentRequest,
} from '../../types';
import {
  findBookingConflict,
  validateAppointmentChange,
  validateBookingRequest,
} from '../../utils/bookingValidation';
import { MOCK_APPOINTMENTS, MOCK_DOCTORS, MOCK_SCHEDULES } from './mockData';

type MockResponse = [number, unknown];
type RescheduleBody = Omit<RescheduleAppointmentRequest, 'id'>;

const NETWORK_DELAY_MS = 700;

const DOCTOR_SCHEDULE_URL = /\/doctors\/([^/]+)\/schedule$/;
const CANCEL_APPOINTMENT_URL = /\/appointments\/([^/]+)\/cancel$/;
const RESCHEDULE_APPOINTMENT_URL = /\/appointments\/([^/]+)\/reschedule$/;

let storedAppointments: Appointment[] = [...MOCK_APPOINTMENTS];
let lastAppointmentNumber = MOCK_APPOINTMENTS.length;

const createAppointmentId = (): string => {
  lastAppointmentNumber += 1;
  return `apt-${lastAppointmentNumber}`;
};

const errorResponse = (status: number, message: string): MockResponse => [
  status,
  { message },
];

const getIdFromUrl = (config: AxiosRequestConfig, urlPattern: RegExp): string =>
  config.url?.match(urlPattern)?.[1] ?? '';

const parseBody = <T>(config: AxiosRequestConfig): T => JSON.parse(config.data);

const findSchedule = (doctorId: string) =>
  MOCK_SCHEDULES.find(schedule => schedule.doctorId === doctorId);

const findAppointment = (appointmentId: string) =>
  storedAppointments.find(appointment => appointment.id === appointmentId);

const replaceAppointment = (updatedAppointment: Appointment): void => {
  storedAppointments = storedAppointments.map(appointment =>
    appointment.id === updatedAppointment.id ? updatedAppointment : appointment,
  );
};

const getBookingErrorResponse = (
  request: BookAppointmentRequest,
  schedule: DoctorSchedule,
  appointments: Appointment[],
): MockResponse | null => {
  const validationError = validateBookingRequest({ request, schedule });
  if (validationError) {
    return errorResponse(400, validationError);
  }

  const conflictError = findBookingConflict({ request, appointments });
  if (conflictError) {
    return errorResponse(409, conflictError);
  }
  return null;
};

const handleGetDoctors = (): MockResponse => [200, MOCK_DOCTORS];

const handleGetDoctorSchedule = (config: AxiosRequestConfig): MockResponse => {
  const schedule = findSchedule(getIdFromUrl(config, DOCTOR_SCHEDULE_URL));

  return schedule
    ? [200, schedule]
    : errorResponse(404, 'Doctor schedule not found.');
};

const handleGetAppointments = (): MockResponse => [200, storedAppointments];

const handleBookAppointment = (config: AxiosRequestConfig): MockResponse => {
  const request = parseBody<BookAppointmentRequest>(config);
  const schedule = findSchedule(request.doctorId);

  if (!schedule) {
    return errorResponse(404, 'Doctor schedule not found.');
  }

  const bookingError = getBookingErrorResponse(
    request,
    schedule,
    storedAppointments,
  );
  if (bookingError) {
    return bookingError;
  }

  const newAppointment: Appointment = {
    ...request,
    id: createAppointmentId(),
    patientName: request.patientName.trim(),
    status: 'booked',
  };

  storedAppointments = [...storedAppointments, newAppointment];
  return [201, newAppointment];
};

const handleCancelAppointment = (config: AxiosRequestConfig): MockResponse => {
  const appointment = findAppointment(
    getIdFromUrl(config, CANCEL_APPOINTMENT_URL),
  );

  if (!appointment) {
    return errorResponse(404, 'Appointment not found.');
  }

  const changeError = validateAppointmentChange(appointment);
  if (changeError) {
    return errorResponse(400, changeError);
  }

  const cancelledAppointment: Appointment = {
    ...appointment,
    status: 'cancelled',
  };

  replaceAppointment(cancelledAppointment);
  return [200, cancelledAppointment];
};

const handleRescheduleAppointment = (
  config: AxiosRequestConfig,
): MockResponse => {
  const appointment = findAppointment(
    getIdFromUrl(config, RESCHEDULE_APPOINTMENT_URL),
  );

  if (!appointment) {
    return errorResponse(404, 'Appointment not found.');
  }

  const changeError = validateAppointmentChange(appointment);
  if (changeError) {
    return errorResponse(400, changeError);
  }

  const { date, startTime, endTime } = parseBody<RescheduleBody>(config);
  const isSameSlot =
    appointment.date === date && appointment.startTime === startTime;

  if (isSameSlot) {
    return errorResponse(400, 'Please choose a different time to reschedule.');
  }

  const schedule = findSchedule(appointment.doctorId);
  if (!schedule) {
    return errorResponse(404, 'Doctor schedule not found.');
  }

  const rescheduledAppointment: Appointment = {
    ...appointment,
    date,
    startTime,
    endTime,
  };
  const otherAppointments = storedAppointments.filter(
    item => item.id !== appointment.id,
  );

  const bookingError = getBookingErrorResponse(
    rescheduledAppointment,
    schedule,
    otherAppointments,
  );
  if (bookingError) {
    return bookingError;
  }

  replaceAppointment(rescheduledAppointment);
  return [200, rescheduledAppointment];
};

export const setupMockServer = (client: AxiosInstance): void => {
  const mockAdapter = new MockAdapter(client, {
    delayResponse: NETWORK_DELAY_MS,
  });

  mockAdapter.onGet(API_ENDPOINTS.doctors).reply(handleGetDoctors);
  mockAdapter.onGet(DOCTOR_SCHEDULE_URL).reply(handleGetDoctorSchedule);
  mockAdapter.onGet(API_ENDPOINTS.appointments).reply(handleGetAppointments);
  mockAdapter.onPost(API_ENDPOINTS.appointments).reply(handleBookAppointment);
  mockAdapter.onPatch(CANCEL_APPOINTMENT_URL).reply(handleCancelAppointment);
  mockAdapter
    .onPatch(RESCHEDULE_APPOINTMENT_URL)
    .reply(handleRescheduleAppointment);
};
