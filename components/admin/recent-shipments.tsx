'use client'

import { cn } from '@/lib/utils'
import { MapPin, ArrowRight, MoreHorizontal } from 'lucide-react'

type ShipmentStatus = 'searching' | 'assigned' | 'pickup' | 'en_route' | 'delivered' | 'cancelled'

interface Shipment {
  id: string
  customer: string
  pickup: string
  delivery: string
  driver?: string
  status: ShipmentStatus
  price: string
  createdAt: string
}

const statusConfig: Record<ShipmentStatus, { label: string; className: string }> = {
  searching: {
    label: 'Searching',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  assigned: {
    label: 'Assigned',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  pickup: {
    label: 'At Pickup',
    className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  },
  en_route: {
    label: 'In Transit',
    className: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  },
  delivered: {
    label: 'Delivered',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
}

const mockShipments: Shipment[] = [
  {
    id: 'JML-2024-001',
    customer: 'Mohammad Al-Ali',
    pickup: 'Riyadh',
    delivery: 'Jeddah',
    driver: 'Khalid Al-Saud',
    status: 'en_route',
    price: '1,250 SAR',
    createdAt: '2 hours ago',
  },
  {
    id: 'JML-2024-002',
    customer: 'Al-Fahd Trading Co.',
    pickup: 'Dammam',
    delivery: 'Riyadh',
    status: 'searching',
    price: '850 SAR',
    createdAt: '4 hours ago',
  },
  {
    id: 'JML-2024-003',
    customer: 'Ahmed Al-Harbi',
    pickup: 'Jeddah',
    delivery: 'Medina',
    driver: 'Saud Al-Mutairi',
    status: 'delivered',
    price: '620 SAR',
    createdAt: '6 hours ago',
  },
  {
    id: 'JML-2024-004',
    customer: 'Al-Bina Construction',
    pickup: 'Riyadh',
    delivery: 'Abha',
    driver: 'Abdullah Al-Shammari',
    status: 'assigned',
    price: '2,100 SAR',
    createdAt: '8 hours ago',
  },
  {
    id: 'JML-2024-005',
    customer: 'Fatimah Al-Qahtani',
    pickup: 'Tabuk',
    delivery: 'Riyadh',
    status: 'cancelled',
    price: '1,800 SAR',
    createdAt: '1 day ago',
  },
]

export function RecentShipments() {
  return (
    <div className="bg-card rounded-xl border">
      <div className="p-5 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Recent Shipments</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Latest shipment activity across the platform
            </p>
          </div>
          <button className="text-sm font-medium text-[var(--accent)] hover:underline">
            View all
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                ID
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                Customer
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                Route
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                Driver
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                Status
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                Price
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                Created
              </th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {mockShipments.map((shipment) => (
              <tr key={shipment.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-5 py-4">
                  <span className="font-mono text-sm font-medium">{shipment.id}</span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm">{shipment.customer}</span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{shipment.pickup}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{shipment.delivery}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm">{shipment.driver || '—'}</span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={cn(
                      'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
                      statusConfig[shipment.status].className
                    )}
                  >
                    {statusConfig[shipment.status].label}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm font-medium">{shipment.price}</span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm text-muted-foreground">{shipment.createdAt}</span>
                </td>
                <td className="px-5 py-4">
                  <button className="p-1.5 rounded-md hover:bg-muted transition-colors">
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
