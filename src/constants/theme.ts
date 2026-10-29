export const colors = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primaryLight: '#DBEAFE',
  primarySoft: '#EFF6FF',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  mutedSurface: '#F1F5F9',
  border: '#E2E8F0',
  success: '#15803D',
  successLight: '#DCFCE7',
  danger: '#DC2626',
  dangerLight: '#FEE2E2',
  textPrimary: '#0F172A',
  textSecondary: '#334155',
  textTertiary: '#475569',
  textMuted: '#64748B',
  textOnPrimary: '#FFFFFF',
} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
} as const;

export const fontSize = {
  xs: 12,
  sm: 13,
  md: 14,
  lg: 15,
  xl: 16,
  xxl: 18,
  display: 28,
} as const;

export const fontWeight = {
  regular: '400',
  semibold: '600',
  bold: '700',
  extraBold: '800',
} as const;
