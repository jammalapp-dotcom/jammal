'use client'

import { cn } from '@/lib/utils'
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  change?: {
    value: string
    trend: 'up' | 'down' | 'neutral'
  }
  icon: LucideIcon
  iconColor?: string
  className?: string
}

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = 'bg-[var(--primary)]/10 text-[var(--primary)]',
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'bg-card rounded-xl border p-5 hover:shadow-md transition-shadow duration-200',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {change && (
            <div className="flex items-center gap-1">
              {change.trend === 'up' ? (
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              ) : change.trend === 'down' ? (
                <TrendingDown className="h-4 w-4 text-red-500" />
              ) : null}
              <span
                className={cn(
                  'text-xs font-medium',
                  change.trend === 'up'
                    ? 'text-emerald-600'
                    : change.trend === 'down'
                    ? 'text-red-600'
                    : 'text-muted-foreground'
                )}
              >
                {change.value}
              </span>
            </div>
          )}
        </div>
        <div className={cn('p-3 rounded-lg', iconColor)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}
