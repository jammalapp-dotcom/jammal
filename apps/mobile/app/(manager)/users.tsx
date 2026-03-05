import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { theme } from '../../constants/theme';
import { TEST_USERS, AppUser } from '../../services/mockData';

const ROLE_LABELS: Record<string, { ar: string; icon: string; color: string }> = {
  customer: { ar: 'عميل', icon: 'person', color: theme.info },
  driver: { ar: 'سائق', icon: 'local-shipping', color: theme.success },
  broker: { ar: 'وسيط', icon: 'business', color: theme.accent },
  manager: { ar: 'مدير', icon: 'admin-panel-settings', color: theme.primary },
};

export default function ManagerUsersScreen() {
  const insets = useSafeAreaInsets();
  const users = Object.values(TEST_USERS).map((t) => t.user);

  const renderItem = ({ item: u }: { item: AppUser }) => {
    const role = ROLE_LABELS[u.role] || ROLE_LABELS.customer;
    return (
      <View style={styles.card}>
        <View style={[styles.avatar, { backgroundColor: role.color + '15' }]}><MaterialIcons name={role.icon as any} size={24} color={role.color} /></View>
        <View style={{ flex: 1 }}>
          <View style={styles.nameRow}><Text style={styles.name}>{u.name}</Text>{u.verified && <MaterialIcons name="verified" size={16} color={theme.accent} />}</View>
          <Text style={styles.meta}>{u.phone} • {u.email}</Text>
          <Text style={styles.meta}>{u.company || 'حساب شخصي'}</Text>
        </View>
        <View style={styles.right}>
          <View style={[styles.roleBadge, { backgroundColor: role.color + '15' }]}><Text style={[styles.roleText, { color: role.color }]}>{role.ar}</Text></View>
          <Text style={styles.rating}>{u.rating} ★</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Image source={require('../../assets/images/jammal_logo_mini.png')} style={{ width: 32, height: 32 }} contentFit="contain" />
          <Text style={styles.title}>إدارة المستخدمين</Text>
        </View>
        <Text style={styles.count}>{users.length} مستخدم</Text>
      </View>
      <View style={{ flex: 1 }}><FlashList data={users} renderItem={renderItem} estimatedItemSize={100} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 16 }} showsVerticalScrollIndicator={false} /></View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  title: { fontSize: 24, fontWeight: '700', color: theme.textPrimary },
  count: { fontSize: 14, color: theme.textSecondary },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.surface, borderRadius: 16, padding: 14, marginBottom: 10, gap: 12, ...theme.shadows.card },
  avatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontSize: 15, fontWeight: '700', color: theme.textPrimary },
  meta: { fontSize: 12, color: theme.textSecondary, marginTop: 2 },
  right: { alignItems: 'flex-end', gap: 4 },
  roleBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  roleText: { fontSize: 11, fontWeight: '700' },
  rating: { fontSize: 13, fontWeight: '600', color: theme.accent },
});
