// ============================================================================
// JAMMAL — Login Screen
// Phone/email + password login with role-based redirect
// ============================================================================

import { useState } from 'react';
import {
    View, Text, TextInput, Pressable, StyleSheet,
    KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../src/stores/auth.store';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function LoginScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { login, isAuthenticated, user } = useAuthStore();

    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!identifier.trim() || !password.trim()) {
            setError(t('common.error'));
            return;
        }
        setLoading(true);
        setError('');
        try {
            const result = await login(identifier.trim(), password);
            if (result?.data?.requiresOtp) {
                router.push({
                    pathname: '/(auth)/verify-otp',
                    params: { purpose: 'login' },
                });
            } else if (result?.data?.accessToken) {
                const userType = result.data.user.userType;
                if (userType === 'customer') router.replace('/(customer)/');
                else if (userType === 'driver') router.replace('/(driver)/');
                else if (userType === 'broker') router.replace('/(broker)/');
            }
        } catch (err: any) {
            setError(err?.error?.message || t('common.error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.scroll}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backBtn}>
                        <Text style={styles.backText}>←</Text>
                    </Pressable>
                    <Text style={styles.title}>{t('auth.login')}</Text>
                    <Text style={styles.subtitle}>
                        {t('auth.noAccount')}{' '}
                        <Text
                            style={styles.link}
                            onPress={() => router.push('/(auth)/register')}
                        >
                            {t('auth.register')}
                        </Text>
                    </Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    {error ? (
                        <View style={styles.errorBox}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    <Text style={styles.label}>{t('auth.phone')} / {t('auth.email')}</Text>
                    <TextInput
                        style={styles.input}
                        value={identifier}
                        onChangeText={setIdentifier}
                        placeholder={t('auth.phonePlaceholder')}
                        placeholderTextColor={colors.textMuted}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        textAlign="right"
                    />

                    <Text style={styles.label}>{t('auth.password')}</Text>
                    <View style={styles.passwordRow}>
                        <TextInput
                            style={[styles.input, { flex: 1 }]}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            placeholder="••••••••"
                            placeholderTextColor={colors.textMuted}
                            textAlign="right"
                        />
                        <Pressable
                            onPress={() => setShowPassword(!showPassword)}
                            style={styles.eyeBtn}
                        >
                            <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁'}</Text>
                        </Pressable>
                    </View>

                    <Pressable onPress={() => router.push('/(auth)/forgot-password')}>
                        <Text style={styles.forgotText}>{t('auth.forgotPassword')}</Text>
                    </Pressable>

                    <Pressable
                        style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.submitText}>{t('auth.login')}</Text>
                        )}
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { flexGrow: 1, paddingHorizontal: spacing.xl, paddingTop: 60 },
    header: { marginBottom: spacing.xl },
    backBtn: { marginBottom: spacing.md },
    backText: { fontSize: 28, color: colors.primary },
    title: { ...typography.h1, color: colors.text, marginBottom: spacing.xs },
    subtitle: { ...typography.body, color: colors.textSecondary },
    link: { color: colors.primary, fontWeight: '600' },
    form: { flex: 1 },
    errorBox: {
        backgroundColor: '#FEF2F2',
        borderRadius: borderRadius.sm,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    errorText: { color: colors.error, fontSize: 14 },
    label: {
        ...typography.bodySmall,
        color: colors.text,
        fontWeight: '600',
        marginBottom: spacing.xs,
        marginTop: spacing.md,
    },
    input: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.sm,
        paddingHorizontal: spacing.md,
        paddingVertical: 14,
        fontSize: 16,
        color: colors.text,
    },
    passwordRow: { flexDirection: 'row', alignItems: 'center' },
    eyeBtn: { position: 'absolute', right: 12, padding: 8 },
    eyeText: { fontSize: 20 },
    forgotText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'left',
        marginTop: spacing.sm,
        marginBottom: spacing.xl,
    },
    submitBtn: {
        backgroundColor: colors.primary,
        paddingVertical: 16,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        marginTop: spacing.md,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    submitBtnDisabled: { opacity: 0.6 },
    submitText: { ...typography.button, color: colors.textInverse },
});
