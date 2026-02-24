/* ============================================================================
 * JAMMAL — Registration Page
 * Multi-step form: Role → Basic Info → Role-Specific → Confirm
 * ========================================================================== */

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

type Role = 'customer' | 'driver' | 'broker';

const SAUDI_CITIES = [
    'Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam',
    'Khobar', 'Dhahran', 'Tabuk', 'Abha', 'Taif',
    'Hail', 'Jazan', 'Najran', 'Yanbu', 'Al Jubail',
];

const VEHICLE_TYPES = [
    { value: 'pickup', label: 'Pickup Truck' },
    { value: 'small_lorry', label: 'Small Lorry' },
    { value: 'medium_lorry', label: 'Medium Lorry' },
    { value: 'large_truck', label: 'Large Truck' },
    { value: 'refrigerated', label: 'Refrigerated' },
    { value: 'flatbed', label: 'Flatbed' },
    { value: 'tanker', label: 'Tanker' },
    { value: 'car_carrier', label: 'Car Carrier' },
    { value: 'crane_truck', label: 'Crane Truck' },
];

function RegisterForm() {
    const { t } = useTranslation();
    const searchParams = useSearchParams();
    const [step, setStep] = useState(1);
    const [role, setRole] = useState<Role | ''>('');
    const [submitted, setSubmitted] = useState(false);

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
        const r = searchParams.get('role');
        if (r === 'customer' || r === 'driver' || r === 'broker') {
            setRole(r);
            setStep(2);
        }
    }, [searchParams]);

    const validate = (): boolean => {
        const errs: Record<string, string> = {};

        if (step === 1 && !role) {
            errs.role = 'Please select a role';
        }
        if (step === 2) {
            if (!fullNameEn.trim()) errs.fullNameEn = 'Required';
            if (!phone.trim()) errs.phone = 'Required';
            else if (!/^05\d{8}$/.test(phone.replace(/\s/g, '')))
                errs.phone = 'Enter valid Saudi number (05xxxxxxxx)';
            if (!email.trim()) errs.email = 'Required';
            else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email';
            if (!password) errs.password = 'Required';
            else if (password.length < 8) errs.password = 'Min 8 characters';
            if (password !== confirmPassword) errs.confirmPassword = 'Passwords don\'t match';
        }
        if (step === 3 && role === 'driver') {
            if (!vehicleType) errs.vehicleType = 'Select vehicle type';
            if (!licensePlate.trim()) errs.licensePlate = 'Required';
            if (!idNumber.trim()) errs.idNumber = 'Required';
        }
        if (step === 3 && role === 'broker') {
            if (!companyNameEn.trim()) errs.companyNameEn = 'Required';
            if (!crNumber.trim()) errs.crNumber = 'Required';
            if (!freelanceDocument.trim()) errs.freelanceDocument = 'Required';
        }
        if (step === 4) {
            if (!acceptTerms) errs.terms = 'You must accept Terms of Service';
            if (!acceptPrivacy) errs.privacy = 'You must accept Privacy Policy';
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

    const handleSubmit = () => {
        if (!validate()) return;
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="pub-auth-page">
                <div className="pub-auth-card pub-success-card">
                    <div className="pub-success-icon">✅</div>
                    <h2>Registration Successful!</h2>
                    <p>
                        Your {role} account has been created.
                        {role === 'driver' && ' Your documents will be reviewed within 24 hours.'}
                        {role === 'broker' && ' Your business verification is in progress.'}
                        {role === 'customer' && ' You can start shipping right away.'}
                    </p>
                    <a href="/login" className="pub-btn pub-btn-primary pub-btn-lg" style={{ marginTop: 24 }}>
                        Go to Login →
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="pub-auth-page">
            <div className="pub-auth-card pub-auth-wide">
                <div className="pub-auth-logo">
                    <img src="/logo.png" alt="Jammal" style={{ height: '80px' }} />
                </div>
                {/* Progress */}
                <div className="pub-reg-progress">
                    {[1, 2, 3, 4].map((s) => (
                        <div key={s} className={`pub-reg-step ${s <= step ? 'active' : ''} ${s < step ? 'done' : ''}`}>
                            <div className="pub-reg-step-dot">{s < step ? '✓' : s}</div>
                            <span>{['Role', 'Info', role === 'customer' ? 'Company' : 'Details', 'Confirm'][s - 1]}</span>
                        </div>
                    ))}
                </div>

                {/* ── Step 1: Role Selection ── */}
                {step === 1 && (
                    <div className="pub-reg-body">
                        <h2>Choose Your Account Type</h2>
                        <p className="pub-reg-subtitle">Select how you want to use Jammal</p>

                        <div className="pub-role-cards">
                            <button
                                className={`pub-role-card ${role === 'customer' ? 'selected' : ''}`}
                                onClick={() => setRole('customer')}
                            >
                                <div className="pub-role-icon">📦</div>
                                <h3>Customer / Shipper</h3>
                                <p>I need to ship freight across Saudi Arabia</p>
                            </button>
                            <button
                                className={`pub-role-card ${role === 'driver' ? 'selected' : ''}`}
                                onClick={() => setRole('driver')}
                            >
                                <div className="pub-role-icon">🚛</div>
                                <h3>Driver / Truck Owner</h3>
                                <p>I have a vehicle and want to earn by transporting cargo</p>
                            </button>
                            <button
                                className={`pub-role-card ${role === 'broker' ? 'selected' : ''}`}
                                onClick={() => setRole('broker')}
                            >
                                <div className="pub-role-icon">🏢</div>
                                <h3>Freight Broker</h3>
                                <p>I manage shipments and a network of drivers</p>
                            </button>
                        </div>
                        {errors.role && <p className="pub-form-error">{errors.role}</p>}
                    </div>
                )}

                {/* ── Step 2: Basic Info ── */}
                {step === 2 && (
                    <div className="pub-reg-body">
                        <h2>Your Information</h2>
                        <p className="pub-reg-subtitle">We&apos;ll use this to create your {role} account</p>

                        <div className="pub-form-grid">
                            <div className="pub-form-group">
                                <label>Full Name (English) *</label>
                                <input type="text" placeholder="e.g. Mohammed Al-Salem" value={fullNameEn} onChange={(e) => setFullNameEn(e.target.value)} />
                                {errors.fullNameEn && <span className="pub-form-error">{errors.fullNameEn}</span>}
                            </div>
                            <div className="pub-form-group">
                                <label>Full Name (Arabic)</label>
                                <input type="text" dir="rtl" placeholder="مثال: محمد السالم" value={fullNameAr} onChange={(e) => setFullNameAr(e.target.value)} />
                            </div>
                            <div className="pub-form-group">
                                <label>Mobile Number *</label>
                                <input type="tel" placeholder="05xxxxxxxx" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                {errors.phone && <span className="pub-form-error">{errors.phone}</span>}
                            </div>
                            <div className="pub-form-group">
                                <label>Email *</label>
                                <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                                {errors.email && <span className="pub-form-error">{errors.email}</span>}
                            </div>
                            <div className="pub-form-group">
                                <label>Password *</label>
                                <input type="password" placeholder="Min 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
                                {errors.password && <span className="pub-form-error">{errors.password}</span>}
                            </div>
                            <div className="pub-form-group">
                                <label>Confirm Password *</label>
                                <input type="password" placeholder="Re-enter password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                {errors.confirmPassword && <span className="pub-form-error">{errors.confirmPassword}</span>}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Step 3: Role-Specific ── */}
                {step === 3 && role === 'customer' && (
                    <div className="pub-reg-body">
                        <h2>Company Details (Optional)</h2>
                        <p className="pub-reg-subtitle">For business accounts — skip if personal</p>

                        <div className="pub-form-grid">
                            <div className="pub-form-group full">
                                <label>Company Name</label>
                                <input type="text" placeholder="Your company name (optional)" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && role === 'driver' && (
                    <div className="pub-reg-body">
                        <h2>Vehicle &amp; Driver Details</h2>
                        <p className="pub-reg-subtitle">Tell us about your vehicle and service areas</p>

                        <div className="pub-form-grid">
                            <div className="pub-form-group">
                                <label>{t('auth.vehicleType')}</label>
                                <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
                                    <option value="">{t('auth.selectVehicle')}</option>
                                    {VEHICLE_TYPES.map((vt) => (
                                        <option key={vt.value} value={vt.value}>{vt.label}</option>
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
                                <label>Service Areas</label>
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
                                <label>IBAN (for payouts)</label>
                                <input type="text" placeholder="SA0000000000000000000000" value={iban} onChange={(e) => setIban(e.target.value)} />
                            </div>
                            <div className="pub-form-group full">
                                <label>Documents</label>
                                <div className="pub-doc-uploads">
                                    <div className="pub-doc-slot">
                                        <span>📄</span>
                                        <span>National ID / Iqama</span>
                                        <button type="button" className="pub-btn pub-btn-sm">Upload</button>
                                    </div>
                                    <div className="pub-doc-slot">
                                        <span>🪪</span>
                                        <span>Driver&apos;s License</span>
                                        <button type="button" className="pub-btn pub-btn-sm">Upload</button>
                                    </div>
                                    <div className="pub-doc-slot">
                                        <span>📋</span>
                                        <span>Vehicle Registration</span>
                                        <button type="button" className="pub-btn pub-btn-sm">Upload</button>
                                    </div>
                                    <div className="pub-doc-slot">
                                        <span>🛡️</span>
                                        <span>Vehicle Insurance</span>
                                        <button type="button" className="pub-btn pub-btn-sm">Upload</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && role === 'broker' && (
                    <div className="pub-reg-body">
                        <h2>Business Information</h2>
                        <p className="pub-reg-subtitle">Required for freight broker verification</p>

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
                        <h2>Review &amp; Confirm</h2>
                        <p className="pub-reg-subtitle">Almost there! Review your details and accept our terms.</p>

                        <div className="pub-review-summary">
                            <div className="pub-review-row">
                                <span>Account Type</span>
                                <strong style={{ textTransform: 'capitalize' }}>{role}</strong>
                            </div>
                            <div className="pub-review-row">
                                <span>Name</span>
                                <strong>{fullNameEn || '—'}</strong>
                            </div>
                            <div className="pub-review-row">
                                <span>Phone</span>
                                <strong>{phone || '—'}</strong>
                            </div>
                            <div className="pub-review-row">
                                <span>Email</span>
                                <strong>{email || '—'}</strong>
                            </div>
                            {role === 'driver' && (
                                <>
                                    <div className="pub-review-row">
                                        <span>{t('auth.vehicle')}</span>
                                        <strong>{VEHICLE_TYPES.find(v => v.value === vehicleType)?.label || '—'}</strong>
                                    </div>
                                    <div className="pub-review-row">
                                        <span>{t('auth.idNumber')}</span>
                                        <strong>{idNumber || '—'}</strong>
                                    </div>
                                    <div className="pub-review-row">
                                        <span>{t('auth.licensePlate')}</span>
                                        <strong>{licensePlate || '—'}</strong>
                                    </div>
                                </>
                            )}
                            {role === 'broker' && (
                                <>
                                    <div className="pub-review-row">
                                        <span>{t('auth.companyName')}</span>
                                        <strong>{companyNameEn || '—'}</strong>
                                    </div>
                                    <div className="pub-review-row">
                                        <span>{t('auth.crNumber')}</span>
                                        <strong>{crNumber || '—'}</strong>
                                    </div>
                                    <div className="pub-review-row">
                                        <span>{t('auth.freelanceDocument')}</span>
                                        <strong>{freelanceDocument ? '✓ Uploaded' : '—'}</strong>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="pub-form-checks">
                            <label className="pub-checkbox-label">
                                <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} />
                                <span>I agree to the <a href="#">Terms of Service</a></span>
                            </label>
                            {errors.terms && <p className="pub-form-error">{errors.terms}</p>}
                            <label className="pub-checkbox-label">
                                <input type="checkbox" checked={acceptPrivacy} onChange={(e) => setAcceptPrivacy(e.target.checked)} />
                                <span>I agree to the <a href="#">Privacy Policy</a></span>
                            </label>
                            {errors.privacy && <p className="pub-form-error">{errors.privacy}</p>}
                        </div>
                    </div>
                )}

                {/* ── Navigation ── */}
                <div className="pub-reg-nav">
                    {step > 1 && (
                        <button className="pub-btn pub-btn-ghost" onClick={prev}>
                            ← Back
                        </button>
                    )}
                    <div style={{ flex: 1 }} />
                    {step < 4 ? (
                        <button className="pub-btn pub-btn-primary" onClick={next}>
                            Continue →
                        </button>
                    ) : (
                        <button className="pub-btn pub-btn-accent pub-btn-lg" onClick={handleSubmit}>
                            Create Account ✓
                        </button>
                    )}
                </div>

                <p className="pub-auth-switch">
                    Already have an account? <a href="/login">Log in</a>
                </p>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={
            <div className="pub-auth-page">
                <div className="pub-auth-card pub-auth-wide">
                    <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>
                </div>
            </div>
        }>
            <RegisterForm />
        </Suspense>
    );
}
