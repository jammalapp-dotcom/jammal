// ============================================================================
// JAMMAL — Registration Screen (Multi-step)
// Step 1: Role selection → Step 2: Personal info → Step 3: Role-specific
// ============================================================================

import { useState } from 'react';
import {
    View, Text, TextInput, Pressable, StyleSheet,
    KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../src/stores/auth.store';
import { colors, spacing, typography, borderRadius } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';

type Role = 'customer' | 'driver' | 'broker';

const STEPS = ['role', 'info', 'extras'] as const;

export default function RegisterScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { register: signUp } = useAuthStore();

    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form data
    const [role, setRole] = useState<Role>('customer');
    const [fullNameEn, setFullNameEn] = useState('');
    const [fullNameAr, setFullNameAr] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Driver extras
    const [driverLicenseNumber, setDriverLicenseNumber] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [vehicleType, setVehicleType] = useState('pickup');
    const [capacityKg, setCapacityKg] = useState('1000');

    // Broker extras
    const [companyNameEn, setCompanyNameEn] = useState('');
    const [companyNameAr, setCompanyNameAr] = useState('');
    const [commercialRegistration, setCommercialRegistration] = useState('');

    const [acceptTerms, setAcceptTerms] = useState(false);
    const [acceptPrivacy, setAcceptPrivacy] = useState(false);

    const canProceedStep0 = role !== null;
    const canProceedStep1 = fullNameEn && fullNameAr && email && phone && password && password === confirmPassword;
    const canProceedStep2 = role === 'customer'
        ? (acceptTerms && acceptPrivacy)
        : role === 'driver'
            ? (driverLicenseNumber && licensePlate && acceptTerms && acceptPrivacy)
            : (companyNameEn && companyNameAr && commercialRegistration && acceptTerms && acceptPrivacy);

    const handleNext = () => {
        if (step === 0 && canProceedStep0) setStep(1);
        else if (step === 1 && canProceedStep1) {
            if (role === 'customer') setStep(2);
            else setStep(2);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            const body: any = {
                userType: role,
                fullNameEn, fullNameAr,
                email, phone, password,
                locale: 'ar',
                acceptTerms: true,
                acceptPrivacy: true,
            };
            if (role === 'driver') {
                body.driverLicenseNumber = driverLicenseNumber;
                body.licensePlate = licensePlate;
                body.vehicleType = vehicleType;
                body.capacityKg = parseInt(capacityKg) || 1000;
            }
            if (role === 'broker') {
                body.companyNameEn = companyNameEn;
                body.companyNameAr = companyNameAr;
                body.commercialRegistration = commercialRegistration;
            }

            await signUp(body);
            router.push({
                pathname: '/(auth)/verify-otp',
                params: { purpose: 'registration' },
            });
        } catch (err: any) {
            setError(err?.error?.message || err?.message || t('common.error'));
        } finally {
            setLoading(false);
        }
    };

    const roleOptions: { key: Role; icon: string; labelAr: string; labelEn: string }[] = [
        { key: 'customer', icon: 'cube-outline', labelAr: 'عميل / شاحن', labelEn: 'Customer' },
        { key: 'driver', icon: 'car-outline', labelAr: 'سائق / مالك شاحنة', labelEn: 'Driver' },
        { key: 'broker', icon: 'business-outline', labelAr: 'وسيط شحن', labelEn: 'Broker' },
    ];

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                {/* Header */}
                <View style={styles.header}>
                    <Pressable onPress={() => step > 0 ? setStep(step - 1) : router.back()} style={styles.backBtn}>
                        <Text style={styles.backText}>←</Text>
                    </Pressable>
                    <Text style={styles.title}>{t('auth.register')}</Text>

                    {/* Progress dots */}
                    <View style={styles.progressRow}>
                        {STEPS.map((_, i) => (
                            <View
                                key={i}
                                style={[styles.dot, i <= step && styles.dotActive]}
                            />
                        ))}
                    </View>
                </View>

                {error ? (
                    <View style={styles.errorBox}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : null}

                {/* STEP 0: Role Selection */}
                {step === 0 && (
                    <View style={styles.form}>
                        <Text style={styles.sectionTitle}>{t('auth.selectRole')}</Text>
                        {roleOptions.map((opt) => (
                            <Pressable
                                key={opt.key}
                                style={[styles.roleCard, role === opt.key && styles.roleCardActive]}
                                onPress={() => setRole(opt.key)}
                            >
                                <Ionicons
                                    name={opt.icon as any}
                                    size={28}
                                    color={role === opt.key ? colors.primary : colors.textMuted}
                                />
                                <View style={styles.roleTextCol}>
                                    <Text style={[styles.roleLabel, role === opt.key && styles.roleLabelActive]}>
                                        {opt.labelAr}
                                    </Text>
                                    <Text style={styles.roleSub}>{opt.labelEn}</Text>
                                </View>
                                {role === opt.key && (
                                    <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                                )}
                            </Pressable>
                        ))}
                        <Pressable
                            style={[styles.nextBtn, !canProceedStep0 && styles.btnDisabled]}
                            onPress={handleNext}
                            disabled={!canProceedStep0}
                        >
                            <Text style={styles.nextBtnText}>{t('common.next')}</Text>
                        </Pressable>
                    </View>
                )}

                {/* STEP 1: Personal Info */}
                {step === 1 && (
                    <View style={styles.form}>
                        <Text style={styles.sectionTitle}>{t('auth.fullNameAr')}</Text>
                        <TextInput style={styles.input} value={fullNameAr} onChangeText={setFullNameAr} placeholder="الاسم الكامل" placeholderTextColor={colors.textMuted} textAlign="right" />

                        <Text style={styles.label}>{t('auth.fullNameEn')}</Text>
                        <TextInput style={styles.input} value={fullNameEn} onChangeText={setFullNameEn} placeholder="Full Name" placeholderTextColor={colors.textMuted} />

                        <Text style={styles.label}>{t('auth.email')}</Text>
                        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="email@example.com" placeholderTextColor={colors.textMuted} keyboardType="email-address" autoCapitalize="none" />

                        <Text style={styles.label}>{t('auth.phone')}</Text>
                        <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="+966 5XX XXX XXXX" placeholderTextColor={colors.textMuted} keyboardType="phone-pad" />

                        <Text style={styles.label}>{t('auth.password')}</Text>
                        <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" placeholderTextColor={colors.textMuted} />

                        <Text style={styles.label}>{t('auth.confirmPassword')}</Text>
                        <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry placeholder="••••••••" placeholderTextColor={colors.textMuted} />
                        {password && confirmPassword && password !== confirmPassword && (
                            <Text style={styles.errorText}>كلمات المرور غير متطابقة</Text>
                        )}

                        <Pressable
                            style={[styles.nextBtn, !canProceedStep1 && styles.btnDisabled]}
                            onPress={handleNext}
                            disabled={!canProceedStep1}
                        >
                            <Text style={styles.nextBtnText}>{t('common.next')}</Text>
                        </Pressable>
                    </View>
                )}

                {/* STEP 2: Extras + Terms */}
                {step === 2 && (
                    <View style={styles.form}>
                        {role === 'driver' && (
                            <>
                                <Text style={styles.sectionTitle}>بيانات السائق</Text>
                                <Text style={styles.label}>رقم رخصة القيادة</Text>
                                <TextInput style={styles.input} value={driverLicenseNumber} onChangeText={setDriverLicenseNumber} placeholder="رقم الرخصة" placeholderTextColor={colors.textMuted} textAlign="right" />

                                <Text style={styles.label}>لوحة المركبة</Text>
                                <TextInput style={styles.input} value={licensePlate} onChangeText={setLicensePlate} placeholder="ABC 1234" placeholderTextColor={colors.textMuted} />

                                <Text style={styles.label}>سعة الحمولة (كجم)</Text>
                                <TextInput style={styles.input} value={capacityKg} onChangeText={setCapacityKg} keyboardType="numeric" placeholderTextColor={colors.textMuted} />
                            </>
                        )}

                        {role === 'broker' && (
                            <>
                                <Text style={styles.sectionTitle}>بيانات الشركة</Text>
                                <Text style={styles.label}>اسم الشركة (عربي)</Text>
                                <TextInput style={styles.input} value={companyNameAr} onChangeText={setCompanyNameAr} placeholderTextColor={colors.textMuted} textAlign="right" />

                                <Text style={styles.label}>اسم الشركة (إنجليزي)</Text>
                                <TextInput style={styles.input} value={companyNameEn} onChangeText={setCompanyNameEn} placeholderTextColor={colors.textMuted} />

                                <Text style={styles.label}>رقم السجل التجاري</Text>
                                <TextInput style={styles.input} value={commercialRegistration} onChangeText={setCommercialRegistration} placeholderTextColor={colors.textMuted} />
                            </>
                        )}

                        {/* Terms */}
                        <View style={styles.checkRow}>
                            <Pressable
                                style={[styles.checkbox, acceptTerms && styles.checkboxActive]}
                                onPress={() => setAcceptTerms(!acceptTerms)}
                            >
                                {acceptTerms && <Ionicons name="checkmark" size={16} color="#fff" />}
                            </Pressable>
                            <Text style={styles.checkLabel}>{t('auth.acceptTerms')}</Text>
                        </View>

                        <View style={styles.checkRow}>
                            <Pressable
                                style={[styles.checkbox, acceptPrivacy && styles.checkboxActive]}
                                onPress={() => setAcceptPrivacy(!acceptPrivacy)}
                            >
                                {acceptPrivacy && <Ionicons name="checkmark" size={16} color="#fff" />}
                            </Pressable>
                            <Text style={styles.checkLabel}>{t('auth.acceptPrivacy')}</Text>
                        </View>

                        <Pressable
                            style={[styles.nextBtn, !canProceedStep2 && styles.btnDisabled]}
                            onPress={handleSubmit}
                            disabled={!canProceedStep2 || loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.nextBtnText}>{t('auth.register')}</Text>
                            )}
                        </Pressable>

                        <Pressable onPress={() => router.push('/(auth)/login')}>
                            <Text style={styles.switchText}>
                                {t('auth.hasAccount')}{' '}
                                <Text style={styles.link}>{t('auth.login')}</Text>
                            </Text>
                        </Pressable>
                    </View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { flexGrow: 1, paddingHorizontal: spacing.xl, paddingTop: 60, paddingBottom: 40 },
    header: { marginBottom: spacing.lg },
    backBtn: { marginBottom: spacing.sm },
    backText: { fontSize: 28, color: colors.primary },
    title: { ...typography.h1, color: colors.text, marginBottom: spacing.sm },
    progressRow: { flexDirection: 'row', gap: 8, marginTop: spacing.sm },
    dot: { width: 32, height: 4, borderRadius: 2, backgroundColor: colors.border },
    dotActive: { backgroundColor: colors.primary },
    form: { flex: 1 },
    sectionTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.md },
    label: { ...typography.bodySmall, color: colors.text, fontWeight: '600', marginBottom: spacing.xs, marginTop: spacing.md },
    input: {
        backgroundColor: colors.surface,
        borderWidth: 1, borderColor: colors.border,
        borderRadius: borderRadius.sm,
        paddingHorizontal: spacing.md, paddingVertical: 14,
        fontSize: 16, color: colors.text,
    },
    roleCard: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: colors.surface, borderRadius: borderRadius.md,
        padding: spacing.md, marginBottom: spacing.sm,
        borderWidth: 2, borderColor: colors.border,
    },
    roleCardActive: { borderColor: colors.primary, backgroundColor: '#F0F4FF' },
    roleTextCol: { flex: 1, marginLeft: spacing.md },
    roleLabel: { ...typography.body, color: colors.text, fontWeight: '600' },
    roleLabelActive: { color: colors.primary },
    roleSub: { ...typography.caption, color: colors.textMuted },
    nextBtn: {
        backgroundColor: colors.primary, paddingVertical: 16,
        borderRadius: borderRadius.md, alignItems: 'center', marginTop: spacing.xl,
    },
    btnDisabled: { opacity: 0.4 },
    nextBtnText: { ...typography.button, color: colors.textInverse },
    errorBox: {
        backgroundColor: '#FEF2F2', borderRadius: borderRadius.sm,
        padding: spacing.md, marginBottom: spacing.md,
        borderWidth: 1, borderColor: '#FECACA',
    },
    errorText: { color: colors.error, fontSize: 13, marginTop: 4 },
    checkRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md },
    checkbox: {
        width: 24, height: 24, borderRadius: 6, borderWidth: 2,
        borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginRight: 10,
    },
    checkboxActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    checkLabel: { ...typography.bodySmall, color: colors.text, flex: 1 },
    switchText: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.lg },
    link: { color: colors.primary, fontWeight: '600' },
});
