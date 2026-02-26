// ============================================================================
// JAMMAL — Forgot Password Screen
// ============================================================================

import { useState } from 'react';
import {
    View, Text, TextInput, Pressable, StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSend = async () => {
        if (!phone.trim()) return;
        setLoading(true);
        // TODO: integrate with password reset endpoint
        setTimeout(() => {
            setLoading(false);
            setSent(true);
        }, 1500);
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <Text style={styles.backText}>←</Text>
                </Pressable>
                <Text style={styles.title}>{t('auth.forgotPassword')}</Text>
                <Text style={styles.subtitle}>
                    أدخل رقم جوالك وسنرسل لك رمز إعادة تعيين كلمة المرور
                </Text>

                {!sent ? (
                    <>
                        <Text style={styles.label}>{t('auth.phone')}</Text>
                        <TextInput
                            style={styles.input}
                            value={phone}
                            onChangeText={setPhone}
                            placeholder={t('auth.phonePlaceholder')}
                            placeholderTextColor={colors.textMuted}
                            keyboardType="phone-pad"
                            textAlign="right"
                        />
                        <Pressable
                            style={[styles.btn, (!phone.trim() || loading) && styles.btnDisabled]}
                            onPress={handleSend}
                            disabled={!phone.trim() || loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.btnText}>إرسال رمز التحقق</Text>
                            )}
                        </Pressable>
                    </>
                ) : (
                    <View style={styles.successBox}>
                        <Text style={styles.successIcon}>✅</Text>
                        <Text style={styles.successText}>
                            تم إرسال رمز إعادة التعيين إلى {phone}
                        </Text>
                        <Pressable
                            style={styles.btn}
                            onPress={() => router.push('/(auth)/login')}
                        >
                            <Text style={styles.btnText}>{t('auth.login')}</Text>
                        </Pressable>
                    </View>
                )}
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
    label: { ...typography.bodySmall, color: colors.text, fontWeight: '600', marginBottom: spacing.xs },
    input: {
        backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
        borderRadius: borderRadius.sm, paddingHorizontal: spacing.md, paddingVertical: 14,
        fontSize: 16, color: colors.text,
    },
    btn: {
        backgroundColor: colors.primary, paddingVertical: 16,
        borderRadius: borderRadius.md, alignItems: 'center', marginTop: spacing.xl,
    },
    btnDisabled: { opacity: 0.4 },
    btnText: { ...typography.button, color: colors.textInverse },
    successBox: { alignItems: 'center', marginTop: spacing.xxl },
    successIcon: { fontSize: 48, marginBottom: spacing.md },
    successText: { ...typography.body, color: colors.text, textAlign: 'center', marginBottom: spacing.lg },
});
