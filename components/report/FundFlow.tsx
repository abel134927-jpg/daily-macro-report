"use client"

import { FundFlowItem } from "@/lib/types"
import { SectionHeader } from "./MarketIndices"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from "recharts"

interface FundFlowProps {
  globalFlows: FundFlowItem[]
  sectorFlows: FundFlowItem[]
  bondFlows: FundFlowItem[]
}

function FlowTable({ items, showEtf = true }: { items: FundFlowItem[]; showEtf?: boolean }) {
  function dirClass(dir: "up" | "down") {
    return dir === "up" ? "text-green-500 font-semibold" : "text-red-500 font-semibold"
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[11px]">
        <thead>
          <tr className="bg-[#1e293b] text-gray-200">
            <th className="px-2.5 py-1.5 text-left font-semibold">名稱</th>
            {showEtf && <th className="px-2.5 py-1.5 text-left font-semibold">ETF</th>}
            <th className="px-2.5 py-1.5 text-right font-semibold">當日</th>
            <th className="px-2.5 py-1.5 text-right font-semibold">近一週</th>
            <th className="px-2.5 py-1.5 text-right font-semibold">近一月</th>
            <th className="px-2.5 py-1.5 text-right font-semibold">年初至今</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.name} className="hover:bg-blue-50 even:bg-gray-50/50 border-b border-gray-100">
              <td className="px-2.5 py-1.5 font-medium">{item.name}</td>
              {showEtf && <td className="px-2.5 py-1.5 text-gray-400 font-mono text-[10px]">{item.etf}</td>}
              <td className={`px-2.5 py-1.5 text-right font-mono ${dirClass(item.dailyDirection)}`}>{item.daily}</td>
              <td className={`px-2.5 py-1.5 text-right font-mono ${dirClass(item.weeklyDirection)}`}>{item.weekly}</td>
              <td className={`px-2.5 py-1.5 text-right font-mono ${dirClass(item.monthlyDirection)}`}>{item.monthly}</td>
              <td className={`px-2.5 py-1.5 text-right font-mono ${dirClass(item.ytdDirection)}`}>{item.ytd}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function parseFlowValue(str: string): number {
  const clean = str.replace(/[+,]/g, "")
  if (clean.includes("億")) return parseFloat(clean.replace("億", ""))
  if (clean.includes("萬")) return parseFloat(clean.replace("萬", "")) / 10000
  return parseFloat(clean)
}

function FlowBarChart({ items }: { items: FundFlowItem[] }) {
  // Sort by absolute value, take top 5
  const sorted = items
    .map((item) => ({ name: item.name, value: parseFlowValue(item.daily) }))
    .filter((d) => !isNaN(d.value))
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, 5)

  return (
    <div className="mb-3">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={sorted} layout="vertical" margin={{ left: 80, right: 30, top: 5, bottom: 5 }}>
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={75} />
          <Tooltip
            formatter={(value) => [`${Number(value) >= 0 ? "+" : ""}${Number(value).toFixed(2)}億`, "當日流量"]}
            contentStyle={{ fontSize: 12 }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {sorted.map((entry, index) => (
              <Cell key={index} fill={entry.value >= 0 ? "#10B981" : "#EF4444"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function FundFlow({ globalFlows, sectorFlows, bondFlows }: FundFlowProps) {
  return (
    <>
      {/* Section 5: Global Fund Flows */}
      <div className="mb-6">
        <SectionHeader number={5} title="全球資金流向脈動" />
        <div className="text-[10px] text-gray-400 mb-2">基於 ETF 每日原始資金流量（MFM × 成交量 × 收盤價）累加</div>
        <FlowBarChart items={globalFlows} />
        <FlowTable items={globalFlows} />
      </div>

      {/* Section 6: Sector + Bond Flows */}
      <div className="mb-6">
        <SectionHeader number={6} title="GICS 11大板塊 & 債券資金流向" />
        <div className="text-[11px] font-semibold text-gray-500 py-1 mb-1 border-b border-gray-200">板塊 ETF 資金流向</div>
        <FlowTable items={sectorFlows} />
        <div className="text-[11px] font-semibold text-gray-500 py-1 mb-1 border-b border-gray-200 mt-3.5">債券市場資金流向</div>
        <FlowTable items={bondFlows} />
      </div>
    </>
  )
}
