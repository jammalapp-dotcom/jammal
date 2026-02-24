/* ============================================================================
 * JAMMAL — Root Layout (minimal shell)
 * Fonts + global CSS only; page-specific chrome lives in route group layouts
 * ========================================================================== */

import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '../src/context/LanguageContext';

export const metadata: Metadata = {
    title: 'Jammal — Saudi Arabia\'s Freight Marketplace | جمّال',
    description: 'Connect with trusted drivers and ship freight across Saudi Arabia. Instant quotes, live tracking, secure payments.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" dir="ltr">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Cairo:wght@400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                <LanguageProvider>
                    {children}
                </LanguageProvider>
            </body>
        </html>
    );
}
