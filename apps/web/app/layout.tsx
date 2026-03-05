/* ============================================================================
 * جمّال — التخطيط الجذري للويب
 * يوفر Supabase Provider + i18n + Theme CSS Variables
 * ========================================================================== */

import type { Metadata } from 'next';
import { LanguageProvider } from '../src/context/LanguageContext';
import { SupabaseProvider } from '../src/context/SupabaseContext';
import './globals.css';

export const metadata: Metadata = {
    title: 'جمّال | Jammal - سوق الشحن السعودي',
    description: 'منصة جمّال للشحن - Saudi Freight Marketplace. اطلب شحنتك، قارن العروض، وتابع شحنتك لحظة بلحظة.',
    keywords: ['شحن', 'نقل', 'سعودية', 'freight', 'shipping', 'jammal', 'جمال'],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ar" dir="rtl">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Tajawal:wght@400;500;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                <LanguageProvider>
                    <SupabaseProvider>
                        {children}
                    </SupabaseProvider>
                </LanguageProvider>
            </body>
        </html>
    );
}
