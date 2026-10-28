import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  colors,
  fontSize,
  fontWeight,
  radius,
  spacing,
} from '../constants/theme';
import type { Doctor } from '../types';

interface DoctorCardProps {
  doctor: Doctor;
}

const AVATAR_SIZE = 52;

const getDoctorInitials = (doctorName: string): string => {
  const nameWithoutTitle = doctorName.replace('Dr. ', '');
  const [firstName = '', lastName = ''] = nameWithoutTitle.split(' ');

  return `${firstName.charAt(0)}${lastName.charAt(0)}`;
};

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  const { name, specialization, experienceYears } = doctor;
  const initials = getDoctorInitials(name);
  const experienceText = `${experienceYears} years experience`;

  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>

      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>{name}</Text>
        <Text style={styles.specialization}>{specialization}</Text>
        <Text style={styles.experience}>{experienceText}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
  },
  avatarText: {
    color: colors.primaryDark,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.extraBold,
  },
  doctorInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  doctorName: {
    color: colors.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  specialization: {
    color: colors.textTertiary,
    fontSize: fontSize.md,
    marginTop: spacing.xxs,
  },
  experience: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: spacing.xxs,
  },
});

export default DoctorCard;
