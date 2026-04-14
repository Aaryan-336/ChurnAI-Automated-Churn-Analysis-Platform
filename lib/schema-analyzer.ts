import { ColumnSchema, ColumnType } from '@/types';

/** Analyze an array of parsed rows and return column schemas */
export function analyzeSchema(rows: Record<string, string>[]): ColumnSchema[] {
  if (rows.length === 0) return [];

  const columns = Object.keys(rows[0]);
  const sampleSize = Math.min(rows.length, 200);
  const sampleRows = rows.slice(0, sampleSize);

  return columns.map((col) => {
    const values = sampleRows.map((r) => r[col]).filter((v) => v !== undefined && v !== null && v !== '');
    const uniqueValues = new Set(values);
    const nullCount = sampleRows.length - values.length;

    const type = detectColumnType(col, values);
    const isPossibleUserId = detectUserId(col, uniqueValues.size, sampleRows.length);
    const isPossibleActivity = detectActivityColumn(col, type);

    return {
      name: col,
      type,
      sampleValues: values.slice(0, 5),
      uniqueCount: uniqueValues.size,
      nullCount,
      isPossibleUserId,
      isPossibleActivity,
    };
  });
}

function detectColumnType(colName: string, values: string[]): ColumnType {
  if (values.length === 0) return 'unknown';

  const lower = colName.toLowerCase();

  // Check for dates first
  if (lower.includes('date') || lower.includes('time') || lower.includes('created') || lower.includes('updated')) {
    return 'date';
  }

  const dateCount = values.filter((v) => !isNaN(Date.parse(v)) && v.length > 6).length;
  if (dateCount / values.length > 0.7) return 'date';

  // Check booleans
  const boolValues = new Set(['true', 'false', '0', '1', 'yes', 'no']);
  const boolCount = values.filter((v) => boolValues.has(v.toString().toLowerCase())).length;
  if (boolCount / values.length > 0.8) return 'boolean';

  // Check numbers
  const numCount = values.filter((v) => !isNaN(Number(v)) && v.trim() !== '').length;
  if (numCount / values.length > 0.8) return 'numerical';

  // Low cardinality = categorical
  const uniqueRatio = new Set(values).size / values.length;
  if (uniqueRatio < 0.2) return 'categorical';

  return 'text';
}

function detectUserId(colName: string, uniqueCount: number, totalRows: number): boolean {
  const lower = colName.toLowerCase();
  const idPatterns = ['user_id', 'userid', 'customer_id', 'customerid', 'account_id', 'uid', 'id'];
  if (idPatterns.some((p) => lower === p || lower.endsWith('_' + p))) return true;
  // High unique ratio suggests ID column
  if (lower.includes('id') && uniqueCount / totalRows > 0.5) return true;
  return false;
}

function detectActivityColumn(colName: string, type: ColumnType): boolean {
  const lower = colName.toLowerCase();
  const activityPatterns = ['event', 'action', 'activity', 'type', 'status', 'login', 'session', 'visit'];
  return activityPatterns.some((p) => lower.includes(p)) && (type === 'categorical' || type === 'text');
}
