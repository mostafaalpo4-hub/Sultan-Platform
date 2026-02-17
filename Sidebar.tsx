
import React from 'react';
import { Page, User } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  user: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, currentPage, setCurrentPage, user, onLogout }) => {
  const navItems = [
    { id: Page.ANIME, icon: 'fas fa-play-circle', label: 'إمبراطورية الأنمي' },
    { id: Page.FAITH, icon: 'fas fa-mosque', label: 'محراب الإيمان' },
    { id: Page.CODE, icon: 'fas fa-code', label: 'المفكرة البرمجية' },
    { id: Page.CHAT, icon: 'fas fa-comments', label: 'شات الإمبراطورية' },
    { id: Page.TOOLS, icon: 'fas fa-toolbox', label: 'حقيبة الأدوات' },
    { id: Page.SPIN, icon: 'fas fa-dharmachakra', label: 'عجلة الحظ' },
    { id: Page.RANKING, icon: 'fas fa-trophy', label: 'العمالقة' },
    { id: Page.CREATOR, icon: 'fas fa-lightbulb', label: 'صندوق الأفكار' },
    { id: Page.SECURITY, icon: 'fas fa-shield-halved', label: 'الأمن والخصوصية' },
  ];

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[2400] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      />
      
      <aside className={`fixed top-0 right-0 h-full w-[280px] bg-neutral-950 border-l border-yellow-500/20 z-[2500] p-8 flex flex-col transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="text-center mb-10 pt-4">
          <div className="relative inline-block">
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ffd700&color=000&bold=true`} 
              className="w-20 h-20 rounded-full border-2 border-yellow-500 p-1 mx-auto"
              alt="Avatar"
            />
            {user.isGhostMode && (
              <span className="absolute bottom-0 right-0 bg-cyan-500 text-[8px] p-1 rounded-full border border-black">GHOST</span>
            )}
          </div>
          <h3 className="mt-4 text-white font-bold text-lg">{user.name}</h3>
          <span className="inline-block bg-yellow-500 text-black text-[10px] px-3 py-1 rounded-full font-black mt-1 uppercase">
            {user.role} Member
          </span>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto pr-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setCurrentPage(item.id); onClose(); }}
              className={`w-full flex items-center gap-4 p-4 rounded-xl text-sm font-bold transition-all duration-300 ${
                currentPage === item.id 
                  ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 translate-x-[-10px]' 
                  : 'text-gray-500 hover:text-yellow-500 hover:bg-white/5'
              }`}
            >
              <i className={`${item.icon} text-lg w-6`}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button 
          onClick={onLogout}
          className="mt-8 w-full p-4 rounded-xl border border-red-500/30 text-red-500 font-bold hover:bg-red-500/10 transition-colors flex items-center justify-center gap-3"
        >
          <i className="fas fa-power-off"></i>
          خروج من العرش
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
