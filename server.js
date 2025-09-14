const express = require('express');
const cors = require('cors');
const axios = require('axios');
const config = require('./config');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// RBC API Service
class RBCApiService {
  constructor() {
    this.baseURL = config.rbcApiBaseUrl;
    this.jwtToken = config.jwtToken;
  }

  getHeaders() {
    return {
      'Authorization': `Bearer ${this.jwtToken}`,
      'Content-Type': 'application/json',
      'accept': 'application/json'
    };
  }

  // Register a new client (user)
  async createClient(clientData) {
    try {
      console.log('Making request to:', `${this.baseURL}/clients`);
      console.log('Request headers:', this.getHeaders());
      console.log('Request data:', clientData);
      
      const response = await axios.post(
        `${this.baseURL}/clients`,
        clientData,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating client:', error.response?.data || error.message);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
      throw error;
    }
  }

  // Create a portfolio for a goal
  async createPortfolio(clientId, portfolioData) {
    try {
      const response = await axios.post(
        `${this.baseURL}/clients/${clientId}/portfolios`,
        portfolioData,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating portfolio:', error.response?.data || error.message);
      throw error;
    }
  }

  // Get portfolio details
  async getPortfolio(portfolioId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/portfolios/${portfolioId}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching portfolio:', error.response?.data || error.message);
      throw error;
    }
  }

  // Transfer funds to portfolio
  async transferFunds(portfolioId, transferData) {
    try {
      const response = await axios.post(
        `${this.baseURL}/portfolios/${portfolioId}/transfer`,
        transferData,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error transferring funds:', error.response?.data || error.message);
      throw error;
    }
  }

  // Get client information
  async getClient(clientId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/clients/${clientId}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching client:', error.response?.data || error.message);
      throw error;
    }
  }

  // Get all portfolios for a client
  async getClientPortfolios(clientId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/clients/${clientId}/portfolios`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching client portfolios:', error.response?.data || error.message);
      throw error;
    }
  }

  // Get portfolio information
  async getPortfolio(portfolioId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/portfolios/${portfolioId}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching portfolio:', error.response?.data || error.message);
      throw error;
    }
  }

  // Simulate portfolio growth
  async simulatePortfolio(clientId, simulationData) {
    try {
      const response = await axios.post(
        `${this.baseURL}/client/${clientId}/simulate`,
        simulationData,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error simulating portfolio:', error.response?.data || error.message);
      throw error;
    }
  }

  // Update client information
  async updateClient(clientId, updateData) {
    try {
      const response = await axios.put(
        `${this.baseURL}/clients/${clientId}`,
        updateData,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating client:', error.response?.data || error.message);
      throw error;
    }
  }

  // Update portfolio information
  async updatePortfolio(portfolioId, updateData) {
    try {
      const response = await axios.put(
        `${this.baseURL}/portfolios/${portfolioId}`,
        updateData,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating portfolio:', error.response?.data || error.message);
      throw error;
    }
  }

  // Deposit money to client cash balance
  async depositToClient(clientId, amount) {
    try {
      const response = await axios.post(
        `${this.baseURL}/clients/${clientId}/deposit`,
        { amount: amount },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error depositing to client:', error.response?.data || error.message);
      throw error;
    }
  }

}

const rbcApi = new RBCApiService();

// Routes

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to GoalifyInvest API!',
    status: 'OK',
    teamId: config.teamId,
    endpoints: {
      health: '/api/health',
      registerUser: 'POST /api/users/register',
      createGoal: 'POST /api/goals',
      getGoal: 'GET /api/goals/:portfolioId',
      fundGoal: 'POST /api/goals/:portfolioId/fund',
      simulateGoal: 'POST /api/goals/:portfolioId/simulate',
      deposit: 'POST /api/clients/:clientId/deposit',
      transfer: 'POST /api/portfolios/:portfolioId/transfer',
      analysis: 'GET /api/portfolios/:portfolioId/analysis',
      transactions: 'GET /api/clients/:clientId/transactions',
      portfolioTransactions: 'GET /api/portfolios/:portfolioId/transactions',
      simulateAll: 'POST /api/clients/:clientId/simulate-all',
      addBalance: 'POST /api/clients/:clientId/add-balance'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'GoalifyInvest API is running',
    teamId: config.teamId
  });
});

// Get client information
app.get('/api/clients/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    
    const client = await rbcApi.getClient(clientId);
    
    res.json(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ 
      error: 'Failed to fetch client',
      details: error.response?.data || error.message
    });
  }
});

// Add balance for testing (bypasses RBC API limitations)
app.post('/api/clients/:clientId/add-balance', async (req, res) => {
  try {
    const { clientId } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: 'Invalid amount',
        details: 'Amount must be a positive number'
      });
    }

    // Get current client info
    const client = await rbcApi.getClient(clientId);
    const currentCash = client.cash || 0;
    const newCash = currentCash + parseFloat(amount);

    // Note: This is a test endpoint that simulates adding balance
    // In a real app, this would be handled through external banking
    res.json({
      success: true,
      message: `Balance addition simulated. In a real app, this would add $${amount} to your account.`,
      client: {
        id: clientId,
        previousCash: currentCash,
        newCash: newCash,
        addedAmount: parseFloat(amount)
      },
      note: "This is a test endpoint. Real balance additions would come from external banking systems."
    });
  } catch (error) {
    console.error('Add balance error:', error);
    res.status(500).json({
      error: 'Failed to add balance',
      details: error.response?.data?.message || error.message
    });
  }
});

// User registration
app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, cash = 10000 } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const clientData = {
      name,
      email,
      cash: parseInt(cash),
      portfolios: []
    };

    const client = await rbcApi.createClient(clientData);
    
    // In a real app, you'd save this to your database
    // For now, we'll just return the client data
    res.status(201).json({
      success: true,
      client,
      message: 'User registered successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to register user',
      details: error.response?.data || error.message
    });
  }
});

// Create a goal (portfolio)
app.post('/api/goals', async (req, res) => {
  try {
    const { clientId, goalName, targetAmount, targetDate, portfolioType, initialAmount } = req.body;
    
    if (!clientId || !goalName || !portfolioType || !initialAmount) {
      return res.status(400).json({ error: 'Missing required fields: clientId, goalName, portfolioType, initialAmount' });
    }

    // Validate portfolio type
    const validTypes = ['aggressive_growth', 'growth', 'balanced', 'conservative', 'very_conservative'];
    if (!validTypes.includes(portfolioType)) {
      return res.status(400).json({ 
        error: 'Invalid portfolio type. Must be one of: aggressive_growth, growth, balanced, conservative, very_conservative' 
      });
    }

    // Validate initial amount
    if (initialAmount < 1 || initialAmount > 1000000) {
      return res.status(400).json({ 
        error: 'Initial amount must be between $1 and $1,000,000' 
      });
    }

    const portfolioData = {
      type: portfolioType,
      initialAmount: parseFloat(initialAmount)
    };

    const portfolio = await rbcApi.createPortfolio(clientId, portfolioData);
    
    // In a real app, you'd save the goal to your database
    res.status(201).json({
      success: true,
      portfolio,
      message: 'Goal created successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to create goal',
      details: error.response?.data || error.message
    });
  }
});

// Get goal progress
app.get('/api/goals/:portfolioId', async (req, res) => {
  try {
    const { portfolioId } = req.params;
    
    const portfolio = await rbcApi.getPortfolio(portfolioId);
    
    res.json({
      success: true,
      portfolio
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch goal progress',
      details: error.response?.data || error.message
    });
  }
});

// Add funds to goal
app.post('/api/goals/:portfolioId/fund', async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    const transferData = {
      amount: parseFloat(amount)
    };

    const result = await rbcApi.transferFunds(portfolioId, transferData);
    
    res.json({
      success: true,
      result,
      message: 'Funds added successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to add funds',
      details: error.response?.data || error.message
    });
  }
});

// Simulate goal growth
app.post('/api/goals/:portfolioId/simulate', async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const { clientId, months = 12 } = req.body;
    
    if (!clientId) {
      return res.status(400).json({ error: 'Client ID is required' });
    }

    // Validate simulation period - only allow 3 and 12 months
    if (months !== 3 && months !== 12) {
      return res.status(400).json({
        error: 'Invalid simulation period',
        details: 'Only 3 and 12 month simulations are allowed'
      });
    }

    const simulationData = {
      months: parseInt(months)
    };

    const simulation = await rbcApi.simulatePortfolio(clientId, simulationData);
    
    res.json({
      success: true,
      simulation
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to simulate growth',
      details: error.response?.data || error.message
    });
  }
});

// Get portfolio analysis and performance data
app.get('/api/portfolios/:portfolioId/analysis', async (req, res) => {
  try {
    const { portfolioId } = req.params;
    
    const portfolio = await rbcApi.getPortfolio(portfolioId);
    
    // Calculate performance metrics
    const currentValue = portfolio.current_value || 0;
    const investedAmount = portfolio.invested_amount || 0;
    const totalReturn = currentValue - investedAmount;
    const returnPercentage = investedAmount > 0 ? (totalReturn / investedAmount) * 100 : 0;
    
    // Calculate growth trend
    const growthTrend = portfolio.growth_trend || [];
    const monthlyReturns = [];
    
    for (let i = 1; i < growthTrend.length; i++) {
      const prevValue = growthTrend[i-1].value;
      const currentValue = growthTrend[i].value;
      const monthlyReturn = ((currentValue - prevValue) / prevValue) * 100;
      monthlyReturns.push({
        date: growthTrend[i].date,
        return: monthlyReturn
      });
    }
    
    // Calculate trailing returns (matching API format)
    const trailingReturns = calculateTrailingReturns(growthTrend);
    const calendarReturns = calculateCalendarReturns(growthTrend);
    
    const analysis = {
      portfolioId,
      currentValue,
      investedAmount,
      totalReturn,
      returnPercentage: Math.round(returnPercentage * 100) / 100,
      growthTrend,
      monthlyReturns,
      trailingReturns,
      calendarReturns,
      riskMetrics: {
        volatility: calculateVolatility(monthlyReturns),
        sharpeRatio: calculateSharpeRatio(monthlyReturns),
        maxDrawdown: calculateMaxDrawdown(growthTrend)
      },
      performance: {
        bestMonth: monthlyReturns.length > 0 ? Math.max(...monthlyReturns.map(r => r.return)) : 0,
        worstMonth: monthlyReturns.length > 0 ? Math.min(...monthlyReturns.map(r => r.return)) : 0,
        averageMonthlyReturn: monthlyReturns.length > 0 ? 
          monthlyReturns.reduce((sum, r) => sum + r.return, 0) / monthlyReturns.length : 0
      }
    };
    
    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get portfolio analysis',
      details: error.response?.data || error.message
    });
  }
});

// Get all transactions for a client
app.get('/api/clients/:clientId/transactions', async (req, res) => {
  try {
    const { clientId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    
    // Get all portfolios for the client
    const portfolios = await rbcApi.getClientPortfolios(clientId);
    
    // Collect all transactions from all portfolios
    const allTransactions = [];
    
    for (const portfolio of portfolios) {
      if (portfolio.transactions) {
        portfolio.transactions.forEach(transaction => {
          allTransactions.push({
            ...transaction,
            portfolioId: portfolio.id,
            portfolioType: portfolio.type
          });
        });
      }
    }
    
    // Sort by date (newest first)
    allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Apply pagination
    const paginatedTransactions = allTransactions.slice(
      parseInt(offset), 
      parseInt(offset) + parseInt(limit)
    );
    
    // Calculate summary statistics
    const summary = {
      totalTransactions: allTransactions.length,
      totalDeposits: allTransactions
        .filter(t => t.type === 'deposit')
        .reduce((sum, t) => sum + t.amount, 0),
      totalWithdrawals: allTransactions
        .filter(t => t.type === 'withdrawal')
        .reduce((sum, t) => sum + t.amount, 0),
      netFlow: allTransactions
        .reduce((sum, t) => sum + (t.type === 'deposit' ? t.amount : -t.amount), 0)
    };
    
    res.json({
      success: true,
      transactions: paginatedTransactions,
      summary,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: allTransactions.length,
        hasMore: parseInt(offset) + parseInt(limit) < allTransactions.length
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get transactions',
      details: error.response?.data || error.message
    });
  }
});

// Get transaction history for a specific portfolio
app.get('/api/portfolios/:portfolioId/transactions', async (req, res) => {
  try {
    const { portfolioId } = req.params;
    
    const portfolio = await rbcApi.getPortfolio(portfolioId);
    
    if (!portfolio.transactions) {
      return res.json({
        success: true,
        transactions: [],
        summary: {
          totalTransactions: 0,
          totalDeposits: 0,
          totalWithdrawals: 0,
          netFlow: 0
        }
      });
    }
    
    // Sort transactions by date (newest first)
    const transactions = portfolio.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Calculate summary
    const summary = {
      totalTransactions: transactions.length,
      totalDeposits: transactions
        .filter(t => t.type === 'deposit')
        .reduce((sum, t) => sum + t.amount, 0),
      totalWithdrawals: transactions
        .filter(t => t.type === 'withdrawal')
        .reduce((sum, t) => sum + t.amount, 0),
      netFlow: transactions
        .reduce((sum, t) => sum + (t.type === 'deposit' ? t.amount : -t.amount), 0)
    };
    
    res.json({
      success: true,
      transactions,
      summary
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get portfolio transactions',
      details: error.response?.data || error.message
    });
  }
});

// Run comprehensive simulation for all client portfolios
app.post('/api/clients/:clientId/simulate-all', async (req, res) => {
  try {
    const { clientId } = req.params;
    const { months = 12, scenarios = ['conservative', 'balanced', 'aggressive'] } = req.body;
    
    // Validate simulation period - only allow 3 and 12 months
    if (months !== 3 && months !== 12) {
      return res.status(400).json({
        error: 'Invalid simulation period',
        details: 'Only 3 and 12 month simulations are allowed'
      });
    }
    
    // Try to get portfolios from RBC API
    let portfolios = [];
    try {
      portfolios = await rbcApi.getClientPortfolios(clientId);
    } catch (error) {
      console.log('RBC API getClientPortfolios failed, trying alternative approach:', error.message);
      // If getClientPortfolios fails, we'll create a mock response for demo purposes
      // In a real app, you'd query your own database for client portfolios
      portfolios = [];
    }
    
    const simulations = [];
    
    // If no portfolios from API, we'll return empty simulations
    // In a real app, you'd query your own database for client portfolios
    if (portfolios.length === 0) {
      console.log('No portfolios found via API - returning empty simulations');
      // Don't create demo data - return empty simulations
    } else {
      // Process real portfolios
      for (const portfolio of portfolios) {
        const simulationData = {
          months: parseInt(months)
        };
        
        try {
          const simulation = await rbcApi.simulatePortfolio(clientId, simulationData);
          simulations.push({
            portfolioId: portfolio.id,
            portfolioType: portfolio.type,
            currentValue: portfolio.current_value,
            projectedValue: simulation.results?.[0]?.projected_value || portfolio.current_value,
            projectedReturn: simulation.results?.[0]?.percentage_return || 0,
            growthTrend: simulation.results?.[0]?.growth_trend || []
          });
        } catch (error) {
          console.error(`Simulation failed for portfolio ${portfolio.id}:`, error.message);
          // Continue with other portfolios even if one fails
        }
      }
    }
    
    // Calculate overall portfolio performance
    const totalCurrentValue = simulations.reduce((sum, s) => sum + s.currentValue, 0);
    const totalProjectedValue = simulations.reduce((sum, s) => sum + s.projectedValue, 0);
    const overallReturn = totalCurrentValue > 0 ? ((totalProjectedValue - totalCurrentValue) / totalCurrentValue) * 100 : 0;
    
    res.json({
      success: true,
      simulations,
      summary: {
        totalPortfolios: simulations.length,
        totalCurrentValue,
        totalProjectedValue,
        overallReturn: Math.round(overallReturn * 100) / 100,
        simulationMonths: parseInt(months)
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to run comprehensive simulation',
      details: error.response?.data || error.message
    });
  }
});

// Helper functions for risk calculations
function calculateVolatility(monthlyReturns) {
  if (monthlyReturns.length < 2) return 0;
  
  const returns = monthlyReturns.map(r => r.return);
  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
  return Math.sqrt(variance);
}

function calculateSharpeRatio(monthlyReturns, riskFreeRate = 0.02) {
  if (monthlyReturns.length < 2) return 0;
  
  const returns = monthlyReturns.map(r => r.return);
  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const volatility = calculateVolatility(monthlyReturns);
  
  if (volatility === 0) return 0;
  
  return (mean - riskFreeRate / 12) / volatility;
}

function calculateMaxDrawdown(growthTrend) {
  if (growthTrend.length < 2) return 0;
  
  let maxValue = growthTrend[0].value;
  let maxDrawdown = 0;
  
  for (const point of growthTrend) {
    if (point.value > maxValue) {
      maxValue = point.value;
    }
    const drawdown = (maxValue - point.value) / maxValue;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }
  
  return maxDrawdown * 100; // Return as percentage
}

// Calculate trailing returns (1M, 3M, 6M, 1Y, 3Y, 5Y, YTD)
function calculateTrailingReturns(growthTrend) {
  if (growthTrend.length < 2) {
    return {
      "1M": "0.0%",
      "3M": "0.0%",
      "6M": "0.0%",
      "1Y": "0.0%",
      "3Y": "0.0%",
      "5Y": "0.0%",
      "YTD": "0.0%"
    };
  }

  const now = new Date();
  const currentValue = growthTrend[growthTrend.length - 1].value;
  
  const calculateReturn = (daysAgo) => {
    const targetDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    const targetPoint = growthTrend.find(point => new Date(point.date) <= targetDate);
    
    if (!targetPoint) return 0;
    
    return ((currentValue - targetPoint.value) / targetPoint.value) * 100;
  };

  return {
    "1M": `${calculateReturn(30).toFixed(1)}%`,
    "3M": `${calculateReturn(90).toFixed(1)}%`,
    "6M": `${calculateReturn(180).toFixed(1)}%`,
    "1Y": `${calculateReturn(365).toFixed(1)}%`,
    "3Y": `${calculateReturn(1095).toFixed(1)}%`,
    "5Y": `${calculateReturn(1825).toFixed(1)}%`,
    "YTD": `${calculateReturn(now.getDate() + (now.getMonth() * 30)).toFixed(1)}%`
  };
}

// Calculate calendar returns (2020-2024)
function calculateCalendarReturns(growthTrend) {
  if (growthTrend.length < 2) {
    return {
      "2020": "0.0%",
      "2021": "0.0%",
      "2022": "0.0%",
      "2023": "0.0%",
      "2024": "0.0%"
    };
  }

  const calendarReturns = {};
  const years = [2020, 2021, 2022, 2023, 2024];
  
  years.forEach(year => {
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31);
    
    const startPoint = growthTrend.find(point => new Date(point.date) >= yearStart);
    const endPoint = growthTrend.find(point => new Date(point.date) <= yearEnd);
    
    if (startPoint && endPoint) {
      const returnValue = ((endPoint.value - startPoint.value) / startPoint.value) * 100;
      calendarReturns[year.toString()] = `${returnValue.toFixed(1)}%`;
    } else {
      calendarReturns[year.toString()] = "0.0%";
    }
  });

  return calendarReturns;
}

// Generate demo growth trend data
function generateDemoGrowthTrend(startValue, endValue, months) {
  const growthTrend = [];
  const startDate = new Date();
  const monthlyGrowth = (endValue - startValue) / months;
  
  for (let i = 0; i <= months; i++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);
    
    // Add some realistic volatility
    const baseValue = startValue + (monthlyGrowth * i);
    const volatility = baseValue * 0.02 * (Math.random() - 0.5); // ±2% volatility
    const value = Math.max(baseValue + volatility, startValue * 0.8); // Don't go below 80% of start
    
    growthTrend.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value * 100) / 100
    });
  }
  
  return growthTrend;
}

// Deposit money to client cash balance
app.post('/api/clients/:clientId/deposit', async (req, res) => {
  try {
    const { clientId } = req.params
    const { amount } = req.body

    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: 'Invalid amount',
        details: 'Amount must be a positive number'
      })
    }

    // Use the actual RBC API deposit endpoint
    const result = await rbcApi.depositToClient(clientId, parseFloat(amount))

    res.json({
      success: true,
      message: `Successfully deposited $${amount} to client cash balance`,
      result
    })
  } catch (error) {
    console.error('Deposit error:', error)
    res.status(500).json({
      error: 'Failed to process deposit request',
      details: error.response?.data?.message || error.message
    })
  }
})

// Transfer funds from client cash to portfolio
app.post('/api/portfolios/:portfolioId/transfer', async (req, res) => {
  try {
    const { portfolioId } = req.params
    const { amount } = req.body

    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: 'Invalid amount',
        details: 'Amount must be a positive number'
      })
    }

    // Use the existing RBC API transfer method
    const transferData = {
      amount: parseFloat(amount)
    }

    const result = await rbcApi.transferFunds(portfolioId, transferData)

    res.json({
      success: true,
      message: `Successfully transferred $${amount} from client cash to portfolio`,
      result
    })
  } catch (error) {
    console.error('Transfer error:', error)
    res.status(500).json({
      error: 'Failed to transfer funds',
      details: error.response?.data?.message || error.message
    })
  }
})


// Start server
app.listen(config.port, () => {
  console.log(`🚀 GoalifyInvest API server running on port ${config.port}`);
  console.log(`📊 Team ID: ${config.teamId}`);
  console.log(`🔗 API Base URL: ${config.rbcApiBaseUrl}`);
});
