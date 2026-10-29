import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  colors,
  fontSize,
  fontWeight,
  radius,
  spacing,
} from '../constants/theme';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => (
  <View style={styles.container}>
    <Text style={styles.message}>{message}</Text>
    {onRetry ? (
      <Pressable accessibilityRole="button" hitSlop={8} onPress={onRetry}>
        <Text style={styles.retryText}>Try again</Text>
      </Pressable>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
    padding: spacing.md,
    backgroundColor: colors.dangerLight,
    borderRadius: radius.md,
  },
  message: {
    color: colors.danger,
    fontSize: fontSize.md,
  },
  retryText: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
});

export default ErrorMessage;
