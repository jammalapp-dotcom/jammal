// ============================================================================
// JAMMAL — Profile Screen (Shared by all roles)
// ============================================================================

import { View, Text, StyleSheet, ScrollView, Pressable, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/stores/auth.store';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function ProfileScreen() {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const { user, logout } = useAuthStore();
    const isAr = i18n.language === 'ar';

    const handleLogout = () => {
        Alert.alert(
            isAr ? 'تسجيل الخروج' : 'Logout',
            isAr ? 'هل أنت متأكد؟' : 'Are you sure?',
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('common.confirm'),
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        router.replace('/(auth)/welcome');
                    },
                },
            ]
        );
    };

    const toggleLang = () => {
        i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
    };

    const menuItems = [
        { icon: 'person-outline', label: isAr ? 'تعديل الملف الشخصي' : 'Edit Profile', onPress: () => { } },
        { icon: 'notifications-outline', label: isAr ? 'الإشعارات' : 'Notifications', onPress: () => { } },
        { icon: 'language-outline', label: isAr ? 'اللغة: العربية' : 'Language: English', onPress: toggleLang },
        { icon: 'shield-outline', label: isAr ? 'الخصوصية والأمان' : 'Privacy & Security', onPress: () => { } },
        { icon: 'help-circle-outline', label: isAr ? 'المساعدة والدعم' : 'Help & Support', onPress: () => { } },
        { icon: 'document-text-outline', label: isAr ? 'الشروط والأحكام' : 'Terms & Conditions', onPress: () => { } },
        { icon: 'information-circle-outline', label: isAr ? 'حول التطبيق' : 'About', onPress: () => { } },
    ];

    return (
        <ScrollView style={styles.container}>
            {/* Profile Card */}
            <View style={styles.profileCard}>
                <View style={styles.avatar}>
                    {user?.profilePhotoUrl ? (
                        <Image source={{ uri: user.profilePhotoUrl }} style={styles.avatarImage} />
                    ) : (
                        <Ionicons name="person" size={36} color={colors.textInverse} />
                    )}
                </View>
                <Text style={styles.name}>
                    {isAr ? user?.fullNameAr : user?.fullNameEn}
                </Text>
                <Text style={styles.email}>{user?.email}</Text>
                <Text style={styles.phone}>{user?.phone}</Text>
                <View style={styles.roleBadge}>
                    <Text style={styles.roleText}>
                        {user?.userType === 'customer' ? t('auth.customer')
                            : user?.userType === 'driver' ? t('auth.driver')
                                : t('auth.broker')}
                    </Text>
                </View>
            </View>

            {/* Menu */}
            <View style={styles.menuSection}>
                {menuItems.map((item, i) => (
                    <Pressable key={i} style={styles.menuRow} onPress={item.onPress}>
                        <Ionicons name={item.icon as any} size={22} color={colors.primary} />
                        <Text style={styles.menuLabel}>{item.label}</Text>
                        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                    </Pressable>
                ))}
            </View>

            {/* Logout */}
            <Pressable style={styles.logoutBtn} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={22} color={colors.error} />
                <Text style={styles.logoutText}>{isAr ? 'تسجيل الخروج' : 'Logout'}</Text>
            </Pressable>

            <Text style={styles.version}>v1.0.0</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    profileCard: {
        backgroundColor: colors.primary, alignItems: 'center',
        paddingTop: 70, paddingBottom: spacing.xl,
        borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    },
    avatar: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md,
        borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)',
    },
    avatarImage: { width: 80, height: 80, borderRadius: 40 },
    name: { ...typography.h2, color: colors.textInverse },
    email: { ...typography.bodySmall, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
    phone: { ...typography.bodySmall, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
    roleBadge: {
        backgroundColor: colors.accent, paddingHorizontal: 16, paddingVertical: 4,
        borderRadius: borderRadius.full, marginTop: spacing.md,
    },
    roleText: { ...typography.caption, color: colors.textInverse, fontWeight: '600' },
    menuSection: { paddingHorizontal: spacing.xl, marginTop: spacing.lg },
    menuRow: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: colors.surface, borderRadius: borderRadius.sm,
        padding: spacing.md, marginBottom: spacing.xs, gap: 12,
    },
    menuLabel: { ...typography.body, color: colors.text, flex: 1 },
    logoutBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        marginHorizontal: spacing.xl, marginTop: spacing.lg,
        paddingVertical: spacing.md, borderRadius: borderRadius.sm,
        backgroundColor: '#FEF2F2', gap: 8,
    },
    logoutText: { ...typography.button, color: colors.error },
    version: { ...typography.caption, color: colors.textMuted, textAlign: 'center', marginTop: spacing.lg, marginBottom: 40 },
});
