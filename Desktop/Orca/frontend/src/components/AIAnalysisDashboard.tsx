import React, { useState, useEffect } from 'react';
import { FinancialAnalysis, CategoryBreakdown, AccountSummary, AIInsight } from '../types';
import { analysisApi } from '../services/api';

const AIAnalysisDashboard: React.FC = () => {
  const [analysis, setAnalysis] = useState<FinancialAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalysis();
  }, []);

  const loadAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await analysisApi.getFinancialAnalysis();
      setAnalysis(data);
    } catch (err) {
      setError('Failed to load financial analysis');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend': return '📈';
      case 'anomaly': return '⚠️';
      case 'recommendation': return '💡';
      case 'observation': return '👁️';
      default: return '🤖';
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'trend': return '#007bff';
      case 'anomaly': return '#ffc107';
      case 'recommendation': return '#28a745';
      case 'observation': return '#6c757d';
      default: return '#17a2b8';
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</div>
        <p>AI is analyzing your financial data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#dc3545' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
        <p>{error}</p>
        <button
          onClick={loadAnalysis}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
        <p>No financial data available for analysis.</p>
        <p style={{ color: '#666' }}>Upload and process some documents first!</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, color: '#333' }}>🤖 AI Financial Analysis</h2>
        <button
          onClick={loadAnalysis}
          style={{
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🔄 Refresh Analysis
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', color: '#28a745', fontWeight: 'bold' }}>
            ${analysis.summary.total_income.toLocaleString()}
          </div>
          <div style={{ color: '#666', marginTop: '8px' }}>Total Income</div>
        </div>
        
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', color: '#dc3545', fontWeight: 'bold' }}>
            ${analysis.summary.total_expenses.toLocaleString()}
          </div>
          <div style={{ color: '#666', marginTop: '8px' }}>Total Expenses</div>
        </div>
        
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', textAlign: 'center' }}>
          <div style={{ 
            fontSize: '32px', 
            color: analysis.summary.net_cash_flow >= 0 ? '#28a745' : '#dc3545', 
            fontWeight: 'bold' 
          }}>
            ${analysis.summary.net_cash_flow.toLocaleString()}
          </div>
          <div style={{ color: '#666', marginTop: '8px' }}>Net Cash Flow</div>
        </div>
        
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', color: '#007bff', fontWeight: 'bold' }}>
            {analysis.summary.total_documents}
          </div>
          <div style={{ color: '#666', marginTop: '8px' }}>Documents Analyzed</div>
        </div>
      </div>

      {/* AI Insights Section */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ color: '#333', marginBottom: '16px' }}>🧠 AI Insights</h3>
        <div style={{ display: 'grid', gap: '16px' }}>
          {analysis.ai_insights.map((insight, index) => (
            <div
              key={index}
              style={{
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                borderLeft: `4px solid ${getInsightColor(insight.insight_type)}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '24px', marginRight: '12px' }}>
                  {getInsightIcon(insight.insight_type)}
                </span>
                <div>
                  <h4 style={{ margin: 0, color: '#333' }}>{insight.title}</h4>
                  <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>
                    {insight.insight_type} • {Math.round(insight.confidence * 100)}% confidence
                  </div>
                </div>
              </div>
              <p style={{ margin: 0, color: '#555', lineHeight: '1.5' }}>
                {insight.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ color: '#333', marginBottom: '16px' }}>📊 Spending by Category</h3>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
          {analysis.category_breakdown.map((category, index) => (
            <div key={index} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontWeight: 'bold' }}>{category.category}</span>
                <span>${category.amount.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  flex: 1,
                  height: '8px',
                  backgroundColor: '#e9ecef',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${category.percentage}%`,
                    height: '100%',
                    backgroundColor: '#007bff',
                    borderRadius: '4px'
                  }} />
                </div>
                <span style={{ fontSize: '14px', color: '#666', minWidth: '50px' }}>
                  {category.percentage}%
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                {category.transaction_count} transactions
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account Summaries */}
      <div>
        <h3 style={{ color: '#333', marginBottom: '16px' }}>🏦 Account Overview</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {analysis.account_summaries.map((account, index) => (
            <div
              key={index}
              style={{
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #ddd'
              }}
            >
              <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>{account.account_name}</h4>
              {account.account_type && (
                <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', marginBottom: '12px' }}>
                  {account.account_type}
                </div>
              )}
              {account.balance !== undefined && (
                <div style={{ 
                  fontSize: '24px', 
                  fontWeight: 'bold', 
                  color: account.balance >= 0 ? '#28a745' : '#dc3545',
                  marginBottom: '8px'
                }}>
                  ${account.balance.toLocaleString()}
                </div>
              )}
              <div style={{ fontSize: '14px', color: '#666' }}>
                {account.transaction_count} transactions
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '32px', textAlign: 'center', color: '#666', fontSize: '14px' }}>
        Analysis generated at {new Date(analysis.generated_at).toLocaleString()}
      </div>
    </div>
  );
};

export default AIAnalysisDashboard;
