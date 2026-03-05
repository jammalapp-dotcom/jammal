import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { theme } from '../constants/theme';
import { useAuth } from '../hooks/useAuth';
import { useAlert } from '@/template';

export default function OtpScreen() {
    const router = useRouter();
    const { phone } = useLocalSearchParams<{ phone: string }>();
    const { verifyOtp, otpTimer, sendOtp } = useAuth();
    const { showAlert } = useAlert();
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef<(TextInput | null)[]>([]);

    useEffect(() => { setTimeout(() => inputRefs.current[0]?.focus(), 500); }, []);

    const handleCodeChange = (index: number, value: string) => {
        if (value.length > 1) value = value[value.length - 1];
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
        if (value && index < 5) inputRefs.current[index + 1]?.focus();
        if (newCode.every((c) => c) && newCode.join('').length === 6) handleVerify(newCode.join(''));
    };

    const handleKeyPress = (index: number, key: string) => {
        if (key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
            const newCode = [...code]; newCode[index - 1] = ''; setCode(newCode);
        }
    };

    const handleVerify = async (otpCode: string) => {
        setLoading(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        const result = await verifyOtp(otpCode);
        setLoading(false);
        if (result.success) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            switch (result.role) {
                case 'driver': router.replace('/(driver)'); break;
                case 'broker': router.replace('/(broker)'); break;
                case 'manager': router.replace('/(manager)'); break;
                default: router.replace('/(customer)'); break;
            }
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            showAlert('خطأ', 'رمز التحقق غير صحيح. تأكد من إدخال 6 أرقام');
            setCode(['', '', '', '', '', '']); inputRefs.current[0]?.focus();
        }
    };

    const handleResend = () => {
        if (otpTimer > 0) return;
        sendOtp(phone || ''); Haptics.selectionAsync();
        showAlert('تم', 'تم إعادة إرسال رمز التحقق');
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <View style={styles.content}>
                    <Pressable onPress={() => router.back()} style={styles.backBtn}><MaterialIcons name="arrow-forward" size={24} color={theme.textPrimary} /></Pressable>
                    <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.headerSection}>
                        <View style={styles.iconCircle}><MaterialIcons name="sms" size={36} color={theme.accent} /></View>
                        <Text style={styles.title}>رمز التحقق</Text>
                        <Text style={styles.subtitle}>تم إرسال رمز مكون من ٦ أرقام إلى</Text>
                        <Text style={styles.phoneText}>{phone || ''}</Text>
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.otpRow}>
                        {code.map((digit, idx) => (
                            <TextInput key={idx} ref={(ref) => { inputRefs.current[idx] = ref; }} style={[styles.otpInput, digit ? styles.otpInputFilled : null]} value={digit} onChangeText={(v) => handleCodeChange(idx, v)} onKeyPress={(e) => handleKeyPress(idx, e.nativeEvent.key)} keyboardType="number-pad" maxLength={1} selectTextOnFocus />
                        ))}
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.timerSection}>
                        {otpTimer > 0 ? <Text style={styles.timerText}>إعادة الإرسال بعد {otpTimer} ثانية</Text> : <Pressable onPress={handleResend}><Text style={styles.resendText}>إعادة إرسال الرمز</Text></Pressable>}
                    </Animated.View>
                    {loading && <View style={styles.loadingRow}><Text style={styles.loadingText}>جاري التحقق...</Text></View>}
                    <View style={styles.hintCard}><MaterialIcons name="info-outline" size={18} color={theme.info} /><Text style={styles.hintText}>أدخل رمز التحقق المكون من ٦ أرقام المرسل إلى جوالك</Text></View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    content: { flex: 1, paddingHorizontal: 20 },
    backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
    headerSection: { alignItems: 'center', marginTop: 24, marginBottom: 36 },
    iconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: theme.accent + '15', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    title: { fontSize: 26, fontWeight: '700', color: theme.primary },
    subtitle: { fontSize: 14, color: theme.textSecondary, marginTop: 8 },
    phoneText: { fontSize: 18, fontWeight: '700', color: theme.primary, marginTop: 4, letterSpacing: 1 },
    otpRow: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
    otpInput: { width: 45, height: 55, borderRadius: 12, borderWidth: 2, borderColor: theme.border, backgroundColor: theme.surface, fontSize: 24, fontWeight: '700', color: theme.primary, textAlign: 'center' },
    otpInputFilled: { borderColor: theme.accent, backgroundColor: theme.accent + '08' },
    timerSection: { alignItems: 'center', marginTop: 24 },
    timerText: { fontSize: 14, color: theme.textSecondary },
    resendText: { fontSize: 15, fontWeight: '600', color: theme.accent },
    loadingRow: { alignItems: 'center', marginTop: 20 },
    loadingText: { fontSize: 14, color: theme.accent, fontWeight: '600' },
    hintCard: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: theme.infoLight, borderRadius: 12, padding: 14, position: 'absolute', bottom: 40, left: 20, right: 20 },
    hintText: { fontSize: 13, color: theme.info, fontWeight: '500', flex: 1 },
});
