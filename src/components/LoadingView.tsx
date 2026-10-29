import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, spacing } from '../constants/theme';

interface LoadingViewProps {
  message?: string;
}

const LoadingView = ({ message }: LoadingViewProps) => (
  <View style={styles.container}>
    <ActivityIndicator color={colors.primary} />
    {message ? <Text style={styles.message}>{message}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    padding: spacing.lg,
  },
  message: {
    color: colors.textMuted,
    fontSize: fontSize.md,
  },
});

export default LoadingView;
