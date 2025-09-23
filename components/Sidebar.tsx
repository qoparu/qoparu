// components/Sidebar.tsx
import { FiGrid } from "react-icons/fi"; // Пример иконки, установи `react-icons`

const Sidebar = () => {
  return (
    <aside className="w-64 bg-sidebar text-sidebar-text flex flex-col p-4">
      <div className="mb-10 p-2">
        <h2 className="text-xl font-bold">Модуль 24</h2>
      </div>
      <nav>
        <ul>
          <li>
            {/* Активный элемент */}
            <a href="#" className="flex items-center gap-3 p-3 rounded-lg bg-sidebar-active">
              <FiGrid size={20} />
              <span>Аналитика: текущая ситуация</span>
            </a>
          </li>
          {/* Здесь можно добавить другие пункты меню */}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;