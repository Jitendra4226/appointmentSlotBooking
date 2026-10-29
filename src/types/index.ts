export type DateString = string; // YYYY-MM-DD
export type TimeString = string; // HH:mm (24-hour)

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experienceYears: number;
}

export interface TimeRange {
  startTime: TimeString;
  endTime: TimeString;
}

export interface UnavailablePeriod extends TimeRange {
  date: DateString;
}

export interface DoctorSchedule {
  doctorId: string;
  workingDays: number[]; // 0 = Sunday ... 6 = Saturday
  workingHours: TimeRange;
  slotDurationMinutes: number;
  breaks: TimeRange[];
  unavailablePeriods: UnavailablePeriod[];
}

export type SlotStatus = 'available' | 'booked' | 'past';

export interface TimeSlot extends TimeRange {
  id: string;
  status: SlotStatus;
}

export type AppointmentStatus = 'booked' | 'cancelled';

export interface Appointment extends TimeRange {
  id: string;
  doctorId: string;
  patientName: string;
  date: DateString;
  status: AppointmentStatus;
}

export type BookAppointmentRequest = Omit<Appointment, 'id' | 'status'>;

export type RescheduleAppointmentRequest = Pick<
  Appointment,
  'id' | 'date' | 'startTime' | 'endTime'
>;
