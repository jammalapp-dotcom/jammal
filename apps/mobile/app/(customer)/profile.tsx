// @ts-nocheck
// شاشة الملف الشخصي للعميل - منقولة من Jammal-9b5eqc-main
import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { theme } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../contexts/AppContext';
import { useAlert } from '@/template';

export default function CustomerProfileScreen() {
    const insets = useSafeAreaInsets(); const router = useRouter(); const { user, logout } = useAuth(); const { walletBalance, walletTransactions, shipments } = useApp(); const { showAlert } = useAlert();
    const completed = shipments.filter((s) => s.status === 'delivered').length;
    const active = shipments.filter((s) => !['delivered', 'disputed', 'draft'].includes(s.status)).length;
    const handleLogout = () => { logout(); router.replace('/login'); };
    const settings = [
        { icon: 'person', label: 'الملف الشخصي', desc: user?.nameEn || '', onPress: () => showAlert('الملف الشخصي', `الاسم: ${user?.name}\nالبريد: ${user?.email}\nالهاتف: ${user?.phone}`) },
        { icon: 'business', label: 'بيانات المنشأة', desc: user?.companyEn || 'شخصي', onPress: () => showAlert('بيانات المنشأة', `الشركة: ${user?.company || 'حساب شخصي'}`) },
        { icon: 'verified-user', label: 'التحقق', desc: user?.verified ? 'موثق ✓' : 'غير موثق', onPress: () => showAlert('التحقق', user?.verified ? 'حسابك موثق ✓' : 'يرجى رفع الوثائق المطلوبة للتوثيق') },
        { icon: 'notifications', label: 'الإشعارات', desc: 'إدارة الإشعارات', onPress: () => router.push('/notifications') },
        { icon: 'help-outline', label: 'المساعدة', desc: 'تواصل معنا', onPress: () => showAlert('المساعدة', 'تواصل معنا:\nالهاتف: 920000000\nالبريد: support@jammal.sa') },
    ];
    return (
        <SafeAreaView edges={['top']} style={styles.container}>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: insets.bottom + 16 }} showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeInDown.delay(100).duration(500)}>
                    <LinearGradient colors={[theme.primary, theme.primaryLight]} style={styles.profileHeader}>
                        <View style={{ position: 'absolute', top: 16, right: 16 }}><Image source={require('../../assets/images/jammal_logo_mini.png')} style={{ width: 44, height: 44 }} contentFit="contain" /></View>
                        <View style={styles.avatar}><Text style={styles.avatarText}>{user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2)}</Text></View>
                        <Text style={styles.profileName}>{user?.name}</Text>
                        <Text style={styles.profileCompany}>{user?.company || 'حساب شخصي'}</Text>
                        <View style={styles.statsRow}><View style={styles.stat}><Text style={styles.statVal}>{user?.rating || 0}</Text><Text style={styles.statLbl}>التقييم</Text></View><View style={styles.statDiv} /><View style={styles.stat}><Text style={styles.statVal}>{completed}</Text><Text style={styles.statLbl}>مكتملة</Text></View><View style={styles.statDiv} /><View style={styles.stat}><Text style={styles.statVal}>{active}</Text><Text style={styles.statLbl}>نشطة</Text></View></View>
                    </LinearGradient>
                </Animated.View>
                <Animated.View entering={FadeInDown.delay(200).duration(500)}>
                    <View style={styles.walletCard}>
                        <View style={styles.walletRow}><View><Text style={styles.walletLabel}>رصيد المحفظة</Text><Text style={styles.walletVal}>{walletBalance.toLocaleString()} <Text style={styles.walletCur}>ر.س</Text></Text></View><Pressable style={styles.walletBtn} onPress={() => showAlert('شحن المحفظة', 'ستكون متاحة قريباً')}><MaterialIcons name="add" size={20} color={theme.accent} /><Text style={styles.walletBtnText}>شحن</Text></Pressable></View>
                        <View style={styles.divider} /><Text style={styles.txTitle}>آخر المعاملات</Text>
                        {walletTransactions.slice(0, 4).map((tx) => (<View key={tx.id} style={styles.txRow}><View style={[styles.txIcon, { backgroundColor: tx.type === 'refund' ? theme.successLight : theme.errorLight }]}><MaterialIcons name={tx.type === 'refund' ? 'keyboard-return' : 'payment'} size={18} color={tx.type === 'refund' ? theme.success : theme.error} /></View><View style={{ flex: 1 }}><Text style={styles.txDesc}>{tx.descriptionAr}</Text><Text style={styles.txDate}>{tx.date}</Text></View><Text style={[styles.txAmt, { color: tx.amount > 0 ? theme.success : theme.textPrimary }]}>{tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} ر.س</Text></View>))}
                    </View>
                </Animated.View>
                <Animated.View entering={FadeInDown.delay(300).duration(500)}>
                    <View style={styles.settingsCard}>{settings.map((s, i) => (<Pressable key={s.label} style={[styles.settingsRow, i < settings.length - 1 && styles.settingsRowBorder]} onPress={s.onPress}><View style={styles.settingsIcon}><MaterialIcons name={s.icon as any} size={22} color={theme.primary} /></View><View style={{ flex: 1 }}><Text style={styles.settingsLabel}>{s.label}</Text><Text style={styles.settingsDesc}>{s.desc}</Text></View><MaterialIcons name="arrow-back-ios" size={16} color={theme.textTertiary} /></Pressable>))}</View>
                </Animated.View>
                <Pressable style={styles.logoutBtn} onPress={handleLogout}><MaterialIcons name="logout" size={20} color={theme.error} /><Text style={styles.logoutText}>تسجيل الخروج</Text></Pressable>
            </ScrollView>
        </SafeAreaView>);
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background }, profileHeader: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 28, alignItems: 'center' },
    avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)', marginBottom: 12 },
    avatarText: { fontSize: 28, fontWeight: '700', color: '#FFF' }, profileName: { fontSize: 22, fontWeight: '700', color: '#FFF' }, profileCompany: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
    statsRow: { flexDirection: 'row', marginTop: 20, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, paddingVertical: 14, paddingHorizontal: 20 },
    stat: { flex: 1, alignItems: 'center' }, statVal: { fontSize: 20, fontWeight: '700', color: '#FFF' }, statLbl: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }, statDiv: { width: 1, backgroundColor: 'rgba(255,255,255,0.15)' },
    walletCard: { backgroundColor: theme.surface, borderRadius: 16, marginHorizontal: 16, marginTop: -16, padding: 16, ...theme.shadows.cardElevated },
    walletRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, walletLabel: { fontSize: 12, color: theme.textSecondary },
    walletVal: { fontSize: 24, fontWeight: '700', color: theme.textPrimary, marginTop: 2 }, walletCur: { fontSize: 14, fontWeight: '500', color: theme.textSecondary },
    walletBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: theme.accent + '15', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
    walletBtnText: { fontSize: 13, fontWeight: '600', color: theme.accent }, divider: { height: 1, backgroundColor: theme.borderLight, marginVertical: 14 },
    txTitle: { fontSize: 14, fontWeight: '600', color: theme.textSecondary, marginBottom: 10 }, txRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
    txIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }, txDesc: { fontSize: 14, fontWeight: '500', color: theme.textPrimary },
    txDate: { fontSize: 12, color: theme.textTertiary, marginTop: 2 }, txAmt: { fontSize: 14, fontWeight: '700' },
    settingsCard: { backgroundColor: theme.surface, borderRadius: 16, marginHorizontal: 16, marginTop: 16, ...theme.shadows.card },
    settingsRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 }, settingsRowBorder: { borderBottomWidth: 1, borderBottomColor: theme.borderLight },
    settingsIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: theme.primary + '08', alignItems: 'center', justifyContent: 'center' },
    settingsLabel: { fontSize: 15, fontWeight: '600', color: theme.textPrimary }, settingsDesc: { fontSize: 12, color: theme.textSecondary, marginTop: 2 },
    logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 16, marginTop: 24, paddingVertical: 14, backgroundColor: theme.errorLight, borderRadius: 12 },
    logoutText: { fontSize: 15, fontWeight: '600', color: theme.error },
});
