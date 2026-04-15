"use client"

import { useState } from "react"
import { NewsItem } from "@/lib/types"
import { SectionHeader } from "./MarketIndices"

interface MacroNewsProps {
  news: NewsItem[]
}

const impactBadge = {
  high: "bg-red-100 text-red-700",
  mid: "bg-orange-100 text-orange-700",
  low: "bg-gray-100 text-gray-500",
}
const impactLabel = { high: "高影響", mid: "中影響", low: "低影響" }

const sentimentBadge = {
  bull: "bg-green-100 text-green-700",
  bear: "bg-red-100 text-red-700",
  neutral: "bg-gray-100 text-gray-500",
}
const sentimentLabel = { bull: "利多", bear: "利空", neutral: "中性" }

const borderColor = {
  high: "border-l-red-500",
  mid: "border-l-orange-400",
  low: "border-l-gray-300",
}

export function MacroNews({ news }: MacroNewsProps) {
  const [expanded, setExpanded] = useState(false)
  const visibleNews = expanded ? news : news.slice(0, 5)

  return (
    <div className="mb-6">
      <SectionHeader number={2} title="宏觀重點新聞" />
      <div className="text-[10px] text-gray-400 mb-2.5">
        篩選標準：高影響（Fed/GDP/通脹/地緣政治）｜中影響（企業財報/大宗商品）｜低影響（一般市場動態）
        <span className="text-green-500 font-semibold ml-2">● Claude AI 中文分析</span>
      </div>

      <div className="flex flex-col gap-2">
        {visibleNews.map((item, i) => (
          <div
            key={i}
            className={`border border-gray-200 border-l-4 ${borderColor[item.impact]} rounded-r-md p-2.5 bg-white`}
          >
            <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
              <span className={`inline-flex items-center px-1.5 py-px rounded-full text-[10px] font-semibold ${impactBadge[item.impact]}`}>
                {impactLabel[item.impact]}
              </span>
              <span className={`inline-flex items-center px-1.5 py-px rounded-full text-[10px] font-semibold ${sentimentBadge[item.sentiment]}`}>
                {sentimentLabel[item.sentiment]}
              </span>
              <span className="inline-flex items-center px-1.5 py-px rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700">
                {item.region}
              </span>
            </div>
            <div className="text-[11.5px] font-semibold text-gray-800 mb-1 leading-relaxed">
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                {item.titleZh}
              </a>
            </div>
            <div className="text-[11px] text-gray-500 leading-relaxed mb-1 bg-gray-50 rounded px-2 py-1">
              {item.summary}
            </div>
            <div className="text-[10px] text-gray-400 italic mb-0.5">{item.titleEn}</div>
            <div className="text-[10px] text-gray-400">{item.source} · {item.time}</div>
          </div>
        ))}
      </div>

      {news.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 w-full text-center text-xs text-gray-500 hover:text-gray-700 py-1.5 border border-gray-200 rounded print:hidden"
        >
          {expanded ? "收起新聞 ▲" : `查看全部新聞 ▼（共 ${news.length} 則）`}
        </button>
      )}

      {/* Print: show all */}
      {news.length > 5 && !expanded && (
        <div className="hidden print:flex flex-col gap-2 mt-2">
          {news.slice(5).map((item, i) => (
            <div
              key={`print-${i}`}
              className={`border border-gray-200 border-l-4 ${borderColor[item.impact]} rounded-r-md p-2.5 bg-white`}
            >
              <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                <span className={`inline-flex items-center px-1.5 py-px rounded-full text-[10px] font-semibold ${impactBadge[item.impact]}`}>
                  {impactLabel[item.impact]}
                </span>
                <span className={`inline-flex items-center px-1.5 py-px rounded-full text-[10px] font-semibold ${sentimentBadge[item.sentiment]}`}>
                  {sentimentLabel[item.sentiment]}
                </span>
                <span className="inline-flex items-center px-1.5 py-px rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700">
                  {item.region}
                </span>
              </div>
              <div className="text-[11.5px] font-semibold text-gray-800 mb-1">{item.titleZh}</div>
              <div className="text-[11px] text-gray-500 bg-gray-50 rounded px-2 py-1 mb-1">{item.summary}</div>
              <div className="text-[10px] text-gray-400 italic">{item.titleEn}</div>
              <div className="text-[10px] text-gray-400">{item.source} · {item.time}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
