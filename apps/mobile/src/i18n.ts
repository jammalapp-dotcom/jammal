// ============================================================================
// JAMMAL — i18n Configuration (English + Arabic RTL/LTR)
// ============================================================================

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ar from './locales/ar.json';

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        ar: { translation: ar },
    },
    lng: 'ar', // Default to Arabic for Saudi market
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
    react: {
        useSuspense: false,
    },
});

export default i18n;
