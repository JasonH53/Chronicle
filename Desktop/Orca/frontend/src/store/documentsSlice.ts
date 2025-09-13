import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Document } from '../types';
import { documentApi } from '../services/api';

interface DocumentsState {
  documents: Document[];
  currentDocument: Document | null;
  loading: boolean;
  error: string | null;
  uploadProgress: number;
}

const initialState: DocumentsState = {
  documents: [],
  currentDocument: null,
  loading: false,
  error: null,
  uploadProgress: 0,
};

// Async thunks
export const fetchDocuments = createAsyncThunk(
  'documents/fetchDocuments',
  async () => {
    return await documentApi.getDocuments();
  }
);

export const uploadDocument = createAsyncThunk(
  'documents/uploadDocument',
  async (file: File) => {
    return await documentApi.uploadDocument(file);
  }
);

export const processDocument = createAsyncThunk(
  'documents/processDocument',
  async (id: number) => {
    await documentApi.processDocument(id);
    return await documentApi.getDocument(id);
  }
);

export const completeDocumentReview = createAsyncThunk(
  'documents/completeReview',
  async (id: number) => {
    await documentApi.completeReview(id);
    return await documentApi.getDocument(id);
  }
);

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    setCurrentDocument: (state, action: PayloadAction<Document | null>) => {
      state.currentDocument = action.payload;
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch documents
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch documents';
      })
      // Upload document
      .addCase(uploadDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.documents.unshift(action.payload);
        state.uploadProgress = 0;
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to upload document';
        state.uploadProgress = 0;
      })
      // Process document
      .addCase(processDocument.fulfilled, (state, action) => {
        const index = state.documents.findIndex(doc => doc.id === action.payload.id);
        if (index !== -1) {
          state.documents[index] = action.payload;
        }
        if (state.currentDocument?.id === action.payload.id) {
          state.currentDocument = action.payload;
        }
      })
      // Complete review
      .addCase(completeDocumentReview.fulfilled, (state, action) => {
        const index = state.documents.findIndex(doc => doc.id === action.payload.id);
        if (index !== -1) {
          state.documents[index] = action.payload;
        }
        if (state.currentDocument?.id === action.payload.id) {
          state.currentDocument = action.payload;
        }
      });
  },
});

export const { setCurrentDocument, setUploadProgress, clearError } = documentsSlice.actions;
export default documentsSlice.reducer;
