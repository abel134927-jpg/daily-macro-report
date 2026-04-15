"use client"

import { useState } from "react"
import { MarketRegion } from "@/lib/types"
import { formatNumber, formatPercent, formatChange, getTrendIcon, getTrendColor, getChangeBg } from "@/lib/utils"

interface MarketIndicesProps {
  regions: MarketRegion[]
}

function IndexTable({ indices }: { indices: MarketRegion["indices"] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[11px]">
        <thead>
          <tr className="bg-[#1e293b] text-gray-200">
            <th className="px-2.5 py-1.5 text-left font-semibold">指數</th>
            <th className="px-2.5 py-1.5 text-right font-semibold">收盤價</th>
            <th className="px-2.5 py-1.5 text-right font-semibold">漲跌</th>
            <th className="px-2.5 py-1.5 text-right font-semibold">漲跌幅</th>
            <th className="px-2.5 py-1.5 text-center font-semibold">趨勢</th>
            <th className="px-2.5 py-1.5 text-right font-semibold">年初至今</th>
          </tr>
        </thead>
        <tbody>
          {indices.map((idx) => (
            <tr key={idx.name} className="hover:bg-blue-50 even:bg-gray-50/50 border-b border-gray-100">
              <td className="px-2.5 py-1.5 font-medium">{idx.name}</td>
              <td className="px-2.5 py-1.5 text-right font-mono">{formatNumber(idx.close)}</td>
              <td className={`px-2.5 py-1.5 text-right font-mono font-semibold ${idx.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                {formatChange(idx.change)}
              </td>
              <td className="px-2.5 py-1.5 text-right">
                <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${getChangeBg(idx.changePercent)}`}>
                  {formatPercent(idx.changePercent)}
                </span>
              </td>
              <td className={`px-2.5 py-1.5 text-center font-semibold ${getTrendColor(idx.trend)}`}>
                {getTrendIcon(idx.trend)}
              </td>
              <td className={`px-2.5 py-1.5 text-right font-mono font-semibold ${idx.ytd >= 0 ? "text-green-500" : "text-red-500"}`}>
                {formatPercent(idx.ytd)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function MarketIndices({ regions }: MarketIndicesProps) {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="mb-6">
      <SectionHeader number={1} title="各國指數表現" />

      {/* Tabs - hidden in print */}
      <div className="flex border-b border-gray-200 mb-3 print:hidden">
        {regions.map((r, i) => (
          <button
            key={r.region}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === i
                ? "border-[#0f2a4a] text-[#0f2a4a]"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            {r.region}
          </button>
        ))}
      </div>

      {/* Active tab content - screen only */}
      <div className="print:hidden">
        <IndexTable indices={regions[activeTab].indices} />
      </div>

      {/* Print: show all tabs expanded */}
      <div className="hidden print:block">
        {regions.map((r) => (
          <div key={r.region} className="mb-3">
            <div className="text-[11px] font-semibold text-gray-500 py-1 mb-1 border-b border-gray-200">
              {r.region}
            </div>
            <IndexTable indices={r.indices} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function SectionHeader({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-2.5 pb-1.5 border-b-2 border-[#0f2a4a]">
      <div className="bg-[#0f2a4a] text-white text-[10px] font-bold w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0">
        {number}
      </div>
      <div className="text-[13px] font-bold text-[#0f2a4a] tracking-wide">{title}</div>
    </div>
  )
}
