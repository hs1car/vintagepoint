'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

interface DataPoint {
  label: string
  value: number
}

interface LineChartProps {
  title: string
  subtitle?: string
  data: DataPoint[]
  color?: string
  icon?: React.ElementType
}

export function LineChart({ 
  title, 
  subtitle, 
  data,
  color = 'stroke-gold-500',
  icon: Icon = TrendingUp
}: LineChartProps) {
  if (data.length === 0) return null

  const maxValue = Math.max(...data.map(d => d.value), 1)
  const minValue = Math.min(...data.map(d => d.value), 0)
  const range = maxValue - minValue || 1

  const height = 200
  const width = 800
  const padding = 40

  const points = data.map((point, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2)
    const y = height - padding - ((point.value - minValue) / range) * (height - padding * 2)
    return { x, y, value: point.value, label: point.label }
  })

  const pathD = points.reduce((path, point, i) => {
    return path + (i === 0 ? `M ${point.x},${point.y}` : ` L ${point.x},${point.y}`)
  }, '')

  const areaD = `${pathD} L ${points[points.length - 1].x},${height - padding} L ${points[0].x},${height - padding} Z`

  return (
    <Card className="border-gold-500/20 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gold-400">
          <Icon className="h-5 w-5" />
          <div className="flex flex-col">
            <span>{title}</span>
            {subtitle && <span className="text-sm font-normal text-muted-foreground">{subtitle}</span>}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="relative" style={{ height: `${height}px` }}>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            {/* Grid lines */}
            <g className="opacity-10">
              {[0, 1, 2, 3, 4].map(i => (
                <line
                  key={i}
                  x1={padding}
                  y1={padding + i * ((height - padding * 2) / 4)}
                  x2={width - padding}
                  y2={padding + i * ((height - padding * 2) / 4)}
                  stroke="currentColor"
                  strokeWidth="1"
                />
              ))}
            </g>

            {/* Area fill */}
            <motion.path
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              transition={{ duration: 0.5 }}
              d={areaD}
              fill="url(#gradient)"
            />

            {/* Line */}
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              d={pathD}
              fill="none"
              className={color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points */}
            {points.map((point, i) => (
              <motion.g
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + i * 0.1 }}
              >
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="5"
                  className="fill-gold-500 stroke-background"
                  strokeWidth="2"
                />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="8"
                  className="fill-gold-500 opacity-0 hover:opacity-20 transition-opacity cursor-pointer"
                />
              </motion.g>
            ))}

            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgb(234, 179, 8)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="rgb(234, 179, 8)" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-10 text-xs text-muted-foreground">
            {data.map((point, i) => (
              <span key={i} className="truncate">{point.label}</span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">الحد الأقصى</p>
            <p className="text-lg font-bold text-gold-400">{maxValue.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">المتوسط</p>
            <p className="text-lg font-bold text-gold-400">
              {Math.round(data.reduce((a, b) => a + b.value, 0) / data.length).toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">الحد الأدنى</p>
            <p className="text-lg font-bold text-gold-400">{minValue.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
