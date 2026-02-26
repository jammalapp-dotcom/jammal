// ============================================================================
// JAMMAL — Driver Availability/Preferences Screen
// ============================================================================

import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

const VEHICLE_TYPES = [
    { key: 'pickup', labelAr: 'بيك أب', labelEn: 'Pickup' },
    { key: 'small_lorry', labelAr: 'لوري صغير', labelEn: 'Small Lorry' },
    { key: 'medium_lorry', labelAr: 'لوري متوسط', labelEn: 'Medium Lorry' },
    { key: 'large_truck', labelAr: 'شاحنة كبيرة', labelEn: 'Large Truck' },
    { key: 'refrigerated', labelAr: 'شاحنة مبردة', labelEn: 'Refrigerated' },
    { key: 'flatbed', labelAr: 'مسطحة', labelEn: 'Flatbed' },
];

export default function AvailabilityScreen() {
    const { t, i18n } = useTranslation();
    const isAr = i18n.language === 'ar';

    const [autoAccept, setAutoAccept] = useState(false);
    const [maxDistance, setMaxDistance] = useState(100);
    const [notifications, setNotifications] = useState(true);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{t('tabs.availability')}</Text>
            </View>

            {/* Preferences */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{isAr ? 'الإعدادات' : 'Preferences'}</Text>

                <View style={styles.settingRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.settingLabel}>{isAr ? 'القبول التلقائي' : 'Auto Accept'}</Text>
                        <Text style={styles.settingDesc}>
                            {isAr ? 'قبول الطلبات المطابقة تلقائياً' : 'Auto-accept matching requests'}
                        </Text>
                    </View>
                    <Switch
                        value={autoAccept}
                        onValueChange={setAutoAccept}
                        trackColor={{ false: colors.border, true: colors.success + '60' }}
                        thumbColor={autoAccept ? colors.success : '#f4f3f4'}
                    />
                </View>

                <View style={styles.settingRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.settingLabel}>{isAr ? 'الإشعارات' : 'Notifications'}</Text>
                        <Text style={styles.settingDesc}>
                            {isAr ? 'تنبيهات الطلبات الجديدة' : 'New request alerts'}
                        </Text>
                    </View>
                    <Switch
                        value={notifications}
                        onValueChange={setNotifications}
                        trackColor={{ false: colors.border, true: colors.primary + '60' }}
                        thumbColor={notifications ? colors.primary : '#f4f3f4'}
                    />
                </View>

                <View style={styles.settingRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.settingLabel}>{isAr ? 'أقصى مسافة' : 'Max Distance'}</Text>
                        <Text style={styles.settingDesc}>
                            {maxDistance} {t('common.km')}
                        </Text>
                    </View>
                    <View style={styles.distanceBtns}>
                        <Pressable style={styles.distBtn} onPress={() => setMaxDistance(Math.max(10, maxDistance - 10))}>
                            <Text style={styles.distBtnText}>−</Text>
                        </Pressable>
                        <Text style={styles.distValue}>{maxDistance}</Text>
                        <Pressable style={styles.distBtn} onPress={() => setMaxDistance(Math.min(500, maxDistance + 10))}>
                            <Text style={styles.distBtnText}>+</Text>
                        </Pressable>
                    </View>
                </View>
            </View>

            {/* Vehicle Info */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{isAr ? 'مركبتي' : 'My Vehicle'}</Text>
                <View style={styles.vehicleCard}>
                    <Ionicons name="car" size={32} color={colors.primary} />
                    <Text style={styles.vehiclePlaceholder}>
                        {isAr ? 'أضف بيانات مركبتك' : 'Add your vehicle details'}
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { paddingTop: 60, paddingHorizontal: spacing.xl, paddingBottom: spacing.md },
    title: { ...typography.h2, color: colors.text },
    section: { paddingHorizontal: spacing.xl, marginTop: spacing.lg },
    sectionTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.md },
    settingRow: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: colors.surface, borderRadius: borderRadius.sm,
        padding: spacing.md, marginBottom: spacing.sm,
    },
    settingLabel: { ...typography.body, color: colors.text, fontWeight: '600' },
    settingDesc: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
    distanceBtns: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    distBtn: {
        width: 32, height: 32, borderRadius: 16,
        backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
    },
    distBtnText: { color: colors.textInverse, fontSize: 18, fontWeight: '600' },
    distValue: { ...typography.h3, color: colors.text, minWidth: 40, textAlign: 'center' },
    vehicleCard: {
        backgroundColor: colors.surface, borderRadius: borderRadius.lg,
        padding: spacing.xl, alignItems: 'center',
        borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed',
    },
    vehiclePlaceholder: { ...typography.body, color: colors.textMuted, marginTop: spacing.md },
});
