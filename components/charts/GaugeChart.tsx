"use client"

interface GaugeChartProps {
  value: number
  label: string
}

export function GaugeChart({ value, label }: GaugeChartProps) {
  const clampedValue = Math.max(0, Math.min(100, value))
  const angle = -90 + (clampedValue / 100) * 180
  const needleRad = (angle * Math.PI) / 180
  const needleLen = 84
  const cx = 200
  const cy = 162
  const nx = cx + needleLen * Math.cos(needleRad)
  const ny = cy + needleLen * Math.sin(needleRad)

  function getColor(v: number) {
    if (v <= 25) return "#dc2626"
    if (v <= 45) return "#f97316"
    if (v <= 55) return "#eab308"
    if (v <= 75) return "#4ade80"
    return "#16a34a"
  }

  const segments = [
    { start: 0, end: 25, color: "#dc2626", labelZh: ["極度", "恐懼"] },
    { start: 25, end: 45, color: "#f97316", labelZh: ["恐懼"] },
    { start: 45, end: 55, color: "#eab308", labelZh: ["中性"] },
    { start: 55, end: 75, color: "#4ade80", labelZh: ["貪婪"] },
    { start: 75, end: 100, color: "#16a34a", labelZh: ["極度", "貪婪"] },
  ]

  function arcPath(startPct: number, endPct: number, outerR: number, innerR: number) {
    const startAngle = -90 + (startPct / 100) * 180
    const endAngle = -90 + (endPct / 100) * 180
    const s1 = (startAngle * Math.PI) / 180
    const e1 = (endAngle * Math.PI) / 180
    const x1 = cx + outerR * Math.cos(s1)
    const y1 = cy + outerR * Math.sin(s1)
    const x2 = cx + outerR * Math.cos(e1)
    const y2 = cy + outerR * Math.sin(e1)
    const x3 = cx + innerR * Math.cos(e1)
    const y3 = cy + innerR * Math.sin(e1)
    const x4 = cx + innerR * Math.cos(s1)
    const y4 = cy + innerR * Math.sin(s1)
    const large = endAngle - startAngle > 180 ? 1 : 0
    return `M ${x1},${y1} A ${outerR},${outerR} 0 ${large},1 ${x2},${y2} L ${x3},${y3} A ${innerR},${innerR} 0 ${large},0 ${x4},${y4} Z`
  }

  return (
    <svg viewBox="0 0 400 248" className="w-full max-w-[360px] mx-auto block">
      {segments.map((seg, i) => {
        const midPct = (seg.start + seg.end) / 2
        const midAngle = (-90 + (midPct / 100) * 180) * Math.PI / 180
        const labelR = 113
        const lx = cx + labelR * Math.cos(midAngle)
        const ly = cy + labelR * Math.sin(midAngle)
        return (
          <g key={i}>
            <path d={arcPath(seg.start, seg.end, 142, 58)} fill={seg.color} stroke="#fff" strokeWidth={2} />
            {seg.labelZh.map((line, li) => (
              <text key={li} x={lx} y={ly + (li - (seg.labelZh.length - 1) / 2) * 11} textAnchor="middle" dominantBaseline="middle" fontSize={9} fill="#fff" fontWeight={700}>
                {line}
              </text>
            ))}
          </g>
        )
      })}
      <text x={40} y={162} textAnchor="end" dominantBaseline="middle" fontSize={10} fill="#94a3b8">0</text>
      <text x={360} y={162} textAnchor="start" dominantBaseline="middle" fontSize={10} fill="#94a3b8">100</text>
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#1e293b" strokeWidth={4} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={11} fill="#1e293b" />
      <circle cx={cx} cy={cy} r={5} fill={getColor(clampedValue)} />
      <text x={cx} y={202} textAnchor="middle" fontSize={30} fontWeight={700} fill={getColor(clampedValue)}>
        {Math.round(value)}
      </text>
      <text x={cx} y={222} textAnchor="middle" fontSize={12} fill="#475569">
        {label}
      </text>
    </svg>
  )
}
