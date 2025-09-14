"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, BarChart3, Target, Calendar, DollarSign, AlertCircle } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface SimulationData {
  portfolioId: string
  portfolioType: string
  currentValue: number
  projectedValue: number
  projectedReturn: number
  growthTrend: Array<{ date: string; value: number }>
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

  const runSimulation = async () => {
    if (!clientId) return

    setLoading(true)
    try {
      // If we have portfolios from props, create simulations using that data
      if (portfolios.length > 0) {
        const localSimulations = portfolios.map(portfolio => {
          const currentValue = portfolio.currentAmount || 0
          const projectedValue = currentValue * (1 + (months === 3 ? 0.05 : 0.10)) // 5% for 3 months, 10% for 12 months
          const projectedReturn = ((projectedValue - currentValue) / currentValue) * 100
          
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
      } else {
        // Try API as fallback
        const response = await fetch(`http://localhost:3001/api/clients/${clientId}/simulate-all`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            months: months
          }),
        })

        if (response.ok) {
          const data = await response.json()
          setSimulations(data.simulations)
          setSummary(data.summary)
        } else {
          console.error('Simulation failed:', await response.text())
        }
      }
    } catch (error) {
      console.error('Error running simulation:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && clientId) {
      runSimulation()
    }
  }, [isOpen, clientId, months])

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Portfolio Simulation & Analysis
          </DialogTitle>
          <DialogDescription>
            Run projections and analyze performance across all your investment goals
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Simulation Controls */}
          <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">Simulation Period:</span>
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
            <Button onClick={runSimulation} disabled={loading} size="sm">
              {loading ? "Running..." : "Refresh"}
            </Button>
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

          {/* Individual Portfolio Simulations */}
          {simulations.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Portfolio Projections</h3>
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
            </div>
          )}

          {/* No Data State */}
          {simulations.length === 0 && !loading && (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Portfolios Found</h3>
              <p className="text-muted-foreground">
                Create some investment goals first to run simulations. The simulation will use your actual portfolio data once you have goals set up.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
