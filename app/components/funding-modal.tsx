'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, DollarSign, TrendingUp, Wallet, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

interface Portfolio {
  id: string
  name: string
  portfolioType: string
  currentAmount: number
  targetAmount: number
  progress: number
}

interface FundingModalProps {
  isOpen: boolean
  onClose: () => void
  portfolios: Portfolio[]
  clientId: string
  onTransferComplete?: () => void
}

export default function FundingModal({ 
  isOpen, 
  onClose, 
  portfolios, 
  clientId,
  onTransferComplete 
}: FundingModalProps) {
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [clientCash, setClientCash] = useState<number>(0)
  const [transferring, setTransferring] = useState(false)

  // Fetch client cash balance
  useEffect(() => {
    if (isOpen && clientId) {
      fetchClientCash()
    }
  }, [isOpen, clientId])

  const fetchClientCash = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/clients/${clientId}`)
      if (response.ok) {
        const data = await response.json()
        setClientCash(data.cash || 0)
      }
    } catch (error) {
      console.error('Error fetching client cash:', error)
    }
  }

  const handleTransfer = async () => {
    if (!selectedPortfolio || !amount || parseFloat(amount) <= 0) {
      toast.error('Please select a portfolio and enter a valid amount')
      return
    }

    if (parseFloat(amount) > clientCash) {
      toast.error('Insufficient cash balance')
      return
    }

    setTransferring(true)
    try {
      const response = await fetch(`http://localhost:3001/api/portfolios/${selectedPortfolio}/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount)
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const transferAmount = parseFloat(amount)
        const portfolioName = portfolios.find(p => p.id === selectedPortfolio)?.name
        
        toast.success(`Successfully transferred $${amount} to ${portfolioName}`)
        
        // Update the portfolio's currentAmount in localStorage
        const storedGoals = localStorage.getItem("goalifyGoals")
        if (storedGoals) {
          const goals = JSON.parse(storedGoals)
          const updatedGoals = goals.map((goal: any) => {
            if (goal.portfolioId === selectedPortfolio || goal.id === selectedPortfolio) {
              return {
                ...goal,
                currentAmount: goal.currentAmount + transferAmount
              }
            }
            return goal
          })
          localStorage.setItem("goalifyGoals", JSON.stringify(updatedGoals))
        }
        
        // Update user's cash balance in localStorage
        const storedUser = localStorage.getItem("goalifyUser")
        if (storedUser) {
          const user = JSON.parse(storedUser)
          const newBalance = (parseFloat(user.startingBalance) || 0) - transferAmount
          user.startingBalance = newBalance.toString()
          localStorage.setItem("goalifyUser", JSON.stringify(user))
        }
        
        // Reset form
        setAmount('')
        setSelectedPortfolio('')
        
        // Refresh client cash
        await fetchClientCash()
        
        // Notify parent component
        if (onTransferComplete) {
          onTransferComplete()
        }
        
        // Close the modal after successful transfer
        onClose()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Transfer failed')
      }
    } catch (error) {
      console.error('Transfer error:', error)
      toast.error('Transfer failed. Please try again.')
    } finally {
      setTransferring(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const selectedPortfolioData = portfolios.find(p => p.id === selectedPortfolio)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Fund Investment Goals
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Client Cash Balance */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Available Cash</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">{formatCurrency(clientCash)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Selection */}
          <div className="space-y-2">
            <Label htmlFor="portfolio">Select Investment Goal</Label>
            <Select value={selectedPortfolio} onValueChange={setSelectedPortfolio}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a goal to fund" />
              </SelectTrigger>
              <SelectContent>
                {portfolios.map((portfolio) => (
                  <SelectItem key={portfolio.id} value={portfolio.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{portfolio.name}</span>
                      <Badge variant="secondary" className="ml-2">
                        {portfolio.portfolioType.toUpperCase()}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selected Portfolio Info */}
          {selectedPortfolioData && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Goal Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Current Amount</span>
                  <span className="font-medium">{formatCurrency(selectedPortfolioData.currentAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Target Amount</span>
                  <span className="font-medium">{formatCurrency(selectedPortfolioData.targetAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Progress</span>
                  <span className="font-medium">{selectedPortfolioData.progress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(selectedPortfolioData.progress, 100)}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Transfer Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10"
                min="0.01"
                step="0.01"
                max={clientCash}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Maximum: {formatCurrency(clientCash)}
            </p>
          </div>

          {/* Transfer Preview */}
          {selectedPortfolioData && amount && parseFloat(amount) > 0 && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Transfer Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">From Cash Balance</span>
                  <span className="text-sm font-medium">{formatCurrency(clientCash)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Transfer Amount</span>
                  <span className="text-sm font-medium text-red-600">-{formatCurrency(parseFloat(amount))}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">To {selectedPortfolioData.name}</span>
                  <span className="text-sm font-medium text-green-600">+{formatCurrency(parseFloat(amount))}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">New Cash Balance</span>
                    <span className="text-sm font-medium">{formatCurrency(clientCash - parseFloat(amount))}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">New Goal Amount</span>
                    <span className="text-sm font-medium">{formatCurrency(selectedPortfolioData.currentAmount + parseFloat(amount))}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Messages */}
          {amount && parseFloat(amount) > clientCash && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-700">Insufficient cash balance</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={transferring}
            >
              Cancel
            </Button>
            <Button
              onClick={handleTransfer}
              disabled={!selectedPortfolio || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > clientCash || transferring}
              className="flex-1"
            >
              {transferring ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Transferring...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Transfer Funds
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
