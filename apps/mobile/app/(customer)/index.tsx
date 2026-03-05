import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { theme } from '../../constants/theme';
import { SHIPMENT_STATUSES } from '../../constants/config';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../hooks/useAuth';
import { useAlert } from '@/template';

export default function CustomerHomeScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { user } = useAuth();
    const { shipments, walletBalance, getActiveShipments, getUnreadNotifCount } = useApp();
    const { showAlert } = useAlert();
    const activeShipments = getActiveShipments();
    const totalDelivered = shipments.filter((s) => s.status === 'delivered').length;
    const totalSpent = shipments.filter((s) => s.finalPrice).reduce((sum, s) => sum + (s.finalPrice || 0), 0);

    return (
        <SafeAreaView edges={['top']} style={styles.container}>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: insets.bottom + 16 }} showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.header}>
                    <View><Text style={styles.greeting}>أهلاً وسهلاً</Text><Text style={styles.userName}>{user?.name || 'عميل'}</Text></View>
                    <View style={styles.headerRight}>
                        <Pressable style={styles.notifBtn} onPress={() => router.push('/notifications')}>
                            <MaterialIcons name="notifications-none" size={24} color={theme.primary} />
                            {getUnreadNotifCount() > 0 && <View style={styles.notifBadge}><Text style={styles.notifBadgeText}>{getUnreadNotifCount()}</Text></View>}
                        </Pressable>
                        <Image source={require('../../assets/images/jammal-logo.png')} style={styles.headerLogo} contentFit="contain" />
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).duration(500)}>
                    <LinearGradient colors={[theme.primary, theme.primaryLight]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.balanceCard}>
                        <View style={styles.balanceTop}>
                            <View><Text style={styles.balanceLabel}>رصيد المحفظة</Text><Text style={styles.balanceValue}>{walletBalance.toLocaleString()} <Text style={styles.balanceCurrency}>ر.س</Text></Text></View>
                            <Pressable style={styles.topUpBtn} onPress={() => showAlert('شحن المحفظة', 'خاصية شحن المحفظة ستكون متاحة قريباً عبر مدى، Apple Pay، و STC Pay')}><MaterialIcons name="add" size={18} color={theme.accent} /><Text style={styles.topUpText}>شحن</Text></Pressable>
                        </View>
                        <View style={styles.balanceStats}>
                            <View style={styles.bStat}><Text style={styles.bStatVal}>{shipments.length}</Text><Text style={styles.bStatLbl}>إجمالي</Text></View>
                            <View style={styles.bDiv} />
                            <View style={styles.bStat}><Text style={styles.bStatVal}>{totalDelivered}</Text><Text style={styles.bStatLbl}>مكتملة</Text></View>
                            <View style={styles.bDiv} />
                            <View style={styles.bStat}><Text style={styles.bStatVal}>{totalSpent.toLocaleString()}</Text><Text style={styles.bStatLbl}>ر.س مصروف</Text></View>
                        </View>
                    </LinearGradient>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.actionsRow}>
                    {[
                        { icon: 'add-circle' as const, label: 'شحنة جديدة', color: theme.accent, onPress: () => router.push('/(customer)/create') },
                        { icon: 'search' as const, label: 'تتبع شحنة', color: theme.info, onPress: () => router.push('/(customer)/shipments') },
                        { icon: 'account-balance-wallet' as const, label: 'المحفظة', color: theme.success, onPress: () => router.push('/(customer)/profile') },
                        { icon: 'support-agent' as const, label: 'الدعم', color: theme.primaryLight, onPress: () => showAlert('الدعم الفني', 'تواصل معنا:\n\nالهاتف: 920000000\nالبريد: support@jammal.sa\nواتساب: +966 50 000 0000') },
                    ].map((a, i) => (
                        <Pressable key={i} style={styles.actionItem} onPress={a.onPress}>
                            <View style={[styles.actionIcon, { backgroundColor: a.color + '18' }]}><MaterialIcons name={a.icon} size={28} color={a.color} /></View>
                            <Text style={styles.actionLabel}>{a.label}</Text>
                        </Pressable>
                    ))}
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(400).duration(500)}>
                    <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>الشحنات النشطة</Text><Pressable onPress={() => router.push('/(customer)/shipments')}><Text style={styles.seeAll}>عرض الكل</Text></Pressable></View>
                    {activeShipments.length === 0 ? (
                        <View style={styles.empty}><MaterialIcons name="inventory-2" size={48} color={theme.textTertiary} /><Text style={styles.emptyText}>لا توجد شحنات نشطة</Text></View>
                    ) : (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
                            {activeShipments.map((s) => {
                                const st = SHIPMENT_STATUSES[s.status];
                                return (
                                    <Pressable key={s.id} style={styles.shipCard} onPress={() => router.push(`/shipment/${s.id}`)}>
                                        <View style={styles.shipCardTop}><Text style={styles.shipId}>{s.id}</Text><View style={[styles.badge, { backgroundColor: st.color + '15' }]}><View style={[styles.badgeDot, { backgroundColor: st.color }]} /><Text style={[styles.badgeText, { color: st.color }]}>{st.labelAr}</Text></View></View>
                                        <View style={styles.route}>
                                            <View style={styles.routeRow}><MaterialIcons name="radio-button-checked" size={14} color={theme.accent} /><Text style={styles.cityText} numberOfLines={1}>{s.pickupCity}</Text></View>
                                            <View style={styles.routeLineV}><View style={styles.routeDash} /></View>
                                            <View style={styles.routeRow}><MaterialIcons name="location-on" size={14} color={theme.error} /><Text style={styles.cityText} numberOfLines={1}>{s.deliveryCity}</Text></View>
                                        </View>
                                        <View style={styles.shipCardBottom}><Text style={styles.cargoType}>{s.cargoCategoryAr}</Text><Text style={styles.shipPrice}>{(s.finalPrice || s.estimatedPrice).toLocaleString()} ر.س</Text></View>
                                    </Pressable>
                                );
                            })}
                        </ScrollView>
                    )}
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(600).duration(500)}>
                    <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>الشحنات الأخيرة</Text></View>
                    {shipments.slice(0, 5).map((s) => {
                        const st = SHIPMENT_STATUSES[s.status];
                        return (
                            <Pressable key={s.id} style={styles.recentItem} onPress={() => router.push(`/shipment/${s.id}`)}>
                                <View style={[styles.recentIcon, { backgroundColor: st.color + '15' }]}><MaterialIcons name={s.status === 'delivered' ? 'check-circle' : s.status === 'en_route' ? 'local-shipping' : 'inventory-2'} size={24} color={st.color} /></View>
                                <View style={styles.recentInfo}><Text style={styles.recentRoute}>{s.pickupCity} → {s.deliveryCity}</Text><Text style={styles.recentMeta}>{s.cargoCategoryAr} • {s.weight.toLocaleString()} كغ</Text></View>
                                <View style={styles.recentRight}><Text style={styles.recentPrice}>{(s.finalPrice || s.estimatedPrice).toLocaleString()} ر.س</Text><Text style={[styles.recentStatus, { color: st.color }]}>{st.labelAr}</Text></View>
                            </Pressable>
                        );
                    })}
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 },
    greeting: { fontSize: 14, color: theme.textSecondary, fontWeight: '500' },
    userName: { fontSize: 24, fontWeight: '700', color: theme.textPrimary, marginTop: 2 },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    notifBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: theme.surface, alignItems: 'center', justifyContent: 'center', ...theme.shadows.card },
    notifBadge: { position: 'absolute', top: 6, right: 8, width: 16, height: 16, borderRadius: 8, backgroundColor: theme.error, alignItems: 'center', justifyContent: 'center' },
    notifBadgeText: { fontSize: 10, color: '#FFF', fontWeight: '700' },
    headerLogo: { width: 40, height: 40 },
    balanceCard: { marginHorizontal: 16, borderRadius: 16, padding: 20, ...theme.shadows.cardElevated },
    balanceTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    balanceLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
    balanceValue: { fontSize: 36, fontWeight: '700', color: '#FFF', marginTop: 4 },
    balanceCurrency: { fontSize: 18, fontWeight: '500', color: 'rgba(255,255,255,0.8)' },
    topUpBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
    topUpText: { fontSize: 13, fontWeight: '600', color: theme.accent },
    balanceStats: { flexDirection: 'row', marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)' },
    bStat: { flex: 1, alignItems: 'center' },
    bStatVal: { fontSize: 18, fontWeight: '700', color: '#FFF' },
    bStatLbl: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
    bDiv: { width: 1, backgroundColor: 'rgba(255,255,255,0.15)' },
    actionsRow: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 8, gap: 12 },
    actionItem: { flex: 1, alignItems: 'center', gap: 6 },
    actionIcon: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    actionLabel: { fontSize: 11, fontWeight: '600', color: theme.textSecondary, textAlign: 'center' },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 24, paddingBottom: 12 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: theme.textPrimary },
    seeAll: { fontSize: 14, fontWeight: '600', color: theme.accent },
    empty: { alignItems: 'center', padding: 32, gap: 8 },
    emptyText: { fontSize: 14, color: theme.textSecondary },
    shipCard: { width: 280, backgroundColor: theme.surface, borderRadius: 16, padding: 16, ...theme.shadows.card },
    shipCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    shipId: { fontSize: 13, fontWeight: '600', color: theme.textSecondary },
    badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20, gap: 4 },
    badgeDot: { width: 6, height: 6, borderRadius: 3 },
    badgeText: { fontSize: 11, fontWeight: '600' },
    route: { marginBottom: 12 },
    routeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    routeLineV: { paddingLeft: 6, paddingVertical: 2 },
    routeDash: { width: 2, height: 16, backgroundColor: theme.border, borderRadius: 1 },
    cityText: { fontSize: 15, fontWeight: '600', color: theme.textPrimary, flex: 1 },
    shipCardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cargoType: { fontSize: 13, color: theme.textSecondary },
    shipPrice: { fontSize: 16, fontWeight: '700', color: theme.primary },
    recentItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
    recentIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    recentInfo: { flex: 1 },
    recentRoute: { fontSize: 15, fontWeight: '600', color: theme.textPrimary },
    recentMeta: { fontSize: 13, color: theme.textSecondary, marginTop: 2 },
    recentRight: { alignItems: 'flex-end' },
    recentPrice: { fontSize: 15, fontWeight: '700', color: theme.primary },
    recentStatus: { fontSize: 11, fontWeight: '600', marginTop: 2 },
});
