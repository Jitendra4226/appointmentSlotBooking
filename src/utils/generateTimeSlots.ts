import type {
  Appointment,
  DateString,
  DoctorSchedule,
  SlotStatus,
  TimeRange,
  TimeSlot,
} from '../types';
import {
  doTimeRangesOverlap,
  getDayOfWeek,
  getMinutesSinceMidnight,
  isPastDate,
  minutesToTime,
  timeToMinutes,
  toDateString,
} from './dateTimeUtils';

interface GenerateTimeSlotsParams {
  schedule: DoctorSchedule;
  date: DateString;
  appointments: Appointment[];
  now?: Date;
}

const createSlotRanges = (
  workingHours: TimeRange,
  slotDurationMinutes: number,
): TimeRange[] => {
  const dayStartMinutes = timeToMinutes(workingHours.startTime);
  const dayEndMinutes = timeToMinutes(workingHours.endTime);
  const slotCount = Math.floor(
    (dayEndMinutes - dayStartMinutes) / slotDurationMinutes,
  );

  return Array.from({ length: slotCount }, (_, slotIndex) => {
    const slotStartMinutes = dayStartMinutes + slotIndex * slotDurationMinutes;

    return {
      startTime: minutesToTime(slotStartMinutes),
      endTime: minutesToTime(slotStartMinutes + slotDurationMinutes),
    };
  });
};

export const generateTimeSlots = ({
  schedule,
  date,
  appointments,
  now = new Date(),
}: GenerateTimeSlotsParams): TimeSlot[] => {
  const today = toDateString(now);
  const isWorkingDay = schedule.workingDays.includes(getDayOfWeek(date));

  if (isPastDate(date, today) || !isWorkingDay) {
    return [];
  }

  const blockedRanges: TimeRange[] = [
    ...schedule.breaks,
    ...schedule.unavailablePeriods.filter(period => period.date === date),
  ];

  const bookedAppointments = appointments.filter(
    appointment =>
      appointment.doctorId === schedule.doctorId &&
      appointment.date === date &&
      appointment.status === 'booked',
  );

  const currentMinutes = getMinutesSinceMidnight(now);

  const isBlocked = (slot: TimeRange) =>
    blockedRanges.some(blockedRange => doTimeRangesOverlap(slot, blockedRange));

  const isBooked = (slot: TimeRange) =>
    bookedAppointments.some(appointment =>
      doTimeRangesOverlap(slot, appointment),
    );

  const hasStarted = (slot: TimeRange) =>
    date === today && timeToMinutes(slot.startTime) <= currentMinutes;

  const getSlotStatus = (slot: TimeRange): SlotStatus => {
    if (hasStarted(slot)) {
      return 'past';
    }
    if (isBooked(slot)) {
      return 'booked';
    }
    return 'available';
  };

  const workingSlots = createSlotRanges(
    schedule.workingHours,
    schedule.slotDurationMinutes,
  );
  const openSlots = workingSlots.filter(slot => !isBlocked(slot));

  return openSlots.map(slot => ({
    ...slot,
    id: `${schedule.doctorId}_${date}_${slot.startTime}`,
    status: getSlotStatus(slot),
  }));
};
