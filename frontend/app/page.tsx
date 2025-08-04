"use client"
import { Bell, PieChart, Activity, Zap, Building, Car, Smartphone, Pill, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import LandingPage from "@/components/landing-page"

// Mock data
const mockMessages = [
  {
    id: 1,
    type: "bot",
    content: "Welcome to Saudi StockBot! How can I help you with the Saudi stock market today?",
    timestamp: "10:30 AM",
  },
  { id: 2, type: "user", content: "Show me ARAMCO stock performance", timestamp: "10:31 AM" },
  {
    id: 3,
    type: "bot",
    content:
      "Here's the latest ARAMCO (2222.SR) performance. The stock is currently trading at 32.45 SAR, up 2.3% today.",
    timestamp: "10:31 AM",
    hasChart: true,
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

const gainersLosers = [
  { symbol: "ARAMCO", change: "+2.3%", trend: "up" },
  { symbol: "SABIC", change: "+1.8%", trend: "up" },
  { symbol: "STC", change: "+1.5%", trend: "up" },
  { symbol: "RAJHI", change: "-0.8%", trend: "down" },
  { symbol: "ALMARAI", change: "-1.2%", trend: "down" },
]

const watchList = [
  { symbol: "ARAMCO", price: "32.45", change: "+2.3%", trend: "up" },
  { symbol: "SABIC", price: "89.20", change: "+1.8%", trend: "up" },
  { symbol: "STC", price: "45.60", change: "+1.5%", trend: "up" },
  { symbol: "RAJHI", price: "78.90", change: "-0.8%", trend: "down" },
]

export default function MainHome() {
  return <LandingPage />
}

function DesktopSidebar() {
  return (
    <div className="space-y-6">
      {/* Sector Dashboard */}
      <Card className="bg-white shadow-sm border-0 rounded-xl">
        <CardHeader>
          <h3 className="font-semibold text-gray-900 flex items-center">
            <PieChart className="w-4 h-4 mr-2 text-teal-500" />
            Sector Overview
          </h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">{/* Sector data rendering logic here */}</div>
        </CardContent>
      </Card>

      {/* Gainers/Losers */}
      <Card className="bg-white shadow-sm border-0 rounded-xl">
        <CardHeader>
          <h3 className="font-semibold text-gray-900 flex items-center">
            <Activity className="w-4 h-4 mr-2 text-teal-500" />
            Top Movers
          </h3>
        </CardHeader>
        <CardContent>
          <div className="flex overflow-x-auto space-x-2 pb-2">{/* Gainers/Losers rendering logic here */}</div>
        </CardContent>
      </Card>

      {/* Watch List */}
      <Card className="bg-white shadow-sm border-0 rounded-xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Building className="w-4 h-4 mr-2 text-teal-500" />
              Watch List
            </h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-gray-100 rounded-lg">
                  <Bell className="w-4 h-4" />
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
        <CardContent>
          <div className="space-y-3">{/* Watch list rendering logic here */}</div>
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

function MiniSparkline({ trend }: { trend: "up" | "down" }) {
  return (
    <div className="w-12 h-6 flex items-end space-x-0.5">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className={`w-1 rounded-sm transition-all duration-200 ${trend === "up" ? "bg-teal-300" : "bg-red-300"}`}
          style={{ height: `${Math.random() * 20 + 4}px` }}
        />
      ))}
    </div>
  )
}
