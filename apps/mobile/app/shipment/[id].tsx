import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Linking } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { theme } from '../../constants/theme';
import { SHIPMENT_STATUSES, VEHICLE_TYPES, SPECIAL_HANDLING } from '../../constants/config';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../hooks/useAuth';
import { useAlert } from '@/template';

export default function ShipmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { getShipmentById, updateShipmentStatus, getShipmentBids } = useApp();
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const shipment = getShipmentById(id || '');

  if (!shipment) {
    return (
      <SafeAreaView edges={['top']} style={styles.container}>
        <View style={styles.notFound}><MaterialIcons name="error-outline" size={48} color={theme.textTertiary} /><Text style={styles.nfText}>الشحنة غير موجودة</Text><Pressable onPress={() => router.back()} style={styles.nfBtn}><Text style={styles.nfBtnText}>رجوع</Text></Pressable></View>
      </SafeAreaView>
    );
  }

  const statusInfo = SHIPMENT_STATUSES[shipment.status];
  const vehicleInfo = VEHICLE_TYPES.find((v) => v.id === shipment.vehicleType);
  const bids = getShipmentBids(shipment.id);
  const isDriver = user?.role === 'driver';

  const steps = [
    { key: 'searching', label: 'البحث عن سائق', icon: 'search' },
    { key: 'assigned', label: 'تم التعيين', icon: 'person-add' },
    { key: 'pickup', label: 'في الاستلام', icon: 'inventory' },
    { key: 'en_route', label: 'في الطريق', icon: 'local-shipping' },
    { key: 'delivered', label: 'تم التوصيل', icon: 'check-circle' },
  ];
  const currentIdx = steps.findIndex((s) => s.key === shipment.status);

  const handleStatusUpdate = (newStatus: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    updateShipmentStatus(shipment.id, newStatus as any);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.hBtn}><MaterialIcons name="arrow-forward" size={24} color={theme.textPrimary} /></Pressable>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Image source={require('../../assets/images/jammal_logo_mini.png')} style={{ width: 28, height: 28 }} contentFit="contain" />
          <Text style={styles.hTitle}>{shipment.id}</Text>
        </View>
        <Pressable style={styles.hBtn} onPress={() => showAlert('خيارات', '', [
          { text: 'إلغاء الشحنة', style: 'destructive', onPress: () => showAlert('تأكيد', 'هل تريد إلغاء هذه الشحنة؟', [{ text: 'لا', style: 'cancel' }, { text: 'نعم', style: 'destructive', onPress: () => updateShipmentStatus(shipment.id, 'cancelled' as any) }]) },
          { text: 'مشاركة', onPress: () => showAlert('مشاركة', `شحنة ${shipment.id}\n${shipment.pickupCity} \u2192 ${shipment.deliveryCity}`) },
          { text: 'تقرير مشكلة', onPress: () => showAlert('تقرير', 'سيتم مراجعة شكواك خلال 24 ساعة') },
          { text: 'إغلاق', style: 'cancel' },
        ])}><MaterialIcons name="more-vert" size={24} color={theme.textPrimary} /></Pressable>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: insets.bottom + 100 }} showsVerticalScrollIndicator={false}>
        {/* Map Hero */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <View style={styles.mapContainer}>
            <Image source={require('../../assets/images/tracking-hero.png')} style={StyleSheet.absoluteFill} contentFit="cover" />
            <View style={styles.mapOverlay} />
            <View style={styles.mapContent}>
              <View><View style={styles.mapRouteRow}><View style={[styles.mapDot, { backgroundColor: theme.accent }]} /><Text style={styles.mapCity}>{shipment.pickupCity}</Text></View>
                <MaterialIcons name="more-vert" size={16} color="rgba(255,255,255,0.3)" style={{ marginLeft: 2 }} />
                <View style={styles.mapRouteRow}><MaterialIcons name="location-on" size={14} color={theme.error} /><Text style={styles.mapCity}>{shipment.deliveryCity}</Text></View></View>
              <View style={styles.mapStats}>
                <View style={styles.mapStat}><Text style={styles.msVal}>{shipment.distance}</Text><Text style={styles.msLbl}>كم</Text></View>
                <View style={styles.mapStatDiv} />
                <View style={styles.mapStat}><Text style={styles.msVal}>{shipment.estimatedDuration}</Text><Text style={styles.msLbl}>المدة</Text></View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Status + Progress */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.statusSection}>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + '15' }]}><View style={[styles.statusDot, { backgroundColor: statusInfo.color }]} /><Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.labelAr}</Text></View>
          {shipment.trackingProgress !== undefined && (
            <View style={styles.trackRow}><View style={styles.trackBg}><LinearGradient colors={[theme.accent, theme.accentDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.trackFill, { width: `${shipment.trackingProgress * 100}%` }]} /></View><Text style={styles.trackPct}>{Math.round(shipment.trackingProgress * 100)}٪</Text></View>
          )}
        </Animated.View>

        {/* Timeline */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <View style={styles.card}><Text style={styles.cardTitle}>حالة الشحنة</Text>
            {steps.map((step, idx) => (
              <View key={step.key} style={styles.tlRow}>
                <View style={styles.tlLeft}>
                  <View style={[styles.tlCircle, idx <= currentIdx && { backgroundColor: theme.success, borderColor: theme.success }, idx === currentIdx && { backgroundColor: statusInfo.color, borderColor: statusInfo.color }]}>
                    {idx < currentIdx ? <MaterialIcons name="check" size={14} color="#FFF" /> : <MaterialIcons name={step.icon as any} size={14} color={idx === currentIdx ? '#FFF' : theme.textTertiary} />}
                  </View>
                  {idx < steps.length - 1 && <View style={[styles.tlLine, idx < currentIdx && { backgroundColor: theme.success }]} />}
                </View>
                <Text style={[styles.tlLabel, idx <= currentIdx && { color: theme.textPrimary, fontWeight: '600' }, idx === currentIdx && { color: statusInfo.color, fontWeight: '700' }]}>{step.label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Cargo Details */}
        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <View style={styles.card}><Text style={styles.cardTitle}>تفاصيل البضاعة</Text>
            <View style={styles.detailGrid}>
              {[
                { icon: 'category', label: 'النوع', val: shipment.cargoCategoryAr },
                { icon: 'fitness-center', label: 'الوزن', val: `${shipment.weight.toLocaleString()} كغ` },
                { icon: 'local-shipping', label: 'المركبة', val: vehicleInfo?.labelAr || '-' },
                { icon: 'straighten', label: 'المسافة', val: `${shipment.distance} كم` },
              ].map((d) => (
                <View key={d.label} style={styles.detailItem}><MaterialIcons name={d.icon as any} size={20} color={theme.accent} /><Text style={styles.dLabel}>{d.label}</Text><Text style={styles.dValue}>{d.val}</Text></View>
              ))}
            </View>
            {shipment.specialHandling.length > 0 && (
              <View style={styles.handlingRow}>{shipment.specialHandling.map((h) => { const info = SPECIAL_HANDLING.find((s) => s.id === h); return (<View key={h} style={styles.hChip}><MaterialIcons name={info?.icon as any || 'info'} size={14} color={theme.warning} /><Text style={styles.hChipText}>{info?.labelAr || h}</Text></View>); })}</View>
            )}
          </View>
        </Animated.View>

        {/* Driver */}
        {shipment.driverNameAr && (
          <Animated.View entering={FadeInDown.delay(500).duration(500)}>
            <View style={styles.card}><Text style={styles.cardTitle}>السائق</Text>
              <View style={styles.driverRow}>
                <View style={styles.driverAvatar}><MaterialIcons name="person" size={28} color={theme.textSecondary} /></View>
                <View style={{ flex: 1 }}><Text style={styles.driverName}>{shipment.driverNameAr}</Text><View style={styles.driverMeta}><MaterialIcons name="star" size={14} color={theme.accent} /><Text style={styles.driverRating}>{shipment.driverRating}</Text><Text style={styles.driverPlate}>• {shipment.vehiclePlate}</Text></View></View>
                <Pressable style={styles.callBtn} onPress={() => { if (shipment.driverPhone) Linking.openURL(`tel:${shipment.driverPhone.replace(/\s/g, '')}`); else showAlert('اتصال', `الاتصال بـ ${shipment.driverNameAr}`); }}><MaterialIcons name="phone" size={20} color={theme.success} /></Pressable>
                <Pressable style={styles.chatBtn} onPress={() => router.push(`/chat/${shipment.id}`)}><MaterialIcons name="chat" size={20} color={theme.primary} /></Pressable>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Price + Payment */}
        <Animated.View entering={FadeInDown.delay(600).duration(500)}>
          <LinearGradient colors={[theme.accent, theme.accentDark]} style={styles.priceCard}>
            <View style={styles.priceRow}><Text style={styles.priceLbl}>{shipment.finalPrice ? 'السعر النهائي' : 'السعر التقديري'}</Text><Text style={styles.priceVal}>{(shipment.finalPrice || shipment.estimatedPrice).toLocaleString()} <Text style={{ fontSize: 16 }}>ر.س</Text></Text></View>
            <View style={styles.priceMeta}><Text style={styles.priceMetaText}>{shipment.pricingMode === 'bidding' ? 'مزايدة' : 'سعر فوري'} • {shipment.bidsCount} عروض</Text></View>
            {shipment.paymentStatus && (
              <View style={styles.paymentBadge}><MaterialIcons name={shipment.paymentStatus === 'released' ? 'check-circle' : 'lock'} size={14} color="#FFF" /><Text style={styles.paymentText}>{shipment.paymentStatus === 'authorized' ? 'مفوّض (Escrow)' : shipment.paymentStatus === 'released' ? 'محرر' : shipment.paymentStatus === 'pending' ? 'بانتظار الدفع' : shipment.paymentStatus}</Text></View>
            )}
          </LinearGradient>
        </Animated.View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 8 }]}>
        {shipment.paymentStatus === 'pending' && !isDriver && (
          <Pressable style={styles.ctaPrimary} onPress={() => router.push(`/payment/${shipment.id}`)}><MaterialIcons name="payment" size={20} color="#FFF" /><Text style={styles.ctaText}>ادفع الآن</Text></Pressable>
        )}
        {shipment.status === 'searching' && bids.length > 0 && !isDriver && (
          <Pressable style={styles.ctaPrimary} onPress={() => router.push(`/bids/${shipment.id}`)}><MaterialIcons name="gavel" size={20} color="#FFF" /><Text style={styles.ctaText}>عرض العروض ({bids.length})</Text></Pressable>
        )}
        {shipment.status === 'searching' && bids.length === 0 && !isDriver && (
          <View style={styles.ctaWaiting}><MaterialIcons name="hourglass-top" size={20} color={theme.accent} /><Text style={styles.ctaWaitText}>في انتظار عروض السائقين...</Text></View>
        )}
        {shipment.status === 'assigned' && (
          <Pressable style={styles.ctaPrimary} onPress={() => showAlert('تحديث', 'تأكيد وصول السائق للاستلام؟', [{ text: 'إلغاء', style: 'cancel' }, { text: 'تأكيد', onPress: () => handleStatusUpdate('pickup') }])}><MaterialIcons name="inventory" size={20} color="#FFF" /><Text style={styles.ctaText}>تأكيد الاستلام</Text></Pressable>
        )}
        {shipment.status === 'pickup' && (
          <Pressable style={styles.ctaPrimary} onPress={() => handleStatusUpdate('en_route')}><MaterialIcons name="local-shipping" size={20} color="#FFF" /><Text style={styles.ctaText}>بدء الرحلة</Text></Pressable>
        )}
        {shipment.status === 'en_route' && (
          <Pressable style={[styles.ctaPrimary, { backgroundColor: theme.success }]} onPress={() => showAlert('تأكيد', 'هل تم التوصيل بنجاح؟', [{ text: 'إلغاء', style: 'cancel' }, { text: 'تأكيد', onPress: () => handleStatusUpdate('delivered') }])}><MaterialIcons name="check-circle" size={20} color="#FFF" /><Text style={styles.ctaText}>تأكيد التوصيل</Text></Pressable>
        )}
        {shipment.status === 'delivered' && (
          <View style={[styles.ctaWaiting, { backgroundColor: theme.successLight }]}><MaterialIcons name="check-circle" size={20} color={theme.success} /><Text style={[styles.ctaWaitText, { color: theme.success }]}>تم التوصيل بنجاح</Text></View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  nfText: { fontSize: 16, color: theme.textSecondary },
  nfBtn: { backgroundColor: theme.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  nfBtnText: { color: '#FFF', fontWeight: '600' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: 8 },
  hBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  hTitle: { fontSize: 16, fontWeight: '700', color: theme.textPrimary },
  mapContainer: { height: 200, marginHorizontal: 16, borderRadius: 16, overflow: 'hidden', ...theme.shadows.cardElevated },
  mapOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(27,42,74,0.65)' },
  mapContent: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
  mapRouteRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  mapDot: { width: 10, height: 10, borderRadius: 5 },
  mapCity: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  mapStats: { flexDirection: 'row', marginTop: 16, gap: 24 },
  mapStat: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  msVal: { fontSize: 20, fontWeight: '700', color: theme.accent },
  msLbl: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  mapStatDiv: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  statusSection: { paddingHorizontal: 16, paddingTop: 16, gap: 12 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 14, fontWeight: '700' },
  trackRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  trackBg: { flex: 1, height: 8, backgroundColor: theme.backgroundSecondary, borderRadius: 4, overflow: 'hidden' },
  trackFill: { height: 8, borderRadius: 4 },
  trackPct: { fontSize: 14, fontWeight: '700', color: theme.accent },
  card: { backgroundColor: theme.surface, borderRadius: 16, marginHorizontal: 16, marginTop: 12, padding: 16, ...theme.shadows.card },
  cardTitle: { fontSize: 16, fontWeight: '700', color: theme.textPrimary, marginBottom: 14 },
  tlRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, minHeight: 40 },
  tlLeft: { alignItems: 'center' },
  tlCircle: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: theme.border, backgroundColor: theme.backgroundSecondary, alignItems: 'center', justifyContent: 'center' },
  tlLine: { width: 2, height: 12, backgroundColor: theme.border },
  tlLabel: { fontSize: 14, color: theme.textTertiary, paddingTop: 4 },
  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  detailItem: { width: '46%', backgroundColor: theme.background, borderRadius: 12, padding: 12, gap: 4 },
  dLabel: { fontSize: 11, fontWeight: '600', color: theme.textTertiary },
  dValue: { fontSize: 15, fontWeight: '700', color: theme.textPrimary },
  handlingRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  hChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, backgroundColor: theme.warningLight },
  hChipText: { fontSize: 12, fontWeight: '600', color: theme.warning },
  driverRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  driverAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: theme.backgroundSecondary, alignItems: 'center', justifyContent: 'center' },
  driverName: { fontSize: 16, fontWeight: '700', color: theme.textPrimary },
  driverMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  driverRating: { fontSize: 13, fontWeight: '600', color: theme.textPrimary },
  driverPlate: { fontSize: 13, color: theme.textSecondary },
  callBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.successLight, alignItems: 'center', justifyContent: 'center' },
  chatBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.infoLight, alignItems: 'center', justifyContent: 'center' },
  priceCard: { marginHorizontal: 16, marginTop: 12, borderRadius: 16, padding: 20 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceLbl: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  priceVal: { fontSize: 28, fontWeight: '700', color: '#FFF' },
  priceMeta: { marginTop: 8 },
  priceMetaText: { fontSize: 12, color: 'rgba(255,255,255,0.5)' },
  paymentBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, alignSelf: 'flex-start', marginTop: 10 },
  paymentText: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  bottomBar: { paddingHorizontal: 16, paddingTop: 12, backgroundColor: theme.surface, borderTopWidth: 1, borderTopColor: theme.border },
  ctaPrimary: { backgroundColor: theme.primary, borderRadius: 12, height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  ctaText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  ctaWaiting: { backgroundColor: theme.accent + '15', borderRadius: 12, height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  ctaWaitText: { fontSize: 15, fontWeight: '600', color: theme.accent },
});
