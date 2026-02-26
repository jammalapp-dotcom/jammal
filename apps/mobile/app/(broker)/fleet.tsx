// ============================================================================
// JAMMAL — Broker Fleet Management Screen
// ============================================================================

import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function FleetScreen() {
    const { i18n } = useTranslation();
    const isAr = i18n.language === 'ar';

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{isAr ? 'إدارة الأسطول' : 'Fleet Management'}</Text>
                <Pressable style={styles.addBtn}>
                    <Ionicons name="add" size={24} color={colors.textInverse} />
                </Pressable>
            </View>

            {/* Summary */}
            <View style={styles.summaryRow}>
                {[
                    { value: '0', label: isAr ? 'إجمالي' : 'Total', color: colors.primary },
                    { value: '0', label: isAr ? 'متصل' : 'Online', color: colors.success },
                    { value: '0', label: isAr ? 'في رحلة' : 'On Trip', color: colors.statusInTransit },
                ].map((s, i) => (
                    <View key={i} style={styles.summaryCard}>
                        <Text style={[styles.summaryVal, { color: s.color }]}>{s.value}</Text>
                        <Text style={styles.summaryLabel}>{s.label}</Text>
                    </View>
                ))}
            </View>

            {/* Empty state */}
            <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={64} color={colors.textMuted} />
                <Text style={styles.emptyTitle}>{isAr ? 'لا يوجد سائقين بعد' : 'No drivers yet'}</Text>
                <Text style={styles.emptyDesc}>
                    {isAr ? 'أضف سائقين إلى أسطولك' : 'Add drivers to your fleet'}
                </Text>
                <Pressable style={styles.emptyBtn}>
                    <Text style={styles.emptyBtnText}>{isAr ? 'إضافة سائق' : 'Add Driver'}</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: 60, paddingHorizontal: spacing.xl, paddingBottom: spacing.md,
    },
    title: { ...typography.h2, color: colors.text },
    addBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
    },
    summaryRow: { flexDirection: 'row', gap: 10, paddingHorizontal: spacing.xl, marginBottom: spacing.lg },
    summaryCard: {
        flex: 1, backgroundColor: colors.surface, borderRadius: borderRadius.md,
        padding: spacing.md, alignItems: 'center',
    },
    summaryVal: { ...typography.h2 },
    summaryLabel: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
    emptyState: { alignItems: 'center', paddingTop: 60, paddingHorizontal: spacing.xl },
    emptyTitle: { ...typography.h3, color: colors.text, marginTop: spacing.lg },
    emptyDesc: { ...typography.body, color: colors.textMuted, marginTop: spacing.xs, textAlign: 'center' },
    emptyBtn: {
        backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingVertical: 12,
        borderRadius: borderRadius.md, marginTop: spacing.lg,
    },
    emptyBtnText: { ...typography.button, color: colors.textInverse, fontSize: 14 },
});
