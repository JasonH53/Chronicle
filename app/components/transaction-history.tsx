"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { History, ArrowUpRight, ArrowDownLeft, DollarSign, Calendar, Filter, Search } from "lucide-react"

interface Transaction {
  id: string
  date: string
  type: 'deposit' | 'withdrawal'
  amount: number
  balance_after: number
  portfolioId?: string
  portfolioType?: string
}

interface TransactionSummary {
  totalTransactions: number
  totalDeposits: number
  totalWithdrawals: number
  netFlow: number
}

interface TransactionHistoryProps {
  isOpen: boolean
  onClose: () => void
  clientId: string
  portfolios: Array<{ id: string; name: string; portfolioType: string }>
}

export function TransactionHistory({ isOpen, onClose, clientId, portfolios }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [summary, setSummary] = useState<TransactionSummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')

  const loadTransactions = async () => {
    if (!clientId || !selectedPortfolio) return

    setLoading(true)
    try {
      const url = `http://localhost:3001/api/portfolios/${selectedPortfolio}/transactions`

      const response = await fetch(url)
      
      if (response.ok) {
        const data = await response.json()
        setTransactions(data.transactions || [])
        setSummary(data.summary || null)
      } else {
        console.error('Failed to load transactions:', await response.text())
      }
    } catch (error) {
      console.error('Error loading transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && clientId && portfolios.length > 0) {
      // Auto-select first portfolio if none selected
      if (!selectedPortfolio) {
        setSelectedPortfolio(portfolios[0].id)
      }
    }
  }, [isOpen, clientId, portfolios])

  useEffect(() => {
    if (isOpen && clientId && selectedPortfolio) {
      loadTransactions()
    }
  }, [isOpen, clientId, selectedPortfolio])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTransactionIcon = (type: string) => {
    return type === 'deposit' ? (
      <ArrowUpRight className="h-4 w-4 text-green-600" />
    ) : (
      <ArrowDownLeft className="h-4 w-4 text-red-600" />
    )
  }

  const getTransactionColor = (type: string) => {
    return type === 'deposit' ? 'text-green-600' : 'text-red-600'
  }

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = searchTerm === '' || 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.portfolioType?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filterType === 'all' || transaction.type === filterType
    
    return matchesSearch && matchesType
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Transaction History
          </DialogTitle>
          <DialogDescription>
            Track all financial movements across your investment goals
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Filters and Controls */}
          <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Portfolio:</span>
              <Select value={selectedPortfolio} onValueChange={setSelectedPortfolio}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {portfolios.map(portfolio => (
                    <SelectItem key={portfolio.id} value={portfolio.id}>
                      {portfolio.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Type:</span>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="deposit">Deposits</SelectItem>
                  <SelectItem value="withdrawal">Withdrawals</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 flex-1">
              <Search className="h-4 w-4" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />
            </div>

            <Button onClick={loadTransactions} disabled={loading} size="sm">
              {loading ? "Loading..." : "Refresh"}
            </Button>
          </div>

          {/* Summary Cards */}
          {summary && (
            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{summary.totalTransactions}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(summary.totalDeposits)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(summary.totalWithdrawals)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Net Flow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${summary.netFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(summary.netFlow)}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Transaction List */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Recent Transactions</h3>
            {filteredTransactions.length > 0 ? (
              <div className="space-y-2">
                {filteredTransactions.map((transaction) => (
                  <Card key={transaction.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getTransactionIcon(transaction.type)}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium capitalize">
                                {transaction.type}
                              </span>
                              {transaction.portfolioType && (
                                <Badge variant="outline" className="text-xs">
                                  {transaction.portfolioType.replace('_', ' ').toUpperCase()}
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {formatDate(transaction.date)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                            {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Balance: {formatCurrency(transaction.balance_after)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Transactions Found</h3>
                  <p className="text-muted-foreground">
                    No transactions found for this portfolio.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
