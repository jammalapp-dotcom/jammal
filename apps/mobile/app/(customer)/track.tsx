// ============================================================================
// JAMMAL — Customer Track Screen (Live Map)
// Real-time driver tracking via Socket.IO on react-native-maps
// ============================================================================

import { useState, useEffect, useRef, useCallback } from 'react';
import {
    View, Text, StyleSheet, Pressable, ActivityIndicator, Dimensions,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../../src/stores/auth.store';
import { api } from '../../src/config/api';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

const { width, height } = Dimensions.get('window');
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

interface DriverLocation {
    latitude: number;
    longitude: number;
    heading: number | null;
    speed: number | null;
}

export default function TrackScreen() {
    const { shipmentId } = useLocalSearchParams<{ shipmentId?: string }>();
    const { t, i18n } = useTranslation();
    const { accessToken } = useAuthStore();
    const isAr = i18n.language === 'ar';

    const [shipment, setShipment] = useState<any>(null);
    const [driverLocation, setDriverLocation] = useState<DriverLocation | null>(null);
    const [loading, setLoading] = useState(true);
    const mapRef = useRef<MapView>(null);
    const socketRef = useRef<Socket | null>(null);

    // Load shipment details
    useEffect(() => {
        if (!shipmentId || !accessToken) {
            setLoading(false);
            return;
        }
        (async () => {
            try {
                const result: any = await api.getShipment(shipmentId, accessToken);
                setShipment(result.data);
            } catch (err) {
                console.error('Failed to load shipment:', err);
            } finally {
                setLoading(false);
            }
        })();
    }, [shipmentId, accessToken]);

    // Socket.IO — subscribe to live tracking
    useEffect(() => {
        if (!shipmentId || !accessToken) return;

        const socket = io(API_URL, {
            auth: { token: accessToken },
            transports: ['websocket'],
        });

        socket.on('connect', () => {
            socket.emit('tracking:subscribe', { shipmentId });
        });

        socket.on('location:updated', (data) => {
            if (data.shipmentId === shipmentId) {
                const loc: DriverLocation = {
                    latitude: data.latitude,
                    longitude: data.longitude,
                    heading: data.heading,
                    speed: data.speed,
                };
                setDriverLocation(loc);

                // Animate map to driver's position
                mapRef.current?.animateToRegion({
                    latitude: data.latitude,
                    longitude: data.longitude,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                }, 500);
            }
        });

        socket.on('shipment:status_changed', (data) => {
            if (data.shipmentId === shipmentId) {
                setShipment((prev: any) => prev ? { ...prev, status: data.newStatus } : prev);
            }
        });

        socketRef.current = socket;

        return () => {
            socket.emit('tracking:unsubscribe', { shipmentId });
            socket.disconnect();
        };
    }, [shipmentId, accessToken]);

    // Default to Riyadh if no coordinates
    const initialRegion = {
        latitude: shipment?.pickupLatitude || 24.7136,
        longitude: shipment?.pickupLongitude || 46.6753,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!shipmentId) {
        return (
            <View style={styles.noShipmentContainer}>
                <View style={styles.mapPlaceholder}>
                    <MapView
                        ref={mapRef}
                        style={styles.map}
                        initialRegion={initialRegion}
                        showsUserLocation
                        showsMyLocationButton
                    />
                    <View style={styles.overlayMessage}>
                        <Ionicons name="navigate-outline" size={48} color={colors.primary} />
                        <Text style={styles.overlayTitle}>
                            {isAr ? 'تتبع شحناتك' : 'Track Your Shipments'}
                        </Text>
                        <Text style={styles.overlaySubtitle}>
                            {isAr
                                ? 'اختر شحنة من قائمة شحناتك لتتبعها على الخريطة'
                                : 'Select a shipment to track it live on the map'}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

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
                showsTraffic
            >
                {/* Pickup Marker */}
                {shipment?.pickupLatitude && (
                    <Marker
                        coordinate={{
                            latitude: Number(shipment.pickupLatitude),
                            longitude: Number(shipment.pickupLongitude),
                        }}
                        title={isAr ? 'نقطة الاستلام' : 'Pickup'}
                        pinColor={colors.primary}
                    />
                )}

                {/* Delivery Marker */}
                {shipment?.deliveryLatitude && (
                    <Marker
                        coordinate={{
                            latitude: Number(shipment.deliveryLatitude),
                            longitude: Number(shipment.deliveryLongitude),
                        }}
                        title={isAr ? 'نقطة التوصيل' : 'Delivery'}
                        pinColor={colors.success}
                    />
                )}

                {/* Driver Live Marker */}
                {driverLocation && (
                    <Marker
                        coordinate={driverLocation}
                        title={isAr ? 'السائق' : 'Driver'}
                        anchor={{ x: 0.5, y: 0.5 }}
                    >
                        <View style={styles.driverMarker}>
                            <Ionicons name="car" size={20} color={colors.textInverse} />
                        </View>
                    </Marker>
                )}

                {/* Route line from pickup to delivery */}
                {shipment?.pickupLatitude && shipment?.deliveryLatitude && (
                    <Polyline
                        coordinates={[
                            { latitude: Number(shipment.pickupLatitude), longitude: Number(shipment.pickupLongitude) },
                            ...(driverLocation ? [{ latitude: driverLocation.latitude, longitude: driverLocation.longitude }] : []),
                            { latitude: Number(shipment.deliveryLatitude), longitude: Number(shipment.deliveryLongitude) },
                        ]}
                        strokeColor={colors.primary}
                        strokeWidth={3}
                        lineDashPattern={[10, 5]}
                    />
                )}
            </MapView>

            {/* Bottom Info Card */}
            <View style={styles.infoCard}>
                <View style={styles.infoHeader}>
                    <View style={[styles.statusPill, { backgroundColor: colors.statusInTransit + '20' }]}>
                        <Text style={[styles.statusPillText, { color: colors.statusInTransit }]}>
                            {shipment?.status ? t(`shipment.status.${shipment.status}`) : '—'}
                        </Text>
                    </View>
                    {driverLocation?.speed && (
                        <Text style={styles.speedText}>
                            {Math.round(driverLocation.speed)} {t('common.km')}/h
                        </Text>
                    )}
                </View>

                {/* Pickup → Delivery */}
                <View style={styles.routeInfo}>
                    <View style={styles.routePoint}>
                        <View style={[styles.pointDot, { backgroundColor: colors.primary }]} />
                        <Text style={styles.routeAddr} numberOfLines={1}>{shipment?.pickupAddress || '—'}</Text>
                    </View>
                    <View style={styles.routeDivider} />
                    <View style={styles.routePoint}>
                        <View style={[styles.pointDot, { backgroundColor: colors.success }]} />
                        <Text style={styles.routeAddr} numberOfLines={1}>{shipment?.deliveryAddress || '—'}</Text>
                    </View>
                </View>

                {/* Driver info */}
                {shipment?.driver && (
                    <View style={styles.driverInfo}>
                        <View style={styles.driverAvatar}>
                            <Ionicons name="person" size={18} color={colors.textInverse} />
                        </View>
                        <View style={{ flex: 1, marginLeft: spacing.sm }}>
                            <Text style={styles.driverName}>
                                {isAr ? shipment.driver.fullNameAr : shipment.driver.fullNameEn}
                            </Text>
                            <Text style={styles.driverPhone}>{shipment.driver.phone}</Text>
                        </View>
                        <Pressable style={styles.callBtn}>
                            <Ionicons name="call" size={20} color={colors.success} />
                        </Pressable>
                        <Pressable style={styles.chatBtn}>
                            <Ionicons name="chatbubble" size={20} color={colors.primary} />
                        </Pressable>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
    noShipmentContainer: { flex: 1 },
    mapPlaceholder: { flex: 1 },
    map: { flex: 1, width, height },
    overlayMessage: {
        position: 'absolute', bottom: 120, left: spacing.xl, right: spacing.xl,
        backgroundColor: colors.surface, borderRadius: borderRadius.lg,
        padding: spacing.xl, alignItems: 'center',
        shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20, elevation: 8,
    },
    overlayTitle: { ...typography.h3, color: colors.text, marginTop: spacing.md },
    overlaySubtitle: { ...typography.bodySmall, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs },
    driverMarker: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: colors.primary,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 3, borderColor: colors.textInverse,
        shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 4, elevation: 4,
    },
    infoCard: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: colors.surface,
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: spacing.xl, paddingBottom: 40,
        shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20, elevation: 8,
    },
    infoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
    statusPill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: borderRadius.full },
    statusPillText: { fontSize: 13, fontWeight: '700' },
    speedText: { ...typography.bodySmall, color: colors.textMuted },
    routeInfo: { marginBottom: spacing.md },
    routePoint: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
    pointDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
    routeAddr: { ...typography.bodySmall, color: colors.text, flex: 1 },
    routeDivider: { width: 2, height: 20, backgroundColor: colors.border, marginLeft: 4 },
    driverInfo: {
        flexDirection: 'row', alignItems: 'center',
        borderTopWidth: 1, borderTopColor: colors.borderLight, paddingTop: spacing.md,
    },
    driverAvatar: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
    },
    driverName: { ...typography.body, color: colors.text, fontWeight: '600' },
    driverPhone: { ...typography.caption, color: colors.textMuted },
    callBtn: { padding: spacing.sm, marginRight: spacing.xs },
    chatBtn: { padding: spacing.sm },
});
