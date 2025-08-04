"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3, PieChart, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const marketOverview = {
  tadawul: { value: "12,847.32", change: "+1.2%", trend: "up" },
  volume: { value: "2.4B SAR", change: "+15.3%", trend: "up" },
  trades: { value: "156,789", change: "-2.1%", trend: "down" },
  marketCap: { value: "2.8T SAR", change: "+0.8%", trend: "up" },
}

const topStocks = [
  { symbol: "ARAMCO", name: "Saudi Aramco", price: "32.45", change: "+2.3%", trend: "up", volume: "45.2M" },
  { symbol: "SABIC", name: "SABIC", price: "89.20", change: "+1.8%", trend: "up", volume: "12.8M" },
  { symbol: "STC", name: "Saudi Telecom", price: "45.60", change: "+1.5%", trend: "up", volume: "8.9M" },
  { symbol: "RAJHI", name: "Al Rajhi Bank", price: "78.90", change: "-0.8%", trend: "down", volume: "15.3M" },
  { symbol: "ALMARAI", name: "Almarai", price: "52.30", change: "-1.2%", trend: "down", volume: "6.7M" },
]

const sectorPerformance = [
  { name: "Energy", performance: "+2.4%", trend: "up", weight: "38.2%" },
  { name: "Materials", performance: "+1.8%", trend: "up", weight: "15.7%" },
  { name: "Financials", performance: "-0.5%", trend: "down", weight: "18.9%" },
  { name: "Consumer Discretionary", performance: "+0.9%", trend: "up", weight: "8.4%" },
  { name: "Technology", performance: "+3.2%", trend: "up", weight: "4.1%" },
  { name: "Healthcare", performance: "-1.2%", trend: "down", weight: "6.3%" },
]

export default function DashboardPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-3">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Market Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.push("/chat")} className="hover:bg-gray-100 rounded-lg">
              Chat
            </Button>
            <Button variant="ghost" onClick={() => router.push("/portfolio")} className="hover:bg-gray-100 rounded-lg">
              Portfolio
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Market Open</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Market Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white shadow-sm border-0 rounded-xl hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">TASI Index</p>
                    <p className="text-2xl font-bold text-gray-900">{marketOverview.tadawul.value}</p>
                  </div>
                  <Badge
                    className={`${marketOverview.tadawul.trend === "up" ? "bg-teal-100 text-teal-700" : "bg-red-100 text-red-700"}`}
                  >
                    {marketOverview.tadawul.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border-0 rounded-xl hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Volume</p>
                    <p className="text-2xl font-bold text-gray-900">{marketOverview.volume.value}</p>
                  </div>
                  <Badge
                    className={`${marketOverview.volume.trend === "up" ? "bg-teal-100 text-teal-700" : "bg-red-100 text-red-700"}`}
                  >
                    {marketOverview.volume.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border-0 rounded-xl hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Trades</p>
                    <p className="text-2xl font-bold text-gray-900">{marketOverview.trades.value}</p>
                  </div>
                  <Badge
                    className={`${marketOverview.trades.trend === "up" ? "bg-teal-100 text-teal-700" : "bg-red-100 text-red-700"}`}
                  >
                    {marketOverview.trades.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border-0 rounded-xl hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Market Cap</p>
                    <p className="text-2xl font-bold text-gray-900">{marketOverview.marketCap.value}</p>
                  </div>
                  <Badge
                    className={`${marketOverview.marketCap.trend === "up" ? "bg-teal-100 text-teal-700" : "bg-red-100 text-red-700"}`}
                  >
                    {marketOverview.marketCap.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="bg-white shadow-sm border-0 rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-teal-500" />
                Top Active Stocks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topStocks.map((stock) => (
                  <div
                    key={stock.symbol}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="font-semibold text-gray-900">{stock.symbol}</p>
                          <p className="text-sm text-gray-500">{stock.name}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{stock.price} SAR</p>
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={`text-xs ${stock.trend === "up" ? "bg-teal-100 text-teal-700" : "bg-red-100 text-red-700"}`}
                        >
                          {stock.change}
                        </Badge>
                        <span className="text-xs text-gray-500">{stock.volume}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0 rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-teal-500" />
                Sector Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sectorPerformance.map((sector) => (
                  <div
                    key={sector.name}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{sector.name}</p>
                      <p className="text-sm text-gray-500">Weight: {sector.weight}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {sector.trend === "up" ? (
                        <TrendingUp className="w-4 h-4 text-teal-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                      <Badge
                        className={`${sector.trend === "up" ? "bg-teal-100 text-teal-700" : "bg-red-100 text-red-700"}`}
                      >
                        {sector.performance}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => router.push("/chat")}
              className="bg-teal-500 hover:bg-teal-600 text-white rounded-xl px-6 py-3"
            >
              Ask StockBot
            </Button>
            <Button
              onClick={() => router.push("/portfolio")}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl px-6 py-3"
            >
              View Portfolio
            </Button>
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl px-6 py-3 bg-transparent"
            >
              Set Alerts
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
