"use client"

import { useState } from "react"
import {
  Truck,
  Plus,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Wrench,
  MapPin,
  Calendar,
  Fuel,
  Edit,
  Trash2,
  Eye,
} from "lucide-react"

// Mock fleet data
const mockVehicles = [
  {
    id: "VH001",
    plateNumber: "أ ب ج 1234",
    type: "شاحنة ثقيلة",
    typeEn: "Heavy Truck",
    model: "Mercedes Actros 2024",
    capacity: "40 طن",
    status: "active",
    driver: "محمد العتيبي",
    location: "الرياض",
    lastMaintenance: "2024-01-15",
    nextMaintenance: "2024-04-15",
    fuelLevel: 85,
    totalTrips: 156,
    rating: 4.8,
  },
  {
    id: "VH002",
    plateNumber: "س ع د 5678",
    type: "شاحنة متوسطة",
    typeEn: "Medium Truck",
    model: "Volvo FH16 2023",
    capacity: "25 طن",
    status: "on_trip",
    driver: "أحمد الشمري",
    location: "جدة → الدمام",
    lastMaintenance: "2024-02-01",
    nextMaintenance: "2024-05-01",
    fuelLevel: 62,
    totalTrips: 98,
    rating: 4.6,
  },
  {
    id: "VH003",
    plateNumber: "ن ه و 9012",
    type: "مقطورة مبردة",
    typeEn: "Refrigerated Trailer",
    model: "Scania R500 2023",
    capacity: "30 طن",
    status: "maintenance",
    driver: "—",
    location: "ورشة الصيانة - الرياض",
    lastMaintenance: "2024-03-01",
    nextMaintenance: "2024-03-10",
    fuelLevel: 45,
    totalTrips: 72,
    rating: 4.9,
  },
  {
    id: "VH004",
    plateNumber: "ق ر ص 3456",
    type: "شاحنة خفيفة",
    typeEn: "Light Truck",
    model: "Isuzu NPR 2024",
    capacity: "5 طن",
    status: "active",
    driver: "خالد القحطاني",
    location: "المدينة المنورة",
    lastMaintenance: "2024-02-20",
    nextMaintenance: "2024-05-20",
    fuelLevel: 78,
    totalTrips: 45,
    rating: 4.7,
  },
  {
    id: "VH005",
    plateNumber: "ت ث ج 7890",
    type: "ناقلة سوائل",
    typeEn: "Tanker",
    model: "DAF XF 2023",
    capacity: "35,000 لتر",
    status: "inactive",
    driver: "—",
    location: "موقف الأسطول - جدة",
    lastMaintenance: "2024-01-10",
    nextMaintenance: "2024-04-10",
    fuelLevel: 20,
    totalTrips: 89,
    rating: 4.5,
  },
]

const statusConfig = {
  active: {
    label: "متاح",
    labelEn: "Available",
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    icon: CheckCircle2,
  },
  on_trip: {
    label: "في رحلة",
    labelEn: "On Trip",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    icon: Truck,
  },
  maintenance: {
    label: "صيانة",
    labelEn: "Maintenance",
    color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    icon: Wrench,
  },
  inactive: {
    label: "غير نشط",
    labelEn: "Inactive",
    color: "bg-neutral-500/10 text-neutral-400 border-neutral-500/20",
    icon: XCircle,
  },
}

export default function BrokerFleetPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)

  const filteredVehicles = mockVehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.plateNumber.includes(searchQuery) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.driver.includes(searchQuery)
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: mockVehicles.length,
    active: mockVehicles.filter((v) => v.status === "active").length,
    onTrip: mockVehicles.filter((v) => v.status === "on_trip").length,
    maintenance: mockVehicles.filter((v) => v.status === "maintenance").length,
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">إدارة الأسطول</h1>
          <p className="mt-1 text-sm text-muted-foreground">إدارة ومتابعة جميع مركبات الأسطول</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          إضافة مركبة
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي المركبات</p>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">متاحة</p>
              <p className="text-2xl font-bold text-foreground">{stats.active}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <MapPin className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">في رحلة</p>
              <p className="text-2xl font-bold text-foreground">{stats.onTrip}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <Wrench className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">في الصيانة</p>
              <p className="text-2xl font-bold text-foreground">{stats.maintenance}</p>
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
            placeholder="البحث برقم اللوحة، الموديل، أو السائق..."
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
            <option value="active">متاح</option>
            <option value="on_trip">في رحلة</option>
            <option value="maintenance">صيانة</option>
            <option value="inactive">غير نشط</option>
          </select>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredVehicles.map((vehicle) => {
          const status = statusConfig[vehicle.status as keyof typeof statusConfig]
          const StatusIcon = status.icon

          return (
            <div
              key={vehicle.id}
              className={`group rounded-xl border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg ${
                selectedVehicle === vehicle.id ? "border-primary ring-1 ring-primary" : "border-border"
              }`}
            >
              {/* Header */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{vehicle.plateNumber}</h3>
                    <p className="text-xs text-muted-foreground">{vehicle.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${status.color}`}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </span>
                  <button className="rounded-lg p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Details */}
              <div className="mb-4 space-y-2.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">النوع</span>
                  <span className="font-medium text-foreground">{vehicle.type}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">الموديل</span>
                  <span className="font-medium text-foreground">{vehicle.model}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">السعة</span>
                  <span className="font-medium text-foreground">{vehicle.capacity}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">السائق</span>
                  <span className="font-medium text-foreground">{vehicle.driver}</span>
                </div>
              </div>

              {/* Location */}
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-muted/50 p-2.5">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{vehicle.location}</span>
              </div>

              {/* Fuel & Maintenance */}
              <div className="mb-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-muted/50 p-2.5">
                  <div className="mb-1 flex items-center gap-1.5">
                    <Fuel className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">الوقود</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${
                          vehicle.fuelLevel > 50
                            ? "bg-emerald-500"
                            : vehicle.fuelLevel > 25
                              ? "bg-amber-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${vehicle.fuelLevel}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-foreground">{vehicle.fuelLevel}%</span>
                  </div>
                </div>
                <div className="rounded-lg bg-muted/50 p-2.5">
                  <div className="mb-1 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">الصيانة القادمة</span>
                  </div>
                  <span className="text-xs font-medium text-foreground">{vehicle.nextMaintenance}</span>
                </div>
              </div>

              {/* Footer Stats */}
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">{vehicle.totalTrips}</p>
                  <p className="text-xs text-muted-foreground">رحلة</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-primary">{vehicle.rating}</p>
                  <p className="text-xs text-muted-foreground">التقييم</p>
                </div>
                <div className="flex items-center gap-1">
                  <button className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredVehicles.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 py-16">
          <Truck className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-1 text-lg font-medium text-foreground">لا توجد مركبات</h3>
          <p className="mb-4 text-sm text-muted-foreground">لم يتم العثور على مركبات تطابق معايير البحث</p>
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
