
import React, { useState } from 'react';
import { User, ActivityLog } from '../types';

interface SecurityPageProps {
  user: User;
  logs: ActivityLog[];
  onToggleGhost: () => void;
  toast: (m: string) => void;
}

const SecurityPage: React.FC<SecurityPageProps> = ({ user, logs, onToggleGhost, toast }) => {
  const [tfaEnabled, setTfaEnabled] = useState(user.twoFactorEnabled);
  const [showVerification, setShowVerification] = useState(false);
  const [code, setCode] = useState('');

  const handleTfaToggle = () => {
    if (!tfaEnabled) {
      setShowVerification(true);
    } else {
      setTfaEnabled(false);
      toast('تم إلغاء التحقق بخطوتين');
    }
  };

  const verifyCode = () => {
    if (code === '1234') {
      setTfaEnabled(true);
      setShowVerification(false);
      toast('تم تفعيل التحقق بخطوتين بنجاح');
      setCode('');
    } else {
      toast('الكود غير صحيح');
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-yellow-500 text-black w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-yellow-500/20">
          <i className="fas fa-shield-halved"></i>
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">الأمن والخصوصية</h1>
          <p className="text-gray-500 text-sm">إدارة درع حماية العرش الإمبراطوري</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Protection Stats */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-neutral-900 p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-yellow-500/10 transition-colors"></div>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-3">
                <i className="fas fa-ghost text-cyan-500"></i>
                وضع التصفح الخفي
              </h3>
              <p className="text-gray-500 text-xs mb-6">إخفاء نشاطك وحالتك من شات الإمبراطورية والترتيب العام</p>
              <button 
                onClick={onToggleGhost}
                className={`w-full py-4 rounded-2xl font-black transition-all ${
                  user.isGhostMode 
                    ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' 
                    : 'bg-white/5 text-white border border-white/10'
                }`}
              >
                {user.isGhostMode ? 'نشط الآن (Ghost)' : 'تفعيل وضع الشبح'}
              </button>
            </div>

            <div className="bg-neutral-900 p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-3">
                <i className="fas fa-lock text-blue-500"></i>
                التحقق بخطوتين (2FA)
              </h3>
              <p className="text-gray-500 text-xs mb-6">تأمين حسابك عبر تطبيق Sultan Authenticator</p>
              <button 
                onClick={handleTfaToggle}
                className={`w-full py-4 rounded-2xl font-black transition-all ${
                  tfaEnabled 
                    ? 'bg-blue-500 text-black shadow-lg shadow-blue-500/20' 
                    : 'bg-white/5 text-white border border-white/10'
                }`}
              >
                {tfaEnabled ? 'مفعل (Secure)' : 'تفعيل الحماية القصوى'}
              </button>
            </div>
          </div>

          <div className="bg-neutral-900 p-8 rounded-3xl border border-white/5">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <i className="fas fa-list-check text-yellow-500"></i>
              سجل النشاط الملكي
            </h3>
            <div className="space-y-4">
              {logs.map(log => (
                <div key={log.id} className="bg-black/40 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                      <i className="fas fa-shield-virus"></i>
                    </div>
                    <div>
                      <div className="font-bold text-sm">{log.type}</div>
                      <div className="text-[10px] text-gray-500">{log.browser} • {log.ip}</div>
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-600 font-mono">
                    {new Date(log.time).toLocaleTimeString('ar-EG')}
                  </div>
                </div>
              ))}
              <button className="w-full py-3 text-xs text-gray-500 hover:text-white transition-colors">
                عرض السجل الكامل
              </button>
            </div>
          </div>
        </div>

        {/* Security Summary */}
        <div className="space-y-8">
          <div className="bg-neutral-900 p-8 rounded-3xl border border-white/5 text-center">
            <div className="relative inline-block mb-6">
              <svg className="w-32 h-32">
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-800" />
                <circle 
                  cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
                  className="text-yellow-500"
                  strokeDasharray="364.4"
                  strokeDashoffset={364.4 * (1 - (tfaEnabled ? 0.95 : 0.6))}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black">{tfaEnabled ? '95%' : '60%'}</span>
                <span className="text-[10px] text-gray-500">مستوى الأمان</span>
              </div>
            </div>
            <h3 className="text-lg font-bold mb-2">حالة الدرع الملكي</h3>
            <p className="text-xs text-gray-500 mb-6">نظام الحماية نشط ويقوم بفحص كافة العمليات الجارية</p>
            <div className="space-y-3 text-right">
              <div className="flex items-center justify-between text-xs bg-black/40 p-3 rounded-xl border border-white/5">
                <span className="text-green-500">آمن</span>
                <span>تشفير الرسائل</span>
              </div>
              <div className="flex items-center justify-between text-xs bg-black/40 p-3 rounded-xl border border-white/5">
                <span className="text-green-500">نشط</span>
                <span>نظام الدرع الصامد (DDoS)</span>
              </div>
              <div className="flex items-center justify-between text-xs bg-black/40 p-3 rounded-xl border border-white/5">
                <span className="text-green-500">فعال</span>
                <span>فلتر المحتوى بالذكاء الاصطناعي</span>
              </div>
            </div>
          </div>

          <button className="w-full bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-500 font-bold hover:bg-red-500 transition-all hover:text-white">
            تسجيل الخروج من كافة الأجهزة
          </button>
        </div>
      </div>

      {/* 2FA Modal */}
      {showVerification && (
        <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 p-10 rounded-[40px] w-full max-w-sm text-center">
            <div className="w-16 h-16 bg-blue-500 text-black rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
              <i className="fas fa-key"></i>
            </div>
            <h2 className="text-2xl font-bold mb-2">مصادقة السلطان</h2>
            <p className="text-gray-500 text-sm mb-8">أدخل الكود المكون من 4 أرقام من تطبيق Authenticator</p>
            
            <input 
              type="text" 
              maxLength={4}
              placeholder="0000"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-black border border-white/10 p-5 rounded-2xl text-center text-3xl font-mono tracking-[1em] mb-8 focus:border-blue-500 outline-none"
            />

            <div className="flex gap-4">
              <button 
                onClick={verifyCode}
                className="flex-1 bg-blue-500 text-black py-4 rounded-2xl font-black hover:scale-105 transition-all"
              >
                تأكيد
              </button>
              <button 
                onClick={() => setShowVerification(false)}
                className="flex-1 bg-white/5 text-white py-4 rounded-2xl font-bold border border-white/10"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityPage;
