
import React, { useState } from 'react';
import { Anime } from '../types';

const MOCK_ANIME: Anime[] = [
  { id: '1', title: 'Attack on Titan: Final Season', thumb: 'https://picsum.photos/seed/aot/600/400', video: 'https://www.youtube.com/embed/M_OauHnAFEE' },
  { id: '2', title: 'Solo Leveling', thumb: 'https://picsum.photos/seed/solo/600/400', video: 'https://www.youtube.com/embed/v8hKOnS5M6c' },
  { id: '3', title: 'Jujutsu Kaisen', thumb: 'https://picsum.photos/seed/jjk/600/400', video: 'https://www.youtube.com/embed/hT_D08Jm-3k' },
  { id: '4', title: 'Demon Slayer: Hashira Training', thumb: 'https://picsum.photos/seed/ds/600/400', video: 'https://www.youtube.com/embed/6vHov1tFInY' },
  { id: '5', title: 'One Piece: Gear 5', thumb: 'https://picsum.photos/seed/op/600/400', video: 'https://www.youtube.com/embed/3W90V1R6-o4' },
  { id: '6', title: 'Naruto Shippuden', thumb: 'https://picsum.photos/seed/naruto/600/400', video: 'https://www.youtube.com/embed/2m9Y_M3V85U' },
];

interface AnimePageProps {
  updatePoints: (a: number) => void;
  toast: (m: string) => void;
}

const AnimePage: React.FC<AnimePageProps> = ({ updatePoints, toast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeVideo, setActiveVideo] = useState<{ url: string; title: string } | null>(null);

  const filtered = MOCK_ANIME.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleWatch = (anime: Anime) => {
    setActiveVideo({ url: anime.video, title: anime.title });
    updatePoints(5);
    toast('استمتع بالمشاهدة! +5 نقاط');
  };

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <h1 className="text-4xl font-black text-yellow-500">مكتبة الأنمي الملكية 🌙</h1>
        <div className="relative w-full md:w-80">
          <input 
            type="text" 
            placeholder="ابحث في المكتبة..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-900/50 border border-white/10 p-4 pr-12 rounded-2xl text-white outline-none focus:border-yellow-500"
          />
          <i className="fas fa-search absolute right-5 top-1/2 -translate-y-1/2 text-gray-500"></i>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(anime => (
          <div key={anime.id} className="group bg-neutral-900 border border-white/5 rounded-3xl overflow-hidden hover:border-yellow-500/50 transition-all duration-500 hover:-translate-y-2">
            <div className="relative h-56 overflow-hidden">
              <img src={anime.thumb} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={anime.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">HD Premium</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-500 transition-colors">{anime.title}</h3>
              <p className="text-gray-500 text-xs mb-6">سيرفر السلطان السريع - ترجمة حصرية</p>
              <button 
                onClick={() => handleWatch(anime)}
                className="w-full bg-white/5 border border-white/10 hover:bg-yellow-500 hover:text-black hover:border-yellow-500 p-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
              >
                <i className="fas fa-play"></i>
                مشاهدة الآن
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-[9999] bg-black/98 flex items-center justify-center p-4">
          <div className="w-full max-w-5xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-yellow-500 text-xl font-bold">{activeVideo.title}</h2>
              <button 
                onClick={() => setActiveVideo(null)}
                className="bg-red-500 text-white px-6 py-2 rounded-xl font-bold hover:scale-105 transition-transform"
              >
                إغلاق X
              </button>
            </div>
            <div className="aspect-video bg-black rounded-3xl border-2 border-yellow-500/50 overflow-hidden shadow-2xl shadow-yellow-500/10">
              <iframe 
                src={activeVideo.url} 
                className="w-full h-full" 
                allowFullScreen 
                title="player"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimePage;
