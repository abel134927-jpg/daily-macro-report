import { loadReportData } from "@/lib/load-report"
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
import { PrintButton } from "@/components/report/PrintButton"

export default function Home() {
  const reportData = loadReportData()

  return (
    <>
      <PrintButton />

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
