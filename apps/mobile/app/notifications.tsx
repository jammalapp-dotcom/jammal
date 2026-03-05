import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { theme } from '../constants/theme';
import { useApp } from '../contexts/AppContext';
import { Notification } from '../services/mockData';

const TYPE_CONFIG: Record<string, { icon: string; color: string }> = {
    shipment: { icon: 'local-shipping', color: theme.primary },
    bid: { icon: 'gavel', color: theme.accent },
    payment: { icon: 'payment', color: theme.success },
    system: { icon: 'info', color: theme.info },
};

export default function NotificationsScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { notifications, markNotificationRead } = useApp();

    const handlePress = (n: Notification) => {
        markNotificationRead(n.id);
        if (n.shipmentId) router.push(`/shipment/${n.shipmentId}`);
    };

    const renderItem = ({ item: n }: { item: Notification }) => {
        const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.system;
        return (
            <Pressable style={[styles.card, !n.read && styles.unread]} onPress={() => handlePress(n)}>
                <View style={[styles.icon, { backgroundColor: cfg.color + '15' }]}><MaterialIcons name={cfg.icon as any} size={22} color={cfg.color} /></View>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.title, !n.read && { fontWeight: '700' }]}>{n.title}</Text>
                    <Text style={styles.body}>{n.body}</Text>
                    <Text style={styles.time}>{new Date(n.timestamp).toLocaleDateString('ar-SA')}</Text>
                </View>
                {!n.read && <View style={styles.dot} />}
            </Pressable>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.hBtn}><MaterialIcons name="arrow-forward" size={24} color={theme.textPrimary} /></Pressable>
                <Text style={styles.headerTitle}>الإشعارات</Text>
                <View style={styles.hBtn} />
            </View>
            {notifications.length === 0 ? (
                <View style={styles.empty}><MaterialIcons name="notifications-off" size={48} color={theme.textTertiary} /><Text style={styles.emptyText}>لا توجد إشعارات</Text></View>
            ) : (
                <View style={{ flex: 1 }}><FlashList data={notifications} renderItem={renderItem} estimatedItemSize={90} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 16 }} showsVerticalScrollIndicator={false} /></View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: 8 },
    hBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '700', color: theme.textPrimary },
    card: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: theme.surface, borderRadius: 14, padding: 14, marginBottom: 8, gap: 12, ...theme.shadows.card },
    unread: { backgroundColor: theme.accent + '05', borderWidth: 1, borderColor: theme.accent + '20' },
    icon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
    title: { fontSize: 15, fontWeight: '500', color: theme.textPrimary },
    body: { fontSize: 13, color: theme.textSecondary, marginTop: 4, lineHeight: 20 },
    time: { fontSize: 11, color: theme.textTertiary, marginTop: 6 },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.accent, marginTop: 6 },
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
    emptyText: { fontSize: 16, color: theme.textSecondary },
});
