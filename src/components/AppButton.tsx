import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';
import {
  colors,
  fontSize,
  fontWeight,
  radius,
  spacing,
} from '../constants/theme';

type ButtonVariant = 'primary' | 'outline' | 'danger';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  isLoading?: boolean;
  disabled?: boolean;
}

const BUTTON_HEIGHT = 48;

const AppButton = ({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
}: AppButtonProps) => {
  const isDisabled = disabled || isLoading;
  const currentVariant = variantStyles[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        currentVariant.button,
        pressed && styles.pressed,
        isDisabled && styles.disabled,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={currentVariant.loaderColor} />
      ) : (
        <Text style={[styles.title, currentVariant.title]}>{title}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: BUTTON_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  outlineButton: {
    backgroundColor: colors.surface,
    borderColor: colors.primary,
  },
  dangerButton: {
    backgroundColor: colors.surface,
    borderColor: colors.danger,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  primaryTitle: {
    color: colors.textOnPrimary,
  },
  outlineTitle: {
    color: colors.primary,
  },
  dangerTitle: {
    color: colors.danger,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
});

const variantStyles: Record<
  ButtonVariant,
  { button: ViewStyle; title: TextStyle; loaderColor: string }
> = {
  primary: {
    button: styles.primaryButton,
    title: styles.primaryTitle,
    loaderColor: colors.textOnPrimary,
  },
  outline: {
    button: styles.outlineButton,
    title: styles.outlineTitle,
    loaderColor: colors.primary,
  },
  danger: {
    button: styles.dangerButton,
    title: styles.dangerTitle,
    loaderColor: colors.danger,
  },
};

export default AppButton;
