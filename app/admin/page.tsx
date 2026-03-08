import { Package, Truck, Wallet, UserCheck, Users, Star } from 'lucide-react'
import { StatCard } from '@/components/admin/stat-card'
import { RecentShipments } from '@/components/admin/recent-shipments'
import { LiveMapPreview } from '@/components/admin/live-map-preview'
import { RevenueChart } from '@/components/admin/revenue-chart'

const stats = [
  {
    title: 'Active Shipments',
    value: '127',
    change: { value: '+12% from last week', trend: 'up' as const },
    icon: Package,
    iconColor: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
  },
  {
    title: 'Online Drivers',
    value: '43',
    change: { value: '+8% from yesterday', trend: 'up' as const },
    icon: Truck,
    iconColor: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  {
    title: "Today's Revenue",
    value: '12,450 SAR',
    change: { value: '+15% from last week', trend: 'up' as const },
    icon: Wallet,
    iconColor: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  },
  {
    title: 'Pending Verification',
    value: '8',
    change: { value: '+3 new applications', trend: 'neutral' as const },
    icon: UserCheck,
    iconColor: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  },
  {
    title: 'Total Users',
    value: '2,341',
    change: { value: '+156 this month', trend: 'up' as const },
    icon: Users,
    iconColor: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    title: 'Average Rating',
    value: '4.7',
    change: { value: '+0.2 improvement', trend: 'up' as const },
    icon: Star,
    iconColor: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here is an overview of your freight platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <RevenueChart />

        {/* Live Map Preview */}
        <LiveMapPreview />
      </div>

      {/* Recent Shipments Table */}
      <RecentShipments />
    </div>
  )
}
