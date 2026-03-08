'use client'

import { MapPin, Truck, Clock, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

interface MapStat {
  label: string
  value: number
  icon: typeof MapPin
  color: string
}

const mapStats: MapStat[] = [
  { label: 'Drivers Online', value: 43, icon: Truck, color: 'text-emerald-500' },
  { label: 'In Transit', value: 24, icon: MapPin, color: 'text-cyan-500' },
  { label: 'At Pickup', value: 7, icon: Clock, color: 'text-amber-500' },
  { label: 'Completed Today', value: 31, icon: CheckCircle2, color: 'text-purple-500' },
]

export function LiveMapPreview() {
  return (
    <div className="bg-card rounded-xl border overflow-hidden">
      <div className="p-5 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Live Tracking</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Real-time driver and shipment locations
            </p>
          </div>
          <Link
            href="/admin/live-map"
            className="text-sm font-medium text-[var(--accent)] hover:underline"
          >
            Full Map
          </Link>
        </div>
      </div>

      {/* Map placeholder with Saudi Arabia outline */}
      <div className="relative aspect-[16/9] bg-gradient-to-br from-[var(--primary)]/5 to-[var(--primary)]/10">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">🇸🇦</div>
            <p className="text-lg font-semibold text-[var(--primary)]">Saudi Arabia</p>
            <p className="text-xs text-muted-foreground mt-1">
              Connect Google Maps API for live tracking
            </p>
          </div>

          {/* Animated driver markers */}
          <div className="absolute top-[30%] left-[35%] animate-pulse">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
          </div>
          <div className="absolute top-[45%] left-[60%] animate-pulse delay-100">
            <div className="w-3 h-3 rounded-full bg-cyan-500 shadow-lg shadow-cyan-500/50" />
          </div>
          <div className="absolute top-[60%] left-[25%] animate-pulse delay-200">
            <div className="w-3 h-3 rounded-full bg-amber-500 shadow-lg shadow-amber-500/50" />
          </div>
          <div className="absolute top-[55%] left-[70%] animate-pulse delay-300">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
          </div>
        </div>
      </div>

      {/* Stats footer */}
      <div className="grid grid-cols-4 divide-x border-t">
        {mapStats.map((stat) => (
          <div key={stat.label} className="p-4 text-center">
            <div className="flex justify-center mb-2">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className="text-xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
