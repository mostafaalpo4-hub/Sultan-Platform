
import React from 'react';

const MOCK_RANKING = [
  { name: 'سلطان العرب', points: 15400, role: 'Emperor' },
  { name: 'خالد الملك', points: 12100, role: 'King' },
  { name: 'ياسين المبدع', points: 9800, role: 'Sultan' },
  { name: 'أحمد الفارس', points: 8500, role: 'Knight' },
  { name: 'عمر القائد', points: 7200, role: 'General' },
  { name: 'مريم الأميرة', points: 6500, role: 'Princess' },
  { name: 'يوسف العظيم', points: 5900, role: 'Member' },
  { name: 'فاطمة الذكية', points: 5100, role: 'Member' },
];

const RankingPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto animate-in slide-in-from-right duration-500">
      <h1 className="text-4xl font-black text-center sultan-gradient mb-12 flex items-center justify-center gap-4">
        <i className="fas fa-crown"></i>
        أقوى أباطرة الإمبراطورية
      </h1>

      <div className="space-y-4">
        {MOCK_RANKING.map((user, index) => (
          <div 
            key={index} 
            className={`flex items-center justify-between p-6 rounded-3xl border transition-all hover:scale-[1.02] ${
              index === 0 
                ? 'bg-yellow-500/10 border-yellow-500 shadow-lg shadow-yellow-500/5' 
                : 'bg-neutral-900 border-white/5'
            }`}
          >
            <div className="flex items-center gap-6">
              <span className={`text-2xl font-black ${index === 0 ? 'text-yellow-500' : 'text-gray-600'}`}>
                #{index + 1}
              </span>
              <div className="flex items-center gap-4">
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=${index === 0 ? 'ffd700' : '333'}&color=${index === 0 ? '000' : 'fff'}`}
                  className="w-12 h-12 rounded-full border border-white/10"
                  alt="avatar"
                />
                <div>
                  <div className="font-bold">{user.name}</div>
                  <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{user.role}</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-500 font-black text-xl">{user.points.toLocaleString()}</span>
              <span className="text-sm">🪙</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RankingPage;
