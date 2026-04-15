"use client"

import { SentimentData } from "@/lib/types"
import { GaugeChart } from "@/components/charts/GaugeChart"
import { CycleQuadrant } from "@/components/charts/CycleQuadrant"
import { SectionHeader } from "./MarketIndices"

interface SentimentGaugeProps {
  data: SentimentData
}

export function SentimentGauge({ data }: SentimentGaugeProps) {
  const kpiCards = [
    { label: "CNN 恐懼貪婪", value: data.fearGreed.current.toFixed(1), sub: data.fearGreed.label, color: "#f59e0b" },
    { label: "VIX 恐慌指數", value: data.vix.value.toFixed(2), sub: data.vix.label, color: "#f59e0b" },
    { label: "美10Y 殖利率", value: `${data.tenYearYield.toFixed(3)}%`, sub: `美元指數 ${data.dollarIndex}`, color: "#f0b429" },
    { label: "10Y-5Y 利差", value: data.yieldSpread.toFixed(3), sub: "殖利率曲線", color: "#93c5fd" },
  ]

  return (
    <div className="mb-6">
      <SectionHeader number={4} title="市場情緒指標" />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-3.5">
        {kpiCards.map((card) => (
          <div key={card.label} className="bg-[#0f2a4a] text-white p-3.5 rounded-md text-center">
            <div className="text-[9.5px] text-blue-200 uppercase tracking-wider">{card.label}</div>
            <div className="text-[22px] font-bold my-1" style={{ color: card.color }}>{card.value}</div>
            <div className="text-[10px] text-blue-300">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Gauge + Historical comparison side by side */}
      <div className="flex gap-3 mb-3.5">
        {/* Gauge - left (larger) */}
        <div className="bg-gray-50 border border-gray-200 rounded-md p-2.5 flex-[3]">
          <GaugeChart value={data.fearGreed.current} label={data.fearGreed.label} />
        </div>

        {/* Historical comparison - right (smaller) */}
        <div className="flex-[2] min-w-0">
          <table className="w-full text-[11px] h-full">
            <thead>
              <tr className="bg-[#1e293b] text-gray-200">
                <th className="px-2.5 py-1.5 text-left font-semibold">時間</th>
                <th className="px-2.5 py-1.5 text-right font-semibold">恐懼與貪婪指數</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: "當前", value: data.fearGreed.current },
                { label: "前日", value: data.fearGreed.previous },
                { label: "一週前", value: data.fearGreed.weekAgo },
                { label: "一月前", value: data.fearGreed.monthAgo },
                { label: "一年前", value: data.fearGreed.yearAgo },
              ].map((row) => (
                <tr key={row.label} className="border-b border-gray-100">
                  <td className="px-2.5 py-1.5 font-medium">{row.label}</td>
                  <td className="px-2.5 py-1.5 text-right font-mono">{row.value.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cycle */}
      <div className="text-[11px] font-semibold text-gray-500 py-1 mb-1.5 border-b border-gray-200">經濟週期指示器</div>
      <div className="bg-gray-50 border border-gray-200 rounded-md mt-2 p-2.5">
        <CycleQuadrant
          phase={data.economicCycle.phase}
          phaseZh={data.economicCycle.phaseZh}
          growthDirection={data.economicCycle.growthDirection}
          inflationDirection={data.economicCycle.inflationDirection}
          yieldSpread={data.yieldSpread}
        />
      </div>
    </div>
  )
}
