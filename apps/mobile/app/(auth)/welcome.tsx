// ============================================================================
// JAMMAL — Welcome Screen
// Brand intro with language selection + login/register CTAs
// ============================================================================

import { useCallback } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
    const router = useRouter();
    const { t, i18n } = useTranslation();

    const toggleLang = useCallback(() => {
        const newLang = i18n.language === 'ar' ? 'en' : 'ar';
        i18n.changeLanguage(newLang);
    }, [i18n]);

    return (
        <View style={styles.container}>
            {/* Background gradient */}
            <View style={styles.topSection}>
                <View style={styles.languageBtn}>
                    <Pressable onPress={toggleLang} style={styles.langPill}>
                        <Text style={styles.langText}>
                            {i18n.language === 'ar' ? 'EN' : 'عربي'}
                        </Text>
                    </Pressable>
                </View>

                {/* Logo */}
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../assets/icon.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.appName}>جمّال</Text>
                    <Text style={styles.tagline}>JAMMAL</Text>
                    <Text style={styles.subtitle}>
                        {i18n.language === 'ar'
                            ? 'منصة الشحن البرّي الذكية'
                            : 'Smart Freight Platform'}
                    </Text>
                </View>
            </View>

            {/* CTA Buttons */}
            <View style={styles.bottomSection}>
                <Text style={styles.welcomeText}>
                    {i18n.language === 'ar'
                        ? 'اشحن بثقة، وسّع أعمالك'
                        : 'Ship with confidence, grow your business'}
                </Text>

                <Pressable
                    style={styles.primaryBtn}
                    onPress={() => router.push('/(auth)/login')}
                >
                    <Text style={styles.primaryBtnText}>{t('auth.login')}</Text>
                </Pressable>

                <Pressable
                    style={styles.secondaryBtn}
                    onPress={() => router.push('/(auth)/register')}
                >
                    <Text style={styles.secondaryBtnText}>{t('auth.register')}</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    topSection: {
        flex: 1.2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60,
    },
    languageBtn: {
        position: 'absolute',
        top: 60,
        right: 24,
    },
    langPill: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: borderRadius.full,
    },
    langText: {
        color: colors.textInverse,
        fontSize: 14,
        fontWeight: '600',
    },
    logoContainer: {
        alignItems: 'center',
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: spacing.md,
    },
    appName: {
        fontSize: 42,
        fontWeight: '800',
        color: colors.accent,
        letterSpacing: 2,
    },
    tagline: {
        fontSize: 18,
        fontWeight: '300',
        color: 'rgba(255,255,255,0.7)',
        letterSpacing: 8,
        marginTop: 4,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.6)',
        marginTop: spacing.md,
    },
    bottomSection: {
        flex: 0.8,
        backgroundColor: colors.surface,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.xxl,
        paddingBottom: 40,
        justifyContent: 'center',
    },
    welcomeText: {
        ...typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    primaryBtn: {
        backgroundColor: colors.primary,
        paddingVertical: 16,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        marginBottom: spacing.md,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryBtnText: {
        ...typography.button,
        color: colors.textInverse,
    },
    secondaryBtn: {
        backgroundColor: 'transparent',
        paddingVertical: 16,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.primary,
    },
    secondaryBtnText: {
        ...typography.button,
        color: colors.primary,
    },
});
