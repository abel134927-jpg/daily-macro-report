"use client"

import { LineChart, Line, YAxis, ResponsiveContainer } from "recharts"

interface SparklineProps {
  data: number[]
  color: string
  height?: number
}

export function Sparkline({ data, color, height = 40 }: SparklineProps) {
  const chartData = data.map((value, index) => ({ index, value }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData}>
        <YAxis domain={["dataMin", "dataMax"]} hide />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
