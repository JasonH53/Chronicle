import { useState, useEffect } from 'react'
import { Target, TrendingUp, Users, Sparkles, ArrowRight, CheckCircle } from 'lucide-react'
import axios from 'axios'

// API Configuration
const API_BASE_URL = 'http://localhost:3001/api'

function App() {
  const [currentView, setCurrentView] = useState('landing') // 'landing', 'register', 'dashboard'
  const [user, setUser] = useState(null)
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(false)

  // Landing Page Component
  const LandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="h-8 w-8 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">GoalifyInvest</span>
          </div>
          <button
            onClick={() => setCurrentView('register')}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Invest in Your
            <span className="text-primary-600"> Dreams</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform abstract portfolios into tangible goals. Whether it's a grad trip, 
            a new laptop, or your first car - make investing personal and motivating.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => setCurrentView('register')}
              className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center"
            >
              Start Your First Goal
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button className="border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-50 transition-colors">
              Learn More
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <Target className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Goal Creation</h3>
              <p className="text-gray-600">
                Define your financial goals with target amounts and dates. 
                Make investing personal and relatable.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <TrendingUp className="h-12 w-12 text-success-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Recommendations</h3>
              <p className="text-gray-600">
                Get expert-level portfolio recommendations based on your 
                timeline and risk tolerance.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <Sparkles className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Visual Progress</h3>
              <p className="text-gray-600">
                Watch your goals come to life with dynamic progress 
                trackers and growth projections.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )

  // User Registration Component
  const RegistrationForm = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      cash: 10000
    })

    const handleSubmit = async (e) => {
      e.preventDefault()
      setLoading(true)
      
      try {
        const response = await axios.post(`${API_BASE_URL}/users/register`, formData)
        setUser(response.data.client)
        setCurrentView('dashboard')
      } catch (error) {
        console.error('Registration failed:', error)
        alert('Registration failed. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <Target className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to GoalifyInvest</h2>
            <p className="text-gray-600">Let's get you started with your first investment goal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Alex Student"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="alex@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Starting Cash Balance
              </label>
              <input
                type="number"
                required
                value={formData.cash}
                onChange={(e) => setFormData({...formData, cash: parseInt(e.target.value)})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                min="1000"
                max="100000"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <button
            onClick={() => setCurrentView('landing')}
            className="w-full mt-4 text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    )
  }

  // Dashboard Component
  const Dashboard = () => {
    const [showCreateGoal, setShowCreateGoal] = useState(false)
    const [newGoal, setNewGoal] = useState({
      goalName: '',
      targetAmount: '',
      targetDate: '',
      initialAmount: '',
      portfolioType: 'balanced'
    })

    const createGoal = async (e) => {
      e.preventDefault()
      setLoading(true)
      
      try {
        const response = await axios.post(`${API_BASE_URL}/goals`, {
          clientId: user.id,
          ...newGoal,
          targetAmount: parseFloat(newGoal.targetAmount),
          initialAmount: parseFloat(newGoal.initialAmount)
        })
        
        setGoals([...goals, response.data.portfolio])
        setShowCreateGoal(false)
        setNewGoal({
          goalName: '',
          targetAmount: '',
          targetDate: '',
          initialAmount: '',
          portfolioType: 'balanced'
        })
      } catch (error) {
        console.error('Goal creation failed:', error)
        alert('Goal creation failed. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    const getPortfolioRecommendation = (targetDate) => {
      const today = new Date()
      const goalDate = new Date(targetDate)
      const monthsDiff = (goalDate.getFullYear() - today.getFullYear()) * 12 + (goalDate.getMonth() - today.getMonth())
      
      if (monthsDiff < 12) return 'very_conservative'
      if (monthsDiff < 36) return 'balanced'
      return 'growth'
    }

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="h-8 w-8 text-primary-600" />
                <span className="text-2xl font-bold text-gray-900">GoalifyInvest</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Welcome, {user?.name}</span>
                <div className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                  ${user?.cash?.toLocaleString()} available
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Investment Goals</h1>
            <p className="text-gray-600">Track your progress and watch your dreams become reality</p>
          </div>

          {/* Goals Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {goals.map((goal) => (
              <div key={goal.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Grad Trip to Spain</h3>
                  <span className="text-sm text-gray-500 capitalize">{goal.type.replace('_', ' ')}</span>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{Math.round((goal.current_value / 3500) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((goal.current_value / 3500) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Value</span>
                    <span className="font-semibold">${goal.current_value.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Target</span>
                    <span className="font-semibold">$3,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Remaining</span>
                    <span className="font-semibold">${(3500 - goal.current_value).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Create New Goal Card */}
            <div 
              onClick={() => setShowCreateGoal(true)}
              className="bg-white rounded-xl shadow-lg p-6 border-2 border-dashed border-gray-300 hover:border-primary-400 cursor-pointer transition-colors flex flex-col items-center justify-center text-center"
            >
              <Target className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Goal</h3>
              <p className="text-gray-600">Start investing in your next dream</p>
            </div>
          </div>
        </main>

        {/* Create Goal Modal */}
        {showCreateGoal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Create Your Goal</h3>
              
              <form onSubmit={createGoal} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Goal Name</label>
                  <input
                    type="text"
                    required
                    value={newGoal.goalName}
                    onChange={(e) => setNewGoal({...newGoal, goalName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Grad Trip to Spain"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Amount</label>
                  <input
                    type="number"
                    required
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="3500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Date</label>
                  <input
                    type="date"
                    required
                    value={newGoal.targetDate}
                    onChange={(e) => {
                      setNewGoal({...newGoal, targetDate: e.target.value, portfolioType: getPortfolioRecommendation(e.target.value)})
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Initial Investment</label>
                  <input
                    type="number"
                    required
                    value={newGoal.initialAmount}
                    onChange={(e) => setNewGoal({...newGoal, initialAmount: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio Type</label>
                  <select
                    value={newGoal.portfolioType}
                    onChange={(e) => setNewGoal({...newGoal, portfolioType: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="very_conservative">Very Conservative (2-5% annually)</option>
                    <option value="conservative">Conservative (4-7% annually)</option>
                    <option value="balanced">Balanced (6-10% annually)</option>
                    <option value="growth">Growth (8-12% annually)</option>
                    <option value="aggressive_growth">Aggressive Growth (12-15% annually)</option>
                  </select>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create Goal'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateGoal(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Render current view
  if (currentView === 'landing') return <LandingPage />
  if (currentView === 'register') return <RegistrationForm />
  if (currentView === 'dashboard') return <Dashboard />

  return <LandingPage />
}

export default App