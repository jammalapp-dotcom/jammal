/* ============================================================================
 * جمّال — صفحة تسجيل الدخول (Supabase OTP)
 * تستخدم نفس نظام المصادقة الموحد مع الموبايل
 * ========================================================================== */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useSupabase } from '../../../src/context/SupabaseContext';

export default function LoginPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const { sendOtp, verifyOtp } = useSupabase();

    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(0);

    const [isVerifying, setIsVerifying] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const p = params.get('phone');
            if (p) {
                setPhone(p);
                // If we have a phone, maybe we just came from register
                if (params.get('verify') === 'true') {
                    setIsVerifying(true);
                    setStep('otp'); // Go straight to OTP if we theoretically just triggered it
                }
            }
        }
    }, []);

    // إرسال رمز OTP
    const handleSendOtp = async () => {
        setError('');
        if (!phone.trim()) {
            setError(t('auth.phoneNumber') + ' مطلوب');
            return;
        }

        setLoading(true);
        const success = await sendOtp(phone);
        setLoading(false);

        if (success) {
            setStep('otp');
            setCountdown(60);
            startCountdown();
        } else {
            setError(t('auth.networkError'));
        }
    };

    // التحقق من OTP
    const handleVerifyOtp = async () => {
        setError('');
        if (otp.length !== 6) {
            setError(t('auth.invalidOtp'));
            return;
        }

        setLoading(true);
        const result = await verifyOtp(phone, otp);
        setLoading(false);

        if (result.success) {
            // توجيه حسب الدور
            if (result.role === 'manager') {
                router.push('/admin');
            } else {
                router.push('/dashboard');
            }
        } else {
            setError(t('auth.verificationFailed'));
        }
    };

    const startCountdown = () => {
        let count = 60;
        const interval = setInterval(() => {
            count--;
            setCountdown(count);
            if (count <= 0) clearInterval(interval);
        }, 1000);
    };

    return (
        <div className="pub-auth-page">
            <div className="pub-auth-card">
                <div className="pub-auth-logo">
                    <h1 style={{ fontSize: '36px', fontWeight: 700, color: '#C8973E' }}>جمّال</h1>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginTop: '4px' }}>
                        سوق الشحن السعودي
                    </p>
                </div>

                <h2>{t('auth.login')}</h2>

                {step === 'phone' ? (
                    <div className="pub-form-grid single-col">
                        <div className="pub-form-group full">
                            <label>{t('auth.phoneNumber')}</label>
                            <input
                                type="tel"
                                dir="ltr"
                                placeholder="05XXXXXXXX"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                                style={{ letterSpacing: '2px', textAlign: 'center' }}
                                autoFocus
                            />
                        </div>

                        {error && <p className="pub-form-error full">{error}</p>}

                        <button
                            className="pub-btn pub-btn-primary pub-btn-lg pub-btn-block"
                            onClick={handleSendOtp}
                            disabled={loading}
                        >
                            {loading ? t('common.loading') + '...' : t('auth.sendCode') + ' →'}
                        </button>
                    </div>
                ) : (
                    <div className="pub-form-grid single-col">
                        <p className="pub-reg-subtitle">{t('auth.enterOtp')}</p>

                        <div className="pub-form-group full">
                            <label>{t('auth.verificationCode')}</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={6}
                                placeholder="—— —— ——"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                onKeyDown={(e) => e.key === 'Enter' && handleVerifyOtp()}
                                style={{ letterSpacing: '12px', textAlign: 'center', fontSize: '24px', fontWeight: 700 }}
                                autoFocus
                            />
                        </div>

                        {error && <p className="pub-form-error full">{error}</p>}

                        <button
                            className="pub-btn pub-btn-primary pub-btn-lg pub-btn-block"
                            onClick={handleVerifyOtp}
                            disabled={loading || otp.length !== 6}
                        >
                            {loading ? t('common.loading') + '...' : t('auth.verify') + ' →'}
                        </button>

                        <div style={{ textAlign: 'center' }}>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
                                {t('auth.didntReceiveCode')}
                            </p>
                            <button
                                onClick={() => { setStep('phone'); setOtp(''); }}
                                disabled={countdown > 0}
                                style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: countdown > 0 ? 'rgba(255,255,255,0.3)' : '#D4A843',
                                    fontSize: '14px', marginTop: '4px',
                                }}
                            >
                                {countdown > 0
                                    ? `${t('auth.resendIn')} ${countdown}s`
                                    : t('auth.resendCode')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
