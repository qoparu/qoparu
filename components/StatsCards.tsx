// components/StatsCards.tsx
import React from 'react';
// Removed: import { districtData, ageData, totalRespondents, summaryStats } from '@/lib/surveyData';

interface StatCardProps {
  value: string | number;
  label: string;
  color: string;
  icon: React.ReactNode;
  change?: {
    value: string;
    positive: boolean;
  };
  subtitle?: string;
}

function StatCard({ value, label, color, icon, change, subtitle }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
              {icon}
            </div>
            {change && (
              <div className={`text-xs px-2 py-1 rounded-full ${
                change.positive 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {change.positive ? '+' : '-'}{change.value}
              </div>
            )}
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-gray-900">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </div>
            <div className="text-sm font-medium text-gray-600">{label}</div>
            {subtitle && (
              <div className="text-xs text-gray-500">{subtitle}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StatsCards() {
  // Assumed counts from sport_data.csv (replace with actual counts if available)
  const sportObjectCounts = {
    "Спортивная площадка": 150,
    "Футбольное поле": 80,
    "Площадка для воркаута": 50,
    "Баскетбольная площадка": 60,
    "Теннисный корт": 20,
    "Воллейбольная площадка": 30,
  };

  const stats = [
    {
      value: sportObjectCounts["Спортивная площадка"],
      label: 'Спортивные площадки',
      subtitle: 'Объектов',
      color: 'bg-indigo-100 text-indigo-600',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      value: sportObjectCounts["Футбольное поле"],
      label: 'Футбольные поля',
      subtitle: 'Объектов',
      color: 'bg-green-100 text-green-600',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      value: sportObjectCounts["Площадка для воркаута"],
      label: 'Воркаут площадки',
      subtitle: 'Объектов',
      color: 'bg-blue-100 text-blue-600',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      value: sportObjectCounts["Баскетбольная площадка"],
      label: 'Баскетбольные площадки',
      subtitle: 'Объектов',
      color: 'bg-yellow-100 text-yellow-600',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 2a8 8 0 110 16 8 8 0 010-16zm-1 10h2v-4h-2v4zm0-6h2V6h-2v2z" />
        </svg>
      ),
    },
    {
      value: sportObjectCounts["Теннисный корт"],
      label: 'Теннисные корты',
      subtitle: 'Объектов',
      color: 'bg-red-100 text-red-600',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 2m0 0l-2-2m2 2V3m0 11v7m-9-9h18a2 2 0 012 2v4a2 2 0 01-2 2H3a2 2 0 01-2-2v-4a2 2 0 012-2z" />
        </svg>
      ),
    },
    {
      value: sportObjectCounts["Воллейбольная площадка"],
      label: 'Волейбольные площадки',
      subtitle: 'Объектов',
      color: 'bg-purple-100 text-purple-600',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"> {/* Adjusted grid for 6 items */}
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          value={stat.value}
          label={stat.label}
          subtitle={stat.subtitle}
          color={stat.color}
          icon={stat.icon}
          change={stat.change}
        />
      ))}
    </div>
  );
}