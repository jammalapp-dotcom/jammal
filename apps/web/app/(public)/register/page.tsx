/* ============================================================================
 * JAMMAL — Registration Page
 * Multi-step form: Role → Basic Info → Role-Specific → Confirm
 * Fully translated via i18next
 * Integrated with Supabase OTP
 * ========================================================================== */

'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useSupabase } from '../../../src/context/SupabaseContext';

type Role = 'customer' | 'driver' | 'broker';

const SAUDI_CITIES = [
    'Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam',
    'Khobar', 'Dhahran', 'Tabuk', 'Abha', 'Taif',
    'Hail', 'Jazan', 'Najran', 'Yanbu', 'Al Jubail',
];

const VEHICLE_TYPES = [
    { value: 'pickup', labelKey: 'landing.shipmentForm.vehicleTypes.pickup' },
    { value: 'small_lorry', labelKey: 'landing.shipmentForm.vehicleTypes.small_lorry' },
    { value: 'medium_lorry', labelKey: 'landing.shipmentForm.vehicleTypes.medium_lorry' },
    { value: 'large_truck', labelKey: 'landing.shipmentForm.vehicleTypes.large_truck' },
    { value: 'refrigerated', labelKey: 'landing.shipmentForm.vehicleTypes.refrigerated' },
    { value: 'flatbed', labelKey: 'landing.shipmentForm.vehicleTypes.flatbed' },
];

function RegisterForm() {
    const { t } = useTranslation();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { signUpWithEmail } = useSupabase();

    const [step, setStep] = useState(1);
    const [role, setRole] = useState<Role | ''>('');
    const [submitted, setSubmitted] = useState(false);
    const [apiLoading, setApiLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    // Basic info
    const [fullNameEn, setFullNameEn] = useState('');
    const [fullNameAr, setFullNameAr] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Driver-specific
    const [vehicleType, setVehicleType] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [serviceAreas, setServiceAreas] = useState<string[]>([]);
    const [iban, setIban] = useState('');

    // Broker-specific
    const [companyNameEn, setCompanyNameEn] = useState('');
    const [companyNameAr, setCompanyNameAr] = useState('');
    const [crNumber, setCrNumber] = useState('');
    const [taxNumber, setTaxNumber] = useState('');
    const [freelanceDocument, setFreelanceDocument] = useState('');

    // Customer-specific
    const [companyName, setCompanyName] = useState('');

    // Terms
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [acceptPrivacy, setAcceptPrivacy] = useState(false);

    // Errors
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const r = searchParams?.get('role');
        if (r === 'customer' || r === 'driver' || r === 'broker') {
            setRole(r);
            setStep(2);
        }
    }, [searchParams]);

    const validate = (): boolean => {
        const errs: Record<string, string> = {};

        if (step === 1 && !role) {
            errs.role = t('registerPage.errors.selectRole');
        }
        if (step === 2) {
            if (!fullNameEn.trim()) errs.fullNameEn = t('registerPage.errors.required');
            if (!phone.trim()) errs.phone = t('registerPage.errors.required');
            else if (!/^05\d{8}$/.test(phone.replace(/\s/g, '')))
                errs.phone = t('registerPage.errors.invalidPhone');
            if (!email.trim()) errs.email = t('registerPage.errors.required');
            else if (!/\S+@\S+\.\S+/.test(email)) errs.email = t('registerPage.errors.invalidEmail');
            if (!password) errs.password = t('registerPage.errors.required');
            else if (password.length < 8) errs.password = t('registerPage.errors.minPassword');
            if (password !== confirmPassword) errs.confirmPassword = t('registerPage.errors.passwordMismatch');
        }
        if (step === 3 && role === 'driver') {
            if (!vehicleType) errs.vehicleType = t('registerPage.errors.selectVehicle');
            if (!licensePlate.trim()) errs.licensePlate = t('registerPage.errors.required');
            if (!idNumber.trim()) errs.idNumber = t('registerPage.errors.required');
        }
        if (step === 3 && role === 'broker') {
            if (!companyNameEn.trim()) errs.companyNameEn = t('registerPage.errors.required');
            if (!crNumber.trim()) errs.crNumber = t('registerPage.errors.required');
            if (!freelanceDocument.trim()) errs.freelanceDocument = t('registerPage.errors.required');
        }
        if (step === 4) {
            if (!acceptTerms) errs.terms = t('registerPage.errors.acceptTerms');
            if (!acceptPrivacy) errs.privacy = t('registerPage.errors.acceptPrivacy');
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const next = () => {
        if (!validate()) return;
        if (step < 4) setStep(step + 1);
    };

    const prev = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setApiLoading(true);
        setApiError('');
        try {
            const { success, error } = await signUpWithEmail(email, password);

            if (!success) {
                if (error?.includes('already registered')) {
                    setApiError('هذا البريد مسجل مسبقاً. جرب تسجيل الدخول.');
                } else {
                    setApiError(error || t('auth.networkError'));
                }
                setApiLoading(false);
                return;
            }

            // Store metadata to be saved in profile after email confirmation
            const profileData = {
                userType: role,
                fullNameEn,
                fullNameAr: fullNameAr || fullNameEn,
                email,
                phone: phone.startsWith('0') ? phone : `0${phone}`,
                details: role === 'driver' ? { vehicleType, licensePlate, idNumber, serviceAreas, iban } :
                    role === 'broker' ? { companyNameEn, companyNameAr, crNumber, taxNumber, freelanceDocument, iban } :
                        { companyName }
            };
            localStorage.setItem('jammal_pending_profile', JSON.stringify(profileData));

            setSubmitted(true);
        } catch (err) {
            setApiError('Network error. Please try again.');
        } finally {
            setApiLoading(false);
        }
    };

    const getStepLabel = (s: number) => {
        const labels = [
            t('registerPage.steps.role'),
            t('registerPage.steps.info'),
            role === 'customer' ? t('registerPage.steps.company') : t('registerPage.steps.details'),
            t('registerPage.steps.confirm'),
        ];
        return labels[s - 1];
    };

    if (submitted) {
        return (
            <div className="pub-auth-page">
                <div className="pub-auth-card pub-success-card">
                    <div className="pub-success-icon">📧</div>
                    <h2>{t('registerPage.successTitle')}</h2>
                    <p style={{ lineHeight: 1.8, color: 'rgba(255,255,255,0.8)' }}>
                        تم إنشاء حسابك بنجاح!<br />
                        تم إرسال رابط تأكيد إلى <strong style={{ color: '#D4A843' }}>{email}</strong><br />
                        الرجاء فتح بريدك الإلكتروني والضغط على رابط التأكيد لتفعيل حسابك.
                    </p>
                    <a href="/login" className="pub-btn pub-btn-primary pub-btn-lg" style={{ marginTop: 24 }}>
                        {t('registerPage.goToLogin')}
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="pub-auth-page">
            <div className="pub-auth-card pub-auth-wide">
                <div className="pub-auth-logo">
                    <img src="/jammal-logo.png" alt="Jammal | جمّال" style={{ height: '80px' }} />
                </div>
                {/* Progress */}
                <div className="pub-reg-progress">
                    {[1, 2, 3, 4].map((s) => (
                        <div key={s} className={`pub-reg-step ${s <= step ? 'active' : ''} ${s < step ? 'done' : ''}`}>
                            <div className="pub-reg-step-dot">{s < step ? '✓' : s}</div>
                            <span>{getStepLabel(s)}</span>
                        </div>
                    ))}
                </div>

                {/* ── Step 1: Role Selection ── */}
                {step === 1 && (
                    <div className="pub-reg-body">
                        <h2>{t('registerPage.chooseType')}</h2>
                        <p className="pub-reg-subtitle">{t('registerPage.selectUsage')}</p>

                        <div className="pub-role-cards">
                            <button
                                className={`pub-role-card ${role === 'customer' ? 'selected' : ''}`}
                                onClick={() => setRole('customer')}
                            >
                                <div className="pub-role-icon">📦</div>
                                <h3>{t('registerPage.customerTitle')}</h3>
                                <p>{t('registerPage.customerDesc')}</p>
                            </button>
                            <button
                                className={`pub-role-card ${role === 'driver' ? 'selected' : ''}`}
                                onClick={() => setRole('driver')}
                            >
                                <div className="pub-role-icon">🚛</div>
                                <h3>{t('registerPage.driverTitle')}</h3>
                                <p>{t('registerPage.driverDesc')}</p>
                            </button>
                            <button
                                className={`pub-role-card ${role === 'broker' ? 'selected' : ''}`}
                                onClick={() => setRole('broker')}
                            >
                                <div className="pub-role-icon">🏢</div>
                                <h3>{t('registerPage.brokerTitle')}</h3>
                                <p>{t('registerPage.brokerDesc')}</p>
                            </button>
                        </div>
                        {errors.role && <p className="pub-form-error">{errors.role}</p>}
                    </div>
                )}

                {/* ── Step 2: Basic Info ── */}
                {step === 2 && (
                    <div className="pub-reg-body">
                        <h2>{t('registerPage.yourInfo')}</h2>
                        <p className="pub-reg-subtitle">{t('registerPage.infoSubtitle')}</p>

                        <div className="pub-form-grid">
                            <div className="pub-form-group">
                                <label>{t('registerPage.fullNameEn')}</label>
                                <input type="text" placeholder={t('registerPage.fullNameEnPlaceholder')} value={fullNameEn} onChange={(e) => setFullNameEn(e.target.value)} />
                                {errors.fullNameEn && <span className="pub-form-error">{errors.fullNameEn}</span>}
                            </div>
                            <div className="pub-form-group">
                                <label>{t('registerPage.fullNameAr')}</label>
                                <input type="text" dir="rtl" placeholder={t('registerPage.fullNameArPlaceholder')} value={fullNameAr} onChange={(e) => setFullNameAr(e.target.value)} />
                            </div>
                            <div className="pub-form-group">
                                <label>{t('registerPage.mobile')}</label>
                                <input type="tel" placeholder={t('auth.phonePlaceholder')} value={phone} onChange={(e) => setPhone(e.target.value)} />
                                {errors.phone && <span className="pub-form-error">{errors.phone}</span>}
                            </div>
                            <div className="pub-form-group">
                                <label>{t('registerPage.email')}</label>
                                <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                                {errors.email && <span className="pub-form-error">{errors.email}</span>}
                            </div>
                            <div className="pub-form-group">
                                <label>{t('registerPage.password')}</label>
                                <input type="password" placeholder={t('registerPage.passwordPlaceholder')} value={password} onChange={(e) => setPassword(e.target.value)} />
                                {errors.password && <span className="pub-form-error">{errors.password}</span>}
                            </div>
                            <div className="pub-form-group">
                                <label>{t('registerPage.confirmPassword')}</label>
                                <input type="password" placeholder={t('registerPage.confirmPasswordPlaceholder')} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                {errors.confirmPassword && <span className="pub-form-error">{errors.confirmPassword}</span>}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Step 3: Role-Specific ── */}
                {step === 3 && role === 'customer' && (
                    <div className="pub-reg-body">
                        <h2>{t('registerPage.companyDetails')}</h2>
                        <p className="pub-reg-subtitle">{t('registerPage.companySubtitle')}</p>

                        <div className="pub-form-grid">
                            <div className="pub-form-group full">
                                <label>{t('registerPage.companyName')}</label>
                                <input type="text" placeholder={t('registerPage.companyPlaceholder')} value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && role === 'driver' && (
                    <div className="pub-reg-body">
                        <h2>{t('registerPage.vehicleDetails')}</h2>
                        <p className="pub-reg-subtitle">{t('registerPage.vehicleSubtitle')}</p>

                        <div className="pub-form-grid">
                            <div className="pub-form-group">
                                <label>{t('auth.vehicleType')}</label>
                                <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
                                    <option value="">{t('auth.selectVehicle')}</option>
                                    {VEHICLE_TYPES.map((vt) => (
                                        <option key={vt.value} value={vt.value}>{t(vt.labelKey)}</option>
                                    ))}
                                </select>
                                {errors.vehicleType && <span className="pub-form-error">{errors.vehicleType}</span>}
                            </div>
                            <div className="pub-form-group">
                                <label>{t('auth.idNumber')}</label>
                                <input type="text" placeholder={t('auth.idPlaceholder')} value={idNumber} onChange={(e) => setIdNumber(e.target.value)} />
                                {errors.idNumber && <span className="pub-form-error">{errors.idNumber}</span>}
                            </div>
                            <div className="pub-form-group">
                                <label>{t('auth.licensePlate')}</label>
                                <input type="text" placeholder={t('auth.platePlaceholder')} value={licensePlate} onChange={(e) => setLicensePlate(e.target.value)} />
                                {errors.licensePlate && <span className="pub-form-error">{errors.licensePlate}</span>}
                            </div>
                            <div className="pub-form-group full">
                                <label>{t('registerPage.serviceAreas')}</label>
                                <div className="pub-chips">
                                    {SAUDI_CITIES.map((city) => (
                                        <button
                                            key={city}
                                            type="button"
                                            className={`pub-chip ${serviceAreas.includes(city) ? 'active' : ''}`}
                                            onClick={() =>
                                                setServiceAreas((prev) =>
                                                    prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
                                                )
                                            }
                                        >
                                            {city}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="pub-form-group full">
                                <label>{t('registerPage.ibanLabel')}</label>
                                <input type="text" placeholder={t('auth.ibanPlaceholder')} value={iban} onChange={(e) => setIban(e.target.value)} />
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && role === 'broker' && (
                    <div className="pub-reg-body">
                        <h2>{t('registerPage.businessInfo')}</h2>
                        <p className="pub-reg-subtitle">{t('registerPage.businessSubtitle')}</p>

                        <div className="pub-form-grid">
                            <div className="pub-form-group">
                                <label>{t('auth.companyNameEn')}</label>
                                <input type="text" placeholder={t('auth.companyNameEnPlaceholder')} value={companyNameEn} onChange={(e) => setCompanyNameEn(e.target.value)} />
                                {errors.companyNameEn && <span className="pub-form-error">{errors.companyNameEn}</span>}
                            </div>
                            <div className="pub-form-group">
                                <label>{t('auth.companyNameAr')}</label>
                                <input type="text" dir="rtl" placeholder={t('auth.companyNameArPlaceholder')} value={companyNameAr} onChange={(e) => setCompanyNameAr(e.target.value)} />
                            </div>
                            <div className="pub-form-group">
                                <label>{t('auth.commercialReg')}</label>
                                <input type="text" placeholder={t('auth.crPlaceholder')} value={crNumber} onChange={(e) => setCrNumber(e.target.value)} />
                                {errors.crNumber && <span className="pub-form-error">{errors.crNumber}</span>}
                            </div>
                            <div className="pub-form-group">
                                <label>{t('auth.freelanceDocument')}</label>
                                <input type="text" placeholder={t('auth.freelancePlaceholder')} value={freelanceDocument} onChange={(e) => setFreelanceDocument(e.target.value)} />
                                {errors.freelanceDocument && <span className="pub-form-error">{errors.freelanceDocument}</span>}
                            </div>
                            <div className="pub-form-group">
                                <label>{t('auth.taxNumber')}</label>
                                <input type="text" placeholder={t('auth.taxPlaceholder')} value={taxNumber} onChange={(e) => setTaxNumber(e.target.value)} />
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Step 4: Confirm ── */}
                {step === 4 && (
                    <div className="pub-reg-body">
                        <h2>{t('registerPage.reviewTitle')}</h2>
                        <p className="pub-reg-subtitle">{t('registerPage.reviewSubtitle')}</p>

                        <div className="pub-review-summary">
                            <div className="pub-review-row">
                                <span>{t('registerPage.accountType')}</span>
                                <strong style={{ textTransform: 'capitalize' }}>{role}</strong>
                            </div>
                            <div className="pub-review-row">
                                <span>{t('registerPage.name')}</span>
                                <strong>{fullNameEn || '—'}</strong>
                            </div>
                            <div className="pub-review-row">
                                <span>{t('registerPage.phone')}</span>
                                <strong>{phone || '—'}</strong>
                            </div>
                            <div className="pub-review-row">
                                <span>{t('registerPage.email')}</span>
                                <strong>{email || '—'}</strong>
                            </div>
                        </div>

                        <div className="pub-form-checks">
                            <label className="pub-checkbox-label">
                                <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} />
                                <span>{t('registerPage.agreeTerms')} <a href="#">{t('registerPage.termsOfService')}</a></span>
                            </label>
                            {errors.terms && <p className="pub-form-error">{errors.terms}</p>}
                            <label className="pub-checkbox-label">
                                <input type="checkbox" checked={acceptPrivacy} onChange={(e) => setAcceptPrivacy(e.target.checked)} />
                                <span>{t('registerPage.agreePrivacy')} <a href="#">{t('registerPage.privacyPolicy')}</a></span>
                            </label>
                            {errors.privacy && <p className="pub-form-error">{errors.privacy}</p>}
                        </div>

                        {apiError && <p className="pub-form-error" style={{ textAlign: 'center', marginTop: 12 }}>{apiError}</p>}
                    </div>
                )}

                {/* ── Navigation ── */}
                <div className="pub-reg-nav">
                    {step > 1 && (
                        <button className="pub-btn pub-btn-ghost" onClick={prev}>
                            {t('registerPage.back')}
                        </button>
                    )}
                    <div style={{ flex: 1 }} />
                    {step < 4 ? (
                        <button className="pub-btn pub-btn-primary" onClick={next}>
                            {t('registerPage.continue')}
                        </button>
                    ) : (
                        <button className="pub-btn pub-btn-accent pub-btn-lg" onClick={handleSubmit} disabled={apiLoading}>
                            {apiLoading ? '...' : t('registerPage.createAccount')}
                        </button>
                    )}
                </div>

                <p className="pub-auth-switch">
                    {t('registerPage.alreadyHaveAccount')} <a href="/login">{t('registerPage.logIn')}</a>
                </p>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    const { t } = useTranslation();
    return (
        <Suspense fallback={
            <div className="pub-auth-page">
                <div className="pub-auth-card pub-auth-wide">
                    <div style={{ padding: '40px', textAlign: 'center' }}>{t('common.loading')}</div>
                </div>
            </div>
        }>
            <RegisterForm />
        </Suspense>
    );
}
