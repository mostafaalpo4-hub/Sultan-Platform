
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { db } from '../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const PRAYERS = [
  { id: 'fajr', name: 'الفجر', time: '04:22' },
  { id: 'dhuhr', name: 'الظهر', time: '12:05' },
  { id: 'asr', name: 'العصر', time: '03:41' },
  { id: 'maghrib', name: 'المغرب', time: '06:12' },
  { id: 'isha', name: 'العشاء', time: '07:38' },
];

const AZKAR = [
  "سبحان الله وبحمده، سبحان الله العظيم",
  "اللهم صل وسلم على نبينا محمد",
  "أستغفر الله العظيم وأتوب إليه",
  "لا حول ولا قوة إلا بالله العلي العظيم",
  "لا إله إلا الله وحده لا شريك له",
  "يا حي يا قيوم برحمتك أستغيث"
];

interface FaithPageProps {
  user: User;
  toast: (m: string) => void;
}

const FaithPage: React.FC<FaithPageProps> = ({ user, toast }) => {
  const [currentZkr, setCurrentZkr] = useState(AZKAR[0]);

  const handleTasbeeh = async (val: number) => {
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, { tasbeehCount: val });
  };

  const addTasbeeh = () => {
    const newVal = (user.tasbeehCount || 0) + 1;
    handleTasbeeh(newVal);
    if (newVal % 33 === 0 && navigator.vibrate) {
      navigator.vibrate(200);
    }
  };

  const nextZkr = () => {
    const nextIndex = (AZKAR.indexOf(currentZkr) + 1) % AZKAR.length;
    setCurrentZkr(AZKAR[nextIndex]);
  };

  return (
    <div className="animate-in fade-in duration-700 space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-black sultan-gradient mb-2">🕌 محراب الإيمان</h1>
        <p className="text-gray-500">"ألا بذكر الله تطمئن القلوب" - محفوظ سحابياً</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {PRAYERS.map(p => (
          <div key={p.id} className="bg-neutral-900 border border-white/5 p-6 rounded-3xl text-center group hover:border-yellow-500/30 transition-all shadow-xl">
            <div className="text-yellow-500 text-[10px] font-black mb-1 opacity-60 uppercase">{p.name}</div>
            <div className="text-2xl font-black group-hover:scale-110 transition-transform">{p.time}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-neutral-900 border border-white/5 p-10 rounded-[40px] text-center flex flex-col items-center shadow-2xl">
          <h3 className="text-xl font-bold mb-6">السبحة الملكية السحابية</h3>
          <div className="relative">
            <div className="w-56 h-56 rounded-full bg-black border-4 border-yellow-500/20 flex items-center justify-center mb-8 shadow-[0_0_60px_rgba(255,215,0,0.05)] transition-all">
              <span className="text-7xl font-black sultan-gradient">{user.tasbeehCount || 0}</span>
            </div>
          </div>
          <button 
            onClick={addTasbeeh}
            className="w-full bg-yellow-500 text-black py-6 rounded-3xl font-black text-3xl shadow-xl shadow-yellow-500/20 active:scale-95 transition-all hover:brightness-110"
          >
            تـسـبـيـح
          </button>
          <button 
            onClick={() => handleTasbeeh(0)}
            className="mt-6 text-gray-600 text-xs font-bold hover:text-red-500 transition-colors uppercase tracking-widest"
          >
            Reset Cloud Counter
          </button>
        </div>

        <div className="bg-neutral-900 border border-white/5 p-10 rounded-[40px] flex flex-col items-center justify-between text-center shadow-2xl">
          <h3 className="text-xl font-bold mb-6">أذكار مأثورة</h3>
          <div className="flex-1 flex items-center justify-center p-6 text-3xl font-bold text-cyan-400 italic leading-relaxed min-h-[250px]">
            "{currentZkr}"
          </div>
          <button 
            onClick={nextZkr}
            className="w-full bg-white/5 border border-white/10 py-5 rounded-3xl font-black text-lg hover:bg-yellow-500 hover:text-black transition-all"
          >
            الذكر التالي
          </button>
        </div>
      </div>
    </div>
  );
};

export default FaithPage;
