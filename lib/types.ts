// ===== Hero 指標 =====
export interface HeroIndicator {
  name: string
  value: number
  change: number
  changePercent: number
  sparklineData: number[]
}

// ===== 各國指數 =====
export interface MarketIndex {
  name: string
  close: number
  change: number
  changePercent: number
  trend: "up" | "down" | "strong_up" | "strong_down" | "neutral"
  ytd: number
}

export interface MarketRegion {
  region: string
  indices: MarketIndex[]
}

// ===== 宏觀新聞 =====
export type ImpactLevel = "high" | "mid" | "low"
export type Sentiment = "bull" | "bear" | "neutral"

export interface NewsItem {
  impact: ImpactLevel
  sentiment: Sentiment
  region: string
  titleZh: string
  titleEn: string
  summary: string
  source: string
  time: string
  url: string
}

// ===== 商品 / 外匯 / 債券 =====
export interface CommodityItem {
  name: string
  price: number
  change: number
  changePercent: number
  trend: "up" | "down" | "strong_up" | "strong_down" | "neutral"
}

export interface ForexItem {
  name: string
  rate: number
  change: number
  changePercent: number
  trend: "up" | "down" | "strong_up" | "strong_down" | "neutral"
}

export interface BondItem {
  name: string
  yield: number
  change: number
  changePercent: number
  trend: "up" | "down" | "strong_up" | "strong_down" | "neutral"
}

// ===== 市場情緒 =====
export interface SentimentData {
  fearGreed: {
    current: number
    previous: number
    weekAgo: number
    monthAgo: number
    yearAgo: number
    label: string
  }
  vix: {
    value: number
    label: string
  }
  tenYearYield: number
  dollarIndex: number
  yieldSpread: number
  economicCycle: {
    phase: "recovery" | "overheating" | "stagflation" | "recession"
    phaseZh: string
    growthDirection: "up" | "down"
    inflationDirection: "up" | "down"
  }
}

// ===== 資金流向 =====
export interface FundFlowItem {
  name: string
  etf: string
  daily: string
  weekly: string
  monthly: string
  ytd: string
  dailyDirection: "up" | "down"
  weeklyDirection: "up" | "down"
  monthlyDirection: "up" | "down"
  ytdDirection: "up" | "down"
}

// ===== 熱門美股 =====
export interface HotStock {
  name: string
  symbol: string
  price: number
  changePercent: number
  volumeRatio: number
}

// ===== 加密貨幣 =====
export interface CryptoItem {
  name: string
  symbol: string
  price: number
  change: number
  changePercent: number
  trend: "up" | "down" | "strong_up" | "strong_down" | "neutral"
}

// ===== 完整報告 =====
export interface ReportData {
  date: string
  generatedAt: string
  heroIndicators: HeroIndicator[]
  marketRegions: MarketRegion[]
  news: NewsItem[]
  commodities: CommodityItem[]
  forex: ForexItem[]
  bonds: BondItem[]
  sentiment: SentimentData
  globalFundFlows: FundFlowItem[]
  sectorFlows: FundFlowItem[]
  bondFlows: FundFlowItem[]
  hotStocksInflow: HotStock[]
  hotStocksOutflow: HotStock[]
  crypto: CryptoItem[]
}
