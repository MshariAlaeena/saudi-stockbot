"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, BarChart3, Brain, Shield, Zap, Star, Play, TrendingUp, TrendingDown, Activity, Sparkles } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

const SARSymbol = ({ className = "w-4 h-4", color = "currentColor" }: { className?: string; color?: string }) => (
  <svg className={className} viewBox="0 0 1124.14 1256.39" fill={color}>
    <path d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"/>
    <path d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"/>
  </svg>
)

export default function LandingPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [currentPrice, setCurrentPrice] = useState(32.45)
  const [priceChange, setPriceChange] = useState(0)
  const [animatedStats, setAnimatedStats] = useState([0, 0, 0, 0])

  useEffect(() => {
    setIsVisible(true)
    
    const priceInterval = setInterval(() => {
      const change = (Math.random() - 0.5) * 0.5
      setCurrentPrice(prev => Math.max(30, prev + change))
      setPriceChange(change)
    }, 2000)

    const statsTargets = [10000, 500, 99.9, 24]
    const statsInterval = setInterval(() => {
      setAnimatedStats(prev => prev.map((current, index) => {
        const target = statsTargets[index]
        const increment = target / 100
        return current < target ? Math.min(target, current + increment) : target
      }))
    }, 50)

    return () => {
      clearInterval(priceInterval)
      clearInterval(statsInterval)
    }
  }, [])

  const handleGetStarted = () => {
    router.push("/chat")
  }

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms analyze Saudi market trends and provide intelligent insights.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: BarChart3,
      title: "Real-Time Data",
      description: "Live market data from Tadawul with instant updates on stock prices and market movements.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Bank-grade security with encrypted data transmission and secure authentication protocols.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get instant responses to your queries with our optimized AI processing infrastructure.",
      gradient: "from-yellow-500 to-orange-500"
    },
  ]

  const mockStocks = [
    { symbol: "ARAMCO", price: currentPrice.toFixed(2), change: priceChange >= 0 ? `+${priceChange.toFixed(2)}%` : `${priceChange.toFixed(2)}%`, trend: priceChange >= 0 ? "up" : "down" },
    { symbol: "SABIC", price: "89.20", change: "+1.8%", trend: "up" },
    { symbol: "STC", price: "45.60", change: "+1.5%", trend: "up" },
    { symbol: "RAJHI", price: "78.90", change: "-0.8%", trend: "down" },
  ]

  const testimonials = [
    {
      name: "Ahmed",
      role: "Portfolio Manager",
      content: "Saudi StockBot has revolutionized how I analyze the market. The AI insights are incredibly accurate.",
      rating: 5,
      avatar: "👨‍💼"
    },
    {
      name: "Fatima",
      role: "Day Trader",
      content: "The real-time alerts and analysis have helped me make better trading decisions consistently.",
      rating: 5,
      avatar: "👩‍💻"
    },
    {
      name: "Turki",
      role: "Investment Advisor",
      content: "An essential tool for anyone serious about Saudi stock market investing. Highly recommended.",
      rating: 5,
      avatar: "👨‍🎓"
    },
  ]

  const formatStat = (value: number, index: number) => {
    switch(index) {
      case 0: return `${Math.floor(value / 1000)}K+`
      case 1: return `${Math.floor(value)}+`
      case 2: return `${value.toFixed(1)}%`
      case 3: return `${Math.floor(value)}/7`
      default: return value.toString()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-sans overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-teal-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-teal-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            <div className="w-2 h-2 bg-teal-400/30 rounded-full"></div>
          </div>
        ))}
      </div>

      <nav className="sticky top-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Saudi StockBot</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-teal-400 transition-colors">
                Features
              </a>
              <a href="#testimonials" className="text-gray-300 hover:text-teal-400 transition-colors">
                Testimonials
              </a>
              <a href="#pricing" className="text-gray-300 hover:text-teal-400 transition-colors">
                Pricing
              </a>
              <Button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl px-6 transition-all duration-200 hover:scale-105 shadow-lg"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div
              className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
            >
              <Badge className="mb-6 bg-gradient-to-r from-teal-500/20 to-purple-500/20 text-teal-300 border-teal-400/30 px-4 py-2 rounded-full backdrop-blur-sm">
                <Sparkles className="w-4 h-4 mr-2" />
                🚀 Now supporting all Tadawul stocks
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Your AI-Powered
                <br />
                <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                  Saudi Stock
                </span>
                <br />
                <span className="text-gray-300">Assistant</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
                Get intelligent insights, real-time analysis, and personalized recommendations for the Saudi stock market.
                Make smarter investment decisions with AI that understands Tadawul.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button
                  onClick={handleGetStarted}
                  size="lg"
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-xl px-8 py-4 text-lg transition-all duration-200 hover:scale-105 shadow-xl hover:shadow-2xl"
                >
                  Start Trading Smarter
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-gray-400/30 text-gray-300 hover:bg-white/10 rounded-xl px-8 py-4 text-lg transition-all duration-200 hover:scale-105 bg-transparent backdrop-blur-sm"
                >
                  <Play className="mr-2 w-5 h-5" />
                  Watch Demo
                </Button>
              </div>
            </div>

            <div
              className={`transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
            >
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-teal-400" />
                      Live Market Data
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-300">Live</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {mockStocks.map((stock, index) => (
                      <div
                        key={stock.symbol}
                        className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center space-x-3">
                          {stock.trend === "up" ? (
                            <TrendingUp className="w-4 h-4 text-teal-400" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-400" />
                          )}
                          <div>
                            <p className="font-medium text-white">{stock.symbol}</p>
                            <p className="text-sm text-gray-400 flex items-center">
                              <SARSymbol className="w-3 h-3 mr-1" color="#9CA3AF" />
                              {stock.price}
                            </p>
                          </div>
                        </div>
                        <Badge
                          className={`${
                            stock.trend === "up" 
                              ? "bg-teal-500/20 text-teal-300 border-teal-400/30" 
                              : "bg-red-500/20 text-red-300 border-red-400/30"
                          }`}
                        >
                          {stock.change}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <div className="h-24 bg-gradient-to-r from-teal-500/10 to-purple-500/10 rounded-lg p-4 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-end justify-between px-4 pb-4">
                      {[...Array(12)].map((_, i) => (
                        <div
                          key={i}
                          className="w-2 bg-gradient-to-t from-teal-400 to-cyan-400 rounded-full animate-pulse"
                          style={{
                            height: `${20 + Math.random() * 40}px`,
                            animationDelay: `${i * 100}ms`
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="absolute -top-4 -left-4 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg p-3 shadow-xl">
                  <div className="flex items-center space-x-2">
                    <SARSymbol className="w-4 h-4" color="white" />
                    <span className="text-white font-semibold text-sm">+2.4% Today</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white/5 backdrop-blur-sm border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Users", index: 0 },
              { label: "Stocks Tracked", index: 1 },
              { label: "Uptime", index: 2 },
              { label: "Support", index: 3 }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  {formatStat(animatedStats[stat.index], stat.index)}
                </div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to make informed decisions in the Saudi stock market
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-xl group"
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-gray-300">Simple, powerful, and intelligent</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: "1", title: "Ask Questions", description: "Simply type your questions about Saudi stocks, market trends, or specific companies in natural language.", icon: "💬" },
              { step: "2", title: "AI Analysis", description: "Our AI processes real-time market data and provides intelligent insights tailored to your queries.", icon: "🤖" },
              { step: "3", title: "Make Decisions", description: "Get actionable recommendations and visual charts to make informed investment decisions.", icon: "📊" }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200 shadow-xl">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-gray-300 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-300">Trusted by thousands of investors across Saudi Arabia</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-xl hover:scale-105 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{testimonial.avatar}</div>
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-400">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-teal-500/20 to-purple-500/20 backdrop-blur-sm border-y border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Trading?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of investors who are already using Saudi StockBot to make smarter decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex max-w-md w-full">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-l-xl border-0 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 border-white/20"
              />
              <Button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-r-xl px-6 border-0 font-semibold shadow-lg"
              >
                Get Started
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-4">Free to start • No credit card required</p>
        </div>
      </section>

      <footer className="bg-black/20 backdrop-blur-sm text-white py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Saudi StockBot</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                AI-powered stock analysis for the Saudi market. Make smarter investment decisions with intelligent
                insights.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-teal-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">API</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-teal-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-teal-400 transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Saudi StockBot. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  )
}
