"use client"

import { useMemo } from "react"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Bar,
  BarChart,
  Area,
  AreaChart,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, TrendingDown, BarChart3, LineChartIcon, MessageCircle } from "lucide-react"

interface StockData {
  date: string
  open: number
  low: number
  high: number
  close: number
  volume: number
  x: number
  y: number
}

interface CompanyInfo {
  tadawulID: string
  companyID: number
  companyName: string
  sector: string
  acrynomNameAr: string
  argaamID: string
  companyNameAr: string
  sectorAr: string
  acrynomName: string
  price: number
  change: number
  changePercent: number
}

interface ChatResponse {
  data: {
    answer: string
    stocks?: StockData[] | CompanyInfo
    chart: string | null
    data?: StockData[]
  }
  message: string
}

interface DynamicChartProps {
  response: ChatResponse
  symbol?: string
  companyName?: string
  onLoadDetailedChart?: (companyId: number, tadawulId: string) => void
  onAskAboutChart?: (context: any) => void
}

export function DynamicChart({
  response,
  symbol,
  companyName,
  onLoadDetailedChart,
  onAskAboutChart,
}: DynamicChartProps) {
  const { data } = response

  const processedData = useMemo(() => {
    const stocksData = data.stocks || data.data || data || []

    if (stocksData && typeof stocksData === "object" && !Array.isArray(stocksData) && "companyID" in stocksData) {
      return []
    }

    if (!Array.isArray(stocksData)) {
      console.warn("Stock data is not an array:", stocksData)
      return []
    }

    return stocksData.map((item) => ({
      ...item,
      displayDate: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      fullDate: item.date,
      change: item.close - item.open,
      changePercent: ((item.close - item.open) / item.open) * 100,
    }))
  }, [data.stocks, data.data, data])

  const companyInfo = useMemo(() => {
    const stocksData = data.stocks || data.data || data
    if (stocksData && typeof stocksData === "object" && !Array.isArray(stocksData) && "companyID" in stocksData) {
      return stocksData as CompanyInfo
    }
    return null
  }, [data.stocks, data.data, data])

  const handleAskAboutChart = () => {
    if (!onAskAboutChart) return

    let context
    if (data.chart === "search_company_stocks" && companyInfo) {
      context = {
        chart: "search_company_stocks",
        stocks: {
          tadawulID: companyInfo.tadawulID,
          companyID: companyInfo.companyID,
          companyName: companyInfo.companyName,
          sector: companyInfo.sector,
          acrynomName: companyInfo.acrynomName,
          argaamID: companyInfo.argaamID,
          companyNameAr: companyInfo.companyNameAr,
          sectorAr: companyInfo.sectorAr,
          price: companyInfo.price,
          change: companyInfo.change,
          changePercent: companyInfo.changePercent,
        },
      }
    } else if (data.chart === "detailed_company_stock_prices" && processedData.length > 0) {
      context = {
        chart: "detailed_company_stock_prices",
        stocks: processedData.map((item) => ({
          date: item.fullDate,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
          volume: item.volume,
        })),
      }
    } else {
      context = {
        chart: data.chart,
        stocks: data.stocks || data.data || data,
      }
    }

    onAskAboutChart(context)
  }

  if (!data.chart) {
    return null
  }

  if (data.chart === "search_company_stocks" && companyInfo) {
    return (
      <Card className="w-full bg-gradient-to-b from-white to-gray-50 shadow-lg border-0 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-bold text-gray-900">Company Information</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                {companyInfo.acrynomName} • {companyInfo.tadawulID}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{companyInfo.price.toFixed(2)} SAR</p>
              <div className="flex items-center justify-end space-x-2 mt-1">
                {companyInfo.change >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-teal-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <Badge
                  className={`${companyInfo.change >= 0 ? "bg-teal-100 text-teal-700" : "bg-red-100 text-red-700"}`}
                >
                  {companyInfo.change >= 0 ? "+" : ""}
                  {companyInfo.change.toFixed(2)} ({companyInfo.changePercent.toFixed(2)}%)
                </Badge>
              </div>
            </div>
          </div>
          {onAskAboutChart && (
            <div className="flex justify-end mt-2">
              <Button
                onClick={handleAskAboutChart}
                variant="outline"
                size="sm"
                className="text-teal-600 border-teal-200 hover:bg-teal-50 rounded-lg bg-transparent"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Ask about this chart
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Company Name</p>
                <p className="font-semibold text-gray-900">{companyInfo.companyName}</p>
                <p className="text-sm text-gray-600 mt-1">{companyInfo.companyNameAr}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Sector</p>
                <p className="font-semibold text-gray-900">{companyInfo.sector}</p>
                <p className="text-sm text-gray-600 mt-1">{companyInfo.sectorAr}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-sm text-gray-500">Symbol</p>
                <p className="font-semibold text-gray-900">{companyInfo.acrynomName}</p>
                <p className="text-xs text-gray-600">{companyInfo.acrynomNameAr}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Tadawul ID</p>
                <p className="font-semibold text-gray-900">{companyInfo.tadawulID}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Argaam ID</p>
                <p className="font-semibold text-gray-900">{companyInfo.argaamID}</p>
              </div>
            </div>

            {onLoadDetailedChart && (
              <div className="pt-4 border-t">
                <Button
                  onClick={() => onLoadDetailedChart(companyInfo.companyID, companyInfo.tadawulID)}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white rounded-xl py-3 transition-all duration-200 hover:scale-105"
                >
                  <LineChartIcon className="w-4 h-4 mr-2" />
                  Load Detailed Price Chart
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (processedData.length === 0) {
    return (
      <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="text-gray-400 flex flex-col items-center">
          <BarChart3 className="w-12 h-12 mb-2" />
          <span className="text-sm">No chart data available</span>
        </div>
      </div>
    )
  }

  const latestData = processedData[processedData.length - 1] || {}
  const previousData = processedData[processedData.length - 2] || {}
  const overallChange = latestData.close - previousData.close
  const overallChangePercent = (overallChange / previousData.close) * 100 || 0

  const renderChart = () => {
    switch (data.chart) {
      case "detailed_company_stock_prices":
        return (
          <ChartContainer
            config={{
              close: {
                label: "Close Price",
                color: "hsl(var(--chart-1))",
              },
              volume: {
                label: "Volume",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[450px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={processedData} margin={{ top: 20, right: 40, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                <XAxis
                  dataKey="displayDate"
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                  domain={["dataMin - 0.1", "dataMax + 0.1"]}
                  tickFormatter={(value) => `${value.toFixed(2)}`}
                  width={60}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  labelFormatter={(value, payload) => {
                    const data = payload?.[0]?.payload
                    return data
                      ? new Date(data.fullDate).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : value
                  }}
                  formatter={(value, name) => [
                    `${Number(value).toFixed(2)} SAR`,
                    name === "close" ? "Close Price" : name,
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="close"
                  stroke="var(--color-close)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-close)", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "var(--color-close)", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        )

      case "stock_volume_analysis":
        return (
          <ChartContainer
            config={{
              volume: {
                label: "Volume",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[450px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processedData} margin={{ top: 20, right: 40, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                <XAxis
                  dataKey="displayDate"
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                  width={60}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value) => [`${Number(value).toLocaleString()}`, "Volume"]}
                />
                <Bar dataKey="volume" fill="var(--color-volume)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )

      case "price_range_analysis":
        return (
          <ChartContainer
            config={{
              high: {
                label: "High",
                color: "hsl(var(--chart-1))",
              },
              low: {
                label: "Low",
                color: "hsl(var(--chart-3))",
              },
              close: {
                label: "Close",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[450px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={processedData} margin={{ top: 20, right: 40, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                <XAxis
                  dataKey="displayDate"
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                  domain={["dataMin - 0.1", "dataMax + 0.1"]}
                  width={60}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="high"
                  stackId="1"
                  stroke="var(--color-high)"
                  fill="var(--color-high)"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="low"
                  stackId="1"
                  stroke="var(--color-low)"
                  fill="var(--color-low)"
                  fillOpacity={0.3}
                />
                <Line type="monotone" dataKey="close" stroke="var(--color-close)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        )

      default:
        return (
          <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-gray-400 flex flex-col items-center">
              <BarChart3 className="w-12 h-12 mb-2" />
              <span className="text-sm">Chart type not supported</span>
            </div>
          </div>
        )
    }
  }

  const getChartTitle = () => {
    switch (data.chart) {
      case "detailed_company_stock_prices":
        return `${companyName || symbol || "Stock"} Price History`
      case "stock_volume_analysis":
        return `${companyName || symbol || "Stock"} Volume Analysis`
      case "price_range_analysis":
        return `${companyName || symbol || "Stock"} Price Range Analysis`
      default:
        return "Stock Analysis"
    }
  }

  return (
    <Card className="w-full bg-gradient-to-b from-white to-gray-50 shadow-lg border-0 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-xl">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold text-gray-900">{getChartTitle()}</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              {symbol && `${symbol} • `}
              Last updated: {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{latestData.close?.toFixed(2)} SAR</p>
            <div className="flex items-center justify-end space-x-2 mt-1">
              {overallChange >= 0 ? (
                <TrendingUp className="w-4 h-4 text-teal-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <Badge className={`${overallChange >= 0 ? "bg-teal-100 text-teal-700" : "bg-red-100 text-red-700"}`}>
                {overallChange >= 0 ? "+" : ""}
                {overallChange.toFixed(2)} ({overallChangePercent.toFixed(2)}%)
              </Badge>
            </div>
          </div>
        </div>
        {onAskAboutChart && (
          <div className="flex justify-end mt-2">
            <Button
              onClick={handleAskAboutChart}
              variant="outline"
              size="sm"
              className="text-teal-600 border-teal-200 hover:bg-teal-50 rounded-lg bg-transparent"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Ask about this chart
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {renderChart()}

        <div className="flex justify-between items-center text-sm border-t pt-4 mt-4">
          <div className="text-center">
            <p className="text-gray-500">Open</p>
            <p className="font-semibold">{latestData.open?.toFixed(2)} SAR</p>
          </div>
          <div className="w-px h-8 bg-gray-200"></div>
          <div className="text-center">
            <p className="text-gray-500">High</p>
            <p className="font-semibold">{Math.max(...processedData.map((d) => d.high)).toFixed(2)} SAR</p>
          </div>
          <div className="w-px h-8 bg-gray-200"></div>
          <div className="text-center">
            <p className="text-gray-500">Low</p>
            <p className="font-semibold">{Math.min(...processedData.map((d) => d.low)).toFixed(2)} SAR</p>
          </div>
          <div className="w-px h-8 bg-gray-200"></div>
          <div className="text-center">
            <p className="text-gray-500">Volume</p>
            <p className="font-semibold">{(latestData.volume / 1000000).toFixed(1)}M</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
