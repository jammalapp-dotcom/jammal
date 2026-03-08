'use client'

import { cn } from '@/lib/utils'
import {
  Truck,
  Package,
  Wallet,
  TrendingUp,
  TrendingDown,
  MapPin,
  ArrowRight,
  Clock,
  CheckCircle2,
  User,
  Star,
  MoreHorizontal,
  Eye,
} from 'lucide-react'
import Link from 'next/link'

type DriverStatus = 'available' | 'on_trip' | 'offline'
type ShipmentStatus = 'assigned' | 'pickup' | 'en_route' | 'delivered'

interface Driver {
  id: string
  name: string
  status: DriverStatus
  vehicleType: string
  vehiclePlate: string
  rating: number
  currentShipment?: string
  lastActive?: string
}

interface Shipment {
  id: string
  pickup: string
  delivery: string
  driver: string
  status: ShipmentStatus
  price: number
  progress: number
}

const driverStatusConfig: Record<DriverStatus, { label: string; className: string }> = {
  available: {
    label: 'Available',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  on_trip: {
    label: 'On Trip',
    className: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  },
  offline: {
    label: 'Offline',
    className: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  },
}

const shipmentStatusConfig: Record<ShipmentStatus, { label: string; className: string }> = {
  assigned: {
    label: 'Assigned',
    className: 'bg-blue-100 text-blue-700',
  },
  pickup: {
    label: 'At Pickup',
    className: 'bg-purple-100 text-purple-700',
  },
  en_route: {
    label: 'In Transit',
    className: 'bg-cyan-100 text-cyan-700',
  },
  delivered: {
    label: 'Delivered',
    className: 'bg-emerald-100 text-emerald-700',
  },
}

const mockDrivers: Driver[] = [
  {
    id: '1',
    name: 'Khalid Al-Saud',
    status: 'on_trip',
    vehicleType: 'Heavy Truck',
    vehiclePlate: 'ABC 1234',
    rating: 4.8,
    currentShipment: 'JML-2024-001',
  },
  {
    id: '2',
    name: 'Saud Al-Mutairi',
    status: 'available',
    vehicleType: 'Medium Truck',
    vehiclePlate: 'XYZ 5678',
    rating: 4.9,
  },
  {
    id: '3',
    name: 'Abdullah Al-Shammari',
    status: 'on_trip',
    vehicleType: 'Heavy Truck',
    vehiclePlate: 'DEF 9012',
    rating: 4.6,
    currentShipment: 'JML-2024-004',
  },
  {
    id: '4',
    name: 'Fahad Al-Rashid',
    status: 'offline',
    vehicleType: 'Pickup Truck',
    vehiclePlate: 'GHI 3456',
    rating: 4.7,
    lastActive: '2 hours ago',
  },
  {
    id: '5',
    name: 'Mohammed Al-Harbi',
    status: 'available',
    vehicleType: 'Medium Truck',
    vehiclePlate: 'JKL 7890',
    rating: 4.5,
  },
]

const mockShipments: Shipment[] = [
  {
    id: 'JML-2024-001',
    pickup: 'Riyadh',
    delivery: 'Jeddah',
    driver: 'Khalid Al-Saud',
    status: 'en_route',
    price: 1250,
    progress: 65,
  },
  {
    id: 'JML-2024-004',
    pickup: 'Riyadh',
    delivery: 'Abha',
    driver: 'Abdullah Al-Shammari',
    status: 'pickup',
    price: 2100,
    progress: 15,
  },
  {
    id: 'JML-2024-007',
    pickup: 'Dammam',
    delivery: 'Riyadh',
    driver: 'Saud Al-Mutairi',
    status: 'assigned',
    price: 850,
    progress: 0,
  },
]

const stats = [
  {
    title: 'Total Vehicles',
    value: '25',
    change: { value: '+2 this month', trend: 'up' as const },
    icon: Truck,
    iconColor: 'bg-emerald-100 text-emerald-600',
  },
  {
    title: 'Active Shipments',
    value: '12',
    change: { value: '+3 from yesterday', trend: 'up' as const },
    icon: Package,
    iconColor: 'bg-cyan-100 text-cyan-600',
  },
  {
    title: 'Monthly Revenue',
    value: '45,600 SAR',
    change: { value: '+18% from last month', trend: 'up' as const },
    icon: Wallet,
    iconColor: 'bg-amber-100 text-amber-600',
  },
  {
    title: 'Available Drivers',
    value: '8',
    change: { value: '12 on trip, 5 offline', trend: 'neutral' as const },
    icon: User,
    iconColor: 'bg-purple-100 text-purple-600',
  },
]

export default function BrokerDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Fleet Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, Al-Fahd Logistics! Here is your fleet overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-card rounded-xl border p-5 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                <div className="flex items-center gap-1">
                  {stat.change.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                  ) : stat.change.trend === 'down' ? (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  ) : null}
                  <span
                    className={cn(
                      'text-xs font-medium',
                      stat.change.trend === 'up'
                        ? 'text-emerald-600'
                        : stat.change.trend === 'down'
                        ? 'text-red-600'
                        : 'text-muted-foreground'
                    )}
                  >
                    {stat.change.value}
                  </span>
                </div>
              </div>
              <div className={cn('p-3 rounded-lg', stat.iconColor)}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Shipments */}
        <div className="bg-card rounded-xl border">
          <div className="p-5 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Active Shipments</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Real-time shipment tracking
                </p>
              </div>
              <Link
                href="/broker/shipments"
                className="text-sm font-medium text-[var(--accent)] hover:underline"
              >
                View all
              </Link>
            </div>
          </div>

          <div className="divide-y">
            {mockShipments.map((shipment) => (
              <div key={shipment.id} className="p-5 hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="font-mono text-sm font-medium">{shipment.id}</span>
                    <div className="flex items-center gap-2 mt-1 text-sm">
                      <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                      <span>{shipment.pickup}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                      <MapPin className="h-3.5 w-3.5 text-red-500" />
                      <span>{shipment.delivery}</span>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'px-2.5 py-1 rounded-full text-xs font-medium',
                      shipmentStatusConfig[shipment.status].className
                    )}
                  >
                    {shipmentStatusConfig[shipment.status].label}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] rounded-full transition-all duration-500"
                      style={{ width: `${shipment.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1.5 text-xs text-muted-foreground">
                    <span>{shipment.driver}</span>
                    <span>{shipment.progress}% complete</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[var(--accent)]">
                    {shipment.price.toLocaleString()} SAR
                  </span>
                  <button className="p-1.5 rounded-md hover:bg-muted transition-colors">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fleet Status */}
        <div className="bg-card rounded-xl border">
          <div className="p-5 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Fleet Status</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Driver availability overview
                </p>
              </div>
              <Link
                href="/broker/fleet"
                className="text-sm font-medium text-[var(--accent)] hover:underline"
              >
                Manage fleet
              </Link>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 divide-x border-b">
            <div className="p-4 text-center">
              <div className="w-3 h-3 rounded-full bg-emerald-500 mx-auto mb-2" />
              <p className="text-lg font-bold">8</p>
              <p className="text-xs text-muted-foreground">Available</p>
            </div>
            <div className="p-4 text-center">
              <div className="w-3 h-3 rounded-full bg-cyan-500 mx-auto mb-2" />
              <p className="text-lg font-bold">12</p>
              <p className="text-xs text-muted-foreground">On Trip</p>
            </div>
            <div className="p-4 text-center">
              <div className="w-3 h-3 rounded-full bg-gray-400 mx-auto mb-2" />
              <p className="text-lg font-bold">5</p>
              <p className="text-xs text-muted-foreground">Offline</p>
            </div>
          </div>

          <div className="divide-y max-h-[400px] overflow-y-auto scrollbar-thin">
            {mockDrivers.map((driver) => (
              <div
                key={driver.id}
                className="p-4 hover:bg-muted/30 transition-colors flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-semibold text-sm shrink-0">
                  {driver.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{driver.name}</span>
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0',
                        driverStatusConfig[driver.status].className
                      )}
                    >
                      {driverStatusConfig[driver.status].label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                    <span>{driver.vehicleType}</span>
                    <span>•</span>
                    <span>{driver.vehiclePlate}</span>
                    {driver.currentShipment && (
                      <>
                        <span>•</span>
                        <span className="text-cyan-600">{driver.currentShipment}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium">{driver.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Completed */}
      <div className="bg-card rounded-xl border">
        <div className="p-5 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Recent Completed Shipments</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Last 7 days performance
              </p>
            </div>
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
                  Route
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                  Driver
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                  Completed
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                  Earnings
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {[
                { id: 'JML-2024-003', from: 'Jeddah', to: 'Medina', driver: 'Saud Al-Mutairi', completed: 'Yesterday', earnings: 620 },
                { id: 'JML-2024-002', from: 'Dammam', to: 'Riyadh', driver: 'Khalid Al-Saud', completed: '2 days ago', earnings: 850 },
                { id: 'JML-2023-998', from: 'Riyadh', to: 'Tabuk', driver: 'Abdullah Al-Shammari', completed: '3 days ago', earnings: 1450 },
                { id: 'JML-2023-995', from: 'Jeddah', to: 'Riyadh', driver: 'Fahad Al-Rashid', completed: '5 days ago', earnings: 1100 },
              ].map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-mono text-sm font-medium">{item.id}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span>{item.from}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{item.to}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm">{item.driver}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span className="text-muted-foreground">{item.completed}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-semibold text-[var(--accent)]">
                      {item.earnings.toLocaleString()} SAR
                    </span>
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
    </div>
  )
}
