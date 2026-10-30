import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import {
  colors,
  fontSize,
  fontWeight,
  radius,
  spacing,
} from '../constants/theme';
import type { DateString } from '../types';
import { getDateParts, getTodayDateString } from '../utils/dateTimeUtils';

interface DateSelectorProps {
  dates: DateString[];
  selectedDate: DateString;
  onSelectDate: (date: DateString) => void;
}

const DATE_CHIP_WIDTH = 64;

const DateSelector = ({
  dates,
  selectedDate,
  onSelectDate,
}: DateSelectorProps) => {
  const today = getTodayDateString();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.dateList}
    >
      {dates.map(date => {
        const { weekday, day, month } = getDateParts(date);
        const isSelected = date === selectedDate;
        const weekdayLabel = date === today ? 'Today' : weekday;

        return (
          <Pressable
            key={date}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onSelectDate(date)}
            style={[styles.dateChip, isSelected && styles.selectedDateChip]}
          >
            <Text style={[styles.weekday, isSelected && styles.selectedText]}>
              {weekdayLabel}
            </Text>
            <Text style={[styles.day, isSelected && styles.selectedText]}>
              {day}
            </Text>
            <Text style={[styles.month, isSelected && styles.selectedText]}>
              {month}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  dateList: {
    gap: spacing.xs,
  },
  dateChip: {
    width: DATE_CHIP_WIDTH,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedDateChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  weekday: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  day: {
    color: colors.textPrimary,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    marginVertical: spacing.xxs,
  },
  month: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  selectedText: {
    color: colors.textOnPrimary,
  },
});

export default DateSelector;
