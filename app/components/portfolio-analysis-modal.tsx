"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  TrendingUp, BarChart3, Target, AlertTriangle, Shield, 
  PieChart, Activity, Award, DollarSign, TrendingDown,
  Info, CheckCircle, AlertCircle, XCircle
} from "lucide-react"
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Cell, BarChart, Bar, RadialBarChart, RadialBar,
  ComposedChart, Area, AreaChart, Pie
} from "recharts"

interface Portfolio {
  id: string
  name: string
  currentAmount: number
  targetAmount: number
  portfolioType: string
}

interface AnalysisData {
  portfolioId: string
  currentValue: number
  investedAmount: number
  totalReturn: number
  returnPercentage: number
  trailingReturns: Record<string, string>
  calendarReturns: Record<string, string>
  assetAllocation: any
  riskMetrics: any
  benchmarkComparison: any
  dividendAnalysis: any
  forwardProjections: any
  performanceAttribution: any
  sectorExposure: any
  recommendations: any
  composition: any
}

interface PortfolioAnalysisModalProps {
  isOpen: boolean
  onClose: () => void
  portfolio: Portfolio | null
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#d084d0']

export function PortfolioAnalysisModal({ isOpen, onClose, portfolio }: PortfolioAnalysisModalProps) {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const fetchAnalysis = async () => {
    if (!portfolio?.id) return

    setLoading(true)
    try {
      const response = await fetch(`http://localhost:3001/api/portfolios/${portfolio.id}/analysis`)
      if (response.ok) {
        const data = await response.json()
        setAnalysisData(data.analysis)
      } else {
        console.error('Analysis fetch failed:', await response.text())
      }
    } catch (error) {
      console.error('Error fetching analysis:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && portfolio) {
      fetchAnalysis()
    }
  }, [isOpen, portfolio])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatPercentage = (value: number, decimals = 1) => {
    return `${value.toFixed(decimals)}%`
  }

  const getReturnColor = (value: number) => {
    return value >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const getRecommendationIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'medium': return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'low': return <Info className="h-4 w-4 text-blue-500" />
      default: return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  const renderAssetAllocation = () => {
    if (!analysisData?.assetAllocation) return null

    const { stocks, bonds, alternatives, summary } = analysisData.assetAllocation
    
    const pieData = [
      { name: 'Stocks', value: summary.equities, color: '#0088FE' },
      { name: 'Bonds', value: summary.fixedIncome, color: '#00C49F' },
      { name: 'Alternatives', value: summary.alternatives, color: '#FFBB28' }
    ].filter(item => item.value > 0)

    const detailData = [
      { category: 'Domestic Stocks', value: stocks.breakdown.domestic, parent: 'Stocks' },
      { category: 'International Stocks', value: stocks.breakdown.international, parent: 'Stocks' },
      { category: 'Emerging Markets', value: stocks.breakdown.emerging, parent: 'Stocks' },
      { category: 'Government Bonds', value: bonds.breakdown.government, parent: 'Bonds' },
      { category: 'Corporate Bonds', value: bonds.breakdown.corporate, parent: 'Bonds' },
      { category: 'Municipal Bonds', value: bonds.breakdown.municipal, parent: 'Bonds' },
    ].filter(item => item.value > 0)

    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Summary Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Asset Allocation Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name} ${value}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detailed Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {detailData.map((item) => (
                  <div key={item.category} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{item.category}</span>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                    <Progress value={item.value} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const renderRiskMetrics = () => {
    if (!analysisData?.riskMetrics) return null

    const metrics = [
      { label: 'Volatility', value: analysisData.riskMetrics.volatility, unit: '%', icon: Activity },
      { label: 'Sharpe Ratio', value: analysisData.riskMetrics.sharpeRatio, unit: '', icon: Award },
      { label: 'Max Drawdown', value: analysisData.riskMetrics.maxDrawdown, unit: '%', icon: TrendingDown },
      { label: 'Beta', value: analysisData.riskMetrics.beta, unit: '', icon: BarChart3 },
      { label: 'Alpha', value: analysisData.riskMetrics.alpha, unit: 'bps', icon: TrendingUp },
      { label: 'VaR (95%)', value: analysisData.riskMetrics.valueAtRisk95, unit: '%', icon: Shield },
    ]

    return (
      <div className="grid md:grid-cols-3 gap-4">
        {metrics.map((metric) => {
          const IconComponent = metric.icon
          return (
            <Card key={metric.label}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {typeof metric.value === 'number' ? metric.value.toFixed(2) : metric.value}{metric.unit}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  const renderBenchmarkComparison = () => {
    if (!analysisData?.benchmarkComparison?.comparisons) return null

    return (
      <div className="space-y-4">
        {analysisData.benchmarkComparison.comparisons.map((comparison: any) => (
          <Card key={comparison.benchmark}>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">{comparison.benchmark}</h4>
                <Badge variant={comparison.outperformance ? "default" : "secondary"}>
                  {comparison.outperformance ? "Outperforming" : "Underperforming"}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Portfolio Return</div>
                  <div className={`font-semibold ${getReturnColor(comparison.portfolioReturn)}`}>
                    {comparison.portfolioReturn}%
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Benchmark Return</div>
                  <div className="font-semibold">{comparison.benchmarkReturn}%</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Excess Return</div>
                  <div className={`font-semibold ${getReturnColor(comparison.excessReturn)}`}>
                    {comparison.excessReturn > 0 ? '+' : ''}{comparison.excessReturn}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const renderSectorExposure = () => {
    if (!analysisData?.sectorExposure?.sectors) return null

    const sectorData = analysisData.sectorExposure.sectors
      .sort((a: any, b: any) => b.allocation - a.allocation)

    return (
      <div className="space-y-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sectorData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="sector" type="category" width={120} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="allocation" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-semibold mb-2">Diversification Score</div>
            <div className="text-2xl font-bold text-green-600">
              {Math.round((1 - analysisData.sectorExposure.diversification.herfindahlIndex) * 100)}%
            </div>
          </div>
          <div>
            <div className="font-semibold mb-2">Top 3 Concentration</div>
            <div className="text-2xl font-bold">
              {analysisData.sectorExposure.diversification.topThreeConcentration}%
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderForwardProjections = () => {
    if (!analysisData?.forwardProjections?.projections) return null

    const projectionData = Object.entries(analysisData.forwardProjections.projections)
      .map(([key, value]: [string, any]) => ({
        timeframe: key.replace('Year', ' Year' + (key === '1Year' ? '' : 's')),
        expected: value.expected,
        optimistic: value.optimistic,
        pessimistic: value.pessimistic
      }))

    return (
      <div className="space-y-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timeframe" />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(value: number) => [formatCurrency(value), '']} />
              <Area dataKey="optimistic" fill="#22c55e" fillOpacity={0.2} stroke="none" />
              <Area dataKey="pessimistic" fill="#ef4444" fillOpacity={0.2} stroke="none" />
              <Line type="monotone" dataKey="expected" stroke="#3b82f6" strokeWidth={3} />
              <Line type="monotone" dataKey="optimistic" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" />
              <Line type="monotone" dataKey="pessimistic" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Expected Return</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {analysisData.forwardProjections.expectedReturn}%
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Time to Double</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analysisData.forwardProjections.goalAchievement.doubleInvestment.toFixed(1)} years
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Risk Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analysisData.forwardProjections.standardDeviation}%
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const renderRecommendations = () => {
    if (!analysisData?.recommendations) return null

    const allRecommendations = [
      ...analysisData.recommendations.immediate.map((r: any) => ({ ...r, priority: 'Immediate' })),
      ...analysisData.recommendations.shortTerm.map((r: any) => ({ ...r, priority: 'Short Term' })),
      ...analysisData.recommendations.longTerm.map((r: any) => ({ ...r, priority: 'Long Term' }))
    ]

    return (
      <div className="space-y-4">
        {allRecommendations.map((rec: any, index) => (
          <Card key={index}>
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                {getRecommendationIcon(rec.severity)}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold">{rec.title}</h4>
                    <Badge variant="outline">{rec.priority}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                  <p className="text-sm font-medium">{rec.action}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!portfolio) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Portfolio Analysis - {portfolio.name}
          </DialogTitle>
          <DialogDescription>
            Comprehensive analysis including risk metrics, performance attribution, and projections
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading analysis...</p>
            </div>
          </div>
        ) : analysisData ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid grid-cols-6 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="allocation">Allocation</TabsTrigger>
              <TabsTrigger value="risk">Risk</TabsTrigger>
              <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
              <TabsTrigger value="projections">Projections</TabsTrigger>
              <TabsTrigger value="recommendations">Insights</TabsTrigger>
            </TabsList>

            <div className="mt-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <TabsContent value="overview" className="space-y-6">
                {/* Key Performance Metrics */}
                <div className="grid md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Current Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(analysisData.currentValue)}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Total Return</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${getReturnColor(analysisData.returnPercentage)}`}>
                        {analysisData.returnPercentage > 0 ? '+' : ''}{formatPercentage(analysisData.returnPercentage)}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Dollar Gain/Loss</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${getReturnColor(analysisData.totalReturn)}`}>
                        {analysisData.totalReturn > 0 ? '+' : ''}{formatCurrency(analysisData.totalReturn)}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Portfolio Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge className="text-sm">{analysisData.composition.portfolioType}</Badge>
                    </CardContent>
                  </Card>
                </div>

                {/* Trailing Returns */}
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Returns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-4 text-center">
                      {Object.entries(analysisData.trailingReturns).map(([period, returnValue]) => (
                        <div key={period}>
                          <div className="text-sm text-muted-foreground">{period}</div>
                          <div className={`text-lg font-bold ${getReturnColor(parseFloat(returnValue as string))}`}>
                            {returnValue}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Growth Trend Chart */}
                {analysisData.growthTrend && analysisData.growthTrend.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Growth Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={analysisData.growthTrend}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                            <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                            <Tooltip formatter={(value: number) => [formatCurrency(value), 'Value']} />
                            <Area 
                              type="monotone" 
                              dataKey="value" 
                              stroke="#0d9488" 
                              fill="#0d9488"
                              fillOpacity={0.2}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="allocation">{renderAssetAllocation()}</TabsContent>
              <TabsContent value="risk">{renderRiskMetrics()}</TabsContent>
              <TabsContent value="benchmarks">{renderBenchmarkComparison()}</TabsContent>
              <TabsContent value="projections">{renderForwardProjections()}</TabsContent>
              <TabsContent value="recommendations">{renderRecommendations()}</TabsContent>
            </div>
          </Tabs>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p>Unable to load portfolio analysis. Please try again.</p>
            <Button onClick={fetchAnalysis} className="mt-4">Retry</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
