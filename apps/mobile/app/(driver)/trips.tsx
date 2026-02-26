// ============================================================================
// JAMMAL — Driver Trips Screen
// Active and historical trips list
// ============================================================================

import { useState, useCallback, useEffect } from 'react';
import {
    View, Text, StyleSheet, FlatList, Pressable, RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/stores/auth.store';
import { api } from '../../src/config/api';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function TripsScreen() {
    const { t, i18n } = useTranslation();
    const { accessToken } = useAuthStore();
    const isAr = i18n.language === 'ar';
    const [trips, setTrips] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
    const [refreshing, setRefreshing] = useState(false);

    const loadTrips = useCallback(async () => {
        if (!accessToken) return;
        try {
            const status = activeTab === 'active' ? 'in_transit' : 'delivered';
            const result: any = await api.getShipments({ status }, accessToken);
            setTrips(result.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setRefreshing(false);
        }
    }, [accessToken, activeTab]);

    useEffect(() => { loadTrips(); }, [loadTrips]);

    const renderTrip = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Ionicons name="cube" size={20} color={colors.primary} />
                <Text style={styles.cardDate}>{new Date(item.createdAt).toLocaleDateString('ar-SA')}</Text>
            </View>
            <Text style={styles.route} numberOfLines={1}>
                {item.pickupAddress} → {item.deliveryAddress}
            </Text>
            <View style={styles.cardFooter}>
                <Text style={styles.price}>{item.finalPrice || item.estimatedPrice || '—'} {t('common.sar')}</Text>
                <Text style={styles.dist}>{item.distanceKm} {t('common.km')}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{t('tabs.trips')}</Text>
            </View>

            <View style={styles.tabs}>
                <Pressable
                    style={[styles.tab, activeTab === 'active' && styles.tabActive]}
                    onPress={() => setActiveTab('active')}
                >
                    <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
                        {t('driver.activeTrips')}
                    </Text>
                </Pressable>
                <Pressable
                    style={[styles.tab, activeTab === 'history' && styles.tabActive]}
                    onPress={() => setActiveTab('history')}
                >
                    <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>
                        {isAr ? 'السابقة' : 'History'}
                    </Text>
                </Pressable>
            </View>

            <FlatList
                data={trips}
                renderItem={renderTrip}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadTrips(); }} tintColor={colors.primary} />}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="car-outline" size={56} color={colors.textMuted} />
                        <Text style={styles.emptyText}>{isAr ? 'لا توجد رحلات' : 'No trips'}</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { paddingTop: 60, paddingHorizontal: spacing.xl, paddingBottom: spacing.md },
    title: { ...typography.h2, color: colors.text },
    tabs: { flexDirection: 'row', paddingHorizontal: spacing.xl, gap: 8, marginBottom: spacing.md },
    tab: {
        flex: 1, paddingVertical: 10, borderRadius: borderRadius.sm,
        backgroundColor: colors.surface, alignItems: 'center',
        borderWidth: 1, borderColor: colors.border,
    },
    tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    tabText: { ...typography.body, color: colors.textSecondary, fontWeight: '600' },
    tabTextActive: { color: colors.textInverse },
    list: { paddingHorizontal: spacing.xl, paddingBottom: 120 },
    card: {
        backgroundColor: colors.surface, borderRadius: borderRadius.lg,
        padding: spacing.lg, marginBottom: spacing.md,
        shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
    cardDate: { ...typography.caption, color: colors.textMuted },
    route: { ...typography.body, color: colors.text, marginBottom: spacing.sm },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
    price: { ...typography.body, color: colors.primary, fontWeight: '700' },
    dist: { ...typography.bodySmall, color: colors.textMuted },
    emptyState: { alignItems: 'center', paddingTop: 80 },
    emptyText: { ...typography.body, color: colors.textMuted, marginTop: spacing.md },
});
