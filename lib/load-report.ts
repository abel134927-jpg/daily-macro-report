import { ReportData } from "./types"
import { reportData as mockData } from "./report-data"
import fs from "fs"
import path from "path"

/**
 * Load report data from the generated JSON file.
 * Falls back to mock data if the JSON file doesn't exist.
 */
export function loadReportData(): ReportData {
  const jsonPath = path.join(process.cwd(), "public", "data", "report.json")

  try {
    if (fs.existsSync(jsonPath)) {
      const raw = fs.readFileSync(jsonPath, "utf-8")
      const data: ReportData = JSON.parse(raw)
      console.log(`[report] Loaded live data for ${data.date}`)
      return data
    }
  } catch (e) {
    console.error("[report] Failed to load report.json, using mock data:", e)
  }

  console.log("[report] No report.json found, using mock data")
  return mockData
}
