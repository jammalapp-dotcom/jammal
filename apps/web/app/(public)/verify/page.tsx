/* ============================================================================
 * جمّال — صفحة التحقق من OTP (Supabase)
 * تم تحديثها لاستخدام Supabase بدلاً من API القديم
 * ========================================================================== */

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useSupabase } from '../../../src/context/SupabaseContext';

function VerifyContent() {
    const { t } = useTranslation();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { verifyOtp } = useSupabase();

    const [phone, setPhone] = useState<string>('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        const p = searchParams.get('phone');
        if (p) setPhone(p);

        const storedPhone = localStorage.getItem('pendingPhone');
        if (storedPhone && !p) setPhone(storedPhone);
    }, [searchParams]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleVerify = async () => {
        setError('');
        if (!otp.trim() || otp.length !== 6) {
            setError(t('auth.invalidOtp') || 'Please enter a valid 6-digit code');
            return;
        }
        if (!phone) {
            setError('Phone number is missing');
            return;
        }

        setLoading(true);
        try {
            const result = await verifyOtp(phone, otp);

            if (result.success) {
                localStorage.removeItem('pendingPhone');
                if (result.role === 'manager') {
                    router.push('/admin');
                } else {
                    router.push('/dashboard');
                }
            } else {
                setError(t('auth.verificationFailed'));
            }
        } catch (err) {
            setError(t('auth.networkError') || 'Network error.');
        } finally {
            setLoading(false);
        }
    };

    if (!phone) {
        return (
            <div className="pub-auth-page">
                <div className="pub-auth-card">
                    <h2>{t('auth.verifyPhone')}</h2>
                    <p className="pub-form-error">
                        Invalid verification link. Please try logging in again.
                    </p>
                    <a href="/login" className="pub-btn pub-btn-primary">
                        {t('auth.login')}
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="pub-auth-page">
            <div className="pub-auth-card">
                <div className="pub-auth-logo">
                    <img src="/jammal-logo.png" alt="Jammal" style={{ height: '80px' }} />
                </div>

                <h2>{t('auth.verifyPhone')}</h2>
                <p className="pub-reg-subtitle">{t('auth.enterOtp')}</p>

                <div className="pub-form-grid single-col">
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
                            onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                            style={{ letterSpacing: '12px', textAlign: 'center', fontSize: '24px', fontWeight: 700 }}
                            autoFocus
                        />
                    </div>

                    {error && <p className="pub-form-error full">{error}</p>}

                    <button
                        className="pub-btn pub-btn-primary pub-btn-lg pub-btn-block"
                        onClick={handleVerify}
                        disabled={loading || otp.length !== 6}
                    >
                        {loading ? t('common.loading') + '...' : t('auth.verify') + ' →'}
                    </button>
                </div>

                <p className="pub-auth-switch">
                    <a href="/login">{t('auth.backToLogin')}</a>
                </p>
            </div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={
            <div className="pub-auth-page">
                <div className="pub-auth-card"><p>Loading...</p></div>
            </div>
        }>
            <VerifyContent />
        </Suspense>
    );
}
