// ============================================================================
// JAMMAL — OTP Verification Screen
// 6-digit code input with auto-submit and countdown timer
// ============================================================================

import { useState, useEffect, useRef } from 'react';
import {
    View, Text, TextInput, Pressable, StyleSheet,
    ActivityIndicator, Keyboard,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../src/stores/auth.store';
import { api } from '../../src/config/api';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

const OTP_LENGTH = 6;

export default function VerifyOtpScreen() {
    const router = useRouter();
    const { purpose } = useLocalSearchParams<{ purpose: string }>();
    const { t } = useTranslation();
    const { verifyOtp, pendingUserId, user } = useAuthStore();

    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

    // Auto-submit when 6 digits entered
    useEffect(() => {
        if (code.length === OTP_LENGTH) {
            handleVerify();
        }
    }, [code]);

    const handleVerify = async () => {
        if (code.length !== OTP_LENGTH) return;
        setLoading(true);
        setError('');
        Keyboard.dismiss();
        try {
            const result = await verifyOtp(code, purpose || 'registration');
            if (result?.data?.accessToken) {
                const userType = result.data.user.userType;
                if (userType === 'customer') router.replace('/(customer)/');
                else if (userType === 'driver') router.replace('/(driver)/');
                else if (userType === 'broker') router.replace('/(broker)/');
            }
        } catch (err: any) {
            setError(err?.error?.message || t('common.error'));
            setCode('');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (!canResend || !pendingUserId) return;
        setCanResend(false);
        setCountdown(30);
        setError('');
        try {
            await api.resendOtp(pendingUserId, purpose || 'registration');
        } catch (err: any) {
            setError(err?.error?.message || t('common.error'));
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <Text style={styles.backText}>←</Text>
                </Pressable>

                <Text style={styles.title}>{t('auth.verifyOtp')}</Text>
                <Text style={styles.subtitle}>
                    {t('auth.otpSent')}
                </Text>

                {/* OTP Input */}
                <View style={styles.otpContainer}>
                    <TextInput
                        ref={inputRef}
                        style={styles.hiddenInput}
                        value={code}
                        onChangeText={(text) => setCode(text.replace(/[^0-9]/g, '').slice(0, OTP_LENGTH))}
                        keyboardType="number-pad"
                        maxLength={OTP_LENGTH}
                        autoComplete="one-time-code"
                    />
                    <View style={styles.otpBoxes}>
                        {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                            <Pressable
                                key={i}
                                style={[
                                    styles.otpBox,
                                    code.length === i && styles.otpBoxActive,
                                    code[i] && styles.otpBoxFilled,
                                ]}
                                onPress={() => inputRef.current?.focus()}
                            >
                                <Text style={styles.otpDigit}>
                                    {code[i] || ''}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {error ? (
                    <View style={styles.errorBox}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : null}

                {loading && (
                    <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: spacing.lg }} />
                )}

                {/* Resend */}
                <View style={styles.resendRow}>
                    {canResend ? (
                        <Pressable onPress={handleResend}>
                            <Text style={styles.resendActive}>{t('auth.resendOtp')}</Text>
                        </Pressable>
                    ) : (
                        <Text style={styles.resendDisabled}>
                            {t('auth.resendIn', { seconds: countdown })}
                        </Text>
                    )}
                </View>

                <Pressable
                    style={[styles.verifyBtn, (code.length !== OTP_LENGTH || loading) && styles.btnDisabled]}
                    onPress={handleVerify}
                    disabled={code.length !== OTP_LENGTH || loading}
                >
                    <Text style={styles.verifyBtnText}>{t('common.confirm')}</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: 60 },
    backBtn: { marginBottom: spacing.md },
    backText: { fontSize: 28, color: colors.primary },
    title: { ...typography.h1, color: colors.text, marginBottom: spacing.xs },
    subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },
    otpContainer: { alignItems: 'center', marginBottom: spacing.lg },
    hiddenInput: { position: 'absolute', opacity: 0, height: 0, width: 0 },
    otpBoxes: { flexDirection: 'row', gap: 12 },
    otpBox: {
        width: 48, height: 56, borderRadius: borderRadius.sm,
        borderWidth: 2, borderColor: colors.border,
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: colors.surface,
    },
    otpBoxActive: { borderColor: colors.primary },
    otpBoxFilled: { borderColor: colors.primary, backgroundColor: '#F0F4FF' },
    otpDigit: { fontSize: 24, fontWeight: '700', color: colors.text },
    errorBox: {
        backgroundColor: '#FEF2F2', borderRadius: borderRadius.sm,
        padding: spacing.md, marginTop: spacing.md,
        borderWidth: 1, borderColor: '#FECACA',
    },
    errorText: { color: colors.error, fontSize: 14 },
    resendRow: { alignItems: 'center', marginTop: spacing.xl },
    resendActive: { color: colors.primary, fontWeight: '600', fontSize: 15 },
    resendDisabled: { color: colors.textMuted, fontSize: 15 },
    verifyBtn: {
        backgroundColor: colors.primary, paddingVertical: 16,
        borderRadius: borderRadius.md, alignItems: 'center', marginTop: spacing.xl,
    },
    btnDisabled: { opacity: 0.4 },
    verifyBtnText: { ...typography.button, color: colors.textInverse },
});
