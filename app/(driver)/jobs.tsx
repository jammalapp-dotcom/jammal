import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { theme } from '../../constants/theme';
import { SHIPMENT_STATUSES } from '../../constants/config';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../hooks/useAuth';
import { useAlert } from '@/template';
import { mockDrivers } from '../../services/mockData';

export default function DriverJobsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { shipments, submitBid } = useApp();
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const [bidAmounts, setBidAmounts] = useState<Record<string, string>>({});
  const available = shipments.filter((s) => s.status === 'searching');

  const handleBid = (shipmentId: string) => {
    const amount = parseInt(bidAmounts[shipmentId] || '0');
    if (!amount || amount < 100) { showAlert('خطأ', 'أدخل مبلغ صحيح (١٠٠ ر.س كحد أدنى)'); return; }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const driver = mockDrivers[0];
    submitBid(shipmentId, { ...driver, id: user?.id || driver.id, nameAr: user?.name || driver.nameAr, name: user?.nameEn || driver.name }, amount, 'متاح وجاهز للتحميل');
    showAlert('تم', `تم تقديم عرضك بمبلغ ${amount.toLocaleString()} ر.س`);
    setBidAmounts((p) => ({ ...p, [shipmentId]: '' }));
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Image source={require('../../assets/images/jammal_logo_mini.png')} style={{ width: 32, height: 32 }} contentFit="contain" />
          <Text style={styles.title}>الشحنات المتاحة</Text>
        </View>
        <Text style={styles.count}>{available.length} شحنة</Text>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 16 }} showsVerticalScrollIndicator={false}>
        {available.length === 0 ? (
          <View style={styles.empty}><MaterialIcons name="search-off" size={48} color={theme.textTertiary} /><Text style={styles.emptyText}>لا توجد شحنات متاحة حالياً</Text></View>
        ) : (
          available.map((s, i) => (
            <Animated.View key={s.id} entering={FadeInDown.delay(100 + i * 80).duration(400)}>
              <View style={styles.jobCard}>
                <View style={styles.jobTop}><Text style={styles.jobId}>{s.id}</Text><Text style={styles.jobEst}>{s.estimatedPrice.toLocaleString()} ر.س تقديري</Text></View>
                <View style={styles.route}>
                  <View style={styles.routeRow}><View style={[styles.routeDot, { backgroundColor: theme.accent }]} /><View style={{ flex: 1 }}><Text style={styles.routeCity}>{s.pickupCity}</Text><Text style={styles.routeAddr}>{s.pickupAddress}</Text></View></View>
                  <View style={styles.routeLine} />
                  <View style={styles.routeRow}><MaterialIcons name="location-on" size={14} color={theme.error} /><View style={{ flex: 1 }}><Text style={styles.routeCity}>{s.deliveryCity}</Text><Text style={styles.routeAddr}>{s.deliveryAddress}</Text></View></View>
                </View>
                <View style={styles.jobMeta}>
                  <View style={styles.metaItem}><MaterialIcons name="straighten" size={16} color={theme.textSecondary} /><Text style={styles.metaText}>{s.distance} كم</Text></View>
                  <View style={styles.metaItem}><MaterialIcons name="inventory-2" size={16} color={theme.textSecondary} /><Text style={styles.metaText}>{s.cargoCategoryAr}</Text></View>
                  <View style={styles.metaItem}><MaterialIcons name="fitness-center" size={16} color={theme.textSecondary} /><Text style={styles.metaText}>{s.weight.toLocaleString()} كغ</Text></View>
                </View>
                <View style={styles.bidSection}>
                  <TextInput style={styles.bidInput} placeholder="عرضك (ر.س)" placeholderTextColor={theme.textTertiary} keyboardType="numeric" value={bidAmounts[s.id] || ''} onChangeText={(v) => setBidAmounts((p) => ({ ...p, [s.id]: v }))} />
                  <Pressable style={styles.bidBtn} onPress={() => handleBid(s.id)}><Text style={styles.bidBtnText}>قدم عرضك</Text></Pressable>
                </View>
              </View>
            </Animated.View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  title: { fontSize: 24, fontWeight: '700', color: theme.textPrimary },
  count: { fontSize: 14, color: theme.textSecondary },
  empty: { alignItems: 'center', padding: 60, gap: 8 },
  emptyText: { fontSize: 16, color: theme.textSecondary },
  jobCard: { backgroundColor: theme.surface, borderRadius: 16, padding: 16, marginBottom: 12, ...theme.shadows.card },
  jobTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  jobId: { fontSize: 14, fontWeight: '700', color: theme.primary },
  jobEst: { fontSize: 14, fontWeight: '600', color: theme.accent },
  route: { marginBottom: 12, gap: 4 },
  routeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  routeDot: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  routeLine: { width: 2, height: 12, backgroundColor: theme.border, marginLeft: 4 },
  routeCity: { fontSize: 15, fontWeight: '600', color: theme.textPrimary },
  routeAddr: { fontSize: 12, color: theme.textSecondary },
  jobMeta: { flexDirection: 'row', gap: 16, marginBottom: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: theme.borderLight },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 13, color: theme.textSecondary },
  bidSection: { flexDirection: 'row', gap: 10 },
  bidInput: { flex: 1, backgroundColor: theme.background, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, fontWeight: '600', color: theme.textPrimary, borderWidth: 1, borderColor: theme.border, textAlign: 'right' },
  bidBtn: { backgroundColor: theme.accent, borderRadius: 12, paddingHorizontal: 20, justifyContent: 'center' },
  bidBtnText: { fontSize: 14, fontWeight: '700', color: '#FFF' },
});
