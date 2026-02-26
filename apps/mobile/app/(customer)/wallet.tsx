// ============================================================================
// JAMMAL — Customer Wallet Screen
// ============================================================================

import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function WalletScreen() {
    const { t, i18n } = useTranslation();
    const isAr = i18n.language === 'ar';

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{t('tabs.wallet')}</Text>
            </View>

            {/* Balance Card */}
            <View style={styles.balanceCard}>
                <Text style={styles.balanceLabel}>{isAr ? 'الرصيد المتاح' : 'Available Balance'}</Text>
                <Text style={styles.balanceValue}>0.00 <Text style={styles.currency}>{t('common.sar')}</Text></Text>
                <View style={styles.balanceActions}>
                    <Pressable style={styles.balanceBtn}>
                        <Ionicons name="add-circle-outline" size={20} color={colors.textInverse} />
                        <Text style={styles.balanceBtnText}>{isAr ? 'إيداع' : 'Deposit'}</Text>
                    </Pressable>
                    <Pressable style={[styles.balanceBtn, { backgroundColor: colors.accent }]}>
                        <Ionicons name="arrow-down-circle-outline" size={20} color={colors.textInverse} />
                        <Text style={styles.balanceBtnText}>{isAr ? 'سحب' : 'Withdraw'}</Text>
                    </Pressable>
                </View>
            </View>

            {/* Payment Methods */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{isAr ? 'طرق الدفع' : 'Payment Methods'}</Text>
                {['مدى / Mada', 'فيزا / Visa', 'Apple Pay', 'STC Pay'].map((method, i) => (
                    <View key={i} style={styles.methodRow}>
                        <Ionicons name="card-outline" size={22} color={colors.primary} />
                        <Text style={styles.methodText}>{method}</Text>
                        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                    </View>
                ))}
                <Pressable style={styles.addMethodBtn}>
                    <Ionicons name="add" size={20} color={colors.primary} />
                    <Text style={styles.addMethodText}>{isAr ? 'إضافة طريقة دفع' : 'Add Payment Method'}</Text>
                </Pressable>
            </View>

            {/* Transaction History */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{isAr ? 'سجل المعاملات' : 'Transactions'}</Text>
                <View style={styles.emptyState}>
                    <Ionicons name="receipt-outline" size={48} color={colors.textMuted} />
                    <Text style={styles.emptyText}>{isAr ? 'لا توجد معاملات بعد' : 'No transactions yet'}</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { paddingTop: 60, paddingHorizontal: spacing.xl, paddingBottom: spacing.md },
    title: { ...typography.h2, color: colors.text },
    balanceCard: {
        marginHorizontal: spacing.xl, backgroundColor: colors.primary,
        borderRadius: borderRadius.lg, padding: spacing.xl,
    },
    balanceLabel: { ...typography.bodySmall, color: 'rgba(255,255,255,0.7)' },
    balanceValue: { fontSize: 36, fontWeight: '800', color: colors.textInverse, marginTop: spacing.xs },
    currency: { fontSize: 18, fontWeight: '400' },
    balanceActions: { flexDirection: 'row', gap: 12, marginTop: spacing.lg },
    balanceBtn: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 12,
        borderRadius: borderRadius.sm, gap: 6,
    },
    balanceBtnText: { ...typography.bodySmall, color: colors.textInverse, fontWeight: '600' },
    section: { paddingHorizontal: spacing.xl, marginTop: spacing.xl },
    sectionTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.md },
    methodRow: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: colors.surface, borderRadius: borderRadius.sm,
        padding: spacing.md, marginBottom: spacing.xs, gap: 12,
    },
    methodText: { ...typography.body, color: colors.text, flex: 1 },
    addMethodBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: colors.primary, borderStyle: 'dashed',
        borderRadius: borderRadius.sm, padding: spacing.md, marginTop: spacing.xs, gap: 8,
    },
    addMethodText: { ...typography.bodySmall, color: colors.primary, fontWeight: '600' },
    emptyState: { alignItems: 'center', paddingVertical: spacing.xxl },
    emptyText: { ...typography.body, color: colors.textMuted, marginTop: spacing.md },
});
