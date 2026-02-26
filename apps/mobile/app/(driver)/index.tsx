// ============================================================================
// JAMMAL — Driver Home Screen (Map with online/offline toggle)
// Shows map with nearby requests, online status, and active trip
// ============================================================================

import { useState, useEffect, useRef, useCallback } from 'react';
import {
    View, Text, StyleSheet, Pressable, Switch, Dimensions, Alert,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../../src/stores/auth.store';
import { api } from '../../src/config/api';
import { useLocationTracking } from '../../src/hooks/useLocationTracking';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

const { width } = Dimensions.get('window');
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

export default function DriverHomeScreen() {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const { user, accessToken } = useAuthStore();
    const isAr = i18n.language === 'ar';

    const [isOnline, setIsOnline] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [availableRequests, setAvailableRequests] = useState<any[]>([]);
    const [activeTrip, setActiveTrip] = useState<any>(null);
    const mapRef = useRef<MapView>(null);
    const socketRef = useRef<Socket | null>(null);

    // Get current location on mount
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;
            const loc = await Location.getCurrentPositionAsync({});
            setCurrentLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
        })();
    }, []);

    // Location tracking for active trip
    const { currentLocation: trackingLoc, isTracking } = useLocationTracking({
        shipmentId: activeTrip?.id || '',
        enabled: !!activeTrip && isOnline,
    });

    // Socket.IO — listen for new shipment requests
    useEffect(() => {
        if (!accessToken || !isOnline) return;

        const socket = io(API_URL, {
            auth: { token: accessToken },
            transports: ['websocket'],
        });

        socket.on('shipment:new', (data) => {
            setAvailableRequests((prev) => [data, ...prev]);
        });

        socket.on('shipment:status_changed', (data) => {
            if (data.newStatus === 'cancelled') {
                setAvailableRequests((prev) => prev.filter((r) => r.shipmentId !== data.shipmentId));
            }
        });

        socketRef.current = socket;
        return () => { socket.disconnect(); };
    }, [accessToken, isOnline]);

    const toggleOnline = useCallback(async () => {
        const newState = !isOnline;
        setIsOnline(newState);
        if (!accessToken || !currentLocation) return;
        try {
            await api.toggleDriverOnline(newState, currentLocation.latitude, currentLocation.longitude, accessToken);
        } catch (err) {
            console.error('Toggle online failed:', err);
            setIsOnline(!newState); // revert
        }
    }, [isOnline, accessToken, currentLocation]);

    const initialRegion = {
        latitude: currentLocation?.latitude || 24.7136,
        longitude: currentLocation?.longitude || 46.6753,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    };

    return (
        <View style={styles.container}>
            {/* Map */}
            <MapView
                ref={mapRef}
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={initialRegion}
                showsUserLocation
                showsMyLocationButton
                showsCompass
            >
                {/* Available shipment request markers */}
                {availableRequests.map((req, i) => (
                    <Marker
                        key={i}
                        coordinate={{
                            latitude: req.pickupLatitude || 24.7,
                            longitude: req.pickupLongitude || 46.7,
                        }}
                        pinColor={colors.accent}
                        title={isAr ? 'طلب شحنة' : 'Shipment Request'}
                    />
                ))}
            </MapView>

            {/* Online/Offline Toggle */}
            <View style={styles.statusBar}>
                <View style={styles.statusLeft}>
                    <View style={[styles.statusDot, { backgroundColor: isOnline ? colors.success : colors.textMuted }]} />
                    <Text style={styles.statusText}>
                        {isOnline ? t('driver.goOnline') : t('driver.goOffline')}
                    </Text>
                </View>
                <Switch
                    value={isOnline}
                    onValueChange={toggleOnline}
                    trackColor={{ false: colors.border, true: colors.success + '60' }}
                    thumbColor={isOnline ? colors.success : '#f4f3f4'}
                />
            </View>

            {/* Bottom Panel */}
            <View style={styles.bottomPanel}>
                {isOnline ? (
                    <>
                        <Text style={styles.panelTitle}>
                            {isAr ? 'الطلبات المتاحة' : 'Available Requests'}
                        </Text>
                        {availableRequests.length === 0 ? (
                            <View style={styles.waitingState}>
                                <Ionicons name="radio-outline" size={32} color={colors.primary} />
                                <Text style={styles.waitingText}>
                                    {isAr ? 'في انتظار طلبات الشحن...' : 'Waiting for shipment requests...'}
                                </Text>
                            </View>
                        ) : (
                            availableRequests.slice(0, 3).map((req, i) => (
                                <Pressable key={i} style={styles.requestCard}>
                                    <View style={styles.reqInfo}>
                                        <Text style={styles.reqRoute}>{req.pickupAddress} → {req.deliveryAddress}</Text>
                                        <Text style={styles.reqPrice}>{req.estimatedPrice || '—'} {t('common.sar')}</Text>
                                    </View>
                                    <Pressable style={styles.acceptBtn}>
                                        <Text style={styles.acceptBtnText}>{t('driver.acceptShipment')}</Text>
                                    </Pressable>
                                </Pressable>
                            ))
                        )}
                    </>
                ) : (
                    <View style={styles.offlineState}>
                        <Ionicons name="moon-outline" size={40} color={colors.textMuted} />
                        <Text style={styles.offlineText}>
                            {isAr ? 'أنت غير متصل\nقم بالتفعيل لاستقبال الطلبات' : "You're offline\nGo online to receive requests"}
                        </Text>
                    </View>
                )}

                {/* Quick Stats */}
                <View style={styles.quickStats}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>0</Text>
                        <Text style={styles.statLabel}>{t('driver.totalTrips')}</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>0.00</Text>
                        <Text style={styles.statLabel}>{t('driver.todayEarnings')}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
    statusBar: {
        position: 'absolute', top: 60, left: spacing.xl, right: spacing.xl,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: colors.surface, borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
        shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5,
    },
    statusLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    statusDot: { width: 12, height: 12, borderRadius: 6 },
    statusText: { ...typography.body, fontWeight: '600', color: colors.text },
    bottomPanel: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: colors.surface,
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: 40,
        shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20, elevation: 8,
        maxHeight: '45%',
    },
    panelTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.md },
    waitingState: { alignItems: 'center', paddingVertical: spacing.lg },
    waitingText: { ...typography.body, color: colors.textMuted, marginTop: spacing.sm, textAlign: 'center' },
    requestCard: {
        backgroundColor: colors.background, borderRadius: borderRadius.md,
        padding: spacing.md, marginBottom: spacing.sm,
    },
    reqInfo: { marginBottom: spacing.sm },
    reqRoute: { ...typography.bodySmall, color: colors.text },
    reqPrice: { ...typography.body, color: colors.primary, fontWeight: '700', marginTop: 4 },
    acceptBtn: {
        backgroundColor: colors.success, paddingVertical: 10,
        borderRadius: borderRadius.sm, alignItems: 'center',
    },
    acceptBtnText: { ...typography.button, color: colors.textInverse, fontSize: 14 },
    offlineState: { alignItems: 'center', paddingVertical: spacing.xl },
    offlineText: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginTop: spacing.md },
    quickStats: {
        flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.borderLight,
        marginTop: spacing.lg, paddingTop: spacing.md,
    },
    statItem: { flex: 1, alignItems: 'center' },
    statValue: { ...typography.h2, color: colors.primary },
    statLabel: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
    statDivider: { width: 1, backgroundColor: colors.border },
});
