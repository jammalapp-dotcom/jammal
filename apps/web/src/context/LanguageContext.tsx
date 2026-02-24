// ============================================================================
// JAMMAL — Language Context Provider
// Manages language state and RTL direction for the web app
// ============================================================================

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import i18n from '../i18n';

interface LanguageContextType {
    language: 'en' | 'ar';
    setLanguage: (lang: 'en' | 'ar') => void;
    isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<'en' | 'ar'>('en');
    const [isRTL, setIsRTL] = useState(false);

    // Initialize language from localStorage or browser preference
    useEffect(() => {
        const savedLang = localStorage.getItem('jammal-lang');
        const browserLang = navigator.language.startsWith('ar') ? 'ar' : 'en';
        const initialLang = (savedLang as 'en' | 'ar') || browserLang;
        
        setLanguageState(initialLang);
        setIsRTL(initialLang === 'ar');
        i18n.changeLanguage(initialLang);
        
        // Update document direction
        document.documentElement.lang = initialLang;
        document.documentElement.dir = initialLang === 'ar' ? 'rtl' : 'ltr';
    }, []);

    const setLanguage = (lang: 'en' | 'ar') => {
        setLanguageState(lang);
        setIsRTL(lang === 'ar');
        i18n.changeLanguage(lang);
        localStorage.setItem('jammal-lang', lang);
        
        // Update document direction
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, isRTL }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}