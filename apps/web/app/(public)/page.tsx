/* ============================================================================
 * JAMMAL — Public Landing Page
 * Hero · How It Works · Features · Stats · CTA
 * ========================================================================== */

'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useSupabase } from '../../src/context/SupabaseContext';

/* ── Animated counter hook ── */
function useCounter(end: number, suffix = '', duration = 2000) {
    const ref = useRef<HTMLSpanElement>(null);
    const started = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;
                    let start = 0;
                    const step = end / (duration / 16);
                    const tick = () => {
                        start += step;
                        if (start >= end) {
                            el.textContent = end.toLocaleString() + suffix;
                            return;
                        }
                        el.textContent = Math.floor(start).toLocaleString() + suffix;
                        requestAnimationFrame(tick);
                    };
                    tick();
                }
            },
            { threshold: 0.3 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [end, suffix, duration]);

    return ref;
}

/* ── SVG Icons ── */
const IconShield = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
    </svg>
);

const IconTracking = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="10" r="3" />
        <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
    </svg>
);

const IconPayment = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
);

/* ── Step Icons for How it Works ── */
const IconPackage = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16.5 9.4l-9-5.19" />
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
);

const IconQuote = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
);

const IconMap = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
        <line x1="8" y1="2" x2="8" y2="18" />
        <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
);

const IconCheck = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

/* ── Feature Icons ── */
const IconSpeed = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
);

const IconDashboard = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
);

const IconLock = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

export default function LandingPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const { supabase, user } = useSupabase();

    // Form state
    const [formData, setFormData] = useState({
        pickup: '',
        delivery: '',
        cargoType: '',
        vehicleType: '',
        weight: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const statCities = useCounter(14, '+');
    const statDrivers = useCounter(2500, '+');
    const statShipments = useCounter(12000, '+');
    const statRating = useCounter(4.8, '★', 1200);

    const stepIcons = [<IconPackage key="p" />, <IconQuote key="q" />, <IconMap key="m" />, <IconCheck key="c" />];
    const featureIcons = [<IconSpeed key="s" />, <IconDashboard key="d" />, <IconLock key="l" />];

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.pickup || !formData.delivery || !formData.cargoType) {
            alert(t('landing.shipmentForm.errorFillRequired'));
            return;
        }

        setIsSubmitting(true);
        try {
            // Build email body for notification
            const emailSubject = `طلب شحنة جديدة - من ${formData.pickup} إلى ${formData.delivery}`;
            const emailBody = [
                `طلب عرض سعر جديد من الموقع`,
                ``,
                `المسار: ${formData.pickup} → ${formData.delivery}`,
                `نوع البضاعة: ${formData.cargoType}`,
                `نوع المركبة: ${formData.vehicleType || 'غير محدد'}`,
                `الوزن: ${formData.weight || 'غير محدد'} كغ`,
                ``,
                `المستخدم: ${user ? user.name : 'زائر غير مسجل'}`,
                `التاريخ: ${new Date().toLocaleString('ar-SA')}`,
            ].join('\n');

            // Send email notification
            window.open(`mailto:contact@jammal.express?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`, '_self');

            // If user is logged in, also save to Supabase
            if (user) {
                const shortId = `SH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
                await supabase.from('shipments').insert({
                    short_id: shortId,
                    customer_id: user.id,
                    pickup_city: formData.pickup,
                    pickup_address: formData.pickup,
                    delivery_city: formData.delivery,
                    delivery_address: formData.delivery,
                    cargo_category: formData.cargoType,
                    cargo_category_ar: t(`landing.shipmentForm.cargoTypes.${formData.cargoType}`),
                    weight: parseInt(formData.weight) || 0,
                    vehicle_type: formData.vehicleType,
                    status: 'searching',
                    pricing_mode: 'bidding',
                    estimated_price: 0,
                    distance: 0,
                    created_at: new Date().toISOString(),
                }).then(({ error }) => { if (error) console.warn('DB save:', error.message); });
            }

            setSuccess(true);
            setFormData({ pickup: '', delivery: '', cargoType: '', vehicleType: '', weight: '' });
        } catch (err: any) {
            console.error('Submission error:', err.message);
            alert(t('landing.shipmentForm.errorGeneric') + ': ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* ═══════════════════════════════════════════
                 HERO
            ═══════════════════════════════════════════ */}
            <section className="pub-hero" id="hero" style={{
                backgroundImage: 'url(/jammal_hero_main.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div className="pub-hero-overlay" style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(15, 26, 46, 0.5) 0%, rgba(15, 26, 46, 0.8) 100%)',
                    zIndex: 1
                }} />

                <div className="pub-container pub-hero-content" style={{ position: 'relative', zIndex: 2 }}>
                    {/* Sky Logo Overlay */}
                    <div className="pub-hero-sky-logo" style={{
                        textAlign: 'center',
                        marginBottom: '40px',
                        animation: 'float 8s ease-in-out infinite'
                    }}>
                        <img src="/jammal-logo.png" alt="Jammal" style={{
                            height: '120px',
                            filter: 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.4)) brightness(1.1)'
                        }} />
                    </div>

                    <div className="pub-hero-badge" style={{ animation: 'fadeInUp 1s ease-out' }}>
                        {t('landing.heroBadge')}
                    </div>
                    <h1
                        className="pub-hero-title"
                        style={{
                            color: '#fff',
                            textShadow: '0 4px 20px rgba(0,0,0,0.6)',
                            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                            lineHeight: 1.1,
                            fontWeight: 900
                        }}
                        dangerouslySetInnerHTML={{ __html: t('landing.heroTitle') }}
                    />
                    <p className="pub-hero-sub" style={{
                        color: 'rgba(255,255,255,0.95)',
                        fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                        textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                        maxWidth: '800px',
                        margin: '24px auto'
                    }}>
                        {t('landing.heroSubtitle')}
                    </p>
                    <div className="pub-hero-ctas" style={{ marginTop: '40px' }}>
                        <a href="#shipment-request" className="pub-btn pub-btn-accent pub-btn-lg" style={{ minWidth: '200px', boxShadow: '0 10px 20px rgba(200, 151, 62, 0.3)' }}>
                            {t('landing.ctaShipment')}
                        </a>
                        <a href="/register?role=driver" className="pub-btn pub-btn-outline-white pub-btn-lg" style={{ minWidth: '200px' }}>
                            {t('landing.ctaDriver')}
                        </a>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                 HOW IT WORKS
            ═══════════════════════════════════════════ */}
            <section className="pub-section" id="how-it-works">
                <div className="pub-container">
                    <div className="pub-section-header">
                        <span className="pub-tag">{t('navigation.howItWorks')}</span>
                        <h2>{t('landing.howItWorks.title')}</h2>
                        <p>{t('landing.howItWorks.subtitle')}</p>
                    </div>

                    <div className="pub-steps">
                        {[0, 1, 2, 3].map((i) => (
                            <div key={i} className="pub-step-wrapper">
                                <div className="pub-step">
                                    <div className="pub-step-num">{i + 1}</div>
                                    <div className="pub-step-icon">{stepIcons[i]}</div>
                                    <h3>{t(`landing.howItWorks.steps.${i}.title`)}</h3>
                                    <p>{t(`landing.howItWorks.steps.${i}.description`)}</p>
                                </div>
                                {i < 3 && <div className="pub-step-connector" aria-hidden="true" />}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                 STRATEGIC FEATURES
            ═══════════════════════════════════════════ */}
            <section className="pub-section pub-section-alt" id="features">
                <div className="pub-container">
                    <div className="pub-section-header">
                        <span className="pub-tag">{t('navigation.features')}</span>
                        <h2>{t('landing.features.title')}</h2>
                        <p>{t('landing.features.subtitle')}</p>
                    </div>

                    <div className="pub-features-grid">
                        {[0, 1, 2].map((i) => (
                            <div className="pub-feature-card" key={i}>
                                <div className="pub-feature-icon">
                                    {featureIcons[i]}
                                </div>
                                <h3>{t(`landing.features.items.${i}.title`)}</h3>
                                <p>{t(`landing.features.items.${i}.description`)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                 SHIPMENT REQUEST FORM
            ═══════════════════════════════════════════ */}
            <section className="pub-section" id="shipment-request">
                <div className="pub-container">
                    <div className="pub-section-header">
                        <span className="pub-tag">{t('landing.shipmentForm.tag')}</span>
                        <h2>{t('landing.shipmentForm.title')}</h2>
                        <p>{t('landing.shipmentForm.subtitle')}</p>
                    </div>

                    <div className="pub-shipment-form-card">
                        {success ? (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                                <h3 style={{ marginBottom: '8px' }}>{t('landing.shipmentForm.successTitle')}</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>{t('landing.shipmentForm.successMessage')}</p>
                                <button
                                    className="pub-btn pub-btn-outline"
                                    style={{ marginTop: '24px', color: 'var(--primary)', borderColor: 'var(--primary)' }}
                                    onClick={() => setSuccess(false)}
                                >
                                    {t('landing.shipmentForm.newRequest')}
                                </button>
                            </div>
                        ) : (
                            <form className="pub-form-premium" onSubmit={handleFormSubmit}>
                                <div className="pub-form-section">
                                    <h4 style={{ color: 'var(--primary)', marginBottom: '16px', fontSize: '1.1rem' }}>📍 {t('landing.shipmentForm.routeInfo') || 'معلومات المسار'}</h4>
                                    <div className="pub-form-row">
                                        <div className="pub-form-group">
                                            <label>{t('landing.shipmentForm.pickupLocation')} *</label>
                                            <select
                                                value={formData.pickup}
                                                onChange={e => setFormData({ ...formData, pickup: e.target.value })}
                                                required
                                            >
                                                <option value="">{t('landing.shipmentForm.selectCity')}</option>
                                                {Object.entries(t('landing.shipmentForm.cities', { returnObjects: true })).map(([key, label]) => (
                                                    <option key={key} value={key}>{label as string}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="pub-form-group">
                                            <label>{t('landing.shipmentForm.deliveryLocation')} *</label>
                                            <select
                                                value={formData.delivery}
                                                onChange={e => setFormData({ ...formData, delivery: e.target.value })}
                                                required
                                            >
                                                <option value="">{t('landing.shipmentForm.selectCity')}</option>
                                                {Object.entries(t('landing.shipmentForm.cities', { returnObjects: true })).map(([key, label]) => (
                                                    <option key={key} value={key}>{label as string}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="pub-form-section" style={{ marginTop: '24px' }}>
                                    <h4 style={{ color: 'var(--primary)', marginBottom: '16px', fontSize: '1.1rem' }}>📦 {t('landing.shipmentForm.cargoDetails') || 'تفاصيل الشحنة'}</h4>
                                    <div className="pub-form-row">
                                        <div className="pub-form-group">
                                            <label>{t('landing.shipmentForm.cargoType')} *</label>
                                            <select
                                                value={formData.cargoType}
                                                onChange={e => setFormData({ ...formData, cargoType: e.target.value })}
                                                required
                                            >
                                                <option value="">{t('landing.shipmentForm.selectCargoType')}</option>
                                                <option value="general">{t('landing.shipmentForm.cargoTypes.general')}</option>
                                                <option value="fragile">{t('landing.shipmentForm.cargoTypes.fragile')}</option>
                                                <option value="refrigerated">{t('landing.shipmentForm.cargoTypes.refrigerated')}</option>
                                                <option value="heavy">{t('landing.shipmentForm.cargoTypes.heavy')}</option>
                                                <option value="vehicle">{t('landing.shipmentForm.cargoTypes.vehicle')}</option>
                                            </select>
                                        </div>
                                        <div className="pub-form-group">
                                            <label>{t('landing.shipmentForm.vehicleType')}</label>
                                            <select
                                                value={formData.vehicleType}
                                                onChange={e => setFormData({ ...formData, vehicleType: e.target.value })}
                                            >
                                                <option value="">{t('landing.shipmentForm.selectVehicle')}</option>
                                                <option value="pickup">{t('landing.shipmentForm.vehicleTypes.pickup')}</option>
                                                <option value="small_lorry">{t('landing.shipmentForm.vehicleTypes.small_lorry')}</option>
                                                <option value="medium_lorry">{t('landing.shipmentForm.vehicleTypes.medium_lorry')}</option>
                                                <option value="large_truck">{t('landing.shipmentForm.vehicleTypes.large_truck')}</option>
                                                <option value="refrigerated">{t('landing.shipmentForm.vehicleTypes.refrigerated')}</option>
                                                <option value="flatbed">{t('landing.shipmentForm.vehicleTypes.flatbed')}</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="pub-form-group full" style={{ marginTop: '16px' }}>
                                        <label>{t('landing.shipmentForm.estimatedWeight')}</label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            value={formData.weight}
                                            onChange={e => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                setFormData({ ...formData, weight: val });
                                            }}
                                            placeholder={t('landing.shipmentForm.weightPlaceholder')}
                                            style={{ color: '#1B2A4A', background: '#FFFFFF', opacity: 1, cursor: 'text' }}
                                        />
                                    </div>
                                </div>

                                <div className="pub-form-submit-area" style={{ textAlign: 'center', marginTop: '32px' }}>
                                    <button type="submit" className="pub-btn pub-btn-primary pub-btn-lg pub-btn-block" disabled={isSubmitting}>
                                        {isSubmitting ? t('common.loading') : (t('landing.shipmentForm.getQuote') + ' →')}
                                    </button>
                                    <p style={{ marginTop: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                                        {t('landing.shipmentForm.registerNote')}{' '}
                                        <a href="/register" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'underline' }}>
                                            {t('landing.shipmentForm.registerLink')}
                                        </a>
                                    </p>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                 STATS BAR
            ═══════════════════════════════════════════ */}
            <section className="pub-stats-bar">
                <div className="pub-container pub-stats-inner">
                    <div className="pub-stat-item">
                        <span className="pub-stat-value" ref={statCities} style={{ color: '#FFFFFF' }}>0</span>
                        <span className="pub-stat-label" style={{ color: 'rgba(255,255,255,0.95)' }}>{t('landing.stats.citiesCovered')}</span>
                    </div>
                    <div className="pub-stat-item">
                        <span className="pub-stat-value" ref={statDrivers} style={{ color: '#FFFFFF' }}>0</span>
                        <span className="pub-stat-label" style={{ color: 'rgba(255,255,255,0.95)' }}>{t('landing.stats.verifiedDrivers')}</span>
                    </div>
                    <div className="pub-stat-item">
                        <span className="pub-stat-value" ref={statShipments} style={{ color: '#FFFFFF' }}>0</span>
                        <span className="pub-stat-label" style={{ color: 'rgba(255,255,255,0.95)' }}>{t('landing.stats.shipmentsCompleted')}</span>
                    </div>
                    <div className="pub-stat-item">
                        <span className="pub-stat-value" ref={statRating} style={{ color: '#FFFFFF' }}>0</span>
                        <span className="pub-stat-label" style={{ color: 'rgba(255,255,255,0.95)' }}>{t('landing.stats.averageRating')}</span>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                 FINAL CTA
            ═══════════════════════════════════════════ */}
            <section className="pub-cta-section" style={{
                background: 'linear-gradient(135deg, #0F1A2E 0%, #1B2A4A 100%)',
                padding: '100px 0',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div className="pub-container pub-cta-inner" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <img src="/jammal-logo.png" alt="Jammal" style={{
                        height: '80px',
                        marginBottom: '32px',
                        filter: 'drop-shadow(0 0 15px rgba(255,215,0,0.3))'
                    }} />
                    <h2 style={{
                        color: '#fff',
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        fontWeight: 800,
                        marginBottom: '16px'
                    }}>{t('landing.finalCta.title')}</h2>
                    <p style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '1.2rem',
                        maxWidth: '600px',
                        margin: '0 auto 48px'
                    }}>{t('landing.finalCta.subtitle')}</p>
                    <div className="pub-hero-ctas" style={{ gap: '20px' }}>
                        <a href="/register?role=customer" className="pub-btn pub-btn-accent pub-btn-lg" style={{ minWidth: '180px' }}>
                            {t('landing.finalCta.customerButton')}
                        </a>
                        <a href="/register?role=driver" className="pub-btn pub-btn-outline-white pub-btn-lg" style={{ minWidth: '180px' }}>
                            {t('landing.finalCta.driverButton')}
                        </a>
                        <a href="/register?role=broker" className="pub-btn pub-btn-outline-white pub-btn-lg" style={{ minWidth: '180px' }}>
                            {t('landing.finalCta.brokerButton')}
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
