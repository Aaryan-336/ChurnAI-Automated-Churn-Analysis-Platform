import { ColumnSchema, MetricRecommendation } from '@/types';

/** Recommend churn metrics based on the analyzed schema */
export function recommendMetrics(schema: ColumnSchema[]): MetricRecommendation[] {
  const recommendations: MetricRecommendation[] = [];

  const hasUserId = schema.some((c) => c.isPossibleUserId);
  const hasDate = schema.some((c) => c.type === 'date');
  const hasActivity = schema.some((c) => c.isPossibleActivity);
  const hasNumerical = schema.some((c) => c.type === 'numerical');
  const hasCategorical = schema.some((c) => c.type === 'categorical');

  // Always recommend basic churn rate if we have user identifiers
  if (hasUserId) {
    recommendations.push({
      name: 'Churn Rate',
      description: 'Percentage of users who stopped using the product in a given period.',
      formula: 'churned_users / total_users * 100',
      category: 'churn',
    });

    recommendations.push({
      name: 'Retention Rate',
      description: 'Percentage of users retained over a period.',
      formula: '(1 - churn_rate) * 100',
      category: 'retention',
    });
  }

  // Cohort analysis needs both user ID and date
  if (hasUserId && hasDate) {
    recommendations.push({
      name: 'Cohort Retention',
      description: 'Track how different user cohorts retain over time.',
      formula: 'active_users_in_cohort_period / initial_cohort_size * 100',
      category: 'retention',
    });

    recommendations.push({
      name: 'Time to Churn',
      description: 'Average days from first activity to last activity for churned users.',
      formula: 'avg(last_activity_date - first_activity_date)',
      category: 'churn',
    });
  }

  // DAU/MAU ratio needs activity and date data
  if (hasActivity && hasDate) {
    recommendations.push({
      name: 'DAU/MAU Ratio',
      description: 'Daily active users divided by monthly active users. Measures stickiness.',
      formula: 'daily_active_users / monthly_active_users',
      category: 'engagement',
    });
  }

  // Revenue metrics if we detect numerical columns
  if (hasNumerical && hasUserId) {
    recommendations.push({
      name: 'Customer Lifetime Value (LTV)',
      description: 'Predicted total revenue from a customer over their entire relationship.',
      formula: 'avg_revenue_per_user / churn_rate',
      category: 'revenue',
    });

    recommendations.push({
      name: 'Average Revenue Per User (ARPU)',
      description: 'The average revenue per active user.',
      formula: 'total_revenue / active_users',
      category: 'revenue',
    });
  }

  // Activity-based engagement metric
  if (hasActivity) {
    recommendations.push({
      name: 'Engagement Score',
      description: 'Composite score based on user activity frequency and depth.',
      formula: 'weighted_sum(activity_types) / max_score',
      category: 'engagement',
    });
  }

  // Categorical segmentation
  if (hasCategorical && hasUserId) {
    recommendations.push({
      name: 'Segment Churn Rate',
      description: 'Churn rate broken down by user segment (e.g. plan type, region).',
      formula: 'churned_in_segment / total_in_segment * 100',
      category: 'churn',
    });
  }

  return recommendations;
}

/** Calculate simple churn metrics from raw parsed data */
export function calculateBasicMetrics(
  rows: Record<string, string>[],
  schema: ColumnSchema[]
): Record<string, number> {
  const metrics: Record<string, number> = {};
  const totalRows = rows.length;

  // Find user id column
  const userIdCol = schema.find((c) => c.isPossibleUserId);
  if (userIdCol) {
    const uniqueUsers = new Set(rows.map((r) => r[userIdCol.name])).size;
    metrics['Total Users'] = uniqueUsers;
    metrics['Total Records'] = totalRows;
    metrics['Avg Records/User'] = Math.round((totalRows / uniqueUsers) * 100) / 100;
  }

  // Find date column for time range
  const dateCol = schema.find((c) => c.type === 'date');
  if (dateCol) {
    const dates = rows
      .map((r) => new Date(r[dateCol.name]))
      .filter((d) => !isNaN(d.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());

    if (dates.length > 1) {
      const daySpan = Math.ceil((dates[dates.length - 1].getTime() - dates[0].getTime()) / (1000 * 60 * 60 * 24));
      metrics['Date Range (days)'] = daySpan;
    }
  }

  // Numerical column summaries
  const numCols = schema.filter((c) => c.type === 'numerical');
  numCols.slice(0, 3).forEach((col) => {
    const values = rows.map((r) => parseFloat(r[col.name])).filter((v) => !isNaN(v));
    if (values.length > 0) {
      const sum = values.reduce((a, b) => a + b, 0);
      metrics[`Avg ${col.name}`] = Math.round((sum / values.length) * 100) / 100;
    }
  });

  return metrics;
}
