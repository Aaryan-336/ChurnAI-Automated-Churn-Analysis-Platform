// ---- User ----
export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
}

// ---- Project ----
export interface Project {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// ---- Dataset ----
export interface Dataset {
  id: string;
  name: string;
  projectId: string;
  rowCount: number;
  schema: ColumnSchema[] | null;
  createdAt: Date;
  updatedAt: Date;
}

// ---- Column Schema (from analyzer) ----
export type ColumnType = 'numerical' | 'categorical' | 'date' | 'boolean' | 'text' | 'unknown';

export interface ColumnSchema {
  name: string;
  type: ColumnType;
  sampleValues: string[];
  uniqueCount: number;
  nullCount: number;
  isPossibleUserId: boolean;
  isPossibleActivity: boolean;
}

// ---- Metrics ----
export interface Metric {
  id: string;
  name: string;
  formula: string | null;
  datasetId: string;
  value: number | null;
  createdAt: Date;
}

export interface MetricRecommendation {
  name: string;
  description: string;
  formula: string;
  category: 'churn' | 'retention' | 'engagement' | 'revenue';
}

// ---- Dashboard ----
export interface Dashboard {
  id: string;
  name: string;
  projectId: string;
  layout: DashboardWidget[] | null;
  createdAt: Date;
}

export interface DashboardWidget {
  id: string;
  type: 'kpi' | 'line' | 'bar' | 'area' | 'table';
  title: string;
  metricId?: string;
  config?: Record<string, unknown>;
}

// ---- API response wrapper ----
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}