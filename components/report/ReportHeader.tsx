interface ReportHeaderProps {
  date: string
  generatedAt: string
}

export function ReportHeader({ date, generatedAt }: ReportHeaderProps) {
  return (
    <div className="bg-gradient-to-br from-[#0a1628] via-[#0f2a4a] to-[#163460] px-9 pt-7 pb-5 text-white relative">
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#f0b429] via-[#e85d04] to-[#f0b429]" />
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-lg font-bold tracking-widest leading-tight">每日宏觀資訊綜合早報</h1>
          <h2 className="text-[11px] font-light tracking-[5px] opacity-65 mt-1">Daily Macro Market Briefing</h2>
        </div>
        <div className="text-right text-[11px] opacity-75 leading-relaxed">
          <div className="text-[15px] font-bold">{date}</div>
          <div>生成時間 {generatedAt}</div>
        </div>
      </div>
      <div className="mt-3.5 pt-3 border-t border-white/15 text-[10.5px] opacity-80 flex gap-6 flex-wrap">
        <span>&#128202; Yahoo Finance</span>
        <span>&#128200; CNN Fear &amp; Greed Index</span>
        <span>&#128240; RSS: Reuters / MarketWatch / CNBC</span>
        <span>&#9888; 本報告僅供參考，不構成投資建議</span>
      </div>
    </div>
  )
}
