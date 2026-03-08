'use client'

import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltipContent,
  CHART_COLORS,
} from '@/components/ui/chart'

const revenueData = [
  { month: 'Jan', revenue: 42500, shipments: 156 },
  { month: 'Feb', revenue: 38200, shipments: 142 },
  { month: 'Mar', revenue: 51800, shipments: 189 },
  { month: 'Apr', revenue: 47300, shipments: 171 },
  { month: 'May', revenue: 55600, shipments: 198 },
  { month: 'Jun', revenue: 62100, shipments: 223 },
  { month: 'Jul', revenue: 58400, shipments: 212 },
  { month: 'Aug', revenue: 67800, shipments: 245 },
  { month: 'Sep', revenue: 71200, shipments: 256 },
  { month: 'Oct', revenue: 68500, shipments: 248 },
  { month: 'Nov', revenue: 75400, shipments: 267 },
  { month: 'Dec', revenue: 82100, shipments: 291 },
]

const chartConfig = {
  revenue: {
    label: 'Revenue (SAR)',
    color: CHART_COLORS.chart1,
  },
  shipments: {
    label: 'Shipments',
    color: CHART_COLORS.chart2,
  },
}

export function RevenueChart() {
  return (
    <div className="bg-card rounded-xl border">
      <div className="p-5 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Revenue Overview</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Monthly revenue and shipment trends
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: CHART_COLORS.chart1 }}
              />
              <span className="text-muted-foreground">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: CHART_COLORS.chart2 }}
              />
              <span className="text-muted-foreground">Shipments</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={revenueData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.chart1} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={CHART_COLORS.chart1} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="shipmentsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.chart2} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={CHART_COLORS.chart2} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <YAxis
                yAxisId="revenue"
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              />
              <YAxis
                yAxisId="shipments"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-lg">
                      <p className="font-medium mb-2">{label}</p>
                      {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div
                            className="w-2.5 h-2.5 rounded-sm"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-muted-foreground">
                            {entry.dataKey === 'revenue' ? 'Revenue:' : 'Shipments:'}
                          </span>
                          <span className="font-medium">
                            {entry.dataKey === 'revenue'
                              ? `${entry.value?.toLocaleString()} SAR`
                              : entry.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )
                }}
              />
              <Area
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                stroke={CHART_COLORS.chart1}
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
              <Area
                yAxisId="shipments"
                type="monotone"
                dataKey="shipments"
                stroke={CHART_COLORS.chart2}
                strokeWidth={2}
                fill="url(#shipmentsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  )
}
