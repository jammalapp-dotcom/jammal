"use client"

import { useState } from "react"
import {
  Package,
  Search,
  Filter,
  MapPin,
  Calendar,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  Eye,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Package2,
  Timer,
} from "lucide-react"

// Mock shipments data for broker
const mockShipments = [
  {
    id: "SHP-2024-001",
    customer: "شركة المراعي",
    origin: "الرياض",
    destination: "جدة",
    status: "in_transit",
    driver: "محمد العتيبي",
    vehicle: "أ ب ج 1234",
    cargoType: "مواد غذائية",
    weight: "25 طن",
    price: 4500,
    distance: "950 كم",
    pickupDate: "2024-03-08",
    deliveryDate: "2024-03-09",
    progress: 65,
    eta: "6 ساعات",
  },
  {
    id: "SHP-2024-002",
    customer: "مصنع الحديد الوطني",
    origin: "الدمام",
    destination: "الرياض",
    status: "pending_pickup",
    driver: "أحمد الشمري",
    vehicle: "س ع د 5678",
    cargoType: "مواد بناء",
    weight: "35 طن",
    price: 3200,
    distance: "420 كم",
    pickupDate: "2024-03-09",
    deliveryDate: "2024-03-09",
    progress: 0,
    eta: "—",
  },
  {
    id: "SHP-2024-003",
    customer: "شركة نادك",
    origin: "حائل",
    destination: "مكة المكرمة",
    status: "delivered",
    driver: "خالد القحطاني",
    vehicle: "ق ر ص 3456",
    cargoType: "منتجات ألبان",
    weight: "15 طن",
    price: 5800,
    distance: "1100 كم",
    pickupDate: "2024-03-07",
    deliveryDate: "2024-03-08",
    progress: 100,
    eta: "تم التسليم",
  },
  {
    id: "SHP-2024-004",
    customer: "مستودعات أمازون",
    origin: "جدة",
    destination: "الخبر",
    status: "pending_assignment",
    driver: "—",
    vehicle: "—",
    cargoType: "بضائع عامة",
    weight: "20 طن",
    price: 6200,
    distance: "1400 كم",
    pickupDate: "2024-03-10",
    deliveryDate: "2024-03-11",
    progress: 0,
    eta: "بانتظار السائق",
  },
  {
    id: "SHP-2024-005",
    customer: "شركة سابك",
    origin: "الجبيل",
    destination: "ينبع",
    status: "cancelled",
    driver: "—",
    vehicle: "—",
    cargoType: "مواد كيميائية",
    weight: "30 طن",
    price: 7500,
    distance: "1200 كم",
    pickupDate: "2024-03-06",
    deliveryDate: "2024-03-07",
    progress: 0,
    eta: "ملغي",
  },
]

const statusConfig = {
  pending_assignment: {
    label: "بانتظار التعيين",
    color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    icon: Clock,
  },
  pending_pickup: {
    label: "بانتظار الاستلام",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    icon: Package,
  },
  in_transit: {
    label: "في الطريق",
    color: "bg-primary/10 text-primary border-primary/20",
    icon: Truck,
  },
  delivered: {
    label: "تم التسليم",
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "ملغي",
    color: "bg-red-500/10 text-red-400 border-red-500/20",
    icon: XCircle,
  },
}

export default function BrokerShipmentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredShipments = mockShipments.filter((shipment) => {
    const matchesSearch =
      shipment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.customer.includes(searchQuery) ||
      shipment.origin.includes(searchQuery) ||
      shipment.destination.includes(searchQuery)
    const matchesStatus = statusFilter === "all" || shipment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: mockShipments.length,
    active: mockShipments.filter((s) => s.status === "in_transit" || s.status === "pending_pickup").length,
    delivered: mockShipments.filter((s) => s.status === "delivered").length,
    revenue: mockShipments.filter((s) => s.status === "delivered").reduce((sum, s) => sum + s.price, 0),
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">شحنات الأسطول</h1>
          <p className="mt-1 text-sm text-muted-foreground">إدارة ومتابعة جميع شحنات الأسطول</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Package2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي الشحنات</p>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Timer className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">شحنات نشطة</p>
              <p className="text-2xl font-bold text-foreground">{stats.active}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">تم تسليمها</p>
              <p className="text-2xl font-bold text-foreground">{stats.delivered}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">الإيرادات</p>
              <p className="text-2xl font-bold text-foreground">{stats.revenue.toLocaleString()} ر.س</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="البحث برقم الشحنة، العميل، أو الموقع..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-card py-2.5 pr-10 pl-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">جميع الحالات</option>
            <option value="pending_assignment">بانتظار التعيين</option>
            <option value="pending_pickup">بانتظار الاستلام</option>
            <option value="in_transit">في الطريق</option>
            <option value="delivered">تم التسليم</option>
            <option value="cancelled">ملغي</option>
          </select>
        </div>
      </div>

      {/* Shipments List */}
      <div className="space-y-4">
        {filteredShipments.map((shipment) => {
          const status = statusConfig[shipment.status as keyof typeof statusConfig]
          const StatusIcon = status.icon

          return (
            <div
              key={shipment.id}
              className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Left Section - ID & Status */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-foreground">{shipment.id}</h3>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${status.color}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{shipment.customer}</p>
                  </div>
                </div>

                {/* Middle Section - Route */}
                <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-emerald-500" />
                      <span className="font-medium text-foreground">{shipment.origin}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{shipment.pickupDate}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-px w-8 bg-border" />
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <div className="h-px w-8 bg-border" />
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-red-500" />
                      <span className="font-medium text-foreground">{shipment.destination}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{shipment.deliveryDate}</p>
                  </div>
                </div>

                {/* Right Section - Details */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{shipment.cargoType}</p>
                    <p className="text-xs text-muted-foreground">{shipment.weight}</p>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{shipment.driver}</p>
                    <p className="text-xs text-muted-foreground">{shipment.vehicle}</p>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div className="text-center">
                    <p className="text-lg font-bold text-primary">{shipment.price.toLocaleString()} ر.س</p>
                    <p className="text-xs text-muted-foreground">{shipment.distance}</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar (for in-transit) */}
              {shipment.status === "in_transit" && (
                <div className="mt-4 border-t border-border pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">التقدم</span>
                    <span className="font-medium text-foreground">
                      {shipment.progress}% - الوصول المتوقع: {shipment.eta}
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${shipment.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 flex items-center justify-end gap-2 border-t border-border pt-4">
                {shipment.status === "pending_assignment" && (
                  <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                    <Truck className="h-4 w-4" />
                    تعيين سائق
                  </button>
                )}
                <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                  <Eye className="h-4 w-4" />
                  التفاصيل
                </button>
                <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                  <MessageSquare className="h-4 w-4" />
                  تواصل
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredShipments.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 py-16">
          <Package className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-1 text-lg font-medium text-foreground">لا توجد شحنات</h3>
          <p className="mb-4 text-sm text-muted-foreground">لم يتم العثور على شحنات تطابق معايير البحث</p>
          <button
            onClick={() => {
              setSearchQuery("")
              setStatusFilter("all")
            }}
            className="text-sm font-medium text-primary hover:underline"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      )}
    </div>
  )
}
