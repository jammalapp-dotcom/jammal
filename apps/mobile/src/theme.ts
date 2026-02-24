// ============================================================================
// JAMMAL — Theme Constants
// ============================================================================

export const colors = {
    // Primary brand colors (from logo)
    primary: '#1B365D',      // Deep navy blue
    primaryLight: '#2A5298',
    primaryDark: '#0F1F3D',
    accent: '#C4973B',       // Gold from camel/shield
    accentLight: '#D4A94E',

    // Backgrounds
    background: '#F5F7FA',
    surface: '#FFFFFF',
    surfaceDark: '#1A1A2E',

    // Text
    text: '#1A1A2E',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    textInverse: '#FFFFFF',

    // Status
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    // Border
    border: '#E5E7EB',
    borderLight: '#F3F4F6',

    // Shipment status colors
    statusDraft: '#6B7280',
    statusSearching: '#F59E0B',
    statusAssigned: '#3B82F6',
    statusInTransit: '#8B5CF6',
    statusDelivered: '#10B981',
    statusCancelled: '#EF4444',
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const typography = {
    h1: { fontSize: 28, fontWeight: '700' as const, lineHeight: 36 },
    h2: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28 },
    h3: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
    body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
    bodySmall: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
    caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
    button: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
};

export const borderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
};
