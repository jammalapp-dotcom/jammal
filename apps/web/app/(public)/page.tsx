/* ============================================================================
 * JAMMAL — Public Landing Page
 * Hero · How It Works · For Customers · For Drivers · Stats · Vehicles · CTA
 * ========================================================================== */

'use client';

import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../src/context/LanguageContext';

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

export default function LandingPage() {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();
    const statCities = useCounter(14, '+');
    const statDrivers = useCounter(2500, '+');
    const statShipments = useCounter(12000, '+');
    const statRating = useCounter(4.8, '★', 1200);

    return (
        <>
            {/* ═════════════════════════════════════════════
                 HERO
            ═════════════════════════════════════════════ */}
            <section className="pub-hero">
                <div className="pub-hero-bg" />
                <div className="pub-container pub-hero-content">
                    <div className="pub-hero-badge" dangerouslySetInnerHTML={{ __html: t('landing.heroBadge') }} />
                    <h1 className="pub-hero-title" dangerouslySetInnerHTML={{ __html: t('landing.heroTitle') }} />
                    <p className="pub-hero-sub" dangerouslySetInnerHTML={{ __html: t('landing.heroSubtitle') }} />
                    <div className="pub-hero-ctas">
                        <a href="/register?role=customer" className="pub-btn pub-btn-primary pub-btn-lg">
                            {t('landing.shipNow')}
                        </a>
                        <a href="/register?role=driver" className="pub-btn pub-btn-outline pub-btn-lg">
                            {t('landing.driveWithUs')}
                        </a>
                    </div>
                    <div className="pub-hero-trust">
                        <span dangerouslySetInnerHTML={{ __html: t('landing.trustBadges.verifiedDrivers') }} />
                        <span dangerouslySetInnerHTML={{ __html: t('landing.trustBadges.realTimeTracking') }} />
                        <span dangerouslySetInnerHTML={{ __html: t('landing.trustBadges.securePayments') }} />
                    </div>
                </div>
                {/* decorative truck silhouettes */}
                <div className="pub-hero-deco">
                    <div className="pub-hero-truck">🚛</div>
                    <div className="pub-hero-truck t2">🚚</div>
                </div>
            </section>

            {/* ═════════════════════════════════════════════
                 HOW IT WORKS
            ═════════════════════════════════════════════ */}
            <section className="pub-section" id="how-it-works">
                <div className="pub-container">
                    <div className="pub-section-header">
                        <span className="pub-tag">{t('landing.howItWorks.title')}</span>
                        <h2>{t('landing.howItWorks.title')}</h2>
                        <p>{t('landing.howItWorks.subtitle')}</p>
                    </div>

                    <div className="pub-steps">
                        <div className="pub-step">
                            <div className="pub-step-num">1</div>
                            <div className="pub-step-icon">📦</div>
                            <h3>{t('landing.howItWorks.steps.0.title')}</h3>
                            <p>{t('landing.howItWorks.steps.0.description')}</p>
                        </div>
                        <div className="pub-step-connector" />
                        <div className="pub-step">
                            <div className="pub-step-num">2</div>
                            <div className="pub-step-icon">💰</div>
                            <h3>{t('landing.howItWorks.steps.1.title')}</h3>
                            <p>{t('landing.howItWorks.steps.1.description')}</p>
                        </div>
                        <div className="pub-step-connector" />
                        <div className="pub-step">
                            <div className="pub-step-num">3</div>
                            <div className="pub-step-icon">📍</div>
                            <h3>{t('landing.howItWorks.steps.2.title')}</h3>
                            <p>{t('landing.howItWorks.steps.2.description')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═════════════════════════════════════════════
                 FOR CUSTOMERS
            ═════════════════════════════════════════════ */}
            <section className="pub-section pub-section-alt" id="for-customers">
                <div className="pub-container">
                    <div className="pub-section-header">
                        <span className="pub-tag">{t('navigation.forCustomers')}</span>
                        <h2>{t('landing.forCustomers.title')}</h2>
                        <p>{t('landing.forCustomers.subtitle')}</p>
                    </div>

                    <div className="pub-features-grid">
                        <div className="pub-feature-card">
                            <div className="pub-feature-icon">⚡</div>
                            <h3>{t('landing.forCustomers.features.0.title')}</h3>
                            <p>{t('landing.forCustomers.features.0.description')}</p>
                        </div>
                        <div className="pub-feature-card">
                            <div className="pub-feature-icon">📍</div>
                            <h3>{t('landing.forCustomers.features.1.title')}</h3>
                            <p>{t('landing.forCustomers.features.1.description')}</p>
                        </div>
                        <div className="pub-feature-card">
                            <div className="pub-feature-icon">🔒</div>
                            <h3>{t('landing.forCustomers.features.2.title')}</h3>
                            <p>{t('landing.forCustomers.features.2.description')}</p>
                        </div>
                        <div className="pub-feature-card">
                            <div className="pub-feature-icon">⭐</div>
                            <h3>{t('landing.forCustomers.features.3.title')}</h3>
                            <p>{t('landing.forCustomers.features.3.description')}</p>
                        </div>
                        <div className="pub-feature-card">
                            <div className="pub-feature-icon">📸</div>
                            <h3>{t('landing.forCustomers.features.4.title')}</h3>
                            <p>{t('landing.forCustomers.features.4.description')}</p>
                        </div>
                        <div className="pub-feature-card">
                            <div className="pub-feature-icon">🛡️</div>
                            <h3>{t('landing.forCustomers.features.5.title')}</h3>
                            <p>{t('landing.forCustomers.features.5.description')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═════════════════════════════════════════════
                 FOR DRIVERS
            ═════════════════════════════════════════════ */}
            <section className="pub-section" id="for-drivers">
                <div className="pub-container">
                    <div className="pub-section-header">
                        <span className="pub-tag">{t('navigation.forDrivers')}</span>
                        <h2>{t('landing.forDrivers.title')}</h2>
                        <p>{t('landing.forDrivers.subtitle')}</p>
                    </div>

                    <div className="pub-features-grid cols-4">
                        <div className="pub-feature-card driver">
                            <div className="pub-feature-icon">🕐</div>
                            <h3>{t('landing.forDrivers.features.0.title')}</h3>
                            <p>{t('landing.forDrivers.features.0.description')}</p>
                        </div>
                        <div className="pub-feature-card driver">
                            <div className="pub-feature-icon">💵</div>
                            <h3>{t('landing.forDrivers.features.1.title')}</h3>
                            <p>{t('landing.forDrivers.features.1.description')}</p>
                        </div>
                        <div className="pub-feature-card driver">
                            <div className="pub-feature-icon">🏦</div>
                            <h3>{t('landing.forDrivers.features.2.title')}</h3>
                            <p>{t('landing.forDrivers.features.2.description')}</p>
                        </div>
                        <div className="pub-feature-card driver">
                            <div className="pub-feature-icon">🗺️</div>
                            <h3>{t('landing.forDrivers.features.3.title')}</h3>
                            <p>{t('landing.forDrivers.features.3.description')}</p>
                        </div>
                    </div>

                    <div className="pub-driver-cta">
                        <a href="/register?role=driver" className="pub-btn pub-btn-accent pub-btn-lg">
                            {t('landing.forDrivers.cta')}
                        </a>
                    </div>
                </div>
            </section>

            {/* ═════════════════════════════════════════════
                 STATS BAR
            ═════════════════════════════════════════════ */}
            <section className="pub-stats-bar">
                <div className="pub-container pub-stats-inner">
                    <div className="pub-stat-item">
                        <span className="pub-stat-value" ref={statCities}>0</span>
                        <span className="pub-stat-label">{t('landing.stats.citiesCovered')}</span>
                    </div>
                    <div className="pub-stat-item">
                        <span className="pub-stat-value" ref={statDrivers}>0</span>
                        <span className="pub-stat-label">{t('landing.stats.verifiedDrivers')}</span>
                    </div>
                    <div className="pub-stat-item">
                        <span className="pub-stat-value" ref={statShipments}>0</span>
                        <span className="pub-stat-label">{t('landing.stats.shipmentsCompleted')}</span>
                    </div>
                    <div className="pub-stat-item">
                        <span className="pub-stat-value" ref={statRating}>0</span>
                        <span className="pub-stat-label">{t('landing.stats.averageRating')}</span>
                    </div>
                </div>
            </section>

            {/* ═════════════════════════════════════════════
                 SHIPMENT REQUEST FORM
            ═════════════════════════════════════════════ */}
            <section className="pub-section" id="shipment-request">
                <div className="pub-container">
                    <div className="pub-section-header">
                        <span className="pub-tag">{t('landing.shipmentForm.tag')}</span>
                        <h2>{t('landing.shipmentForm.title')}</h2>
                        <p>{t('landing.shipmentForm.subtitle')}</p>
                    </div>

                    <div className="pub-auth-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <form className="pub-form-grid">
                            <div className="pub-form-group">
                                <label>{t('landing.shipmentForm.pickupLocation')} *</label>
                                <select>
                                    <option value="">{t('landing.shipmentForm.selectCity')}</option>
                                    {[
                                        'Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam',
                                        'Khobar', 'Dhahran', 'Tabuk', 'Abha', 'Taif'
                                    ].map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="pub-form-group">
                                <label>{t('landing.shipmentForm.deliveryLocation')} *</label>
                                <select>
                                    <option value="">{t('landing.shipmentForm.selectCity')}</option>
                                    {[
                                        'Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam',
                                        'Khobar', 'Dhahran', 'Tabuk', 'Abha', 'Taif'
                                    ].map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="pub-form-group">
                                <label>{t('landing.shipmentForm.cargoType')} *</label>
                                <select>
                                    <option value="">{t('landing.shipmentForm.selectCargoType')}</option>
                                    <option value="general">{t('landing.shipmentForm.cargoTypes.general')}</option>
                                    <option value="fragile">{t('landing.shipmentForm.cargoTypes.fragile')}</option>
                                    <option value="refrigerated">{t('landing.shipmentForm.cargoTypes.refrigerated')}</option>
                                    <option value="heavy">{t('landing.shipmentForm.cargoTypes.heavy')}</option>
                                    <option value="vehicle">{t('landing.shipmentForm.cargoTypes.vehicle')}</option>
                                </select>
                            </div>
                            <div className="pub-form-group">
                                <label>{t('landing.shipmentForm.vehicleType')} *</label>
                                <select>
                                    <option value="">{t('landing.shipmentForm.selectVehicle')}</option>
                                    <option value="pickup">{t('landing.shipmentForm.vehicleTypes.pickup')}</option>
                                    <option value="small_lorry">{t('landing.shipmentForm.vehicleTypes.small_lorry')}</option>
                                    <option value="medium_lorry">{t('landing.shipmentForm.vehicleTypes.medium_lorry')}</option>
                                    <option value="large_truck">{t('landing.shipmentForm.vehicleTypes.large_truck')}</option>
                                    <option value="refrigerated">{t('landing.shipmentForm.vehicleTypes.refrigerated')}</option>
                                    <option value="flatbed">{t('landing.shipmentForm.vehicleTypes.flatbed')}</option>
                                </select>
                            </div>
                            <div className="pub-form-group full">
                                <label>{t('landing.shipmentForm.estimatedWeight')} (kg)</label>
                                <input type="number" placeholder={t('landing.shipmentForm.weightPlaceholder')} />
                            </div>
                            <div className="pub-form-group">
                                <label>{t('landing.shipmentForm.pickupDate')} *</label>
                                <input type="date" />
                            </div>
                            <div className="pub-form-group">
                                <label>{t('landing.shipmentForm.deliveryDate')}</label>
                                <input type="date" />
                            </div>
                            <div className="pub-form-group full">
                                <label>{t('landing.shipmentForm.specialInstructions')}</label>
                                <textarea 
                                    placeholder={t('landing.shipmentForm.instructionsPlaceholder')}
                                    rows={3}
                                    style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '2px solid var(--border)' }}
                                />
                            </div>
                            <div className="pub-form-group full" style={{ textAlign: 'center', marginTop: '20px' }}>
                                <button type="button" className="pub-btn pub-btn-primary pub-btn-lg">
                                    {t('landing.shipmentForm.getQuote')} →
                                </button>
                                <p style={{ marginTop: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                                    {t('landing.shipmentForm.registerNote')} <a href="/register" className="pub-link-muted">{t('landing.shipmentForm.registerLink')}</a>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* ═════════════════════════════════════════════
                 VEHICLE TYPES
            ═════════════════════════════════════════════ */}
            <section className="pub-section pub-section-alt" id="vehicles">
                <div className="pub-container">
                    <div className="pub-section-header">
                        <span className="pub-tag">{t('navigation.vehicles')}</span>
                        <h2>{t('landing.vehicles.title')}</h2>
                        <p>{t('landing.vehicles.subtitle')}</p>
                    </div>

                    <div className="pub-vehicles-grid">
                        {[
                            { icon: '🛻', name: t('landing.vehicles.types.0.name'), cap: t('landing.vehicles.types.0.capacity') },
                            { icon: '🚛', name: t('landing.vehicles.types.1.name'), cap: t('landing.vehicles.types.1.capacity') },
                            { icon: '🚚', name: t('landing.vehicles.types.2.name'), cap: t('landing.vehicles.types.2.capacity') },
                            { icon: '🚛', name: t('landing.vehicles.types.3.name'), cap: t('landing.vehicles.types.3.capacity') },
                            { icon: '❄️', name: t('landing.vehicles.types.4.name'), cap: t('landing.vehicles.types.4.capacity') },
                            { icon: '📐', name: t('landing.vehicles.types.5.name'), cap: t('landing.vehicles.types.5.capacity') },
                            { icon: '🛢️', name: t('landing.vehicles.types.6.name'), cap: t('landing.vehicles.types.6.capacity') },
                            { icon: '🚗', name: t('landing.vehicles.types.7.name'), cap: t('landing.vehicles.types.7.capacity') },
                            { icon: '🏗️', name: t('landing.vehicles.types.8.name'), cap: t('landing.vehicles.types.8.capacity') },
                        ].map((v, index) => (
                            <div className="pub-vehicle-card" key={index}>
                                <div className="pub-vehicle-icon">{v.icon}</div>
                                <h4>{v.name}</h4>
                                <span>{v.cap}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═════════════════════════════════════════════
                 FINAL CTA
            ═════════════════════════════════════════════ */}
            <section className="pub-cta-section">
                <div className="pub-container pub-cta-inner">
                    <h2>{t('landing.finalCta.title')}</h2>
                    <p>{t('landing.finalCta.subtitle')}</p>
                    <div className="pub-hero-ctas">
                        <a href="/register?role=customer" className="pub-btn pub-btn-primary pub-btn-lg">
                            {t('landing.finalCta.customerButton')}
                        </a>
                        <a href="/register?role=driver" className="pub-btn pub-btn-outline-white pub-btn-lg">
                            {t('landing.finalCta.driverButton')}
                        </a>
                        <a href="/register?role=broker" className="pub-btn pub-btn-accent pub-btn-lg">
                            {t('landing.finalCta.brokerButton')}
                        </a>
                    </div>
                    <p style={{ marginTop: '20px', fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
                        {t('landing.finalCta.brokerInfo')}
                    </p>
                </div>
            </section>
        </>
    );
}
