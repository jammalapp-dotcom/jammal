// ============================================================================
// JAMMAL — Customer Shipments Screen
// List shipments with status filter tabs
// ============================================================================

import { useState, useCallback, useEffect } from 'react';
import {
    View, Text, StyleSheet, FlatList, Pressable, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/stores/auth.store';
import { api } from '../../src/config/api';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

const STATUS_TABS = [
    { key: '', label: 'الكل' },
    { key: 'searching', label: 'بحث' },
    { key: 'in_transit', label: 'في الطريق' },
    { key: 'delivered', label: 'تم التوصيل' },
    { key: 'cancelled', label: 'ملغي' },
];

const STATUS_COLORS: Record<string, string> = {
    draft: colors.statusDraft,
    searching: colors.statusSearching,
    driver_assigned: colors.statusAssigned,
    in_transit: colors.statusInTransit,
    delivered: colors.statusDelivered,
    cancelled: colors.statusCancelled,
};

export default function ShipmentsScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { accessToken } = useAuthStore();
    const [shipments, setShipments] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    const loadShipments = useCallback(async () => {
        if (!accessToken) return;
        try {
            const params: Record<string, string> = {};
            if (activeTab) params.status = activeTab;
            const result: any = await api.getShipments(params, accessToken);
            setShipments(result.data || []);
        } catch (err) {
            console.error('Failed to load shipments:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [accessToken, activeTab]);

    useEffect(() => {
        loadShipments();
    }, [loadShipments]);

    const onRefresh = () => {
        setRefreshing(true);
        loadShipments();
    };

    const renderShipment = ({ item }: { item: any }) => (
        <Pressable
            style={styles.card}
            onPress={() => router.push(`/(customer)/track?shipmentId=${item.id}`)}
        >
            <View style={styles.cardHeader}>
                <View style={[styles.statusBadge, { backgroundColor: (STATUS_COLORS[item.status] || colors.textMuted) + '20' }]}>
                    <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[item.status] || colors.textMuted }]} />
                    <Text style={[styles.statusText, { color: STATUS_COLORS[item.status] }]}>
                        {t(`shipment.status.${item.status}`) || item.status}
                    </Text>
                </View>
                <Text style={styles.cardDate}>
                    {new Date(item.createdAt).toLocaleDateString('ar-SA')}
                </Text>
            </View>

            <View style={styles.routeRow}>
                <View style={styles.routeCol}>
                    <View style={styles.routeDot} />
                    <Text style={styles.routeLabel} numberOfLines={1}>{item.pickupAddress}</Text>
                </View>
                <View style={styles.routeLine} />
                <View style={styles.routeCol}>
                    <View style={[styles.routeDot, { backgroundColor: colors.success }]} />
                    <Text style={styles.routeLabel} numberOfLines={1}>{item.deliveryAddress}</Text>
                </View>
            </View>

            <View style={styles.cardFooter}>
                <Text style={styles.priceText}>
                    {item.estimatedPrice || item.finalPrice || '—'} {t('common.sar')}
                </Text>
                {item.distanceKm && (
                    <Text style={styles.distText}>{item.distanceKm} {t('common.km')}</Text>
                )}
            </View>
        </Pressable>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>{t('tabs.myShipments')}</Text>
                <Pressable style={styles.addBtn}>
                    <Ionicons name="add" size={24} color={colors.textInverse} />
                </Pressable>
            </View>

            {/* Status Tabs */}
            <ScrollableRow>
                {STATUS_TABS.map((tab) => (
                    <Pressable
                        key={tab.key}
                        style={[styles.tab, activeTab === tab.key && styles.tabActive]}
                        onPress={() => setActiveTab(tab.key)}
                    >
                        <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                            {tab.label}
                        </Text>
                    </Pressable>
                ))}
            </ScrollableRow>

            {/* List */}
            <FlatList
                data={shipments}
                renderItem={renderShipment}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="cube-outline" size={64} color={colors.textMuted} />
                        <Text style={styles.emptyText}>لا توجد شحنات</Text>
                    </View>
                }
            />
        </View>
    );
}

function ScrollableRow({ children }: { children: React.ReactNode }) {
    return (
        <View style={{ flexDirection: 'row', paddingHorizontal: spacing.lg, marginBottom: spacing.md, gap: 8 }}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: 60, paddingHorizontal: spacing.xl, paddingBottom: spacing.md,
        backgroundColor: colors.surface,
    },
    title: { ...typography.h2, color: colors.text },
    addBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
    },
    tab: {
        paddingHorizontal: 16, paddingVertical: 8,
        borderRadius: borderRadius.full, backgroundColor: colors.surface,
        borderWidth: 1, borderColor: colors.border,
    },
    tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    tabText: { ...typography.bodySmall, color: colors.textSecondary },
    tabTextActive: { color: colors.textInverse },
    list: { paddingHorizontal: spacing.xl, paddingBottom: 120 },
    card: {
        backgroundColor: colors.surface, borderRadius: borderRadius.lg,
        padding: spacing.lg, marginBottom: spacing.md,
        shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 12,
        shadowOffset: { width: 0, height: 2 }, elevation: 2,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
    statusBadge: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 10, paddingVertical: 4, borderRadius: borderRadius.full,
    },
    statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
    statusText: { fontSize: 12, fontWeight: '600' },
    cardDate: { ...typography.caption, color: colors.textMuted },
    routeRow: { marginBottom: spacing.md },
    routeCol: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
    routeDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary, marginRight: 10 },
    routeLine: { width: 2, height: 16, backgroundColor: colors.border, marginLeft: 4 },
    routeLabel: { ...typography.bodySmall, color: colors.text, flex: 1 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: colors.borderLight, paddingTop: spacing.sm },
    priceText: { ...typography.body, color: colors.primary, fontWeight: '700' },
    distText: { ...typography.bodySmall, color: colors.textMuted },
    emptyState: { alignItems: 'center', paddingTop: 80 },
    emptyText: { ...typography.body, color: colors.textMuted, marginTop: spacing.md },
});
