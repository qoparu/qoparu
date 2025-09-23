// components/StatsCards.tsx

// Данные для примера
const statsData = [
  { label: 'воркаутов', value: 11 },
  { label: 'футбол', value: 11 },
  { label: 'баскетбол', value: 11 },
  { label: 'общая', value: 11 },
];

const StatsCards = ({ recommendationsCsvUrl }: { recommendationsCsvUrl: string }) => {
  // Тут ты можешь использовать `recommendationsCsvUrl` для загрузки реальных данных
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statsData.map((stat, index) => (
        <div 
          key={index} 
          // 👇 ВОТ ЗДЕСЬ ИЗМЕНЕНИЯ
          className="
            p-4 rounded-xl text-center
            bg-white/20 backdrop-blur-lg 
            border border-white/30 
            shadow-lg
          "
        >
          <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
          <p className="text-sm text-gray-600 font-medium capitalize">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;