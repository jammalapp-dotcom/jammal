import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Switch } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { theme } from '../../constants/theme';
import { SHIPMENT_STATUSES } from '../../constants/config';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../contexts/AppContext';

export default function DriverHomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { shipments, driverOnline, setDriverOnline, driverWalletBalance, getUnreadNotifCount } = useApp();
  const myTrips = shipments.filter((s) => s.driverId === user?.id || s.driverName === user?.nameEn || s.driverNameAr === user?.name);
  const activeTrip = myTrips.find((s) => ['assigned', 'pickup', 'en_route'].includes(s.status));
  const completedToday = myTrips.filter((s) => s.status === 'delivered').length;
  const todayEarnings = myTrips.filter((s) => s.status === 'delivered' && s.finalPrice).reduce((sum, s) => sum + (s.finalPrice || 0) * 0.85, 0);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: insets.bottom + 16 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.header}>
          <View>
            <Text style={styles.greeting}>أهلاً يا سائق</Text>
            <Text style={styles.name}>{user?.name || 'سائق'}</Text>
          </View>
          <View style={styles.headerRight}>
            <Pressable style={styles.notifBtn} onPress={() => router.push('/notifications')}>
              <MaterialIcons name="notifications-none" size={24} color={theme.primary} />
              {getUnreadNotifCount() > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{getUnreadNotifCount()}</Text></View>}
            </Pressable>
            <Image source={require('../../assets/images/jammal-logo.png')} style={styles.logo} contentFit="contain" />
          </View>
        </Animated.View>

        {/* Online Toggle */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <View style={[styles.onlineCard, driverOnline && styles.onlineCardActive]}>
            <View style={styles.onlineLeft}>
              <View style={[styles.onlineDot, driverOnline && styles.onlineDotActive]} />
              <View>
                <Text style={[styles.onlineLabel, driverOnline && { color: '#FFF' }]}>{driverOnline ? 'متصل - جاهز للاستلام' : 'غير متصل'}</Text>
                <Text style={[styles.onlineSub, driverOnline && { color: 'rgba(255,255,255,0.7)' }]}>
                  {user?.vehiclePlate || 'ب ع ن ٢٣٤٥'}
                </Text>
              </View>
            </View>
            <Switch value={driverOnline} onValueChange={setDriverOnline} trackColor={{ false: theme.border, true: theme.accent }} thumbColor="#FFF" />
          </View>
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <MaterialIcons name="account-balance-wallet" size={24} color={theme.accent} />
              <Text style={styles.statVal}>{driverWalletBalance.toLocaleString()}</Text>
              <Text style={styles.statLbl}>ر.س الرصيد</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialIcons name="check-circle" size={24} color={theme.success} />
              <Text style={styles.statVal}>{completedToday}</Text>
              <Text style={styles.statLbl}>رحلات مكتملة</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialIcons name="star" size={24} color={theme.accent} />
              <Text style={styles.statVal}>{user?.rating || 4.9}</Text>
              <Text style={styles.statLbl}>التقييم</Text>
            </View>
          </View>
        </Animated.View>

        {/* Active Trip */}
        {activeTrip ? (
          <Animated.View entering={FadeInDown.delay(400).duration(500)}>
            <View style={styles.sectionH}><Text style={styles.sectionTitle}>الرحلة النشطة</Text></View>
            <Pressable style={styles.activeTripCard} onPress={() => router.push(`/shipment/${activeTrip.id}`)}>
              <LinearGradient colors={[theme.primary, theme.primaryLight]} style={styles.activeTripGrad}>
                <View style={styles.atTop}>
                  <Text style={styles.atId}>{activeTrip.id}</Text>
                  <View style={styles.atBadge}><Text style={styles.atBadgeText}>{SHIPMENT_STATUSES[activeTrip.status].labelAr}</Text></View>
                </View>
                <View style={styles.atRoute}>
                  <View style={styles.atRouteRow}><View style={[styles.atDot, { backgroundColor: theme.accent }]} /><Text style={styles.atCity}>{activeTrip.pickupCity}</Text></View>
                  <MaterialIcons name="arrow-downward" size={16} color="rgba(255,255,255,0.4)" />
                  <View style={styles.atRouteRow}><MaterialIcons name="location-on" size={14} color={theme.error} /><Text style={styles.atCity}>{activeTrip.deliveryCity}</Text></View>
                </View>
                <View style={styles.atFooter}>
                  <Text style={styles.atPrice}>{(activeTrip.finalPrice || activeTrip.estimatedPrice).toLocaleString()} ر.س</Text>
                  <Text style={styles.atDist}>{activeTrip.distance} كم</Text>
                </View>
                {activeTrip.trackingProgress !== undefined && (
                  <View style={styles.atProgress}><View style={styles.atProgressBg}><View style={[styles.atProgressFill, { width: `${activeTrip.trackingProgress * 100}%` }]} /></View><Text style={styles.atProgressText}>{Math.round(activeTrip.trackingProgress * 100)}٪</Text></View>
                )}
              </LinearGradient>
            </Pressable>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInDown.delay(400).duration(500)}>
            <View style={styles.noTrip}><MaterialIcons name="local-shipping" size={48} color={theme.textTertiary} /><Text style={styles.noTripText}>لا توجد رحلة نشطة</Text><Text style={styles.noTripSub}>تصفح الشحنات المتاحة للبدء</Text></View>
          </Animated.View>
        )}

        {/* Recent Trips */}
        <Animated.View entering={FadeInDown.delay(500).duration(500)}>
          <View style={styles.sectionH}><Text style={styles.sectionTitle}>رحلاتي الأخيرة</Text></View>
          {myTrips.length === 0 ? (
            <Text style={styles.noData}>لا توجد رحلات سابقة</Text>
          ) : (
            myTrips.slice(0, 5).map((s) => {
              const st = SHIPMENT_STATUSES[s.status];
              return (
                <Pressable key={s.id} style={styles.tripRow} onPress={() => router.push(`/shipment/${s.id}`)}>
                  <View style={[styles.tripIcon, { backgroundColor: st.color + '15' }]}><MaterialIcons name={s.status === 'delivered' ? 'check-circle' : 'local-shipping'} size={22} color={st.color} /></View>
                  <View style={{ flex: 1 }}><Text style={styles.tripRoute}>{s.pickupCity} → {s.deliveryCity}</Text><Text style={styles.tripMeta}>{s.createdAt} • {s.distance} كم</Text></View>
                  <Text style={styles.tripPrice}>{(s.finalPrice || s.estimatedPrice).toLocaleString()} ر.س</Text>
                </Pressable>
              );
            })
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 },
  greeting: { fontSize: 14, color: theme.textSecondary },
  name: { fontSize: 24, fontWeight: '700', color: theme.textPrimary, marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  notifBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: theme.surface, alignItems: 'center', justifyContent: 'center', ...theme.shadows.card },
  badge: { position: 'absolute', top: 6, right: 8, width: 16, height: 16, borderRadius: 8, backgroundColor: theme.error, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontSize: 10, color: '#FFF', fontWeight: '700' },
  logo: { width: 40, height: 40 },
  onlineCard: { marginHorizontal: 16, borderRadius: 16, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.surface, borderWidth: 2, borderColor: theme.border, ...theme.shadows.card },
  onlineCardActive: { backgroundColor: theme.success, borderColor: theme.success },
  onlineLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  onlineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: theme.textTertiary },
  onlineDotActive: { backgroundColor: '#FFF' },
  onlineLabel: { fontSize: 16, fontWeight: '700', color: theme.textPrimary },
  onlineSub: { fontSize: 13, color: theme.textSecondary, marginTop: 2 },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 16, gap: 10 },
  statCard: { flex: 1, backgroundColor: theme.surface, borderRadius: 16, padding: 14, alignItems: 'center', gap: 6, ...theme.shadows.card },
  statVal: { fontSize: 20, fontWeight: '700', color: theme.textPrimary },
  statLbl: { fontSize: 11, color: theme.textSecondary },
  sectionH: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: theme.textPrimary },
  activeTripCard: { marginHorizontal: 16, borderRadius: 16, overflow: 'hidden', ...theme.shadows.cardElevated },
  activeTripGrad: { padding: 20 },
  atTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  atId: { fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.7)' },
  atBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  atBadgeText: { fontSize: 12, fontWeight: '600', color: '#FFF' },
  atRoute: { gap: 4, marginBottom: 16 },
  atRouteRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  atDot: { width: 10, height: 10, borderRadius: 5 },
  atCity: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  atFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  atPrice: { fontSize: 22, fontWeight: '700', color: theme.accent },
  atDist: { fontSize: 14, color: 'rgba(255,255,255,0.6)' },
  atProgress: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  atProgressBg: { flex: 1, height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden' },
  atProgressFill: { height: 6, backgroundColor: theme.accent, borderRadius: 3 },
  atProgressText: { fontSize: 12, fontWeight: '600', color: theme.accent },
  noTrip: { alignItems: 'center', padding: 32, gap: 8, marginHorizontal: 16, backgroundColor: theme.surface, borderRadius: 16, ...theme.shadows.card },
  noTripText: { fontSize: 16, fontWeight: '600', color: theme.textPrimary },
  noTripSub: { fontSize: 13, color: theme.textSecondary },
  noData: { fontSize: 14, color: theme.textSecondary, textAlign: 'center', padding: 20 },
  tripRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12 },
  tripIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  tripRoute: { fontSize: 15, fontWeight: '600', color: theme.textPrimary },
  tripMeta: { fontSize: 12, color: theme.textSecondary, marginTop: 2 },
  tripPrice: { fontSize: 15, fontWeight: '700', color: theme.accent },
});
