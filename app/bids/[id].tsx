import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { theme } from '../../constants/theme';
import { useApp } from '../../contexts/AppContext';
import { useAlert } from '@/template';

export default function BidsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { getShipmentBids, getShipmentById, acceptBid } = useApp();
  const { showAlert } = useAlert();
  const shipment = getShipmentById(id || '');
  const bids = getShipmentBids(id || '');
  const sortedBids = [...bids].sort((a, b) => a.amount - b.amount);

  const handleAcceptBid = (bidId: string, driverName: string, amount: number) => {
    showAlert('قبول العرض', `هل تريد قبول عرض ${driverName} بمبلغ ${amount.toLocaleString()} ر.س؟`, [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'قبول', onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          acceptBid(id || '', bidId);
          showAlert('تم قبول العرض', 'سيتواصل معك السائق قريباً', [
            { text: 'الدفع', onPress: () => router.replace(`/payment/${id}`) },
            { text: 'عرض الشحنة', onPress: () => router.replace(`/shipment/${id}`) },
          ]);
        }
      },
    ]);
  };

  if (!shipment) return <SafeAreaView style={styles.container}><View style={styles.center}><Text style={styles.errText}>الشحنة غير موجودة</Text></View></SafeAreaView>;

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.hBtn}><MaterialIcons name="arrow-forward" size={24} color={theme.textPrimary} /></Pressable>
        <View style={styles.hCenter}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <Image source={require('../../assets/images/jammal_logo_mini.png')} style={{ width: 20, height: 20 }} contentFit="contain" />
            <Text style={[styles.hTitle, { marginBottom: 0 }]}>عروض الأسعار</Text>
          </View>
          <Text style={styles.hSub}>{shipment.id}</Text>
        </View>
        <View style={styles.hBtn} />
      </View>

      <Animated.View entering={FadeInDown.delay(100).duration(400)}>
        <View style={styles.routeSummary}>
          <View style={styles.routeRow}><View style={[styles.routeDot, { backgroundColor: theme.accent }]} /><Text style={styles.routeCity}>{shipment.pickupCity}</Text></View>
          <MaterialIcons name="arrow-back" size={16} color={theme.textTertiary} />
          <View style={styles.routeRow}><MaterialIcons name="location-on" size={14} color={theme.error} /><Text style={styles.routeCity}>{shipment.deliveryCity}</Text></View>
          <View style={{ width: '100%', marginTop: 4 }}><Text style={styles.routeMeta}>{shipment.distance} كم • {shipment.cargoCategoryAr} • {shipment.weight.toLocaleString()} كغ</Text></View>
        </View>
      </Animated.View>

      <View style={styles.bidsHeader}><Text style={styles.bidsCount}>{bids.length} عروض</Text><Text style={styles.bidsSort}>الأقل سعراً</Text></View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 16 }} showsVerticalScrollIndicator={false}>
        {sortedBids.length === 0 ? (
          <View style={styles.emptyBids}><MaterialIcons name="hourglass-empty" size={48} color={theme.textTertiary} /><Text style={styles.emptyTitle}>لا توجد عروض بعد</Text></View>
        ) : (
          sortedBids.map((bid, index) => (
            <Animated.View key={bid.id} entering={FadeInDown.delay(200 + index * 80).duration(400)}>
              <View style={[styles.bidCard, index === 0 && styles.bidBest]}>
                {index === 0 && <View style={styles.bestBadge}><MaterialIcons name="star" size={12} color="#FFF" /><Text style={styles.bestText}>أفضل سعر</Text></View>}
                <View style={styles.bidTop}>
                  <View style={styles.bidDriver}>
                    <View style={styles.driverAvatar}><Text style={styles.avatarText}>{bid.driver.nameAr.charAt(0)}</Text></View>
                    <View><Text style={styles.driverName}>{bid.driver.nameAr}</Text><View style={styles.driverMeta}><MaterialIcons name="star" size={14} color={theme.accent} /><Text style={styles.driverRating}>{bid.driver.rating}</Text><Text style={styles.driverTrips}>• {bid.driver.completedTrips} رحلة</Text></View></View>
                  </View>
                  <View style={styles.bidAmountCol}><Text style={styles.bidAmount}>{bid.amount.toLocaleString()}</Text><Text style={styles.bidCur}>ر.س</Text></View>
                </View>
                <View style={styles.bidDetails}>
                  <View style={styles.bdItem}><MaterialIcons name="access-time" size={16} color={theme.textSecondary} /><Text style={styles.bdText}>الوصول: {bid.estimatedArrival}</Text></View>
                  <View style={styles.bdItem}><MaterialIcons name="local-shipping" size={16} color={theme.textSecondary} /><Text style={styles.bdText}>{bid.driver.vehiclePlate}</Text></View>
                </View>
                <View style={styles.bidMsg}><MaterialIcons name="chat-bubble-outline" size={14} color={theme.textTertiary} /><Text style={styles.bidMsgText}>{bid.messageAr}</Text></View>
                <Pressable style={[styles.acceptBtn, index === 0 && styles.acceptBtnBest]} onPress={() => handleAcceptBid(bid.id, bid.driver.nameAr, bid.amount)}>
                  <Text style={[styles.acceptText, index === 0 && { color: '#FFF' }]}>قبول العرض</Text>
                </Pressable>
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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errText: { fontSize: 16, color: theme.textSecondary },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: 8 },
  hBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  hCenter: { alignItems: 'center' },
  hTitle: { fontSize: 18, fontWeight: '700', color: theme.textPrimary },
  hSub: { fontSize: 12, color: theme.textSecondary, marginTop: 2 },
  routeSummary: { backgroundColor: theme.surface, marginHorizontal: 16, borderRadius: 16, padding: 16, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, ...theme.shadows.card },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  routeDot: { width: 8, height: 8, borderRadius: 4 },
  routeCity: { fontSize: 15, fontWeight: '600', color: theme.textPrimary },
  routeMeta: { fontSize: 12, color: theme.textSecondary },
  bidsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 12 },
  bidsCount: { fontSize: 18, fontWeight: '700', color: theme.textPrimary },
  bidsSort: { fontSize: 13, fontWeight: '500', color: theme.accent },
  emptyBids: { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: theme.textPrimary },
  bidCard: { backgroundColor: theme.surface, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: theme.border, ...theme.shadows.card },
  bidBest: { borderColor: theme.accent, borderWidth: 2 },
  bestBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: theme.accent, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginBottom: 12 },
  bestText: { fontSize: 11, fontWeight: '700', color: '#FFF' },
  bidTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  bidDriver: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  driverAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: theme.primary + '15', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 18, fontWeight: '700', color: theme.primary },
  driverName: { fontSize: 15, fontWeight: '700', color: theme.textPrimary },
  driverMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  driverRating: { fontSize: 13, fontWeight: '600', color: theme.textPrimary },
  driverTrips: { fontSize: 13, color: theme.textSecondary },
  bidAmountCol: { alignItems: 'flex-end' },
  bidAmount: { fontSize: 24, fontWeight: '700', color: theme.primary },
  bidCur: { fontSize: 12, color: theme.textSecondary },
  bidDetails: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: theme.borderLight },
  bdItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  bdText: { fontSize: 13, color: theme.textSecondary },
  bidMsg: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginTop: 12, backgroundColor: theme.background, padding: 12, borderRadius: 12 },
  bidMsgText: { fontSize: 13, color: theme.textSecondary, flex: 1, lineHeight: 20 },
  acceptBtn: { marginTop: 14, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.primary + '10', borderWidth: 1, borderColor: theme.primary + '30' },
  acceptBtnBest: { backgroundColor: theme.accent, borderColor: theme.accent },
  acceptText: { fontSize: 15, fontWeight: '700', color: theme.primary },
});
