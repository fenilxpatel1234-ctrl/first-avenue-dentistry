import React, { useState } from 'react';
import { Bot, Send, X, Sparkles, User, RefreshCw, PhoneCall } from 'lucide-react';

interface DentalConciergeAIProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export const DentalConciergeAI: React.FC<DentalConciergeAIProps> = ({
  isOpen,
  onClose,
  onOpenBooking
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: "Hello! I am the First Avenue AI assistant. Ask me anything about our dental services, appointment scheduling, or general dental care!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: input.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    const currentPrompt = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/dental-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: currentPrompt })
      });

      const data = await res.json();
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.answer || "Thank you for reaching out! Our team at First Avenue Dentistry is here to help."
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: "I'm having trouble connecting. Please call us directly at (519) 207-6890 for immediate assistance!"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQuestions = [
    "What services do you offer?",
    "Do you accept new patients?",
    "What are your office hours?",
    "Do you offer teeth whitening?"
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-white shadow-2xl border-l border-slate-200 flex flex-col">
      <div className="p-5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm flex items-center gap-1.5">
              First Avenue AI
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </h3>
            <p className="text-[11px] text-blue-100">Dental Care Assistant</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map(m => (
          <div key={m.id} className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.sender === 'ai' && (
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
            )}
            <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
              m.sender === 'user'
                ? 'bg-blue-600 text-white rounded-tr-none'
                : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
            }`}>
              {m.text}
            </div>
            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs py-2 px-3 bg-white rounded-xl w-fit border border-slate-200">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />
            AI is composing a response...
          </div>
        )}
      </div>

      <div className="px-4 py-2 bg-slate-100/70 border-t border-slate-200">
        <p className="text-[10px] uppercase font-semibold text-slate-400 mb-1.5">Quick Questions:</p>
        <div className="flex flex-wrap gap-1.5">
          {sampleQuestions.slice(0, 2).map((q, idx) => (
            <button
              key={idx}
              onClick={() => setInput(q)}
              className="text-[10px] text-blue-600 bg-white px-2.5 py-1 rounded-full border border-slate-200 hover:bg-blue-50 transition-colors truncate"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 transition-colors shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      <div className="p-3 bg-blue-600 text-white text-center flex items-center justify-between text-xs px-4">
        <span className="text-blue-100">Ready to book an appointment?</span>
        <button
          onClick={() => { onClose(); onOpenBooking(); }}
          className="px-3 py-1.5 rounded-lg bg-white text-blue-600 font-bold hover:bg-blue-50 transition-colors text-[11px]"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};
