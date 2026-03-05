import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { theme } from '../../constants/theme';
import { useApp } from '../../contexts/AppContext';
import { useAlert } from '@/template';

const METHODS = [
  { id: 'mada', label: 'مدى', icon: 'credit-card', desc: '**** ٤٥٦٧' },
  { id: 'apple_pay', label: 'Apple Pay', icon: 'phone-iphone', desc: 'iPhone' },
  { id: 'stc_pay', label: 'STC Pay', icon: 'phone-android', desc: '+966 55 XXX' },
  { id: 'credit', label: 'بطاقة ائتمان', icon: 'credit-card', desc: '**** ٨٩٠١' },
];

export default function PaymentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { getShipmentById, processPayment } = useApp();
  const { showAlert } = useAlert();
  const [selected, setSelected] = useState('mada');
  const [processing, setProcessing] = useState(false);
  const shipment = getShipmentById(id || '');

  if (!shipment) return (
    <SafeAreaView style={styles.container}><View style={styles.center}><Text style={styles.errText}>الشحنة غير موجودة</Text></View></SafeAreaView>
  );

  const amount = shipment.finalPrice || shipment.estimatedPrice;

  const handlePay = async () => {
    setProcessing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await new Promise((r) => setTimeout(r, 2000));
    processPayment(shipment.id, selected);
    setProcessing(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showAlert('تم الدفع بنجاح', `تم تفويض مبلغ ${amount.toLocaleString()} ر.س\nسيتم تحرير المبلغ بعد التوصيل`, [
      { text: 'عرض الشحنة', onPress: () => router.replace(`/shipment/${shipment.id}`) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerBtn}><MaterialIcons name="close" size={24} color={theme.textPrimary} /></Pressable>
        <Text style={styles.headerTitle}>الدفع</Text>
        <View style={styles.headerBtn} />
      </View>

      <View style={styles.content}>
        {/* Amount */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <LinearGradient colors={[theme.primary, theme.primaryLight]} style={styles.amountCard}>
            <Text style={styles.amountLabel}>المبلغ المستحق</Text>
            <Text style={styles.amountValue}>{amount.toLocaleString()} <Text style={{ fontSize: 20 }}>ر.س</Text></Text>
            <Text style={styles.amountNote}>شحنة {shipment.id} • {shipment.pickupCity} → {shipment.deliveryCity}</Text>
            <View style={styles.escrowBadge}><MaterialIcons name="lock" size={14} color={theme.accent} /><Text style={styles.escrowText}>ضمان Escrow - يُحرر بعد التوصيل</Text></View>
          </LinearGradient>
        </Animated.View>

        {/* Payment Methods */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <Text style={styles.sectionTitle}>اختر طريقة الدفع</Text>
          {METHODS.map((m) => (
            <Pressable key={m.id} style={[styles.methodCard, selected === m.id && styles.methodActive]} onPress={() => { Haptics.selectionAsync(); setSelected(m.id); }}>
              <View style={[styles.methodIcon, selected === m.id && { backgroundColor: theme.accent + '20' }]}><MaterialIcons name={m.icon as any} size={24} color={selected === m.id ? theme.accent : theme.textSecondary} /></View>
              <View style={{ flex: 1 }}><Text style={styles.methodLabel}>{m.label}</Text><Text style={styles.methodDesc}>{m.desc}</Text></View>
              <View style={[styles.radio, selected === m.id && styles.radioActive]}>{selected === m.id && <View style={styles.radioInner} />}</View>
            </Pressable>
          ))}
        </Animated.View>
      </View>

      {/* Pay Button */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 8 }]}>
        <Pressable style={[styles.payBtn, processing && { opacity: 0.6 }]} onPress={!processing ? handlePay : undefined}>
          <LinearGradient colors={[theme.accent, theme.accentDark]} style={styles.payBtnGrad}>
            <MaterialIcons name={processing ? 'hourglass-top' : 'lock'} size={20} color="#FFF" />
            <Text style={styles.payBtnText}>{processing ? 'جاري المعالجة...' : `ادفع ${amount.toLocaleString()} ر.س`}</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errText: { fontSize: 16, color: theme.textSecondary },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: 8 },
  headerBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: theme.textPrimary },
  content: { flex: 1, paddingHorizontal: 16 },
  amountCard: { borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 24 },
  amountLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  amountValue: { fontSize: 40, fontWeight: '700', color: '#FFF', marginTop: 4 },
  amountNote: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 8 },
  escrowBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginTop: 12 },
  escrowText: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: theme.textPrimary, marginBottom: 12 },
  methodCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.surface, borderRadius: 14, padding: 14, marginBottom: 10, gap: 12, borderWidth: 2, borderColor: theme.border, ...theme.shadows.card },
  methodActive: { borderColor: theme.accent, backgroundColor: theme.accent + '05' },
  methodIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: theme.backgroundSecondary, alignItems: 'center', justifyContent: 'center' },
  methodLabel: { fontSize: 15, fontWeight: '600', color: theme.textPrimary },
  methodDesc: { fontSize: 13, color: theme.textSecondary, marginTop: 2 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: theme.border, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: theme.accent },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: theme.accent },
  bottomBar: { paddingHorizontal: 16, paddingTop: 12, backgroundColor: theme.surface, borderTopWidth: 1, borderTopColor: theme.border },
  payBtn: { borderRadius: 14, overflow: 'hidden' },
  payBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  payBtnText: { fontSize: 17, fontWeight: '700', color: '#FFF' },
});
