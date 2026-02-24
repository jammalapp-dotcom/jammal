// ============================================================================
// JAMMAL — Language Switcher Component
// Toggle between English and Arabic with RTL support
// ============================================================================

'use client';

import { useLanguage } from '../context/LanguageContext';

export default function LanguageSwitcher() {
    const { language, setLanguage, isRTL } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ar' : 'en');
    };

    return (
        <button
            onClick={toggleLanguage}
            className="lang-switcher"
            aria-label={language === 'en' ? 'تبديل إلى اللغة العربية' : 'Switch to English'}
        >
            <span className="lang-switcher-flag">
                {language === 'en' ? '🇸🇦' : '🇬🇧'}
            </span>
            <span className="lang-switcher-text">
                {language === 'en' ? 'العربية' : 'English'}
            </span>
        </button>
    );
}