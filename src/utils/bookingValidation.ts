import type {
  Appointment,
  BookAppointmentRequest,
  DoctorSchedule,
} from '../types';
import {
  doTimeRangesOverlap,
  getMinutesSinceMidnight,
  isPastDate,
  timeToMinutes,
  toDateString,
} from './dateTimeUtils';
import { generateTimeSlots } from './generateTimeSlots';

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 50;
const VALID_NAME_PATTERN = /^[A-Za-z\s.'-]+$/;

interface BookingValidationParams {
  request: BookAppointmentRequest;
  schedule: DoctorSchedule;
  now?: Date;
}

interface BookingConflictParams {
  request: BookAppointmentRequest;
  appointments: Appointment[];
}

const isSamePatient = (firstName: string, secondName: string): boolean =>
  firstName.trim().toLowerCase() === secondName.trim().toLowerCase();

export const validatePatientName = (patientName: string): string | null => {
  const trimmedName = patientName.trim();

  if (!trimmedName) {
    return 'Please enter the patient name.';
  }
  if (
    trimmedName.length < MIN_NAME_LENGTH ||
    trimmedName.length > MAX_NAME_LENGTH
  ) {
    return `Name must be between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} characters.`;
  }
  if (!VALID_NAME_PATTERN.test(trimmedName)) {
    return 'Please enter a valid name.';
  }
  return null;
};

export const hasAppointmentStarted = (
  appointment: Appointment,
  now: Date = new Date(),
): boolean => {
  const today = toDateString(now);

  if (appointment.date !== today) {
    return isPastDate(appointment.date, today);
  }
  return timeToMinutes(appointment.startTime) <= getMinutesSinceMidnight(now);
};

export const validateAppointmentChange = (
  appointment: Appointment,
  now: Date = new Date(),
): string | null => {
  if (appointment.status === 'cancelled') {
    return 'This appointment is already cancelled.';
  }
  if (hasAppointmentStarted(appointment, now)) {
    return 'Past appointments cannot be changed.';
  }
  return null;
};

export const validateBookingRequest = ({
  request,
  schedule,
  now = new Date(),
}: BookingValidationParams): string | null => {
  const nameError = validatePatientName(request.patientName);
  if (nameError) {
    return nameError;
  }

  if (isPastDate(request.date, toDateString(now))) {
    return 'Please choose today or a future date.';
  }

  const slotsForDate = generateTimeSlots({
    schedule,
    date: request.date,
    appointments: [],
    now,
  });
  const requestedSlot = slotsForDate.find(
    slot =>
      slot.startTime === request.startTime && slot.endTime === request.endTime,
  );

  if (!requestedSlot) {
    return 'The doctor is not available at this time.';
  }
  if (requestedSlot.status === 'past') {
    return 'This time has already passed. Please choose a later slot.';
  }
  return null;
};

export const findBookingConflict = ({
  request,
  appointments,
}: BookingConflictParams): string | null => {
  const overlappingAppointments = appointments.filter(
    appointment =>
      appointment.status === 'booked' &&
      appointment.date === request.date &&
      doTimeRangesOverlap(appointment, request),
  );

  const patientAlreadyBooked = overlappingAppointments.some(appointment =>
    isSamePatient(appointment.patientName, request.patientName),
  );
  if (patientAlreadyBooked) {
    return 'This patient already has an appointment at this time.';
  }

  const slotAlreadyBooked = overlappingAppointments.some(
    appointment => appointment.doctorId === request.doctorId,
  );
  if (slotAlreadyBooked) {
    return 'This slot is already booked. Please choose another slot.';
  }
  return null;
};
