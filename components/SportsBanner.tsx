import React from 'react';
import { Dumbbell, Football, LayoutGrid } from 'lucide-react';

// Пользовательская иконка для волейбола для соответствия стилю
const VolleyballIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a10 10 0 0 0-10 10c0 3.9 2.22 7.29 5.5 8.94" />
    <path d="M12 22a10 10 0 0 1 10-10c0-3.9-2.22-7.29-5.5-8.94" />
    <path d="M2 12h20" />
  </svg>
);

// Пользовательская иконка для тенниса
const TennisIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="7" />
        <path d="m21.44 11.32-9.04-9.04" />
        <path d="m15.12 2.88 5.66 5.66" />
        <path d="m2.88 15.12 5.66 5.66" />
        <circle cx="17.5" cy="17.5" r="1.5" />
    </svg>
);

// Пользовательская иконка для баскетбола
const BasketballIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M7 21a10 10 0 0 0 10-10" />
        <path d="M21 7a10 10 0 0 0-10-5" />
        <path d="M3 7a10 10 0 0 1 10 5" />
        <path d="M17 3a10 10 0 0 1-5 10" />
    </svg>
);


const SportCard = ({ sport }) => (
  <div className="group relative overflow-hidden rounded-3xl backdrop-blur-sm border border-white/20 bg-white/10 transition-all duration-300 hover:border-white/40 hover:bg-white/20">
    <div className="relative p-6 text-center">
      <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${sport.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        {sport.icon}
      </div>
      <div className="text-4xl lg:text-5xl font-bold text-white mb-1 tracking-tight group-hover:scale-105 transition-transform duration-300">
        {sport.count}
      </div>
      <div className="text-lg font-semibold text-white/90 capitalize">
        {sport.name}
      </div>
      <div className="text-sm font-light text-white/70">
        {sport.subtitle}
      </div>
    </div>
    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
  </div>
);

function SportsBanner({ className = '' }) {
  const sportsData = [
    {
      name: 'Всего площадок',
      subtitle: 'Доступно для всех',
      count: 150,
      gradient: 'from-indigo-500 to-purple-600',
      icon: <LayoutGrid className="w-8 h-8 text-white" />
    },
    {
      name: 'Футбольные поля',
      subtitle: 'Объектов',
      count: 80,
      gradient: 'from-emerald-500 to-green-600',
      icon: <Football className="w-8 h-8 text-white" />
    },
    {
      name: 'Воркаут',
      subtitle: 'Объектов',
      count: 50,
      gradient: 'from-sky-500 to-blue-600',
      icon: <Dumbbell className="w-8 h-8 text-white" />
    },
    {
      name: 'Баскетбол',
      subtitle: 'Объектов',
      count: 60,
      gradient: 'from-amber-500 to-orange-600',
      icon: <BasketballIcon className="w-8 h-8 text-white" />
    },
    {
      name: 'Волейбол',
      subtitle: 'Объектов',
      count: 30,
      gradient: 'from-yellow-400 to-yellow-500',
      icon: <VolleyballIcon className="w-8 h-8 text-white" />
    },
    {
      name: 'Теннисные корты',
      subtitle: 'Объектов',
      count: 20,
      gradient: 'from-lime-500 to-green-500',
      icon: <TennisIcon className="w-8 h-8 text-white" />
    },
  ];

  return (
    <div className={`relative overflow-hidden ${className} antialiased`}>
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900"></div>
      
      <div 
        className="absolute inset-0 opacity-10" 
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)',
          backgroundSize: '100px 100px',
        }}
      ></div>
      
      <div className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">Спортивные объекты</h1>
            <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">Обзор доступных площадок в вашем районе</p>
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sportsData.map((sport, index) => (
              <SportCard key={index} sport={sport} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
    return (
        <div className="bg-gray-900 min-h-screen">
            <SportsBanner />
        </div>
    )
}