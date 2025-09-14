"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, Plus, TrendingUp, Calendar, DollarSign, Plane, Smartphone, Car, GraduationCap, BarChart3, History, PieChart, Bot } from "lucide-react"
import { CreateGoalModal } from "@/components/create-goal-modal"
import { SimulationModal } from "@/components/simulation-modal"
import { PortfolioAnalysisModal } from "@/components/portfolio-analysis-modal"
import { TransactionHistory } from "@/components/transaction-history"
import FundingModal from "@/components/funding-modal"
import Link from "next/link"

interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  targetDate: string
  initialInvestment: number
  portfolioType: string
  icon: string
  portfolioId?: string
}

interface UserData {
  name: string
  email: string
  startingBalance: string
  clientId?: string
}

// Helper function to format dates consistently across server and client
const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${month}/${day}/${year}`
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [goals, setGoals] = useState<Goal[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isSimulationModalOpen, setIsSimulationModalOpen] = useState(false)
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false)
  const [selectedPortfolio, setSelectedPortfolio] = useState<any>(null)
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)
  const [isFundingModalOpen, setIsFundingModalOpen] = useState(false)
  const [currentBalance, setCurrentBalance] = useState(0)
  const [showAddBalance, setShowAddBalance] = useState(false)
  const [addBalanceAmount, setAddBalanceAmount] = useState('')
  const [currentTime, setCurrentTime] = useState<Date | null>(null)

  useEffect(() => {
    setMounted(true)
    setCurrentTime(new Date())
    
    // Load user data from localStorage
    const storedUser = localStorage.getItem("goalifyUser")
    const storedGoals = localStorage.getItem("goalifyGoals")

    if (storedUser) {
      const user = JSON.parse(storedUser)
      setUserData(user)
      setCurrentBalance(Number.parseFloat(user.startingBalance) || 0)
    }

    if (storedGoals) {
      setGoals(JSON.parse(storedGoals))
    }
    // Start with empty goals - no demo data
  }, [])

  const clearDemoData = () => {
    localStorage.removeItem("goalifyGoals")
    setGoals([])
  }

  const addBalance = async () => {
    if (!addBalanceAmount || parseFloat(addBalanceAmount) <= 0) {
      alert('Please enter a valid amount')
      return
    }

    if (!userData?.clientId) {
      alert('Client ID not found')
      return
    }

    try {
      const response = await fetch(`http://localhost:3001/api/clients/${userData.clientId}/deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(addBalanceAmount)
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const newBalance = data.result.client.cash
        alert(`Successfully deposited $${addBalanceAmount} to your account!`)
        setAddBalanceAmount('')
        setShowAddBalance(false)
        // Refresh balance display with actual updated balance
        setCurrentBalance(newBalance)
        
        // Update localStorage with new balance
        if (userData) {
          const updatedUser = { ...userData, startingBalance: newBalance.toString() }
          setUserData(updatedUser)
          localStorage.setItem("goalifyUser", JSON.stringify(updatedUser))
        }
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Add balance error:', error)
      alert('Failed to add balance. Please try again.')
    }
  }


  const handleCreateGoal = async (goalData: Omit<Goal, "id" | "currentAmount">) => {
    try {
      if (!userData?.clientId) {
        alert('Please create an account first')
        return
      }

      // Call the backend API to create a goal (portfolio)
      const response = await fetch('http://localhost:3001/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: userData.clientId,
          goalName: goalData.name,
          targetAmount: goalData.targetAmount,
          targetDate: goalData.targetDate,
          portfolioType: goalData.portfolioType.toLowerCase().replace(' ', '_'),
          initialAmount: goalData.initialInvestment
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const newGoal: Goal = {
          ...goalData,
          id: data.portfolio.id,
          currentAmount: goalData.initialInvestment,
          portfolioId: data.portfolio.id,
        }

        const updatedGoals = [...goals, newGoal]
        setGoals(updatedGoals)
        localStorage.setItem("goalifyGoals", JSON.stringify(updatedGoals))

        // Update balance
        const newBalance = currentBalance - goalData.initialInvestment
        setCurrentBalance(newBalance)

        // Update user data with new balance
        if (userData) {
          const updatedUser = { ...userData, startingBalance: newBalance.toString() }
          setUserData(updatedUser)
          localStorage.setItem("goalifyUser", JSON.stringify(updatedUser))
        }
      } else {
        console.error('Goal creation failed:', await response.text())
        alert('Failed to create goal. Please try again.')
      }
    } catch (error) {
      console.error('Error creating goal:', error)
      alert('Error creating goal. Please try again.')
    }
  }

  const getGoalIcon = (iconName: string) => {
    switch (iconName) {
      case "plane":
        return <Plane className="h-6 w-6" />
      case "smartphone":
        return <Smartphone className="h-6 w-6" />
      case "car":
        return <Car className="h-6 w-6" />
      case "graduation":
        return <GraduationCap className="h-6 w-6" />
      default:
        return <Target className="h-6 w-6" />
    }
  }

  const getPortfolioColor = (portfolioType: string) => {
    switch (portfolioType) {
      case "Very Conservative":
        return "bg-blue-100 text-blue-800"
      case "Conservative":
        return "bg-green-100 text-green-800"
      case "Balanced":
        return "bg-yellow-100 text-yellow-800"
      case "Growth":
        return "bg-orange-100 text-orange-800"
      case "Aggressive Growth":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalInvested = goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  const totalTargetValue = goals.reduce((sum, goal) => sum + goal.targetAmount, 0)

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted || !userData || !currentTime) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Target className="h-12 w-12 text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Willow</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-lg font-semibold text-foreground">${currentBalance.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2">
              {!showAddBalance ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowAddBalance(true)}
                  className="text-xs"
                >
                  Deposit Money
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Deposit Amount"
                    value={addBalanceAmount}
                    onChange={(e) => setAddBalanceAmount(e.target.value)}
                    className="w-24 px-2 py-1 text-xs border rounded"
                    min="0.01"
                    step="0.01"
                  />
                  <Button 
                    size="sm" 
                    onClick={addBalance}
                    className="text-xs"
                    disabled={!addBalanceAmount || parseFloat(addBalanceAmount) <= 0}
                  >
                    Add
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setShowAddBalance(false)
                      setAddBalanceAmount('')
                    }}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              )}
              {goals.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearDemoData}
                  className="text-xs"
                >
                  Clear Demo Data
                </Button>
              )}
            </div>
            <div className="w-10 h-10 bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
              <span className="text-primary font-semibold">{userData.name.charAt(0).toUpperCase()}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {userData.name.split(" ")[0]}!</h1>
          <p className="text-muted-foreground text-lg">Manage your finances and watch your resources grow!</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resources Invested</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalInvested.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Across {goals.length} goal{goals.length !== 1 ? "s" : ""}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Build Target</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalTargetValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total goal value</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Build Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalTargetValue > 0 ? Math.round((totalInvested / totalTargetValue) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">Towards all goals</p>
            </CardContent>
          </Card>
        </div>

        {/* Goals Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Your Building Projects 🏗️</h2>
          <div className="flex items-center gap-2">
            <Link href="/ai-advisor">
              <Button 
                variant="outline" 
                className="gap-2"
              >
                <Bot className="h-4 w-4" />
                AI Advisor
              </Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={() => setIsSimulationModalOpen(true)} 
              className="gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Simulate
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsTransactionModalOpen(true)} 
              className="gap-2"
            >
              <History className="h-4 w-4" />
              Transactions
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsFundingModalOpen(true)} 
              className="gap-2"
            >
              <DollarSign className="h-4 w-4" />
              Fund Goals
            </Button>
              <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Start New Build
            </Button>
          </div>
        </div>

        {goals.length === 0 ? (
            <Card className="text-center py-12">
            <CardContent>
              <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Builds Started Yet! 🏗️</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Ready to start crafting your financial future? Whether it's an epic trip, awesome gear, or your first car - 
                let's build it block by block!
              </p>
              <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Start Your First Build
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100
              const targetDate = new Date(goal.targetDate)
              const daysLeft = Math.ceil(
                (targetDate.getTime() - currentTime!.getTime()) / (1000 * 60 * 60 * 24),
              )

              return (
                <Card key={goal.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary">
                          {getGoalIcon(goal.icon)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{goal.name}</CardTitle>
                          <CardDescription>${goal.targetAmount.toLocaleString()} goal</CardDescription>
                        </div>
                      </div>
                      <Badge className={getPortfolioColor(goal.portfolioType)}>{goal.portfolioType}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span className="font-medium">
                          ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">{Math.round(progress)}% complete</p>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{daysLeft > 0 ? `${daysLeft} days left` : "Target date passed"}</span>
                      </div>
                      <span className="text-muted-foreground">{formatDate(targetDate)}</span>
                    </div>

                    <div className="pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2"
                        onClick={() => {
                          setSelectedPortfolio({
                            id: goal.portfolioId || goal.id,
                            name: goal.name,
                            currentAmount: goal.currentAmount,
                            targetAmount: goal.targetAmount,
                            portfolioType: goal.portfolioType
                          })
                          setIsAnalysisModalOpen(true)
                        }}
                      >
                        <PieChart className="h-4 w-4" />
                        Analyze Portfolio
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Create Goal Modal */}
      <CreateGoalModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateGoal={handleCreateGoal}
        availableBalance={currentBalance}
      />

      {/* Simulation Modal */}
      <SimulationModal
        isOpen={isSimulationModalOpen}
        onClose={() => setIsSimulationModalOpen(false)}
        clientId={userData?.clientId || ''}
        portfolios={goals.map(goal => ({
          id: goal.id,
          name: goal.name,
          currentAmount: goal.currentAmount,
          targetAmount: goal.targetAmount,
          portfolioType: goal.portfolioType
        }))}
      />

      {/* Transaction History Modal */}
      <TransactionHistory
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        clientId={userData?.clientId || ''}
        portfolios={goals.map(goal => ({
          id: goal.id,
          name: goal.name,
          portfolioType: goal.portfolioType
        }))}
      />

      {/* Funding Modal */}
      <FundingModal
        isOpen={isFundingModalOpen}
        onClose={() => setIsFundingModalOpen(false)}
        portfolios={goals.map(goal => ({
          id: goal.id,
          name: goal.name,
          portfolioType: goal.portfolioType,
          currentAmount: goal.currentAmount,
          targetAmount: goal.targetAmount,
          progress: (goal.currentAmount / goal.targetAmount) * 100
        }))}
        clientId={userData?.clientId || ''}
        currentBalance={currentBalance}
        onTransferComplete={() => {
          // Refresh goals data after transfer
          const storedGoals = localStorage.getItem("goalifyGoals")
          if (storedGoals) {
            setGoals(JSON.parse(storedGoals))
          }
          
          // Refresh user balance after transfer
          const storedUser = localStorage.getItem("goalifyUser")
          if (storedUser) {
            const user = JSON.parse(storedUser)
            setCurrentBalance(parseFloat(user.startingBalance) || 0)
            setUserData(user)
          }
        }}
      />

      {/* Portfolio Analysis Modal */}
      <PortfolioAnalysisModal
        isOpen={isAnalysisModalOpen}
        onClose={() => {
          setIsAnalysisModalOpen(false)
          setSelectedPortfolio(null)
        }}
        portfolio={selectedPortfolio}
      />
    </div>
  )
}
