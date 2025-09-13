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
      simulateGoal: 'POST /api/goals/:portfolioId/simulate'
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

// Start server
app.listen(config.port, () => {
  console.log(`🚀 GoalifyInvest API server running on port ${config.port}`);
  console.log(`📊 Team ID: ${config.teamId}`);
  console.log(`🔗 API Base URL: ${config.rbcApiBaseUrl}`);
});
