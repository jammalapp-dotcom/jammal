/* ============================================================================
 * JAMMAL — Public Layout
 * Top navbar + footer for all public-facing pages
 * ========================================================================== */

'use client';

import { useState } from 'react';
import LanguageSwitcher from '../../src/components/LanguageSwitcher';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            {/* ── Navbar ── */}
            <header className="pub-navbar">
                <div className="pub-container pub-navbar-inner">
                    <a href="/" className="pub-navbar-brand">
                        <img src="/logo.png" alt="Jammal" className="pub-navbar-logo" />
                        <span className="pub-navbar-name">JAMMAL</span>
                    </a>

                    <nav className={`pub-navbar-links ${mobileMenuOpen ? 'open' : ''}`}>
                        <a href="/#how-it-works">How It Works</a>
                        <a href="/#for-customers">For Customers</a>
                        <a href="/#for-drivers">For Drivers</a>
                        <a href="/#vehicles">Vehicles</a>
                    </nav>

                    <div className="pub-navbar-actions">
                        <LanguageSwitcher />
                        <a href="/login" className="pub-btn pub-btn-ghost">Log In</a>
                        <a href="/register" className="pub-btn pub-btn-primary">Register</a>
                    </div>

                    <button
                        className="pub-mobile-toggle"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span /><span /><span />
                    </button>
                </div>
            </header>

            {/* ── Page Content ── */}
            <main>{children}</main>

            {/* ── Footer ── */}
            <footer className="pub-footer">
                <div className="pub-container">
                    <div className="pub-footer-grid">
                        <div className="pub-footer-brand">
                            <img src="/logo.png" alt="Jammal" className="pub-footer-logo" />
                            <p>Saudi Arabia&apos;s trusted freight marketplace.<br />Connecting shippers with reliable drivers across the Kingdom.</p>
                            <div className="pub-footer-socials">
                                <a href="#" aria-label="Twitter">𝕏</a>
                                <a href="#" aria-label="LinkedIn">in</a>
                                <a href="#" aria-label="Instagram">📷</a>
                            </div>
                        </div>
                        <div className="pub-footer-col">
                            <h4>Platform</h4>
                            <a href="/#how-it-works">How It Works</a>
                            <a href="/#for-customers">For Customers</a>
                            <a href="/#for-drivers">For Drivers</a>
                            <a href="/#vehicles">Vehicle Types</a>
                        </div>
                        <div className="pub-footer-col">
                            <h4>Company</h4>
                            <a href="#">About Us</a>
                            <a href="#">Careers</a>
                            <a href="#">Contact</a>
                            <a href="#">Blog</a>
                        </div>
                        <div className="pub-footer-col">
                            <h4>Legal</h4>
                            <a href="#">Terms of Service</a>
                            <a href="#">Privacy Policy</a>
                            <a href="#">Cookie Policy</a>
                        </div>
                    </div>
                    <div className="pub-footer-bottom">
                        <p>&copy; 2026 Jammal. All rights reserved. | جمّال — المملكة العربية السعودية</p>
                    </div>
                </div>
            </footer>
        </>
    );
}
