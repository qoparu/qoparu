// components/SurveyCharts.tsx
'use client';

import React, { useState, useEffect } from 'react';
// Removed: import { ageData, districtData, activityFrequencyData, totalRespondents } from '@/lib/surveyData';
import { loadCSVFromUrl, processSurveyData, validateSurveyCSV, getSummaryStats } from '@/lib/csvUtils';

interface SurveyChartsProps {
  selectedDistrict: string | null;
  onDistrictSelect: (district: string) => void;
  csvUrl?: string;
}

interface ChartBarProps {
  item: {
    name: string;
    value: number;
    percentage: number;
    color: string;
  };
  maxPercentage: number;
  isSelected?: boolean;
  onClick?: () => void;
  showValue?: boolean;
  showPercentage?: boolean;
}

interface DynamicSurveyData {
  age: { name: string; value: number; percentage: number; color: string; }[];
  districts: { name: string; value: number; percentage: number; color: string; }[];
  activity: { name: string; value: number; percentage: number; color: string; }[];
  total: number;
}

function ChartBar({ item, maxPercentage, isSelected = false, onClick, showValue = true, showPercentage = true }: ChartBarProps) {
  return (
    <div 
      className={`
        flex items-center p-2 rounded-lg transition-all duration-300 
        ${onClick ? 'cursor-pointer hover:bg-gray-50' : ''}
        ${isSelected ? 'bg-indigo-50 border border-indigo-200 shadow-sm' : ''}
      `}
      onClick={onClick}
    >
      <div className="w-28 text-xs text-gray-700 font-medium truncate pr-2">
        {item.name}
      </div>
      <div className="flex-1 mx-3 relative">
        <div className="h-5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-700 ease-out relative"
            style={{ 
              width: `${Math.max((item.percentage / maxPercentage) * 100, 2)}%`, 
              backgroundColor: item.color 
            }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12"></div>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2 text-xs">
        {showValue && (
          <span className="font-semibold text-gray-700 w-8 text-right">
            {item.value}
          </span>
        )}
        {showPercentage && (
          <span className="text-gray-500 w-8 text-right">
            {item.percentage}%
          </span>
        )}
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-sm text-gray-600">Загрузка данных опроса...</p>
      </div>
    </div>
  );
}

function ErrorDisplay({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h4 className="text-sm font-semibold text-gray-900 mb-1">Ошибка загрузки данных</h4>
        <p className="text-xs text-gray-600 mb-3">{error}</p>
        <button
          onClick={onRetry}
          className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Повторить
        </button>
      </div>
    </div>
  );
}

export default function SurveyCharts({ selectedDistrict, onDistrictSelect, csvUrl }: SurveyChartsProps) {
  const [activeTab, setActiveTab] = useState<'districts' | 'age' | 'activity'>('districts');
  const [dynamicData, setDynamicData] = useState<DynamicSurveyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Removed: const [dataSource, setDataSource] = useState<'static' | 'dynamic'>('static');

  // Load CSV data if URL is provided
  const loadData = async () => {
    if (!csvUrl) {
      setError('CSV URL is not provided.'); // Set error if no CSV URL
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const csvData = await loadCSVFromUrl(csvUrl);
      
      // Validate CSV structure
      if (!validateSurveyCSV(csvData)) {
        throw new Error('CSV не содержит необходимые колонки (age, district, activity_frequency)');
      }

      // Process the data
      const processed = processSurveyData(csvData);
      
      setDynamicData({
        age: processed.age,
        districts: processed.districts,
        activity: processed.activity,
        total: processed.total
      });
      
      // Removed: setDataSource('dynamic');
      setLoading(false);
      
      console.log('CSV data loaded successfully:', getSummaryStats(csvData));
      
    } catch (err) {
      console.error('Failed to load CSV data:', err);
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка при загрузке данных');
      
      // Removed fallback to static data
      setDynamicData(null); // Ensure no old data is displayed
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [csvUrl]);

  // Use dynamic data if available, otherwise show loading or error
  if (!dynamicData) {
    if (loading) {
      return <LoadingSpinner />;
    }
    if (error) {
      return <ErrorDisplay error={error} onRetry={loadData} />;
    }
    return null; // Should not happen if loading/error states are handled
  }

  const currentAgeData = dynamicData.age;
  const currentDistrictData = dynamicData.districts;
  const currentActivityData = dynamicData.activity;
  const currentTotal = dynamicData.total;

  const maxDistrictPercentage = Math.max(...currentDistrictData.map(d => d.percentage));
  const maxAgePercentage = Math.max(...currentAgeData.map(d => d.percentage));
  const maxActivityPercentage = Math.max(...currentActivityData.map(d => d.percentage));

  const tabs = [
    { 
      id: 'districts', 
      label: 'Районы', 
      count: currentDistrictData.length,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        </svg>
      )
    },
    { 
      id: 'age', 
      label: 'Возраст', 
      count: currentAgeData.length,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    { 
      id: 'activity', 
      label: 'Активность', 
      count: currentActivityData.length,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Аналитика опроса</h2>
          <div className="flex items-center space-x-2">
            {/* Removed error display for static data */}
            <div className={`text-xs px-2 py-1 rounded text-green-700 bg-green-100`}>
              ● Динамические данные
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Детальный анализ {currentTotal.toLocaleString()} ответов по категориям
          {csvUrl && (
            <span className="ml-2 text-xs text-indigo-600">
              Источник: {csvUrl.split('/').pop()}
            </span>
          )}
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex-shrink-0">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2
                ${activeTab === tab.id
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span className="text-xs opacity-75">({tab.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chart Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto space-y-3 pr-2">
          {/* Districts Tab */}
          {activeTab === 'districts' && (
            <>
              <div className="flex items-center justify-between mb-4 sticky top-0 bg-white z-10 pb-2">
                <h3 className="text-sm font-semibold text-gray-700">
                  Распределение по районам
                </h3>
                <span className="text-xs text-gray-500">
                  {currentDistrictData.reduce((sum, d) => sum + d.value, 0)} ответов
                </span>
              </div>
              <div className="space-y-2">
                {currentDistrictData.map((item, index) => (
                  <ChartBar
                    key={index}
                    item={item}
                    maxPercentage={maxDistrictPercentage}
                    isSelected={selectedDistrict === item.name}
                    onClick={() => onDistrictSelect(selectedDistrict === item.name ? '' : item.name)}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-3 px-28 sticky bottom-0 bg-white pt-2">
                <span>0</span>
                <span>50</span>
                <span>100+</span>
              </div>
            </>
          )}

          {/* Age Tab */}
          {activeTab === 'age' && (
            <>
              <div className="flex items-center justify-between mb-4 sticky top-0 bg-white z-10 pb-2">
                <h3 className="text-sm font-semibold text-gray-700">
                  Распределение по возрасту
                </h3>
                <span className="text-xs text-gray-500">
                  {currentAgeData.reduce((sum, d) => sum + d.value, 0)} ответов
                </span>
              </div>
              <div className="space-y-2">
                {currentAgeData.map((item, index) => (
                  <ChartBar
                    key={index}
                    item={item}
                    maxPercentage={maxAgePercentage}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-3 px-28 sticky bottom-0 bg-white pt-2">
                <span>0%</span>
                <span>15%</span>
                <span>30%</span>
              </div>
            </>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <>
              <div className="flex items-center justify-between mb-4 sticky top-0 bg-white z-10 pb-2">
                <h3 className="text-sm font-semibold text-gray-700">
                  Частота занятий спортом
                </h3>
                <span className="text-xs text-gray-500">
                  {currentActivityData.reduce((sum, d) => sum + d.value, 0)} ответов
                </span>
              </div>
              <div className="space-y-2">
                {currentActivityData.map((item, index) => (
                  <ChartBar
                    key={index}
                    item={item}
                    maxPercentage={maxActivityPercentage}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-3 px-28 sticky bottom-0 bg-white pt-2">
                <span>0%</span>
                <span>15%</span>
                <span>30%</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Selected District Info */}
      {selectedDistrict && (
        <div className="mt-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-indigo-900 flex items-center mb-2">
                <svg className="w-4 h-4 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {selectedDistrict}
              </h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-semibold text-indigo-900">
                    {currentDistrictData.find(d => d.name === selectedDistrict)?.value}
                  </div>
                  <div className="text-indigo-700">ответов</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-indigo-900">
                    {currentDistrictData.find(d => d.name === selectedDistrict)?.percentage}%
                  </div>
                  <div className="text-indigo-700">от общего</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-indigo-900">
                    #{currentDistrictData.findIndex(d => d.name === selectedDistrict) + 1}
                  </div>
                  <div className="text-indigo-700">место</div>
                </div>
              </div>
            </div>
            <button
              onClick={() => onDistrictSelect('')}
              className="ml-3 text-indigo-500 hover:text-indigo-700 transition-colors p-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}