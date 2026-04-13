import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { theme } from '../../constants/theme';
import { CARGO_CATEGORIES, SPECIAL_HANDLING, VEHICLE_TYPES, APP_CONFIG } from '../../constants/config';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../hooks/useAuth';
import { useAlert } from '@/template';
import { Shipment } from '../../services/mockData';

type Step = 1 | 2 | 3 | 4;

export default function CreateShipmentScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { addShipment } = useApp();
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const [step, setStep] = useState<Step>(1);
  const [pickupCity, setPickupCity] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [weight, setWeight] = useState('');
  const [description, setDescription] = useState('');
  const [selectedHandling, setSelectedHandling] = useState<string[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [pricingMode, setPricingMode] = useState<'bidding' | 'instant'>('bidding');
  const stepLabels = ['العناوين', 'البضاعة', 'المركبة', 'مراجعة'];

  const canProceed = () => {
    switch (step) {
      case 1: return pickupCity && deliveryCity;
      case 2: return selectedCategory && weight;
      case 3: return selectedVehicle;
      case 4: return true;
      default: return false;
    }
  };

  const calculatePrice = () => {
    const dist = Math.floor(Math.random() * 800) + 200;
    return { distance: dist, price: Math.round(dist * APP_CONFIG.baseRate + APP_CONFIG.baseFare) };
  };

  const handleSubmit = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const { distance, price } = calculatePrice();
    const cat = CARGO_CATEGORIES.find((c) => c.id === selectedCategory);
    const newShipment: Shipment = {
      id: `SH-2024-${String(Date.now()).slice(-3)}`,
      customerId: user?.id || '',
      pickupCity: pickupCity || 'الرياض',
      pickupAddress: pickupAddress || 'لم يحدد',
      deliveryCity: deliveryCity || 'جدة',
      deliveryAddress: deliveryAddress || 'لم يحدد',
      cargoCategory: selectedCategory,
      cargoCategoryAr: cat?.labelAr || 'أخرى',
      weight: parseInt(weight) || 1000,
      description: description || 'Cargo shipment',
      descriptionAr: description || 'شحنة بضائع',
      specialHandling: selectedHandling,
      vehicleType: selectedVehicle,
      status: pricingMode === 'bidding' ? 'searching' : 'assigned',
      pricingMode,
      estimatedPrice: price,
      createdAt: new Date().toISOString().split('T')[0],
      pickupDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      bidsCount: 0,
      distance,
      estimatedDuration: `${Math.ceil(distance / 90)} ساعات`,
      paymentStatus: 'pending',
    };
    const emailBody = `تفاصيل الشحنة الجديدة:\n- المسار: ${pickupCity} إلى ${deliveryCity}\n- التصنيف: ${cat?.labelAr || 'أخرى'}\n- الوزن: ${weight} كغ\n- الوصف: ${description}\n- التسعير: ${pricingMode === 'bidding' ? 'مزايدة' : 'فوري'}\n- السعر التقديري: ${price} ر.س`;
    
    // Add shipment locally 
    addShipment(newShipment);
    
    // Open email client
    import('react-native').then(({ Linking }) => {
       Linking.openURL(`mailto:contact@jammal.express?subject=طلب شحنة جديدة: ${newShipment.id}&body=${encodeURIComponent(emailBody)}`);
    });

    showAlert('تم إنشاء الشحنة', `رقم: ${newShipment.id}\nالسعر التقديري: ${price.toLocaleString()} ر.س`, [
      { text: 'الدفع', onPress: () => router.push(`/payment/${newShipment.id}`) },
      { text: 'عرض', onPress: () => router.push(`/shipment/${newShipment.id}`) },
    ]);
    setStep(1); setPickupCity(''); setPickupAddress(''); setDeliveryCity(''); setDeliveryAddress('');
    setSelectedCategory(''); setWeight(''); setDescription(''); setSelectedHandling([]); setSelectedVehicle('');
  };

  const handleNext = () => { if (step < 4) { Haptics.selectionAsync(); setStep((step + 1) as Step); } else handleSubmit(); };
  const handleBack = () => { if (step > 1) setStep((step - 1) as Step); };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        {step > 1 ? <Pressable onPress={handleBack} style={styles.backBtn}><MaterialIcons name="arrow-forward" size={24} color={theme.textPrimary} /></Pressable> : <View style={styles.backBtn} />}
        <Text style={styles.headerTitle}>شحنة جديدة</Text>
        <Image source={require('../../assets/images/jammal_logo_mini.png')} style={{ width: 32, height: 32, marginRight: 8 }} contentFit="contain" />
      </View>
      <View style={styles.stepsRow}>
        {stepLabels.map((l, i) => (
          <View key={i} style={styles.stepItem}>
            <View style={[styles.stepCircle, i + 1 <= step && styles.stepCircleActive, i + 1 < step && styles.stepCircleDone]}>
              {i + 1 < step ? <MaterialIcons name="check" size={14} color="#FFF" /> : <Text style={[styles.stepNum, i + 1 <= step && { color: '#FFF' }]}>{i + 1}</Text>}
            </View>
            {i < stepLabels.length - 1 && <View style={[styles.stepLine, i + 1 < step && styles.stepLineDone]} />}
          </View>
        ))}
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 100 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {step === 1 && (
            <Animated.View entering={FadeInDown.duration(400)}>
              <Text style={styles.stepTitle}>عنوان الاستلام والتوصيل</Text>
              <View style={styles.card}>
                <View style={styles.cardH}><MaterialIcons name="radio-button-checked" size={18} color={theme.accent} /><Text style={styles.cardHT}>نقطة الاستلام</Text></View>
                <TextInput style={styles.input} placeholder="المدينة (مثال: الرياض)" placeholderTextColor={theme.textTertiary} value={pickupCity} onChangeText={setPickupCity} />
                <TextInput style={styles.input} placeholder="العنوان التفصيلي (اختياري)" placeholderTextColor={theme.textTertiary} value={pickupAddress} onChangeText={setPickupAddress} />
              </View>
              <View style={styles.card}>
                <View style={styles.cardH}><MaterialIcons name="location-on" size={18} color={theme.error} /><Text style={styles.cardHT}>نقطة التوصيل</Text></View>
                <TextInput style={styles.input} placeholder="المدينة (مثال: جدة)" placeholderTextColor={theme.textTertiary} value={deliveryCity} onChangeText={setDeliveryCity} />
                <TextInput style={styles.input} placeholder="العنوان التفصيلي (اختياري)" placeholderTextColor={theme.textTertiary} value={deliveryAddress} onChangeText={setDeliveryAddress} />
              </View>
            </Animated.View>
          )}
          {step === 2 && (
            <Animated.View entering={FadeInDown.duration(400)}>
              <Text style={styles.stepTitle}>تفاصيل البضاعة</Text>
              <Text style={styles.fLabel}>تصنيف البضاعة</Text>
              <View style={styles.catGrid}>
                {CARGO_CATEGORIES.map((c) => (
                  <Pressable key={c.id} style={[styles.catItem, selectedCategory === c.id && styles.catItemActive]} onPress={() => { Haptics.selectionAsync(); setSelectedCategory(c.id); }}>
                    <MaterialIcons name={c.icon as any} size={24} color={selectedCategory === c.id ? theme.accent : theme.textSecondary} />
                    <Text style={[styles.catLabel, selectedCategory === c.id && { color: theme.accent }]}>{c.labelAr}</Text>
                  </Pressable>
                ))}
              </View>
              <Text style={styles.fLabel}>الوزن (كغ)</Text>
              <TextInput style={styles.input} placeholder="مثال: 2500" placeholderTextColor={theme.textTertiary} value={weight} onChangeText={setWeight} keyboardType="numeric" />
              <Text style={styles.fLabel}>وصف البضاعة</Text>
              <TextInput style={[styles.input, { height: 80 }]} placeholder="وصف مختصر..." placeholderTextColor={theme.textTertiary} value={description} onChangeText={setDescription} multiline textAlignVertical="top" />
              <Text style={styles.fLabel}>معاملة خاصة</Text>
              <View style={styles.handlingRow}>
                {SPECIAL_HANDLING.map((h) => (
                  <Pressable key={h.id} style={[styles.chip, selectedHandling.includes(h.id) && styles.chipActive]} onPress={() => { Haptics.selectionAsync(); setSelectedHandling((p) => p.includes(h.id) ? p.filter((x) => x !== h.id) : [...p, h.id]); }}>
                    <MaterialIcons name={h.icon as any} size={16} color={selectedHandling.includes(h.id) ? '#FFF' : theme.textSecondary} />
                    <Text style={[styles.chipText, selectedHandling.includes(h.id) && { color: '#FFF' }]}>{h.labelAr}</Text>
                  </Pressable>
                ))}
              </View>
            </Animated.View>
          )}
          {step === 3 && (
            <Animated.View entering={FadeInDown.duration(400)}>
              <Text style={styles.stepTitle}>نوع المركبة</Text>
              {VEHICLE_TYPES.map((v) => (
                <Pressable key={v.id} style={[styles.vCard, selectedVehicle === v.id && styles.vCardActive]} onPress={() => { Haptics.selectionAsync(); setSelectedVehicle(v.id); }}>
                  <View style={[styles.vIcon, { backgroundColor: selectedVehicle === v.id ? theme.accent + '20' : theme.backgroundSecondary }]}>
                    <MaterialIcons name={v.icon as any} size={28} color={selectedVehicle === v.id ? theme.accent : theme.textSecondary} />
                  </View>
                  <View style={{ flex: 1 }}><Text style={styles.vName}>{v.labelAr}</Text><Text style={styles.vCap}>سعة: {v.capacity}</Text></View>
                  <View style={[styles.radio, selectedVehicle === v.id && styles.radioActive]}>{selectedVehicle === v.id && <View style={styles.radioInner} />}</View>
                </Pressable>
              ))}
              <Text style={[styles.fLabel, { marginTop: 24 }]}>طريقة التسعير</Text>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                {(['bidding', 'instant'] as const).map((m) => (
                  <Pressable key={m} style={[styles.prMode, pricingMode === m && styles.prModeActive]} onPress={() => { Haptics.selectionAsync(); setPricingMode(m); }}>
                    <MaterialIcons name={m === 'bidding' ? 'gavel' : 'bolt'} size={28} color={pricingMode === m ? theme.accent : theme.textSecondary} />
                    <Text style={[styles.prLabel, pricingMode === m && { color: theme.primary }]}>{m === 'bidding' ? 'مزايدة' : 'سعر فوري'}</Text>
                    <Text style={styles.prDesc}>{m === 'bidding' ? 'السائقون يقدمون عروضهم' : 'حساب تلقائي للسعر'}</Text>
                  </Pressable>
                ))}
              </View>
            </Animated.View>
          )}
          {step === 4 && (
            <Animated.View entering={FadeInDown.duration(400)}>
              <Text style={styles.stepTitle}>مراجعة الشحنة</Text>
              <View style={styles.reviewCard}>
                {[
                  { l: 'من', v: pickupCity || 'لم يحدد' }, { l: 'إلى', v: deliveryCity || 'لم يحدد' },
                  { l: 'النوع', v: CARGO_CATEGORIES.find((c) => c.id === selectedCategory)?.labelAr || '-' },
                  { l: 'الوزن', v: `${weight || '-'} كغ` },
                  { l: 'المركبة', v: VEHICLE_TYPES.find((v) => v.id === selectedVehicle)?.labelAr || '-' },
                  { l: 'التسعير', v: pricingMode === 'bidding' ? 'مزايدة' : 'سعر فوري' },
                ].map((r, i) => (
                  <View key={i} style={styles.reviewRow}><Text style={styles.revLabel}>{r.l}</Text><Text style={styles.revValue}>{r.v}</Text></View>
                ))}
              </View>
              <LinearGradient colors={[theme.accent, theme.accentDark]} style={styles.priceCard}>
                <Text style={styles.priceLbl}>السعر التقديري</Text>
                <Text style={styles.priceVal}>{calculatePrice().price.toLocaleString()} <Text style={{ fontSize: 20 }}>ر.س</Text></Text>
              </LinearGradient>
            </Animated.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 8 }]}>
        <Pressable style={[styles.ctaBtn, !canProceed() && { opacity: 0.4 }]} onPress={canProceed() ? handleNext : undefined}>
          <Text style={styles.ctaText}>{step === 4 ? 'إرسال الشحنة' : 'التالي'}</Text>
          <MaterialIcons name={step === 4 ? 'check' : 'arrow-back'} size={20} color="#FFF" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: theme.textPrimary },
  stepsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, paddingBottom: 16 },
  stepItem: { flexDirection: 'row', alignItems: 'center' },
  stepCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: theme.backgroundSecondary, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: theme.border },
  stepCircleActive: { backgroundColor: theme.accent, borderColor: theme.accent },
  stepCircleDone: { backgroundColor: theme.success, borderColor: theme.success },
  stepNum: { fontSize: 12, fontWeight: '700', color: theme.textSecondary },
  stepLine: { width: 40, height: 2, backgroundColor: theme.border, marginHorizontal: 4 },
  stepLineDone: { backgroundColor: theme.success },
  stepTitle: { fontSize: 22, fontWeight: '700', color: theme.textPrimary, marginTop: 8, marginBottom: 16 },
  card: { backgroundColor: theme.surface, borderRadius: 16, padding: 16, marginBottom: 12, ...theme.shadows.card },
  cardH: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  cardHT: { fontSize: 15, fontWeight: '600', color: theme.textPrimary },
  input: { backgroundColor: theme.background, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: theme.textPrimary, marginBottom: 8, borderWidth: 1, borderColor: theme.border, textAlign: 'right', writingDirection: 'rtl' },
  fLabel: { fontSize: 14, fontWeight: '600', color: theme.textPrimary, marginBottom: 8, marginTop: 12 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  catItem: { width: '22%', aspectRatio: 1, backgroundColor: theme.surface, borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 4, borderWidth: 2, borderColor: theme.border },
  catItemActive: { borderColor: theme.accent, backgroundColor: theme.accent + '08' },
  catLabel: { fontSize: 11, fontWeight: '600', color: theme.textSecondary, textAlign: 'center' },
  handlingRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border },
  chipActive: { backgroundColor: theme.primary, borderColor: theme.primary },
  chipText: { fontSize: 13, fontWeight: '500', color: theme.textSecondary },
  vCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.surface, borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 2, borderColor: theme.border, gap: 14, ...theme.shadows.card },
  vCardActive: { borderColor: theme.accent, backgroundColor: theme.accent + '05' },
  vIcon: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  vName: { fontSize: 16, fontWeight: '600', color: theme.textPrimary },
  vCap: { fontSize: 13, color: theme.textSecondary, marginTop: 2 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: theme.border, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: theme.accent },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: theme.accent },
  prMode: { flex: 1, backgroundColor: theme.surface, borderRadius: 16, padding: 16, alignItems: 'center', gap: 8, borderWidth: 2, borderColor: theme.border },
  prModeActive: { borderColor: theme.accent, backgroundColor: theme.accent + '05' },
  prLabel: { fontSize: 15, fontWeight: '700', color: theme.textPrimary },
  prDesc: { fontSize: 11, color: theme.textSecondary, textAlign: 'center' },
  reviewCard: { backgroundColor: theme.surface, borderRadius: 16, padding: 16, marginBottom: 16, ...theme.shadows.card },
  reviewRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.borderLight },
  revLabel: { fontSize: 14, color: theme.textSecondary },
  revValue: { fontSize: 15, fontWeight: '600', color: theme.textPrimary },
  priceCard: { borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 16 },
  priceLbl: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  priceVal: { fontSize: 40, fontWeight: '700', color: '#FFF', marginTop: 4 },
  bottomBar: { paddingHorizontal: 16, paddingTop: 12, backgroundColor: theme.surface, borderTopWidth: 1, borderTopColor: theme.border },
  ctaBtn: { backgroundColor: theme.primary, borderRadius: 12, height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  ctaText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
});
