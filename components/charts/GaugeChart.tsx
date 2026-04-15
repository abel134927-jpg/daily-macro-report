"use client"

interface GaugeChartProps {
  value: number
  label: string
}

export function GaugeChart({ value, label }: GaugeChartProps) {
  const clampedValue = Math.max(0, Math.min(100, value))
  const cx = 200
  const cy = 162
  const outerR = 142
  const innerR = 84

  function getColor(v: number) {
    if (v <= 25) return "#dc2626"
    if (v <= 45) return "#f97316"
    if (v <= 55) return "#eab308"
    if (v <= 75) return "#4ade80"
    return "#16a34a"
  }

  // 0% → left (PI radians), 100% → right (0 radians)
  function pctToXY(pct: number, r: number): [number, number] {
    const angle = Math.PI * (1 - pct / 100)
    return [
      Math.round((cx + r * Math.cos(angle)) * 10) / 10,
      Math.round((cy - r * Math.sin(angle)) * 10) / 10,
    ]
  }

  // Build arc segment: outer arc CW (sweep=1), inner arc CCW (sweep=0) — matching old SVG
  function segmentPath(startPct: number, endPct: number): string {
    const [ox1, oy1] = pctToXY(startPct, outerR)
    const [ox2, oy2] = pctToXY(endPct, outerR)
    const [ix2, iy2] = pctToXY(endPct, innerR)
    const [ix1, iy1] = pctToXY(startPct, innerR)
    const large = (endPct - startPct) > 50 ? 1 : 0
    return `M ${ox1},${oy1} A ${outerR},${outerR} 0 ${large},1 ${ox2},${oy2} L ${ix2},${iy2} A ${innerR},${innerR} 0 ${large},0 ${ix1},${iy1} Z`
  }

  const segments = [
    { start: 0, end: 25, color: "#dc2626", lines: ["極度", "恐懼"] },
    { start: 25, end: 45, color: "#f97316", lines: ["恐懼"] },
    { start: 45, end: 55, color: "#eab308", lines: ["中性"] },
    { start: 55, end: 75, color: "#4ade80", lines: ["貪婪"] },
    { start: 75, end: 100, color: "#16a34a", lines: ["極度", "貪婪"] },
  ]

  // Needle
  const [nx, ny] = pctToXY(clampedValue, outerR - 10)

  // Tick divider lines at segment boundaries
  const ticks = [0, 25, 45, 55, 75, 100]

  return (
    <svg viewBox="0 0 400 248" className="w-full max-w-[360px] mx-auto block">
      {segments.map((seg, i) => {
        const midPct = (seg.start + seg.end) / 2
        const [lx, ly] = pctToXY(midPct, (outerR + innerR) / 2)
        return (
          <g key={i}>
            <path d={segmentPath(seg.start, seg.end)} fill={seg.color} stroke="#fff" strokeWidth={2} />
            {seg.lines.map((line, li) => (
              <text key={li} x={lx} y={ly + (li - (seg.lines.length - 1) / 2) * 11}
                textAnchor="middle" dominantBaseline="middle" fontSize={9} fill="#fff" fontWeight={700}>
                {line}
              </text>
            ))}
          </g>
        )
      })}

      {ticks.map((pct) => {
        const [x1, y1] = pctToXY(pct, innerR)
        const [x2, y2] = pctToXY(pct, outerR)
        return <line key={pct} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth={2.5} />
      })}

      <text x={40} y={cy} textAnchor="end" dominantBaseline="middle" fontSize={10} fill="#94a3b8">0</text>
      <text x={360} y={cy} textAnchor="start" dominantBaseline="middle" fontSize={10} fill="#94a3b8">100</text>

      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#1e293b" strokeWidth={4} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={11} fill="#1e293b" />
      <circle cx={cx} cy={cy} r={5} fill={getColor(clampedValue)} />

      <text x={cx} y={cy + 40} textAnchor="middle" fontSize={30} fontWeight={700} fill={getColor(clampedValue)}>
        {Math.round(value)}
      </text>
      <text x={cx} y={cy + 60} textAnchor="middle" fontSize={12} fill="#475569">
        {label}
      </text>
    </svg>
  )
}
