import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { theme } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../contexts/AppContext';
import { useAlert } from '@/template';

export default function BrokerHomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { shipments, drivers } = useApp();
  const { showAlert } = useAlert();
  const onlineDrivers = drivers.filter((d) => d.isOnline).length;
  const activeShips = shipments.filter((s) => !['delivered', 'draft', 'disputed'].includes(s.status)).length;
  const revenue = shipments.filter((s) => s.finalPrice).reduce((sum, s) => sum + (s.finalPrice || 0), 0);
  const commission = Math.round(revenue * 0.10);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: insets.bottom + 16 }} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.header}>
          <View>
            <Text style={styles.greeting}>{'\u0645\u0631\u062d\u0628\u0627\u064b \u0648\u0633\u064a\u0637'}</Text>
            <Text style={styles.name}>{user?.name || '\u0648\u0633\u064a\u0637'}</Text>
            <Text style={styles.company}>{user?.company}</Text>
          </View>
          <Image source={require('../../assets/images/jammal-logo.png')} style={styles.logo} contentFit="contain" />
        </Animated.View>

        {/* KPIs */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.kpiRow}>
          {[
            { icon: 'groups', label: '\u0633\u0627\u0626\u0642\u064a\u0646 \u0645\u062a\u0635\u0644\u064a\u0646', val: `${onlineDrivers}`, color: theme.success },
            { icon: 'local-shipping', label: '\u0634\u062d\u0646\u0627\u062a \u0646\u0634\u0637\u0629', val: `${activeShips}`, color: theme.info },
            { icon: 'account-balance-wallet', label: '\u0625\u062c\u0645\u0627\u0644\u064a \u0627\u0644\u0625\u064a\u0631\u0627\u062f\u0627\u062a', val: `${revenue.toLocaleString()}`, color: theme.accent },
            { icon: 'receipt', label: '\u0627\u0644\u0639\u0645\u0648\u0644\u0629 (\u0661\u0660\u066a)', val: `${commission.toLocaleString()}`, color: theme.warning },
          ].map((kpi, i) => (
            <View key={i} style={styles.kpiCard}>
              <MaterialIcons name={kpi.icon as any} size={24} color={kpi.color} />
              <Text style={styles.kpiVal}>{kpi.val}</Text>
              <Text style={styles.kpiLbl}>{kpi.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Fleet Map Placeholder */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <Pressable style={styles.mapCard} onPress={() => showAlert('\u062e\u0631\u064a\u0637\u0629 \u0627\u0644\u0623\u0633\u0637\u0648\u0644', '\u0627\u0644\u0633\u0627\u0626\u0642\u064a\u0646 \u0627\u0644\u0645\u062a\u0635\u0644\u064a\u0646: ' + onlineDrivers + '\n\n\u0627\u0644\u062e\u0631\u064a\u0637\u0629 \u0627\u0644\u062d\u064a\u0629 \u0633\u062a\u0643\u0648\u0646 \u0645\u062a\u0627\u062d\u0629 \u0642\u0631\u064a\u0628\u0627\u064b \u0645\u0639 \u062a\u062a\u0628\u0639 GPS \u0641\u0648\u0631\u064a')}>
            <Image source={require('../../assets/images/tracking-hero.png')} style={StyleSheet.absoluteFill} contentFit="cover" />
            <View style={styles.mapOverlay} />
            <View style={styles.mapContent}>
              <Text style={styles.mapTitle}>{'\u062e\u0631\u064a\u0637\u0629 \u0627\u0644\u0623\u0633\u0637\u0648\u0644 \u0627\u0644\u062d\u064a\u0629'}</Text>
              <Text style={styles.mapSub}>{onlineDrivers} {'\u0633\u0627\u0626\u0642 \u0645\u062a\u0635\u0644 \u0627\u0644\u0622\u0646'}</Text>
              <View style={styles.mapBtn}>
                <MaterialIcons name="map" size={18} color="#FFF" />
                <Text style={styles.mapBtnText}>{'\u0641\u062a\u062d \u0627\u0644\u062e\u0631\u064a\u0637\u0629'}</Text>
              </View>
            </View>
          </Pressable>
        </Animated.View>

        {/* Active Shipments */}
        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <View style={styles.sectionH}>
            <Text style={styles.sectionTitle}>{'\u0627\u0644\u0634\u062d\u0646\u0627\u062a \u0627\u0644\u0623\u062e\u064a\u0631\u0629'}</Text>
            <Pressable onPress={() => router.push('/(broker)/shipments')}>
              <Text style={styles.seeAll}>{'\u0639\u0631\u0636 \u0627\u0644\u0643\u0644'}</Text>
            </Pressable>
          </View>
          {shipments.slice(0, 4).map((s) => (
            <Pressable key={s.id} style={styles.shipRow} onPress={() => router.push(`/shipment/${s.id}`)}>
              <View style={{ flex: 1 }}>
                <Text style={styles.shipRoute}>{s.pickupCity} {'\u2192'} {s.deliveryCity}</Text>
                <Text style={styles.shipMeta}>{s.cargoCategoryAr} {'\u2022'} {s.distance} {'\u0643\u0645'}</Text>
              </View>
              <Text style={styles.shipPrice}>{(s.finalPrice || s.estimatedPrice).toLocaleString()} {'\u0631.\u0633'}</Text>
            </Pressable>
          ))}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 },
  greeting: { fontSize: 14, color: theme.textSecondary },
  name: { fontSize: 24, fontWeight: '700', color: theme.textPrimary, marginTop: 2 },
  company: { fontSize: 13, color: theme.accent, fontWeight: '600', marginTop: 2 },
  logo: { width: 44, height: 44 },
  kpiRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 10 },
  kpiCard: { width: '47%', backgroundColor: theme.surface, borderRadius: 16, padding: 16, gap: 6, ...theme.shadows.card },
  kpiVal: { fontSize: 22, fontWeight: '700', color: theme.textPrimary },
  kpiLbl: { fontSize: 12, color: theme.textSecondary },
  mapCard: { marginHorizontal: 16, marginTop: 16, height: 160, borderRadius: 16, overflow: 'hidden', ...theme.shadows.cardElevated },
  mapOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(27,42,74,0.8)' },
  mapContent: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
  mapTitle: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  mapSub: { fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 4 },
  mapBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: theme.accent, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, alignSelf: 'flex-start', marginTop: 12 },
  mapBtnText: { fontSize: 13, fontWeight: '600', color: '#FFF' },
  sectionH: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 24, paddingBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: theme.textPrimary },
  seeAll: { fontSize: 14, fontWeight: '600', color: theme.accent },
  shipRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.borderLight },
  shipRoute: { fontSize: 15, fontWeight: '600', color: theme.textPrimary },
  shipMeta: { fontSize: 12, color: theme.textSecondary, marginTop: 2 },
  shipPrice: { fontSize: 15, fontWeight: '700', color: theme.accent },
});
