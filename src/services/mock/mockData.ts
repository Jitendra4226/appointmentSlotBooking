import type { Appointment, Doctor, DoctorSchedule } from '../../types';
import { getUpcomingDates } from '../../utils/dateTimeUtils';

const upcomingDates = getUpcomingDates(3);
const tomorrow = upcomingDates[1];
const dayAfterTomorrow = upcomingDates[2];

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Rahul Sharma',
    specialization: 'Cardiologist',
    experienceYears: 12,
  },
  {
    id: 'doc-2',
    name: 'Dr. Priya Mehta',
    specialization: 'Dermatologist',
    experienceYears: 8,
  },
  {
    id: 'doc-3',
    name: 'Dr. Arjun Nair',
    specialization: 'Orthopedic Surgeon',
    experienceYears: 15,
  },
];

export const MOCK_SCHEDULES: DoctorSchedule[] = [
  {
    doctorId: 'doc-1',
    workingDays: [1, 2, 3, 4, 5, 6],
    workingHours: { startTime: '09:00', endTime: '17:00' },
    slotDurationMinutes: 30,
    breaks: [{ startTime: '13:00', endTime: '14:00' }],
    unavailablePeriods: [
      { date: dayAfterTomorrow, startTime: '09:00', endTime: '12:00' },
    ],
  },
  {
    doctorId: 'doc-2',
    workingDays: [1, 2, 3, 4, 5],
    workingHours: { startTime: '10:00', endTime: '16:00' },
    slotDurationMinutes: 20,
    breaks: [{ startTime: '12:00', endTime: '12:40' }],
    unavailablePeriods: [
      { date: tomorrow, startTime: '10:00', endTime: '16:00' },
    ],
  },
  {
    doctorId: 'doc-3',
    workingDays: [2, 4, 6],
    workingHours: { startTime: '09:00', endTime: '13:00' },
    slotDurationMinutes: 45,
    breaks: [{ startTime: '11:00', endTime: '11:15' }],
    unavailablePeriods: [],
  },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    doctorId: 'doc-1',
    patientName: 'Amit Verma',
    date: tomorrow,
    startTime: '10:00',
    endTime: '10:30',
    status: 'booked',
  },
  {
    id: 'apt-2',
    doctorId: 'doc-1',
    patientName: 'Sneha Patil',
    date: tomorrow,
    startTime: '11:30',
    endTime: '12:00',
    status: 'booked',
  },
  {
    id: 'apt-3',
    doctorId: 'doc-1',
    patientName: 'Rohan Gupta',
    date: tomorrow,
    startTime: '15:00',
    endTime: '15:30',
    status: 'cancelled',
  },
];
