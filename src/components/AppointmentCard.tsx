import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';
import {
  colors,
  fontSize,
  fontWeight,
  radius,
  spacing,
} from '../constants/theme';
import type { Appointment } from '../types';
import { hasAppointmentStarted } from '../utils/bookingValidation';
import { formatDisplayDate, formatTimeRange } from '../utils/dateTimeUtils';

type DisplayStatus = 'upcoming' | 'past' | 'cancelled';

interface AppointmentCardProps {
  appointment: Appointment;
  doctorName: string;
  onPress?: () => void;
}

const STATUS_LABELS: Record<DisplayStatus, string> = {
  upcoming: 'Upcoming',
  past: 'Past',
  cancelled: 'Cancelled',
};

const getDisplayStatus = (appointment: Appointment): DisplayStatus => {
  if (appointment.status === 'cancelled') {
    return 'cancelled';
  }
  return hasAppointmentStarted(appointment) ? 'past' : 'upcoming';
};

const AppointmentCard = ({
  appointment,
  doctorName,
  onPress,
}: AppointmentCardProps) => {
  const displayStatus = getDisplayStatus(appointment);
  const currentStatusStyle = statusStyles[displayStatus];
  const dateTimeText = `${formatDisplayDate(
    appointment.date,
  )} · ${formatTimeRange(appointment)}`;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={!onPress}
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.headerRow}>
        <Text style={styles.doctorName}>{doctorName}</Text>
        <View style={[styles.badge, currentStatusStyle.badge]}>
          <Text style={[styles.badgeText, currentStatusStyle.text]}>
            {STATUS_LABELS[displayStatus]}
          </Text>
        </View>
      </View>
      <Text style={styles.dateTime}>{dateTimeText}</Text>
      <Text style={styles.patientName}>
        {`Patient: ${appointment.patientName}`}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: spacing.xxs,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  doctorName: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  badge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
    borderRadius: radius.sm,
  },
  badgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  upcomingBadge: {
    backgroundColor: colors.successLight,
  },
  upcomingText: {
    color: colors.success,
  },
  pastBadge: {
    backgroundColor: colors.mutedSurface,
  },
  pastText: {
    color: colors.textMuted,
  },
  cancelledBadge: {
    backgroundColor: colors.dangerLight,
  },
  cancelledText: {
    color: colors.danger,
  },
  dateTime: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
  },
  patientName: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
});

const statusStyles: Record<
  DisplayStatus,
  { badge: ViewStyle; text: TextStyle }
> = {
  upcoming: { badge: styles.upcomingBadge, text: styles.upcomingText },
  past: { badge: styles.pastBadge, text: styles.pastText },
  cancelled: { badge: styles.cancelledBadge, text: styles.cancelledText },
};

export default AppointmentCard;
