import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  colors,
  fontSize,
  fontWeight,
  radius,
  spacing,
} from '../constants/theme';
import type { TimeSlot } from '../types';
import { formatTimeForDisplay } from '../utils/dateTimeUtils';

interface TimeSlotItemProps {
  slot: TimeSlot;
  isSelected: boolean;
  onSelect: (slot: TimeSlot) => void;
}

interface TimeSlotGridProps {
  slots: TimeSlot[];
  selectedSlotId: string | null;
  onSelectSlot: (slot: TimeSlot) => void;
  emptyMessage: string;
}

const TimeSlotItem = ({ slot, isSelected, onSelect }: TimeSlotItemProps) => {
  const isAvailable = slot.status === 'available';
  const isBooked = slot.status === 'booked';
  const statusLabel = isBooked ? 'Booked' : 'Past';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !isAvailable, selected: isSelected }}
      disabled={!isAvailable}
      onPress={() => onSelect(slot)}
      style={[
        styles.slot,
        isBooked && styles.bookedSlot,
        slot.status === 'past' && styles.pastSlot,
        isSelected && styles.selectedSlot,
      ]}
    >
      <Text style={[styles.time, isSelected && styles.selectedTime]}>
        {formatTimeForDisplay(slot.startTime)}
      </Text>
      {isAvailable ? null : (
        <Text style={[styles.statusLabel, isBooked && styles.bookedLabel]}>
          {statusLabel}
        </Text>
      )}
    </Pressable>
  );
};

const TimeSlotGrid = ({
  slots,
  selectedSlotId,
  onSelectSlot,
  emptyMessage,
}: TimeSlotGridProps) => {
  if (slots.length === 0) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyMessage}>{emptyMessage}</Text>
      </View>
    );
  }

  const availableCount = slots.filter(
    slot => slot.status === 'available',
  ).length;

  return (
    <View>
      <Text style={styles.summary}>
        {`${availableCount} of ${slots.length} slots available`}
      </Text>
      <View style={styles.grid}>
        {slots.map(slot => (
          <TimeSlotItem
            key={slot.id}
            slot={slot}
            isSelected={slot.id === selectedSlotId}
            onSelect={onSelectSlot}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  summary: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginBottom: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyCard: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  emptyMessage: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    textAlign: 'center',
  },
  slot: {
    width: '31%',
    marginRight: '2%',
    marginBottom: spacing.xs,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bookedSlot: {
    backgroundColor: colors.dangerLight,
    borderColor: colors.dangerLight,
  },
  pastSlot: {
    backgroundColor: colors.mutedSurface,
    borderColor: colors.mutedSurface,
  },
  selectedSlot: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  time: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  selectedTime: {
    color: colors.textOnPrimary,
  },
  statusLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: spacing.xxs,
  },
  bookedLabel: {
    color: colors.danger,
  },
});

export default TimeSlotGrid;
