/* ============================================================================
 * JAMMAL — Admin Dashboard Layout (Section 12)
 * Sidebar navigation + main content area
 * ========================================================================== */

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="dashboard-layout">
            {/* ── Sidebar ── */}
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <div className="logo-icon">🐪</div>
                    <span className="logo-text">Jammal</span>
                </div>

                <nav className="sidebar-nav">
                    <a href="/admin" className="nav-item active">
                        <span className="nav-icon">📊</span>
                        <span>Dashboard</span>
                    </a>
                    <a href="/admin/shipments" className="nav-item">
                        <span className="nav-icon">📦</span>
                        <span>Shipments</span>
                    </a>
                    <a href="/admin/live-map" className="nav-item">
                        <span className="nav-icon">🗺️</span>
                        <span>Live Map</span>
                    </a>
                    <a href="/admin/drivers" className="nav-item">
                        <span className="nav-icon">🚛</span>
                        <span>Drivers</span>
                    </a>
                    <a href="/admin/brokers" className="nav-item">
                        <span className="nav-icon">🏢</span>
                        <span>Brokers</span>
                    </a>
                    <a href="/admin/customers" className="nav-item">
                        <span className="nav-icon">👥</span>
                        <span>Customers</span>
                    </a>
                    <a href="/admin/payments" className="nav-item">
                        <span className="nav-icon">💳</span>
                        <span>Payments</span>
                    </a>
                    <a href="/admin/verification" className="nav-item">
                        <span className="nav-icon">✅</span>
                        <span>Verification</span>
                    </a>

                    <div className="nav-divider" />

                    <a href="/admin/analytics" className="nav-item">
                        <span className="nav-icon">📈</span>
                        <span>Analytics</span>
                    </a>
                    <a href="/admin/notifications" className="nav-item">
                        <span className="nav-icon">🔔</span>
                        <span>Notifications</span>
                    </a>
                    <a href="/admin/settings" className="nav-item">
                        <span className="nav-icon">⚙️</span>
                        <span>Settings</span>
                    </a>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="user-avatar">A</div>
                        <div className="user-details">
                            <span className="user-name">Admin</span>
                            <span className="user-role">Super Admin</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ── Main Content ── */}
            <main className="main-content">{children}</main>
        </div>
    );
}
