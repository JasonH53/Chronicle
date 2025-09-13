import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchDocuments, processDocument, completeDocumentReview } from '../store/documentsSlice';
import { Document, ProcessingStatus } from '../types';

interface DocumentListProps {
  onDocumentSelect?: (document: Document) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({ onDocumentSelect }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { documents, loading, error } = useSelector((state: RootState) => state.documents);

  useEffect(() => {
    dispatch(fetchDocuments());
  }, [dispatch]);

  const handleProcessDocument = async (id: number) => {
    try {
      await dispatch(processDocument(id)).unwrap();
    } catch (error) {
      console.error('Processing failed:', error);
    }
  };

  const handleCompleteReview = async (id: number) => {
    try {
      await dispatch(completeDocumentReview(id)).unwrap();
    } catch (error) {
      console.error('Review completion failed:', error);
    }
  };

  const getStatusColor = (status: ProcessingStatus) => {
    switch (status) {
      case ProcessingStatus.UPLOADED: return '#ffc107';
      case ProcessingStatus.PROCESSING: return '#17a2b8';
      case ProcessingStatus.EXTRACTED: return '#007bff';
      case ProcessingStatus.REVIEWED: return '#28a745';
      case ProcessingStatus.COMPLETED: return '#6c757d';
      case ProcessingStatus.FAILED: return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status: ProcessingStatus) => {
    switch (status) {
      case ProcessingStatus.UPLOADED: return '📤';
      case ProcessingStatus.PROCESSING: return '⚙️';
      case ProcessingStatus.EXTRACTED: return '📋';
      case ProcessingStatus.REVIEWED: return '✅';
      case ProcessingStatus.COMPLETED: return '🎉';
      case ProcessingStatus.FAILED: return '❌';
      default: return '📄';
    }
  };

  if (loading && documents.length === 0) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading documents...</div>;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#dc3545' }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Documents</h2>
      
      {documents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          No documents uploaded yet. Upload your first document to get started!
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {documents.map((document) => (
            <div
              key={document.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                cursor: 'pointer'
              }}
              onClick={() => onDocumentSelect?.(document)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>
                    {document.filename}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '20px' }}>
                      {getStatusIcon(document.processing_status)}
                    </span>
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: 'white',
                        backgroundColor: getStatusColor(document.processing_status)
                      }}
                    >
                      {document.processing_status.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    <div>Size: {(document.file_size / 1024).toFixed(1)} KB</div>
                    <div>Uploaded: {new Date(document.upload_timestamp).toLocaleString()}</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {document.processing_status === ProcessingStatus.UPLOADED && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProcessDocument(document.id);
                      }}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Process
                    </button>
                  )}
                  
                  {document.processing_status === ProcessingStatus.EXTRACTED && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCompleteReview(document.id);
                      }}
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
                      Complete Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentList;
