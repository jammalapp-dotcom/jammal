// Jammal - جمّال Theme System
// Deep Navy + Golden Bronze "Saudi Tech" aesthetic

export const theme = {
  // Primary - Deep Navy Blue
  primary: '#1B2A4A',
  primaryLight: '#2D4A7A',
  primaryDark: '#0F1A2E',

  // Accent - Golden/Sand Bronze
  accent: '#C8973E',
  accentLight: '#D4AD5E',
  accentDark: '#A67B2E',

  // Backgrounds
  background: '#F7F6F2',
  backgroundSecondary: '#EDECE8',
  surface: '#FFFFFF',

  // Text
  textPrimary: '#1B2A4A',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textOnPrimary: '#FFFFFF',
  textOnAccent: '#FFFFFF',

  // Status
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  // Borders
  border: '#E5E7EB',
  borderLight: '#F3F4F6',

  // Shipment Status Colors
  statusDraft: '#9CA3AF',
  statusSearching: '#F59E0B',
  statusAssigned: '#3B82F6',
  statusPickup: '#8B5CF6',
  statusEnRoute: '#1B2A4A',
  statusDelivered: '#10B981',
  statusDisputed: '#EF4444',

  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  // Border Radius
  radius: {
    small: 8,
    medium: 12,
    large: 16,
    xl: 20,
    full: 9999,
  },

  // Typography
  typography: {
    heroValue: { fontSize: 48, fontWeight: '700' as const },
    heroLabel: { fontSize: 11, fontWeight: '600' as const, textTransform: 'uppercase' as const, letterSpacing: 1 },
    title: { fontSize: 28, fontWeight: '700' as const },
    subtitle: { fontSize: 20, fontWeight: '600' as const },
    cardTitle: { fontSize: 16, fontWeight: '600' as const },
    cardValue: { fontSize: 24, fontWeight: '700' as const },
    body: { fontSize: 15, fontWeight: '400' as const },
    bodyBold: { fontSize: 15, fontWeight: '600' as const },
    caption: { fontSize: 13, fontWeight: '400' as const },
    small: { fontSize: 11, fontWeight: '500' as const },
    price: { fontSize: 18, fontWeight: '700' as const },
    bigPrice: { fontSize: 32, fontWeight: '700' as const },
  },

  // Shadows
  shadows: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    cardElevated: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    modal: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
  },
};

export type Theme = typeof theme;
