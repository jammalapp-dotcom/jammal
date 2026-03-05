/* ============================================================================
 * جمّال — سياق اللغة للويب
 * يدعم العربية والإنجليزية مع RTL
 * ========================================================================== */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

// ملفات الترجمة
import en from '../locales/en.json';
import ar from '../locales/ar.json';

// تهيئة i18next
i18next.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        ar: { translation: ar },
    },
    lng: 'ar',
    fallbackLng: 'ar',
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
});

interface LanguageContextType {
    language: 'en' | 'ar';
    setLanguage: (lang: 'en' | 'ar') => void;
    isRTL: boolean;
    ready: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<'en' | 'ar'>('ar');
    const [isRTL, setIsRTL] = useState(true);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        try {
            const savedLang = localStorage.getItem('jammal-lang');
            const browserLang = navigator.language.startsWith('ar') ? 'ar' : 'en';
            const initialLang = (savedLang as 'en' | 'ar') || browserLang;

            setLanguageState(initialLang);
            setIsRTL(initialLang === 'ar');
            i18next.changeLanguage(initialLang);

            document.documentElement.lang = initialLang;
            document.documentElement.dir = initialLang === 'ar' ? 'rtl' : 'ltr';
        } catch { }
        setReady(true);
    }, []);

    const setLanguage = (lang: 'en' | 'ar') => {
        setLanguageState(lang);
        setIsRTL(lang === 'ar');
        i18next.changeLanguage(lang);

        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem('jammal-lang', lang);
                document.documentElement.lang = lang;
                document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
            } catch { }
        }
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, isRTL, ready }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        return { language: 'ar' as const, setLanguage: () => { }, isRTL: true, ready: true };
    }
    return context;
}
