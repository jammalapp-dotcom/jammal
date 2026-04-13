import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { theme } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';
import { useAlert } from '@/template';

export default function BrokerProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { showAlert } = useAlert();
  const handleLogout = () => { logout(); router.replace('/login'); };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 16 }} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={[theme.primary, theme.primaryLight]} style={styles.header}>
          <View style={{ position: 'absolute', top: 16, right: 16 }}>
            <Image source={require('../../assets/images/jammal_logo_mini.png')} style={{ width: 44, height: 44 }} contentFit="contain" />
          </View>
          <View style={styles.avatar}><MaterialIcons name="business" size={32} color="#FFF" /></View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.company}>{user?.company}</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}><Text style={styles.sV}>{user?.fleetSize || 15}</Text><Text style={styles.sL}>أسطول</Text></View>
            <View style={styles.sD} />
            <View style={styles.stat}><Text style={styles.sV}>{user?.totalShipments || 312}</Text><Text style={styles.sL}>شحنة</Text></View>
            <View style={styles.sD} />
            <View style={styles.stat}><Text style={styles.sV}>{user?.rating}</Text><Text style={styles.sL}>تقييم</Text></View>
          </View>
        </LinearGradient>
        <View style={styles.settingsCard}>
          {[
            { icon: 'person', label: 'الملف الشخصي', desc: user?.nameEn || '', onPress: () => showAlert('الملف الشخصي', `الاسم: ${user?.name}\nالهاتف: ${user?.phone}\nالبريد: ${user?.email}`) },
            { icon: 'business', label: 'بيانات الشركة', desc: user?.companyEn || '', onPress: () => showAlert('بيانات الشركة', `الشركة: ${user?.company}\nحجم الأسطول: ${user?.fleetSize || 0}`) },
            { icon: 'account-balance-wallet', label: 'المحفظة', desc: `${user?.walletBalance?.toLocaleString() || 0} ر.س`, onPress: () => showAlert('المحفظة', `الرصيد: ${user?.walletBalance?.toLocaleString() || 0} ر.س\n\nخاصية السحب ستكون متاحة قريباً`) },
            { icon: 'analytics', label: 'التقارير المالية', desc: 'عرض التقارير', onPress: () => showAlert('التقارير المالية', 'التقارير المالية المفصلة ستكون متاحة قريباً') },
            { icon: 'notifications', label: 'الإشعارات', desc: 'مفعلة', onPress: () => router.push('/notifications') },
            { icon: 'help-outline', label: 'المساعدة', desc: 'تواصل معنا', onPress: () => showAlert('المساعدة', 'تواصل معنا:\n\nالهاتف: 920000000\nالبريد: contact@jammal.express') },
          ].map((it, i, arr) => (
            <Pressable key={it.label} style={[styles.row, i < arr.length - 1 && styles.rowBorder]} onPress={it.onPress}>
              <View style={styles.icon}><MaterialIcons name={it.icon as any} size={22} color={theme.primary} /></View>
              <View style={{ flex: 1 }}><Text style={styles.label}>{it.label}</Text><Text style={styles.desc}>{it.desc}</Text></View>
              <MaterialIcons name="arrow-back-ios" size={16} color={theme.textTertiary} />
            </Pressable>
          ))}
        </View>
        <Pressable style={styles.logoutBtn} onPress={handleLogout}><MaterialIcons name="logout" size={20} color={theme.error} /><Text style={styles.logoutText}>تسجيل الخروج</Text></Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  header: { paddingTop: 24, paddingBottom: 28, alignItems: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  name: { fontSize: 22, fontWeight: '700', color: '#FFF' },
  company: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  statsRow: { flexDirection: 'row', marginTop: 20, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, paddingVertical: 14, paddingHorizontal: 20 },
  stat: { flex: 1, alignItems: 'center' },
  sV: { fontSize: 20, fontWeight: '700', color: '#FFF' },
  sL: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  sD: { width: 1, backgroundColor: 'rgba(255,255,255,0.15)' },
  settingsCard: { backgroundColor: theme.surface, borderRadius: 16, marginHorizontal: 16, marginTop: -16, ...theme.shadows.card },
  row: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: theme.borderLight },
  icon: { width: 40, height: 40, borderRadius: 10, backgroundColor: theme.primary + '08', alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 15, fontWeight: '600', color: theme.textPrimary },
  desc: { fontSize: 12, color: theme.textSecondary, marginTop: 2 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 16, marginTop: 24, paddingVertical: 14, backgroundColor: theme.errorLight, borderRadius: 12 },
  logoutText: { fontSize: 15, fontWeight: '600', color: theme.error },
});
