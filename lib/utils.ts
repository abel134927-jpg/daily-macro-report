import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(value: number, decimals = 2): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function formatPrice(value: number): string {
  if (Math.abs(value) >= 1000) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }
  if (Math.abs(value) >= 1) {
    return value.toFixed(2)
  }
  return value.toFixed(4)
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? "+" : ""
  return `${sign}${value.toFixed(2)}%`
}

export function formatChange(value: number, decimals = 2): string {
  const sign = value > 0 ? "+" : ""
  return `${sign}${value.toFixed(decimals)}`
}

export function getChangeColor(value: number): string {
  if (value > 0) return "text-green-500"
  if (value < 0) return "text-red-500"
  return "text-gray-500"
}

export function getChangeBg(value: number): string {
  if (value > 0) return "bg-green-100 text-green-700"
  if (value < 0) return "bg-red-100 text-red-700"
  return "bg-gray-100 text-gray-500"
}

export function getTrendIcon(trend: string): string {
  switch (trend) {
    case "strong_up": return "▲▲"
    case "up": return "▲"
    case "strong_down": return "▼▼"
    case "down": return "▼"
    default: return "—"
  }
}

export function getTrendColor(trend: string): string {
  switch (trend) {
    case "strong_up":
    case "up":
      return "text-green-500"
    case "strong_down":
    case "down":
      return "text-red-500"
    default:
      return "text-gray-400"
  }
}
