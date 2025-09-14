"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  TrendingUp, BarChart3, Target, Calendar, DollarSign, AlertCircle, 
  Zap, Shield, TrendingDown, Activity, Gauge, AlertTriangle
} from "lucide-react"
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area, ComposedChart, ScatterChart, Scatter
} from "recharts"

interface SimulationData {
  portfolioId: string
  portfolioType: string
  currentValue: number
  projectedValue: number
  projectedReturn: number
  growthTrend: Array<{ date: string; value: number }>
  
  // Enhanced simulation results
  scenarioAnalysis?: Array<{
    scenario: string
    probability: number
    projectedValue: number
    pessimisticValue: number
    optimisticValue: number
    expectedReturn: number
    volatility: number
    range: { low: number; high: number }
  }>
  
  monteCarloSimulation?: {
    simulations: number
    results: {
      mean: number
      median: number
      standardDeviation: number
      percentiles: {
        p5: number
        p10: number
        p25: number
        p75: number
        p90: number
        p95: number
      }
      probabilityOfLoss: number
      probabilityOfGain: number
      worstCase: number
      bestCase: number
    }
  }
  
  stressTestResults?: {
    scenarios: Array<{
      scenario: string
      impact: number
      stressedValue: number
      valueAtRisk: number
      estimatedRecoveryMonths: number
      severity: string
    }>
    summary: {
      worstCaseScenario: any
      averageImpact: number
      maxValueAtRisk: number
      resilience: number
    }
  }
  
  goalAnalysis?: {
    goalAmount: number
    currentValue: number
    timeframeMonths: number
    timeframeYears: number
    requiredReturn: number
    probabilityOfSuccess: number
    confidence: string
    projectedValueAtGoal: number
    shortfall: number
    monthlyContributionNeeded: number
    alternativeTimeframes: {
      withCurrentSavings: number
      to80PercentProbability: number
      to90PercentProbability: number
    }
  }
  
  riskMetrics?: {
    expectedVolatility: number
    downsideVolatility: number
    probabilityOfLoss: number
    expectedDrawdown: number
    riskAdjustedReturn: number
    conditionalVaR: number
  }
  
  sensitivityAnalysis?: Array<{
    scenario: string
    returnAssumption: number
    projectedValue: number
    totalReturn: number
    sensitivity: number
  }>
}

interface SimulationModalProps {
  isOpen: boolean
  onClose: () => void
  clientId: string
  portfolios: Array<{ id: string; name: string; currentAmount: number; targetAmount: number; portfolioType: string }>
}

export function SimulationModal({ isOpen, onClose, clientId, portfolios }: SimulationModalProps) {
  const [simulations, setSimulations] = useState<SimulationData[]>([])
  const [loading, setLoading] = useState(false)
  const [months, setMonths] = useState(12)
  const [summary, setSummary] = useState<any>(null)
  const [aggregateAnalysis, setAggregateAnalysis] = useState<any>(null)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [marketOutlook, setMarketOutlook] = useState<any>(null)
  
  // Enhanced simulation options
  const [scenarios, setScenarios] = useState(['bear', 'base', 'bull'])
  const [runMonteCarlo, setRunMonteCarlo] = useState(true)
  const [stressTest, setStressTest] = useState(true)
  const [goalAmount, setGoalAmount] = useState<number>(0)
  const [goalTimeframe, setGoalTimeframe] = useState(120) // 10 years
  const [activeTab, setActiveTab] = useState("overview")

  const runSimulation = async () => {
    setLoading(true)
    
    // Always ensure we have basic portfolio data from props
    const createBasicSimulations = () => {
      if (portfolios.length > 0) {
        const localSimulations = portfolios.map(portfolio => {
          const currentValue = portfolio.currentAmount || 0
          const projectedValue = Math.max(currentValue * (1 + (months === 3 ? 0.05 : 0.10)), 1)
          const projectedReturn = currentValue > 0 ? ((projectedValue - currentValue) / currentValue) * 100 : (months === 3 ? 5 : 10)
          
          return {
            portfolioId: portfolio.id,
            portfolioType: portfolio.portfolioType,
            currentValue: currentValue,
            projectedValue: Math.round(projectedValue * 100) / 100,
            projectedReturn: Math.round(projectedReturn * 100) / 100,
            growthTrend: generateLocalGrowthTrend(currentValue, projectedValue, months)
          }
        })

        const totalCurrentValue = portfolios.reduce((sum, p) => sum + (p.currentAmount || 0), 0)
        const totalProjectedValue = localSimulations.reduce((sum, s) => sum + s.projectedValue, 0)
        const overallReturn = totalCurrentValue > 0 ? ((totalProjectedValue - totalCurrentValue) / totalCurrentValue) * 100 : 0

        setSimulations(localSimulations)
        setSummary({
          totalPortfolios: portfolios.length,
          totalCurrentValue,
          totalProjectedValue,
          overallReturn: Math.round(overallReturn * 100) / 100,
          simulationMonths: months
        })
        return true
      }
      return false
    }

    // If no clientId, just use basic simulations
    if (!clientId) {
      createBasicSimulations()
      setLoading(false)
      return
    }

    try {
      // Try enhanced API with all new features
      const response = await fetch(`http://localhost:3001/api/clients/${clientId}/simulate-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          months: months,
          scenarios: scenarios,
          runMonteCarlo: runMonteCarlo,
          stressTest: stressTest,
          goalAmount: goalAmount > 0 ? goalAmount : (portfolios[0]?.targetAmount || 50000), // Use first portfolio target or default
          goalTimeframe: goalTimeframe,
          portfolios: portfolios // Send portfolio data from props
        }),
      })

      if (response.ok) {
        const data = await response.json()
        // If API returns simulations, use them
        if (data.simulations && data.simulations.length > 0) {
          setSimulations(data.simulations)
          setSummary(data.summary || null)
          setAggregateAnalysis(data.aggregateAnalysis || null)
          setRecommendations(data.recommendations || [])
          setMarketOutlook(data.marketOutlook || null)
        } else {
          // API succeeded but returned no simulations, use local ones
          createBasicSimulations()
        }
      } else {
        console.error('Enhanced simulation API failed, using basic simulation')
        createBasicSimulations()
      }
    } catch (error) {
      console.error('Error calling enhanced simulation API:', error)
      createBasicSimulations()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      // Auto-set goal amount from first portfolio if not manually set
      if (goalAmount === 0 && portfolios.length > 0 && portfolios[0].targetAmount > 0) {
        setGoalAmount(portfolios[0].targetAmount)
      }
      runSimulation()
    }
  }, [isOpen, months])
  
  useEffect(() => {
    // Update goal amount when portfolios change
    if (portfolios.length > 0 && goalAmount === 0) {
      setGoalAmount(portfolios[0].targetAmount || 50000)
    }
  }, [portfolios])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const generateLocalGrowthTrend = (startValue: number, endValue: number, months: number) => {
    const growthTrend = []
    const startDate = new Date()
    const monthlyGrowth = (endValue - startValue) / months
    
    for (let i = 0; i <= months; i++) {
      const date = new Date(startDate)
      date.setMonth(date.getMonth() + i)
      
      // Add some realistic volatility
      const baseValue = startValue + (monthlyGrowth * i)
      const volatility = baseValue * 0.02 * (Math.random() - 0.5) // ±2% volatility
      const value = Math.max(baseValue + volatility, startValue * 0.8) // Don't go below 80% of start
      
      growthTrend.push({
        date: date.toISOString().split('T')[0],
        value: Math.round(value * 100) / 100
      })
    }
    
    return growthTrend
  }

  // Render functions for enhanced features
  const renderMonteCarloResults = (simulation: SimulationData) => {
    if (!simulation.monteCarloSimulation) return null

    const { results } = simulation.monteCarloSimulation
    const percentileData = Object.entries(results.percentiles).map(([key, value]) => ({
      percentile: key.replace('p', '') + '%',
      value: value
    }))

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Mean</div>
            <div className="font-semibold">{formatCurrency(results.mean)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Median</div>
            <div className="font-semibold">{formatCurrency(results.median)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Std Dev</div>
            <div className="font-semibold">{formatCurrency(results.standardDeviation)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Probability of Loss</div>
            <div className="font-semibold text-red-600">{results.probabilityOfLoss}%</div>
          </div>
          <div>
            <div className="text-muted-foreground">Probability of Gain</div>
            <div className="font-semibold text-green-600">{results.probabilityOfGain}%</div>
          </div>
          <div>
            <div className="text-muted-foreground">Simulations</div>
            <div className="font-semibold">{simulation.monteCarloSimulation.simulations.toLocaleString()}</div>
          </div>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={percentileData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="percentile" />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(value: number) => [formatCurrency(value), 'Value']} />
              <Bar dataKey="value" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Best Case</div>
            <div className="font-semibold text-green-600">{formatCurrency(results.bestCase)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Worst Case</div>
            <div className="font-semibold text-red-600">{formatCurrency(results.worstCase)}</div>
          </div>
        </div>
      </div>
    )
  }

  const renderScenarioAnalysis = (simulation: SimulationData) => {
    if (!simulation.scenarioAnalysis) return null

    return (
      <div className="space-y-4">
        {simulation.scenarioAnalysis.map((scenario) => (
          <Card key={scenario.scenario}>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold capitalize">{scenario.scenario} Market</h4>
                <Badge variant="outline">{scenario.probability}% probability</Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Expected Value</div>
                  <div className="font-semibold">{formatCurrency(scenario.projectedValue)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Expected Return</div>
                  <div className="font-semibold">{scenario.expectedReturn}%</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Volatility</div>
                  <div className="font-semibold">{scenario.volatility}%</div>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Range</span>
                  <span>{formatCurrency(scenario.range.low)} - {formatCurrency(scenario.range.high)}</span>
                </div>
                <Progress 
                  value={((scenario.projectedValue - scenario.range.low) / (scenario.range.high - scenario.range.low)) * 100} 
                  className="h-2" 
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const renderStressTests = (simulation: SimulationData) => {
    if (!simulation.stressTestResults) return null

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">Average Impact</div>
              <div className="text-2xl font-bold text-red-600">
                {simulation.stressTestResults.summary.averageImpact.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">Max Value at Risk</div>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(simulation.stressTestResults.summary.maxValueAtRisk)}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-2">
          {simulation.stressTestResults.scenarios.map((stress) => (
            <Card key={stress.scenario}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{stress.scenario}</h4>
                  <Badge 
                    variant={stress.severity === 'High' ? 'destructive' : stress.severity === 'Medium' ? 'default' : 'secondary'}
                  >
                    {stress.severity}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Impact</div>
                    <div className="font-semibold text-red-600">{stress.impact}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Stressed Value</div>
                    <div className="font-semibold">{formatCurrency(stress.stressedValue)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Recovery Time</div>
                    <div className="font-semibold">{stress.estimatedRecoveryMonths} months</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const renderGoalAnalysis = (simulation: SimulationData) => {
    if (!simulation.goalAnalysis) {
      return (
        <div className="text-center py-8">
          <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Goal Analysis Available</h3>
          <p className="text-muted-foreground">
            Set a goal amount in the simulation controls above to see goal achievement analysis.
          </p>
        </div>
      )
    }

    const { goalAnalysis } = simulation
    const confidenceColor = goalAnalysis.confidence === 'High' ? 'text-green-600' : 
                           goalAnalysis.confidence === 'Medium' ? 'text-yellow-600' : 'text-red-600'

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Goal Achievement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{goalAnalysis.probabilityOfSuccess}%</div>
                <div className={`text-sm font-medium ${confidenceColor}`}>
                  {goalAnalysis.confidence} Confidence
                </div>
              </div>
              <Progress value={goalAnalysis.probabilityOfSuccess} className="h-3" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Goal Amount</div>
                  <div className="font-semibold">{formatCurrency(goalAnalysis.goalAmount)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Time Frame</div>
                  <div className="font-semibold">{goalAnalysis.timeframeYears} years</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Required Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {goalAnalysis.shortfall > 0 && (
                <div>
                  <div className="text-sm text-muted-foreground">Monthly Contribution Needed</div>
                  <div className="text-2xl font-bold text-orange-600">
                    {formatCurrency(goalAnalysis.monthlyContributionNeeded)}
                  </div>
                </div>
              )}
              <div>
                <div className="text-sm text-muted-foreground">Projected Value</div>
                <div className="text-lg font-semibold">{formatCurrency(goalAnalysis.projectedValueAtGoal)}</div>
              </div>
              {goalAnalysis.shortfall > 0 && (
                <div>
                  <div className="text-sm text-muted-foreground">Shortfall</div>
                  <div className="text-lg font-semibold text-red-600">{formatCurrency(goalAnalysis.shortfall)}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Alternative Timeframes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">With Current Savings Only</div>
                <div className="font-semibold">{Math.round(goalAnalysis.alternativeTimeframes.withCurrentSavings / 12)} years</div>
              </div>
              <div>
                <div className="text-muted-foreground">For 80% Probability</div>
                <div className="font-semibold">{Math.round(goalAnalysis.alternativeTimeframes.to80PercentProbability / 12)} years</div>
              </div>
              <div>
                <div className="text-muted-foreground">For 90% Probability</div>
                <div className="font-semibold">{Math.round(goalAnalysis.alternativeTimeframes.to90PercentProbability / 12)} years</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderRiskMetrics = (simulation: SimulationData) => {
    if (!simulation.riskMetrics) return null

    const metrics = [
      { label: 'Expected Volatility', value: simulation.riskMetrics.expectedVolatility, unit: '%', icon: Activity },
      { label: 'Downside Volatility', value: simulation.riskMetrics.downsideVolatility, unit: '%', icon: TrendingDown },
      { label: 'Probability of Loss', value: simulation.riskMetrics.probabilityOfLoss, unit: '%', icon: AlertCircle },
      { label: 'Expected Drawdown', value: simulation.riskMetrics.expectedDrawdown, unit: '%', icon: Shield },
      { label: 'Risk-Adjusted Return', value: simulation.riskMetrics.riskAdjustedReturn, unit: '', icon: Gauge },
      { label: 'Conditional VaR', value: simulation.riskMetrics.conditionalVaR, unit: '$', icon: AlertTriangle },
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
                <div className="text-xl font-bold">
                  {metric.unit === '$' ? formatCurrency(metric.value) : `${metric.value.toFixed(2)}${metric.unit}`}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Advanced Portfolio Simulation & Analysis
          </DialogTitle>
          <DialogDescription>
            Comprehensive simulation including Monte Carlo analysis, scenario testing, stress tests, and goal achievement probability
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 flex-1 overflow-y-auto">
          {/* Enhanced Simulation Controls */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <Label className="text-sm font-medium">Period:</Label>
                </div>
                <Select value={months.toString()} onValueChange={(value) => setMonths(parseInt(value))}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 months</SelectItem>
                    <SelectItem value="12">12 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <Label className="text-sm font-medium">Goal Amount:</Label>
                </div>
                <Input
                  type="number"
                  placeholder="$50,000"
                  value={goalAmount || ''}
                  onChange={(e) => setGoalAmount(parseFloat(e.target.value) || 0)}
                  className="w-32"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <Label className="text-sm font-medium">Analysis:</Label>
                </div>
                <div className="flex gap-2">
                  <Badge variant={runMonteCarlo ? "default" : "outline"}>Monte Carlo</Badge>
                  <Badge variant={stressTest ? "default" : "outline"}>Stress Tests</Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Button onClick={runSimulation} disabled={loading} size="sm">
                  {loading ? "Running..." : "Run Advanced Simulation"}
                </Button>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          {summary && (
            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Portfolios</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{summary.totalPortfolios}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Current Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(summary.totalCurrentValue)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Projected Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(summary.totalProjectedValue)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Projected Return</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    +{summary.overallReturn.toFixed(1)}%
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Running advanced simulations...</p>
              </div>
            </div>
          )}

          {/* Enhanced Analysis Tabs */}
          {!loading && simulations.length > 0 && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-6 w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="montecarlo">Monte Carlo</TabsTrigger>
                <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
                <TabsTrigger value="stresstests">Stress Tests</TabsTrigger>
                <TabsTrigger value="goalanalysis">Goal Analysis</TabsTrigger>
                <TabsTrigger value="risk">Risk Metrics</TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="overview" className="space-y-6">
                  {/* Market Outlook */}
                  {marketOutlook && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Market Outlook</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground mb-2">Overall Sentiment</div>
                            <Badge className="capitalize">{marketOutlook.outlook.replace('_', ' ')}</Badge>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-2">Key Themes</div>
                            <div className="text-sm space-y-1">
                              {marketOutlook.keyThemes?.slice(0, 2).map((theme: string, index: number) => (
                                <div key={index}>• {theme}</div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-2">Recommendation</div>
                            <div className="text-sm capitalize">{marketOutlook.recommendation?.replace(/_/g, ' ')}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Portfolio Simulations Overview */}
                  <div className="grid gap-4">
                    {simulations.map((simulation) => {
                      const portfolio = portfolios.find(p => p.id === simulation.portfolioId)
                      const progress = simulation.currentValue / (portfolio?.targetAmount || 1) * 100
                      const projectedProgress = simulation.projectedValue / (portfolio?.targetAmount || 1) * 100

                      return (
                        <Card key={simulation.portfolioId}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="text-lg">{portfolio?.name || 'Unknown Portfolio'}</CardTitle>
                                <CardDescription>
                                  {simulation.portfolioType.replace('_', ' ').toUpperCase()}
                                </CardDescription>
                              </div>
                              <Badge variant="outline">
                                {simulation.projectedReturn.toFixed(1)}% return
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* Progress Comparison */}
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Current Progress</span>
                                <span>{progress.toFixed(1)}%</span>
                              </div>
                              <Progress value={progress} className="h-2" />
                              
                              <div className="flex justify-between text-sm">
                                <span>Projected Progress</span>
                                <span>{projectedProgress.toFixed(1)}%</span>
                              </div>
                              <Progress value={projectedProgress} className="h-2" />
                            </div>

                            {/* Value Comparison */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <div className="text-muted-foreground">Current Value</div>
                                <div className="font-semibold">{formatCurrency(simulation.currentValue)}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Projected Value</div>
                                <div className="font-semibold text-green-600">
                                  {formatCurrency(simulation.projectedValue)}
                                </div>
                              </div>
                            </div>

                            {/* Growth Chart */}
                            {simulation.growthTrend.length > 0 && (
                              <div className="h-32">
                                <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={simulation.growthTrend}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                      dataKey="date" 
                                      tickFormatter={formatDate}
                                      tick={{ fontSize: 12 }}
                                    />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip 
                                      formatter={(value: number) => [formatCurrency(value), 'Value']}
                                      labelFormatter={(label) => formatDate(label)}
                                    />
                                    <Line 
                                      type="monotone" 
                                      dataKey="value" 
                                      stroke="#0d9488" 
                                      strokeWidth={2}
                                      dot={false}
                                    />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="montecarlo" className="space-y-6">
                  {simulations.map((simulation) => {
                    const portfolio = portfolios.find(p => p.id === simulation.portfolioId)
                    return (
                      <Card key={simulation.portfolioId}>
                        <CardHeader>
                          <CardTitle>{portfolio?.name || 'Unknown Portfolio'} - Monte Carlo Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {renderMonteCarloResults(simulation)}
                        </CardContent>
                      </Card>
                    )
                  })}
                </TabsContent>

                <TabsContent value="scenarios" className="space-y-6">
                  {simulations.map((simulation) => {
                    const portfolio = portfolios.find(p => p.id === simulation.portfolioId)
                    return (
                      <Card key={simulation.portfolioId}>
                        <CardHeader>
                          <CardTitle>{portfolio?.name || 'Unknown Portfolio'} - Scenario Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {renderScenarioAnalysis(simulation)}
                        </CardContent>
                      </Card>
                    )
                  })}
                </TabsContent>

                <TabsContent value="stresstests" className="space-y-6">
                  {simulations.map((simulation) => {
                    const portfolio = portfolios.find(p => p.id === simulation.portfolioId)
                    return (
                      <Card key={simulation.portfolioId}>
                        <CardHeader>
                          <CardTitle>{portfolio?.name || 'Unknown Portfolio'} - Stress Tests</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {renderStressTests(simulation)}
                        </CardContent>
                      </Card>
                    )
                  })}
                </TabsContent>

                <TabsContent value="goalanalysis" className="space-y-6">
                  {simulations.map((simulation) => {
                    const portfolio = portfolios.find(p => p.id === simulation.portfolioId)
                    return (
                      <Card key={simulation.portfolioId}>
                        <CardHeader>
                          <CardTitle>{portfolio?.name || 'Unknown Portfolio'} - Goal Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {renderGoalAnalysis(simulation)}
                        </CardContent>
                      </Card>
                    )
                  })}
                </TabsContent>

                <TabsContent value="risk" className="space-y-6">
                  {simulations.map((simulation) => {
                    const portfolio = portfolios.find(p => p.id === simulation.portfolioId)
                    return (
                      <Card key={simulation.portfolioId}>
                        <CardHeader>
                          <CardTitle>{portfolio?.name || 'Unknown Portfolio'} - Risk Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {renderRiskMetrics(simulation)}
                        </CardContent>
                      </Card>
                    )
                  })}
                </TabsContent>
              </div>
            </Tabs>
          )}

          {/* No Data State */}
          {simulations.length === 0 && !loading && (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Portfolios Available</h3>
              <p className="text-muted-foreground">
                {portfolios.length === 0 ? 
                  'Create some investment goals first to run simulations.' :
                  'Unable to load portfolio simulation data. Please try refreshing the simulation.'
                }
              </p>
              <div className="flex gap-2 mt-4">
                {portfolios.length > 0 && (
                  <Button onClick={runSimulation} variant="outline">
                    Retry Simulation
                  </Button>
                )}
                <Button onClick={() => window.location.reload()} variant="outline">
                  Refresh Page
                </Button>
              </div>
            </div>
          )}

          {/* Recommendations Section */}
          {recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Strategic Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recommendations.slice(0, 3).map((rec: any, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      {rec.priority === 'high' ? 
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" /> :
                        <Target className="h-5 w-5 text-blue-500 mt-0.5" />
                      }
                      <div>
                        <div className="font-semibold">{rec.title}</div>
                        <div className="text-sm text-muted-foreground">{rec.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
