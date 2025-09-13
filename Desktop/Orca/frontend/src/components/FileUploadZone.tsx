import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { uploadDocument } from '../store/documentsSlice';

interface FileUploadZoneProps {
  onUploadComplete?: (document: any) => void;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({ onUploadComplete }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const result = await dispatch(uploadDocument(file)).unwrap();
      onUploadComplete?.(result);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className={`upload-zone ${isDragOver ? 'drag-over' : ''} ${uploading ? 'uploading' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      style={{
        border: '2px dashed #ccc',
        borderRadius: '8px',
        padding: '40px',
        textAlign: 'center',
        backgroundColor: isDragOver ? '#f0f8ff' : '#fafafa',
        borderColor: isDragOver ? '#007bff' : '#ccc',
        cursor: uploading ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease'
      }}
    >
      {uploading ? (
        <div>
          <div style={{ fontSize: '24px', marginBottom: '16px' }}>📤</div>
          <p>Uploading document...</p>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
          <p style={{ fontSize: '18px', marginBottom: '16px' }}>
            Drop your financial documents here or click to browse
          </p>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Supported formats: PDF, JPEG, PNG, TIFF
          </p>
          <input
            type="file"
            id="file-input"
            accept=".pdf,.jpg,.jpeg,.png,.tiff"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            disabled={uploading}
          />
          <label
            htmlFor="file-input"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              borderRadius: '4px',
              cursor: 'pointer',
              border: 'none',
              fontSize: '16px'
            }}
          >
            Choose File
          </label>
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;
