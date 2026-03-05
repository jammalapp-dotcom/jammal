// @ts-nocheck
// شاشة شحنات العميل - منقولة من Jammal-9b5eqc-main
import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { FlashList } from '@shopify/flash-list';
import * as Haptics from 'expo-haptics';
import { theme } from '../../constants/theme';
import { SHIPMENT_STATUSES } from '../../constants/config';
import { useApp } from '../../contexts/AppContext';
import { Shipment } from '../../services/mockData';

const FILTERS = [{ id: 'all', label: 'الكل' }, { id: 'active', label: 'نشطة' }, { id: 'delivered', label: 'مكتملة' }, { id: 'searching', label: 'بحث' }];

export default function CustomerShipmentsScreen() {
    const insets = useSafeAreaInsets(); const router = useRouter(); const { shipments } = useApp(); const [filter, setFilter] = useState('all');
    const filtered = shipments.filter((s) => { if (filter === 'all') return true; if (filter === 'active') return ['assigned', 'pickup', 'en_route', 'searching'].includes(s.status); if (filter === 'delivered') return s.status === 'delivered'; if (filter === 'searching') return s.status === 'searching'; return true; });
    const renderItem = ({ item: s }: { item: Shipment }) => {
        const st = SHIPMENT_STATUSES[s.status]; return (
            <Pressable style={styles.card} onPress={() => router.push(`/shipment/${s.id}`)}>
                <View style={styles.cardTop}><View><Text style={styles.shipId}>{s.id}</Text><Text style={styles.date}>{s.createdAt}</Text></View><View style={[styles.badge, { backgroundColor: st.color + '15' }]}><View style={[styles.dot, { backgroundColor: st.color }]} /><Text style={[styles.badgeText, { color: st.color }]}>{st.labelAr}</Text></View></View>
                <View style={styles.routeSection}><View style={styles.routeCol}><View style={styles.routeDots}><View style={[styles.dotStart, { backgroundColor: theme.accent }]} /><View style={styles.dotLine} /><MaterialIcons name="location-on" size={16} color={theme.error} /></View><View style={styles.routeTexts}><View><Text style={styles.city}>{s.pickupCity}</Text><Text style={styles.addr} numberOfLines={1}>{s.pickupAddress}</Text></View><View><Text style={styles.city}>{s.deliveryCity}</Text><Text style={styles.addr} numberOfLines={1}>{s.deliveryAddress}</Text></View></View></View></View>
                <View style={styles.cardBottom}><View style={styles.metaRow}><MaterialIcons name="inventory-2" size={14} color={theme.textSecondary} /><Text style={styles.meta}>{s.cargoCategoryAr}</Text></View><View style={styles.metaRow}><MaterialIcons name="straighten" size={14} color={theme.textSecondary} /><Text style={styles.meta}>{s.distance} كم</Text></View><Text style={styles.price}>{(s.finalPrice || s.estimatedPrice).toLocaleString()} ر.س</Text></View>
                {s.status === 'searching' && s.bidsCount > 0 && <Pressable style={styles.bidsBtn} onPress={() => router.push(`/bids/${s.id}`)}><MaterialIcons name="gavel" size={16} color={theme.accent} /><Text style={styles.bidsBtnText}>{s.bidsCount} عروض متاحة</Text><MaterialIcons name="arrow-back-ios" size={14} color={theme.accent} /></Pressable>}
            </Pressable>);
    };
    return (
        <SafeAreaView edges={['top']} style={styles.container}>
            <View style={styles.header}><View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><Image source={require('../../assets/images/jammal_logo_mini.png')} style={{ width: 32, height: 32 }} contentFit="contain" /><Text style={styles.title}>شحناتي</Text></View><Text style={styles.count}>{shipments.length} شحنة</Text></View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>{FILTERS.map((f) => (<Pressable key={f.id} style={[styles.filterChip, filter === f.id && styles.filterActive]} onPress={() => { Haptics.selectionAsync(); setFilter(f.id); }}><Text style={[styles.filterText, filter === f.id && styles.filterTextActive]}>{f.label}</Text></Pressable>))}</ScrollView>
            {filtered.length === 0 ? <View style={styles.empty}><MaterialIcons name="inventory-2" size={48} color={theme.textTertiary} /><Text style={styles.emptyText}>لا توجد شحنات</Text></View> :
                <View style={{ flex: 1 }}><FlashList data={filtered} renderItem={renderItem} estimatedItemSize={200} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 16 }} showsVerticalScrollIndicator={false} /></View>}
        </SafeAreaView>);
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
    title: { fontSize: 28, fontWeight: '700', color: theme.textPrimary }, count: { fontSize: 14, color: theme.textSecondary },
    filterRow: { paddingHorizontal: 16, gap: 8, paddingBottom: 12 }, filterChip: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border },
    filterActive: { backgroundColor: theme.primary, borderColor: theme.primary }, filterText: { fontSize: 13, fontWeight: '600', color: theme.textSecondary }, filterTextActive: { color: '#FFF' },
    card: { backgroundColor: theme.surface, borderRadius: 16, padding: 16, marginBottom: 12, ...theme.shadows.card }, cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
    shipId: { fontSize: 14, fontWeight: '700', color: theme.textPrimary }, date: { fontSize: 12, color: theme.textTertiary, marginTop: 2 },
    badge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 }, dot: { width: 6, height: 6, borderRadius: 3 }, badgeText: { fontSize: 12, fontWeight: '600' },
    routeSection: { marginBottom: 12 }, routeCol: { flexDirection: 'row', gap: 12 }, routeDots: { alignItems: 'center', width: 16, paddingTop: 4 },
    dotStart: { width: 10, height: 10, borderRadius: 5 }, dotLine: { width: 2, flex: 1, backgroundColor: theme.border, marginVertical: 2 },
    routeTexts: { flex: 1, justifyContent: 'space-between', minHeight: 56 }, city: { fontSize: 15, fontWeight: '600', color: theme.textPrimary }, addr: { fontSize: 12, color: theme.textSecondary },
    cardBottom: { flexDirection: 'row', alignItems: 'center', gap: 12 }, metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 }, meta: { fontSize: 12, color: theme.textSecondary },
    price: { fontSize: 16, fontWeight: '700', color: theme.primary, marginLeft: 'auto' },
    bidsBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: theme.borderLight, justifyContent: 'center' },
    bidsBtnText: { fontSize: 14, fontWeight: '600', color: theme.accent, flex: 1 },
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 }, emptyText: { fontSize: 16, color: theme.textSecondary },
});
