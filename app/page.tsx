// app/page.tsx
"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import Sidebar from "@/components/Sidebar";
import StatsCards from "@/components/StatsCards";
import SurveyCharts from "@/components/SurveyCharts";

// Dynamic import for MapView to prevent SSR issues
const MapView = dynamic(() => import("@/components/MapView"), { 
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-sm text-gray-600">Загрузка карты...</p>
      </div>
    </div>
  )
});

export default function Page() {
  // State for district selection and interactivity
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  
  // Your data URLs (keeping your structure)
  const urls = useMemo(
    () => ({
      districts: "/data/almaty_districts.geojson",
      existingCsv: "/data/smart_recommendations.csv",
      surveyCsv: "/data/questionnaire_sport_survey.csv",
    }),
    []
  );

  // Handle district selection from either map or charts
  const handleDistrictSelect = (district: string) => {
    console.log("District selected in handleDistrictSelect (from SurveyCharts or MapView):", district); // Added console.log
    setSelectedDistrict(district === selectedDistrict ? null : district);
  };

  return (
    <div className="flex flex-row-reverse min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content with your background pattern */}
      <main className="flex-1 p-6 lg:p-8 bg-main-pattern bg-no-repeat bg-right-top">
        <div className="">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Развитие инфраструктуры для отдыха и спорта
            </h1>
            <p className="text-gray-600">
              Анализ результатов опроса населения города Алматы по развитию спортивной инфраструктуры
            </p>
          </div>

          {/* Stats Cards */}
          <StatsCards />

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-8">
            {/* Map Container */}
            <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Карта районов Алматы
                </h2>
                {selectedDistrict && (
                  <div className="text-sm text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg inline-block">
                    Выбран: {selectedDistrict}
                  </div>
                )}
              </div>
              <div className="h-[65vh]">
                <MapView
                  selectedDistrict={selectedDistrict}
                  onDistrictSelect={handleDistrictSelect}
                  // Your additional props (if MapView component supports them)
                  districtsGeoJsonUrl={urls.districts}
                  pointsCsvUrl={urls.existingCsv}
                />
              </div>
            </div>

            {/* Survey Charts Container */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Результаты опроса
                </h2>
                <p className="text-sm text-gray-600">
                  391 респондент из 8 районов
                </p>
              </div>
              
              {/* Charts with same height as map */}
              <div className="h-[65vh] overflow-hidden">
                <SurveyCharts
                  selectedDistrict={selectedDistrict}
                  onDistrictSelect={handleDistrictSelect}
                  // Your additional prop (if component supports it)
                  csvUrl={urls.surveyCsv}
                />
              </div>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Data Sources Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Источники данных
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">GeoJSON районов Алматы</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Опрос населения (391 ответ)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-600">Рекомендации по развитию</span>
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Ключевые показатели
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Охват районов:</span>
                  <span className="font-semibold text-gray-800">8 из 8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Всего ответов:</span>
                  <span className="font-semibold text-gray-800">391</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Период опроса:</span>
                  <span className="font-semibold text-gray-800">Март 2025</span>
                </div>
              </div>
            </div>

            {/* Interactive Help */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100">
              <h3 className="text-lg font-semibold text-indigo-900 mb-3">
                Как использовать
              </h3>
              <div className="space-y-2 text-sm text-indigo-700">
                <div className="flex items-start space-x-2">
                  <div className="w-1 h-1 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Кликните на район на карте для детального анализа</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1 h-1 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Используйте диаграммы для сравнения районов</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1 h-1 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Переключайтесь между вкладками в графиках</span>
                </div>
              </div>
            </div>
          </div>

          {/* Debug Info (remove in production) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="text-sm font-semibold text-yellow-800 mb-2">
                Отладочная информация (только в разработке)
              </h4>
              <div className="text-xs text-yellow-700 space-y-1">
                <div>Выбранный район: {selectedDistrict || 'не выбран'}</div>
                <div>URLs настроены: {Object.keys(urls).join(', ')}</div>
                <div>Динамический импорт карты: активен</div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}