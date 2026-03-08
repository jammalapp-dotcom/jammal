"use client"

import { useState } from "react"
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Mail,
  Star,
  MapPin,
  Truck,
  Calendar,
  Award,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  MessageSquare,
} from "lucide-react"

// Mock drivers data
const mockDrivers = [
  {
    id: "DRV001",
    name: "محمد العتيبي",
    nameEn: "Mohammed Al-Otaibi",
    phone: "+966 55 123 4567",
    email: "m.otaibi@email.com",
    status: "active",
    avatar: null,
    rating: 4.9,
    totalTrips: 156,
    completionRate: 98,
    joinDate: "2023-06-15",
    license: "رخصة ثقيل",
    licenseExpiry: "2025-06-15",
    currentVehicle: "أ ب ج 1234",
    location: "الرياض",
    earnings: 45000,
    reviews: 142,
  },
  {
    id: "DRV002",
    name: "أحمد الشمري",
    nameEn: "Ahmed Al-Shamri",
    phone: "+966 55 234 5678",
    email: "a.shamri@email.com",
    status: "on_trip",
    avatar: null,
    rating: 4.6,
    totalTrips: 98,
    completionRate: 95,
    joinDate: "2023-08-20",
    license: "رخصة ثقيل",
    licenseExpiry: "2024-12-01",
    currentVehicle: "س ع د 5678",
    location: "جدة → الدمام",
    earnings: 32000,
    reviews: 89,
  },
  {
    id: "DRV003",
    name: "خالد القحطاني",
    nameEn: "Khaled Al-Qahtani",
    phone: "+966 55 345 6789",
    email: "k.qahtani@email.com",
    status: "active",
    avatar: null,
    rating: 4.7,
    totalTrips: 45,
    completionRate: 100,
    joinDate: "2024-01-10",
    license: "رخصة خفيف",
    licenseExpiry: "2026-01-10",
    currentVehicle: "ق ر ص 3456",
    location: "المدينة المنورة",
    earnings: 18000,
    reviews: 43,
  },
  {
    id: "DRV004",
    name: "فهد الدوسري",
    nameEn: "Fahad Al-Dosari",
    phone: "+966 55 456 7890",
    email: "f.dosari@email.com",
    status: "offline",
    avatar: null,
    rating: 4.5,
    totalTrips: 72,
    completionRate: 92,
    joinDate: "2023-09-01",
    license: "رخصة ثقيل",
    licenseExpiry: "2025-03-15",
    currentVehicle: "—",
    location: "آخر موقع: الخبر",
    earnings: 28000,
    reviews: 65,
  },
  {
    id: "DRV005",
    name: "سعد العنزي",
    nameEn: "Saad Al-Anazi",
    phone: "+966 55 567 8901",
    email: "s.anazi@email.com",
    status: "pending",
    avatar: null,
    rating: 0,
    totalTrips: 0,
    completionRate: 0,
    joinDate: "2024-03-01",
    license: "رخصة متوسط",
    licenseExpiry: "2026-03-01",
    currentVehicle: "—",
    location: "الرياض",
    earnings: 0,
    reviews: 0,
  },
]

const statusConfig = {
  active: {
    label: "متصل",
    labelEn: "Online",
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    icon: CheckCircle2,
  },
  on_trip: {
    label: "في رحلة",
    labelEn: "On Trip",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    icon: Truck,
  },
  offline: {
    label: "غير متصل",
    labelEn: "Offline",
    color: "bg-neutral-500/10 text-neutral-400 border-neutral-500/20",
    icon: XCircle,
  },
  pending: {
    label: "قيد المراجعة",
    labelEn: "Pending",
    color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    icon: Clock,
  },
}

export default function BrokerDriversPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredDrivers = mockDrivers.filter((driver) => {
    const matchesSearch =
      driver.name.includes(searchQuery) ||
      driver.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.phone.includes(searchQuery) ||
      driver.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || driver.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: mockDrivers.length,
    active: mockDrivers.filter((d) => d.status === "active" || d.status === "on_trip").length,
    avgRating: (
      mockDrivers.filter((d) => d.rating > 0).reduce((sum, d) => sum + d.rating, 0) /
      mockDrivers.filter((d) => d.rating > 0).length
    ).toFixed(1),
    totalTrips: mockDrivers.reduce((sum, d) => sum + d.totalTrips, 0),
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">إدارة السائقين</h1>
          <p className="mt-1 text-sm text-muted-foreground">إدارة ومتابعة سائقي الأسطول</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          إضافة سائق
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي السائقين</p>
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
              <p className="text-sm text-muted-foreground">نشط الآن</p>
              <p className="text-2xl font-bold text-foreground">{stats.active}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <Star className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">متوسط التقييم</p>
              <p className="text-2xl font-bold text-foreground">{stats.avgRating}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي الرحلات</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalTrips}</p>
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
            placeholder="البحث بالاسم، رقم الجوال، أو المعرف..."
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
            <option value="active">متصل</option>
            <option value="on_trip">في رحلة</option>
            <option value="offline">غير متصل</option>
            <option value="pending">قيد المراجعة</option>
          </select>
        </div>
      </div>

      {/* Drivers Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredDrivers.map((driver) => {
          const status = statusConfig[driver.status as keyof typeof statusConfig]
          const StatusIcon = status.icon

          return (
            <div
              key={driver.id}
              className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              {/* Header */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                    {driver.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{driver.name}</h3>
                    <p className="text-xs text-muted-foreground">{driver.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${status.color}`}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground" dir="ltr">
                    {driver.phone}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{driver.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{driver.location}</span>
                </div>
              </div>

              {/* Stats Row */}
              <div className="mb-4 grid grid-cols-3 gap-2 rounded-lg bg-muted/50 p-3">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-3.5 w-3.5 text-amber-500" />
                    <span className="font-bold text-foreground">{driver.rating || "—"}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">التقييم</p>
                </div>
                <div className="text-center">
                  <span className="font-bold text-foreground">{driver.totalTrips}</span>
                  <p className="text-xs text-muted-foreground">رحلة</p>
                </div>
                <div className="text-center">
                  <span className="font-bold text-foreground">{driver.completionRate || "—"}%</span>
                  <p className="text-xs text-muted-foreground">الإكمال</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">المركبة الحالية</span>
                  <span className="font-medium text-foreground">{driver.currentVehicle}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">نوع الرخصة</span>
                  <span className="font-medium text-foreground">{driver.license}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">تاريخ الانضمام</span>
                  <span className="font-medium text-foreground">{driver.joinDate}</span>
                </div>
              </div>

              {/* Earnings Badge */}
              {driver.earnings > 0 && (
                <div className="mb-4 flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 p-3">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">الأرباح الشهرية</span>
                  </div>
                  <span className="font-bold text-primary">{driver.earnings.toLocaleString()} ر.س</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div className="flex items-center gap-1">
                  <button className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    <MessageSquare className="h-4 w-4" />
                  </button>
                  <button className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <button className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredDrivers.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 py-16">
          <Users className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-1 text-lg font-medium text-foreground">لا يوجد سائقون</h3>
          <p className="mb-4 text-sm text-muted-foreground">لم يتم العثور على سائقين يطابقون معايير البحث</p>
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
