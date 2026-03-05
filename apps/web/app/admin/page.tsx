/* ============================================================================
 * JAMMAL — Admin Dashboard Home Page (Section 12)
 * Stats overview, live map, recent shipments, and activity feed
 * ========================================================================== */

'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface DashboardStats {
    activeShipments: number;
    onlineDrivers: number;
    todaysRevenue: string;
    pendingVerification: number;
    totalUsers: number;
    avgRating: string;
}

export default function DashboardPage() {
    const { t } = useTranslation();
    const [stats, setStats] = useState<DashboardStats>({
        activeShipments: 127,
        onlineDrivers: 43,
        todaysRevenue: '12,450',
        pendingVerification: 8,
        totalUsers: 2341,
        avgRating: '4.7',
    });

    useEffect(() => {
        // Attempt to fetch live stats from API
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        if (!token) return;
        fetch(`${API_URL}/health`)
            .then(r => r.json())
            .then(() => {
                // API is online — stats will be live once endpoints are added
                console.log('🟢 API connected — dashboard will show live data when endpoints are ready');
            })
            .catch(() => {
                console.log('🟡 API offline — showing demo data');
            });
    }, []);

    return (
        <>
            {/* ── Page Header ── */}
            <div className="page-header">
                <h1>{t('admin.dashboard')}</h1>
                <p>{t('admin.welcome')}</p>
            </div>

            {/* ── KPI Stats Grid (Section 12.1) ── */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-card-header">
                        <span>{t('admin.activeShipments')}</span>
                        <span className="stat-icon">📦</span>
                    </div>
                    <div className="stat-value">127</div>
                    <div className="stat-change positive">↑ 12% from last week</div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-header">
                        <span>{t('admin.onlineDrivers')}</span>
                        <span className="stat-icon">🚛</span>
                    </div>
                    <div className="stat-value">43</div>
                    <div className="stat-change positive">↑ 8% from yesterday</div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-header">
                        <span>{t('admin.todaysRevenue')}</span>
                        <span className="stat-icon">💰</span>
                    </div>
                    <div className="stat-value">12,450 SAR</div>
                    <div className="stat-change positive">↑ 15% from last week</div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-header">
                        <span>{t('admin.pendingVerification')}</span>
                        <span className="stat-icon">✅</span>
                    </div>
                    <div className="stat-value">8</div>
                    <div className="stat-change negative">↑ 3 new applications</div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-header">
                        <span>{t('admin.totalUsers')}</span>
                        <span className="stat-icon">👥</span>
                    </div>
                    <div className="stat-value">2,341</div>
                    <div className="stat-change positive">↑ 156 this month</div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-header">
                        <span>{t('admin.avgRating')}</span>
                        <span className="stat-icon">⭐</span>
                    </div>
                    <div className="stat-value">4.7</div>
                    <div className="stat-change positive">↑ 0.2 improvement</div>
                </div>
            </div>

            {/* ── Live Map + Activity ── */}
            <div className="content-grid">
                <div className="content-card wide">
                    <h2>🗺️ {t('admin.liveTracking')}</h2>
                    <div className="live-map-container">
                        <div className="map-placeholder">
                            <span className="map-icon">🇸🇦</span>
                            <span style={{ fontSize: '18px', fontWeight: 600 }}>{t('admin.saudiArabia')}</span>
                            <div className="map-stats">
                                <div className="map-stat">
                                    <div className="map-stat-value">43</div>
                                    <div className="map-stat-label">{t('admin.driversOnline')}</div>
                                </div>
                                <div className="map-stat">
                                    <div className="map-stat-value">24</div>
                                    <div className="map-stat-label">{t('admin.inTransit')}</div>
                                </div>
                                <div className="map-stat">
                                    <div className="map-stat-value">7</div>
                                    <div className="map-stat-label">{t('admin.atPickup')}</div>
                                </div>
                                <div className="map-stat">
                                    <div className="map-stat-value">3</div>
                                    <div className="map-stat-label">{t('admin.atDelivery')}</div>
                                </div>
                            </div>
                            <p style={{ marginTop: '16px', fontSize: '12px', opacity: 0.6 }}>
                                {t('admin.connectMaps')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Recent Shipments Table ── */}
            <div className="content-grid">
                <div className="content-card wide">
                    <h2>📋 {t('admin.recentShipments')}</h2>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>{t('admin.id')}</th>
                                <th>{t('admin.customer')}</th>
                                <th>{t('admin.route')}</th>
                                <th>{t('admin.driver')}</th>
                                <th>{t('admin.status')}</th>
                                <th>{t('admin.price')}</th>
                                <th>{t('admin.created')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>#JML-001</strong></td>
                                <td>محمد العلي</td>
                                <td>Riyadh → Jeddah</td>
                                <td>خالد السعود</td>
                                <td><span className="status-badge in-transit">In Transit</span></td>
                                <td>1,250 SAR</td>
                                <td>2 hours ago</td>
                            </tr>
                            <tr>
                                <td><strong>#JML-002</strong></td>
                                <td>شركة الفهد</td>
                                <td>Dammam → Riyadh</td>
                                <td>—</td>
                                <td><span className="status-badge searching">Searching</span></td>
                                <td>850 SAR</td>
                                <td>4 hours ago</td>
                            </tr>
                            <tr>
                                <td><strong>#JML-003</strong></td>
                                <td>أحمد الحربي</td>
                                <td>Jeddah → Medina</td>
                                <td>سعود المطيري</td>
                                <td><span className="status-badge delivered">Delivered</span></td>
                                <td>620 SAR</td>
                                <td>6 hours ago</td>
                            </tr>
                            <tr>
                                <td><strong>#JML-004</strong></td>
                                <td>مؤسسة البناء</td>
                                <td>Riyadh → Abha</td>
                                <td>عبدالله الشمري</td>
                                <td><span className="status-badge assigned">Assigned</span></td>
                                <td>2,100 SAR</td>
                                <td>8 hours ago</td>
                            </tr>
                            <tr>
                                <td><strong>#JML-005</strong></td>
                                <td>فاطمة القحطاني</td>
                                <td>Tabuk → Riyadh</td>
                                <td>—</td>
                                <td><span className="status-badge cancelled">Cancelled</span></td>
                                <td>1,800 SAR</td>
                                <td>1 day ago</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
