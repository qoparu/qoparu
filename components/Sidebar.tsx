// components/Sidebar.tsx
"use client";

import { useState, useEffect } from "react";
import { loadCSVFromUrl, processSurveyData } from '@/lib/csvUtils'; // Import necessary functions

export default function Sidebar() {
  const [open] = useState(true);
  const [totalRespondents, setTotalRespondents] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTotalRespondents = async () => {
      try {
        const csvUrl = '/data/questionnaire_sport_survey.csv'; // Assuming this is the correct path
        const csvData = await loadCSVFromUrl(csvUrl);
        const processedData = processSurveyData(csvData);
        setTotalRespondents(processedData.total);
      } catch (err) {
        console.error("Failed to load total respondents:", err);
        setError("Ошибка загрузки данных");
      } finally {
        setLoading(false);
      }
    };

    fetchTotalRespondents();
  }, []);

  return (
    <aside
      className={`${
        open ? "w-60" : "w-14"
      } hidden md:flex flex-col bg-slate-800 text-white min-h-screen sticky top-0`}
    >
      <div className="px-4 py-5 text-lg font-semibold border-b border-slate-700">
        Модуль 24
      </div>
      <nav className="p-3 space-y-2 text-sm">
        <div className="rounded-md px-3 py-2 bg-slate-700/60">
          🧭 Аналитика: текущая ситуация
        </div>
        <div className="rounded-md px-3 py-2 hover:bg-slate-700/40 cursor-pointer">
          🗺️ Рекомендации на карте
        </div>
        <div className="rounded-md px-3 py-2 hover:bg-slate-700/40 cursor-pointer">
          📊 Результаты опроса
        </div>
      </nav>
      <div className="mb-8 text-center">
        <div className="bg-white bg-opacity-10 rounded-lg p-4">
          {loading && <div className="text-xl font-bold mb-1">Загрузка...</div>}
          {error && <div className="text-xl font-bold mb-1 text-red-400">{error}</div>}
          {totalRespondents !== null && !loading && !error && (
            <div className="text-3xl font-bold mb-1">{totalRespondents.toLocaleString()}</div>
          )}
          <div className="text-sm text-indigo-200">Всего респондентов</div>
          <div className="mt-2 text-xs text-indigo-300">
            Период: март 2025
          </div>
        </div>
      </div>
      <div className="mt-auto p-3 text-xs text-slate-300">
        © Алматы, Центр Развития
      </div>
    </aside>
  );
}