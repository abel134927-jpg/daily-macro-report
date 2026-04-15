import { CommodityItem, ForexItem, BondItem } from "@/lib/types"
import { formatPrice, formatChange, formatPercent, getTrendIcon, getTrendColor, getChangeBg } from "@/lib/utils"
import { SectionHeader } from "./MarketIndices"

interface CommodityForexBondProps {
  commodities: CommodityItem[]
  forex: ForexItem[]
  bonds: BondItem[]
}

export function CommodityForexBond({ commodities, forex, bonds }: CommodityForexBondProps) {
  return (
    <div className="mb-6">
      <SectionHeader number={3} title="商品、外匯與債券" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
        {/* Commodities */}
        <div>
          <div className="text-[11px] font-semibold text-gray-500 py-1 mb-1 border-b border-gray-200">大宗商品</div>
          <table className="w-full text-[11px]">
            <thead>
              <tr className="bg-[#1e293b] text-gray-200">
                <th className="px-2.5 py-1.5 text-left font-semibold">商品</th>
                <th className="px-2.5 py-1.5 text-right font-semibold">價格</th>
                <th className="px-2.5 py-1.5 text-right font-semibold">漲跌</th>
                <th className="px-2.5 py-1.5 text-right font-semibold">漲跌幅</th>
                <th className="px-2.5 py-1.5 text-center font-semibold">趨勢</th>
              </tr>
            </thead>
            <tbody>
              {commodities.map((c) => (
                <tr key={c.name} className="hover:bg-blue-50 even:bg-gray-50/50 border-b border-gray-100">
                  <td className="px-2.5 py-1.5 font-medium">{c.name}</td>
                  <td className="px-2.5 py-1.5 text-right font-mono">${formatPrice(c.price)}</td>
                  <td className={`px-2.5 py-1.5 text-right font-mono font-semibold ${c.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {formatChange(c.change)}
                  </td>
                  <td className="px-2.5 py-1.5 text-right">
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${getChangeBg(c.changePercent)}`}>
                      {formatPercent(c.changePercent)}
                    </span>
                  </td>
                  <td className={`px-2.5 py-1.5 text-center font-semibold ${getTrendColor(c.trend)}`}>{getTrendIcon(c.trend)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Forex */}
        <div>
          <div className="text-[11px] font-semibold text-gray-500 py-1 mb-1 border-b border-gray-200">外匯市場</div>
          <table className="w-full text-[11px]">
            <thead>
              <tr className="bg-[#1e293b] text-gray-200">
                <th className="px-2.5 py-1.5 text-left font-semibold">貨幣對</th>
                <th className="px-2.5 py-1.5 text-right font-semibold">匯率</th>
                <th className="px-2.5 py-1.5 text-right font-semibold">漲跌</th>
                <th className="px-2.5 py-1.5 text-right font-semibold">漲跌幅</th>
                <th className="px-2.5 py-1.5 text-center font-semibold">趨勢</th>
              </tr>
            </thead>
            <tbody>
              {forex.map((f) => (
                <tr key={f.name} className="hover:bg-blue-50 even:bg-gray-50/50 border-b border-gray-100">
                  <td className="px-2.5 py-1.5 font-medium">{f.name}</td>
                  <td className="px-2.5 py-1.5 text-right font-mono">{formatPrice(f.rate)}</td>
                  <td className={`px-2.5 py-1.5 text-right font-mono font-semibold ${f.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {formatChange(f.change, 4)}
                  </td>
                  <td className="px-2.5 py-1.5 text-right">
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${getChangeBg(f.changePercent)}`}>
                      {formatPercent(f.changePercent)}
                    </span>
                  </td>
                  <td className={`px-2.5 py-1.5 text-center font-semibold ${getTrendColor(f.trend)}`}>{getTrendIcon(f.trend)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bonds */}
      <div className="text-[11px] font-semibold text-gray-500 py-1 mb-1 border-b border-gray-200 mt-3">債券殖利率</div>
      <table className="w-full text-[11px]">
        <thead>
          <tr className="bg-[#1e293b] text-gray-200">
            <th className="px-2.5 py-1.5 text-left font-semibold">債券</th>
            <th className="px-2.5 py-1.5 text-right font-semibold">殖利率</th>
            <th className="px-2.5 py-1.5 text-right font-semibold">變動</th>
            <th className="px-2.5 py-1.5 text-right font-semibold">幅度</th>
            <th className="px-2.5 py-1.5 text-center font-semibold">趨勢</th>
          </tr>
        </thead>
        <tbody>
          {bonds.map((b) => (
            <tr key={b.name} className="hover:bg-blue-50 even:bg-gray-50/50 border-b border-gray-100">
              <td className="px-2.5 py-1.5 font-medium">{b.name}</td>
              <td className="px-2.5 py-1.5 text-right font-mono">{b.yield.toFixed(3)}%</td>
              <td className={`px-2.5 py-1.5 text-right font-mono font-semibold ${b.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                {formatChange(b.change, 4)}
              </td>
              <td className="px-2.5 py-1.5 text-right">
                <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${getChangeBg(b.changePercent)}`}>
                  {formatPercent(b.changePercent)}
                </span>
              </td>
              <td className={`px-2.5 py-1.5 text-center font-semibold ${getTrendColor(b.trend)}`}>{getTrendIcon(b.trend)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
