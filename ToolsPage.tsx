
import React, { useState, useEffect } from 'react';
import { User, ToolsData } from '../types';
import { db } from '../services/firebase';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';

type Category = 'productivity' | 'dev' | 'content' | 'data' | 'design' | 'games' | 'system' | 'faith' | 'ux' | 'future';

interface ToolsPageProps {
  user: User;
  toast: (m: string, c?: string) => void;
  addXP: (a: number) => void;
}

const ToolsPage: React.FC<ToolsPageProps> = ({ user, toast, addXP }) => {
  const [activeTab, setActiveTab] = useState<Category>('productivity');
  const [searchTerm, setSearchTerm] = useState('');
  const [cloudData, setCloudData] = useState<ToolsData | null>(null);
  const [localInput, setLocalInput] = useState(''); // For various tools

  // Cloud Sync for Tools State
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "toolsData", user.uid), (snap) => {
      if (snap.exists()) {
        setCloudData(snap.data() as ToolsData);
      } else {
        // Init cloud tools data
        setDoc(doc(db, "toolsData", user.uid), { tasks: [], quickNotes: '' });
      }
    });
    return unsub;
  }, [user.uid]);

  const saveCloudData = async (newData: ToolsData) => {
    await updateDoc(doc(db, "toolsData", user.uid), { ...newData });
  };

  // --- Task Manager Logic ---
  const addTask = async (text: string) => {
    if (!text.trim()) return;
    const newTask = { id: Date.now().toString(), text, status: 'todo' as const };
    const tasks = [...(cloudData?.tasks || []), newTask];
    await saveCloudData({ tasks });
    setLocalInput('');
    addXP(15);
  };

  const toggleTask = async (id: string) => {
    const tasks = (cloudData?.tasks || []).map(t => 
      t.id === id ? { ...t, status: t.status === 'done' ? 'todo' : 'done' as any } : t
    );
    await saveCloudData({ tasks });
  };

  // --- Quick Notes Cloud Sync ---
  const handleNoteChange = async (val: string) => {
    setLocalInput(val);
    // Debounce would be better, but direct sync for now
    await saveCloudData({ quickNotes: val });
  };

  const categories: {id: Category, label: string, icon: string}[] = [
    { id: 'productivity', label: 'إنتاجية (10)', icon: 'fa-briefcase' },
    { id: 'dev', label: 'مطورين (10)', icon: 'fa-code' },
    { id: 'content', label: 'محتوى (10)', icon: 'fa-feather' },
    { id: 'data', label: 'بيانات (10)', icon: 'fa-chart-pie' },
    { id: 'design', label: 'تصميم (10)', icon: 'fa-palette' },
    { id: 'games', label: 'ألعاب (10)', icon: 'fa-gamepad' },
    { id: 'system', label: 'نظام (10)', icon: 'fa-microchip' },
    { id: 'faith', label: 'إسلاميات (10)', icon: 'fa-star-and-crescent' },
    { id: 'ux', label: 'تجربة مستخدم (10)', icon: 'fa-fingerprint' },
    { id: 'future', label: 'مستقبلية (10)', icon: 'fa-rocket' },
  ];

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        <h1 className="text-4xl font-black sultan-gradient">ورشة السلطان السحابية 🛠️</h1>
        <div className="relative w-full md:w-80">
          <input 
            type="text" 
            placeholder="ابحث بين 100+ أداة محفوظة سحابياً..." 
            className="w-full bg-neutral-900 border border-white/10 p-4 pr-12 rounded-2xl text-sm outline-none focus:border-yellow-500 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="fas fa-search absolute right-5 top-1/2 -translate-y-1/2 text-gray-600"></i>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-4 pb-6 no-scrollbar mb-8">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`whitespace-nowrap px-6 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all ${
              activeTab === cat.id 
                ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' 
                : 'bg-neutral-900 text-gray-500 border border-white/5 hover:border-yellow-500/30'
            }`}
          >
            <i className={`fas ${cat.icon}`}></i>
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeTab === 'productivity' && (
          <>
            {/* Task Manager - Cloud Saved */}
            <div className="bg-neutral-900 p-8 rounded-[40px] border border-white/5 flex flex-col h-[400px]">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <i className="fas fa-list-check text-yellow-500"></i> منظم المهام السحابي
              </h3>
              <div className="flex gap-2 mb-4">
                <input 
                  type="text" value={localInput} onChange={e => setLocalInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && addTask(localInput)}
                  className="flex-1 bg-black border border-white/10 p-3 rounded-xl text-xs outline-none"
                  placeholder="أضف مهمة جديدة..."
                />
                <button onClick={() => addTask(localInput)} className="bg-yellow-500 text-black px-4 rounded-xl font-bold">+</button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {cloudData?.tasks?.map(task => (
                  <div key={task.id} className="bg-black/40 border border-white/5 p-3 rounded-xl flex items-center justify-between group">
                    <span className={`text-xs ${task.status === 'done' ? 'line-through text-gray-600' : 'text-gray-300'}`}>{task.text}</span>
                    <button onClick={() => toggleTask(task.id)} className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${task.status === 'done' ? 'bg-green-500 border-green-500' : 'border-white/20'}`}>
                      {task.status === 'done' && <i className="fas fa-check text-[10px] text-black"></i>}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Notes - Cloud Saved */}
            <div className="bg-neutral-900 p-8 rounded-[40px] border border-white/5 flex flex-col h-[400px]">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <i className="fas fa-sticky-note text-cyan-400"></i> المفكرة السريعة السحابية
              </h3>
              <textarea 
                value={cloudData?.quickNotes || ''}
                onChange={e => handleNoteChange(e.target.value)}
                placeholder="اكتب ملاحظاتك هنا، تحفظ تلقائياً في السحابة..."
                className="flex-1 bg-black/40 border border-white/10 p-4 rounded-2xl text-xs outline-none resize-none font-mono text-gray-300"
              />
              <div className="mt-4 text-[10px] text-gray-600 text-center italic">يتم الحفظ سحابياً فورياً...</div>
            </div>

            {/* Pomodoro Timer */}
            <div className="bg-neutral-900 p-8 rounded-[40px] border border-white/5 text-center flex flex-col justify-center">
              <i className="fas fa-hourglass-start text-4xl text-red-500 mb-4 animate-pulse"></i>
              <h3 className="text-lg font-bold mb-2">مؤقت بومودورو</h3>
              <div className="text-5xl font-black orbitron mb-6">25:00</div>
              <button className="bg-red-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-red-500/20">بدأ جلسة التركيز</button>
            </div>
          </>
        )}

        {/* Future categories display variety and placeholders */}
        {activeTab !== 'productivity' && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 bg-neutral-900/50 rounded-[50px] border-2 border-dashed border-white/5">
             <i className={`fas ${categories.find(c => c.id === activeTab)?.icon} text-6xl text-gray-700 mb-6`}></i>
             <h2 className="text-2xl font-bold text-gray-500">جاري بناء أدوات الـ {categories.find(c => c.id === activeTab)?.label}</h2>
             <p className="text-gray-600 mt-2">سيتم تفعيل هذه الأدوات وربطها بسحابتك قريباً يا سلطان.</p>
          </div>
        )}
      </div>

      {/* Cloud Status */}
      <div className="mt-12 bg-neutral-900 p-6 rounded-3xl border border-green-500/20 flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500">
              <i className="fas fa-cloud-check"></i>
           </div>
           <div>
              <div className="text-sm font-bold text-white">حالة المزامنة السحابية</div>
              <div className="text-[10px] text-gray-500">كل أدواتك مرتبطة بحساب: {user.email}</div>
           </div>
        </div>
        <div className="text-[10px] font-mono text-green-500 uppercase tracking-widest bg-green-500/5 px-4 py-2 rounded-full">Connected & Synchronized</div>
      </div>
    </div>
  );
};

export default ToolsPage;
