import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DoctorCard from '../components/DoctorCard';
import {
  colors,
  fontSize,
  fontWeight,
  radius,
  spacing,
} from '../constants/theme';
import { MOCK_DOCTORS } from '../services/mock/mockData';

const BookingScreen = () => (
  <SafeAreaView style={styles.safeArea}>
    <StatusBar barStyle="dark-content" />

    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.headerLabel}>HEALTHCARE</Text>
      <Text style={styles.headerTitle}>Book Appointment</Text>
      <Text style={styles.headerSubtitle}>
        Find a doctor and schedule your visit.
      </Text>

      <Text style={styles.sectionTitle}>Select Doctor</Text>
      <View style={styles.doctorList}>
        {MOCK_DOCTORS.map(doctor => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </View>

      <Text style={styles.sectionTitle}>Select Date</Text>
      <View style={styles.emptyCard}>
        <Text style={styles.emptyTitle}>Choose appointment date</Text>
        <Text style={styles.emptyDescription}>Date selector coming next</Text>
      </View>

      <Text style={styles.sectionTitle}>Available Time Slots</Text>
      <View style={styles.emptyCard}>
        <Text style={styles.emptyTitle}>No slot selected</Text>
        <Text style={styles.emptyDescription}>
          Available appointment times will appear here.
        </Text>
      </View>
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  headerLabel: {
    color: colors.primary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    letterSpacing: 1.5,
    marginTop: spacing.md,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.display,
    fontWeight: fontWeight.extraBold,
    marginTop: spacing.xs,
  },
  headerSubtitle: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  doctorList: {
    gap: spacing.sm,
  },
  emptyCard: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  emptyTitle: {
    color: colors.textSecondary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  emptyDescription: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});

export default BookingScreen;
