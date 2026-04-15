import { CryptoItem } from "@/lib/types"
import { formatPrice, formatChange, formatPercent, getTrendIcon, getTrendColor, getChangeBg } from "@/lib/utils"
import { SectionHeader } from "./MarketIndices"

interface CryptoMarketProps {
  crypto: CryptoItem[]
}

export function CryptoMarket({ crypto }: CryptoMarketProps) {
  return (
    <div className="mb-6">
      <SectionHeader number={8} title="加密貨幣市場" />
      <table className="w-full text-[11px]">
        <thead>
          <tr className="bg-[#1e293b] text-gray-200">
            <th className="px-2.5 py-1.5 text-left font-semibold">幣種</th>
            <th className="px-2.5 py-1.5 text-left font-semibold">代號</th>
            <th className="px-2.5 py-1.5 text-right font-semibold">價格（USD）</th>
            <th className="px-2.5 py-1.5 text-right font-semibold">24h 漲跌</th>
            <th className="px-2.5 py-1.5 text-right font-semibold">漲跌幅</th>
            <th className="px-2.5 py-1.5 text-center font-semibold">趨勢</th>
          </tr>
        </thead>
        <tbody>
          {crypto.map((c) => (
            <tr key={c.symbol} className="hover:bg-blue-50 even:bg-gray-50/50 border-b border-gray-100">
              <td className="px-2.5 py-1.5 font-medium">{c.name}</td>
              <td className="px-2.5 py-1.5 text-gray-400 font-mono text-[10px]">{c.symbol}</td>
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
  )
}
