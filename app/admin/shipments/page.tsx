'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Search,
  Filter,
  Download,
  MoreHorizontal,
  MapPin,
  ArrowRight,
  Calendar,
  Eye,
  MessageCircle,
  XCircle,
  CheckCircle2,
  Clock,
  Truck,
  Package,
} from 'lucide-react'

type ShipmentStatus = 'searching' | 'assigned' | 'pickup' | 'en_route' | 'delivered' | 'cancelled'

interface Shipment {
  id: string
  shortId: string
  customer: {
    name: string
    phone: string
  }
  pickup: {
    city: string
    address: string
  }
  delivery: {
    city: string
    address: string
  }
  cargo: {
    type: string
    weight: number
  }
  driver?: {
    name: string
    phone: string
    rating: number
    vehiclePlate: string
  }
  status: ShipmentStatus
  price: number
  bidsCount: number
  createdAt: string
  pickupDate: string
}

const statusConfig: Record<ShipmentStatus, { label: string; className: string; icon: typeof Package }> = {
  searching: {
    label: 'Searching',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    icon: Search,
  },
  assigned: {
    label: 'Assigned',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    icon: CheckCircle2,
  },
  pickup: {
    label: 'At Pickup',
    className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    icon: Clock,
  },
  en_route: {
    label: 'In Transit',
    className: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
    icon: Truck,
  },
  delivered: {
    label: 'Delivered',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    icon: CheckCircle2,
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    icon: XCircle,
  },
}

const mockShipments: Shipment[] = [
  {
    id: '1',
    shortId: 'JML-2024-001',
    customer: { name: 'Mohammad Al-Ali', phone: '+966 50 123 4567' },
    pickup: { city: 'Riyadh', address: 'Al Malqa District, Building 42' },
    delivery: { city: 'Jeddah', address: 'Al Rawdah District, Street 15' },
    cargo: { type: 'General Cargo', weight: 2500 },
    driver: { name: 'Khalid Al-Saud', phone: '+966 55 987 6543', rating: 4.8, vehiclePlate: 'ABC 1234' },
    status: 'en_route',
    price: 1250,
    bidsCount: 5,
    createdAt: '2024-01-15T10:30:00',
    pickupDate: '2024-01-16T08:00:00',
  },
  {
    id: '2',
    shortId: 'JML-2024-002',
    customer: { name: 'Al-Fahd Trading Co.', phone: '+966 11 456 7890' },
    pickup: { city: 'Dammam', address: 'Industrial City, Warehouse 7' },
    delivery: { city: 'Riyadh', address: 'Exit 15, Commercial Zone' },
    cargo: { type: 'Electronics', weight: 850 },
    status: 'searching',
    price: 850,
    bidsCount: 3,
    createdAt: '2024-01-15T08:15:00',
    pickupDate: '2024-01-17T14:00:00',
  },
  {
    id: '3',
    shortId: 'JML-2024-003',
    customer: { name: 'Ahmed Al-Harbi', phone: '+966 50 234 5678' },
    pickup: { city: 'Jeddah', address: 'Al Salamah District' },
    delivery: { city: 'Medina', address: 'Al Uyun, Block C' },
    cargo: { type: 'Furniture', weight: 1200 },
    driver: { name: 'Saud Al-Mutairi', phone: '+966 55 111 2222', rating: 4.9, vehiclePlate: 'XYZ 5678' },
    status: 'delivered',
    price: 620,
    bidsCount: 7,
    createdAt: '2024-01-14T16:45:00',
    pickupDate: '2024-01-15T09:00:00',
  },
  {
    id: '4',
    shortId: 'JML-2024-004',
    customer: { name: 'Al-Bina Construction', phone: '+966 11 333 4444' },
    pickup: { city: 'Riyadh', address: 'Al Yasmin, Construction Site' },
    delivery: { city: 'Abha', address: 'New Development Zone' },
    cargo: { type: 'Construction Materials', weight: 8500 },
    driver: { name: 'Abdullah Al-Shammari', phone: '+966 55 666 7777', rating: 4.6, vehiclePlate: 'DEF 9012' },
    status: 'assigned',
    price: 2100,
    bidsCount: 4,
    createdAt: '2024-01-15T06:00:00',
    pickupDate: '2024-01-16T05:00:00',
  },
  {
    id: '5',
    shortId: 'JML-2024-005',
    customer: { name: 'Fatimah Al-Qahtani', phone: '+966 50 888 9999' },
    pickup: { city: 'Tabuk', address: 'City Center, Shop 12' },
    delivery: { city: 'Riyadh', address: 'Al Olaya, Tower 5' },
    cargo: { type: 'Personal Items', weight: 350 },
    status: 'cancelled',
    price: 1800,
    bidsCount: 2,
    createdAt: '2024-01-13T12:00:00',
    pickupDate: '2024-01-14T10:00:00',
  },
  {
    id: '6',
    shortId: 'JML-2024-006',
    customer: { name: 'Saudi Auto Parts', phone: '+966 11 222 3333' },
    pickup: { city: 'Riyadh', address: 'Industrial Area, Gate 3' },
    delivery: { city: 'Dammam', address: 'Port Area, Terminal B' },
    cargo: { type: 'Auto Parts', weight: 3200 },
    driver: { name: 'Fahad Al-Rashid', phone: '+966 55 444 5555', rating: 4.7, vehiclePlate: 'GHI 3456' },
    status: 'pickup',
    price: 950,
    bidsCount: 6,
    createdAt: '2024-01-15T11:00:00',
    pickupDate: '2024-01-15T14:00:00',
  },
]

const filters = ['All', 'Searching', 'Assigned', 'In Transit', 'Delivered', 'Cancelled']

export default function ShipmentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)

  const filteredShipments = mockShipments.filter((shipment) => {
    const matchesSearch =
      shipment.shortId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.pickup.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.delivery.city.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter =
      activeFilter === 'All' ||
      statusConfig[shipment.status].label === activeFilter ||
      (activeFilter === 'In Transit' && shipment.status === 'en_route')

    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Shipments</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all shipments across the platform
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-white font-medium hover:opacity-90 transition-opacity">
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-xl border p-4 space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by ID, customer, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]"
            />
          </div>

          {/* Filter button */}
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border hover:bg-muted transition-colors">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filters</span>
          </button>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                activeFilter === filter
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                  Shipment
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                  Customer
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                  Route
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                  Cargo
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
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredShipments.map((shipment) => {
                const StatusIcon = statusConfig[shipment.status].icon
                return (
                  <tr
                    key={shipment.id}
                    className="hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedShipment(shipment)}
                  >
                    <td className="px-5 py-4">
                      <div>
                        <span className="font-mono text-sm font-medium">{shipment.shortId}</span>
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(shipment.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <span className="text-sm font-medium">{shipment.customer.name}</span>
                        <p className="text-xs text-muted-foreground mt-0.5">{shipment.customer.phone}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                        <span>{shipment.pickup.city}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                        <MapPin className="h-3.5 w-3.5 text-red-500" />
                        <span>{shipment.delivery.city}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <span className="text-sm">{shipment.cargo.type}</span>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {shipment.cargo.weight.toLocaleString()} kg
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {shipment.driver ? (
                        <div>
                          <span className="text-sm">{shipment.driver.name}</span>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-xs text-amber-500">★</span>
                            <span className="text-xs text-muted-foreground">{shipment.driver.rating}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {shipment.bidsCount} bids
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                          statusConfig[shipment.status].className
                        )}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig[shipment.status].label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold">{shipment.price.toLocaleString()} SAR</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-md hover:bg-muted transition-colors" title="View Details">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button className="p-1.5 rounded-md hover:bg-muted transition-colors" title="Chat">
                          <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button className="p-1.5 rounded-md hover:bg-muted transition-colors" title="More">
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredShipments.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">No shipments found</p>
          </div>
        )}
      </div>

      {/* Shipment Details Slide-over (simplified) */}
      {selectedShipment && (
        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() => setSelectedShipment(null)}
        >
          <div
            className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-card shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-card z-10">
              <div>
                <h2 className="text-lg font-semibold">{selectedShipment.shortId}</h2>
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mt-2',
                    statusConfig[selectedShipment.status].className
                  )}
                >
                  {statusConfig[selectedShipment.status].label}
                </span>
              </div>
              <button
                onClick={() => setSelectedShipment(null)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Route */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Route</h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium">{selectedShipment.pickup.city}</p>
                      <p className="text-sm text-muted-foreground">{selectedShipment.pickup.address}</p>
                    </div>
                  </div>
                  <div className="ml-4 border-l-2 border-dashed h-6" />
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">{selectedShipment.delivery.city}</p>
                      <p className="text-sm text-muted-foreground">{selectedShipment.delivery.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Customer</h3>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="font-medium">{selectedShipment.customer.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{selectedShipment.customer.phone}</p>
                </div>
              </div>

              {/* Driver */}
              {selectedShipment.driver && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Driver</h3>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-semibold">
                        {selectedShipment.driver.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{selectedShipment.driver.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-amber-500">★</span>
                          <span className="text-sm text-muted-foreground">{selectedShipment.driver.rating}</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{selectedShipment.driver.vehiclePlate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Cargo */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Cargo Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium mt-1">{selectedShipment.cargo.type}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Weight</p>
                    <p className="font-medium mt-1">{selectedShipment.cargo.weight.toLocaleString()} kg</p>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Payment</h3>
                <div className="bg-[var(--accent)]/10 rounded-lg p-4 flex items-center justify-between">
                  <span className="font-medium">Total Price</span>
                  <span className="text-xl font-bold text-[var(--accent)]">
                    {selectedShipment.price.toLocaleString()} SAR
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
