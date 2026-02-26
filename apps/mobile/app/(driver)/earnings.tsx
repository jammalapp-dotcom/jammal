// ============================================================================
// JAMMAL — Driver Earnings Screen
// ============================================================================

import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function EarningsScreen() {
    const { t, i18n } = useTranslation();
    const isAr = i18n.language === 'ar';

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{t('tabs.earnings')}</Text>
            </View>

            {/* Earnings Summary Card */}
            <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>{isAr ? 'إجمالي الأرباح' : 'Total Earnings'}</Text>
                <Text style={styles.summaryValue}>0.00 <Text style={styles.currency}>{t('common.sar')}</Text></Text>
                <View style={styles.summaryRow}>
                    <View style={styles.summaryCol}>
                        <Text style={styles.colValue}>0.00</Text>
                        <Text style={styles.colLabel}>{t('driver.todayEarnings')}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.summaryCol}>
                        <Text style={styles.colValue}>0.00</Text>
                        <Text style={styles.colLabel}>{isAr ? 'هذا الأسبوع' : 'This Week'}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.summaryCol}>
                        <Text style={styles.colValue}>0.00</Text>
                        <Text style={styles.colLabel}>{isAr ? 'هذا الشهر' : 'This Month'}</Text>
                    </View>
                </View>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
                {[
                    { icon: 'car', label: t('driver.totalTrips'), value: '0' },
                    { icon: 'star', label: isAr ? 'التقييم' : 'Rating', value: '—' },
                    { icon: 'checkmark-circle', label: isAr ? 'نسبة القبول' : 'Accept Rate', value: '—' },
                    { icon: 'time', label: isAr ? 'في الوقت' : 'On Time', value: '—' },
                ].map((stat, i) => (
                    <View key={i} style={styles.statCard}>
                        <Ionicons name={stat.icon as any} size={24} color={colors.primary} />
                        <Text style={styles.statValue}>{stat.value}</Text>
                        <Text style={styles.statLabel}>{stat.label}</Text>
                    </View>
                ))}
            </View>

            {/* Recent Earnings */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{isAr ? 'آخر التحويلات' : 'Recent Earnings'}</Text>
                <View style={styles.emptyState}>
                    <Ionicons name="cash-outline" size={48} color={colors.textMuted} />
                    <Text style={styles.emptyText}>{isAr ? 'لا توجد أرباح بعد' : 'No earnings yet'}</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { paddingTop: 60, paddingHorizontal: spacing.xl, paddingBottom: spacing.md },
    title: { ...typography.h2, color: colors.text },
    summaryCard: {
        marginHorizontal: spacing.xl, backgroundColor: colors.primary,
        borderRadius: borderRadius.lg, padding: spacing.xl,
    },
    summaryLabel: { ...typography.bodySmall, color: 'rgba(255,255,255,0.7)' },
    summaryValue: { fontSize: 36, fontWeight: '800', color: colors.textInverse, marginVertical: spacing.xs },
    currency: { fontSize: 18, fontWeight: '400' },
    summaryRow: { flexDirection: 'row', marginTop: spacing.lg },
    summaryCol: { flex: 1, alignItems: 'center' },
    colValue: { ...typography.h3, color: colors.textInverse },
    colLabel: { ...typography.caption, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
    divider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
    statsGrid: {
        flexDirection: 'row', flexWrap: 'wrap', gap: 12,
        paddingHorizontal: spacing.xl, marginTop: spacing.lg,
    },
    statCard: {
        width: '47%', backgroundColor: colors.surface, borderRadius: borderRadius.md,
        padding: spacing.md, alignItems: 'center',
    },
    statValue: { ...typography.h2, color: colors.text, marginTop: spacing.xs },
    statLabel: { ...typography.caption, color: colors.textMuted, marginTop: 2, textAlign: 'center' },
    section: { paddingHorizontal: spacing.xl, marginTop: spacing.xl },
    sectionTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.md },
    emptyState: { alignItems: 'center', paddingVertical: spacing.xxl },
    emptyText: { ...typography.body, color: colors.textMuted, marginTop: spacing.md },
});
