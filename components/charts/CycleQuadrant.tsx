"use client"

interface CycleQuadrantProps {
  phase: "recovery" | "overheating" | "stagflation" | "recession"
  phaseZh: string
  growthDirection: "up" | "down"
  inflationDirection: "up" | "down"
  yieldSpread: number
}

export function CycleQuadrant({ phase, phaseZh, growthDirection, inflationDirection, yieldSpread }: CycleQuadrantProps) {
  const phases = [
    { key: "overheating", label: "過熱期", color: "#f97316", x: 102.7, y: 92.7, startAngle: 90, endAngle: 180 },
    { key: "recovery", label: "復甦期", color: "#22c55e", x: 197.3, y: 92.7, startAngle: 0, endAngle: 90 },
    { key: "stagflation", label: "滯脹期", color: "#f59e0b", x: 102.7, y: 187.3, startAngle: 180, endAngle: 270 },
    { key: "recession", label: "衰退期", color: "#94a3b8", x: 197.3, y: 187.3, startAngle: 270, endAngle: 360 },
  ]

  const cx = 150, cy = 140, r = 108

  function sectorPath(startDeg: number, endDeg: number) {
    const s = (startDeg * Math.PI) / 180
    const e = (endDeg * Math.PI) / 180
    const x1 = cx + r * Math.cos(s)
    const y1 = cy - r * Math.sin(s)
    const x2 = cx + r * Math.cos(e)
    const y2 = cy - r * Math.sin(e)
    return `M ${cx},${cy} L ${x1},${y1} A ${r},${r} 0 0,0 ${x2},${y2} Z`
  }

  const needleAngles: Record<string, number> = {
    recovery: 45, overheating: 135, stagflation: 225, recession: 315,
  }
  const needleAngle = (needleAngles[phase] * Math.PI) / 180
  const needleR = r * 0.6
  const nx = cx + needleR * Math.cos(needleAngle)
  const ny = cy - needleR * Math.sin(needleAngle)

  return (
    <div className="flex items-start gap-5 flex-wrap">
      <div className="flex-shrink-0">
        <svg viewBox="0 0 300 276" className="w-full max-w-[260px] block">
          <circle cx={cx} cy={cy} r={r} fill="#f1f5f9" stroke="#e2e8f0" strokeWidth={1} />
          {phases.map((p) => (
            <g key={p.key}>
              <path d={sectorPath(p.startAngle, p.endAngle)} fill={p.color} opacity={phase === p.key ? 1 : 0.35} />
              <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fontSize={phase === p.key ? 11 : 10} fill="#fff" fontWeight={phase === p.key ? 800 : 500}>
                {p.label}
              </text>
            </g>
          ))}
          <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke="rgba(255,255,255,0.65)" strokeWidth={2} />
          <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} stroke="rgba(255,255,255,0.65)" strokeWidth={2} />
          <text x={cx + r + 9} y={cy} dominantBaseline="middle" fontSize={9} fill="#64748b">成長&#x2191;</text>
          <text x={cx - r - 9} y={cy} textAnchor="end" dominantBaseline="middle" fontSize={9} fill="#64748b">成長&#x2193;</text>
          <text x={cx} y={cy - r - 10} textAnchor="middle" fontSize={9} fill="#64748b">通脹&#x2191;</text>
          <text x={cx} y={cy + r + 14} textAnchor="middle" fontSize={9} fill="#64748b">通脹&#x2193;</text>
          <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#1e293b" strokeWidth={3.5} strokeLinecap="round" />
          <circle cx={cx} cy={cy} r={9} fill="#1e293b" />
          <circle cx={cx} cy={cy} r={4} fill="#f0b429" />
        </svg>
      </div>
      <div className="flex-1 min-w-[140px] pl-2 text-sm text-gray-600 leading-relaxed">
        <div className="text-base font-bold text-[#0f2a4a] mb-1.5">{phaseZh}（{phase === "stagflation" ? "Stagflation" : phase === "recovery" ? "Recovery" : phase === "overheating" ? "Overheating" : "Recession"}）</div>
        <div>成長方向：<b>{growthDirection === "up" ? "↑ 上升" : "↓ 下降"}</b></div>
        <div>通脹方向：<b>{inflationDirection === "up" ? "↑ 上升" : "↓ 下降"}</b></div>
        <div className="mt-2.5 p-2 bg-white border border-gray-200 rounded-md">
          <div className="text-[10px] text-gray-400 tracking-wider">10Y-5Y 利差</div>
          <div className="text-xl font-bold text-[#0f2a4a] my-0.5">+{yieldSpread.toFixed(3)}</div>
        </div>
        <div className="text-[9px] text-gray-400 mt-2 leading-relaxed">
          判斷依據：<br />10Y-5Y利差 20日MA斜率<br />+ TIP/IEF比率 20日MA斜率
        </div>
      </div>
    </div>
  )
}
