// lib/csvUtils.ts
export interface ParsedCSVData {
  headers: string[];
  rows: Record<string, string>[];
  rowCount: number;
}

export interface SurveyDataPoint {
  id: string;
  age: string;
  district: string;
  activityFrequency: string;
  createdAt: string;
  [key: string]: string;
}

/**
 * Parse CSV text into structured data
 */
export function parseCSV(csvText: string): ParsedCSVData {
  const lines = csvText.trim().split('\n');
  
  if (lines.length < 2) {
    throw new Error('CSV must have at least headers and one data row');
  }

  // Parse headers (first line)
  const headers = lines[0].split(',').map(header => 
    header.trim().replace(/^["']|["']$/g, '') // Remove quotes
  );

  // Parse data rows
  const rows: Record<string, string>[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines
    
    const values = parseCSVLine(line);
    const row: Record<string, string> = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    rows.push(row);
  }

  return {
    headers,
    rows,
    rowCount: rows.length
  };
}

/**
 * Parse a single CSV line handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

/**
 * Convert survey CSV data to chart format
 */
export function processSurveyData(csvData: ParsedCSVData) {
  const { rows } = csvData;
  
  // Define the 8 allowed districts
  const allowedDistricts = new Set([
    'Алатауский', 'Алмалинский', 'Ауэзовский', 'Бостандыкский',
    'Жетысуский', 'Медеуский', 'Наурызбайский', 'Турксибский'
  ]);

  // Filter and process rows based on allowed districts
  const filteredRows = rows.filter(row => {
    const district = normalizeDistrict(row.district || '');
    return allowedDistricts.has(district);
  });

  // Count age groups
  const ageCounts = new Map<string, number>();
  const districtCounts = new Map<string, number>();
  const activityCounts = new Map<string, number>();
  
  filteredRows.forEach(row => {
    // Normalize age groups
    const age = normalizeAgeGroup(row.age || '');
    if (age) {
      ageCounts.set(age, (ageCounts.get(age) || 0) + 1);
    }
    
    // Normalize districts
    const district = normalizeDistrict(row.district || '');
    if (district) {
      districtCounts.set(district, (districtCounts.get(district) || 0) + 1);
    }
    
    // Normalize activity frequency
    const activity = normalizeActivityFrequency(row.activity_frequency || row.activityFrequency || '');
    if (activity) {
      activityCounts.set(activity, (activityCounts.get(activity) || 0) + 1);
    }
  });

  const total = filteredRows.length; // Total respondents after filtering
  
  // Define colors (keeping existing for now, can be adjusted later if needed)
  const ageColors = ['#1e40af', '#059669', '#4c1d95', '#65a30d', '#16a34a', '#84cc16'];
  const districtColors = [
    '#4c1d95', '#5b21b6', '#6d28d9', '#7c3aed', '#8b5cf6', '#a78bfa', 
    '#c4b5fd', '#ddd6fe', '#e879f9', '#f472b6', '#fb7185', '#fda4af'
  ];
  const activityColors = [
    '#059669', '#16a34a', '#65a30d', '#84cc16', '#eab308', '#f59e0b',
    '#f97316', '#ef4444', '#dc2626', '#991b1b'
  ];

  return {
    age: Array.from(ageCounts.entries())
      .map(([name, value], index) => ({
        name,
        value,
        percentage: Math.round((value / total) * 100),
        color: ageColors[index % ageColors.length]
      }))
      .sort((a, b) => b.value - a.value),
      
    districts: Array.from(districtCounts.entries())
      .map(([name, value], index) => ({
        name,
        value,
        percentage: Math.round((value / total) * 100),
        color: districtColors[index % districtColors.length]
      }))
      .sort((a, b) => b.value - a.value),
      
    activity: Array.from(activityCounts.entries())
      .map(([name, value], index) => ({
        name,
        value,
        percentage: Math.round((value / total) * 100),
        color: activityColors[index % activityColors.length]
      }))
      .sort((a, b) => b.value - a.value),
      
    total
  };
}

/**
 * Normalize age group names
 */
function normalizeAgeGroup(age: string): string {
  const normalized = age.toLowerCase().trim();
  
  if (normalized.includes('<18') || normalized.includes('до 18') || normalized.includes('18 жасқа дейін')) {
    return 'До 18';
  }
  if (normalized === '18-25') return '18-25';
  if (normalized === '26-35') return '26-35';
  if (normalized === '36-45') return '36-45';
  if (normalized === '46-60') return '46-60';
  if (normalized.includes('60') && (normalized.includes('старше') || normalized.includes('жоғары'))) {
    return 'Старше 60';
  }
  
  return 'Неизвестно'; // Default for unhandled age groups
}

/**
 * Normalize district names
 */
function normalizeDistrict(district: string): string {
  const normalized = district.toLowerCase().trim();
  
  if (normalized.includes('ауэзов') || normalized.includes('әуезов')) return 'Ауэзовский';
  if (normalized.includes('бостандык') || normalized.includes('бостандық')) return 'Бостандыкский';
  if (normalized.includes('жетысу') || normalized.includes('жетісу')) return 'Жетысуский';
  if (normalized.includes('наурызбай')) return 'Наурызбайский';
  if (normalized.includes('алмалы') || normalized.includes('алмалинский')) return 'Алмалинский';
  if (normalized.includes('медеу')) return 'Медеуский';
  if (normalized.includes('турксиб') || normalized.includes('түрксіб')) return 'Турксибский';
  if (normalized.includes('алатау')) return 'Алатауский';
  
  return 'Неизвестный'; // Return a default for districts not in the specified list
}

/**
 * Normalize activity frequency names
 */
function normalizeActivityFrequency(frequency: string): string {
  const normalized = frequency.toLowerCase().trim();

  if (normalized.includes('несколько раз в неделю') || normalized.includes('аптасына бірнеше рет')) {
    return 'Несколько раз в неделю';
  }
  if (normalized.includes('ежедневно') || normalized.includes('күн сайын')) {
    return 'Ежедневно';
  }
  if (normalized.includes('несколько раз в месяц') || normalized.includes('айына бірнеше рет')) {
    return 'Несколько раз в месяц';
  }
  if (normalized.includes('редко') || normalized.includes('сирек')) {
    return 'Редко';
  }
  if (normalized.includes('практически не занимаюсь') || normalized.includes('мүлдем айналыспаймын')) {
    return 'Практически не занимаюсь';
  }
  if (normalized.includes('не занимаюсь')) {
    return 'Не занимаюсь';
  }
  
  return 'Другое'; // Default for unhandled frequencies
}

/**
 * Load and parse CSV from URL
 */
export async function loadCSVFromUrl(url: string): Promise<ParsedCSVData> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error('Error loading CSV:', error);
    throw error;
  }
}

/**
 * Validate CSV data structure for survey
 */
export function validateSurveyCSV(data: ParsedCSVData): boolean {
  const requiredHeaders = ['age', 'district', 'activity_frequency']; // Added activity_frequency
  
  return requiredHeaders.every(header => 
    data.headers.some(h => h.toLowerCase().includes(header))
  );
}

/**
 * Get summary statistics from parsed CSV
 */
export function getSummaryStats(data: ParsedCSVData) {
  const { rows } = data;
  
  const districts = new Set(rows.map(r => normalizeDistrict(r.district || '')).filter(Boolean));
  const ageGroups = new Set(rows.map(r => normalizeAgeGroup(r.age || '')).filter(Boolean));
  const activityFrequencies = new Set(rows.map(r => normalizeActivityFrequency(r.activity_frequency || r.activityFrequency || '')).filter(Boolean));
  
  // Find most common values
  const districtCounts = new Map<string, number>();
  const ageCounts = new Map<string, number>();
  const activityCounts = new Map<string, number>();
  
  rows.forEach(row => {
    const district = normalizeDistrict(row.district || '');
    const age = normalizeAgeGroup(row.age || '');
    const activity = normalizeActivityFrequency(row.activity_frequency || row.activityFrequency || '');
    
    if (district) districtCounts.set(district, (districtCounts.get(district) || 0) + 1);
    if (age) ageCounts.set(age, (ageCounts.get(age) || 0) + 1);
    if (activity) activityCounts.set(activity, (activityCounts.get(activity) || 0) + 1);
  });
  
  const topDistrict = Array.from(districtCounts.entries()).sort((a, b) => b[1] - a[1])[0];
  const topAge = Array.from(ageCounts.entries()).sort((a, b) => b[1] - a[1])[0];
  const topActivity = Array.from(activityCounts.entries()).sort((a, b) => b[1] - a[1])[0];
  
  return {
    totalResponses: rows.length,
    uniqueDistricts: districts.size,
    uniqueAgeGroups: ageGroups.size,
    uniqueActivityFrequencies: activityFrequencies.size,
    topDistrict: topDistrict ? { name: topDistrict[0], count: topDistrict[1] } : null,
    topAgeGroup: topAge ? { name: topAge[0], count: topAge[1] } : null,
    topActivityFrequency: topActivity ? { name: topActivity[0], count: topActivity[1] } : null,
    dataQuality: {
      hasAge: rows.filter(r => r.age).length / rows.length,
      hasDistrict: rows.filter(r => r.district).length / rows.length,
      hasActivityFrequency: rows.filter(r => r.activity_frequency || r.activityFrequency).length / rows.length,
      complete: rows.filter(r => r.age && r.district && (r.activity_frequency || r.activityFrequency)).length / rows.length
    }
  };
}