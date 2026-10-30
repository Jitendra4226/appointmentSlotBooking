import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BOOKING_DAYS_AHEAD } from '../constants/appConstants';
import { colors, fontSize, fontWeight, spacing } from '../constants/theme';
import { useAvailableSlots } from '../hooks/useAvailableSlots';
import { getApiErrorMessage } from '../services/apiClient';
import type { DateString, TimeSlot } from '../types';
import {
  formatDisplayDate,
  formatTimeRange,
  getUpcomingDates,
} from '../utils/dateTimeUtils';
import DateSelector from './DateSelector';
import ErrorMessage from './ErrorMessage';
import LoadingView from './LoadingView';
import TimeSlotGrid from './TimeSlotGrid';

interface SlotPickerProps {
  doctorId: string | undefined;
  doctorName: string;
  selectedDate: DateString;
  onSelectDate: (date: DateString) => void;
  selectedSlot: TimeSlot | null;
  onSelectSlot: (slot: TimeSlot) => void;
}

const SlotPicker = ({
  doctorId,
  doctorName,
  selectedDate,
  onSelectDate,
  selectedSlot,
  onSelectSlot,
}: SlotPickerProps) => {
  const dates = getUpcomingDates(BOOKING_DAYS_AHEAD);
  const { schedule, slots, isLoading, error, retry } = useAvailableSlots(
    doctorId,
    selectedDate,
  );

  const breakTimes = schedule?.breaks.map(formatTimeRange).join(', ');
  const unavailableTimes = schedule?.unavailablePeriods
    .filter(period => period.date === selectedDate)
    .map(formatTimeRange)
    .join(', ');

  const renderSlots = () => {
    if (isLoading) {
      return <LoadingView message="Loading available slots..." />;
    }
    if (error) {
      return (
        <ErrorMessage message={getApiErrorMessage(error)} onRetry={retry} />
      );
    }
    return (
      <TimeSlotGrid
        slots={slots}
        selectedSlotId={selectedSlot?.id ?? null}
        onSelectSlot={onSelectSlot}
        emptyMessage={`${doctorName} is not available on ${formatDisplayDate(
          selectedDate,
        )}.`}
      />
    );
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>Select Date</Text>
      <DateSelector
        dates={dates}
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
      />

      <Text style={styles.sectionTitle}>Available Time Slots</Text>
      {schedule ? (
        <View style={styles.scheduleInfo}>
          <Text style={styles.scheduleText}>
            {`Working hours: ${formatTimeRange(schedule.workingHours)} (${
              schedule.slotDurationMinutes
            } min slots)`}
          </Text>
          <Text style={styles.scheduleText}>
            {`Break: ${breakTimes || 'None'}`}
          </Text>
          {unavailableTimes ? (
            <Text style={styles.scheduleText}>
              {`Unavailable on this date: ${unavailableTimes}`}
            </Text>
          ) : null}
        </View>
      ) : null}
      {renderSlots()}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  scheduleInfo: {
    gap: spacing.xxs,
    marginBottom: spacing.sm,
  },
  scheduleText: {
    color: colors.textTertiary,
    fontSize: fontSize.sm,
  },
});

export default SlotPicker;
