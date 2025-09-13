import React, { useState } from 'react';
import FileUploadZone from '../components/FileUploadZone';
import DocumentList from '../components/DocumentList';
import AIAnalysisDashboard from '../components/AIAnalysisDashboard';
import { Document } from '../types';

const Dashboard: React.FC = () => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'documents' | 'analysis'>('upload');

  const handleUploadComplete = (document: Document) => {
    setActiveTab('documents');
    setSelectedDocument(document);
  };

  const handleDocumentSelect = (document: Document) => {
    setSelectedDocument(document);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#fff',
        borderBottom: '1px solid #ddd',
        padding: '16px 24px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: 0, color: '#333', fontSize: '24px' }}>
          📚 Chronicle Financial Document Processor
        </h1>
        <p style={{ margin: '4px 0 0 0', color: '#666' }}>
          Upload, process, and analyze your financial documents with AI insights
        </p>
      </header>

      {/* Navigation Tabs */}
      <nav style={{
        backgroundColor: '#fff',
        borderBottom: '1px solid #ddd',
        padding: '0 24px'
      }}>
        <div style={{ display: 'flex', gap: '0' }}>
          <button
            onClick={() => setActiveTab('upload')}
            style={{
              padding: '12px 24px',
              border: 'none',
              backgroundColor: activeTab === 'upload' ? '#007bff' : 'transparent',
              color: activeTab === 'upload' ? 'white' : '#666',
              cursor: 'pointer',
              borderBottom: activeTab === 'upload' ? '3px solid #007bff' : '3px solid transparent',
              fontSize: '16px'
            }}
          >
            📤 Upload
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            style={{
              padding: '12px 24px',
              border: 'none',
              backgroundColor: activeTab === 'documents' ? '#007bff' : 'transparent',
              color: activeTab === 'documents' ? 'white' : '#666',
              cursor: 'pointer',
              borderBottom: activeTab === 'documents' ? '3px solid #007bff' : '3px solid transparent',
              fontSize: '16px'
            }}
          >
            📋 Documents
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            style={{
              padding: '12px 24px',
              border: 'none',
              backgroundColor: activeTab === 'analysis' ? '#007bff' : 'transparent',
              color: activeTab === 'analysis' ? 'white' : '#666',
              cursor: 'pointer',
              borderBottom: activeTab === 'analysis' ? '3px solid #007bff' : '3px solid transparent',
              fontSize: '16px'
            }}
          >
            🤖 AI Analysis
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ padding: '24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {activeTab === 'upload' && (
            <div>
              <h2 style={{ marginBottom: '24px', color: '#333' }}>Upload Document</h2>
              <FileUploadZone onUploadComplete={handleUploadComplete} />
              
              <div style={{
                marginTop: '32px',
                padding: '20px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                border: '1px solid #ddd'
              }}>
                <h3 style={{ marginTop: 0, color: '#333' }}>How it works:</h3>
                <ol style={{ color: '#666', lineHeight: '1.6' }}>
                  <li><strong>Upload:</strong> Drop your financial documents (bank statements, receipts, invoices)</li>
                  <li><strong>Process:</strong> Our OCR engine extracts transaction and account data</li>
                  <li><strong>Review:</strong> Verify and correct the extracted information</li>
                  <li><strong>Complete:</strong> Mark documents as reviewed when finished</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div>
              <DocumentList onDocumentSelect={handleDocumentSelect} />
              
              {selectedDocument && (
                <div style={{
                  marginTop: '24px',
                  padding: '20px',
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  border: '1px solid #ddd'
                }}>
                  <h3 style={{ marginTop: 0, color: '#333' }}>Document Details</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <strong>Filename:</strong> {selectedDocument.filename}
                    </div>
                    <div>
                      <strong>Status:</strong> {selectedDocument.processing_status}
                    </div>
                    <div>
                      <strong>Size:</strong> {(selectedDocument.file_size / 1024).toFixed(1)} KB
                    </div>
                    <div>
                      <strong>Type:</strong> {selectedDocument.mime_type}
                    </div>
                    <div>
                      <strong>Uploaded:</strong> {new Date(selectedDocument.upload_timestamp).toLocaleString()}
                    </div>
                    {selectedDocument.processed_timestamp && (
                      <div>
                        <strong>Processed:</strong> {new Date(selectedDocument.processed_timestamp).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'analysis' && (
            <AIAnalysisDashboard />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
