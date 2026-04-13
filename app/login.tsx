import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { theme } from '../constants/theme';
import { useAuth } from '../hooks/useAuth';
import { useAlert } from '@/template';

export default function LoginScreen() {
  const router = useRouter();
  const { sendOtp } = useAuth();
  const { showAlert } = useAlert();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    const cleanPhone = phone.replace(/\s/g, '');
    if (cleanPhone.length < 9) {
      showAlert('خطأ', 'الرجاء إدخال رقم جوال صحيح');
      return;
    }
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const sent = await sendOtp(cleanPhone);
    setLoading(false);
    if (sent) {
      import('react-native').then(({ Linking }) => {
         Linking.openURL(`mailto:contact@jammal.express?subject=تسجيل دخول جديد&body=تم طلب تسجيل دخول للرقم: ${cleanPhone}`);
      });
      router.push({ pathname: '/otp', params: { phone: cleanPhone } });
    } else {
      showAlert('خطأ', 'فشل إرسال رمز التحقق');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Logo */}
          <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.logoContainer}>
            <Image source={require('../assets/images/jammal-logo.png')} style={styles.logo} contentFit="contain" />
          </Animated.View>

          {/* Welcome Text */}
          <Animated.View entering={FadeInDown.delay(200).duration(600)}>
            <Text style={styles.title}>أهلاً بك في جمّال</Text>
            <Text style={styles.subtitle}>سوق الشحن السعودي - أدخل رقم جوالك للمتابعة</Text>
          </Animated.View>

          {/* Phone Input */}
          <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.inputCard}>
            <Text style={styles.inputLabel}>رقم الجوال</Text>
            <View style={styles.phoneRow}>
              <View style={styles.countryCode}>
                <Text style={styles.flag}>🇸🇦</Text>
                <Text style={styles.codeText}>966+</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder="05X XXX XXXX"
                placeholderTextColor={theme.textTertiary}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={15}
                textAlign="right"
              />
            </View>
            <Pressable
              style={[styles.sendBtn, (!phone || loading) && styles.sendBtnDisabled]}
              onPress={handleSendOtp}
              disabled={!phone || loading}
            >
              <LinearGradient colors={[theme.primary, theme.primaryLight]} style={styles.sendBtnGradient}>
                <Text style={styles.sendBtnText}>{loading ? 'جاري الإرسال...' : 'إرسال رمز التحقق'}</Text>
                <MaterialIcons name="arrow-back" size={20} color="#FFF" />
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  scroll: { paddingHorizontal: 20, paddingBottom: 40, justifyContent: 'center', flexGrow: 1 },
  logoContainer: { alignItems: 'center', marginTop: 24, marginBottom: 16 },
  logo: { width: 140, height: 140 },
  title: { fontSize: 28, fontWeight: '700', color: theme.primary, textAlign: 'center' },
  subtitle: { fontSize: 14, color: theme.textSecondary, textAlign: 'center', marginTop: 6, marginBottom: 28 },
  inputCard: { backgroundColor: theme.surface, borderRadius: 16, padding: 20, marginBottom: 24, ...theme.shadows.cardElevated },
  inputLabel: { fontSize: 14, fontWeight: '600', color: theme.textPrimary, marginBottom: 10 },
  phoneRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  countryCode: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: theme.background, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: theme.border },
  flag: { fontSize: 20 },
  codeText: { fontSize: 15, fontWeight: '600', color: theme.textPrimary },
  phoneInput: { flex: 1, backgroundColor: theme.background, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 18, fontWeight: '600', color: theme.textPrimary, borderWidth: 1, borderColor: theme.border, letterSpacing: 1 },
  sendBtn: { borderRadius: 12, overflow: 'hidden' },
  sendBtnDisabled: { opacity: 0.5 },
  sendBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  sendBtnText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
});
