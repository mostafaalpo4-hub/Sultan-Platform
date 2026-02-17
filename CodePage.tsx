
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { db } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface CodePageProps {
  user: User;
  toast: (m: string) => void;
}

const CodePage: React.FC<CodePageProps> = ({ user, toast }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      const docRef = doc(db, "notes", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setContent(docSnap.data().content);
      }
      setLoading(false);
    };
    fetchNote();
  }, [user.uid]);

  const handleSave = async () => {
    const docRef = doc(db, "notes", user.uid);
    await setDoc(docRef, { content, updatedAt: Date.now() });
    toast('تم الحفظ في السحاب الإمبراطوري بنجاح ☁️');
  };

  const handleClear = () => {
    if (window.confirm('هل أنت متأكد من مسح المفكرة؟')) {
      setContent('');
    }
  };

  if (loading) return <div className="text-center p-20 text-yellow-500">جاري تحميل أفكارك من السحاب...</div>;

  return (
    <div className="animate-in zoom-in duration-500 h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-cyan-400 flex items-center gap-3">
          <i className="fas fa-code"></i>
          المفكرة السحابية الذكية
        </h1>
        <div className="flex gap-4">
          <button 
            onClick={handleClear}
            className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-500 hover:text-white transition-colors"
          >
            مسح
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2 rounded-xl bg-cyan-500 text-black font-bold shadow-lg shadow-cyan-500/20"
          >
            حفظ سحابي
          </button>
        </div>
      </div>

      <div className="flex-1 bg-neutral-900 border border-white/10 rounded-[30px] p-8 shadow-inner overflow-hidden flex flex-col">
        <div className="flex gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="اكتب أفكارك أو أكوادك هنا يا سلطان، وسيتم مزامنتها مع حسابك السحابي..."
          className="flex-1 w-full bg-transparent text-gray-300 font-mono text-lg outline-none resize-none selection:bg-cyan-500/20"
          spellCheck={false}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
          <i className="fas fa-bolt text-yellow-500"></i>
          <span className="text-xs text-gray-500">مزامنة سحابية لحظية</span>
        </div>
        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
          <i className="fas fa-lock text-cyan-400"></i>
          <span className="text-xs text-gray-500">تشفير بيانات Firestore</span>
        </div>
        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
          <i className="fas fa-globe text-blue-500"></i>
          <span className="text-xs text-gray-500">الوصول من أي مكان</span>
        </div>
      </div>
    </div>
  );
};

export default CodePage;
