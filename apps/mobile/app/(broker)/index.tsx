// ============================================================================
// JAMMAL — Broker Dashboard Screen
// Overview with stats, fleet summary, active shipments
// ============================================================================

import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/stores/auth.store';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function BrokerDashboardScreen() {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const { user } = useAuthStore();
    const isAr = i18n.language === 'ar';
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    }, []);

    const stats = [
        { icon: 'cube', value: '0', label: isAr ? 'شحنات نشطة' : 'Active', color: colors.statusInTransit },
        { icon: 'people', value: '0', label: isAr ? 'السائقين' : 'Drivers', color: colors.primary },
        { icon: 'cash', value: '0.00', label: isAr ? 'الإيرادات' : 'Revenue', color: colors.success },
        { icon: 'star', value: '—', label: isAr ? 'التقييم' : 'Rating', color: colors.accent },
    ];

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        >
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.greeting}>
                    {isAr ? `مرحباً، ${user?.fullNameAr}` : `Welcome, ${user?.fullNameEn}`}
                </Text>
                <Text style={styles.headerSub}>{t('tabs.dashboard')}</Text>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
                {stats.map((stat, i) => (
                    <View key={i} style={styles.statCard}>
                        <View style={[styles.statIcon, { backgroundColor: stat.color + '15' }]}>
                            <Ionicons name={stat.icon as any} size={22} color={stat.color} />
                        </View>
                        <Text style={styles.statValue}>{stat.value}</Text>
                        <Text style={styles.statLabel}>{stat.label}</Text>
                    </View>
                ))}
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{isAr ? 'إجراءات سريعة' : 'Quick Actions'}</Text>
                <View style={styles.actionsRow}>
                    <Pressable style={styles.actionBtn} onPress={() => router.push('/(broker)/fleet')}>
                        <Ionicons name="people-outline" size={24} color={colors.primary} />
                        <Text style={styles.actionText}>{isAr ? 'إدارة الأسطول' : 'Manage Fleet'}</Text>
                    </Pressable>
                    <Pressable style={styles.actionBtn} onPress={() => router.push('/(broker)/customers')}>
                        <Ionicons name="business-outline" size={24} color={colors.accent} />
                        <Text style={styles.actionText}>{isAr ? 'إدارة العملاء' : 'Manage Customers'}</Text>
                    </Pressable>
                </View>
            </View>

            {/* Recent Activity */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{isAr ? 'النشاط الأخير' : 'Recent Activity'}</Text>
                <View style={styles.emptyState}>
                    <Ionicons name="time-outline" size={48} color={colors.textMuted} />
                    <Text style={styles.emptyText}>{isAr ? 'لا يوجد نشاط بعد' : 'No activity yet'}</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
        backgroundColor: colors.primary, paddingTop: 60, paddingBottom: spacing.xl,
        paddingHorizontal: spacing.xl, borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    },
    greeting: { ...typography.h2, color: colors.textInverse },
    headerSub: { ...typography.bodySmall, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
    statsGrid: {
        flexDirection: 'row', flexWrap: 'wrap', gap: 12,
        paddingHorizontal: spacing.xl, marginTop: spacing.lg,
    },
    statCard: {
        width: '47%', backgroundColor: colors.surface, borderRadius: borderRadius.md,
        padding: spacing.md, alignItems: 'center',
        shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
    },
    statIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    statValue: { ...typography.h2, color: colors.text, marginTop: spacing.xs },
    statLabel: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
    section: { paddingHorizontal: spacing.xl, marginTop: spacing.xl },
    sectionTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.md },
    actionsRow: { flexDirection: 'row', gap: 12 },
    actionBtn: {
        flex: 1, flexDirection: 'row', alignItems: 'center',
        backgroundColor: colors.surface, borderRadius: borderRadius.md,
        padding: spacing.md, gap: 8,
    },
    actionText: { ...typography.bodySmall, color: colors.text, fontWeight: '600' },
    emptyState: { alignItems: 'center', paddingVertical: spacing.xxl },
    emptyText: { ...typography.body, color: colors.textMuted, marginTop: spacing.md },
});
