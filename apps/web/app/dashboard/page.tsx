/* ============================================================================
 * JAMMAL — User Dashboard
 * Generic dashboard for Customers, Drivers, and Brokers
 * ========================================================================== */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useSupabase } from '../../src/context/SupabaseContext';

export default function DashboardPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const { user, isLoading } = useSupabase();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    if (isLoading) return <div style={{ padding: '40px', textAlign: 'center' }}>{t('common.loading')}</div>;
    if (!user) return null;

    return (
        <div className="dashboard-container" style={{ padding: '40px' }}>
            <div className="page-header">
                <h1>{t('dashboard.welcome') || 'أهلاً بك في لوحة التحكم'}</h1>
                <p>{user.name || user.email}</p>
            </div>

            <div className="stats-grid" style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                <div className="stat-card" style={{ background: '#1a1d21', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ opacity: 0.6, fontSize: '14px' }}>{t('dashboard.activeShipments') || 'الشحنات النشطة'}</div>
                    <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '8px', color: '#D4A843' }}>0</div>
                </div>
                <div className="stat-card" style={{ background: '#1a1d21', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ opacity: 0.6, fontSize: '14px' }}>{t('dashboard.completedShipments') || 'الشحنات المكتملة'}</div>
                    <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '8px', color: '#D4A843' }}>0</div>
                </div>
                <div className="stat-card" style={{ background: '#1a1d21', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ opacity: 0.6, fontSize: '14px' }}>{t('dashboard.walletBalance') || 'رصيد المحفظة'}</div>
                    <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '8px', color: '#D4A843' }}>0.00 SAR</div>
                </div>
            </div>

            <div style={{ marginTop: '40px', padding: '60px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                <p style={{ opacity: 0.5 }}>{t('dashboard.noData') || 'لا توجد بيانات لعرضها حالياً'}</p>
                <button className="pub-btn pub-btn-primary" style={{ marginTop: '20px' }}>
                    {t('dashboard.newRequest') || 'طلب جديد'}
                </button>
            </div>
        </div>
    );
}
