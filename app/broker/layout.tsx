'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Package,
  Truck,
  Users,
  Wallet,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/broker', icon: LayoutDashboard },
  { name: 'Fleet', href: '/broker/fleet', icon: Truck },
  { name: 'Shipments', href: '/broker/shipments', icon: Package },
  { name: 'Drivers', href: '/broker/drivers', icon: Users },
  { name: 'Earnings', href: '/broker/earnings', icon: Wallet },
]

const secondaryNav = [
  { name: 'Analytics', href: '/broker/analytics', icon: BarChart3 },
  { name: 'Notifications', href: '/broker/notifications', icon: Bell },
  { name: 'Settings', href: '/broker/settings', icon: Settings },
]

export default function BrokerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const NavItem = ({ item }: { item: typeof navigation[0] }) => {
    const isActive = pathname === item.href
    return (
      <Link
        href={item.href}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
          isActive
            ? 'bg-[var(--accent)] text-white shadow-md'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        )}
        onClick={() => setSidebarOpen(false)}
      >
        <item.icon className="h-5 w-5 shrink-0" />
        <span>{item.name}</span>
      </Link>
    )
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <Link href="/broker" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center">
                <span className="text-xl text-white">J</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-[var(--primary)]">Jammal</span>
                <span className="text-[10px] text-muted-foreground -mt-1">Broker Portal</span>
              </div>
            </Link>
            <button
              className="lg:hidden p-1 rounded-md hover:bg-muted"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin">
            <div className="space-y-1">
              {navigation.map((item) => (
                <NavItem key={item.href} item={item} />
              ))}
            </div>

            <div className="border-t my-4" />

            <div className="space-y-1">
              {secondaryNav.map((item) => (
                <NavItem key={item.href} item={item} />
              ))}
            </div>
          </nav>

          {/* User section */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-[var(--primary)]/10 to-[var(--accent)]/10">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white font-semibold text-sm">
                AF
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Al-Fahd Logistics</p>
                <p className="text-xs text-muted-foreground truncate">25 vehicles</p>
              </div>
              <button className="p-1.5 rounded-md hover:bg-background text-muted-foreground hover:text-foreground transition-colors">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-card/80 backdrop-blur-sm border-b flex items-center px-4 lg:px-6 gap-4">
          <button
            className="lg:hidden p-2 rounded-md hover:bg-muted"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex-1" />
          
          <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--accent)] rounded-full" />
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
