
import React, { useState, useEffect, useRef } from 'react';
import { User, ChatMessage } from '../types';
import { geminiService } from '../services/geminiService';
import { db } from '../services/firebase';
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from 'firebase/firestore';

interface ChatPageProps {
  user: User;
  toast: (m: string, c?: string) => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ user, toast }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load and Listen to Firestore Messages
  useEffect(() => {
    const q = query(collection(db, "chats"), orderBy("timestamp", "asc"), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: any[] = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    setIsSending(true);

    // AI Safety Filter
    const filter = await geminiService.profanityFilter(input);
    if (!filter.isSafe) {
      toast('تم حظر الرسالة: تحتوي على كلمات غير لائقة 🛡️', '#ff4444');
      setInput('');
      setIsSending(false);
      return;
    }

    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const hasLink = urlPattern.test(input);
    let isSafeLink = true;

    if (hasLink) {
      const match = input.match(urlPattern);
      if (match) {
        const scan = await geminiService.scanUrl(match[0]);
        isSafeLink = scan.isSafe;
      }
    }

    try {
      await addDoc(collection(db, "chats"), {
        sender: user.isGhostMode ? 'سلطان متخفي' : user.name,
        uid: user.uid,
        text: input,
        timestamp: serverTimestamp(),
        isLink: hasLink,
        isSafe: isSafeLink
      });
      setInput('');
    } catch (err) {
      console.error(err);
      toast('فشل في إرسال الرسالة');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col bg-neutral-950 border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
      <div className="p-6 bg-white/5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <h2 className="font-bold">💬 شات الإمبراطورية السحابي</h2>
        </div>
        <div className="text-[10px] text-gray-500 orbitron">LIVE-FIRESTORE-CHANNEL</div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-6 bg-black/40"
      >
        {messages.map((msg) => {
          const isMe = msg.uid === user.uid;
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-start' : 'items-end'}`}>
              <div className="text-[10px] text-gray-500 mb-1 px-4">{msg.sender}</div>
              <div className={`max-w-[80%] px-6 py-4 rounded-3xl text-sm leading-relaxed ${
                isMe 
                  ? 'bg-yellow-500 text-black font-bold rounded-tr-none' 
                  : 'bg-neutral-800 text-white rounded-tl-none border border-white/5'
              } ${msg.isLink && !msg.isSafe ? 'border-red-500 bg-red-500/20 text-red-500' : ''}`}>
                {msg.text}
                {msg.isLink && (
                  <div className={`mt-2 text-[10px] font-black uppercase ${msg.isSafe ? 'text-green-500' : 'text-red-500'}`}>
                    <i className={`fas ${msg.isSafe ? 'fa-check-circle' : 'fa-exclamation-triangle'} ml-1`}></i>
                    {msg.isSafe ? 'رابط آمن' : 'رابط مشبوه تم رصده'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSend} className="p-6 bg-white/5 border-t border-white/5 flex gap-4">
        <input 
          type="text" 
          placeholder="اكتب رسالتك الملكية..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-yellow-500 transition-colors"
        />
        <button 
          type="submit"
          disabled={isSending}
          className="bg-yellow-500 text-black px-8 rounded-2xl font-black hover:scale-105 active:scale-95 transition-all flex items-center justify-center disabled:opacity-50"
        >
          {isSending ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
