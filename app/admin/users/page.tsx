'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Search,
  Filter,
  Download,
  MoreHorizontal,
  UserPlus,
  Star,
  Shield,
  ShieldCheck,
  ShieldOff,
  Phone,
  Mail,
  Package,
  Truck,
  Building2,
  Users as UsersIcon,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react'

type UserRole = 'customer' | 'driver' | 'broker' | 'manager'
type UserStatus = 'active' | 'pending' | 'suspended'

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  status: UserStatus
  verified: boolean
  rating?: number
  totalShipments: number
  totalRevenue: number
  createdAt: string
  lastActive: string
  company?: string
  vehicleType?: string
  fleetSize?: number
}

const roleConfig: Record<UserRole, { label: string; className: string; icon: typeof Package }> = {
  customer: {
    label: 'Customer',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    icon: UsersIcon,
  },
  driver: {
    label: 'Driver',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    icon: Truck,
  },
  broker: {
    label: 'Broker',
    className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    icon: Building2,
  },
  manager: {
    label: 'Admin',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    icon: Shield,
  },
}

const statusConfig: Record<UserStatus, { label: string; className: string; icon: typeof CheckCircle2 }> = {
  active: {
    label: 'Active',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    icon: CheckCircle2,
  },
  pending: {
    label: 'Pending',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    icon: Clock,
  },
  suspended: {
    label: 'Suspended',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    icon: XCircle,
  },
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Mohammad Al-Ali',
    email: 'mohammad@example.com',
    phone: '+966 50 123 4567',
    role: 'customer',
    status: 'active',
    verified: true,
    totalShipments: 45,
    totalRevenue: 52500,
    createdAt: '2023-06-15',
    lastActive: '2 hours ago',
  },
  {
    id: '2',
    name: 'Khalid Al-Saud',
    email: 'khalid.driver@example.com',
    phone: '+966 55 987 6543',
    role: 'driver',
    status: 'active',
    verified: true,
    rating: 4.8,
    totalShipments: 234,
    totalRevenue: 128500,
    createdAt: '2023-03-22',
    lastActive: '30 minutes ago',
    vehicleType: 'Heavy Truck',
  },
  {
    id: '3',
    name: 'Al-Fahd Logistics',
    email: 'info@alfahd.sa',
    phone: '+966 11 456 7890',
    role: 'broker',
    status: 'active',
    verified: true,
    rating: 4.6,
    totalShipments: 890,
    totalRevenue: 456000,
    createdAt: '2022-11-08',
    lastActive: '1 hour ago',
    company: 'Al-Fahd Logistics Co.',
    fleetSize: 25,
  },
  {
    id: '4',
    name: 'Abdullah Al-Rashid',
    email: 'abdullah@example.com',
    phone: '+966 50 234 5678',
    role: 'driver',
    status: 'pending',
    verified: false,
    totalShipments: 0,
    totalRevenue: 0,
    createdAt: '2024-01-10',
    lastActive: 'Never',
    vehicleType: 'Medium Truck',
  },
  {
    id: '5',
    name: 'Sara Al-Qahtani',
    email: 'sara@company.sa',
    phone: '+966 50 888 9999',
    role: 'customer',
    status: 'active',
    verified: true,
    totalShipments: 12,
    totalRevenue: 18200,
    createdAt: '2023-09-20',
    lastActive: '3 days ago',
    company: 'Fashion House KSA',
  },
  {
    id: '6',
    name: 'Omar Bin Said',
    email: 'omar@example.com',
    phone: '+966 55 111 2222',
    role: 'driver',
    status: 'suspended',
    verified: true,
    rating: 3.2,
    totalShipments: 67,
    totalRevenue: 35600,
    createdAt: '2023-05-15',
    lastActive: '2 weeks ago',
    vehicleType: 'Pickup Truck',
  },
  {
    id: '7',
    name: 'Admin User',
    email: 'admin@jammal.sa',
    phone: '+966 11 000 0000',
    role: 'manager',
    status: 'active',
    verified: true,
    totalShipments: 0,
    totalRevenue: 0,
    createdAt: '2022-01-01',
    lastActive: 'Now',
  },
]

const roleFilters = ['All', 'Customers', 'Drivers', 'Brokers', 'Admins']

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery)

    const roleMap: Record<string, UserRole | 'All'> = {
      All: 'All',
      Customers: 'customer',
      Drivers: 'driver',
      Brokers: 'broker',
      Admins: 'manager',
    }

    const matchesFilter = activeFilter === 'All' || user.role === roleMap[activeFilter]

    return matchesSearch && matchesFilter
  })

  const stats = {
    total: mockUsers.length,
    customers: mockUsers.filter((u) => u.role === 'customer').length,
    drivers: mockUsers.filter((u) => u.role === 'driver').length,
    brokers: mockUsers.filter((u) => u.role === 'broker').length,
    pending: mockUsers.filter((u) => u.status === 'pending').length,
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground mt-1">
            Manage all users: customers, drivers, brokers, and admins
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-muted transition-colors">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-white font-medium hover:opacity-90 transition-opacity">
            <UserPlus className="h-4 w-4" />
            Add User
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div className="bg-card rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <UsersIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Users</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
              <UsersIcon className="h-5 w-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.customers}</p>
              <p className="text-xs text-muted-foreground">Customers</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <Truck className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.drivers}</p>
              <p className="text-xs text-muted-foreground">Drivers</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Building2 className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.brokers}</p>
              <p className="text-xs text-muted-foreground">Brokers</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-xs text-muted-foreground">Pending Verification</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-xl border p-4 space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
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

        {/* Role Filters */}
        <div className="flex flex-wrap gap-2">
          {roleFilters.map((filter) => (
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

      {/* Users Table */}
      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                  User
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                  Contact
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                  Role
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                  Stats
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                  Last Active
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredUsers.map((user) => {
                const RoleIcon = roleConfig[user.role].icon
                const StatusIcon = statusConfig[user.status].icon
                return (
                  <tr
                    key={user.id}
                    className="hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedUser(user)}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-semibold text-sm">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{user.name}</span>
                            {user.verified && (
                              <ShieldCheck className="h-4 w-4 text-emerald-500" />
                            )}
                          </div>
                          {user.company && (
                            <p className="text-xs text-muted-foreground">{user.company}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-sm">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Phone className="h-3.5 w-3.5" />
                          <span>{user.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                          roleConfig[user.role].className
                        )}
                      >
                        <RoleIcon className="h-3 w-3" />
                        {roleConfig[user.role].label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                          statusConfig[user.status].className
                        )}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig[user.status].label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Package className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{user.totalShipments} shipments</span>
                        </div>
                        {user.rating && (
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-3.5 w-3.5 text-amber-500" />
                            <span>{user.rating}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-muted-foreground">{user.lastActive}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        {user.status === 'active' ? (
                          <button
                            className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                            title="Suspend User"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ShieldOff className="h-4 w-4 text-red-500" />
                          </button>
                        ) : user.status === 'suspended' ? (
                          <button
                            className="p-1.5 rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                            title="Activate User"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                          </button>
                        ) : (
                          <button
                            className="p-1.5 rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                            title="Verify User"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          </button>
                        )}
                        <button
                          className="p-1.5 rounded-md hover:bg-muted transition-colors"
                          title="More"
                          onClick={(e) => e.stopPropagation()}
                        >
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

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <UsersIcon className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">No users found</p>
          </div>
        )}
      </div>

      {/* User Details Slide-over */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-card shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-card z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold text-lg">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{selectedUser.name}</h2>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-1',
                      roleConfig[selectedUser.role].className
                    )}
                  >
                    {roleConfig[selectedUser.role].label}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status & Verification */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mt-1',
                      statusConfig[selectedUser.status].className
                    )}
                  >
                    {statusConfig[selectedUser.status].label}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Verified</p>
                  <span className="text-sm font-medium mt-1 flex items-center gap-1 justify-end">
                    {selectedUser.verified ? (
                      <>
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                        Yes
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4 text-amber-500" />
                        Pending
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">{selectedUser.email}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">{selectedUser.phone}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold">{selectedUser.totalShipments}</p>
                    <p className="text-xs text-muted-foreground mt-1">Total Shipments</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold">{selectedUser.totalRevenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">Revenue (SAR)</p>
                  </div>
                  {selectedUser.rating && (
                    <div className="bg-muted/50 rounded-lg p-4 text-center col-span-2">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-6 w-6 text-amber-500" />
                        <p className="text-2xl font-bold">{selectedUser.rating}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Rating</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Info */}
              {(selectedUser.vehicleType || selectedUser.fleetSize) && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    {selectedUser.role === 'driver' ? 'Vehicle Info' : 'Fleet Info'}
                  </h3>
                  <div className="bg-muted/50 rounded-lg p-4">
                    {selectedUser.vehicleType && (
                      <div className="flex items-center gap-2">
                        <Truck className="h-5 w-5 text-muted-foreground" />
                        <span>{selectedUser.vehicleType}</span>
                      </div>
                    )}
                    {selectedUser.fleetSize && (
                      <div className="flex items-center gap-2 mt-2">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                        <span>{selectedUser.fleetSize} vehicles in fleet</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                {selectedUser.status === 'active' ? (
                  <button className="flex-1 py-2.5 rounded-lg bg-red-100 text-red-700 font-medium hover:bg-red-200 transition-colors">
                    Suspend User
                  </button>
                ) : selectedUser.status === 'suspended' ? (
                  <button className="flex-1 py-2.5 rounded-lg bg-emerald-100 text-emerald-700 font-medium hover:bg-emerald-200 transition-colors">
                    Reactivate User
                  </button>
                ) : (
                  <button className="flex-1 py-2.5 rounded-lg bg-emerald-100 text-emerald-700 font-medium hover:bg-emerald-200 transition-colors">
                    Verify User
                  </button>
                )}
                <button className="flex-1 py-2.5 rounded-lg border font-medium hover:bg-muted transition-colors">
                  View Activity
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
