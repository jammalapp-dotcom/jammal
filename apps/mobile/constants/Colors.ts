// جمّال — إعادة تصدير الألوان من الحزمة المشتركة
import { colors } from '@jammal/ui';

export const Colors = {
    light: {
        text: colors.textPrimary,
        background: colors.surface,
        tint: colors.primary,
        icon: colors.textSecondary,
        tabIconDefault: colors.textSecondary,
        tabIconSelected: colors.primary,
    },
    dark: {
        text: '#ECEDEE',
        background: '#151718',
        tint: '#fff',
        icon: '#9BA1A6',
        tabIconDefault: '#9BA1A6',
        tabIconSelected: '#fff',
    },
};
