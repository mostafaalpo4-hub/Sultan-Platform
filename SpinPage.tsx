
import React, { useState } from 'react';
import { User } from '../types';

interface SpinPageProps {
  user: User;
  updatePoints: (a: number) => void;
  toast: (m: string, c?: string) => void;
}

const SpinPage: React.FC<SpinPageProps> = ({ user, updatePoints, toast }) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const spin = () => {
    if (spinning) return;
    if (user.points < 10) {
      toast('نقاطك لا تكفي! تحتاج 10 نقاط');
      return;
    }

    updatePoints(-10);
    setSpinning(true);
    const newRotation = rotation + 1800 + Math.random() * 360;
    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      const prizes = [0, 50, 10, 100, 0, 500];
      const win = prizes[Math.floor(Math.random() * prizes.length)];
      if (win > 0) {
        updatePoints(win);
        toast(`مبروك! فزت بـ ${win} نقطة 🪙`, '#ffd700');
      } else {
        toast('حظ أوفر يا سلطان في المرة القادمة', '#666');
      }
    }, 5000);
  };

  return (
    <div className="text-center animate-in zoom-in duration-700">
      <h1 className="text-4xl font-black sultan-gradient mb-4">🎡 عجلة الحظ الكبرى</h1>
      <p className="text-gray-500 mb-12">جرب حظك واربح نقاط لتطوير حسابك (التكلفة: 10 نقاط)</p>

      <div className="relative inline-block mb-12">
        <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 z-10 text-red-500 text-4xl animate-bounce">▼</div>
        <div 
          className="w-80 h-80 md:w-96 md:h-96 rounded-full border-[10px] border-yellow-500 shadow-[0_0_60px_rgba(255,215,0,0.2)] transition-transform duration-[5000ms] cubic-bezier(0.1, 0, 0.1, 1)"
          style={{ 
            transform: `rotate(${rotation}deg)`,
            backgroundImage: `url('https://i.ibb.co/3sS0qL0/wheel.png')`,
            backgroundSize: 'cover'
          }}
        />
      </div>

      <div className="max-w-xs mx-auto space-y-6">
        <button 
          onClick={spin}
          disabled={spinning}
          className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black py-5 rounded-3xl font-black text-2xl shadow-xl shadow-yellow-500/30 active:scale-95 disabled:opacity-50 transition-all"
        >
          {spinning ? 'جاري التدوير...' : 'تدوير العجلة'}
        </button>
        <div className="text-xs text-gray-600 font-bold uppercase tracking-widest">
          Sultan Luck Engine v2.0
        </div>
      </div>
    </div>
  );
};

export default SpinPage;
