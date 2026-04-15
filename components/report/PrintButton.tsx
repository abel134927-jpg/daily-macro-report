"use client"

export function PrintButton() {
  return (
    <div className="fixed bottom-7 right-7 z-50 flex flex-col items-end gap-1.5 print:hidden">
      <div className="bg-[#0f2a4a]/90 text-gray-300 text-[10px] px-3 py-1.5 rounded-lg leading-relaxed text-right max-w-[210px]">
        列印時請在設定中<br />關閉「頁首及頁尾」<br />以移除左下角網址浮水印
      </div>
      <button
        onClick={() => window.print()}
        className="bg-[#0f2a4a] text-white border-none px-5 py-3 rounded-full cursor-pointer text-sm font-semibold shadow-lg hover:bg-[#163460] hover:-translate-y-0.5 transition-all flex items-center gap-2"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 6 2 18 2 18 9" />
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <rect x="6" y="14" width="12" height="8" />
        </svg>
        列印 / 下載 PDF
      </button>
    </div>
  )
}
