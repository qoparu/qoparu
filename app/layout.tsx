// app/layout.tsx
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'Спортивная инфраструктура Алматы',
    template: '%s | Алматы Спорт Аналитика'
  },
  description:
    'Аналитическая панель для анализа развития спортивной инфраструктуры города Алматы на основе опроса 391 респондента из 8 районов города.',
  metadataBase: new URL('http://localhost:3000'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <meta name="theme-color" content="#ffffff" />
        <meta name="color-scheme" content="light dark" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${inter.className} antialiased bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100`}
        suppressHydrationWarning
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
        >
          Перейти к основному содержанию
        </a>

        <div id="main-content" role="main">{children}</div>
      </body>
    </html>
  );
}


// app/page.tsx
'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import StatsCards from '@/components/StatsCards';
import SurveyCharts from '@/components/SurveyCharts';

const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-gray-50 rounded-xl border border-gray-100">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-sm text-gray-600">Загрузка карты...</p>
      </div>
    </div>
  ),
});

export default function Page() {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  const urls = useMemo(
    () => ({
      districts: '/data/almaty_districts.geojson',
      existingCsv: '/data/smart_recommendations.csv',
      surveyCsv: '/data/questionnaire_sport_survey.csv',
    }),
    []
  );

  const handleDistrictSelect = (district: string) => {
    setSelectedDistrict(district === selectedDistrict ? null : district);
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-950">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <header className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-gray-500">Панель аналитики</p>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
              Развитие инфраструктуры для отдыха и спорта
            </h1>
            <p className="text-gray-500 max-w-3xl">
              Анализ результатов опроса населения города Алматы по развитию спортивной инфраструктуры
            </p>
          </header>

          <StatsCards />

          <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/70 backdrop-blur-xl">
              <div className="px-6 pt-6">
                <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Карта районов Алматы</h2>
                {selectedDistrict && (
                  <div className="mt-2 inline-flex items-center gap-2 text-xs text-blue-700 bg-blue-50 px-3 py-1 rounded-md">
                    Выбран: {selectedDistrict}
                  </div>
                )}
              </div>
              <div className="h-[65vh] p-6">
                <MapView
                  selectedDistrict={selectedDistrict}
                  onDistrictSelect={handleDistrictSelect}
                  districtsGeoJsonUrl={urls.districts}
                  pointsCsvUrl={urls.existingCsv}
                />
              </div>
            </div>

            <div className="lg:col-span-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/70 backdrop-blur-xl">
              <div className="px-6 pt-6">
                <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Результаты опроса</h2>
                <p className="text-xs text-gray-500">391 респондент из 8 районов</p>
              </div>
              <div className="h-[65vh] p-6">
                <SurveyCharts
                  selectedDistrict={selectedDistrict}
                  onDistrictSelect={handleDistrictSelect}
                  csvUrl={urls.surveyCsv}
                />
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-gray-900">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Источники данных</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2"><span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>GeoJSON районов Алматы</li>
                <li className="flex items-center gap-2"><span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500"></span>Опрос населения (391 ответ)</li>
                <li className="flex items-center gap-2"><span className="inline-block w-1.5 h-1.5 rounded-full bg-violet-500"></span>Рекомендации по развитию</li>
              </ul>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-gray-900">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Ключевые показатели</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Охват районов</span><span className="font-medium">8 из 8</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Всего ответов</span><span className="font-medium">391</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Период опроса</span><span className="font-medium">Март 2025</span></div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-gray-900">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Как использовать</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>Кликните на район на карте для детального анализа</li>
                <li>Используйте диаграммы для сравнения районов</li>
                <li>Переключайтесь между вкладками в графиках</li>
              </ul>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}


// components/Sidebar.tsx
import React from 'react';
import { totalRespondents, summaryStats } from '@/lib/surveyData';

interface SidebarProps { className?: string }

export default function Sidebar({ className = '' }: SidebarProps) {
  return (
    <aside className={`w-64 hidden lg:block ${className}`} aria-label="Sidebar">
      <div className="h-full sticky top-0 border-r border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl">
        <div className="p-6 space-y-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-800 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-sm font-semibold tracking-tight">Алматы Спорт</h1>
                <p className="text-xs text-gray-500">Аналитическая панель</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Статус</span>
              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-xs">● Опрос завершен</span>
            </div>
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
              <div className="text-2xl font-semibold">{totalRespondents.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Всего респондентов • март 2025</div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Ключевые показатели</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-gray-500">Районов</dt><dd className="font-medium">{summaryStats.totalDistricts}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Лидер</dt><dd className="truncate max-w-[9rem] font-medium">{summaryStats.topDistrict.name}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Возраст</dt><dd className="font-medium">{summaryStats.topAgeGroup.name}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Активных</dt><dd className="font-medium">{summaryStats.activeParticipants}</dd></div>
            </dl>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Инсайты</h3>
            <ul className="mt-3 space-y-2 text-xs text-gray-600 dark:text-gray-300 list-disc list-inside">
              <li>Бостандыкский район — наибольшая активность</li>
              <li>36–45 лет — наиболее вовлеченная группа</li>
              <li>Высокая регулярность занятий спортом</li>
            </ul>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            <p className="text-[11px] text-gray-500">Обновлено: {new Date().toLocaleDateString('ru-RU')}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}


// components/StatsCards.tsx
import React from 'react';
import { districtData, ageData, totalRespondents, summaryStats } from '@/lib/surveyData';

interface StatCardProps {
  value: string | number;
  label: string;
  subtitle?: string;
}

function StatCard({ value, label, subtitle }: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="space-y-1">
        <div className="text-2xl font-semibold tracking-tight">{typeof value === 'number' ? value.toLocaleString() : value}</div>
        <div className="text-sm text-gray-600 dark:text-gray-300">{label}</div>
        {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
      </div>
    </div>
  );
}

export default function StatsCards() {
  const topDistrict = districtData[0];
  const topAgeGroup = ageData.reduce((prev, current) => (prev.value > current.value ? prev : current));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard value={districtData.length} label="Районов охвачено" subtitle="Все административные районы" />
      <StatCard value={topDistrict.value} label={topDistrict.name} subtitle={`${topDistrict.percentage}% от общего числа`} />
      <StatCard value={topAgeGroup.value} label={`Возраст ${topAgeGroup.name}`} subtitle={`${topAgeGroup.percentage}% респондентов`} />
      <StatCard value={totalRespondents} label="Всего ответов" subtitle="Высокий уровень участия" />
      <div className="md:col-span-2 lg:col-span-4 rounded-xl border border-gray-200 dark:border-gray-800 p-6 bg-white/90 dark:bg-gray-900/70 backdrop-blur-xl">
        <h3 className="text-base font-semibold tracking-tight mb-2">Краткий обзор</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 max-w-3xl">
          Проведен комплексный опрос жителей города Алматы по вопросам развития спортивной инфраструктуры. Высокий
          уровень участия и равномерное распределение по районам обеспечивают репрезентативность результатов.
        </p>
        <div className="mt-4 flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300">
          <span><span className="font-semibold">{Math.round((summaryStats.activeParticipants / totalRespondents) * 100)}%</span> активных</span>
          <span><span className="font-semibold">{summaryStats.totalDistricts}</span> районов</span>
          <span><span className="font-semibold">{topAgeGroup.percentage}%</span> лидер возраст</span>
        </div>
      </div>
    </div>
  );
}


// components/MapView.tsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { districtData } from '@/lib/surveyData';

interface MapViewProps {
  selectedDistrict: string | null;
  onDistrictSelect: (district: string) => void;
  districtsGeoJsonUrl?: string;
  pointsCsvUrl?: string;
}

interface GeoJsonFeature { type: 'Feature'; properties: { [key: string]: any }; geometry: { type: string; coordinates: any } }
interface GeoJsonData { type: string; features: GeoJsonFeature[] }
interface PointData { id: string; name: string; lat: number; lng: number; district: string; category: string }

export default function MapView({ selectedDistrict, onDistrictSelect, districtsGeoJsonUrl, pointsCsvUrl }: MapViewProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [geoData, setGeoData] = useState<GeoJsonData | null>(null);
  const [pointsData, setPointsData] = useState<PointData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (districtsGeoJsonUrl) {
      setLoading(true);
      fetch(districtsGeoJsonUrl)
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`Failed to load GeoJSON: ${r.status}`))))
        .then((data: GeoJsonData) => { setGeoData(data); setLoading(false); })
        .catch((err) => { console.error(err); setError('Не удалось загрузить данные районов'); setLoading(false); });
    }
  }, [districtsGeoJsonUrl]);

  useEffect(() => {
    if (pointsCsvUrl) {
      fetch(pointsCsvUrl)
        .then((r) => (r.ok ? r.text() : Promise.reject(new Error(`Failed to load CSV: ${r.status}`))))
        .then((csv) => {
          const lines = csv.split('\n');
          const headers = lines[0].split(',').map((h) => h.trim());
          const points: PointData[] = [];
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map((v) => v.trim());
            if (values.length >= headers.length) {
              points.push({ id: values[0] || `point_${i}`, name: values[1] || 'Unknown', lat: parseFloat(values[2]) || 0, lng: parseFloat(values[3]) || 0, district: values[4] || 'Unknown', category: values[5] || 'Other' });
            }
          }
          setPointsData(points);
        })
        .catch((err) => { console.error(err); setError('Не удалось загрузить данные точек'); });
    }
  }, [pointsCsvUrl]);

  const handleIframeLoad = () => {
    setMapLoaded(true);
    setShowPlaceholder(false);
    if (iframeRef.current && (geoData || pointsData.length > 0)) {
      iframeRef.current.contentWindow?.postMessage({ type: 'map-data', geoData, pointsData, selectedDistrict }, '*');
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => { if (event.data && event.data.type === 'district-click') onDistrictSelect(event.data.district); };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onDistrictSelect]);

  useEffect(() => {
    if (iframeRef.current && mapLoaded) {
      iframeRef.current.contentWindow?.postMessage({ type: 'district-selected', district: selectedDistrict }, '*');
    }
  }, [selectedDistrict, mapLoaded]);

  const districtStats = districtData.map((d) => ({ ...d, pointsCount: pointsData.filter((p) => p.district === d.name).length }));

  return (
    <div className="h-full flex flex-col rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h3 className="text-base font-semibold tracking-tight">Карта</h3>
          <p className="text-xs text-gray-500">Интерактивная карта с результатами опроса {pointsData.length > 0 && ` • ${pointsData.length} объектов`}</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          {loading && <span className="text-gray-500">Загрузка…</span>}
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${error ? 'bg-red-100 text-red-700' : mapLoaded ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {error ? 'Ошибка' : mapLoaded ? 'Готово' : 'Загрузка'}
          </span>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <iframe
          ref={iframeRef}
          src="/map/Almaty_Smart_Recommendations_Fixed.html"
          className="w-full h-full border-0"
          title="Almaty Interactive Map"
          onLoad={handleIframeLoad}
          style={{ display: showPlaceholder ? 'none' : 'block' }}
        />

        {showPlaceholder && (
          <div className="absolute inset-0 grid place-items-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <div className="w-10 h-10 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-600 dark:text-gray-300">Инициализация карты…</p>
            </div>
            <div className="absolute inset-4 grid grid-cols-4 gap-2">
              {districtStats.slice(0, 8).map((district) => (
                <button
                  key={district.name}
                  onClick={() => onDistrictSelect(selectedDistrict === district.name ? '' : district.name)}
                  className={`text-left rounded-lg p-3 border transition-all ${selectedDistrict === district.name ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'} bg-white/80 dark:bg-gray-800/70`}
                  style={{ borderLeftColor: district.color, borderLeftWidth: 4 }}
                >
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate">{district.name}</div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-lg font-semibold" style={{ color: district.color }}>{district.value}</span>
                    {district.pointsCount > 0 && (
                      <span className="text-[11px] px-1.5 rounded bg-emerald-50 text-emerald-700">{district.pointsCount}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Легенда</h4>
            <ul className="space-y-1 text-gray-600 dark:text-gray-300">
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"/>Высокая активность</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"/>Средняя активность</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"/>Объекты спорта</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Источники</h4>
            <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
              <li className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${geoData ? 'bg-emerald-500' : 'bg-gray-300'}`} />GeoJSON районов</li>
              <li className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${pointsData.length > 0 ? 'bg-emerald-500' : 'bg-gray-300'}`} />CSV точек ({pointsData.length})</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500" />Опрос (391 ответ)</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Текущий выбор</h4>
            {selectedDistrict ? (
              <div className="rounded-md border border-blue-200 bg-blue-50 text-blue-900 p-2 text-xs">
                <div className="font-medium">{selectedDistrict}</div>
                <div className="opacity-80">
                  {districtStats.find((d) => d.name === selectedDistrict)?.value} ответов •{' '}
                  {districtStats.find((d) => d.name === selectedDistrict)?.pointsCount || 0} объектов
                </div>
              </div>
            ) : (
              <div className="text-xs text-gray-500">Кликните на район для просмотра деталей</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


// components/SurveyCharts.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { ageData, districtData, activityFrequencyData, totalRespondents } from '@/lib/surveyData';
import { loadCSVFromUrl, processSurveyData, validateSurveyCSV, getSummaryStats } from '@/lib/csvUtils';

interface SurveyChartsProps { selectedDistrict: string | null; onDistrictSelect: (district: string) => void; csvUrl?: string }

interface ChartBarProps { item: { name: string; value: number; percentage: number; color: string }; maxPercentage: number; isSelected?: boolean; onClick?: () => void; showValue?: boolean; showPercentage?: boolean }

function ChartBar({ item, maxPercentage, isSelected = false, onClick, showValue = true, showPercentage = true }: ChartBarProps) {
  return (
    <button
      className={`w-full flex items-center p-2 rounded-lg transition-colors ${onClick ? 'hover:bg-gray-50 dark:hover:bg-gray-800' : ''} ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-200' : ''}`}
      onClick={onClick}
    >
      <div className="w-28 text-xs text-gray-700 dark:text-gray-200 font-medium truncate pr-2">{item.name}</div>
      <div className="flex-1 mx-3 relative">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${Math.max((item.percentage / maxPercentage) * 100, 2)}%`, backgroundColor: item.color }} />
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs">
        {showValue && <span className="font-medium text-gray-700 dark:text-gray-200 w-8 text-right">{item.value}</span>}
        {showPercentage && <span className="text-gray-500 dark:text-gray-400 w-8 text-right">{item.percentage}%</span>}
      </div>
    </button>
  );
}

function LoadingSpinner() {
  return (
    <div className="h-full grid place-items-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-sm text-gray-600">Загрузка данных опроса…</p>
      </div>
    </div>
  );
}

function ErrorDisplay({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="h-full grid place-items-center">
      <div className="text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full grid place-items-center mx-auto mb-3">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
        </div>
        <h4 className="text-sm font-semibold mb-1">Ошибка загрузки данных</h4>
        <p className="text-xs text-gray-600 mb-3">{error}</p>
        <button onClick={onRetry} className="text-xs bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700">Повторить</button>
      </div>
    </div>
  );
}

export default function SurveyCharts({ selectedDistrict, onDistrictSelect, csvUrl }: SurveyChartsProps) {
  const [activeTab, setActiveTab] = useState<'districts' | 'age' | 'activity'>('districts');
  const [dynamicData, setDynamicData] = useState<{ age: typeof ageData; districts: typeof districtData; activity: typeof activityFrequencyData; total: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'static' | 'dynamic'>('static');

  const loadData = async () => {
    if (!csvUrl) return;
    setLoading(true);
    setError(null);
    try {
      const csvData = await loadCSVFromUrl(csvUrl);
      if (!validateSurveyCSV(csvData)) throw new Error('CSV не содержит необходимые колонки (age, district)');
      const processed = processSurveyData(csvData);
      setDynamicData({ age: processed.age, districts: processed.districts, activity: processed.activity, total: processed.total });
      setDataSource('dynamic');
      setLoading(false);
      console.log('CSV OK:', getSummaryStats(csvData));
    } catch (err) {
      console.error('CSV error:', err);
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      setDynamicData({ age: ageData, districts: districtData, activity: activityFrequencyData, total: totalRespondents });
      setDataSource('static');
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [csvUrl]);

  const currentAgeData = dynamicData?.age ?? ageData;
  const currentDistrictData = dynamicData?.districts ?? districtData;
  const currentActivityData = dynamicData?.activity ?? activityFrequencyData;
  const currentTotal = dynamicData?.total ?? totalRespondents;

  const maxDistrictPercentage = Math.max(...currentDistrictData.map((d) => d.percentage));
  const maxAgePercentage = Math.max(...currentAgeData.map((d) => d.percentage));
  const maxActivityPercentage = Math.max(...currentActivityData.map((d) => d.percentage));

  if (loading) return <LoadingSpinner />;
  if (error && !dynamicData) return <ErrorDisplay error={error} onRetry={loadData} />;

  const tabs = [
    { id: 'districts', label: 'Районы', count: currentDistrictData.length },
    { id: 'age', label: 'Возраст', count: currentAgeData.length },
    { id: 'activity', label: 'Активность', count: currentActivityData.length },
  ] as const;

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold tracking-tight">Аналитика опроса</h2>
        <div className="flex items-center gap-2">
          {error && <span className="text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded">Статические данные</span>}
          <span className={`text-xs px-2 py-0.5 rounded ${dataSource === 'dynamic' ? 'text-emerald-700 bg-emerald-100' : 'text-gray-600 bg-gray-100'}`}>
            {dataSource === 'dynamic' ? '● Динамические данные' : '● Статические данные'}
          </span>
        </div>
      </div>

      <div className="mb-3">
        <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-800 p-1 bg-white dark:bg-gray-900">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id as any)} className={`px-3 py-1.5 rounded-md text-sm ${activeTab === t.id ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800/60'}`}>
              {t.label} <span className="opacity-60">({t.count})</span>
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-500 mb-2">Детальный анализ {currentTotal.toLocaleString()} ответов</p>

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto space-y-2 pr-1">
          {activeTab === 'districts' && (
            <>
              {currentDistrictData.map((item, i) => (
                <ChartBar key={i} item={item} maxPercentage={maxDistrictPercentage} isSelected={selectedDistrict === item.name} onClick={() => onDistrictSelect(selectedDistrict === item.name ? '' : item.name)} />
              ))}
            </>
          )}

          {activeTab === 'age' && (
            <>
              {currentAgeData.map((item, i) => (
                <ChartBar key={i} item={item} maxPercentage={maxAgePercentage} />
              ))}
            </>
          )}

          {activeTab === 'activity' && (
            <>
              {currentActivityData.map((item, i) => (
                <ChartBar key={i} item={item} maxPercentage={maxActivityPercentage} />
              ))}
            </>
          )}
        </div>
      </div>

      {selectedDistrict && (
        <div className="mt-3 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
          <div className="font-medium">{selectedDistrict}</div>
          <div className="text-xs opacity-80">
            {currentDistrictData.find((d) => d.name === selectedDistrict)?.value} ответов •{' '}
            {currentDistrictData.find((d) => d.name === selectedDistrict)?.percentage}% от общего • №{' '}
            {currentDistrictData.findIndex((d) => d.name === selectedDistrict) + 1}
          </div>
        </div>
      )}
    </div>
  );
}


// components/AnalyticsDashboard.tsx
'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import StatsCards from '../components/StatsCards';
import MapView from '../components/MapView';
import SurveyCharts from '../components/SurveyCharts';

export default function AnalyticsDashboard() {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { const t = setTimeout(() => setIsLoading(false), 600); return () => clearTimeout(t); }, []);
  const handleDistrictSelect = (d: string) => setSelectedDistrict(d === selectedDistrict ? null : d);

  if (isLoading) {
    return (
      <div className="flex h-screen bg-white dark:bg-gray-950">
        <div className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/70" />
        <div className="flex-1 grid place-items-center">
          <div className="text-center">
            <div className="w-14 h-14 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin mx-auto mb-3" />
            <h2 className="text-lg font-medium mb-1">Загрузка аналитики</h2>
            <p className="text-sm text-gray-500">Подготовка данных опроса…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white dark:bg-gray-950">
      <Sidebar className="fixed h-full z-10" />
      <div className="flex-1 ml-64 overflow-auto">
        <div className="p-6">
          <header className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight mb-1">Развитие спортивной инфраструктуры г. Алматы</h1>
                <p className="text-gray-500 max-w-2xl">Комплексный анализ результатов опроса населения по вопросам развития спортивной инфраструктуры города Алматы</p>
              </div>
              <div className="text-right text-sm text-gray-500">
                <div>Последнее обновление</div>
                <div className="font-medium text-gray-900 dark:text-gray-100">{new Date().toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              </div>
            </div>
          </header>

          <StatsCards />

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="col-span-2">
              <MapView selectedDistrict={selectedDistrict} onDistrictSelect={handleDistrictSelect} />
            </div>
            <div>
              <SurveyCharts selectedDistrict={selectedDistrict} onDistrictSelect={handleDistrictSelect} />
            </div>
          </div>

          <footer className="text-center py-8 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-600">
            Данные актуальны на {new Date().toLocaleDateString('ru-RU')} г. • Всего респондентов: 391 • Охват: 8 районов
          </footer>
        </div>
      </div>
    </div>
  );
}
