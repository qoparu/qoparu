// components/AnalyticsDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import StatsCards from './StatsCards';
import MapView from './MapView';
import SurveyCharts from './SurveyCharts';

export default function AnalyticsDashboard() {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleDistrictSelect = (district: string) => {
    setSelectedDistrict(district === selectedDistrict ? null : district);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="w-64 bg-indigo-900"></div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Загрузка аналитики</h2>
            <p className="text-gray-500">Подготовка данных опроса...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar className="fixed h-full z-10" />

      {/* Main Content */}
      <div className="flex-1 ml-64 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Развитие спортивной инфраструктуры г. Алматы
                </h1>
                <p className="text-gray-600 max-w-2xl">
                  Комплексный анализ результатов опроса населения по вопросам развития 
                  спортивной инфраструктуры города Алматы
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Последнее обновление</div>
                <div className="text-sm font-semibold text-gray-900">
                  {new Date().toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
            
            {/* Breadcrumb */}
            <nav className="flex text-sm text-gray-500">
              <span>Главная</span>
              <span className="mx-2">/</span>
              <span>Аналитика</span>
              <span className="mx-2">/</span>
              <span className="text-gray-900">Спортивная инфраструктура</span>
            </nav>
          </header>

          {/* Stats Cards */}
          <StatsCards />

          {/* Main Content Grid */}
          <div className="grid grid-cols-3 gap-8 mb-8">
            {/* Map Section */}
            <MapView 
              selectedDistrict={selectedDistrict}
              onDistrictSelect={handleDistrictSelect}
            />

            {/* Survey Charts */}
            <SurveyCharts 
              selectedDistrict={selectedDistrict}
              onDistrictSelect={handleDistrictSelect}
            />
          </div>

          {/* Additional Insights Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Key Findings */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ключевые выводы исследования
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900">Высокий отклик</h4>
                      <p className="text-sm text-gray-600">
                        391 респондент из всех районов города обеспечивает 
                        репрезентативность результатов
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900">Активная аудитория</h4>
                      <p className="text-sm text-gray-600">
                        Возрастная группа 36-45 лет показывает наибольшую 
                        заинтересованность в развитии спорта
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900">Районы-лидеры</h4>
                      <p className="text-sm text-gray-600">
                        Бостандыкский и Медеуский районы демонстрируют 
                        наибольшую активность в опросе
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900">Спортивная активность</h4>
                      <p className="text-sm text-gray-600">
                        Большинство респондентов занимаются спортом 
                        несколько раз в неделю или ежедневно
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Быстрые действия
              </h3>
              <div className="space-y-3">
                <button className="w-full p-3 text-left bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
                  <div className="font-semibold text-sm text-indigo-900">Экспорт данных</div>
                  <div className="text-xs text-indigo-600">Скачать результаты в Excel</div>
                </button>
                <button className="w-full p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                  <div className="font-semibold text-sm text-green-900">Создать отчет</div>
                  <div className="text-xs text-green-600">Генерация PDF отчета</div>
                </button>
                <button className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <div className="font-semibold text-sm text-blue-900">Поделиться</div>
                  <div className="text-xs text-blue-600">Отправить результаты</div>
                </button>
                <button className="w-full p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                  <div className="font-semibold text-sm text-purple-900">Настройки</div>
                  <div className="text-xs text-purple-600">Конфигурация панели</div>
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center py-8 border-t border-gray-200">
            <div className="text-sm text-gray-600 mb-2">
              Аналитическая панель развития спортивной инфраструктуры города Алматы
            </div>
            <div className="text-xs text-gray-500">
              Данные актуальны на {new Date().toLocaleDateString('ru-RU')} г. | 
              Всего респондентов: 391 | 
              Охват: 8 районов
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}