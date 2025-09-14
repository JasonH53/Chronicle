"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, Plus, TrendingUp, Calendar, DollarSign, Plane, Smartphone, Car, GraduationCap } from "lucide-react"
import { CreateGoalModal } from "@/components/create-goal-modal"

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

export default function DashboardPage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [goals, setGoals] = useState<Goal[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [currentBalance, setCurrentBalance] = useState(0)

  useEffect(() => {
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
          portfolioType: goalData.portfolioType.toLowerCase(),
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

  if (!userData) {
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
            <span className="text-2xl font-bold text-foreground">GoalifyInvest</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-lg font-semibold text-foreground">${currentBalance.toLocaleString()}</p>
            </div>
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
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-primary font-semibold">{userData.name.charAt(0).toUpperCase()}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {userData.name.split(" ")[0]}!</h1>
          <p className="text-muted-foreground text-lg">Track your progress and manage your investment goals</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
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
              <CardTitle className="text-sm font-medium">Target Value</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalTargetValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total goal value</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
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
          <h2 className="text-2xl font-bold">Your Investment Goals</h2>
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Goal
          </Button>
        </div>

        {goals.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Goals Yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start your investing journey by creating your first goal. Whether it's a trip, gadget, or car - we'll
                help you get there.
              </p>
              <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Goal
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100
              const daysLeft = Math.ceil(
                (new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
              )

              return (
                <Card key={goal.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
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
                      <span className="text-muted-foreground">{new Date(goal.targetDate).toLocaleDateString()}</span>
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
    </div>
  )
}
