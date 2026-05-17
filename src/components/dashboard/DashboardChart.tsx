"use client"
import { TrendUp } from "@phosphor-icons/react"
import { useState } from "react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"

// ============================================
// TYPES
// ============================================

export type ChartDataPoint = {
  index: number
  label: string
  points: number
  cumulative: number
  position: number
}

type DashboardChartProps = {
  data: ChartDataPoint[]
}

type TrendKey = "points" | "cumulative" | "position"

type TrendConfig = {
  key: TrendKey
  label: string
  description: string
  type: "bar" | "line" | "area"
  color: string
  yAxisInverted?: boolean
}

const trends: TrendConfig[] = [
  {
    key: "points",
    label: "Points",
    description: "Points marqués par jour",
    type: "bar",
    color: "#84cc16",
  },
  {
    key: "cumulative",
    label: "Cumul",
    description: "Total points cumulés",
    type: "area",
    color: "#84cc16",
  },
  {
    key: "position",
    label: "Classement",
    description: "Position dans le classement",
    type: "line",
    color: "#84cc16",
    yAxisInverted: true,
  },
]

// ============================================
// CUSTOM TOOLTIP
// ============================================

type TooltipProps = {
  active?: boolean
  payload?: Array<{ value: number; payload: ChartDataPoint }>
  trend: TrendConfig
}

function CustomTooltip({ active, payload, trend }: TooltipProps) {
  if (!active || !payload || !payload.length) return null

  const data = payload[0].payload
  const value = payload[0].value

  return (
    <div className="bg-bg-elevated border border-white/10 rounded-lg px-4 py-3 shadow-2xl">
      <p className="text-xs uppercase tracking-widest text-text-muted mb-1">
        {data.label}
      </p>
      <p className="text-2xl font-bold text-lime-500">
        {trend.key === "position" ? `${value}e` : value}
        {(trend.key === "points" || trend.key === "cumulative") && (
          <span className="text-base text-primary ml-1">pts</span>
        )}
      </p>
    </div>
  )
}

// ============================================
// COMPONENT
// ============================================

export function DashboardChart({ data }: DashboardChartProps) {
  const [selectedTrend, setSelectedTrend] = useState<TrendKey>("cumulative")
  const trend = trends.find((t) => t.key === selectedTrend)!

  // État vide : pas encore de matchs joués
  if (data.length === 0) {
    return (
      <div className="rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-6 md:p-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
                    <TrendUp size={36} weight="light" className="text-lime" />
                    <p className="text-xs uppercase tracking-widest text-text-muted">
                      Évolution sur le tournoi
                    </p>
                  </div>
          <h2 className="text-2xl font-bold text-text-primary">
            Pas encore de données
          </h2>
        </div>

        <div className="h-[300px] w-full flex flex-col items-center justify-center text-center">
          <p className="text-text-secondary mb-2">
            Le graphe s&apos;animera dès le premier match joué
          </p>
          <p className="text-text-muted text-sm">
            Coup d&apos;envoi : 11 juin 2026
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-6 md:p-8">

      {/* Header avec switcher */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-text-primary mb-2">
            Évolution sur le tournoi
          </p>
          <h2 className="text-2xl font-bold text-text-primary">
            {trend.description}
          </h2>
        </div>

        {/* Switcher */}
        <div className="flex gap-1 bg-black/30 border border-white/5 rounded-lg p-1">
          {trends.map((t) => (
            <button
              key={t.key}
              onClick={() => setSelectedTrend(t.key)}
              className={`
                px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${selectedTrend === t.key
                  ? "bg-lime-600 text-bg"
                  : "text-text-secondary hover:text-text-primary"
                }
              `}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Graph */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {trend.type === "bar" ? (
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#f3f3f3"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#f3f3f3"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip trend={trend} />} cursor={{ fill: "rgba(33,150,243,0.05)" }} />
              <Bar
                dataKey={trend.key}
                fill={trend.color}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          ) : trend.type === "line" ? (
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#f3f3f3"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#f3f3f3"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                reversed={trend.yAxisInverted}
              />
              <Tooltip content={<CustomTooltip trend={trend} />} cursor={{ stroke: "rgba(33,150,243,0.2)" }} />
              <Line
                type="monotone"
                dataKey={trend.key}
                stroke={trend.color}
                strokeWidth={2}
                dot={{ fill: trend.color, r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          ) : (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={trend.color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={trend.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#f3f3f3"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#f3f3f3"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip trend={trend} />} cursor={{ stroke: "rgba(33,150,243,0.2)" }} />
              <Area
                type="monotone"
                dataKey={trend.key}
                stroke={trend.color}
                strokeWidth={2}
                fill="url(#colorCumulative)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

    </div>
  )
}