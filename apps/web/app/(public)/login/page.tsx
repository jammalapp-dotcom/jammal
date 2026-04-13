/* ============================================================================
 * جمّال — صفحة تسجيل الدخول
 * تسجيل دخول بالبريد الإلكتروني + كلمة المرور (مجاني مع Supabase)
 * ========================================================================== */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useSupabase } from '../../../src/context/SupabaseContext';

export default function LoginPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const { signInWithEmail } = useSupabase();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        setError('');
        if (!email.trim()) {
            setError(t('auth.email') + ' مطلوب');
            return;
        }
        if (!password.trim()) {
            setError(t('auth.password') + ' مطلوب');
            return;
        }

        setLoading(true);
        const result = await signInWithEmail(email, password);
        setLoading(false);

        if (result.success) {
            if (result.role === 'manager') {
                router.push('/admin');
            } else {
                router.push('/dashboard');
            }
        } else {
            // Translate common errors
            if (result.error?.includes('Invalid login')) {
                setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
            } else if (result.error?.includes('Email not confirmed')) {
                setError('الرجاء تأكيد بريدك الإلكتروني أولاً. تفقد بريدك الوارد.');
            } else {
                setError(result.error || t('auth.networkError'));
            }
        }
    };

    return (
        <div className="pub-auth-page">
            <div className="pub-auth-card">
                <div className="pub-auth-logo">
                    <img src="/jammal-logo.png" alt="جمّال" style={{ height: '80px' }} />
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginTop: '8px' }}>
                        سوق الشحن السعودي
                    </p>
                </div>

                <h2>{t('auth.login')}</h2>
                <p className="pub-reg-subtitle" style={{ marginBottom: '24px' }}>
                    {t('auth.loginSubtitle')}
                </p>

                <div className="pub-form-grid single-col">
                    <div className="pub-form-group full">
                        <label>{t('auth.email')}</label>
                        <input
                            type="email"
                            dir="ltr"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && document.getElementById('password-input')?.focus()}
                            style={{ textAlign: 'left' }}
                            autoFocus
                        />
                    </div>

                    <div className="pub-form-group full">
                        <label>{t('auth.password')}</label>
                        <input
                            id="password-input"
                            type="password"
                            dir="ltr"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                            style={{ textAlign: 'left' }}
                        />
                    </div>

                    {error && <p className="pub-form-error full">{error}</p>}

                    <button
                        className="pub-btn pub-btn-primary pub-btn-lg pub-btn-block"
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? t('common.loading') + '...' : t('auth.login') + ' →'}
                    </button>
                </div>

                <p className="pub-auth-switch" style={{ marginTop: '24px' }}>
                    {t('auth.noAccount')}{' '}
                    <a href="/register">{t('auth.createAccount')}</a>
                </p>
            </div>
        </div>
    );
}
