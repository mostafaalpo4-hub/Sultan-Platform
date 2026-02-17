
import React from 'react';
import { User } from '../types';

interface TopNavProps {
  user: User;
  onMenuClick: () => void;
}

const TopNav: React.FC<TopNavProps> = ({ user, onMenuClick }) => {
  const xpPercentage = (user.xp / (user.level * 1000)) * 100;

  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-black/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 md:px-12 z-[2000]">
      <div className="flex items-center gap-4">
        <img src="https://i.ibb.co/cSP0MLbp/image.png" width="40" alt="Logo" className="hover:rotate-12 transition-transform" />
        <div className="hidden sm:block">
          <span className="orbitron font-black text-xl tracking-widest block">
            SULTAN <span className="text-yellow-500">DEV</span>
          </span>
          <div className="flex items-center gap-2 mt-1">
             <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 transition-all duration-500" style={{ width: `${xpPercentage}%` }}></div>
             </div>
             <span className="text-[10px] text-gray-500 font-bold">LVL {user.level}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 md:gap-6">
        <div className="bg-yellow-500/10 border border-yellow-500/30 px-3 md:px-4 py-2 rounded-full font-bold flex items-center gap-2">
          <span className="text-sm md:text-lg">🪙</span>
          <span className="text-yellow-500 text-sm md:text-base">{user.points.toLocaleString()}</span>
        </div>
        
        <button onClick={onMenuClick} className="text-yellow-500 text-2xl hover:scale-110 transition-transform cursor-pointer">
          <i className="fas fa-bars"></i>
        </button>
      </div>
    </header>
  );
};

export default TopNav;
