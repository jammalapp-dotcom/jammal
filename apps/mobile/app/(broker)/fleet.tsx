import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Linking } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { theme } from '../../constants/theme';
import { useApp } from '../../contexts/AppContext';
import { useAlert } from '@/template';
import { Image } from 'expo-image';

export default function BrokerFleetScreen() {
  const insets = useSafeAreaInsets();
  const { drivers } = useApp();
  const { showAlert } = useAlert();

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, gap: 8 }}>
        <Image source={require('../../assets/images/jammal_logo_mini.png')} style={{ width: 32, height: 32 }} contentFit="contain" />
        <Text style={[styles.title, { paddingHorizontal: 0, paddingTop: 0, paddingBottom: 0 }]}>إدارة الأسطول</Text>
      </View>
      <View style={styles.summaryRow}>
        <View style={styles.sumCard}><Text style={styles.sumVal}>{drivers.length}</Text><Text style={styles.sumLbl}>إجمالي</Text></View>
        <View style={styles.sumCard}><Text style={[styles.sumVal, { color: theme.success }]}>{drivers.filter((d) => d.isOnline).length}</Text><Text style={styles.sumLbl}>متصل</Text></View>
        <View style={styles.sumCard}><Text style={[styles.sumVal, { color: theme.textTertiary }]}>{drivers.filter((d) => !d.isOnline).length}</Text><Text style={styles.sumLbl}>غير متصل</Text></View>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 16 }} showsVerticalScrollIndicator={false}>
        {drivers.map((d, i) => (
          <Animated.View key={d.id} entering={FadeInDown.delay(i * 60).duration(400)}>
            <View style={styles.driverCard}>
              <View style={styles.driverAvatar}><Text style={styles.avatarText}>{d.nameAr.charAt(0)}</Text></View>
              <View style={{ flex: 1 }}>
                <View style={styles.dNameRow}><Text style={styles.dName}>{d.nameAr}</Text><View style={[styles.onlineDot, { backgroundColor: d.isOnline ? theme.success : theme.textTertiary }]} /></View>
                <Text style={styles.dMeta}>{d.vehiclePlate} • {d.completedTrips} رحلة</Text>
                <View style={styles.dRating}><MaterialIcons name="star" size={14} color={theme.accent} /><Text style={styles.dRatingText}>{d.rating}</Text></View>
              </View>
              <View style={styles.dActions}>
                <Pressable style={styles.dBtn} onPress={() => Linking.openURL(`tel:${d.phone.replace(/\s/g, '')}`)}><MaterialIcons name="phone" size={18} color={theme.success} /></Pressable>
                <Pressable style={styles.dBtn} onPress={() => showAlert(`موقع ${d.nameAr}`, `الحالة: ${d.isOnline ? 'متصل ✓' : 'غير متصل'}\nالمركبة: ${d.vehiclePlate}\nالرحلات: ${d.completedTrips}`)}><MaterialIcons name="location-on" size={18} color={theme.info} /></Pressable>
              </View>
            </View>
          </Animated.View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  title: { fontSize: 28, fontWeight: '700', color: theme.textPrimary, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  summaryRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 16 },
  sumCard: { flex: 1, backgroundColor: theme.surface, borderRadius: 12, padding: 14, alignItems: 'center', ...theme.shadows.card },
  sumVal: { fontSize: 24, fontWeight: '700', color: theme.textPrimary },
  sumLbl: { fontSize: 12, color: theme.textSecondary, marginTop: 2 },
  driverCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.surface, borderRadius: 16, padding: 14, marginBottom: 10, gap: 12, ...theme.shadows.card },
  driverAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: theme.primary + '15', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 18, fontWeight: '700', color: theme.primary },
  dNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dName: { fontSize: 15, fontWeight: '700', color: theme.textPrimary },
  onlineDot: { width: 8, height: 8, borderRadius: 4 },
  dMeta: { fontSize: 12, color: theme.textSecondary, marginTop: 2 },
  dRating: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 4 },
  dRatingText: { fontSize: 13, fontWeight: '600', color: theme.textPrimary },
  dActions: { flexDirection: 'row', gap: 8 },
  dBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: theme.backgroundSecondary, alignItems: 'center', justifyContent: 'center' },
});
