interface ReportFooterProps {
  generatedAt: string
}

export function ReportFooter({ generatedAt }: ReportFooterProps) {
  return (
    <div className="bg-gray-50 border-t-2 border-gray-200 px-8 py-4 text-[10px] text-gray-500 text-center leading-relaxed">
      <div>報告製作時間：{generatedAt}（台北時間 UTC+8）</div>
      <div>資料來源：Yahoo Finance · CNN Fear &amp; Greed Index · Reuters · MarketWatch · CNBC</div>
      <div>資金流向基於 ETF 每日原始資金流量（MFM × 成交量 × 收盤價）累加計算</div>
      <div className="text-red-500 mt-1 font-medium">本報告僅供參考，不構成任何投資建議。投資有風險，入市需謹慎。</div>
    </div>
  )
}
