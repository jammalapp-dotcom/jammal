/* ============================================================================
 * JAMMAL — Admin Live Tracking Map
 * Real-time view of ALL active drivers and shipments via Socket.IO
 * Uses @vis.gl/react-google-maps for the web map
 * ========================================================================== */

'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { APIProvider, Map as GoogleMap, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { io, Socket } from 'socket.io-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

interface DriverMarker {
    driverId: string;
    driverName?: string;
    latitude: number;
    longitude: number;
    heading: number | null;
    speed: number | null;
    shipmentId: string;
    status: string;
    lastUpdate: Date;
}

interface ShipmentInfo {
    id: string;
    pickupAddress: string;
    deliveryAddress: string;
    status: string;
    customerName: string;
    driverName: string;
}

export default function LiveMapPage() {
    const [drivers, setDrivers] = useState<globalThis.Map<string, DriverMarker>>(new globalThis.Map());
    const [selectedDriver, setSelectedDriver] = useState<DriverMarker | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [stats, setStats] = useState({
        totalOnline: 0,
        inTransit: 0,
        atPickup: 0,
        atDelivery: 0,
    });
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        // Connect to the tracking WebSocket as admin
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        const socket = io(API_URL, {
            auth: { token: token || '' },
            transports: ['websocket'],
        });

        socket.on('connect', () => {
            setIsConnected(true);
            // Subscribe to all active shipments tracking
            socket.emit('admin:subscribe_all');
        });

        socket.on('disconnect', () => setIsConnected(false));

        // Receive live location updates from all drivers
        socket.on('location:updated', (data: any) => {
            setDrivers(prev => {
                const updated = new globalThis.Map(prev);
                updated.set(data.driverId, {
                    driverId: data.driverId,
                    driverName: data.driverName,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    heading: data.heading,
                    speed: data.speed,
                    shipmentId: data.shipmentId,
                    status: data.status || 'in_transit',
                    lastUpdate: new Date(),
                });
                return updated;
            });
        });

        socket.on('shipment:status_changed', (data: any) => {
            if (data.newStatus === 'delivered' || data.newStatus === 'cancelled') {
                setDrivers(prev => {
                    const updated = new globalThis.Map(prev);
                    // Find and remove driver for this shipment
                    for (const [id, driver] of updated) {
                        if (driver.shipmentId === data.shipmentId) {
                            updated.delete(id);
                            break;
                        }
                    }
                    return updated;
                });
            }
        });

        socketRef.current = socket;
        return () => { socket.disconnect(); };
    }, []);

    // Update stats whenever drivers change
    useEffect(() => {
        const driverList = Array.from(drivers.values());
        setStats({
            totalOnline: driverList.length,
            inTransit: driverList.filter(d => d.status === 'in_transit').length,
            atPickup: driverList.filter(d => d.status === 'arrived_pickup' || d.status === 'driver_en_route_pickup').length,
            atDelivery: driverList.filter(d => d.status === 'arrived_delivery').length,
        });
    }, [drivers]);

    const driverArray = Array.from(drivers.values());

    const statusColors: Record<string, string> = {
        in_transit: '#2563EB',
        driver_en_route_pickup: '#F59E0B',
        arrived_pickup: '#F97316',
        arrived_delivery: '#10B981',
        cargo_loaded: '#8B5CF6',
    };

    return (
        <>
            <div className="page-header">
                <h1>🗺️ Live Tracking Map</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        padding: '6px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: 600,
                        backgroundColor: isConnected ? '#DCFCE7' : '#FEF2F2',
                        color: isConnected ? '#166534' : '#991B1B',
                    }}>
                        <span style={{
                            width: 8, height: 8, borderRadius: '50%',
                            backgroundColor: isConnected ? '#22C55E' : '#EF4444',
                        }} />
                        {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="stats-grid" style={{ marginBottom: '16px' }}>
                <div className="stat-card" style={{ textAlign: 'center' }}>
                    <div className="stat-value">{stats.totalOnline}</div>
                    <div style={{ fontSize: '13px', color: '#64748B' }}>Drivers Online</div>
                </div>
                <div className="stat-card" style={{ textAlign: 'center' }}>
                    <div className="stat-value" style={{ color: '#2563EB' }}>{stats.inTransit}</div>
                    <div style={{ fontSize: '13px', color: '#64748B' }}>In Transit</div>
                </div>
                <div className="stat-card" style={{ textAlign: 'center' }}>
                    <div className="stat-value" style={{ color: '#F59E0B' }}>{stats.atPickup}</div>
                    <div style={{ fontSize: '13px', color: '#64748B' }}>At Pickup</div>
                </div>
                <div className="stat-card" style={{ textAlign: 'center' }}>
                    <div className="stat-value" style={{ color: '#10B981' }}>{stats.atDelivery}</div>
                    <div style={{ fontSize: '13px', color: '#64748B' }}>At Delivery</div>
                </div>
            </div>

            {/* Map */}
            <div className="content-card wide" style={{ height: '600px', overflow: 'hidden', padding: 0 }}>
                {GOOGLE_MAPS_KEY ? (
                    <APIProvider apiKey={GOOGLE_MAPS_KEY}>
                        <GoogleMap
                            style={{ width: '100%', height: '100%' }}
                            defaultCenter={{ lat: 24.7136, lng: 46.6753 }}
                            defaultZoom={6}
                            mapId="jammal-live-map"
                            gestureHandling="greedy"
                        >
                            {driverArray.map((driver) => (
                                <AdvancedMarker
                                    key={driver.driverId}
                                    position={{ lat: driver.latitude, lng: driver.longitude }}
                                    onClick={() => setSelectedDriver(driver)}
                                    title={driver.driverName || driver.driverId}
                                >
                                    <div style={{
                                        width: 36, height: 36, borderRadius: '50%',
                                        backgroundColor: statusColors[driver.status] || '#2563EB',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        border: '3px solid white',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                                        fontSize: '16px',
                                    }}>
                                        🚛
                                    </div>
                                </AdvancedMarker>
                            ))}

                            {selectedDriver && (
                                <InfoWindow
                                    position={{ lat: selectedDriver.latitude, lng: selectedDriver.longitude }}
                                    onCloseClick={() => setSelectedDriver(null)}
                                >
                                    <div style={{ padding: '8px', minWidth: '200px', fontFamily: 'Inter, sans-serif' }}>
                                        <h3 style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: 700 }}>
                                            {selectedDriver.driverName || `Driver ${selectedDriver.driverId.slice(0, 8)}`}
                                        </h3>
                                        <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#475569' }}>
                                            <div><strong>Status:</strong> {selectedDriver.status.replace(/_/g, ' ')}</div>
                                            <div><strong>Speed:</strong> {selectedDriver.speed ? `${Math.round(selectedDriver.speed)} km/h` : '—'}</div>
                                            <div><strong>Shipment:</strong> #{selectedDriver.shipmentId.slice(0, 8)}</div>
                                            <div><strong>Last Update:</strong> {selectedDriver.lastUpdate.toLocaleTimeString('ar-SA')}</div>
                                        </div>
                                    </div>
                                </InfoWindow>
                            )}
                        </GoogleMap>
                    </APIProvider>
                ) : (
                    <div style={{
                        height: '100%', display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
                        color: '#94A3B8', textAlign: 'center', padding: '40px',
                    }}>
                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🗺️</div>
                        <h3 style={{ color: '#E2E8F0', margin: '0 0 8px' }}>Google Maps API Key Required</h3>
                        <p style={{ maxWidth: '400px', lineHeight: '1.6' }}>
                            Set <code style={{ background: '#334155', padding: '2px 8px', borderRadius: '4px' }}>
                                NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
                            </code> in your environment to enable the live tracking map.
                        </p>
                        {driverArray.length > 0 && (
                            <div style={{ marginTop: '24px', padding: '16px', background: '#1E293B', borderRadius: '12px' }}>
                                <p style={{ color: '#10B981', fontWeight: 600 }}>
                                    📡 {driverArray.length} driver(s) actively tracked via Socket.IO
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Active Drivers Table */}
            {driverArray.length > 0 && (
                <div className="content-card wide" style={{ marginTop: '16px' }}>
                    <h2>🚛 Active Drivers ({driverArray.length})</h2>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Driver</th>
                                <th>Shipment</th>
                                <th>Status</th>
                                <th>Speed</th>
                                <th>Location</th>
                                <th>Last Update</th>
                            </tr>
                        </thead>
                        <tbody>
                            {driverArray.map((driver) => (
                                <tr key={driver.driverId}>
                                    <td><strong>{driver.driverName || driver.driverId.slice(0, 8)}</strong></td>
                                    <td>#{driver.shipmentId.slice(0, 8)}</td>
                                    <td>
                                        <span
                                            className={`status-badge ${driver.status.replace(/_/g, '-')}`}
                                            style={{
                                                backgroundColor: (statusColors[driver.status] || '#64748B') + '20',
                                                color: statusColors[driver.status] || '#64748B',
                                            }}
                                        >
                                            {driver.status.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td>{driver.speed ? `${Math.round(driver.speed)} km/h` : '—'}</td>
                                    <td style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                                        {driver.latitude.toFixed(4)}, {driver.longitude.toFixed(4)}
                                    </td>
                                    <td>{driver.lastUpdate.toLocaleTimeString('ar-SA')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}
