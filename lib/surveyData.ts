// lib/surveyData.ts
export interface SurveyDataItem {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface ActivityData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

// Color palette for consistent theming
export const colorPalette = {
  primary: '#4c1d95',
  secondary: '#059669',
  accent: '#7c3aed',
  warning: '#f59e0b',
  success: '#16a34a',
  info: '#1e40af',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827'
  }
};
