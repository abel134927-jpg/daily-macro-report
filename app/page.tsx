"use client"

import { reportData } from "@/lib/report-data"
import { ReportHeader } from "@/components/report/ReportHeader"
import { HeroCards } from "@/components/report/HeroCards"
import { MarketIndices } from "@/components/report/MarketIndices"
import { MacroNews } from "@/components/report/MacroNews"
import { CommodityForexBond } from "@/components/report/CommodityForexBond"
import { SentimentGauge } from "@/components/report/SentimentGauge"
import { FundFlow } from "@/components/report/FundFlow"
import { HotStocks } from "@/components/report/HotStocks"
import { CryptoMarket } from "@/components/report/CryptoMarket"
import { ReportFooter } from "@/components/report/ReportFooter"

export default function Home() {
  return (
    <>
      {/* Print / Download Button */}
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

      <div className="max-w-[960px] mx-auto my-6 bg-white shadow-lg rounded overflow-hidden print:max-w-full print:mx-0 print:my-0 print:shadow-none print:rounded-none">
        <ReportHeader date={reportData.date} generatedAt={reportData.generatedAt} />

        {/* Content Body */}
        <div className="px-8 py-6 print:px-5 print:py-4">
          {/* Hero Ticker */}
          <HeroCards indicators={reportData.heroIndicators} />
          <MarketIndices regions={reportData.marketRegions} />
          <MacroNews news={reportData.news} />
          <CommodityForexBond
            commodities={reportData.commodities}
            forex={reportData.forex}
            bonds={reportData.bonds}
          />
          <SentimentGauge data={reportData.sentiment} />
          <FundFlow
            globalFlows={reportData.globalFundFlows}
            sectorFlows={reportData.sectorFlows}
            bondFlows={reportData.bondFlows}
          />
          <HotStocks inflow={reportData.hotStocksInflow} outflow={reportData.hotStocksOutflow} />
          <CryptoMarket crypto={reportData.crypto} />
        </div>

        <ReportFooter generatedAt={reportData.generatedAt} />
      </div>
    </>
  )
}
