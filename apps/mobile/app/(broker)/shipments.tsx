import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { FlashList } from '@shopify/flash-list';
import { theme } from '../../constants/theme';
import { SHIPMENT_STATUSES } from '../../constants/config';
import { useApp } from '../../contexts/AppContext';
import { Shipment } from '../../services/mockData';

export default function BrokerShipmentsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { shipments } = useApp();

  const renderItem = ({ item: s }: { item: Shipment }) => {
    const st = SHIPMENT_STATUSES[s.status];
    return (
      <Pressable style={styles.card} onPress={() => router.push(`/shipment/${s.id}`)}>
        <View style={styles.top}><Text style={styles.id}>{s.id}</Text><View style={[styles.badge, { backgroundColor: st.color + '15' }]}><Text style={[styles.badgeText, { color: st.color }]}>{st.labelAr}</Text></View></View>
        <Text style={styles.route}>{s.pickupCity} → {s.deliveryCity}</Text>
        <View style={styles.meta}><Text style={styles.metaText}>{s.cargoCategoryAr} • {s.distance} كم • {s.weight.toLocaleString()} كغ</Text></View>
        <View style={styles.footer}><Text style={styles.driver}>{s.driverNameAr || 'بدون سائق'}</Text><Text style={styles.price}>{(s.finalPrice || s.estimatedPrice).toLocaleString()} ر.س</Text></View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Image source={require('../../assets/images/jammal_logo_mini.png')} style={{ width: 32, height: 32 }} contentFit="contain" />
          <Text style={styles.title}>جميع الشحنات</Text>
        </View>
        <Text style={styles.count}>{shipments.length}</Text>
      </View>
      <View style={{ flex: 1 }}><FlashList data={shipments} renderItem={renderItem} estimatedItemSize={140} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 16 }} showsVerticalScrollIndicator={false} /></View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  title: { fontSize: 28, fontWeight: '700', color: theme.textPrimary },
  count: { fontSize: 14, fontWeight: '600', color: theme.textSecondary },
  card: { backgroundColor: theme.surface, borderRadius: 16, padding: 16, marginBottom: 10, ...theme.shadows.card },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  id: { fontSize: 14, fontWeight: '700', color: theme.primary },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  route: { fontSize: 16, fontWeight: '600', color: theme.textPrimary, marginBottom: 4 },
  meta: { marginBottom: 8 },
  metaText: { fontSize: 13, color: theme.textSecondary },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTopWidth: 1, borderTopColor: theme.borderLight },
  driver: { fontSize: 14, fontWeight: '500', color: theme.textSecondary },
  price: { fontSize: 16, fontWeight: '700', color: theme.accent },
});
