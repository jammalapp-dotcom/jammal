// ============================================================================
// JAMMAL — Customer Home Screen
// Quick actions, active shipments summary, recent activity
// ============================================================================

import { useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView, Pressable, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/stores/auth.store';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function CustomerHomeScreen() {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const { user, logout } = useAuthStore();
    const [refreshing, setRefreshing] = useState(false);
    const isAr = i18n.language === 'ar';

    const greeting = isAr
        ? `أهلاً ${user?.fullNameAr || ''} 👋`
        : `Hello ${user?.fullNameEn || ''} 👋`;

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        // TODO: reload shipments from API
        setTimeout(() => setRefreshing(false), 1000);
    }, []);

    const quickActions = [
        { icon: 'add-circle', label: t('shipment.createNew'), color: colors.primary, onPress: () => router.push('/(customer)/shipments') },
        { icon: 'location', label: t('shipment.trackShipments'), color: colors.info, onPress: () => router.push('/(customer)/track') },
        { icon: 'bookmark', label: t('shipment.savedAddresses'), color: colors.accent, onPress: () => { } },
        { icon: 'wallet', label: t('tabs.wallet'), color: colors.success, onPress: () => router.push('/(customer)/wallet') },
    ];

    const statCards = [
        { value: '0', label: isAr ? 'شحنات نشطة' : 'Active', icon: 'cube', color: colors.statusInTransit },
        { value: '0', label: isAr ? 'تم التوصيل' : 'Delivered', icon: 'checkmark-circle', color: colors.success },
        { value: '0.00', label: isAr ? 'الإنفاق (ريال)' : 'Spent (SAR)', icon: 'cash', color: colors.accent },
    ];

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        >
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.greeting}>{greeting}</Text>
                        <Text style={styles.headerSub}>
                            {isAr ? 'ماذا تريد أن تشحن اليوم؟' : 'What do you want to ship today?'}
                        </Text>
                    </View>
                    <Pressable style={styles.avatarCircle}>
                        <Ionicons name="person" size={22} color={colors.textInverse} />
                    </Pressable>
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                    {statCards.map((stat, i) => (
                        <View key={i} style={styles.statCard}>
                            <Ionicons name={stat.icon as any} size={20} color={stat.color} />
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{isAr ? 'إجراءات سريعة' : 'Quick Actions'}</Text>
                <View style={styles.actionsGrid}>
                    {quickActions.map((action, i) => (
                        <Pressable key={i} style={styles.actionCard} onPress={action.onPress}>
                            <View style={[styles.actionIcon, { backgroundColor: action.color + '15' }]}>
                                <Ionicons name={action.icon as any} size={26} color={action.color} />
                            </View>
                            <Text style={styles.actionLabel}>{action.label}</Text>
                        </Pressable>
                    ))}
                </View>
            </View>

            {/* Recent Shipments */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{isAr ? 'آخر الشحنات' : 'Recent Shipments'}</Text>
                <View style={styles.emptyState}>
                    <Ionicons name="cube-outline" size={48} color={colors.textMuted} />
                    <Text style={styles.emptyText}>
                        {isAr ? 'لا توجد شحنات بعد' : 'No shipments yet'}
                    </Text>
                    <Pressable
                        style={styles.createBtn}
                        onPress={() => router.push('/(customer)/shipments')}
                    >
                        <Text style={styles.createBtnText}>{t('shipment.createNew')}</Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
        backgroundColor: colors.primary,
        paddingTop: 60, paddingBottom: spacing.lg,
        paddingHorizontal: spacing.xl,
        borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    },
    headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
    greeting: { ...typography.h2, color: colors.textInverse },
    headerSub: { ...typography.bodySmall, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
    avatarCircle: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center', justifyContent: 'center',
    },
    statsRow: { flexDirection: 'row', gap: 10 },
    statCard: {
        flex: 1, backgroundColor: 'rgba(255,255,255,0.12)',
        borderRadius: borderRadius.md, paddingVertical: spacing.md,
        paddingHorizontal: spacing.sm, alignItems: 'center',
    },
    statValue: { ...typography.h3, color: colors.textInverse, marginTop: 4 },
    statLabel: { ...typography.caption, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
    section: { paddingHorizontal: spacing.xl, marginTop: spacing.lg },
    sectionTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.md },
    actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    actionCard: {
        width: '47%', backgroundColor: colors.surface,
        borderRadius: borderRadius.md, padding: spacing.md,
        alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05,
        shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2,
    },
    actionIcon: {
        width: 52, height: 52, borderRadius: 16,
        alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm,
    },
    actionLabel: { ...typography.bodySmall, color: colors.text, fontWeight: '600', textAlign: 'center' },
    emptyState: {
        backgroundColor: colors.surface, borderRadius: borderRadius.lg,
        padding: spacing.xxl, alignItems: 'center',
    },
    emptyText: { ...typography.body, color: colors.textMuted, marginTop: spacing.md, marginBottom: spacing.lg },
    createBtn: {
        backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingVertical: 12,
        borderRadius: borderRadius.md,
    },
    createBtnText: { ...typography.button, color: colors.textInverse, fontSize: 14 },
});
