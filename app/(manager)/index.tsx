import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { theme } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../contexts/AppContext';
import { TEST_USERS } from '../../services/mockData';
import { useAlert } from '@/template';

export default function ManagerHomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { shipments, drivers } = useApp();
  const { showAlert } = useAlert();
  const totalUsers = Object.keys(TEST_USERS).length;
  const totalRevenue = shipments.filter((s) => s.finalPrice).reduce((sum, s) => sum + (s.finalPrice || 0), 0);
  const totalCommission = Math.round(totalRevenue * 0.15);
  const disputed = shipments.filter((s) => s.status === 'disputed').length;
  const pending = shipments.filter((s) => s.status === 'searching').length;

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: insets.bottom + 16 }} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.header}>
          <View><Text style={styles.greeting}>لوحة الإدارة</Text><Text style={styles.name}>مدير النظام</Text></View>
          <Image source={require('../../assets/images/jammal-logo.png')} style={styles.logo} contentFit="contain" />
        </Animated.View>

        {/* Dashboard Cards */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.kpiGrid}>
          {[
            { icon: 'people', label: 'مستخدمين', val: totalUsers, color: theme.info, bg: theme.infoLight },
            { icon: 'local-shipping', label: 'شحنات', val: shipments.length, color: theme.primary, bg: theme.primary + '12' },
            { icon: 'groups', label: 'سائقين', val: drivers.length, color: theme.success, bg: theme.successLight },
            { icon: 'attach-money', label: 'إيرادات', val: `${totalRevenue.toLocaleString()}`, color: theme.accent, bg: theme.accent + '15' },
            { icon: 'receipt', label: 'عمولات', val: `${totalCommission.toLocaleString()}`, color: theme.warning, bg: theme.warningLight },
            { icon: 'report-problem', label: 'نزاعات', val: disputed, color: theme.error, bg: theme.errorLight },
          ].map((kpi, i) => (
            <View key={i} style={[styles.kpiCard, { backgroundColor: kpi.bg }]}>
              <MaterialIcons name={kpi.icon as any} size={28} color={kpi.color} />
              <Text style={[styles.kpiVal, { color: kpi.color }]}>{kpi.val}</Text>
              <Text style={styles.kpiLbl}>{kpi.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Pending Review */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <Text style={styles.sectionTitle}>مهام معلقة</Text>
          <View style={styles.taskCard}>
            {[
              { icon: 'verified-user', label: 'حسابات بانتظار التوثيق', count: 3, color: theme.warning },
              { icon: 'report', label: 'تقارير بضاعة تالفة', count: 1, color: theme.error },
              { icon: 'search', label: 'شحنات بدون سائق', count: pending, color: theme.info },
              { icon: 'tune', label: 'تحديث الأسعار الموسمية', count: 0, color: theme.textSecondary },
            ].map((task, i) => (
              <Pressable key={i} style={[styles.taskRow, i < 3 && styles.taskRowBorder]} onPress={() => {
                if (task.label.includes('توثيق')) router.push('/(manager)/users');
                else if (task.label.includes('بضاعة')) showAlert('تقارير البضاعة', `يوجد ${task.count} تقرير بانتظار المراجعة`);
                else if (task.label.includes('سائق')) router.push('/(manager)/shipments');
                else showAlert('تحديث الأسعار', 'لا توجد تحديثات مطلوبة حالياً');
              }}>
                <View style={[styles.taskIcon, { backgroundColor: task.color + '15' }]}><MaterialIcons name={task.icon as any} size={20} color={task.color} /></View>
                <Text style={styles.taskLabel}>{task.label}</Text>
                <View style={[styles.taskCount, { backgroundColor: task.count > 0 ? task.color : theme.backgroundSecondary }]}><Text style={[styles.taskCountText, task.count > 0 && { color: '#FFF' }]}>{task.count}</Text></View>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Recent Activity */}
        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <Text style={styles.sectionTitle}>آخر النشاطات</Text>
          {shipments.slice(0, 5).map((s) => (
            <Pressable key={s.id} style={styles.actRow} onPress={() => router.push(`/shipment/${s.id}`)}>
              <View style={styles.actDot} />
              <View style={{ flex: 1 }}><Text style={styles.actText}>{s.id} - {s.pickupCity} → {s.deliveryCity}</Text><Text style={styles.actSub}>{s.createdAt} • {s.cargoCategoryAr}</Text></View>
            </Pressable>
          ))}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 },
  greeting: { fontSize: 14, color: theme.textSecondary },
  name: { fontSize: 24, fontWeight: '700', color: theme.textPrimary, marginTop: 2 },
  logo: { width: 44, height: 44 },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 10 },
  kpiCard: { width: '31%', borderRadius: 16, padding: 14, gap: 4, ...theme.shadows.card },
  kpiVal: { fontSize: 20, fontWeight: '700' },
  kpiLbl: { fontSize: 11, color: theme.textSecondary },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: theme.textPrimary, paddingHorizontal: 16, paddingTop: 24, paddingBottom: 12 },
  taskCard: { marginHorizontal: 16, backgroundColor: theme.surface, borderRadius: 16, ...theme.shadows.card },
  taskRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  taskRowBorder: { borderBottomWidth: 1, borderBottomColor: theme.borderLight },
  taskIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  taskLabel: { flex: 1, fontSize: 14, fontWeight: '500', color: theme.textPrimary },
  taskCount: { minWidth: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  taskCountText: { fontSize: 13, fontWeight: '700', color: theme.textSecondary },
  actRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 10 },
  actDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.accent },
  actText: { fontSize: 14, fontWeight: '500', color: theme.textPrimary },
  actSub: { fontSize: 12, color: theme.textSecondary, marginTop: 2 },
});
