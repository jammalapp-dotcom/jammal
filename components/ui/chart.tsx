"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Chart colors - using actual hex values for Recharts compatibility
const CHART_COLORS = {
  chart1: "#1B2A4A",
  chart2: "#C8973E", 
  chart3: "#10B981",
  chart4: "#3B82F6",
  chart5: "#EF4444",
}

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<"light" | "dark", string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ComponentProps<
      typeof import("recharts").ResponsiveContainer
    >["children"]
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className
        )}
        style={
          {
            "--color-chart-1": CHART_COLORS.chart1,
            "--color-chart-2": CHART_COLORS.chart2,
            "--color-chart-3": CHART_COLORS.chart3,
            "--color-chart-4": CHART_COLORS.chart4,
            "--color-chart-5": CHART_COLORS.chart5,
            ...Object.entries(config).reduce((acc, [key, value]) => {
              if (value.color) {
                acc[`--color-${key}`] = value.color
              }
              return acc
            }, {} as Record<string, string>),
          } as React.CSSProperties
        }
        {...props}
      >
        {children}
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "Chart"

const ChartTooltip = ({
  active,
  payload,
  label,
  config,
  hideLabel = false,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: {
  active?: boolean
  payload?: Array<{
    name?: string
    value?: number
    payload?: Record<string, unknown>
    dataKey?: string
    color?: string
    fill?: string
    stroke?: string
  }>
  label?: string
  config?: ChartConfig
  hideLabel?: boolean
  labelFormatter?: (label: string, payload: unknown[]) => React.ReactNode
  labelClassName?: string
  formatter?: (
    value: number,
    name: string,
    item: unknown,
    index: number,
    payload: unknown[]
  ) => React.ReactNode
  color?: string
  nameKey?: string
  labelKey?: string
}) => {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      {!hideLabel && (
        <div className={cn("font-medium", labelClassName)}>
          {labelFormatter ? labelFormatter(label || "", payload) : label}
        </div>
      )}
      <div className="flex flex-col gap-0.5">
        {payload.map((item, index) => {
          const itemConfig = config?.[item.dataKey || ""] || {}
          const indicatorColor =
            color || item.fill || item.stroke || item.color || itemConfig.color

          return (
            <div
              key={item.dataKey || index}
              className="flex items-center gap-2 text-sm"
            >
              {indicatorColor && (
                <div
                  className="h-2.5 w-2.5 shrink-0 rounded-sm"
                  style={{ backgroundColor: indicatorColor }}
                />
              )}
              <span className="text-muted-foreground">
                {nameKey
                  ? (item.payload?.[nameKey] as string)
                  : itemConfig.label || item.name}
                :
              </span>
              <span className="font-medium">
                {formatter
                  ? formatter(
                      item.value ?? 0,
                      item.name || "",
                      item,
                      index,
                      payload
                    )
                  : item.value?.toLocaleString()}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ChartTooltip>
>((props, ref) => {
  const { config } = useChart()
  return <ChartTooltip config={config} {...props} />
})
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegend = ({
  payload,
  config,
  nameKey,
  hideIcon = false,
}: {
  payload?: Array<{
    value?: string
    dataKey?: string
    color?: string
  }>
  config?: ChartConfig
  nameKey?: string
  hideIcon?: boolean
}) => {
  if (!payload?.length) {
    return null
  }

  return (
    <div className="flex items-center justify-center gap-4">
      {payload.map((item, index) => {
        const itemConfig = config?.[item.dataKey || ""] || {}

        return (
          <div key={item.value || index} className="flex items-center gap-1.5">
            {!hideIcon && (
              <div
                className="h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ backgroundColor: item.color || itemConfig.color }}
              />
            )}
            <span className="text-sm text-muted-foreground">
              {itemConfig.label || item.value}
            </span>
          </div>
        )
      })}
    </div>
  )
}

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ChartLegend>
>((props, ref) => {
  const { config } = useChart()
  return <ChartLegend config={config} {...props} />
})
ChartLegendContent.displayName = "ChartLegendContent"

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  CHART_COLORS,
}
