// ============================================================================
// JAMMAL — Broker Customers Screen
// ============================================================================

import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function CustomersScreen() {
    const { i18n } = useTranslation();
    const isAr = i18n.language === 'ar';

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{isAr ? 'العملاء' : 'Customers'}</Text>
            </View>
            <View style={styles.emptyState}>
                <Ionicons name="business-outline" size={64} color={colors.textMuted} />
                <Text style={styles.emptyTitle}>{isAr ? 'لا يوجد عملاء بعد' : 'No customers yet'}</Text>
                <Text style={styles.emptyDesc}>
                    {isAr ? 'العملاء المرتبطين بحسابك سيظهرون هنا' : 'Customers linked to your account will appear here'}
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { paddingTop: 60, paddingHorizontal: spacing.xl, paddingBottom: spacing.md },
    title: { ...typography.h2, color: colors.text },
    emptyState: { alignItems: 'center', paddingTop: 80, paddingHorizontal: spacing.xl },
    emptyTitle: { ...typography.h3, color: colors.text, marginTop: spacing.lg },
    emptyDesc: { ...typography.body, color: colors.textMuted, marginTop: spacing.xs, textAlign: 'center' },
});
