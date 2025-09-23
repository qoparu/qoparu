// app/page.tsx
"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import Sidebar from "@/components/Sidebar";
import StatsCards from "@/components/StatsCards";
import SurveyCharts from "@/components/SurveyCharts";
import SportsBanner from "@/components/SportsBanner";

// Dynamic import for MapView to prevent SSR issues
const MapView = dynamic(() => import("@/components/MapView"), { 
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-3xl border border-gray-200">
      <div className="text-center p-8">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Загрузка карты...</p>
      </div>
    </div>
  )
});

export default function Page() {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  
  const urls = useMemo(
    () => ({
      districts: "/data/almaty_districts.geojson",
      existingCsv: "/data/smart_recommendations.csv",
      surveyCsv: "/data/questionnaire_sport_survey.csv",
    }),
    []
  );

  const handleDistrictSelect = (district: string) => {
    setSelectedDistrict(district === selectedDistrict ? null : district);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(99,102,241,0.05)_1px,transparent_0)] [background-size:20px_20px]"></div>
      
      <div className="relative flex min-h-screen">
        {/* Sidebar */}
        <Sidebar className="fixed h-full z-20" />
        
        {/* Main Content */}
        <main className="flex-1 ml-72 space-y-8">
          {/* Sports Banner - Full Width */}
          <SportsBanner className="shadow-lg" />
          
          {/* Content with padding */}
          <div className="p-8 space-y-8">
            {/* Header */}
            <header className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full mb-6">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Анализ завершен
              </div>
              
              <h1 className="text-5xl font-bold text-gray-900 tracking-tight mb-4 leading-tight">
                Развитие инфраструктуры для
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> отдыха и спорта</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                Комплексный анализ результатов опроса населения города Алматы по развитию 
                спортивной инфраструктуры на основе 391 ответа из 8 районов
              </p>
              
              <div className="flex items-center justify-center space-x-6 mt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">391</div>
                  <div className="text-sm text-gray-500 font-medium">Респондентов</div>
                </div>
                <div className="w-px h-8 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">8</div>
                  <div className="text-sm text-gray-500 font-medium">Районов</div>
                </div>
                <div className="w-px h-8 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">44</div>
                  <div className="text-sm text-gray-500 font-medium">Объектов</div>
                </div>
                <div className="w-px h-8 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">Март 2025</div>
                  <div className="text-sm text-gray-500 font-medium">Период</div>
                </div>
              </div>
            </header>

            {/* Stats Cards */}
            <section>
              <StatsCards />
            </section>

            {/* Main Dashboard Grid */}
            <section className="grid grid-cols-1 xl:grid-cols-5 gap-8">
              {/* Map Container */}
              <div className="xl:col-span-3">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
                    Карта районов Алматы
                  </h2>
                  <p className="text-gray-600">
                    Интерактивная визуализация распределения респондентов по районам города
                  </p>
                  {selectedDistrict && (
                    <div className="mt-3 inline-flex items-center px-4 py-2 bg-blue-50 text-blue-800 text-sm font-semibold rounded-full border border-blue-200">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      Выбран: {selectedDistrict}
                    </div>
                  )}
                </div>
                <div className="h-[70vh]">
                  <MapView
                    selectedDistrict={selectedDistrict}
                    onDistrictSelect={handleDistrictSelect}
                    districtsGeoJsonUrl={urls.districts}
                    pointsCsvUrl={urls.existingCsv}
                  />
                </div>
              </div>

              {/* Survey Charts Container */}
              <div className="xl:col-span-2">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
                    Результаты опроса
                  </h2>
                  <p className="text-gray-600">
                    Детальная аналитика по возрастным группам, районам и активности
                  </p>
                </div>
                
                <div className="h-[70vh]">
                  <SurveyCharts
                    selectedDistrict={selectedDistrict}
                    onDistrictSelect={handleDistrictSelect}
                    csvUrl={urls.surveyCsv}
                  />
                </div>
              </div>
            </section>

            {/* Additional Insights */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Key Insights */}
              <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">
                  Ключевые выводы исследования
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      title: "Высокий отклик",
                      description: "391 респондент из всех районов города обеспечивает репрезентативность результатов",
                      color: "emerald"
                    },
                    {
                      title: "Активная аудитория", 
                      description: "Возрастная группа 36-45 лет показывает наибольшую заинтересованность в развитии спорта",
                      color: "blue"
                    },
                    {
                      title: "Районы-лидеры",
                      description: "Бостандыкский и Медеуский районы демонстрируют наибольшую активность в опросе",
                      color: "purple"
                    },
                    {
                      title: "Спортивная активность",
                      description: "Большинство респондентов занимаются спортом несколько раз в неделю или ежедневно",
                      color: "orange"
                    }
                  ].map((insight, index) => (
                    <div key={index} className="group p-6 rounded-2xl bg-gray-50/50 hover:bg-gray-100/50 transition-all duration-300 hover:scale-105">
                      <div className="flex items-start space-x-4">
                        <div className={`w-3 h-3 bg-${insight.color}-500 rounded-full mt-2 shadow-lg group-hover:scale-125 transition-transform`}></div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-2">{insight.title}</h4>
                          <p className="text-sm text-gray-600 leading-relaxed">{insight.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">
                  Быстрые действия
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      title: "Экспорт данных",
                      description: "Скачать результаты в Excel",
                      icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      ),
                      gradient: "from-blue-500 to-cyan-500"
                    },
                    {
                      title: "Создать отчет",
                      description: "Генерация PDF отчета",
                      icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      ),
                      gradient: "from-emerald-500 to-teal-500"
                    },
                    {
                      title: "Поделиться",
                      description: "Отправить результаты",
                      icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                      ),
                      gradient: "from-purple-500 to-pink-500"
                    },
                    {
                      title: "Настройки",
                      description: "Конфигурация панели",
                      icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      ),
                      gradient: "from-orange-500 to-red-500"
                    }
                  ].map((action, index) => (
                    <button 
                      key={index}
                      className="w-full group p-4 text-left rounded-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r opacity-5 group-hover:opacity-10 transition-opacity"
                           style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }}></div>
                      <div className="relative flex items-center space-x-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${action.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                          {action.icon}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                            {action.title}
                          </div>
                          <div className="text-sm text-gray-600 group-hover:text-gray-500 transition-colors">
                            {action.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="text-center py-12 border-t border-gray-200/50">
              <div className="max-w-2xl mx-auto">
                <h4 className="text-lg font-bold text-gray-900 mb-3">
                  Аналитическая панель развития спортивной инфраструктуры города Алматы
                </h4>
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                  <span>Данные актуальны на {new Date().toLocaleDateString('ru-RU')}</span>
                  <span className="w-px h-4 bg-gray-300"></span>
                  <span>Всего респондентов: 391</span>
                  <span className="w-px h-4 bg-gray-300"></span>
                  <span>Охват: 8 районов</span>
                </div>
              </div>
            </footer>

            {/* Debug Info (development only) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-2xl">
                <h4 className="text-lg font-bold text-amber-800 mb-3">
                  Отладочная информация (только в разработке)
                </h4>
                <div className="grid grid-cols-3 gap-4 text-sm text-amber-700">
                  <div>
                    <span className="font-semibold">Выбранный район:</span>
                    <span className="ml-2">{selectedDistrict || 'не выбран'}</span>
                  </div>
                  <div>
                    <span className="font-semibold">URLs настроены:</span>
                    <span className="ml-2">{Object.keys(urls).join(', ')}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Динамический импорт:</span>
                    <span className="ml-2">активен</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}