import type { DateString, TimeRange, TimeString } from '../types';

const MINUTES_PER_HOUR = 60;
const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const padToTwoDigits = (value: number): string =>
  String(value).padStart(2, '0');

export const timeToMinutes = (time: TimeString): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * MINUTES_PER_HOUR + minutes;
};

export const minutesToTime = (totalMinutes: number): TimeString => {
  const hours = Math.floor(totalMinutes / MINUTES_PER_HOUR);
  const minutes = totalMinutes % MINUTES_PER_HOUR;
  return `${padToTwoDigits(hours)}:${padToTwoDigits(minutes)}`;
};

export const getMinutesSinceMidnight = (date: Date): number =>
  date.getHours() * MINUTES_PER_HOUR + date.getMinutes();

export const doTimeRangesOverlap = (
  firstRange: TimeRange,
  secondRange: TimeRange,
): boolean => {
  const firstStartsBeforeSecondEnds =
    timeToMinutes(firstRange.startTime) < timeToMinutes(secondRange.endTime);
  const secondStartsBeforeFirstEnds =
    timeToMinutes(secondRange.startTime) < timeToMinutes(firstRange.endTime);

  return firstStartsBeforeSecondEnds && secondStartsBeforeFirstEnds;
};

export const formatTimeForDisplay = (time: TimeString): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours < 12 ? 'AM' : 'PM';
  const displayHours = hours % 12 || 12;

  return `${displayHours}:${padToTwoDigits(minutes)} ${period}`;
};

export const formatTimeRange = ({ startTime, endTime }: TimeRange): string =>
  `${formatTimeForDisplay(startTime)} – ${formatTimeForDisplay(endTime)}`;

export const toDateString = (date: Date): DateString => {
  const year = date.getFullYear();
  const month = padToTwoDigits(date.getMonth() + 1);
  const day = padToTwoDigits(date.getDate());

  return `${year}-${month}-${day}`;
};

export const getTodayDateString = (): DateString => toDateString(new Date());

const parseDateString = (date: DateString): Date => {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const getDayOfWeek = (date: DateString): number =>
  parseDateString(date).getDay();

export const isPastDate = (
  date: DateString,
  today: DateString = getTodayDateString(),
): boolean => date < today;

export const getUpcomingDates = (
  numberOfDays: number,
  startDate: Date = new Date(),
): DateString[] =>
  Array.from({ length: numberOfDays }, (_, dayOffset) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + dayOffset);
    return toDateString(date);
  });

export const getDateParts = (date: DateString) => {
  const parsedDate = parseDateString(date);

  return {
    weekday: WEEKDAY_NAMES[parsedDate.getDay()],
    day: parsedDate.getDate(),
    month: MONTH_NAMES[parsedDate.getMonth()],
  };
};

export const formatDisplayDate = (date: DateString): string => {
  const { weekday, day, month } = getDateParts(date);
  return `${weekday}, ${day} ${month}`;
};
