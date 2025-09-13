export interface Document {
  id: number;
  filename: string;
  file_size: number;
  mime_type: string;
  processing_status: ProcessingStatus;
  upload_timestamp: string;
  processed_timestamp?: string;
}

export enum ProcessingStatus {
  UPLOADED = "uploaded",
  PROCESSING = "processing",
  EXTRACTED = "extracted",
  REVIEWED = "reviewed",
  COMPLETED = "completed",
  FAILED = "failed"
}

export interface ExtractedTransaction {
  id: number;
  document_id: number;
  transaction_date?: string;
  description: string;
  amount: number;
  transaction_type?: string;
  category?: string;
  is_reviewed: boolean;
  reviewed_timestamp?: string;
  extraction_confidence?: number;
  raw_text?: string;
}

export interface ExtractedAccount {
  id: number;
  document_id: number;
  account_name: string;
  account_number?: string;
  account_type?: string;
  balance?: number;
  is_reviewed: boolean;
  reviewed_timestamp?: string;
  extraction_confidence?: number;
  raw_text?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface FinancialSummary {
  total_documents: number;
  total_transactions: number;
  total_accounts: number;
  date_range: {
    start_date?: string;
    end_date?: string;
  };
  total_income: number;
  total_expenses: number;
  net_cash_flow: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  transaction_count: number;
}

export interface AccountSummary {
  account_name: string;
  account_type?: string;
  balance?: number;
  transaction_count: number;
}

export interface AIInsight {
  insight_type: string;
  title: string;
  description: string;
  confidence: number;
  data_points?: any;
}

export interface FinancialAnalysis {
  summary: FinancialSummary;
  category_breakdown: CategoryBreakdown[];
  account_summaries: AccountSummary[];
  ai_insights: AIInsight[];
  generated_at: string;
}
