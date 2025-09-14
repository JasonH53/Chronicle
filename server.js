const express = require('express');
const cors = require('cors');
const axios = require('axios');
const config = require('./config');
const Cerebras = require('@cerebras/cerebras_cloud_sdk');

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

// Initialize Cerebras AI
const cerebras = new Cerebras({
  apiKey: config.CEREBRAS_API_KEY
});

// Routes

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Willow API!',
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
      addBalance: 'POST /api/clients/:clientId/add-balance',
      aiAgent: 'POST /api/ai-agent/chat'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Willow API is running',
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

// Get comprehensive portfolio analysis and performance data
app.get('/api/portfolios/:portfolioId/analysis', async (req, res) => {
  try {
    const { portfolioId } = req.params;
    
    const portfolio = await rbcApi.getPortfolio(portfolioId);
    
    // Calculate performance metrics
    const currentValue = portfolio.current_value || 0;
    const investedAmount = portfolio.invested_amount || 0;
    const totalReturn = currentValue - investedAmount;
    const returnPercentage = investedAmount > 0 ? (totalReturn / investedAmount) * 100 : 0;
    
    // Calculate growth trend - generate historical data if not provided by API
    let growthTrend = portfolio.growth_trend || [];
    
    // If no growth trend data from API, generate realistic historical data
    if (growthTrend.length < 2) {
      growthTrend = generateHistoricalGrowthTrend(currentValue, investedAmount, portfolio.type, 60, portfolioId);
    }
    
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
    
    // Generate comprehensive asset allocation based on portfolio type
    const assetAllocation = generateAssetAllocation(portfolio.type);
    
    // Calculate advanced risk metrics
    const advancedRiskMetrics = calculateAdvancedRiskMetrics(monthlyReturns, portfolio.type);
    
    // Generate benchmark comparison
    const benchmarkComparison = generateBenchmarkComparison(monthlyReturns, portfolio.type);
    
    // Calculate dividend and income analysis
    const dividendAnalysis = calculateDividendAnalysis(currentValue, portfolio.type);
    
    // Generate forward-looking projections
    const forwardProjections = generateForwardProjections(currentValue, portfolio.type, investedAmount);
    
    // Calculate performance attribution
    const performanceAttribution = calculatePerformanceAttribution(monthlyReturns, portfolio.type);
    
    // Generate sector exposure
    const sectorExposure = generateSectorExposure(portfolio.type);
    
    // Generate recommendations
    const recommendations = generateRecommendations(portfolio, returnPercentage, advancedRiskMetrics);
    
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
      
      // Enhanced risk metrics
      riskMetrics: {
        volatility: calculateVolatility(monthlyReturns),
        sharpeRatio: calculateSharpeRatio(monthlyReturns),
        maxDrawdown: calculateMaxDrawdown(growthTrend),
        ...advancedRiskMetrics
      },
      
      // Performance metrics
      performance: {
        bestMonth: monthlyReturns.length > 0 ? Math.max(...monthlyReturns.map(r => r.return)) : 0,
        worstMonth: monthlyReturns.length > 0 ? Math.min(...monthlyReturns.map(r => r.return)) : 0,
        averageMonthlyReturn: monthlyReturns.length > 0 ? 
          monthlyReturns.reduce((sum, r) => sum + r.return, 0) / monthlyReturns.length : 0
      },
      
      // New comprehensive analysis sections
      assetAllocation,
      benchmarkComparison,
      dividendAnalysis,
      forwardProjections,
      performanceAttribution,
      sectorExposure,
      recommendations,
      
      // Portfolio composition details
      composition: {
        portfolioType: portfolio.type,
        expenseRatio: getExpenseRatio(portfolio.type),
        minimumInvestment: 1000,
        rebalancingFrequency: 'Quarterly',
        taxEfficiency: getTaxEfficiency(portfolio.type)
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

// Run advanced comprehensive simulation for all client portfolios
app.post('/api/clients/:clientId/simulate-all', async (req, res) => {
  try {
    const { clientId } = req.params;
    const { 
      months = 12, 
      scenarios = ['bear', 'base', 'bull'],
      runMonteCarlo = true,
      stressTest = true,
      goalAmount,
      goalTimeframe = 120, // 10 years default
      portfolios: requestPortfolios = [] // Accept portfolio data from frontend
    } = req.body;
    
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
      portfolios = [];
    }
    
    // If no portfolios from RBC API, use portfolios from request body
    if (portfolios.length === 0 && requestPortfolios.length > 0) {
      console.log('Using portfolios from request body for enhanced simulation');
      // Convert frontend portfolio format to backend format
      portfolios = requestPortfolios.map(p => ({
        id: p.id,
        current_value: p.currentAmount || 0,
        type: p.portfolioType?.toLowerCase()?.replace(/ /g, '_') || 'balanced',
        invested_amount: p.currentAmount || 0,
        target_amount: p.targetAmount || 0,
        name: p.name
      }));
    }
    
    const simulations = [];
    
    // Process portfolios (either from RBC API or from request)
    if (portfolios.length > 0) {
      // Process portfolios with advanced simulations
      for (const portfolio of portfolios) {
        const currentValue = portfolio.current_value || 0;
        const portfolioType = portfolio.type || 'balanced';
        
        // Generate basic projection data (simulate RBC API response)
        const expectedReturn = months === 3 ? 0.025 : 0.10; // 2.5% for 3 months, 10% for 12 months
        const projectedValue = Math.max(currentValue * (1 + expectedReturn), currentValue + 1);
        const projectedReturn = currentValue > 0 ? ((projectedValue - currentValue) / currentValue) * 100 : expectedReturn * 100;
        
        // Generate mock growth trend
        const growthTrend = generateDemoGrowthTrend(currentValue, projectedValue, months);
        
        try {
          // Try to get RBC simulation if available, otherwise use mock data
          let rbcSimulation = null;
          try {
            if (clientId && clientId !== '' && !requestPortfolios.length) {
              const simulationData = { months: parseInt(months) };
              rbcSimulation = await rbcApi.simulatePortfolio(clientId, simulationData);
            }
          } catch (error) {
            console.log('RBC simulation failed, using mock data:', error.message);
          }
          
          // Generate advanced simulation results
          const scenarioResults = generateScenarioAnalysis(currentValue, portfolioType, months, scenarios);
          const monteCarloResults = runMonteCarlo ? runMonteCarloSimulation(currentValue, portfolioType, months) : null;
          const stressTestResults = stressTest ? runStressTests(currentValue, portfolioType, months) : null;
          const goalAnalysis = goalAmount ? analyzeGoalAchievement(currentValue, portfolioType, goalAmount, goalTimeframe) : null;
          const riskMetrics = calculateSimulationRiskMetrics(currentValue, portfolioType, months);
          const marketConditionImpact = analyzeMarketConditions(portfolioType, months);
          const rebalancingRecommendations = generateRebalancingRecommendations(portfolio);
          
          simulations.push({
            portfolioId: portfolio.id,
            portfolioType: portfolioType,
            currentValue: currentValue,
            projectedValue: rbcSimulation?.results?.[0]?.projected_value || projectedValue,
            projectedReturn: rbcSimulation?.results?.[0]?.percentage_return || projectedReturn,
            growthTrend: rbcSimulation?.results?.[0]?.growth_trend || growthTrend,
            
            // Enhanced simulation results
            scenarioAnalysis: scenarioResults,
            monteCarloSimulation: monteCarloResults,
            stressTestResults: stressTestResults,
            goalAnalysis: goalAnalysis,
            riskMetrics: riskMetrics,
            marketConditionImpact: marketConditionImpact,
            rebalancingRecommendations: rebalancingRecommendations,
            
            // Sensitivity analysis
            sensitivityAnalysis: performSensitivityAnalysis(currentValue, portfolioType, months),
            
            // Performance projections under different market conditions
            marketScenarios: generateMarketScenarios(currentValue, portfolioType, months),
            
            // Risk-return optimization suggestions
            optimizationSuggestions: generateOptimizationSuggestions(portfolio, riskMetrics)
          });
        } catch (error) {
          console.error(`Enhanced simulation failed for portfolio ${portfolio.id}:`, error.message);
          // Create basic simulation even if enhanced features fail
          simulations.push({
            portfolioId: portfolio.id,
            portfolioType: portfolioType,
            currentValue: currentValue,
            projectedValue: projectedValue,
            projectedReturn: projectedReturn,
            growthTrend: growthTrend
          });
        }
      }
    }
    
    // Calculate overall portfolio performance and analysis
    const totalCurrentValue = simulations.reduce((sum, s) => sum + s.currentValue, 0);
    const totalProjectedValue = simulations.reduce((sum, s) => sum + s.projectedValue, 0);
    const overallReturn = totalCurrentValue > 0 ? ((totalProjectedValue - totalCurrentValue) / totalCurrentValue) * 100 : 0;
    
    // Aggregate risk metrics across portfolios
    const aggregateRiskMetrics = aggregatePortfolioRisks(simulations);
    
    // Portfolio correlation analysis
    const correlationAnalysis = analyzePortfolioCorrelations(simulations);
    
    // Overall recommendations
    const overallRecommendations = generateOverallRecommendations(simulations, totalCurrentValue);
    
    res.json({
      success: true,
      simulations,
      summary: {
        totalPortfolios: simulations.length,
        totalCurrentValue,
        totalProjectedValue,
        overallReturn: Math.round(overallReturn * 100) / 100,
        simulationMonths: parseInt(months)
      },
      
      // Enhanced analytics
      aggregateAnalysis: {
        riskMetrics: aggregateRiskMetrics,
        correlationAnalysis: correlationAnalysis,
        diversificationScore: calculateDiversificationScore(simulations),
        expectedVolatility: calculateExpectedPortfolioVolatility(simulations),
        confidenceIntervals: calculateConfidenceIntervals(simulations)
      },
      
      // Strategic recommendations
      recommendations: overallRecommendations,
      
      // Market outlook and timing
      marketOutlook: generateMarketOutlook(months),
      
      // Tax implications
      taxImplications: analyzeTaxImplications(simulations, totalCurrentValue)
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
    
    // Find the closest data point to the target date (not just the first one that matches)
    let closestPoint = null;
    let closestDifference = Infinity;
    
    for (const point of growthTrend) {
      const pointDate = new Date(point.date);
      const difference = Math.abs(pointDate.getTime() - targetDate.getTime());
      
      // Only consider points that are on or before the target date
      if (pointDate <= targetDate && difference < closestDifference) {
        closestPoint = point;
        closestDifference = difference;
      }
    }
    
    if (!closestPoint || closestPoint.value <= 0) return 0;
    
    return ((currentValue - closestPoint.value) / closestPoint.value) * 100;
  };

  // Calculate YTD properly (from January 1st of current year)
  const calculateYTDReturn = () => {
    const yearStart = new Date(now.getFullYear(), 0, 1);
    
    let closestPoint = null;
    let closestDifference = Infinity;
    
    for (const point of growthTrend) {
      const pointDate = new Date(point.date);
      const difference = Math.abs(pointDate.getTime() - yearStart.getTime());
      
      if (pointDate <= yearStart && difference < closestDifference) {
        closestPoint = point;
        closestDifference = difference;
      }
    }
    
    if (!closestPoint || closestPoint.value <= 0) return 0;
    
    return ((currentValue - closestPoint.value) / closestPoint.value) * 100;
  };

  return {
    "1M": `${calculateReturn(30).toFixed(1)}%`,
    "3M": `${calculateReturn(90).toFixed(1)}%`,
    "6M": `${calculateReturn(180).toFixed(1)}%`,
    "1Y": `${calculateReturn(365).toFixed(1)}%`,
    "3Y": `${calculateReturn(1095).toFixed(1)}%`,
    "5Y": `${calculateReturn(1825).toFixed(1)}%`,
    "YTD": `${calculateYTDReturn().toFixed(1)}%`
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

// Generate demo growth trend data (forward-looking)
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

// Generate historical growth trend data for portfolio analysis
function generateHistoricalGrowthTrend(currentValue, investedAmount, portfolioType, monthsHistory = 60, portfolioId = 'default') {
  if (currentValue <= 0) {
    return [];
  }

  const growthTrend = [];
  const endDate = new Date();
  
  // Calculate expected annual returns based on portfolio type
  const expectedReturns = {
    'very_conservative': 0.04,  // 4% annual
    'conservative': 0.06,       // 6% annual
    'balanced': 0.08,          // 8% annual
    'growth': 0.10,            // 10% annual
    'aggressive_growth': 0.12   // 12% annual
  };
  
  const annualReturn = expectedReturns[portfolioType] || 0.08;
  const monthlyReturn = annualReturn / 12;
  
  // Create a simple deterministic "random" generator using portfolio ID as seed
  const seed = portfolioId.split('').reduce((acc, char, index) => acc + char.charCodeAt(0) * (index + 1), 0);
  let pseudoRandom = seed;
  const nextRandom = () => {
    pseudoRandom = (pseudoRandom * 9301 + 49297) % 233280;
    return pseudoRandom / 233280;
  };
  
  // Calculate starting value - work backwards from current value
  // Remove the growth that should have occurred over the time period
  const totalExpectedGrowth = Math.pow(1 + monthlyReturn, monthsHistory);
  let startValue = currentValue / totalExpectedGrowth;
  
  // Generate historical data points
  for (let i = monthsHistory; i >= 0; i--) {
    const date = new Date(endDate);
    date.setMonth(date.getMonth() - i);
    
    // Calculate value progression from start to current
    const monthsFromStart = monthsHistory - i;
    const baseGrowth = startValue * Math.pow(1 + monthlyReturn, monthsFromStart);
    
    // Add realistic market volatility (±10% annual volatility, more conservative)
    const annualVolatility = 0.10;
    const monthlyVolatility = annualVolatility / Math.sqrt(12);
    const randomFactor = 1 + (nextRandom() - 0.5) * 2 * monthlyVolatility;
    
    let value;
    if (i === 0) {
      // Always end at current value
      value = currentValue;
    } else {
      // Apply volatility but keep within reasonable bounds
      value = Math.max(baseGrowth * randomFactor, startValue * 0.7); // Don't go below 70% of start
      // Also don't go too much above the trend line
      value = Math.min(value, baseGrowth * 1.3); // Don't go above 130% of expected growth
    }
    
    growthTrend.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value * 100) / 100
    });
  }
  
  return growthTrend;
}

// Enhanced Portfolio Analysis Helper Functions

// Generate comprehensive asset allocation based on portfolio type
function generateAssetAllocation(portfolioType) {
  const allocations = {
    'very_conservative': {
      stocks: { domestic: 20, international: 10, emerging: 0 },
      bonds: { government: 40, corporate: 25, municipal: 5 },
      alternatives: { reit: 0, commodities: 0, cash: 0 }
    },
    'conservative': {
      stocks: { domestic: 30, international: 15, emerging: 5 },
      bonds: { government: 25, corporate: 20, municipal: 5 },
      alternatives: { reit: 0, commodities: 0, cash: 0 }
    },
    'balanced': {
      stocks: { domestic: 40, international: 20, emerging: 5 },
      bonds: { government: 15, corporate: 15, municipal: 5 },
      alternatives: { reit: 0, commodities: 0, cash: 0 }
    },
    'growth': {
      stocks: { domestic: 50, international: 25, emerging: 10 },
      bonds: { government: 8, corporate: 7, municipal: 0 },
      alternatives: { reit: 0, commodities: 0, cash: 0 }
    },
    'aggressive_growth': {
      stocks: { domestic: 55, international: 30, emerging: 15 },
      bonds: { government: 0, corporate: 0, municipal: 0 },
      alternatives: { reit: 0, commodities: 0, cash: 0 }
    }
  };

  const allocation = allocations[portfolioType] || allocations['balanced'];
  
  return {
    stocks: {
      total: allocation.stocks.domestic + allocation.stocks.international + allocation.stocks.emerging,
      breakdown: allocation.stocks
    },
    bonds: {
      total: allocation.bonds.government + allocation.bonds.corporate + allocation.bonds.municipal,
      breakdown: allocation.bonds
    },
    alternatives: {
      total: allocation.alternatives.reit + allocation.alternatives.commodities + allocation.alternatives.cash,
      breakdown: allocation.alternatives
    },
    summary: {
      equities: allocation.stocks.domestic + allocation.stocks.international + allocation.stocks.emerging,
      fixedIncome: allocation.bonds.government + allocation.bonds.corporate + allocation.bonds.municipal,
      alternatives: allocation.alternatives.reit + allocation.alternatives.commodities + allocation.alternatives.cash
    }
  };
}

// Calculate advanced risk metrics
function calculateAdvancedRiskMetrics(monthlyReturns, portfolioType) {
  if (monthlyReturns.length < 12) {
    return {
      beta: 1.0,
      alpha: 0,
      informationRatio: 0,
      sortinoRatio: 0,
      calmarRatio: 0,
      valueAtRisk95: 0,
      valueAtRisk99: 0,
      expectedShortfall: 0,
      trackingError: 0
    };
  }

  const returns = monthlyReturns.map(r => r.return / 100);
  const marketReturns = generateMarketReturns(returns.length); // S&P 500 proxy
  
  // Calculate beta (correlation with market)
  const beta = calculateBeta(returns, marketReturns);
  
  // Calculate alpha (excess return over expected return given beta)
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const avgMarketReturn = marketReturns.reduce((sum, r) => sum + r, 0) / marketReturns.length;
  const alpha = (avgReturn - (0.0001 + beta * (avgMarketReturn - 0.0001))) * 12; // Annualized
  
  // Calculate downside deviation (for Sortino ratio)
  const downsideReturns = returns.filter(r => r < 0);
  const downsideDeviation = downsideReturns.length > 0 ? 
    Math.sqrt(downsideReturns.reduce((sum, r) => sum + r * r, 0) / downsideReturns.length) : 0;
  
  const sortinoRatio = downsideDeviation > 0 ? (avgReturn * 12) / (downsideDeviation * Math.sqrt(12)) : 0;
  
  // Calculate Value at Risk (95% and 99% confidence)
  const sortedReturns = [...returns].sort((a, b) => a - b);
  const var95 = sortedReturns[Math.floor(sortedReturns.length * 0.05)] * Math.sqrt(12);
  const var99 = sortedReturns[Math.floor(sortedReturns.length * 0.01)] * Math.sqrt(12);
  
  // Expected Shortfall (average of returns below VaR)
  const belowVar95 = sortedReturns.slice(0, Math.floor(sortedReturns.length * 0.05));
  const expectedShortfall = belowVar95.length > 0 ? 
    (belowVar95.reduce((sum, r) => sum + r, 0) / belowVar95.length) * Math.sqrt(12) : 0;

  // Tracking error (vs benchmark)
  const excessReturns = returns.map((r, i) => r - marketReturns[i]);
  const trackingError = Math.sqrt(excessReturns.reduce((sum, r) => sum + r * r, 0) / excessReturns.length) * Math.sqrt(12);
  
  return {
    beta: Math.round(beta * 100) / 100,
    alpha: Math.round(alpha * 1000) / 10, // Basis points
    informationRatio: trackingError > 0 ? Math.round((alpha / trackingError) * 100) / 100 : 0,
    sortinoRatio: Math.round(sortinoRatio * 100) / 100,
    calmarRatio: Math.round((avgReturn * 12) / Math.abs(var99) * 100) / 100,
    valueAtRisk95: Math.round(var95 * 1000) / 10,
    valueAtRisk99: Math.round(var99 * 1000) / 10,
    expectedShortfall: Math.round(expectedShortfall * 1000) / 10,
    trackingError: Math.round(trackingError * 1000) / 10
  };
}

// Generate benchmark comparison
function generateBenchmarkComparison(monthlyReturns, portfolioType) {
  const benchmarks = {
    'S&P 500': { return: 10.5, volatility: 16.2, sharpe: 0.65 },
    'Total Bond Market': { return: 4.2, volatility: 3.8, sharpe: 1.11 },
    '60/40 Portfolio': { return: 8.1, volatility: 10.5, sharpe: 0.77 },
    'Target Date 2050': { return: 9.2, volatility: 14.1, sharpe: 0.65 }
  };

  const portfolioReturn = monthlyReturns.length > 0 ? 
    (monthlyReturns.reduce((sum, r) => sum + r.return, 0) / monthlyReturns.length) * 12 : 0;
  const portfolioVolatility = calculateVolatility(monthlyReturns) * Math.sqrt(12);
  const portfolioSharpe = calculateSharpeRatio(monthlyReturns);

  const comparisons = Object.entries(benchmarks).map(([name, benchmark]) => ({
    benchmark: name,
    portfolioReturn: Math.round(portfolioReturn * 100) / 100,
    benchmarkReturn: benchmark.return,
    excessReturn: Math.round((portfolioReturn - benchmark.return) * 100) / 100,
    portfolioVolatility: Math.round(portfolioVolatility * 100) / 100,
    benchmarkVolatility: benchmark.volatility,
    portfolioSharpe: Math.round(portfolioSharpe * 100) / 100,
    benchmarkSharpe: benchmark.sharpe,
    outperformance: portfolioReturn > benchmark.return
  }));

  return {
    comparisons,
    summary: {
      bestPerformingBenchmark: comparisons.reduce((best, curr) => 
        curr.benchmarkReturn > best.benchmarkReturn ? curr : best, comparisons[0]),
      portfolioRank: comparisons.filter(c => c.portfolioReturn > c.benchmarkReturn).length + 1,
      totalBenchmarks: comparisons.length
    }
  };
}

// Calculate dividend and income analysis
function calculateDividendAnalysis(currentValue, portfolioType) {
  const dividendYields = {
    'very_conservative': 3.2,
    'conservative': 2.8,
    'balanced': 2.1,
    'growth': 1.6,
    'aggressive_growth': 1.2
  };

  const yield = dividendYields[portfolioType] || 2.1;
  const annualDividend = currentValue * (yield / 100);
  const quarterlyDividend = annualDividend / 4;
  const monthlyDividend = annualDividend / 12;

  return {
    currentYield: yield,
    estimatedAnnualDividend: Math.round(annualDividend * 100) / 100,
    estimatedQuarterlyDividend: Math.round(quarterlyDividend * 100) / 100,
    estimatedMonthlyDividend: Math.round(monthlyDividend * 100) / 100,
    dividendGrowthRate: 5.2, // Historical average
    projectedYieldOnCost: {
      '5Year': Math.round((yield * Math.pow(1.052, 5)) * 100) / 100,
      '10Year': Math.round((yield * Math.pow(1.052, 10)) * 100) / 100,
      '20Year': Math.round((yield * Math.pow(1.052, 20)) * 100) / 100
    },
    reinvestmentImpact: {
      withReinvestment: Math.round((currentValue * Math.pow(1 + (yield / 100), 10)) * 100) / 100,
      withoutReinvestment: Math.round((currentValue + (annualDividend * 10)) * 100) / 100
    }
  };
}

// Generate forward-looking projections
function generateForwardProjections(currentValue, portfolioType, investedAmount) {
  const expectedReturns = {
    'very_conservative': 5.5,
    'conservative': 6.8,
    'balanced': 8.2,
    'growth': 9.5,
    'aggressive_growth': 11.2
  };

  const expectedReturn = expectedReturns[portfolioType] || 8.2;
  const standardDeviation = expectedReturn * 0.8; // Rough approximation

  const projections = {};
  const timeframes = [1, 3, 5, 10, 20, 30];
  
  timeframes.forEach(years => {
    const expectedValue = currentValue * Math.pow(1 + (expectedReturn / 100), years);
    const optimisticValue = currentValue * Math.pow(1 + ((expectedReturn + standardDeviation) / 100), years);
    const pessimisticValue = currentValue * Math.pow(1 + ((expectedReturn - standardDeviation) / 100), years);
    
    projections[`${years}Year`] = {
      expected: Math.round(expectedValue * 100) / 100,
      optimistic: Math.round(optimisticValue * 100) / 100,
      pessimistic: Math.round(pessimisticValue * 100) / 100,
      probabilityOfGrowth: 65 + (portfolioType === 'aggressive_growth' ? 15 : portfolioType === 'very_conservative' ? -15 : 0),
      annualizedReturn: expectedReturn
    };
  });

  return {
    expectedReturn: expectedReturn,
    standardDeviation: Math.round(standardDeviation * 100) / 100,
    projections,
    goalAchievement: {
      doubleInvestment: calculateTimeToDouble(expectedReturn),
      breakEven: investedAmount > currentValue ? 
        calculateTimeToBreakEven(currentValue, investedAmount, expectedReturn) : 0,
      retirementProjection: {
        ageBasedTarget: currentValue * 25, // 4% withdrawal rule
        timeToTarget: calculateTimeToTarget(currentValue, currentValue * 25, expectedReturn)
      }
    }
  };
}

// Calculate performance attribution
function calculatePerformanceAttribution(monthlyReturns, portfolioType) {
  if (monthlyReturns.length === 0) {
    return {
      assetAllocation: 0,
      securitySelection: 0,
      interaction: 0,
      total: 0
    };
  }

  const totalReturn = monthlyReturns.reduce((sum, r) => sum + r.return, 0);
  
  // Simplified attribution model
  const assetAllocationContribution = totalReturn * 0.85; // 85% from asset allocation
  const securitySelectionContribution = totalReturn * 0.12; // 12% from security selection
  const interactionEffect = totalReturn * 0.03; // 3% interaction

  return {
    assetAllocation: Math.round(assetAllocationContribution * 100) / 100,
    securitySelection: Math.round(securitySelectionContribution * 100) / 100,
    interaction: Math.round(interactionEffect * 100) / 100,
    total: Math.round(totalReturn * 100) / 100,
    breakdown: {
      equities: Math.round((totalReturn * 0.6) * 100) / 100,
      fixedIncome: Math.round((totalReturn * 0.25) * 100) / 100,
      alternatives: Math.round((totalReturn * 0.15) * 100) / 100
    }
  };
}

// Generate sector exposure
function generateSectorExposure(portfolioType) {
  const sectorAllocations = {
    'aggressive_growth': {
      'Technology': 25, 'Healthcare': 15, 'Financial Services': 12,
      'Consumer Discretionary': 10, 'Industrials': 8, 'Communication Services': 8,
      'Energy': 6, 'Materials': 4, 'Consumer Staples': 4, 'Utilities': 3, 'Real Estate': 5
    },
    'growth': {
      'Technology': 20, 'Healthcare': 14, 'Financial Services': 13,
      'Consumer Discretionary': 9, 'Industrials': 9, 'Communication Services': 7,
      'Energy': 7, 'Materials': 5, 'Consumer Staples': 6, 'Utilities': 4, 'Real Estate': 6
    },
    'balanced': {
      'Technology': 15, 'Healthcare': 12, 'Financial Services': 15,
      'Consumer Discretionary': 8, 'Industrials': 10, 'Communication Services': 6,
      'Energy': 8, 'Materials': 6, 'Consumer Staples': 7, 'Utilities': 6, 'Real Estate': 7
    },
    'conservative': {
      'Technology': 10, 'Healthcare': 11, 'Financial Services': 18,
      'Consumer Discretionary': 6, 'Industrials': 9, 'Communication Services': 5,
      'Energy': 9, 'Materials': 7, 'Consumer Staples': 9, 'Utilities': 8, 'Real Estate': 8
    },
    'very_conservative': {
      'Technology': 8, 'Healthcare': 10, 'Financial Services': 20,
      'Consumer Discretionary': 5, 'Industrials': 8, 'Communication Services': 4,
      'Energy': 8, 'Materials': 6, 'Consumer Staples': 12, 'Utilities': 12, 'Real Estate': 7
    }
  };

  const allocation = sectorAllocations[portfolioType] || sectorAllocations['balanced'];
  
  const sectors = Object.entries(allocation).map(([sector, percentage]) => ({
    sector,
    allocation: percentage,
    overweight: percentage > 10,
    risk: ['Technology', 'Energy', 'Consumer Discretionary'].includes(sector) ? 'High' :
          ['Healthcare', 'Industrials', 'Communication Services'].includes(sector) ? 'Medium' : 'Low'
  }));

  return {
    sectors,
    diversification: {
      herfindahlIndex: Math.round(sectors.reduce((sum, s) => sum + Math.pow(s.allocation / 100, 2), 0) * 10000) / 10000,
      topThreeConcentration: sectors.sort((a, b) => b.allocation - a.allocation)
        .slice(0, 3).reduce((sum, s) => sum + s.allocation, 0),
      sectorCount: sectors.length
    },
    cyclical: sectors.filter(s => ['Technology', 'Consumer Discretionary', 'Industrials', 'Materials'].includes(s.sector))
      .reduce((sum, s) => sum + s.allocation, 0),
    defensive: sectors.filter(s => ['Consumer Staples', 'Utilities', 'Healthcare'].includes(s.sector))
      .reduce((sum, s) => sum + s.allocation, 0)
  };
}

// Generate recommendations
function generateRecommendations(portfolio, returnPercentage, advancedRiskMetrics) {
  const recommendations = [];
  
  // Performance-based recommendations
  if (returnPercentage < 0) {
    recommendations.push({
      type: 'performance',
      severity: 'medium',
      title: 'Portfolio Underperforming',
      description: 'Your portfolio is currently showing negative returns. Consider reviewing your asset allocation.',
      action: 'Schedule a portfolio review to assess rebalancing opportunities.'
    });
  } else if (returnPercentage > 20) {
    recommendations.push({
      type: 'performance',
      severity: 'low',
      title: 'Strong Performance',
      description: 'Your portfolio is performing well. Consider rebalancing to lock in gains.',
      action: 'Review if current allocation still aligns with your risk tolerance.'
    });
  }
  
  // Risk-based recommendations
  if (advancedRiskMetrics.sharpeRatio < 0.5) {
    recommendations.push({
      type: 'risk',
      severity: 'medium',
      title: 'Risk-Adjusted Returns Could Improve',
      description: 'Your Sharpe ratio indicates room for improvement in risk-adjusted returns.',
      action: 'Consider diversifying across asset classes or reducing portfolio volatility.'
    });
  }
  
  if (advancedRiskMetrics.valueAtRisk95 < -15) {
    recommendations.push({
      type: 'risk',
      severity: 'high',
      title: 'High Downside Risk',
      description: 'Your portfolio has significant downside risk in adverse market conditions.',
      action: 'Consider adding defensive assets or reducing equity exposure.'
    });
  }
  
  // Rebalancing recommendation
  recommendations.push({
    type: 'maintenance',
    severity: 'low',
    title: 'Quarterly Rebalancing Due',
    description: 'Regular rebalancing helps maintain your target asset allocation.',
    action: 'Review and rebalance your portfolio to target allocations.'
  });
  
  // Tax optimization
  if (portfolio.current_value > 50000) {
    recommendations.push({
      type: 'tax',
      severity: 'low',
      title: 'Tax Optimization Opportunity',
      description: 'Consider tax-loss harvesting and optimizing asset location.',
      action: 'Consult with a tax advisor about tax-efficient investing strategies.'
    });
  }

  return {
    immediate: recommendations.filter(r => r.severity === 'high'),
    shortTerm: recommendations.filter(r => r.severity === 'medium'),
    longTerm: recommendations.filter(r => r.severity === 'low'),
    all: recommendations
  };
}

// Helper functions for calculations
function calculateBeta(portfolioReturns, marketReturns) {
  const n = Math.min(portfolioReturns.length, marketReturns.length);
  const portfolioMean = portfolioReturns.slice(0, n).reduce((sum, r) => sum + r, 0) / n;
  const marketMean = marketReturns.slice(0, n).reduce((sum, r) => sum + r, 0) / n;
  
  let covariance = 0;
  let marketVariance = 0;
  
  for (let i = 0; i < n; i++) {
    const portfolioDeviation = portfolioReturns[i] - portfolioMean;
    const marketDeviation = marketReturns[i] - marketMean;
    covariance += portfolioDeviation * marketDeviation;
    marketVariance += marketDeviation * marketDeviation;
  }
  
  covariance /= n;
  marketVariance /= n;
  
  return marketVariance > 0 ? covariance / marketVariance : 1.0;
}

function generateMarketReturns(length) {
  // Generate synthetic S&P 500 returns (monthly)
  const returns = [];
  for (let i = 0; i < length; i++) {
    // Mean reversion model with some randomness
    const baseReturn = 0.008; // ~10% annualized
    const volatility = 0.04; // ~16% annualized
    const randomComponent = (Math.random() - 0.5) * 2 * volatility;
    returns.push(baseReturn + randomComponent);
  }
  return returns;
}

function calculateTimeToDouble(returnRate) {
  return Math.log(2) / Math.log(1 + (returnRate / 100));
}

function calculateTimeToBreakEven(currentValue, investedAmount, returnRate) {
  if (currentValue >= investedAmount) return 0;
  return Math.log(investedAmount / currentValue) / Math.log(1 + (returnRate / 100));
}

function calculateTimeToTarget(currentValue, targetValue, returnRate) {
  return Math.log(targetValue / currentValue) / Math.log(1 + (returnRate / 100));
}

function getExpenseRatio(portfolioType) {
  const ratios = {
    'very_conservative': 0.15,
    'conservative': 0.18,
    'balanced': 0.22,
    'growth': 0.25,
    'aggressive_growth': 0.28
  };
  return ratios[portfolioType] || 0.22;
}

function getTaxEfficiency(portfolioType) {
  const efficiency = {
    'very_conservative': 85,
    'conservative': 82,
    'balanced': 78,
    'growth': 75,
    'aggressive_growth': 72
  };
  return efficiency[portfolioType] || 78;
}

// Enhanced Simulation Helper Functions

// Generate scenario analysis (bear, base, bull markets)
function generateScenarioAnalysis(currentValue, portfolioType, months, scenarios) {
  const marketConditions = {
    bear: { returnMultiplier: 0.6, volatilityMultiplier: 1.8 },
    base: { returnMultiplier: 1.0, volatilityMultiplier: 1.0 },
    bull: { returnMultiplier: 1.4, volatilityMultiplier: 0.8 }
  };

  const expectedReturns = {
    'very_conservative': 5.5,
    'conservative': 6.8,
    'balanced': 8.2,
    'growth': 9.5,
    'aggressive_growth': 11.2
  };

  const baseReturn = expectedReturns[portfolioType] || 8.2;
  
  return scenarios.map(scenario => {
    const condition = marketConditions[scenario];
    const adjustedReturn = (baseReturn * condition.returnMultiplier) / 100;
    const adjustedVolatility = (baseReturn * 0.8 * condition.volatilityMultiplier) / 100;
    
    const expectedValue = currentValue * Math.pow(1 + adjustedReturn, months / 12);
    const pessimisticValue = currentValue * Math.pow(1 + (adjustedReturn - adjustedVolatility), months / 12);
    const optimisticValue = currentValue * Math.pow(1 + (adjustedReturn + adjustedVolatility), months / 12);
    
    return {
      scenario,
      probability: scenario === 'base' ? 50 : scenario === 'bull' ? 25 : 25,
      projectedValue: Math.round(expectedValue * 100) / 100,
      pessimisticValue: Math.round(pessimisticValue * 100) / 100,
      optimisticValue: Math.round(optimisticValue * 100) / 100,
      expectedReturn: Math.round(adjustedReturn * 12 * 100) / 100,
      volatility: Math.round(adjustedVolatility * Math.sqrt(12) * 100) / 100,
      range: {
        low: Math.round(pessimisticValue * 100) / 100,
        high: Math.round(optimisticValue * 100) / 100
      }
    };
  });
}

// Run Monte Carlo simulation
function runMonteCarloSimulation(currentValue, portfolioType, months, simulations = 10000) {
  const expectedReturns = {
    'very_conservative': 5.5,
    'conservative': 6.8,
    'balanced': 8.2,
    'growth': 9.5,
    'aggressive_growth': 11.2
  };

  const baseReturn = (expectedReturns[portfolioType] || 8.2) / 100;
  const volatility = (baseReturn * 0.8); // Approximate volatility
  
  const results = [];
  
  for (let i = 0; i < simulations; i++) {
    let value = currentValue;
    
    for (let month = 0; month < months; month++) {
      const randomReturn = generateNormalRandom() * volatility + baseReturn / 12;
      value *= (1 + randomReturn);
    }
    
    results.push(value);
  }
  
  // Sort results for percentile calculations
  results.sort((a, b) => a - b);
  
  const percentile = (p) => results[Math.floor(results.length * p / 100)];
  
  return {
    simulations: simulations,
    results: {
      mean: Math.round((results.reduce((sum, r) => sum + r, 0) / results.length) * 100) / 100,
      median: Math.round(percentile(50) * 100) / 100,
      standardDeviation: Math.round(calculateArrayStandardDeviation(results) * 100) / 100,
      percentiles: {
        p5: Math.round(percentile(5) * 100) / 100,
        p10: Math.round(percentile(10) * 100) / 100,
        p25: Math.round(percentile(25) * 100) / 100,
        p75: Math.round(percentile(75) * 100) / 100,
        p90: Math.round(percentile(90) * 100) / 100,
        p95: Math.round(percentile(95) * 100) / 100
      },
      probabilityOfLoss: Math.round((results.filter(r => r < currentValue).length / results.length) * 100),
      probabilityOfGain: Math.round((results.filter(r => r > currentValue).length / results.length) * 100),
      worstCase: Math.round(Math.min(...results) * 100) / 100,
      bestCase: Math.round(Math.max(...results) * 100) / 100
    }
  };
}

// Run stress tests
function runStressTests(currentValue, portfolioType, months) {
  const stressScenarios = {
    '2008_financial_crisis': { equityDrop: -37, bondDrop: -5 },
    'covid_crash_2020': { equityDrop: -34, bondDrop: 8 },
    'dotcom_bubble_2000': { equityDrop: -49, bondDrop: 17 },
    'inflation_spike': { equityDrop: -12, bondDrop: -15 },
    'recession': { equityDrop: -25, bondDrop: 2 },
    'market_correction': { equityDrop: -15, bondDrop: 1 }
  };

  const allocation = generateAssetAllocation(portfolioType);
  const equityWeight = allocation.summary.equities / 100;
  const bondWeight = allocation.summary.fixedIncome / 100;
  
  const stressResults = Object.entries(stressScenarios).map(([scenario, impact]) => {
    const portfolioImpact = (equityWeight * impact.equityDrop) + (bondWeight * impact.bondDrop);
    const stressedValue = currentValue * (1 + portfolioImpact / 100);
    const recoveryTime = Math.abs(portfolioImpact) / 8; // Rough estimate: 8% recovery per year
    
    return {
      scenario: scenario.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      impact: Math.round(portfolioImpact * 100) / 100,
      stressedValue: Math.round(stressedValue * 100) / 100,
      valueAtRisk: Math.round((currentValue - stressedValue) * 100) / 100,
      estimatedRecoveryMonths: Math.round(recoveryTime * 12),
      severity: Math.abs(portfolioImpact) > 30 ? 'High' : Math.abs(portfolioImpact) > 15 ? 'Medium' : 'Low'
    };
  });

  return {
    scenarios: stressResults,
    summary: {
      worstCaseScenario: stressResults.reduce((worst, curr) => 
        curr.impact < worst.impact ? curr : worst, stressResults[0]),
      averageImpact: Math.round(stressResults.reduce((sum, s) => sum + s.impact, 0) / stressResults.length * 100) / 100,
      maxValueAtRisk: Math.max(...stressResults.map(s => s.valueAtRisk)),
      resilience: stressResults.filter(s => s.severity === 'Low').length / stressResults.length
    }
  };
}

// Analyze goal achievement probability
function analyzeGoalAchievement(currentValue, portfolioType, goalAmount, goalTimeframeMonths) {
  const expectedReturns = {
    'very_conservative': 5.5,
    'conservative': 6.8,
    'balanced': 8.2,
    'growth': 9.5,
    'aggressive_growth': 11.2
  };

  const expectedReturn = (expectedReturns[portfolioType] || 8.2) / 100;
  const volatility = expectedReturn * 0.8;
  
  // Calculate required return to reach goal
  const requiredReturn = Math.pow(goalAmount / currentValue, 12 / goalTimeframeMonths) - 1;
  
  // Monte Carlo simulation for goal achievement
  const simulations = 5000;
  let successfulOutcomes = 0;
  
  for (let i = 0; i < simulations; i++) {
    const simulatedReturn = generateNormalRandom() * volatility + expectedReturn;
    const finalValue = currentValue * Math.pow(1 + simulatedReturn, goalTimeframeMonths / 12);
    if (finalValue >= goalAmount) successfulOutcomes++;
  }
  
  const probabilityOfSuccess = Math.round((successfulOutcomes / simulations) * 100);
  
  // Calculate additional monthly contribution needed
  const monthlyReturnNeeded = expectedReturn / 12;
  const futureValueFactor = Math.pow(1 + monthlyReturnNeeded, goalTimeframeMonths);
  const annuityFactor = (futureValueFactor - 1) / monthlyReturnNeeded;
  
  const currentProjectedValue = currentValue * futureValueFactor;
  const shortfall = Math.max(0, goalAmount - currentProjectedValue);
  const monthlyContributionNeeded = shortfall / annuityFactor;
  
  return {
    goalAmount,
    currentValue,
    timeframeMonths: goalTimeframeMonths,
    timeframeYears: Math.round(goalTimeframeMonths / 12 * 10) / 10,
    requiredReturn: Math.round(requiredReturn * 100 * 100) / 100,
    probabilityOfSuccess,
    confidence: probabilityOfSuccess >= 80 ? 'High' : probabilityOfSuccess >= 60 ? 'Medium' : 'Low',
    projectedValueAtGoal: Math.round(currentProjectedValue * 100) / 100,
    shortfall: Math.round(shortfall * 100) / 100,
    monthlyContributionNeeded: Math.round(Math.max(0, monthlyContributionNeeded) * 100) / 100,
    alternativeTimeframes: {
      withCurrentSavings: Math.round(Math.log(goalAmount / currentValue) / Math.log(1 + expectedReturn) * 12),
      to80PercentProbability: Math.round(goalTimeframeMonths * 1.2),
      to90PercentProbability: Math.round(goalTimeframeMonths * 1.4)
    }
  };
}

// Calculate simulation-specific risk metrics
function calculateSimulationRiskMetrics(currentValue, portfolioType, months) {
  const expectedReturns = {
    'very_conservative': 5.5,
    'conservative': 6.8,
    'balanced': 8.2,
    'growth': 9.5,
    'aggressive_growth': 11.2
  };

  const expectedReturn = (expectedReturns[portfolioType] || 8.2) / 100;
  const volatility = expectedReturn * 0.8;
  
  // Simulate monthly returns
  const monthlyReturns = [];
  for (let i = 0; i < months; i++) {
    monthlyReturns.push((generateNormalRandom() * volatility + expectedReturn) / Math.sqrt(12));
  }
  
  return {
    expectedVolatility: Math.round(volatility * Math.sqrt(12) * 100 * 100) / 100,
    downsideVolatility: Math.round(calculateDownsideVolatility(monthlyReturns) * 100 * 100) / 100,
    probabilityOfLoss: Math.round((1 - normalCDF(expectedReturn / volatility)) * 100),
    expectedDrawdown: Math.round(volatility * Math.sqrt(Math.PI / 2) * 100 * 100) / 100,
    riskAdjustedReturn: Math.round((expectedReturn / volatility) * 100) / 100,
    conditionalVaR: Math.round(currentValue * volatility * 2.33 * 100) / 100 // 99% CVaR
  };
}

// Analyze market conditions impact
function analyzeMarketConditions(portfolioType, months) {
  const marketFactors = {
    interestRates: {
      current: 5.25,
      trend: 'stable',
      impact: portfolioType.includes('conservative') ? 'high' : 'medium'
    },
    inflation: {
      current: 3.2,
      trend: 'declining',
      impact: 'medium'
    },
    economicGrowth: {
      current: 'moderate',
      outlook: 'positive',
      impact: portfolioType === 'aggressive_growth' ? 'high' : 'medium'
    },
    marketValuation: {
      level: 'elevated',
      trend: 'stable',
      impact: 'medium'
    }
  };

  return {
    factors: marketFactors,
    overallSentiment: 'cautiously_optimistic',
    keyRisks: [
      'Interest rate volatility',
      'Geopolitical tensions',
      'Inflation persistence'
    ],
    opportunities: [
      'Technological innovation',
      'Emerging market growth',
      'Energy transition'
    ],
    timeframe: months <= 12 ? 'short_term' : 'long_term',
    recommendation: 'maintain_course_with_monitoring'
  };
}

// Generate rebalancing recommendations
function generateRebalancingRecommendations(portfolio) {
  const currentType = portfolio.type;
  const currentValue = portfolio.current_value;
  
  return {
    frequency: 'quarterly',
    nextRebalanceDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    deviationThreshold: 5, // percent
    recommendations: [
      {
        action: 'review_allocation',
        priority: 'medium',
        description: 'Review current asset allocation against target'
      },
      {
        action: 'tax_loss_harvest',
        priority: currentValue > 50000 ? 'medium' : 'low',
        description: 'Consider tax-loss harvesting opportunities'
      },
      {
        action: 'cash_deployment',
        priority: 'low',
        description: 'Deploy any excess cash according to target allocation'
      }
    ],
    estimatedCosts: {
      transactionFees: Math.round(currentValue * 0.001 * 100) / 100,
      taxImpact: Math.round(currentValue * 0.005 * 100) / 100,
      totalCost: Math.round(currentValue * 0.006 * 100) / 100
    }
  };
}

// Perform sensitivity analysis
function performSensitivityAnalysis(currentValue, portfolioType, months) {
  const baseReturn = 8.2; // Base return assumption
  const scenarios = [
    { name: 'Return +2%', returnAdjustment: 2 },
    { name: 'Return +1%', returnAdjustment: 1 },
    { name: 'Base Case', returnAdjustment: 0 },
    { name: 'Return -1%', returnAdjustment: -1 },
    { name: 'Return -2%', returnAdjustment: -2 }
  ];

  return scenarios.map(scenario => {
    const adjustedReturn = (baseReturn + scenario.returnAdjustment) / 100;
    const projectedValue = currentValue * Math.pow(1 + adjustedReturn, months / 12);
    const totalReturn = ((projectedValue - currentValue) / currentValue) * 100;
    
    return {
      scenario: scenario.name,
      returnAssumption: baseReturn + scenario.returnAdjustment,
      projectedValue: Math.round(projectedValue * 100) / 100,
      totalReturn: Math.round(totalReturn * 100) / 100,
      sensitivity: Math.round((scenario.returnAdjustment * months / 12) * 100) / 100
    };
  });
}

// Generate market scenarios
function generateMarketScenarios(currentValue, portfolioType, months) {
  const scenarios = {
    recession: { equityReturn: -15, bondReturn: 5, probability: 15 },
    stagflation: { equityReturn: -8, bondReturn: -5, probability: 10 },
    normal_growth: { equityReturn: 10, bondReturn: 4, probability: 50 },
    strong_growth: { equityReturn: 18, bondReturn: 2, probability: 20 },
    bubble: { equityReturn: 25, bondReturn: -2, probability: 5 }
  };

  const allocation = generateAssetAllocation(portfolioType);
  const equityWeight = allocation.summary.equities / 100;
  const bondWeight = allocation.summary.fixedIncome / 100;

  return Object.entries(scenarios).map(([name, scenario]) => {
    const portfolioReturn = (equityWeight * scenario.equityReturn + bondWeight * scenario.bondReturn) / 100;
    const projectedValue = currentValue * Math.pow(1 + portfolioReturn, months / 12);
    
    return {
      scenario: name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      probability: scenario.probability,
      portfolioReturn: Math.round(portfolioReturn * 100 * 100) / 100,
      projectedValue: Math.round(projectedValue * 100) / 100,
      impact: Math.round(((projectedValue - currentValue) / currentValue) * 100 * 100) / 100
    };
  });
}

// Generate optimization suggestions
function generateOptimizationSuggestions(portfolio, riskMetrics) {
  const suggestions = [];
  
  if (riskMetrics.expectedVolatility > 20) {
    suggestions.push({
      type: 'risk_reduction',
      suggestion: 'Consider reducing portfolio volatility by increasing bond allocation',
      impact: 'Lower volatility by 2-4%',
      tradeoff: 'Reduced expected returns'
    });
  }
  
  if (riskMetrics.probabilityOfLoss > 40) {
    suggestions.push({
      type: 'downside_protection',
      suggestion: 'Add defensive assets to reduce downside risk',
      impact: 'Reduce probability of loss',
      tradeoff: 'Lower upside potential'
    });
  }
  
  suggestions.push({
    type: 'diversification',
    suggestion: 'Consider international diversification',
    impact: 'Improved risk-adjusted returns',
    tradeoff: 'Currency risk exposure'
  });

  return suggestions;
}

// Aggregate portfolio risks
function aggregatePortfolioRisks(simulations) {
  if (simulations.length === 0) return {};
  
  const totalValue = simulations.reduce((sum, s) => sum + s.currentValue, 0);
  const weights = simulations.map(s => s.currentValue / totalValue);
  
  const aggregateVolatility = Math.sqrt(
    simulations.reduce((sum, s, i) => 
      sum + Math.pow(weights[i] * (s.riskMetrics?.expectedVolatility || 15), 2), 0)
  );
  
  return {
    aggregateVolatility: Math.round(aggregateVolatility * 100) / 100,
    averageExpectedReturn: Math.round(
      simulations.reduce((sum, s, i) => sum + weights[i] * 8, 0) * 100
    ) / 100,
    correlationBenefit: Math.round((20 - aggregateVolatility) * 100) / 100,
    diversificationRatio: Math.round((20 / Math.max(aggregateVolatility, 0.1)) * 100) / 100
  };
}

// Analyze portfolio correlations
function analyzePortfolioCorrelations(simulations) {
  if (simulations.length < 2) return { correlation: 0, diversificationBenefit: 'N/A' };
  
  // Simplified correlation calculation
  const avgCorrelation = 0.75; // Typical cross-asset correlation
  
  return {
    averageCorrelation: avgCorrelation,
    diversificationBenefit: avgCorrelation < 0.8 ? 'Good' : 'Limited',
    recommendation: avgCorrelation > 0.85 ? 
      'Consider adding uncorrelated assets' : 
      'Current diversification is adequate'
  };
}

// Generate overall recommendations
function generateOverallRecommendations(simulations, totalValue) {
  const recommendations = [];
  
  if (simulations.length === 1) {
    recommendations.push({
      type: 'diversification',
      priority: 'high',
      title: 'Consider Additional Portfolio Diversification',
      description: 'Having only one portfolio may increase concentration risk'
    });
  }
  
  if (totalValue > 100000) {
    recommendations.push({
      type: 'tax_optimization',
      priority: 'medium',
      title: 'Tax Optimization Strategies',
      description: 'Consider tax-loss harvesting and asset location strategies'
    });
  }
  
  recommendations.push({
    type: 'review',
    priority: 'low',
    title: 'Regular Portfolio Review',
    description: 'Schedule quarterly reviews to ensure alignment with goals'
  });

  return recommendations;
}

// Calculate diversification score
function calculateDiversificationScore(simulations) {
  if (simulations.length === 0) return 0;
  
  const portfolioTypes = [...new Set(simulations.map(s => s.portfolioType))];
  const baseScore = Math.min(portfolioTypes.length * 20, 80);
  
  // Bonus for having both growth and conservative portfolios
  const hasBalance = simulations.some(s => s.portfolioType.includes('conservative')) &&
                   simulations.some(s => s.portfolioType.includes('growth'));
  
  return Math.min(baseScore + (hasBalance ? 20 : 0), 100);
}

// Calculate expected portfolio volatility
function calculateExpectedPortfolioVolatility(simulations) {
  if (simulations.length === 0) return 0;
  
  const totalValue = simulations.reduce((sum, s) => sum + s.currentValue, 0);
  
  return Math.round(
    simulations.reduce((sum, s) => 
      sum + (s.currentValue / totalValue) * (s.riskMetrics?.expectedVolatility || 15), 0
    ) * 100
  ) / 100;
}

// Calculate confidence intervals
function calculateConfidenceIntervals(simulations) {
  if (simulations.length === 0) return {};
  
  const totalCurrentValue = simulations.reduce((sum, s) => sum + s.currentValue, 0);
  const totalProjectedValue = simulations.reduce((sum, s) => sum + s.projectedValue, 0);
  const avgVolatility = calculateExpectedPortfolioVolatility(simulations) / 100;
  
  const confidenceLevel = 1.96; // 95% confidence
  const margin = totalProjectedValue * avgVolatility * confidenceLevel;
  
  return {
    confidence95: {
      lower: Math.round((totalProjectedValue - margin) * 100) / 100,
      upper: Math.round((totalProjectedValue + margin) * 100) / 100
    },
    confidenceLevel: 95,
    margin: Math.round(margin * 100) / 100
  };
}

// Generate market outlook
function generateMarketOutlook(months) {
  const timeframe = months <= 12 ? 'near_term' : 'longer_term';
  
  return {
    timeframe,
    outlook: 'cautiously_optimistic',
    keyThemes: [
      'Central bank policy normalization',
      'AI and technology advancement', 
      'Energy transition acceleration',
      'Geopolitical tensions'
    ],
    risks: [
      'Inflation persistence',
      'Interest rate volatility',
      'Supply chain disruptions'
    ],
    opportunities: [
      'Emerging market growth',
      'Healthcare innovation',
      'Renewable energy expansion'
    ],
    recommendation: timeframe === 'near_term' ? 
      'Stay diversified with defensive positioning' :
      'Focus on quality growth with global diversification'
  };
}

// Analyze tax implications
function analyzeTaxImplications(simulations, totalValue) {
  const taxEfficiencyScore = simulations.reduce((sum, s) => 
    sum + getTaxEfficiency(s.portfolioType) * (s.currentValue / totalValue), 0
  );
  
  return {
    averageTaxEfficiency: Math.round(taxEfficiencyScore),
    estimatedTaxDrag: Math.round((100 - taxEfficiencyScore) * 0.3) / 10, // Simplified calculation
    recommendations: [
      totalValue > 50000 ? 'Consider tax-loss harvesting' : 'Build tax-advantaged accounts first',
      'Optimize asset location between taxable and tax-advantaged accounts',
      'Consider tax-efficient fund options'
    ],
    taxLossHarvestingPotential: totalValue > 50000 ? 'High' : 'Low'
  };
}

// Helper functions for advanced calculations
function generateNormalRandom() {
  // Box-Muller transformation for normal distribution
  let u1 = Math.random();
  let u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function calculateArrayStandardDeviation(arr) {
  const mean = arr.reduce((sum, val) => sum + val, 0) / arr.length;
  const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
  return Math.sqrt(variance);
}

function calculateDownsideVolatility(returns) {
  const negativeReturns = returns.filter(r => r < 0);
  if (negativeReturns.length === 0) return 0;
  return Math.sqrt(negativeReturns.reduce((sum, r) => sum + r * r, 0) / negativeReturns.length);
}

function normalCDF(x) {
  // Approximation of the cumulative distribution function for standard normal distribution
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  let prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (x > 0) prob = 1 - prob;
  return prob;
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

// AI Agent Chat Endpoint
app.post('/api/ai-agent/chat', async (req, res) => {
  try {
    const { userData, goals, message, files } = req.body;

    // AI Agent with API tool access
    const aiResponse = await processAIRequest({
      userData,
      goals,
      message,
      files,
      rbcApi // Pass RBC API instance for tool access
    });

    // Convert tool calls to action buttons
    const actionButtons = convertToolCallsToActionButtons(aiResponse.tool_calls || []);

    res.json({
      success: true,
      content: aiResponse.content,
      portfolioData: aiResponse.portfolioData,
      actionButtons: actionButtons
    });
  } catch (error) {
    console.error('AI Agent error:', error);
    res.status(500).json({
      error: 'Failed to process AI request',
      details: error.message
    });
  }
});

// AI Agent Processing Function with Cerebras AI
async function processAIRequest({ userData, goals, message, files, rbcApi }) {
  try {
    // Analyze the user's request and determine what data/tools are needed
    const requestAnalysis = analyzeUserRequest(message, goals);
    
    let portfolioData = null;
    let contextData = '';

    // Gather portfolio data if needed
    if (requestAnalysis.needsPortfolioData && userData?.clientId) {
      try {
        // Get client information
        const clientInfo = await rbcApi.getClient(userData.clientId);
        
        // Get all portfolios for the client
        let portfolios = [];
        try {
          portfolios = await rbcApi.getClientPortfolios(userData.clientId);
        } catch (error) {
          console.log('Using local portfolio data as fallback');
          portfolios = goals.map(goal => ({
            id: goal.portfolioId || goal.id,
            type: goal.portfolioType?.toLowerCase()?.replace(/ /g, '_') || 'balanced',
            current_value: goal.currentAmount || 0,
            target_amount: goal.targetAmount || 0,
            name: goal.name
          }));
        }

        portfolioData = {
          client: clientInfo,
          portfolios: portfolios,
          totalValue: portfolios.reduce((sum, p) => sum + (p.current_value || 0), 0),
          totalTarget: portfolios.reduce((sum, p) => sum + (p.target_amount || 0), 0)
        };

        // Prepare context for AI
        contextData = `
PORTFOLIO DATA:
- Total Portfolio Value: $${portfolioData.totalValue.toLocaleString()}
- Total Target Value: $${portfolioData.totalTarget.toLocaleString()}
- Available Cash: $${(clientInfo.cash || 0).toLocaleString()}
- Number of Goals: ${goals.length}

INDIVIDUAL GOALS:
${goals.map(goal => `
- ${goal.name}: $${goal.currentAmount.toLocaleString()} / $${goal.targetAmount.toLocaleString()} (${((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)}% complete)
  Portfolio Type: ${goal.portfolioType}
  Target Date: ${goal.targetDate}
`).join('')}

PORTFOLIOS:
${portfolios.map(portfolio => `
- Portfolio ID: ${portfolio.id}
- Type: ${portfolio.type}
- Current Value: $${(portfolio.current_value || 0).toLocaleString()}
- Target Amount: $${(portfolio.target_amount || 0).toLocaleString()}
`).join('')}
        `;
        
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
        contextData = `
PORTFOLIO DATA (LOCAL):
- Number of Goals: ${goals.length}
- Goals: ${goals.map(g => `${g.name} (${g.portfolioType}): $${g.currentAmount.toLocaleString()} / $${g.targetAmount.toLocaleString()}`).join(', ')}
        `;
      }
    }

    // Prepare file context if files are uploaded
    let fileContext = '';
    if (files && files.length > 0) {
      fileContext = `
UPLOADED FILES:
${files.map(file => `
- File: ${file.name}
- Type: ${file.type}
- Content Preview: ${file.content ? file.content.substring(0, 500) + '...' : 'No content available'}
`).join('')}
      `;
    }

    // Generate AI response using Cerebras
    const aiResponse = await generateAIResponse(message, contextData, fileContext, requestAnalysis, userData, goals);

    return {
      content: aiResponse.content,
      portfolioData: portfolioData,
      tool_calls: aiResponse.tool_calls || []
    };

  } catch (error) {
    console.error('Error in AI processing:', error);
    return {
      content: "I apologize, but I encountered an error while analyzing your request. Please try rephrasing your question or contact support if the issue persists.",
      portfolioData: null,
      tool_calls: []
    };
  }
}

// Convert AI tool calls to frontend action buttons
function convertToolCallsToActionButtons(toolCalls) {
  const actionButtons = [];

  toolCalls.forEach((toolCall, index) => {
    const { function: func } = toolCall;
    const args = JSON.parse(func.arguments || '{}');

    switch (func.name) {
      case 'suggest_create_goal':
        actionButtons.push({
          id: `create-goal-${index}`,
          label: args.suggested_name ? `Create "${args.suggested_name}" Goal` : 'Create Investment Goal',
          action: 'create_goal',
          data: {
            reason: args.reason,
            suggested_name: args.suggested_name,
            estimated_amount: args.estimated_amount
          }
        });
        break;

      case 'suggest_portfolio_analysis':
        actionButtons.push({
          id: `analysis-${index}`,
          label: `Run ${args.analysis_type.charAt(0).toUpperCase() + args.analysis_type.slice(1)} Analysis`,
          action: 'portfolio_analysis',
          data: {
            analysis_type: args.analysis_type,
            reason: args.reason
          }
        });
        break;

      case 'suggest_simulation':
        actionButtons.push({
          id: `simulation-${index}`,
          label: `Run ${args.scenario_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Simulation`,
          action: 'simulate',
          data: {
            scenario_type: args.scenario_type,
            reason: args.reason
          }
        });
        break;

      case 'suggest_add_funds':
        actionButtons.push({
          id: `add-funds-${index}`,
          label: args.suggested_amount ? `Add $${args.suggested_amount.toLocaleString()}` : 'Add Funds',
          action: 'add_funds',
          data: {
            reason: args.reason,
            suggested_amount: args.suggested_amount
          }
        });
        break;

      default:
        console.log(`Unknown tool call: ${func.name}`);
    }
  });

  return actionButtons;
}

// Generate AI response using Cerebras
async function generateAIResponse(userMessage, portfolioContext, fileContext, requestAnalysis, userData, goals) {
  try {
    const systemPrompt = `# GoalifyInvest — AI Financial Coach (Student-Focused)

## Role
You are GoalifyInvest’s **AI Financial Advisor**. Use the user’s portfolio data and uploaded financial documents to deliver **concise, actionable guidance** for students.

## Data You Can Use
- **User**
${userData ? `
  - Name: ${userData.name}
  - Email: ${userData.email}
  - Starting Balance: \`${userData.startingBalance}\`
  - Client ID: ${userData.clientId || 'Not available'}
  - Currency: \`${userData.currency || 'CAD'}\`
  - Locale: \`${userData.locale || 'en-CA'}\`` : '  - No user data available'}
- **Portfolio**
${portfolioContext || '  - No portfolio data available'}
- **Files**
${fileContext || '  - No files uploaded'}
- **Goals**
${(Array.isArray(goals) && goals.length) ? '  - Provided goals context available' : '  - No goals set'}
- **Request**
  - Type: \`${requestAnalysis?.type || 'unknown'}\`
  - Intent: \`${requestAnalysis?.intent || 'unknown'}\`

## Capabilities
- Portfolio performance & attribution
- Risk assessment (volatility, drawdown, diversification)
- Goal planning & funding gap analysis
- Document parsing (statements, loan docs, fee schedules)
- Strategy design (asset mix, contributions, rebalancing)
- Market context (summarized; no certainties)

## Available Tools (Use When Appropriate)
- **suggest_create_goal**: When user expresses interest in investing for a specific purpose (vacation, car, house, etc.)
- **suggest_portfolio_analysis**: When user has existing goals but wants deeper performance/risk insights
- **suggest_simulation**: When discussing future scenarios, "what-if" questions, or goal projections
- **suggest_add_funds**: When user mentions having money to invest or goals being underfunded

**Tool Usage Guidelines:**
- Use tools when the conversation naturally leads to actionable next steps
- Don't use tools for general questions or educational content
- Multiple tools can be used in a single response if appropriate
- Always provide helpful content even when using tools

## Guardrails
- Do **not** invent data. If missing, make a **brief, conservative** assumption and label it.
- Not legal/tax advice. Use ranges and scenarios; avoid guarantees.

## Tone
Professional, friendly, student-aware, **plain-English**.

## Formatting (CRITICAL)
- **Markdown only** with clear headers: \`##\`, \`###\`
- **Bold** key points and **key numbers**
- Bullets for recommendations; numbered steps for how-tos
- Use \`backticks\` for exact figures: \`$amount\`, \`X%\`, \`MER\`
- Tables only when comparing \`3+\` items
- Blockquotes \`>\` for tips/warnings
- Emojis sparingly (📈 💰 🎯 ⚠️ ✅)

## Math & Units
- Percentages to **1 decimal place**; money to **2 decimals** in user \`currency\`.
- Show only the **key** calc step when helpful.

## Output Blueprint (Compact)
1) **Summary (2 bullets max)** — what you did + main result.  
2) **What I Used** — specific data/files referenced.  
3) **Recommendations (max 3–5 bullets)** — allocation targets in \`%\`, contributions in \`$\`, rebalancing rule, fee fixes.  
4) **Next Steps (Checklist, 3–4 items)** — immediate, concrete actions.  
5) **Risks & Assumptions (1–2 lines)** — major what-ifs + any assumptions.

## Brevity Rules (Important)
- Default to **<= 200–230 words**.  
- Omit sections that don’t add value to the current question.  
- Ask **at most one** clarifying question **only if blocking**.

Respond to the user’s message now.`;

    // Define available tools for the AI agent
    const tools = [
      {
        type: "function",
        function: {
          name: "suggest_create_goal",
          description: "Suggest creating a new investment goal when user expresses interest in investing for a specific purpose",
          parameters: {
            type: "object",
            properties: {
              reason: {
                type: "string",
                description: "Why this goal would be beneficial for the user"
              },
              suggested_name: {
                type: "string",
                description: "Suggested name for the goal (optional)"
              },
              estimated_amount: {
                type: "number",
                description: "Estimated target amount if mentioned (optional)"
              }
            },
            required: ["reason"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "suggest_portfolio_analysis",
          description: "Suggest portfolio analysis when user has goals but wants deeper insights",
          parameters: {
            type: "object",
            properties: {
              analysis_type: {
                type: "string",
                enum: ["performance", "risk", "allocation", "comprehensive"],
                description: "Type of analysis to suggest"
              },
              reason: {
                type: "string",
                description: "Why this analysis would be helpful"
              }
            },
            required: ["analysis_type", "reason"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "suggest_simulation",
          description: "Suggest running portfolio simulations for scenario planning",
          parameters: {
            type: "object",
            properties: {
              scenario_type: {
                type: "string",
                enum: ["monte_carlo", "stress_test", "goal_projection"],
                description: "Type of simulation to suggest"
              },
              reason: {
                type: "string",
                description: "Why this simulation would be valuable"
              }
            },
            required: ["scenario_type", "reason"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "suggest_add_funds",
          description: "Suggest adding funds when user mentions having money to invest or needing to fund goals",
          parameters: {
            type: "object",
            properties: {
              reason: {
                type: "string",
                description: "Why adding funds would help achieve their goals"
              },
              suggested_amount: {
                type: "number",
                description: "Suggested amount to add if mentioned (optional)"
              }
            },
            required: ["reason"]
          }
        }
      }
    ];

    const response = await cerebras.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      model: "qwen-3-235b-a22b-instruct-2507",
      tools: tools,
      tool_choice: "auto", // Let the AI decide when to use tools
      stream: false,
      max_completion_tokens: 2000,
      temperature: 0.7,
      top_p: 0.8
    });

    const message = response.choices[0]?.message;
    
    // Handle tool calls if present
    if (message?.tool_calls && message.tool_calls.length > 0) {
      return {
        content: message.content || "I have some suggestions for you:",
        tool_calls: message.tool_calls
      };
    }

    return {
      content: message?.content || "I apologize, but I couldn't generate a response at this time. Please try again.",
      tool_calls: []
    };
  } catch (error) {
    console.error('Cerebras AI Error:', error);

    // Fallback to rule-based response if AI fails
    if (requestAnalysis?.needsPortfolioData && Array.isArray(goals) && goals.length > 0) {
      return generateFallbackResponse(requestAnalysis, goals);
    } else {
      return generateGeneralAdviceResponse(requestAnalysis, goals, userData);
    }
  }
}


// Analyze what the user is asking for
function analyzeUserRequest(message, goals) {
  const lowerMessage = message.toLowerCase();
  
  const analysis = {
    type: 'general',
    needsPortfolioData: false,
    needsFileAnalysis: false,
    intent: 'advice'
  };

  // Portfolio analysis keywords
  const portfolioKeywords = ['portfolio', 'performance', 'analysis', 'returns', 'growth', 'value', 'investment'];
  const riskKeywords = ['risk', 'volatility', 'safe', 'conservative', 'aggressive'];
  const goalKeywords = ['goal', 'target', 'progress', 'timeline', 'achieve'];
  const recommendationKeywords = ['recommend', 'suggest', 'advice', 'should', 'better', 'improve'];

  if (portfolioKeywords.some(keyword => lowerMessage.includes(keyword))) {
    analysis.needsPortfolioData = true;
    analysis.type = 'portfolio_analysis';
  }

  if (riskKeywords.some(keyword => lowerMessage.includes(keyword))) {
    analysis.needsPortfolioData = true;
    analysis.type = 'risk_analysis';
  }

  if (goalKeywords.some(keyword => lowerMessage.includes(keyword))) {
    analysis.type = 'goal_tracking';
  }

  if (recommendationKeywords.some(keyword => lowerMessage.includes(keyword))) {
    analysis.intent = 'recommendation';
    analysis.needsPortfolioData = true;
  }

  // Check if files are mentioned or if this is a file analysis request
  const fileKeywords = ['file', 'document', 'upload', 'analyze', 'statement', 'report'];
  if (fileKeywords.some(keyword => lowerMessage.includes(keyword))) {
    analysis.needsFileAnalysis = true;
    analysis.type = 'file_analysis';
  }

  return analysis;
}

// Generate portfolio analysis response
function generatePortfolioAnalysisResponse(analysis, portfolioData, goals) {
  const { client, portfolios, totalValue, totalTarget } = portfolioData;
  
  let response = `## Portfolio Analysis\n\n`;
  
  response += `**Current Portfolio Overview:**\n`;
  response += `• Total Portfolio Value: $${totalValue.toLocaleString()}\n`;
  response += `• Total Target Value: $${totalTarget.toLocaleString()}\n`;
  response += `• Available Cash: $${(client.cash || 0).toLocaleString()}\n`;
  response += `• Number of Goals: ${goals.length}\n\n`;

  if (analysis.type === 'portfolio_analysis') {
    response += `**Performance Insights:**\n`;
    
    portfolios.forEach((portfolio, index) => {
      const goal = goals.find(g => g.portfolioId === portfolio.id || g.id === portfolio.id);
      if (goal) {
        const progress = ((portfolio.current_value || 0) / (portfolio.target_amount || 1)) * 100;
        response += `• ${goal.name}: ${progress.toFixed(1)}% complete (${goal.portfolioType} strategy)\n`;
      }
    });

    response += `\n**Recommendations:**\n`;
    
    if (totalValue < totalTarget * 0.5) {
      response += `• Consider increasing your monthly contributions to accelerate goal achievement\n`;
      response += `• Your current pace may require extending target timelines\n`;
    }
    
    if (client.cash > 1000) {
      response += `• You have $${client.cash.toLocaleString()} in cash - consider investing more to maximize growth\n`;
    }

    const conservativeGoals = goals.filter(g => g.portfolioType.includes('Conservative')).length;
    const aggressiveGoals = goals.filter(g => g.portfolioType.includes('Aggressive')).length;
    
    if (conservativeGoals > aggressiveGoals && goals.length > 1) {
      response += `• Consider diversifying with some growth-oriented investments for better long-term returns\n`;
    }

  } else if (analysis.type === 'risk_analysis') {
    response += `**Risk Assessment:**\n`;
    
    const portfolioTypes = goals.map(g => g.portfolioType);
    const riskScore = calculateRiskScore(portfolioTypes);
    
    response += `• Overall Risk Level: ${getRiskLevel(riskScore)}\n`;
    response += `• Portfolio Diversification: ${portfolioTypes.length > 1 ? 'Good' : 'Consider adding more variety'}\n`;
    
    if (riskScore < 3) {
      response += `• Your portfolio is quite conservative. Consider adding some growth investments for higher returns.\n`;
    } else if (riskScore > 7) {
      response += `• Your portfolio is aggressive. Ensure you're comfortable with potential volatility.\n`;
    }
  }

  return response;
}

// Generate response for file analysis
async function analyzeFinancialFiles(files, goals) {
  let response = `## Financial Document Analysis\n\n`;
  
  response += `I've analyzed ${files.length} financial document(s):\n\n`;
  
  files.forEach((file, index) => {
    response += `**${file.name}**\n`;
    
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      response += `• File Type: CSV Data\n`;
      response += `• Analysis: This appears to be financial data. I can help you understand trends, calculate returns, or compare with your current portfolio.\n`;
    } else if (file.type === 'application/pdf') {
      response += `• File Type: PDF Document\n`;
      response += `• Analysis: I can extract key financial information and provide insights on investment strategies or performance metrics.\n`;
    } else {
      response += `• File Type: ${file.type}\n`;
      response += `• Analysis: I'll analyze the content for financial insights and recommendations.\n`;
    }
    
    // Basic content analysis (simplified)
    const content = file.content.toLowerCase();
    if (content.includes('dividend') || content.includes('yield')) {
      response += `• Found dividend/yield information - I can help optimize your income strategy\n`;
    }
    if (content.includes('expense') || content.includes('fee')) {
      response += `• Found expense information - I can help minimize costs\n`;
    }
    if (content.includes('return') || content.includes('performance')) {
      response += `• Found performance data - I can benchmark against your goals\n`;
    }
    
    response += `\n`;
  });

  response += `**Recommendations based on uploaded files:**\n`;
  response += `• Compare the data with your current ${goals.length} investment goals\n`;
  response += `• Look for optimization opportunities in asset allocation\n`;
  response += `• Consider tax implications and fee structures\n`;
  response += `• Evaluate if adjustments to your portfolio strategy are needed\n\n`;
  
  response += `Would you like me to dive deeper into any specific aspect of these documents?`;

  return response;
}

// Generate general advice response
function generateGeneralAdviceResponse(analysis, goals, userData) {
  let response = '';

  if (analysis.type === 'goal_tracking') {
    response = `## Goal Progress Update\n\n`;
    
    if (goals.length === 0) {
      response += `You haven't set up any investment goals yet. I recommend starting with:\n`;
      response += `• A short-term goal (6-12 months) for emergency fund or upcoming purchase\n`;
      response += `• A medium-term goal (2-5 years) for major expenses\n`;
      response += `• A long-term goal (5+ years) for retirement or wealth building\n`;
    } else {
      response += `You have ${goals.length} active investment goal(s):\n\n`;
      
      goals.forEach((goal, index) => {
        const progress = (goal.currentAmount / goal.targetAmount) * 100;
        const daysLeft = Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        
        response += `**${goal.name}**\n`;
        response += `• Progress: ${progress.toFixed(1)}% (${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()})\n`;
        response += `• Strategy: ${goal.portfolioType}\n`;
        response += `• Timeline: ${daysLeft > 0 ? `${daysLeft} days remaining` : 'Target date passed'}\n`;
        
        if (progress < 50 && daysLeft < 365) {
          response += `• ⚠️ Consider increasing contributions to stay on track\n`;
        } else if (progress > 80) {
          response += `• 🎉 Great progress! You're on track to achieve this goal\n`;
        }
        
        response += `\n`;
      });
    }
  } else {
    response = `## Financial Guidance\n\n`;
    response += `I'm here to help you with your investment journey! Here's what I can assist you with:\n\n`;
    response += `**Portfolio Analysis:**\n`;
    response += `• Review your current investment performance\n`;
    response += `• Analyze risk levels and diversification\n`;
    response += `• Compare your progress against benchmarks\n\n`;
    
    response += `**Goal Planning:**\n`;
    response += `• Track progress toward your financial objectives\n`;
    response += `• Optimize contribution strategies\n`;
    response += `• Adjust timelines and targets as needed\n\n`;
    
    response += `**Document Analysis:**\n`;
    response += `• Upload bank statements, investment reports, or tax documents\n`;
    response += `• Get insights on fees, performance, and optimization opportunities\n`;
    response += `• Receive personalized recommendations based on your data\n\n`;
    
    response += `What specific aspect of your finances would you like to explore today?`;
  }

  return response;
}

// Generate fallback response when API calls fail
function generateFallbackResponse(analysis, goals) {
  let response = `## Portfolio Insights (Based on Local Data)\n\n`;
  
  if (goals.length > 0) {
    const totalInvested = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const overallProgress = (totalInvested / totalTarget) * 100;
    
    response += `**Current Status:**\n`;
    response += `• Total Invested: $${totalInvested.toLocaleString()}\n`;
    response += `• Total Target: $${totalTarget.toLocaleString()}\n`;
    response += `• Overall Progress: ${overallProgress.toFixed(1)}%\n\n`;
    
    response += `**Goal Breakdown:**\n`;
    goals.forEach(goal => {
      const progress = (goal.currentAmount / goal.targetAmount) * 100;
      response += `• ${goal.name}: ${progress.toFixed(1)}% complete\n`;
    });
    
    response += `\n*Note: I'm currently using your local data. For real-time portfolio analysis, please ensure your account is properly connected.*`;
  } else {
    response += `I notice you don't have any investment goals set up yet. Would you like help creating your first investment goal?`;
  }
  
  return response;
}

// Helper functions
function calculateRiskScore(portfolioTypes) {
  const riskMap = {
    'Very Conservative': 1,
    'Conservative': 3,
    'Balanced': 5,
    'Growth': 7,
    'Aggressive Growth': 9
  };
  
  const scores = portfolioTypes.map(type => riskMap[type] || 5);
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

function getRiskLevel(score) {
  if (score <= 2) return 'Very Low';
  if (score <= 4) return 'Low';
  if (score <= 6) return 'Moderate';
  if (score <= 8) return 'High';
  return 'Very High';
}


// Start server
app.listen(config.port, () => {
  console.log(`🚀 Willow API server running on port ${config.port}`);
  console.log(`📊 Team ID: ${config.teamId}`);
  console.log(`🔗 API Base URL: ${config.rbcApiBaseUrl}`);
});
