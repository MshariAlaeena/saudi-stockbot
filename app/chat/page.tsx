"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Send,
  TrendingUp,
  TrendingDown,
  Bell,
  Menu,
  X,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Building,
  Car,
  Smartphone,
  Pill,
  Home,
  DollarSign,
  ArrowLeft,
  Loader2,
  RefreshCw,
  Paperclip,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DynamicChart } from "@/components/dynamic-chart"
import { apiClient } from "@/lib/api-config"

interface ChatMessage {
  id: number
  role: "user" | "assistant"
  content: string
  timestamp: string
  hasChart?: boolean
  chartData?: any
  isLoading?: boolean
}

interface ChatApiRequest {
  messages: Array<{
    role: "user" | "assistant"
    content: string
  }>
  context?: any
}

interface ChatResponse {
  data: {
    answer: string
    stocks?: Array<{
      date: string
      open: number
      close: number
      high: number
      low: number
      volume: number
      x: number
      y: number
    }>
    chart: string | null
  }
  message: string
}

interface DashboardStock {
  companyID: number
  argaamID: string
  companyName: string
  companyNameAr: string
  acrynomNameAr: string
  sector: string
  sectorAr: string
  percentageGained: number
  price: number
}

interface StockChartData {
  date: string
  open: number
  close: number
  high: number
  low: number
  volume: number
  x: number
  y: number
}

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    role: "assistant",
    content: "Welcome to Saudi StockBot! How can I help you with the Saudi stock market today?",
    timestamp: "10:30 AM",
  },
]

const sectorData = [
  { name: "Energy", icon: Zap, change: "+2.4%", trend: "up", color: "teal" },
  { name: "Materials", icon: Building, change: "+1.8%", trend: "up", color: "teal" },
  { name: "Financials", icon: DollarSign, change: "-0.5%", trend: "down", color: "coral" },
  { name: "Consumer", icon: Car, change: "+0.9%", trend: "up", color: "teal" },
  { name: "Technology", icon: Smartphone, change: "+3.2%", trend: "up", color: "teal" },
  { name: "Healthcare", icon: Pill, change: "-1.2%", trend: "down", color: "coral" },
]

const watchList = [
  { symbol: "ARAMCO", price: "32.45", change: "+2.3%", trend: "up" },
  { symbol: "SABIC", price: "89.20", change: "+1.8%", trend: "up" },
  { symbol: "STC", price: "45.60", change: "+1.5%", trend: "up" },
  { symbol: "RAJHI", price: "78.90", change: "-0.8%", trend: "down" },
]

export default function ChatPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [isMarketOpen, setIsMarketOpen] = useState(true)
  const [showChart, setShowChart] = useState(false)
  const [currentChartData, setCurrentChartData] = useState<any>(null)
  const [currentSymbol, setCurrentSymbol] = useState<string>("")
  const [currentCompanyName, setCurrentCompanyName] = useState<string>("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [dashboardData, setDashboardData] = useState<DashboardStock[]>([])
  const [isDashboardLoading, setIsDashboardLoading] = useState(false)
  const [chartContext, setChartContext] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    loadDashboardData()
  }, [])

  useEffect(() => {
    if (inputRef.current && !isLoading) {
      inputRef.current.focus()
    }
  }, [messages, chartContext, isLoading])

  useEffect(() => {
    const handleGlobalKeyPress = (e: KeyboardEvent) => {
      if (e.key === "/" && e.target !== inputRef.current) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    document.addEventListener("keydown", handleGlobalKeyPress)
    return () => document.removeEventListener("keydown", handleGlobalKeyPress)
  }, [])

  const loadDashboardData = async () => {
    setIsDashboardLoading(true)
    try {
      const response = await apiClient.get<{ data: DashboardStock[]; message: string }>("DASHBOARD")
      setDashboardData(response.data || [])
    } catch (error) {
      console.error("Error loading dashboard data:", error)
      setDashboardData([])
    } finally {
      setIsDashboardLoading(false)
    }
  }

  const handleStockClick = async (stock: DashboardStock) => {
    try {
      setIsLoading(true)
      const response = await apiClient.get<any>("DASHBOARD_CHART", { companyId: stock.companyID })

      let chartData = response
      if (response.data) {
        chartData = response.data
      }

      if (!Array.isArray(chartData)) {
        console.error("Chart data is not an array:", chartData)
        throw new Error("Invalid chart data format")
      }

      const transformedResponse = {
        data: {
          answer: `Here's the price history for ${stock.companyName} (${stock.acrynomNameAr}). Current price: ${stock.price} SAR with ${stock.percentageGained >= 0 ? "+" : ""}${stock.percentageGained.toFixed(2)}% change.`,
          stocks: chartData,
          chart: "detailed_company_stock_prices",
        },
        message: "Chart data loaded successfully",
      }

      setCurrentChartData(transformedResponse)
      setCurrentSymbol(stock.acrynomNameAr)
      setCurrentCompanyName(stock.companyName)
      setShowChart(true)

      const chartMessage: ChatMessage = {
        id: Date.now(),
        role: "assistant",
        content: transformedResponse.data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        hasChart: true,
        chartData: transformedResponse,
      }
      setMessages((prev) => [...prev, chartMessage])
    } catch (error) {
      console.error("Error loading stock chart:", error)
      const errorMessage: ChatMessage = {
        id: Date.now(),
        role: "assistant",
        content: `Sorry, I couldn't load the chart data for ${stock.companyName}. Please try again later.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoadDetailedChart = async (companyId: number, tadawulId: string) => {
    try {
      setIsLoading(true)
      const response = await apiClient.get<any>("DASHBOARD_CHART", { tadawulId })

      let chartData = response
      if (response.data) {
        chartData = response.data
      }

      if (!Array.isArray(chartData)) {
        console.error("Chart data is not an array:", chartData)
        throw new Error("Invalid chart data format")
      }

      const transformedResponse = {
        data: {
          answer: `Here's the detailed price history for the selected company.`,
          stocks: chartData,
          chart: "detailed_company_stock_prices",
        },
        message: "Detailed chart data loaded successfully",
      }

      setCurrentChartData(transformedResponse)
      setShowChart(true)

      const chartMessage: ChatMessage = {
        id: Date.now(),
        role: "assistant",
        content: transformedResponse.data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        hasChart: true,
        chartData: transformedResponse,
      }
      setMessages((prev) => [...prev, chartMessage])
    } catch (error) {
      console.error("Error loading detailed chart:", error)
      const errorMessage: ChatMessage = {
        id: Date.now(),
        role: "assistant",
        content: `Sorry, I couldn't load the detailed chart data. Please try again later.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleAskAboutChart = (context: any) => {
    setChartContext(context)
    setShowChart(false)

    const assistantMessage: ChatMessage = {
      id: Date.now(),
      role: "assistant",
      content: "What would you like to know about this chart?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages((prev) => [...prev, assistantMessage])
  }

  const handleCancelChartAttachment = () => {
    setChartContext(null)
  }

  const sendChatMessage = async (conversationHistory: ChatMessage[]): Promise<ChatResponse> => {
    try {
      const apiMessages = conversationHistory
        .filter((msg) => !msg.isLoading)
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }))

      const requestData: ChatApiRequest = {
        messages: apiMessages,
        context: chartContext,
      }

      const response = await apiClient.post<ChatResponse>("CHAT", requestData)

      setChartContext(null)

      return response
    } catch (error) {
      console.error("Error sending chat message:", error)

      return {
        data: {
          answer: "I'm sorry, I'm having trouble connecting to the server right now. Please try again later.",
          chart: null,
        },
        message: "Error occurred",
      }
    }
  }

  const extractSymbolFromMessage = (message: string): { symbol: string; companyName: string } => {
    const symbolMap: Record<string, string> = {
      aramco: "ARAMCO",
      "2222": "ARAMCO",
      sabic: "SABIC",
      "2010": "SABIC",
      stc: "STC",
      "7010": "STC",
      rajhi: "RAJHI",
      "1120": "RAJHI",
      almarai: "ALMARAI",
      "2280": "ALMARAI",
    }

    const companyNames: Record<string, string> = {
      ARAMCO: "Saudi Aramco",
      SABIC: "Saudi Basic Industries Corp",
      STC: "Saudi Telecom Company",
      RAJHI: "Al Rajhi Bank",
      ALMARAI: "Almarai Company",
    }

    const lowerMessage = message.toLowerCase()
    for (const [key, symbol] of Object.entries(symbolMap)) {
      if (lowerMessage.includes(key)) {
        return { symbol, companyName: companyNames[symbol] || symbol }
      }
    }

    return { symbol: "", companyName: "" }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
    }

    const loadingMessage: ChatMessage = {
      id: Date.now() + 1,
      role: "assistant",
      content: "Analyzing your request...",
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
      isLoading: true,
    }

    const updatedMessages = [...messages, userMessage, loadingMessage]
    setMessages(updatedMessages)
    setIsLoading(true)
    const currentInput = inputValue
    setInputValue("")

    try {
      const { symbol, companyName } = extractSymbolFromMessage(currentInput)

      const response = await sendChatMessage(updatedMessages)

      setMessages((prev) => {
        const withoutLoading = prev.filter((msg) => !msg.isLoading)
        const botResponse: ChatMessage = {
          id: Date.now() + 2,
          role: "assistant",
          content: response.data.answer,
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
          hasChart: !!response.data.chart,
          chartData: response,
        }
        return [...withoutLoading, botResponse]
      })

      if (response.data.chart && response.data.stocks) {
        setCurrentChartData(response)
        setCurrentSymbol(symbol)
        setCurrentCompanyName(companyName)
        setShowChart(true)
      }
    } catch (error) {
      console.error("Error in handleSendMessage:", error)
      setMessages((prev) => {
        const withoutLoading = prev.filter((msg) => !msg.isLoading)
        const errorMessage: ChatMessage = {
          id: Date.now() + 3,
          role: "assistant",
          content: "I'm sorry, I encountered an error while processing your request. Please try again.",
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
        }
        return [...withoutLoading, errorMessage]
      })
    } finally {
      setIsLoading(false)
    }
  }

  const clearConversation = () => {
    setMessages(initialMessages)
    setShowChart(false)
    setCurrentChartData(null)
    setChartContext(null)
  }

  const gainers = Array.isArray(dashboardData)
    ? dashboardData.filter((stock) => stock.percentageGained > 0).slice(0, 5)
    : []
  const losers = Array.isArray(dashboardData)
    ? dashboardData.filter((stock) => stock.percentageGained < 0).slice(0, 5)
    : []
  const topMovers = [...gainers.slice(0, 3), ...losers.slice(0, 2)]

  const getChartAttachmentInfo = () => {
    if (!chartContext) return null

    if (chartContext.chart === "search_company_stocks") {
      return {
        type: "Company Info",
        title: chartContext.stocks?.companyName || "Company Data",
        subtitle: `${chartContext.stocks?.acrynomName || ""} • ${chartContext.stocks?.sector || ""}`,
      }
    } else if (chartContext.chart === "detailed_company_stock_prices") {
      const dataPoints = Array.isArray(chartContext.stocks) ? chartContext.stocks.length : 0
      return {
        type: "Price History",
        title: "Stock Price Data",
        subtitle: `${dataPoints} data points`,
      }
    }

    return {
      type: "Chart Data",
      title: "Chart Information",
      subtitle: "Attached to your message",
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-3">
        <div className="flex justify-between items-center w-full px-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <MobileSidebar />
              </SheetContent>
            </Sheet>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Saudi StockBot</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={clearConversation}
              className="hidden md:flex hover:bg-gray-100 rounded-lg text-sm"
            >
              Clear Chat
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard")}
              className="hidden md:flex hover:bg-gray-100 rounded-lg"
            >
              Dashboard
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push("/portfolio")}
              className="hidden md:flex hover:bg-gray-100 rounded-lg"
            >
              Portfolio
            </Button>
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${isMarketOpen ? "bg-teal-400 animate-pulse" : "bg-gray-400"}`}
              ></div>
              <span className="text-sm text-gray-600">Market {isMarketOpen ? "Open" : "Closed"}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex w-full h-[calc(100vh-73px)]">
        <aside className="hidden md:block w-80 border-r border-gray-200 bg-white flex-shrink-0">
          <div className="h-full overflow-y-auto p-6">
            <DesktopSidebar />
          </div>
        </aside>

        <main className="flex-1 flex h-full min-w-0 relative">
          <div className="flex flex-col h-full bg-gray-50 w-full">
            <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
              <div className="max-w-4xl mx-auto space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-2xl px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                        message.role === "user" ? "bg-gray-100 text-gray-900 ml-auto" : "bg-teal-50 text-gray-900"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.isLoading && (
                          <Loader2 className="w-4 h-4 animate-spin text-teal-600 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <p className="text-xs text-gray-500 mt-2">{isMounted ? message.timestamp : ""}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div ref={messagesEndRef} />
            </div>

            <div className="flex-shrink-0 bg-white border-t border-gray-200">
              {chartContext && (
                <div className="px-6 py-3 border-b border-gray-100 bg-teal-50">
                  <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm border border-teal-200">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-teal-100 rounded-lg">
                          <Paperclip className="w-4 h-4 text-teal-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">{getChartAttachmentInfo()?.title}</span>
                            <Badge className="bg-teal-100 text-teal-700 text-xs">
                              {getChartAttachmentInfo()?.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{getChartAttachmentInfo()?.subtitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1 text-xs text-teal-600">
                          <AlertCircle className="w-3 h-3" />
                          <span>Chart attached</span>
                        </div>
                        <Button
                          onClick={handleCancelChartAttachment}
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-red-100 text-gray-400 hover:text-red-600 rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-6">
                <div className="flex space-x-3 max-w-4xl mx-auto">
                  <div className="flex-1 relative">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={
                        chartContext
                          ? "Ask about the attached chart..."
                          : "Ask about Saudi stocks... (e.g., 'Show me ARAMCO stock prices')"
                      }
                      className={`border-gray-200 focus:border-teal-300 focus:ring-teal-200 rounded-xl h-12 text-base pr-10 ${
                        chartContext ? "border-teal-300 bg-teal-50/30" : ""
                      }`}
                      onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
                      disabled={isLoading}
                    />
                    {chartContext && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Paperclip className="w-4 h-4 text-teal-500" />
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputValue.trim()}
                    className={`rounded-xl px-6 h-12 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                      chartContext
                        ? "bg-teal-600 hover:bg-teal-700 text-white shadow-lg"
                        : "bg-teal-500 hover:bg-teal-600 text-white"
                    }`}
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {showChart && (
            <div
              className={`absolute top-0 right-0 h-full w-[600px] bg-white border-l border-gray-200 transform transition-all duration-500 ease-in-out z-10 ${
                showChart ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
              }`}
              style={{
                willChange: "transform, opacity",
                backfaceVisibility: "hidden",
              }}
            >
              <div className="h-full overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Live Analysis</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowChart(false)}
                    className="hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                {currentChartData && (
                  <div
                    className={`transition-all duration-300 delay-200 ${
                      showChart ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                  >
                    <DynamicChart
                      response={currentChartData}
                      symbol={currentSymbol}
                      companyName={currentCompanyName}
                      onLoadDetailedChart={handleLoadDetailedChart}
                      onAskAboutChart={handleAskAboutChart}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {showChart && (
            <div
              className={`absolute inset-0 bg-black transition-opacity duration-500 ease-in-out z-5 ${
                showChart ? "bg-opacity-20" : "bg-opacity-0"
              }`}
              onClick={() => setShowChart(false)}
            />
          )}
        </main>
      </div>
    </div>
  )

  function DesktopSidebar() {
    const [expandedSection, setExpandedSection] = useState<string | null>("overview")

    return (
      <div className="space-y-4">
        <Card className="bg-gradient-to-r from-teal-50 to-teal-100 border-teal-200 rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-teal-800">TASI Index</p>
                <p className="text-2xl font-bold text-teal-900">12,847.32</p>
              </div>
              <Badge className="bg-teal-200 text-teal-800">+1.2%</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-0 rounded-xl">
          <CardHeader
            className="cursor-pointer hover:bg-gray-50 transition-colors rounded-t-xl"
            onClick={() => setExpandedSection(expandedSection === "overview" ? null : "overview")}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <PieChart className="w-4 h-4 mr-2 text-teal-500" />
                Sectors
              </h3>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                {expandedSection === "overview" ? "−" : "+"}
              </Button>
            </div>
          </CardHeader>
          {expandedSection === "overview" && (
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 gap-2">
                {sectorData.slice(0, 4).map((sector) => (
                  <div
                    key={sector.name}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <sector.icon className="w-3 h-3 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900">{sector.name}</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        sector.trend === "up" ? "bg-teal-100 text-teal-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {sector.change}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>

        <Card className="bg-white shadow-sm border-0 rounded-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Activity className="w-4 h-4 mr-2 text-teal-500" />
                Top Movers
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={loadDashboardData}
                disabled={isDashboardLoading}
                className="h-6 w-6 hover:bg-gray-100 rounded-lg"
              >
                <RefreshCw className={`w-3 h-3 ${isDashboardLoading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {isDashboardLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                <span className="ml-2 text-sm text-gray-500">Loading...</span>
              </div>
            ) : (
              <div className="space-y-2">
                {topMovers.map((stock) => (
                  <div
                    key={stock.companyID}
                    onClick={() => handleStockClick(stock)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      {stock.percentageGained >= 0 ? (
                        <TrendingUp className="w-3 h-3 text-teal-600" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-600" />
                      )}
                      <div>
                        <span className="text-sm font-medium text-gray-900 block">{stock.acrynomNameAr}</span>
                        <span className="text-xs text-gray-500">{stock.price} SAR</span>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        stock.percentageGained >= 0 ? "bg-teal-100 text-teal-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {stock.percentageGained >= 0 ? "+" : ""}
                      {stock.percentageGained.toFixed(2)}%
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-0 rounded-xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Home className="w-4 h-4 mr-2 text-teal-500" />
                Watchlist
              </h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-gray-100 rounded-lg">
                    <Bell className="w-3 h-3" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Set Price Alert</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="symbol" className="block text-sm font-medium text-gray-700">
                        Stock Symbol
                      </label>
                      <Input id="symbol" placeholder="e.g., ARAMCO" className="mt-1" />
                    </div>
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        Alert Price (SAR)
                      </label>
                      <Input id="price" type="number" placeholder="e.g., 35.00" className="mt-1" />
                    </div>
                    <Button className="w-full bg-teal-500 hover:bg-teal-600">Set Alert</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {watchList.slice(0, 3).map((stock) => (
                <div
                  key={stock.symbol}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{stock.symbol}</p>
                    <p className="text-xs text-gray-500">{stock.price} SAR</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      stock.trend === "up" ? "bg-teal-100 text-teal-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {stock.change}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-0 rounded-xl">
          <CardContent className="p-4">
            <div className="space-y-2">
              <Button
                onClick={() => router.push("/dashboard")}
                variant="outline"
                className="w-full justify-start text-sm h-8"
              >
                <BarChart3 className="w-3 h-3 mr-2" />
                Dashboard
              </Button>
              <Button
                onClick={() => router.push("/portfolio")}
                variant="outline"
                className="w-full justify-start text-sm h-8"
              >
                <PieChart className="w-3 h-3 mr-2" />
                Portfolio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  function MobileSidebar() {
    return (
      <div className="space-y-6 pt-6">
        <DesktopSidebar />
      </div>
    )
  }
}
