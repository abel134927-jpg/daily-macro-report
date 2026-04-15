"use client"

interface GaugeChartProps {
  value: number
  label: string
}

export function GaugeChart({ value, label }: GaugeChartProps) {
  const clampedValue = Math.max(0, Math.min(100, value))
  // Semicircle opens UPWARD: 0=left(180°), 50=top(90°), 100=right(0°)
  // angle in standard math: 180 - (value/100)*180
  const needleAngleRad = ((180 - (clampedValue / 100) * 180) * Math.PI) / 180
  const cx = 200
  const cy = 162
  const outerR = 142
  const innerR = 58
  const needleLen = outerR - 10
  const nx = cx + needleLen * Math.cos(needleAngleRad)
  const ny = cy - needleLen * Math.sin(needleAngleRad)

  function getColor(v: number) {
    if (v <= 25) return "#dc2626"
    if (v <= 45) return "#f97316"
    if (v <= 55) return "#eab308"
    if (v <= 75) return "#4ade80"
    return "#16a34a"
  }

  // Segments: pct ranges map to angles on the semicircle
  // 0% = 180°, 100% = 0° (standard math angles, Y up)
  const segments = [
    { start: 0, end: 25, color: "#dc2626", labelLines: ["極度", "恐懼"] },
    { start: 25, end: 45, color: "#f97316", labelLines: ["恐懼"] },
    { start: 45, end: 55, color: "#eab308", labelLines: ["中性"] },
    { start: 55, end: 75, color: "#4ade80", labelLines: ["貪婪"] },
    { start: 75, end: 100, color: "#16a34a", labelLines: ["極度", "貪婪"] },
  ]

  function pctToAngle(pct: number): number {
    // 0% → 180°, 100% → 0°
    return ((180 - (pct / 100) * 180) * Math.PI) / 180
  }

  function arcPath(startPct: number, endPct: number, oR: number, iR: number) {
    // startPct < endPct, but in angle terms startAngle > endAngle (going clockwise visually)
    const a1 = pctToAngle(startPct) // larger angle (more to the left)
    const a2 = pctToAngle(endPct)   // smaller angle (more to the right)

    // Outer arc: from a1 to a2 (counterclockwise in SVG = sweep 0)
    const ox1 = cx + oR * Math.cos(a1)
    const oy1 = cy - oR * Math.sin(a1)
    const ox2 = cx + oR * Math.cos(a2)
    const oy2 = cy - oR * Math.sin(a2)

    // Inner arc: from a2 back to a1
    const ix1 = cx + iR * Math.cos(a2)
    const iy1 = cy - iR * Math.sin(a2)
    const ix2 = cx + iR * Math.cos(a1)
    const iy2 = cy - iR * Math.sin(a1)

    const angleDiff = a1 - a2
    const largeArc = angleDiff > Math.PI ? 1 : 0

    return `M ${ox1},${oy1} A ${oR},${oR} 0 ${largeArc},0 ${ox2},${oy2} L ${ix1},${iy1} A ${iR},${iR} 0 ${largeArc},1 ${ix2},${iy2} Z`
  }

  return (
    <svg viewBox="0 0 400 248" className="w-full max-w-[360px] mx-auto block">
      {segments.map((seg, i) => {
        const midPct = (seg.start + seg.end) / 2
        const midAngle = pctToAngle(midPct)
        const labelR = (outerR + innerR) / 2 + 5
        const lx = cx + labelR * Math.cos(midAngle)
        const ly = cy - labelR * Math.sin(midAngle)
        return (
          <g key={i}>
            <path d={arcPath(seg.start, seg.end, outerR, innerR)} fill={seg.color} stroke="#fff" strokeWidth={2} />
            {seg.labelLines.map((line, li) => (
              <text
                key={li}
                x={lx}
                y={ly + (li - (seg.labelLines.length - 1) / 2) * 11}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={9}
                fill="#fff"
                fontWeight={700}
              >
                {line}
              </text>
            ))}
          </g>
        )
      })}

      {/* Scale labels */}
      <text x={40} y={cy} textAnchor="end" dominantBaseline="middle" fontSize={10} fill="#94a3b8">0</text>
      <text x={360} y={cy} textAnchor="start" dominantBaseline="middle" fontSize={10} fill="#94a3b8">100</text>

      {/* Needle */}
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#1e293b" strokeWidth={4} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={11} fill="#1e293b" />
      <circle cx={cx} cy={cy} r={5} fill={getColor(clampedValue)} />

      {/* Value display */}
      <text x={cx} y={cy + 40} textAnchor="middle" fontSize={30} fontWeight={700} fill={getColor(clampedValue)}>
        {Math.round(value)}
      </text>
      <text x={cx} y={cy + 60} textAnchor="middle" fontSize={12} fill="#475569">
        {label}
      </text>
    </svg>
  )
}
