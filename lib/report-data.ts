import { ReportData } from "./types"

function generateSparkline(base: number, volatility: number, trend: number): number[] {
  const data: number[] = []
  let current = base * (1 - volatility * 15 + trend * 0.5)
  for (let i = 0; i < 30; i++) {
    current += (Math.random() - 0.45 + trend * 0.02) * base * volatility
    data.push(Math.round(current * 100) / 100)
  }
  return data
}

export const reportData: ReportData = {
  date: "2026-04-15",
  generatedAt: "2026-04-15 07:30",

  heroIndicators: [
    { name: "S&P 500", value: 6967.38, change: 81.14, changePercent: 1.18, sparklineData: generateSparkline(6967, 0.008, 0.3) },
    { name: "NASDAQ", value: 23639.08, change: 455.34, changePercent: 1.96, sparklineData: generateSparkline(23639, 0.01, 0.4) },
    { name: "DOW", value: 48535.99, change: 317.74, changePercent: 0.66, sparklineData: generateSparkline(48536, 0.006, 0.2) },
    { name: "日經225", value: 56502.77, change: -421.34, changePercent: -0.74, sparklineData: generateSparkline(56503, 0.009, -0.2) },
    { name: "黃金", value: 4862.60, change: 120.20, changePercent: 2.53, sparklineData: generateSparkline(4863, 0.012, 0.5) },
    { name: "WTI原油", value: 91.47, change: -7.61, changePercent: -7.68, sparklineData: generateSparkline(91.47, 0.03, -0.6) },
    { name: "DXY", value: 98.11, change: -0.26, changePercent: -0.27, sparklineData: generateSparkline(98.11, 0.005, -0.1) },
    { name: "BTC", value: 74152, change: -332.64, changePercent: -0.45, sparklineData: generateSparkline(74152, 0.02, -0.1) },
  ],

  marketRegions: [
    {
      region: "美國市場",
      indices: [
        { name: "S&P 500", close: 6967.38, change: 81.14, changePercent: 1.18, trend: "up", ytd: 1.59 },
        { name: "納斯達克", close: 23639.08, change: 455.34, changePercent: 1.96, trend: "up", ytd: 1.74 },
        { name: "道瓊斯", close: 48535.99, change: 317.74, changePercent: 0.66, trend: "up", ytd: 0.32 },
        { name: "羅素2000", close: 2705.67, change: 35.18, changePercent: 1.32, trend: "up", ytd: 7.87 },
        { name: "費城半導體", close: 9224.12, change: 184.60, changePercent: 2.04, trend: "strong_up", ytd: 25.20 },
      ],
    },
    {
      region: "亞洲市場",
      indices: [
        { name: "日經225", close: 56502.77, change: -421.34, changePercent: -0.74, trend: "down", ytd: 9.01 },
        { name: "台灣加權", close: 35457.29, change: 39.46, changePercent: 0.11, trend: "up", ytd: 20.81 },
        { name: "香港恆生", close: 25660.85, change: -232.69, changePercent: -0.90, trend: "down", ytd: -2.57 },
        { name: "上證綜指", close: 3988.56, change: 2.33, changePercent: 0.06, trend: "up", ytd: -0.87 },
        { name: "深證成指", close: 14407.86, change: 98.39, changePercent: 0.69, trend: "up", ytd: 4.19 },
        { name: "韓國KOSPI", close: 5808.62, change: -50.25, changePercent: -0.86, trend: "down", ytd: 34.78 },
        { name: "澳洲ASX200", close: 8926.00, change: -34.60, changePercent: -0.39, trend: "down", ytd: 2.27 },
      ],
    },
    {
      region: "新興市場",
      indices: [
        { name: "印度SENSEX", close: 76847.57, change: -702.68, changePercent: -0.91, trend: "down", ytd: -9.79 },
        { name: "印度NIFTY50", close: 23842.65, change: -207.95, changePercent: -0.86, trend: "down", ytd: -8.81 },
        { name: "印尼雅加達綜合", close: 7500.19, change: 41.69, changePercent: 0.56, trend: "up", ytd: -14.27 },
        { name: "泰國SET", close: 1506.84, change: 17.18, changePercent: 1.15, trend: "up", ytd: 17.72 },
        { name: "馬來西亞KLCI", close: 1680.52, change: -10.79, changePercent: -0.64, trend: "down", ytd: 0.64 },
        { name: "菲律賓PSEi", close: 6054.05, change: -44.16, changePercent: -0.72, trend: "down", ytd: -1.32 },
      ],
    },
    {
      region: "歐洲市場",
      indices: [
        { name: "德國DAX", close: 23742.44, change: -61.51, changePercent: -0.26, trend: "down", ytd: -3.25 },
        { name: "英國FTSE100", close: 10583.00, change: -17.50, changePercent: -0.17, trend: "down", ytd: 6.35 },
        { name: "法國CAC40", close: 8235.98, change: -23.62, changePercent: -0.29, trend: "down", ytd: 0.50 },
        { name: "歐洲STOXX50", close: 5905.02, change: -21.09, changePercent: -0.36, trend: "down", ytd: -0.32 },
        { name: "瑞士SMI", close: 13145.91, change: -37.37, changePercent: -0.28, trend: "down", ytd: -0.77 },
      ],
    },
  ],

  news: [
    {
      impact: "high", sentiment: "bull", region: "美國",
      titleZh: "美股受伊朗談判希望提振大幅上漲",
      titleEn: "Wall Street rallies on renewed hopes for US-Iran talks, earnings boost",
      summary: "道瓊指數上漲0.67%，標普500指數上漲超1%，納指漲近2%，市場對美伊談判前景樂觀，企業財報表現強勁提振投資者信心。",
      source: "Reuters Videos", time: "04-14 22:18",
      url: "https://finance.yahoo.com/video/wall-street-rallies-renewed-hopes-221824061.html",
    },
    {
      impact: "mid", sentiment: "bear", region: "美國",
      titleZh: "信用卡附加費上升衝擊消費者錢包",
      titleEn: "What Credit Card Surcharges Mean for Your Wallet",
      summary: "商家普遍加收附加費應對成本上升，消費者實際支出增加，引發民眾不滿，可能影響零售消費意願。",
      source: "CNBC", time: "04-14",
      url: "https://www.today.com/video/how-to-avoid-credit-card-surcharges-and-convenience-fees-261315141591",
    },
    {
      impact: "high", sentiment: "bear", region: "全球",
      titleZh: "芝加哥聯準主席：中東戰爭延長將推遲降息時間",
      titleEn: "Chicago Fed president Austan Goolsbee: The longer the war goes on, the more a rate cut gets pushed off",
      summary: "古爾斯比表示供給面衝擊如油價上升會推高通膨預期，影響聯準會政策方向，暗示戰爭升級將延後降息計畫。",
      source: "Yahoo Finance", time: "04-14 15:52",
      url: "https://finance.yahoo.com/news/chicago-fed-president-austan-goolsbee-the-longer-the-war-goes-on-the-more-a-rate-cut-gets-pushed-off-155208464.html",
    },
    {
      impact: "high", sentiment: "bull", region: "美國",
      titleZh: "標普500五檔科技股助力消除伊朗戰爭虧損",
      titleEn: "5 Stocks in the S&P 500 ETF That Helped Erase Iran War Losses",
      summary: "科技股漲幅超30%領漲，標普500指數收復伊朗戰爭期間跌幅，高動能科技股成為市場反彈主引擎。",
      source: "Zacks", time: "04-14 14:17",
      url: "https://finance.yahoo.com/markets/stocks/articles/5-stocks-p-500-etf-141700760.html",
    },
    {
      impact: "mid", sentiment: "neutral", region: "全球",
      titleZh: "美股因伊朗談判希望溫和上漲，荷姆茲海峽風險加重",
      titleEn: "Stock market today: Dow, S&P 500, Nasdaq edge higher as Trump says Iran wants to talk, US blockades Hormuz",
      summary: "主要股指小幅上漲，但荷姆茲海峽通道風險仍引發通膨及全球經濟擔憂，市場樂觀情緒受到制約。",
      source: "Yahoo Finance", time: "04-13 18:32",
      url: "https://finance.yahoo.com/news/live/stock-market-today-dow-sp-500-nasdaq-mixed-after-trump-orders-hormuz-blockade-against-iran-145712025.html",
    },
    {
      impact: "mid", sentiment: "neutral", region: "全球",
      titleZh: "油價供需失衡，能源ETF前景不確定",
      titleEn: "Oil to Slip on Demand Woes or Hold on Supply Risks? ETFs in Focus",
      summary: "油價面臨需求減速與供應風險的拉鋸，XOP與CRAK等能源ETF波動加劇，後市展望難以判斷。",
      source: "Zacks", time: "04-14 16:00",
      url: "https://finance.yahoo.com/sectors/energy/articles/oil-slip-demand-woes-hold-160000742.html",
    },
    {
      impact: "mid", sentiment: "neutral", region: "美國",
      titleZh: "美股期貨持平，銀行利潤增長被中東局勢掣肘",
      titleEn: "Stock market today: S&P 500, Nasdaq, Dow futures hover amid renewed hopes for US-Iran talks",
      summary: "股指期貨交投平穩，銀行業績表現亮眼但伊朗局勢憂慮抑制市場情緒，投資者觀望態度明顯。",
      source: "Yahoo Finance", time: "04-14 23:11",
      url: "https://finance.yahoo.com/markets/stocks/article/stock-market-today-sp-500-nasdaq-dow-futures-hover-amid-renewed-hopes-for-us-iran-talks-231104868.html",
    },
    {
      impact: "high", sentiment: "bull", region: "美國",
      titleZh: "標普500接近歷史高點，中東緊張緩和帶動反彈",
      titleEn: "Stock Market Today, April 14: Markets Erase Iran War Losses on Talk Optimism",
      summary: "美股市場因中東局勢緩和預期強勁上漲，標普500指數逼近歷史新高，風險資產受惠於和平談判希望。",
      source: "Motley Fool", time: "04-14 21:37",
      url: "https://www.fool.com/coverage/stock-market-today/2026/04/14/stock-market-today-april-14-markets-erase-iran-war-losses-on-talk-optimism/",
    },
    {
      impact: "mid", sentiment: "bull", region: "全球",
      titleZh: "美元走弱推高金價，3月批發物價漲幅低於預期",
      titleEn: "Gold Moves Higher as the Dollar Weakened as U.S. Wholesale Price Inflation Rose Less Than Expected in March",
      summary: "美元下跌帶動金價上升，3月批發物價漲幅低於預期，通膨壓力緩解利好黃金與風險資產。",
      source: "MT Newswires", time: "04-14 13:15",
      url: "https://finance.yahoo.com/markets/commodities/articles/gold-moves-higher-dollar-weakened-131559965.html",
    },
    {
      impact: "mid", sentiment: "bull", region: "全球",
      titleZh: "美元疲軟推升黃金，批發物價數據緩解通膨憂慮",
      titleEn: "Update: Gold Moves Higher as the Dollar Weakens as U.S. Wholesale Price Inflation Rose Less Than Expected",
      summary: "美元指數下行，黃金於午盤交投走高，美國批發物價增幅溫和，市場通膨預期向下調整。",
      source: "MT Newswires", time: "04-14 18:02",
      url: "https://finance.yahoo.com/markets/commodities/articles/gold-moves-higher-dollar-weakens-180239080.html",
    },
  ],

  commodities: [
    { name: "黃金", price: 4862.60, change: 120.20, changePercent: 2.53, trend: "strong_up" },
    { name: "白銀", price: 79.58, change: 4.06, changePercent: 5.37, trend: "strong_up" },
    { name: "原油(WTI)", price: 91.47, change: -7.61, changePercent: -7.68, trend: "strong_down" },
    { name: "布蘭特原油", price: 94.90, change: -4.46, changePercent: -4.49, trend: "strong_down" },
    { name: "銅", price: 6.08, change: 0.10, changePercent: 1.75, trend: "up" },
    { name: "天然氣", price: 2.59, change: -0.04, changePercent: -1.33, trend: "down" },
  ],

  forex: [
    { name: "美元指數", rate: 98.11, change: -0.26, changePercent: -0.27, trend: "down" },
    { name: "EUR/USD", rate: 1.1769, change: 0.0094, changePercent: 0.80, trend: "up" },
    { name: "USD/JPY", rate: 159.21, change: -0.47, changePercent: -0.29, trend: "down" },
    { name: "GBP/USD", rate: 1.3515, change: 0.0121, changePercent: 0.90, trend: "up" },
    { name: "USD/CNY", rate: 6.8303, change: 0.0025, changePercent: 0.04, trend: "up" },
    { name: "USD/TWD", rate: 31.64, change: -0.13, changePercent: -0.40, trend: "down" },
  ],

  bonds: [
    { name: "美國3月期", yield: 3.612, change: 0.009, changePercent: 0.25, trend: "up" },
    { name: "美國5年期", yield: 3.871, change: -0.046, changePercent: -1.17, trend: "down" },
    { name: "美國10年期", yield: 4.256, change: -0.041, changePercent: -0.95, trend: "down" },
    { name: "美國30年期", yield: 4.868, change: -0.032, changePercent: -0.65, trend: "down" },
  ],

  sentiment: {
    fearGreed: { current: 47.0, previous: 41.0, weekAgo: 27.6, monthAgo: 21.4, yearAgo: 12.3, label: "中性" },
    vix: { value: 18.36, label: "中波動" },
    tenYearYield: 4.256,
    dollarIndex: 98.11,
    yieldSpread: 0.385,
    economicCycle: {
      phase: "stagflation",
      phaseZh: "滯脹期",
      growthDirection: "down",
      inflationDirection: "up",
    },
  },

  globalFundFlows: [
    { name: "美國", etf: "SPY", daily: "+401.5億", weekly: "+1281.7億", monthly: "-556.4億", ytd: "+1538.0億", dailyDirection: "up", weeklyDirection: "up", monthlyDirection: "down", ytdDirection: "up" },
    { name: "歐洲", etf: "VGK", daily: "+6599萬", weekly: "+5.89億", monthly: "+9.76億", ytd: "+37.8億", dailyDirection: "up", weeklyDirection: "up", monthlyDirection: "up", ytdDirection: "up" },
    { name: "日本", etf: "EWJ", daily: "+5.01億", weekly: "+16.0億", monthly: "-441萬", ytd: "+107.9億", dailyDirection: "up", weeklyDirection: "up", monthlyDirection: "down", ytdDirection: "up" },
    { name: "中國/港股", etf: "FXI", daily: "+10.2億", weekly: "+14.6億", monthly: "-19.4億", ytd: "+115.0億", dailyDirection: "up", weeklyDirection: "up", monthlyDirection: "down", ytdDirection: "up" },
    { name: "台灣", etf: "EWT", daily: "+3.65億", weekly: "+15.1億", monthly: "+23.9億", ytd: "+63.2億", dailyDirection: "up", weeklyDirection: "up", monthlyDirection: "up", ytdDirection: "up" },
    { name: "韓國", etf: "EWY", daily: "+18.5億", weekly: "+83.5億", monthly: "+85.7億", ytd: "+253.9億", dailyDirection: "up", weeklyDirection: "up", monthlyDirection: "up", ytdDirection: "up" },
    { name: "印度", etf: "INDA", daily: "-1.49億", weekly: "-7.02億", monthly: "-18.4億", ytd: "+21.7億", dailyDirection: "down", weeklyDirection: "down", monthlyDirection: "down", ytdDirection: "up" },
    { name: "新興市場", etf: "VWO", daily: "+2.08億", weekly: "+4.11億", monthly: "-2.08億", ytd: "+81.4億", dailyDirection: "up", weeklyDirection: "up", monthlyDirection: "down", ytdDirection: "up" },
    { name: "印尼", etf: "EIDO", daily: "+50.9萬", weekly: "-333萬", monthly: "+340萬", ytd: "-6730萬", dailyDirection: "up", weeklyDirection: "down", monthlyDirection: "up", ytdDirection: "down" },
    { name: "越南", etf: "VNM", daily: "+401萬", weekly: "+4076萬", monthly: "-1656萬", ytd: "-8006萬", dailyDirection: "up", weeklyDirection: "up", monthlyDirection: "down", ytdDirection: "down" },
    { name: "泰國", etf: "THD", daily: "+141萬", weekly: "+2233萬", monthly: "+3834萬", ytd: "+7147萬", dailyDirection: "up", weeklyDirection: "up", monthlyDirection: "up", ytdDirection: "up" },
    { name: "馬來西亞", etf: "EWM", daily: "+20.0萬", weekly: "+468萬", monthly: "-3497萬", ytd: "+7829萬", dailyDirection: "up", weeklyDirection: "up", monthlyDirection: "down", ytdDirection: "up" },
    { name: "菲律賓", etf: "EPHE", daily: "+88.9萬", weekly: "+315萬", monthly: "+727萬", ytd: "+4388萬", dailyDirection: "up", weeklyDirection: "up", monthlyDirection: "up", ytdDirection: "up" },
    { name: "澳洲", etf: "EWA", daily: "+2350萬", weekly: "+1.12億", monthly: "+1.43億", ytd: "+17.8億", dailyDirection: "up", weeklyDirection: "up", monthlyDirection: "up", ytdDirection: "up" },
  ],

  sectorFlows: [
    { name: "資訊科技", etf: "XLK", daily: "+14.9億", weekly: "+31.6億", monthly: "-17.5億", ytd: "-60.6億", dailyDirection: "up", weeklyDirection: "up", monthlyDirection: "down", ytdDirection: "down" },
    { name: "公用事業", etf: "XLU", daily: "+8.48億", weekly: "+9.71億", monthly: "-20.4億", ytd: "+49.2億", dailyDirection: "up", weeklyDirection: "up", monthlyDirection: "down", ytdDirection: "up" },
    { name: "金融", etf: "XLF", daily: "+8.09億", weekly: "+19.2億", monthly: "-33.2億", ytd: "-6.73億", dailyDirection: "up", weeklyDirection: "up", monthlyDirection: "down", ytdDirection: "down" },
    { name: "工業", etf: "XLI", daily: "+3.00億", weekly: "+23.0億", monthly: "-33.8億", ytd: "+136.4億", dailyDirection: "up", weeklyDirection: "up", monthlyDirection: "down", ytdDirection: "up" },
    { name: "能源", etf: "XLE", daily: "-1494萬", weekly: "+16.1億", monthly: "-16.6億", ytd: "+75.5億", dailyDirection: "down", weeklyDirection: "up", monthlyDirection: "down", ytdDirection: "up" },
    { name: "非必需消費", etf: "XLY", daily: "+6.15億", weekly: "+11.2億", monthly: "-10.7億", ytd: "+73.1億", dailyDirection: "up", weeklyDirection: "up", monthlyDirection: "down", ytdDirection: "up" },
    { name: "通訊服務", etf: "XLC", daily: "+4.52億", weekly: "+11.3億", monthly: "-21.8億", ytd: "+22.4億", dailyDirection: "up", weeklyDirection: "up", monthlyDirection: "down", ytdDirection: "up" },
    { name: "房地產", etf: "XLRE", daily: "+1.78億", weekly: "+5.67億", monthly: "-12.9億", ytd: "+14.7億", dailyDirection: "up", weeklyDirection: "up", monthlyDirection: "down", ytdDirection: "up" },
    { name: "原材料", etf: "XLB", daily: "+1.13億", weekly: "+9.23億", monthly: "-2.72億", ytd: "+102.8億", dailyDirection: "up", weeklyDirection: "up", monthlyDirection: "down", ytdDirection: "up" },
    { name: "醫療保健", etf: "XLV", daily: "+3.99億", weekly: "+17.0億", monthly: "-69.0億", ytd: "+24.0億", dailyDirection: "up", weeklyDirection: "up", monthlyDirection: "down", ytdDirection: "up" },
    { name: "必需消費", etf: "XLP", daily: "+4.35億", weekly: "+14.0億", monthly: "-28.3億", ytd: "+172.6億", dailyDirection: "up", weeklyDirection: "up", monthlyDirection: "down", ytdDirection: "up" },
  ],

  bondFlows: [
    { name: "1-3年國債", etf: "SHY", daily: "+2.91億", weekly: "+1.05億", monthly: "-3.28億", ytd: "-4.19億", dailyDirection: "up", weeklyDirection: "up", monthlyDirection: "down", ytdDirection: "down" },
    { name: "3-7年國債", etf: "IEI", daily: "+1.29億", weekly: "+4648萬", monthly: "-5.48億", ytd: "-9688萬", dailyDirection: "up", weeklyDirection: "up", monthlyDirection: "down", ytdDirection: "down" },
    { name: "7-10年國債", etf: "IEF", daily: "+4.76億", weekly: "-1.45億", monthly: "-28.2億", ytd: "+8096萬", dailyDirection: "up", weeklyDirection: "down", monthlyDirection: "down", ytdDirection: "up" },
    { name: "10-20年國債", etf: "TLH", daily: "+5635萬", weekly: "+1.37億", monthly: "+3059萬", ytd: "-4163萬", dailyDirection: "up", weeklyDirection: "up", monthlyDirection: "up", ytdDirection: "down" },
    { name: "20年+國債", etf: "TLT", daily: "+13.0億", weekly: "+10.5億", monthly: "-27.6億", ytd: "+100.1億", dailyDirection: "up", weeklyDirection: "up", monthlyDirection: "down", ytdDirection: "up" },
    { name: "投資級債", etf: "LQD", daily: "+15.4億", weekly: "-14.5億", monthly: "-110.5億", ytd: "+82.9億", dailyDirection: "up", weeklyDirection: "down", monthlyDirection: "down", ytdDirection: "up" },
    { name: "非投資等債", etf: "HYG", daily: "+17.8億", weekly: "+21.6億", monthly: "+53.4億", ytd: "+243.2億", dailyDirection: "up", weeklyDirection: "up", monthlyDirection: "up", ytdDirection: "up" },
    { name: "新興債", etf: "EMB", daily: "+2.94億", weekly: "+7.14億", monthly: "-9.48億", ytd: "+1.34億", dailyDirection: "up", weeklyDirection: "up", monthlyDirection: "down", ytdDirection: "up" },
    { name: "新興美元債", etf: "VWOB", daily: "+1754萬", weekly: "+288萬", monthly: "-5628萬", ytd: "+1.05億", dailyDirection: "up", weeklyDirection: "up", monthlyDirection: "down", ytdDirection: "up" },
    { name: "新興本地債", etf: "EMLC", daily: "-4658萬", weekly: "+1.57億", monthly: "-5855萬", ytd: "+7.46億", dailyDirection: "down", weeklyDirection: "up", monthlyDirection: "down", ytdDirection: "up" },
  ],

  hotStocksInflow: [
    { name: "Amazon", symbol: "AMZN", price: 249.02, changePercent: 3.81, volumeRatio: 1.6 },
  ],

  hotStocksOutflow: [],

  crypto: [
    { name: "Bitcoin", symbol: "BTC", price: 74152.00, change: -332.64, changePercent: -0.45, trend: "down" },
    { name: "Ethereum", symbol: "ETH", price: 2320.58, change: -50.13, changePercent: -2.11, trend: "strong_down" },
    { name: "BNB", symbol: "BNB", price: 614.14, change: -0.91, changePercent: -0.15, trend: "down" },
    { name: "Solana", symbol: "SOL", price: 83.77, change: -2.89, changePercent: -3.33, trend: "strong_down" },
    { name: "XRP", symbol: "XRP", price: 1.36, change: -0.02, changePercent: -1.12, trend: "down" },
    { name: "Cardano", symbol: "ADA", price: 0.2398, change: -0.01, changePercent: -3.53, trend: "strong_down" },
    { name: "Dogecoin", symbol: "DOGE", price: 0.09306, change: -0.001, changePercent: -1.13, trend: "down" },
  ],
}
