
import React, { useState, useEffect, useRef } from 'react';
import { auth, db, googleProvider } from '../services/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { User } from '../types';

interface AuthGateProps {
  onLogin: (user: User) => void;
}

declare global {
  interface Window {
    onTelegramAuth: (user: any) => void;
  }
}

const AuthGate: React.FC<AuthGateProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const telegramWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handling Telegram callback
    window.onTelegramAuth = async (tgUser: any) => {
      setLoading(true);
      setError('');
      try {
        const userCredential = await signInAnonymously(auth);
        const firebaseUser = userCredential.user;
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(userDocRef);

        if (!docSnap.exists()) {
          const newUser: User = {
            uid: firebaseUser.uid,
            name: tgUser.first_name + (tgUser.last_name ? ' ' + tgUser.last_name : ''),
            email: tgUser.username ? `@${tgUser.username}` : `tg_${tgUser.id}`,
            points: 1000,
            xp: 0,
            level: 1,
            role: 'member',
            isGhostMode: false,
            twoFactorEnabled: false,
            joinedAt: Date.now()
          };
          await setDoc(userDocRef, newUser);
        }
      } catch (err: any) {
        setError('خطأ تليجرام: تأكد من إعدادات البوت والخصوصية');
        setLoading(false);
      }
    };

    // Load Widget
    const script = document.createElement('script');
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute('data-telegram-login', "SultanDev_robot");
    script.setAttribute('data-size', "large");
    script.setAttribute('data-onauth', "onTelegramAuth(user)");
    script.setAttribute('data-request-access', "write");
    script.async = true;

    if (telegramWrapperRef.current) {
      telegramWrapperRef.current.appendChild(script);
    }

    return () => {
      if (telegramWrapperRef.current) telegramWrapperRef.current.innerHTML = '';
    };
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const docSnap = await getDoc(userDocRef);

      if (!docSnap.exists()) {
        const newUser: User = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'سلطان مجهول',
          email: firebaseUser.email || '',
          points: 1000,
          xp: 0,
          level: 1,
          role: 'member',
          isGhostMode: false,
          twoFactorEnabled: false,
          joinedAt: Date.now()
        };
        await setDoc(userDocRef, newUser);
      }
    } catch (err: any) {
      setError('فشل الدخول بجوجل: ' + (err.code === 'auth/popup-closed-by-user' ? 'تم إغلاق النافذة' : 'حدث خطأ غير معروف'));
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        const newUser: User = {
          uid: firebaseUser.uid,
          name: name || 'سلطان جديد',
          email: email,
          points: 1000,
          xp: 0,
          level: 1,
          role: 'member',
          isGhostMode: false,
          twoFactorEnabled: false,
          joinedAt: Date.now()
        };
        await setDoc(doc(db, "users", firebaseUser.uid), newUser);
      }
    } catch (err: any) {
      console.error(err.code);
      if (err.code === 'auth/email-already-in-use') setError('البريد الإلكتروني مستخدم بالفعل');
      else if (err.code === 'auth/invalid-email') setError('بريد إلكتروني غير صالح');
      else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') setError('خطأ في البريد أو كلمة المرور');
      else setError('حدث خطأ أثناء الاتصال بالعرش');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[5000] px-4">
      <div className="bg-neutral-900 w-full max-w-md p-8 rounded-[40px] border border-yellow-500/30 shadow-[0_0_50px_rgba(255,215,0,0.1)] text-center relative overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
        
        <img src="https://i.ibb.co/cSP0MLbp/image.png" width="80" className="mx-auto mb-6 drop-shadow-glow" alt="Sultan" />
        <h1 className="text-2xl font-black text-yellow-500 mb-2 uppercase orbitron">Sultan Access</h1>
        <p className="text-gray-500 text-xs mb-8">اختر الطريقة الملكية للمتابعة</p>

        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-500 rounded-2xl text-[10px] font-bold animate-shake">{error}</div>}

        <div className="space-y-3 mb-8">
          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white text-black py-3 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-200 transition-all disabled:opacity-50 active:scale-95"
          >
            <img src="https://uid-tg.com/assets/img/google.png" width="18" alt="G" />
            {loading ? 'جاري التحقق...' : 'دخول عبر Google'}
          </button>
          <div className="flex justify-center" ref={telegramWrapperRef}></div>
        </div>

        <div className="flex items-center gap-4 mb-8">
            <div className="h-[1px] flex-1 bg-white/5"></div>
            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">أو عبر الديوان</span>
            <div className="h-[1px] flex-1 bg-white/5"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input 
              type="text" placeholder="الاسم الكامل" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full bg-black border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-yellow-500 transition-colors text-sm" required
            />
          )}
          <input 
            type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-yellow-500 transition-colors text-sm" required
          />
          <input 
            type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-yellow-500 transition-colors text-sm" required
          />
          
          <button 
            type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black py-4 rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-yellow-500/20 disabled:opacity-50"
          >
            {loading ? 'جاري الفتح...' : (isLogin ? 'دخول العرش' : 'تأسيس حساب')}
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-white/5">
          <button onClick={() => setIsLogin(!isLogin)} className="text-cyan-400 text-[10px] font-bold hover:underline uppercase tracking-tighter">
            {isLogin ? 'ليس لديك حساب؟ سجل الآن' : 'لديك حساب بالفعل؟ ادخل العرش'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthGate;
