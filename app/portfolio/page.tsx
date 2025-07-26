"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3, Plus, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

const portfolioSummary = {
  totalValue: "485,750.00",
  totalGainLoss: "+12,450.00",
  totalGainLossPercent: "+2.63%",
  dayChange: "+3,250.00",
  dayChangePercent: "+0.67%",
}

const holdings = [
  {
    symbol: "ARAMCO",
    name: "Saudi Aramco",
    shares: 500,
    avgPrice: "30.20",
    currentPrice: "32.45",
    value: "16,225.00",
    gainLoss: "+1,125.00",
    gainLossPercent: "+7.45%",
    trend: "up",
  },
  {
    symbol: "SABIC",
    name: "SABIC",
    shares: 200,
    avgPrice: "85.50",
    currentPrice: "89.20",
    value: "17,840.00",
    gainLoss: "+740.00",
    gainLossPercent: "+4.33%",
    trend: "up",
  },
  {
    symbol: "STC",
    name: "Saudi Telecom",
    shares: 300,
    avgPrice: "44.80",
    currentPrice: "45.60",
    value: "13,680.00",
    gainLoss: "+240.00",
    gainLossPercent: "+1.79%",
    trend: "up",
  },
  {
    symbol: "RAJHI",
    name: "Al Rajhi Bank",
    shares: 150,
    avgPrice: "82.00",
    currentPrice: "78.90",
    value: "11,835.00",
    gainLoss: "-465.00",
    gainLossPercent: "-3.78%",
    trend: "down",
  },
]

const recentTransactions = [
  { type: "BUY", symbol: "ARAMCO", shares: 100, price: "31.50", date: "2024-01-15", total: "3,150.00" },
  { type: "SELL", symbol: "ALMARAI", shares: 50, price: "54.20", date: "2024-01-14", total: "2,710.00" },
  { type: "BUY", symbol: "STC", shares: 75, price: "44.80", date: "2024-01-12", total: "3,360.00" },
]

export default function PortfolioPage() {
  const router = useRouter()
  const [showValues, setShowValues] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
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
              <h1 className="text-xl font-bold text-gray-900">My Portfolio</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowValues(!showValues)}
              className="hover:bg-gray-100 rounded-lg"
            >
              {showValues ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" onClick={() => router.push("/chat")} className="hover:bg-gray-100 rounded-lg">
              Chat
            </Button>
            <Button variant="ghost" onClick={() => router.push("/dashboard")} className="hover:bg-gray-100 rounded-lg">
              Dashboard
            </Button>
            <Button className="bg-teal-500 hover:bg-teal-600 text-white rounded-xl px-4">
              <Plus className="w-4 h-4 mr-2" />
              Add Stock
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Portfolio Summary */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Portfolio Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white shadow-sm border-0 rounded-xl hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Value</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {showValues ? `${portfolioSummary.totalValue} SAR` : "••••••"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border-0 rounded-xl hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Gain/Loss</p>
                  <p className="text-2xl font-bold text-teal-600">
                    {showValues ? `+${portfolioSummary.totalGainLoss} SAR` : "••••••"}
                  </p>
                  <Badge className="bg-teal-100 text-teal-700 mt-2">
                    {showValues ? portfolioSummary.totalGainLossPercent : "••••"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border-0 rounded-xl hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Day Change</p>
                  <p className="text-2xl font-bold text-teal-600">
                    {showValues ? `+${portfolioSummary.dayChange} SAR` : "••••••"}
                  </p>
                  <Badge className="bg-teal-100 text-teal-700 mt-2">
                    {showValues ? portfolioSummary.dayChangePercent : "••••"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border-0 rounded-xl hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Holdings</p>
                  <p className="text-3xl font-bold text-gray-900">{holdings.length}</p>
                  <p className="text-sm text-gray-500 mt-2">Active positions</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Holdings */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-sm border-0 rounded-xl">
              <CardHeader>
                <CardTitle>Holdings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {holdings.map((holding) => (
                    <div
                      key={holding.symbol}
                      className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div>
                            <p className="font-semibold text-gray-900">{holding.symbol}</p>
                            <p className="text-sm text-gray-500">{holding.name}</p>
                            <p className="text-xs text-gray-400">
                              {holding.shares} shares @ {showValues ? `${holding.avgPrice} SAR` : "••••"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{showValues ? `${holding.value} SAR` : "••••••"}</p>
                        <p className="text-sm text-gray-500">{showValues ? `${holding.currentPrice} SAR` : "••••"}</p>
                        <div className="flex items-center justify-end space-x-2 mt-1">
                          {holding.trend === "up" ? (
                            <TrendingUp className="w-3 h-3 text-teal-600" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-red-600" />
                          )}
                          <Badge
                            className={`text-xs ${holding.trend === "up" ? "bg-teal-100 text-teal-700" : "bg-red-100 text-red-700"}`}
                          >
                            {showValues ? holding.gainLossPercent : "••••"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <div>
            <Card className="bg-white shadow-sm border-0 rounded-xl">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((transaction, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-100"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={`text-xs ${transaction.type === "BUY" ? "bg-teal-100 text-teal-700" : "bg-red-100 text-red-700"}`}
                          >
                            {transaction.type}
                          </Badge>
                          <span className="font-medium text-gray-900">{transaction.symbol}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {transaction.shares} shares @ {showValues ? `${transaction.price} SAR` : "••••"}
                        </p>
                        <p className="text-xs text-gray-400">{transaction.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {showValues ? `${transaction.total} SAR` : "••••••"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white shadow-sm border-0 rounded-xl mt-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white rounded-xl">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Position
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl bg-transparent"
                  >
                    View All Transactions
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/chat")}
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl"
                  >
                    Ask StockBot
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
