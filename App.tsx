
import React, { useState, useEffect, useCallback } from 'react';
import { Page, User, ActivityLog } from './types';
import Sidebar from './components/Sidebar';
import AuthGate from './components/AuthGate';
import TopNav from './components/TopNav';
import AnimePage from './pages/AnimePage';
import FaithPage from './pages/FaithPage';
import CodePage from './pages/CodePage';
import ChatPage from './pages/ChatPage';
import ToolsPage from './pages/ToolsPage';
import SpinPage from './pages/SpinPage';
import RankingPage from './pages/RankingPage';
import CreatorPage from './pages/CreatorPage';
import SecurityPage from './pages/SecurityPage';
import { auth, db } from './services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot, getDoc, updateDoc } from 'firebase/firestore';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>(Page.ANIME);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [toast, setToast] = useState<{ message: string; color: string } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(userDocRef);
          
          if (docSnap.exists()) {
            setUser(docSnap.data() as User);
            
            // Setup real-time listener for points/xp updates
            onSnapshot(userDocRef, (ds) => {
              if (ds.exists()) setUser(ds.data() as User);
            });
          } else {
            // User authenticated but no profile in Firestore (rare case)
            // Wait a moment for creation or logout to be safe
            console.warn("User authenticated but no Firestore profile found.");
            setUser(null);
          }
        } catch (error) {
          console.error("Firebase Error:", error);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const showToast = useCallback((message: string, color: string = '#ffd700') => {
    setToast({ message, color });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const addXP = useCallback(async (amount: number) => {
    if (!user) return;
    let newXP = user.xp + amount;
    let newLevel = user.level;
    const xpToNextLevel = user.level * 1000;

    if (newXP >= xpToNextLevel) {
      newXP -= xpToNextLevel;
      newLevel += 1;
      showToast(`تبريكات إمبراطورية! ارتقيت للمستوى ${newLevel} 🏆`, '#ffd700');
    }

    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, { xp: newXP, level: newLevel });
  }, [user, showToast]);

  const updatePoints = async (amount: number) => {
    if (!user) return;
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, { points: user.points + amount });
  };

  const handleToggleGhost = async () => {
    if (!user) return;
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, { isGhostMode: !user.isGhostMode });
    showToast(user.isGhostMode ? 'تم إلغاء وضع الشبح' : 'أنت الآن متخفٍ في الإمبراطورية 👻');
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await signOut(auth);
    setUser(null);
    showToast('تم الخروج من العرش بنجاح', '#ff4444');
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[9999]">
        <img src="https://i.ibb.co/cSP0MLbp/image.png" width="80" className="animate-pulse mb-8 drop-shadow-glow" />
        <div className="w-16 h-1 border-2 border-gray-800 rounded-full overflow-hidden relative">
          <div className="absolute inset-0 bg-yellow-500 animate-[loading_2s_infinite]"></div>
        </div>
        <style>{`@keyframes loading { 0% { left: -100%; } 100% { left: 100%; } }`}</style>
        <h2 className="mt-6 orbitron text-yellow-500 font-bold tracking-[0.2em] text-xs uppercase">Connecting to Sultan Cloud...</h2>
      </div>
    );
  }

  if (!user) {
    return <AuthGate onLogin={() => {}} />;
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <div className="fixed inset-0 z-[-1] bg-black">
        {[...Array(30)].map((_, i) => (
          <div key={i} className="star" style={{ width: '2px', height: '2px', top: Math.random() * 100 + '%', left: Math.random() * 100 + '%', animationDelay: Math.random() * 5 + 's' }} />
        ))}
      </div>
      
      <TopNav user={user} onMenuClick={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} currentPage={currentPage} setCurrentPage={setCurrentPage} user={user} onLogout={handleLogout} />

      <main className="pt-24 px-4 md:px-12 pb-12 transition-all duration-500">
        <div className="max-w-7xl mx-auto">
          {currentPage === Page.ANIME && <AnimePage updatePoints={updatePoints} toast={showToast} />}
          {currentPage === Page.FAITH && <FaithPage user={user} toast={showToast} />}
          {currentPage === Page.CODE && <CodePage user={user} toast={showToast} />}
          {currentPage === Page.CHAT && <ChatPage user={user} toast={showToast} />}
          {currentPage === Page.TOOLS && <ToolsPage user={user} toast={showToast} addXP={addXP} />}
          {currentPage === Page.SPIN && <SpinPage user={user} updatePoints={updatePoints} toast={showToast} />}
          {currentPage === Page.RANKING && <RankingPage />}
          {currentPage === Page.CREATOR && <CreatorPage user={user} toast={showToast} />}
          {currentPage === Page.SECURITY && <SecurityPage user={user} logs={logs} onToggleGhost={handleToggleGhost} toast={showToast} />}
        </div>
      </main>

      {toast && (
        <div className="fixed bottom-8 right-8 z-[10000] px-8 py-4 rounded-2xl font-black shadow-2xl animate-bounce text-center border border-black/10" style={{ backgroundColor: toast.color, color: '#000' }}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default App;
