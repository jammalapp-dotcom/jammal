// جمّال - نظام الثيمات الموحد
// يُستخدم حصرياً من الويب والموبايل - لا تغيّر الألوان في مكان آخر
// التصميم: Deep Navy + Golden Bronze "Saudi Tech"

// ==================== الألوان ====================

export const colors = {
    // الأساسي - أزرق بحري عميق
    primary: '#1B2A4A',
    primaryLight: '#2D4A7A',
    primaryDark: '#0F1A2E',

    // التمييز - ذهبي/برونزي رملي
    accent: '#C8973E',
    accentLight: '#D4AD5E',
    accentDark: '#A67B2E',

    // الخلفيات
    background: '#F7F6F2',
    backgroundSecondary: '#EDECE8',
    surface: '#FFFFFF',

    // النصوص
    textPrimary: '#1B2A4A',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    textOnPrimary: '#FFFFFF',
    textOnAccent: '#FFFFFF',

    // الحالات
    success: '#10B981',
    successLight: '#D1FAE5',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    error: '#EF4444',
    errorLight: '#FEE2E2',
    info: '#3B82F6',
    infoLight: '#DBEAFE',

    // الحدود
    border: '#E5E7EB',
    borderLight: '#F3F4F6',

    // حالات الشحنة
    statusDraft: '#9CA3AF',
    statusSearching: '#F59E0B',
    statusAssigned: '#3B82F6',
    statusPickup: '#8B5CF6',
    statusEnRoute: '#1B2A4A',
    statusDelivered: '#10B981',
    statusDisputed: '#EF4444',
    statusCancelled: '#6B7280',
} as const;

// ==================== المسافات ====================

export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
} as const;

// ==================== زوايا الحدود ====================

export const radius = {
    small: 8,
    medium: 12,
    large: 16,
    xl: 20,
    full: 9999,
} as const;

// ==================== الخطوط ====================

export const fonts = {
    /** العائلة الأساسية - يمكن تغييرها حسب المنصة */
    family: {
        regular: 'System',
        medium: 'System',
        bold: 'System',
    },
    /** أحجام الخطوط */
    sizes: {
        heroValue: 48,
        heroLabel: 11,
        title: 28,
        subtitle: 20,
        cardTitle: 16,
        cardValue: 24,
        body: 15,
        caption: 13,
        small: 11,
        price: 18,
        bigPrice: 32,
    },
    /** أوزان الخطوط */
    weights: {
        regular: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const,
    },
} as const;

// ==================== الطباعة (React Native) ====================

export const typography = {
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
} as const;

// ==================== الظلال (React Native) ====================

export const shadows = {
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
} as const;

// ==================== متغيرات CSS (للويب) ====================

/**
 * توليد متغيرات CSS من الثيم
 * تُستخدم في apps/web فقط
 */
export function generateCSSVariables(): string {
    return `
:root {
  /* ألوان أساسية */
  --color-primary: ${colors.primary};
  --color-primary-light: ${colors.primaryLight};
  --color-primary-dark: ${colors.primaryDark};
  --color-accent: ${colors.accent};
  --color-accent-light: ${colors.accentLight};
  --color-accent-dark: ${colors.accentDark};

  /* خلفيات */
  --color-background: ${colors.background};
  --color-background-secondary: ${colors.backgroundSecondary};
  --color-surface: ${colors.surface};

  /* نصوص */
  --color-text-primary: ${colors.textPrimary};
  --color-text-secondary: ${colors.textSecondary};
  --color-text-tertiary: ${colors.textTertiary};

  /* حالات */
  --color-success: ${colors.success};
  --color-warning: ${colors.warning};
  --color-error: ${colors.error};
  --color-info: ${colors.info};

  /* حدود */
  --color-border: ${colors.border};
  --color-border-light: ${colors.borderLight};

  /* مسافات */
  --spacing-xs: ${spacing.xs}px;
  --spacing-sm: ${spacing.sm}px;
  --spacing-md: ${spacing.md}px;
  --spacing-lg: ${spacing.lg}px;
  --spacing-xl: ${spacing.xl}px;
  --spacing-xxl: ${spacing.xxl}px;
  --spacing-xxxl: ${spacing.xxxl}px;

  /* زوايا */
  --radius-small: ${radius.small}px;
  --radius-medium: ${radius.medium}px;
  --radius-large: ${radius.large}px;
  --radius-xl: ${radius.xl}px;
  --radius-full: ${radius.full}px;

  /* خطوط */
  --font-size-title: ${fonts.sizes.title}px;
  --font-size-subtitle: ${fonts.sizes.subtitle}px;
  --font-size-body: ${fonts.sizes.body}px;
  --font-size-caption: ${fonts.sizes.caption}px;
  --font-size-small: ${fonts.sizes.small}px;
}
  `.trim();
}

// ==================== الثيم المُجمَّع ====================

/** الثيم الكامل كأوبجكت واحد (للتوافقية مع الكود الحالي) */
export const theme = {
    ...colors,
    spacing,
    radius,
    typography,
    shadows,
} as const;

export type Theme = typeof theme;
