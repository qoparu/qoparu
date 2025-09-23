// components/Sidebar.tsx
"use client";

import { useState } from "react";

export default function Sidebar() {
  const [open] = useState(true);
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
      <div className="mt-auto p-3 text-xs text-slate-300">
        © Алматы, Центр Развития
      </div>
    </aside>
  );
}
