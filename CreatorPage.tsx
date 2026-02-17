
import React, { useState } from 'react';
import { User } from '../types';

const CreatorPage: React.FC<{ user: User; toast: (m: string) => void }> = ({ user, toast }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) return;
    
    toast('وصلت فكرتك للديوان الملكي يا بطل! 💡');
    setTitle('');
    setBody('');
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-700">
      <div className="bg-neutral-900 border-2 border-dashed border-yellow-500/30 p-12 rounded-[50px] text-center">
        <h1 className="text-3xl font-black text-yellow-500 mb-4">صندوق أفكار السلطان</h1>
        <p className="text-gray-500 mb-10">ساهم في بناء الإمبراطورية، أفكارك هي سر قوتنا</p>

        <form onSubmit={handleSubmit} className="space-y-6 text-right">
          <div>
            <label className="block text-xs text-gray-500 mb-2 px-4">عنوان الفكرة</label>
            <input 
              type="text" 
              placeholder="مثال: إضافة قسم جديد للأفلام..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-black border border-white/10 p-5 rounded-3xl text-white outline-none focus:border-yellow-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-2 px-4">شرح الفكرة بالتفصيل</label>
            <textarea 
              rows={6}
              placeholder="اشرح لنا فكرتك وكيف يمكن أن تفيد المجتمع..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full bg-black border border-white/10 p-5 rounded-3xl text-white outline-none focus:border-yellow-500"
              required
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-yellow-500 text-black py-5 rounded-3xl font-black text-xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-yellow-500/20"
          >
            إرسال للديوان الملكي
          </button>
        </form>

        <div className="mt-12 flex justify-center gap-8">
          <div className="flex flex-col items-center opacity-40">
            <i className="fas fa-check-circle text-2xl mb-2"></i>
            <span className="text-[10px]">فحص سريع</span>
          </div>
          <div className="flex flex-col items-center opacity-40">
            <i className="fas fa-clock text-2xl mb-2"></i>
            <span className="text-[10px]">رد خلال 24 ساعة</span>
          </div>
          <div className="flex flex-col items-center opacity-40">
            <i className="fas fa-award text-2xl mb-2"></i>
            <span className="text-[10px]">مكافآت للأفكار المقبولة</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorPage;
