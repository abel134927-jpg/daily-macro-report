"use client"

import { HeroIndicator } from "@/lib/types"
import { formatNumber, formatPercent } from "@/lib/utils"
import { Sparkline } from "@/components/charts/Sparkline"

interface HeroCardsProps {
  indicators: HeroIndicator[]
}

export function HeroCards({ indicators }: HeroCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {indicators.map((item) => {
        const isUp = item.changePercent > 0
        const color = isUp ? "#10B981" : item.changePercent < 0 ? "#EF4444" : "#6B7280"

        return (
          <div
            key={item.name}
            className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="text-[9px] uppercase tracking-wider text-gray-400 mb-1">{item.name}</div>
            <div className="text-lg font-bold" style={{ color }}>
              {item.name === "黃金" || item.name === "WTI原油" || item.name === "BTC"
                ? `$${formatNumber(item.value)}`
                : formatNumber(item.value)}
            </div>
            <div className="text-xs" style={{ color }}>
              {formatPercent(item.changePercent)}
            </div>
            <div className="mt-1">
              <Sparkline data={item.sparklineData} color={color} height={32} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
