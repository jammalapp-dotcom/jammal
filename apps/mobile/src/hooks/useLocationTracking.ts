// ============================================================================
// JAMMAL — useLocationTracking Hook (Section 8 — Phase 4)
// GPS updates every 10 seconds during active trip, emits via Socket.IO
// ============================================================================

import { useEffect, useRef, useState, useCallback } from 'react';
import * as Location from 'expo-location';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../stores/auth.store';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';
const GPS_INTERVAL_MS = 10_000; // 10 seconds per Section 8.1

interface LocationData {
    latitude: number;
    longitude: number;
    heading: number | null;
    speed: number | null;
    timestamp: number;
}

interface UseLocationTrackingOptions {
    /** Shipment ID currently being tracked */
    shipmentId: string;
    /** Whether tracking is active */
    enabled: boolean;
}

interface UseLocationTrackingReturn {
    /** Current GPS position */
    currentLocation: LocationData | null;
    /** Whether location permissions are granted */
    hasPermission: boolean;
    /** Whether actively tracking */
    isTracking: boolean;
    /** Error message if any */
    error: string | null;
    /** Manually start tracking */
    startTracking: () => Promise<void>;
    /** Manually stop tracking */
    stopTracking: () => void;
}

export function useLocationTracking({
    shipmentId,
    enabled,
}: UseLocationTrackingOptions): UseLocationTrackingReturn {
    const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
    const [hasPermission, setHasPermission] = useState(false);
    const [isTracking, setIsTracking] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const socketRef = useRef<Socket | null>(null);
    const watchIdRef = useRef<Location.LocationSubscription | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const lastLocationRef = useRef<LocationData | null>(null);

    const { accessToken } = useAuthStore();

    // Initialize Socket.IO connection
    useEffect(() => {
        if (!accessToken) return;

        const socket = io(API_URL, {
            auth: { token: accessToken },
            transports: ['websocket'],
        });

        socket.on('connect', () => {
            console.log('📡 Socket connected for tracking');
        });

        socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err.message);
        });

        socketRef.current = socket;

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [accessToken]);

    // Request location permissions
    const requestPermissions = useCallback(async (): Promise<boolean> => {
        try {
            const { status: foreground } = await Location.requestForegroundPermissionsAsync();
            if (foreground !== 'granted') {
                setError('Location permission denied');
                return false;
            }

            // Request background permission for GPS tracking while app is minimized
            const { status: background } = await Location.requestBackgroundPermissionsAsync();
            if (background !== 'granted') {
                console.warn('Background location not granted — tracking only while app is active');
            }

            setHasPermission(true);
            setError(null);
            return true;
        } catch (err) {
            setError('Failed to request location permissions');
            return false;
        }
    }, []);

    // Send location to server via Socket.IO
    const emitLocation = useCallback((location: LocationData) => {
        if (!socketRef.current?.connected || !shipmentId) return;

        socketRef.current.emit('location:update', {
            shipmentId,
            latitude: location.latitude,
            longitude: location.longitude,
            heading: location.heading,
            speed: location.speed ? location.speed * 3.6 : 0, // m/s → km/h
        });
    }, [shipmentId]);

    // Start GPS tracking
    const startTracking = useCallback(async () => {
        const permitted = await requestPermissions();
        if (!permitted) return;

        setIsTracking(true);
        setError(null);

        try {
            // Watch position for continuous updates
            const subscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    distanceInterval: 10, // Update every 10 meters moved
                    timeInterval: GPS_INTERVAL_MS,
                },
                (loc) => {
                    const locationData: LocationData = {
                        latitude: loc.coords.latitude,
                        longitude: loc.coords.longitude,
                        heading: loc.coords.heading,
                        speed: loc.coords.speed,
                        timestamp: loc.timestamp,
                    };

                    setCurrentLocation(locationData);
                    lastLocationRef.current = locationData;
                }
            );

            watchIdRef.current = subscription;

            // Emit to server every 10 seconds (even if position hasn't changed)
            intervalRef.current = setInterval(() => {
                if (lastLocationRef.current) {
                    emitLocation(lastLocationRef.current);
                }
            }, GPS_INTERVAL_MS);

        } catch (err) {
            setError('Failed to start location tracking');
            setIsTracking(false);
        }
    }, [requestPermissions, emitLocation]);

    // Stop GPS tracking
    const stopTracking = useCallback(() => {
        if (watchIdRef.current) {
            watchIdRef.current.remove();
            watchIdRef.current = null;
        }
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsTracking(false);
    }, []);

    // Auto start/stop based on enabled prop
    useEffect(() => {
        if (enabled && shipmentId) {
            startTracking();
        } else {
            stopTracking();
        }

        return () => {
            stopTracking();
        };
    }, [enabled, shipmentId]);

    return {
        currentLocation,
        hasPermission,
        isTracking,
        error,
        startTracking,
        stopTracking,
    };
}
