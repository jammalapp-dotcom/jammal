/* ============================================================================
 * JAMMAL — Login Page
 * Phone/Email + Password — client-side only
 * ========================================================================== */

'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function LoginPage() {
    const { t } = useTranslation();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = () => {
        setError('');
        if (!identifier.trim()) {
            setError(t('auth.phone') + ' ' + t('common.or') + ' ' + t('auth.email') + ' ' + t('auth.required'));
            return;
        }
        if (!password) {
            setError(t('auth.password') + ' ' + t('auth.required'));
            return;
        }

        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setError(t('auth.loginApiComing'));
        }, 1500);
    };

    return (
        <div className="pub-auth-page">
            <div className="pub-auth-card">
                <div className="pub-auth-logo">
                    <img src="/logo.png" alt="Jammal" style={{ height: '80px' }} />
                </div>

                <h2>{t('auth.login')}</h2>
                <p className="pub-reg-subtitle">{t('auth.loginSubtitle')}</p>

                <div className="pub-form-grid single-col">
                    <div className="pub-form-group full">
                        <label>{t('auth.phone')} {t('common.or')} {t('auth.email')}</label>
                        <input
                            type="text"
                            placeholder={t('auth.phonePlaceholder') + ' ' + t('common.or') + ' email@example.com'}
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                        />
                    </div>

                    <div className="pub-form-group full">
                        <label>{t('auth.password')}</label>
                        <input
                            type="password"
                            placeholder={t('auth.password') + '...'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        />
                    </div>

                    {error && <p className="pub-form-error full">{error}</p>}

                    <div className="pub-form-group full" style={{ textAlign: 'right' }}>
                        <a href="#" className="pub-link-muted">{t('auth.forgotPassword')}</a>
                    </div>

                    <button
                        className="pub-btn pub-btn-primary pub-btn-lg pub-btn-block"
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? t('auth.loggingIn') : t('auth.login') + ' →'}
                    </button>
                </div>

                <div className="pub-auth-divider">
                    <span>{t('common.or')}</span>
                </div>

                <div className="pub-social-btns">
                    <button className="pub-btn pub-btn-social" type="button">
                        <span>🍎</span> Apple
                    </button>
                    <button className="pub-btn pub-btn-social" type="button">
                        <span>G</span> Google
                    </button>
                </div>

                <p className="pub-auth-switch">
                    {t('auth.noAccount')} <a href="/register">{t('auth.createAccount')}</a>
                </p>
            </div>
        </div>
    );
}
