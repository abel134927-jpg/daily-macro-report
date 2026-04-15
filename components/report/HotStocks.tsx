import { HotStock } from "@/lib/types"
import { formatPercent } from "@/lib/utils"
import { SectionHeader } from "./MarketIndices"

interface HotStocksProps {
  inflow: HotStock[]
  outflow: HotStock[]
}

export function HotStocks({ inflow, outflow }: HotStocksProps) {
  return (
    <div className="mb-6">
      <SectionHeader number={7} title="當日熱門美股" />
      <div className="text-[10px] text-gray-400 mb-2.5">
        篩選邏輯：資金追捧（量比 &ge; 1.5x + 上漲）｜資金出清（量比 &ge; 2.5x + 下跌）
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Inflow */}
        <div>
          <div className="text-[11px] font-semibold text-green-600 py-1 mb-1 border-b border-gray-200">&#128293; 資金追捧</div>
          <table className="w-full text-[11px]">
            <thead>
              <tr className="bg-[#1e293b] text-gray-200">
                <th className="px-2.5 py-1.5 text-left font-semibold">股票</th>
                <th className="px-2.5 py-1.5 text-left font-semibold">代碼</th>
                <th className="px-2.5 py-1.5 text-right font-semibold">收盤價</th>
                <th className="px-2.5 py-1.5 text-right font-semibold">漲跌幅</th>
                <th className="px-2.5 py-1.5 text-right font-semibold">量比</th>
              </tr>
            </thead>
            <tbody>
              {inflow.length > 0 ? inflow.map((s) => (
                <tr key={s.symbol} className="hover:bg-blue-50 border-b border-gray-100">
                  <td className="px-2.5 py-1.5 font-medium">{s.name}</td>
                  <td className="px-2.5 py-1.5 text-gray-400 font-mono text-[10px]">{s.symbol}</td>
                  <td className="px-2.5 py-1.5 text-right font-mono">${s.price.toFixed(2)}</td>
                  <td className="px-2.5 py-1.5 text-right text-green-500 font-semibold">{formatPercent(s.changePercent)}</td>
                  <td className="px-2.5 py-1.5 text-right">
                    <span className="bg-[#0f2a4a] text-white text-[9.5px] font-bold px-1.5 py-0.5 rounded-lg">{s.volumeRatio}x</span>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="px-2.5 py-1.5 text-gray-400">暫無符合條件</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Outflow */}
        <div>
          <div className="text-[11px] font-semibold text-red-600 py-1 mb-1 border-b border-gray-200">&#9888;&#65039; 資金出清</div>
          <table className="w-full text-[11px]">
            <thead>
              <tr className="bg-[#1e293b] text-gray-200">
                <th className="px-2.5 py-1.5 text-left font-semibold">股票</th>
                <th className="px-2.5 py-1.5 text-left font-semibold">代碼</th>
                <th className="px-2.5 py-1.5 text-right font-semibold">收盤價</th>
                <th className="px-2.5 py-1.5 text-right font-semibold">漲跌幅</th>
                <th className="px-2.5 py-1.5 text-right font-semibold">量比</th>
              </tr>
            </thead>
            <tbody>
              {outflow.length > 0 ? outflow.map((s) => (
                <tr key={s.symbol} className="hover:bg-blue-50 border-b border-gray-100">
                  <td className="px-2.5 py-1.5 font-medium">{s.name}</td>
                  <td className="px-2.5 py-1.5 text-gray-400 font-mono text-[10px]">{s.symbol}</td>
                  <td className="px-2.5 py-1.5 text-right font-mono">${s.price.toFixed(2)}</td>
                  <td className="px-2.5 py-1.5 text-right text-red-500 font-semibold">{formatPercent(s.changePercent)}</td>
                  <td className="px-2.5 py-1.5 text-right">
                    <span className="bg-[#0f2a4a] text-white text-[9.5px] font-bold px-1.5 py-0.5 rounded-lg">{s.volumeRatio}x</span>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="px-2.5 py-1.5 text-gray-400">暫無符合條件</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
