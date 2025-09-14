"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Bot, 
  User, 
  Send, 
  Upload, 
  FileText, 
  TrendingUp, 
  DollarSign, 
  Target,
  ArrowLeft,
  Loader2,
  PieChart,
  BarChart3,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github.css'
import { CreateGoalModal } from "@/components/create-goal-modal"
import FundingModal from "@/components/funding-modal"
import { PortfolioAnalysisModal } from "@/components/portfolio-analysis-modal"
import { SimulationModal } from "@/components/simulation-modal"

interface ActionButton {
  id: string
  label: string
  action: 'create_goal' | 'view_portfolio' | 'add_funds' | 'simulate' | 'portfolio_analysis'
  data?: {
    reason?: string
    suggested_name?: string
    estimated_amount?: number
    suggested_amount?: number
    analysis_type?: 'performance' | 'risk' | 'allocation' | 'comprehensive'
    scenario_type?: 'monte_carlo' | 'stress_test' | 'goal_projection'
  }
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  portfolioData?: any
  fileData?: any
  actionButtons?: ActionButton[]
}

interface UserData {
  name: string
  email: string
  startingBalance: string
  clientId?: string
}

interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  targetDate: string
  portfolioType: string
  icon?: string
  portfolioId?: string
  riskLevel?: string
}

export default function AIAdvisorPage() {
  const [mounted, setMounted] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [goals, setGoals] = useState<Goal[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isCreateGoalModalOpen, setIsCreateGoalModalOpen] = useState(false)
  const [isFundingModalOpen, setIsFundingModalOpen] = useState(false)
  const [isPortfolioAnalysisModalOpen, setIsPortfolioAnalysisModalOpen] = useState(false)
  const [isSimulationModalOpen, setIsSimulationModalOpen] = useState(false)
  const [selectedActionData, setSelectedActionData] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
    
    // Load user data and goals
    const storedUser = localStorage.getItem("goalifyUser")
    const storedGoals = localStorage.getItem("goalifyGoals")

    if (storedUser) {
      setUserData(JSON.parse(storedUser))
    }

    if (storedGoals) {
      setGoals(JSON.parse(storedGoals))
    }
  }, [])

  // Add welcome message after goals are loaded to prevent hydration mismatch
  useEffect(() => {
    if (mounted && messages.length === 0) {
      setMessages([{
        id: 'welcome-message',
        role: 'assistant',
        content: `Hello! I'm your AI Financial Advisor. I can help you analyze your investment portfolios, answer questions about your goals, and provide personalized financial insights. 

I have access to your portfolio data and can analyze any financial documents you upload. How can I assist you today?`,
        timestamp: new Date('2024-01-01T00:00:00Z'),
        actionButtons: goals.length === 0 ? [
          {
            id: 'create-first-goal',
            label: 'Create Your First Investment Goal',
            action: 'create_goal'
          },
          {
            id: 'view-portfolio',
            label: 'View Dashboard',
            action: 'view_portfolio'
          }
        ] : [
          {
            id: 'view-portfolio',
            label: 'View Portfolio',
            action: 'view_portfolio'
          },
          {
            id: 'create-goal',
            label: 'Create New Goal',
            action: 'create_goal'
          }
        ]
      }])
    }
  }, [mounted, goals, messages.length])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleActionButton = (action: ActionButton) => {
    // Store the action data for use in modals
    setSelectedActionData(action.data)
    
    switch (action.action) {
      case 'create_goal':
        setIsCreateGoalModalOpen(true)
        break
      case 'view_portfolio':
        // Navigate to dashboard
        window.location.href = '/dashboard'
        break
      case 'portfolio_analysis':
        setIsPortfolioAnalysisModalOpen(true)
        break
      case 'add_funds':
        setIsFundingModalOpen(true)
        break
      case 'simulate':
        setIsSimulationModalOpen(true)
        break
      default:
        console.log('Unknown action:', action.action)
    }
  }

  const handleCreateGoal = (goalData: any) => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      name: goalData.name,
      targetAmount: goalData.targetAmount,
      currentAmount: goalData.initialInvestment || 0,
      targetDate: goalData.targetDate,
      riskLevel: goalData.riskLevel,
      portfolioType: goalData.portfolioType || 'balanced'
    }

    const updatedGoals = [...goals, newGoal]
    setGoals(updatedGoals)
    localStorage.setItem("goalifyGoals", JSON.stringify(updatedGoals))

    // Add a confirmation message from AI
    const confirmationMessage: Message = {
      id: `confirmation-${Date.now()}`,
      role: 'assistant',
      content: `Great! I've created your "${goalData.name}" goal with a target of ${formatCurrency(goalData.targetAmount)}. This goal is now part of your investment portfolio. Would you like me to analyze this goal or help you create an investment strategy for it?`,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, confirmationMessage])
    setIsCreateGoalModalOpen(false)
    setSelectedActionData(null)
  }

  const handleFundingComplete = (fundingData: any) => {
    setIsFundingModalOpen(false)
    setSelectedActionData(null)

    // Add confirmation message
    const confirmationMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: `Perfect! I've processed your funding request. Your portfolio will be updated with the new funds shortly.`,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, confirmationMessage])
  }

  const handlePortfolioAnalysisComplete = () => {
    setIsPortfolioAnalysisModalOpen(false)
    setSelectedActionData(null)
  }

  const handleSimulationComplete = () => {
    setIsSimulationModalOpen(false)
    setSelectedActionData(null)
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && uploadedFiles.length === 0) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputMessage || "Uploaded files for analysis",
      timestamp: new Date(),
      fileData: uploadedFiles.length > 0 ? uploadedFiles.map(f => ({ name: f.name, size: f.size, type: f.type })) : undefined
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      // Call AI agent with context
      const response = await callAIAgent(inputMessage, uploadedFiles)
      
      const aiMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        portfolioData: response.portfolioData,
        actionButtons: response.actionButtons || []
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error calling AI agent:', error)
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "I apologize, but I encountered an error while processing your request. Please try again or contact support if the issue persists.",
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setUploadedFiles([])
    }
  }

  const callAIAgent = async (message: string, files: File[]) => {
    // Prepare context data
    const context = {
      userData,
      goals,
      message,
      files: files.length > 0 ? await Promise.all(files.map(async (file) => ({
        name: file.name,
        content: await file.text(),
        type: file.type
      }))) : []
    }

    // Call backend AI agent endpoint
    const response = await fetch('http://localhost:3001/api/ai-agent/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(context),
    })

    if (!response.ok) {
      throw new Error('Failed to get AI response')
    }

    return await response.json()
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const validFiles = files.filter(file => {
      // Accept common financial file types
      const validTypes = [
        'text/csv',
        'application/pdf',
        'text/plain',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ]
      return validTypes.includes(file.type) || file.name.endsWith('.csv') || file.name.endsWith('.txt')
    })

    setUploadedFiles(prev => [...prev, ...validFiles])
    
    if (files.length > validFiles.length) {
      alert('Some files were not uploaded. Please upload CSV, PDF, TXT, or Excel files only.')
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const totalInvested = goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  const totalTargetValue = goals.reduce((sum, goal) => sum + goal.targetAmount, 0)

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Bot className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading AI Financial Advisor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Bot className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">AI Financial Advisor</h1>
                <p className="text-sm text-muted-foreground">Powered by GoalifyInvest</p>
              </div>
            </div>
          </div>
          
          {userData && (
            <div className="flex items-center gap-4">
              <div className="text-right text-sm">
                <p className="text-muted-foreground">Portfolio Value</p>
                <p className="font-semibold">{formatCurrency(totalInvested)}</p>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold">{userData.name.charAt(0).toUpperCase()}</span>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Portfolio Summary Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Portfolio Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Invested</span>
                    <span className="font-medium">{formatCurrency(totalInvested)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Target Value</span>
                    <span className="font-medium">{formatCurrency(totalTargetValue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Goals</span>
                    <span className="font-medium">{goals.length}</span>
                  </div>
                </div>
                
                {goals.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Active Goals</h4>
                    {goals.slice(0, 3).map((goal) => (
                      <div key={goal.id} className="p-2 bg-muted/50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{goal.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {goal.portfolioType}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                        </div>
                      </div>
                    ))}
                    {goals.length > 3 && (
                      <p className="text-xs text-muted-foreground">+{goals.length - 3} more goals</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start gap-2"
                  onClick={() => setInputMessage("Analyze my portfolio performance")}
                >
                  <BarChart3 className="h-4 w-4" />
                  Portfolio Analysis
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start gap-2"
                  onClick={() => setInputMessage("What are my investment recommendations?")}
                >
                  <TrendingUp className="h-4 w-4" />
                  Get Recommendations
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start gap-2"
                  onClick={() => setInputMessage("How am I tracking towards my goals?")}
                >
                  <Target className="h-4 w-4" />
                  Goal Progress
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start gap-2"
                  onClick={() => setInputMessage("What's my risk assessment?")}
                >
                  <AlertCircle className="h-4 w-4" />
                  Risk Analysis
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[calc(100vh-200px)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  AI Financial Advisor Chat
                </CardTitle>
                <CardDescription>
                  Ask me anything about your investments, upload financial documents, or get personalized advice
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex flex-col h-full p-0">
                {/* Messages Area */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.role === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                          </div>
                          
                          <div className={`rounded-lg p-3 ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}>
                            <div className="text-sm">
                              {message.role === 'assistant' ? (
                                <div className="markdown-content">
                                  <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeHighlight]}
                                    components={{
                                    // Custom styling for markdown elements
                                    h1: ({children}) => <h1 className="text-lg font-bold mb-2 text-foreground">{children}</h1>,
                                    h2: ({children}) => <h2 className="text-base font-semibold mb-2 text-foreground">{children}</h2>,
                                    h3: ({children}) => <h3 className="text-sm font-medium mb-1 text-foreground">{children}</h3>,
                                    p: ({children}) => <p className="mb-2 text-current leading-relaxed">{children}</p>,
                                    ul: ({children}) => <ul className="list-disc list-inside mb-2 space-y-1 ml-2">{children}</ul>,
                                    ol: ({children}) => <ol className="list-decimal list-inside mb-2 space-y-1 ml-2">{children}</ol>,
                                    li: ({children}) => <li className="text-current">{children}</li>,
                                    strong: ({children}) => <strong className="font-semibold text-current">{children}</strong>,
                                    em: ({children}) => <em className="italic text-current">{children}</em>,
                                    code: ({children}) => <code className="bg-background/50 px-1 py-0.5 rounded text-xs font-mono border">{children}</code>,
                                    pre: ({children}) => <pre className="bg-background/50 p-2 rounded-md overflow-x-auto mb-2 border text-xs">{children}</pre>,
                                    blockquote: ({children}) => <blockquote className="border-l-2 border-gray-300 dark:border-gray-600 pl-3 italic mb-2 opacity-80">{children}</blockquote>,
                                    table: ({children}) => <table className="border-collapse border border-gray-200 dark:border-gray-700 mb-2 w-full text-xs">{children}</table>,
                                    th: ({children}) => <th className="border border-gray-200 dark:border-gray-700 px-2 py-1 bg-gray-50 dark:bg-gray-800 font-semibold">{children}</th>,
                                    td: ({children}) => <td className="border border-gray-200 dark:border-gray-700 px-2 py-1">{children}</td>,
                                  }}
                                  >
                                    {message.content}
                                  </ReactMarkdown>
                                </div>
                              ) : (
                                <div className="whitespace-pre-wrap">{message.content}</div>
                              )}
                            </div>
                            
                            {/* Action Buttons */}
                            {message.actionButtons && message.actionButtons.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {message.actionButtons.map((actionButton) => (
                                  <Button
                                    key={actionButton.id}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleActionButton(actionButton)}
                                    className="gap-2"
                                  >
                                    {actionButton.action === 'create_goal' && <Target className="h-4 w-4" />}
                                    {actionButton.action === 'view_portfolio' && <PieChart className="h-4 w-4" />}
                                    {actionButton.action === 'portfolio_analysis' && <PieChart className="h-4 w-4" />}
                                    {actionButton.action === 'add_funds' && <DollarSign className="h-4 w-4" />}
                                    {actionButton.action === 'simulate' && <BarChart3 className="h-4 w-4" />}
                                    {actionButton.label}
                                  </Button>
                                ))}
                              </div>
                            )}
                            
                            {message.fileData && (
                              <div className="mt-2 space-y-1">
                                {message.fileData.map((file: any, index: number) => (
                                  <div key={index} className="flex items-center gap-2 text-xs opacity-75">
                                    <FileText className="h-3 w-3" />
                                    <span>{file.name}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {message.portfolioData && (
                              <div className="mt-2 p-2 bg-background/10 rounded text-xs">
                                <div className="font-medium">Portfolio Data Analyzed</div>
                              </div>
                            )}
                            
                            <div className="text-xs opacity-50 mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <Bot className="h-4 w-4" />
                        </div>
                        <div className="bg-muted rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div ref={messagesEndRef} />
                </ScrollArea>

                {/* File Upload Area */}
                {uploadedFiles.length > 0 && (
                  <div className="border-t p-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Uploaded Files:</h4>
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span className="text-sm">{file.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Area */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      multiple
                      accept=".csv,.pdf,.txt,.xls,.xlsx"
                      className="hidden"
                    />
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="shrink-0"
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                    
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask me about your portfolio, upload financial documents, or get investment advice..."
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      className="flex-1"
                    />
                    
                    <Button 
                      onClick={handleSendMessage}
                      disabled={isLoading || (!inputMessage.trim() && uploadedFiles.length === 0)}
                      className="shrink-0"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-2">
                    Upload CSV, PDF, TXT, or Excel files for analysis. Press Enter to send.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Create Goal Modal */}
      <CreateGoalModal
        isOpen={isCreateGoalModalOpen}
        onClose={() => setIsCreateGoalModalOpen(false)}
        onCreateGoal={handleCreateGoal}
        availableBalance={parseFloat(userData?.startingBalance || '0')}
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
        clientId={userData?.clientId || 'demo-client'}
        onTransferComplete={() => handleFundingComplete({})}
      />

      {/* Portfolio Analysis Modal */}
      <PortfolioAnalysisModal
        isOpen={isPortfolioAnalysisModalOpen}
        onClose={handlePortfolioAnalysisComplete}
        portfolio={goals.length > 0 ? {
          id: goals[0].id,
          name: goals[0].name,
          portfolioType: goals[0].portfolioType,
          currentAmount: goals[0].currentAmount,
          targetAmount: goals[0].targetAmount
        } : null}
      />

      {/* Simulation Modal */}
      <SimulationModal
        isOpen={isSimulationModalOpen}
        onClose={handleSimulationComplete}
        clientId={userData?.clientId || 'demo-client'}
        portfolios={goals.map(goal => ({
          id: goal.id,
          name: goal.name,
          currentAmount: goal.currentAmount,
          targetAmount: goal.targetAmount,
          portfolioType: goal.portfolioType
        }))}
      />
    </div>
  )
}
