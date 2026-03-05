import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { theme } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';
import { APP_CONFIG } from '../../constants/config';
import { useAlert } from '@/template';

export default function ManagerSettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { logout } = useAuth();
  const { showAlert } = useAlert();
  const handleLogout = () => { logout(); router.replace('/login'); };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 16 }} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8, gap: 8 }}>
          <Image source={require('../../assets/images/jammal_logo_mini.png')} style={{ width: 32, height: 32 }} contentFit="contain" />
          <Text style={[styles.title, { paddingHorizontal: 0, paddingTop: 0, paddingBottom: 0 }]}>الإعدادات</Text>
        </View>

        <Text style={styles.sectionTitle}>التسعير</Text>
        <View style={styles.card}>
          {[
            { label: 'سعر الكيلومتر', value: `${APP_CONFIG.baseRate} ر.س` },
            { label: 'الرسوم الأساسية', value: `${APP_CONFIG.baseFare} ر.س` },
            { label: 'عمولة الأفراد', value: `${APP_CONFIG.commission.individual * 100}٪` },
            { label: 'عمولة الوسطاء', value: `${APP_CONFIG.commission.broker * 100}٪` },
          ].map((r, i, a) => (
            <View key={r.label} style={[styles.row, i < a.length - 1 && styles.rowBorder]}>
              <Text style={styles.rowLabel}>{r.label}</Text><Text style={styles.rowValue}>{r.value}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>معاملات الذروة</Text>
        <View style={styles.card}>
          {Object.entries(APP_CONFIG.surgeMultipliers).map(([key, val], i, a) => (
            <View key={key} style={[styles.row, i < a.length - 1 && styles.rowBorder]}>
              <Text style={styles.rowLabel}>{key === 'ramadan' ? 'رمضان' : key === 'peakHours' ? 'ساعات الذروة' : key === 'weekend' ? 'عطلة نهاية الأسبوع' : 'عادي'}</Text>
              <Text style={styles.rowValue}>×{val}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>النظام</Text>
        <View style={styles.card}>
          {[
            { icon: 'verified-user', label: 'مراجعة الوثائق', desc: '3 معلقة' },
            { icon: 'report', label: 'إدارة النزاعات', desc: 'عرض التقارير' },
            { icon: 'tune', label: 'التسعير الديناميكي', desc: 'تعديل الأسعار' },
            { icon: 'security', label: 'PDPL الامتثال', desc: 'حماية البيانات' },
          ].map((it, i, arr) => (
            <Pressable key={it.label} style={[styles.settingRow, i < arr.length - 1 && styles.rowBorder]} onPress={() => {
              if (it.label.includes('وثائق')) showAlert('مراجعة الوثائق', '3 حسابات بانتظار التوثيق:\n\n• محمد أحمد (سائق)\n• شركة النقل (وسيط)\n• عبدالله علي (عميل)');
              else if (it.label.includes('نزاعات')) showAlert('إدارة النزاعات', 'لا توجد نزاعات مفتوحة حالياً');
              else if (it.label.includes('تسعير')) showAlert('التسعير الديناميكي', 'معاملات الذروة الحالية:\n\n\xD7' + `${APP_CONFIG.surgeMultipliers.normal} عادي\n\xD7${APP_CONFIG.surgeMultipliers.peakHours} ساعات الذروة\n\xD7${APP_CONFIG.surgeMultipliers.ramadan} رمضان`);
              else showAlert('PDPL الامتثال', 'جميع البيانات محمية وفقاً لنظام حماية البيانات الشخصية (PDPL)');
            }}>
              <View style={styles.settingIcon}><MaterialIcons name={it.icon as any} size={22} color={theme.primary} /></View>
              <View style={{ flex: 1 }}><Text style={styles.settingLabel}>{it.label}</Text><Text style={styles.settingDesc}>{it.desc}</Text></View>
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
  title: { fontSize: 28, fontWeight: '700', color: theme.textPrimary, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: theme.textSecondary, paddingHorizontal: 16, paddingTop: 20, paddingBottom: 8 },
  card: { marginHorizontal: 16, backgroundColor: theme.surface, borderRadius: 16, ...theme.shadows.card },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: theme.borderLight },
  rowLabel: { fontSize: 14, color: theme.textPrimary, fontWeight: '500' },
  rowValue: { fontSize: 15, fontWeight: '700', color: theme.accent },
  settingRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  settingIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: theme.primary + '08', alignItems: 'center', justifyContent: 'center' },
  settingLabel: { fontSize: 15, fontWeight: '600', color: theme.textPrimary },
  settingDesc: { fontSize: 12, color: theme.textSecondary, marginTop: 2 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 16, marginTop: 24, paddingVertical: 14, backgroundColor: theme.errorLight, borderRadius: 12 },
  logoutText: { fontSize: 15, fontWeight: '600', color: theme.error },
});
