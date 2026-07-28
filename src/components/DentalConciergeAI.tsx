import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, User, RefreshCw, Calendar } from 'lucide-react';

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

type BookingStage =
  | null
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'phone'
  | 'date'
  | 'time'
  | 'notes'
  | 'confirm';

interface BookingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  notes: string;
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
  const [bookingStage, setBookingStage] = useState<BookingStage>(null);
  const [bookingData, setBookingData] = useState<BookingData>({
    firstName: '', lastName: '', email: '', phone: '', date: '', time: '', notes: ''
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const addAiMsg = (text: string) => {
    setMessages(prev => [...prev, { id: `ai-${Date.now()}`, sender: 'ai', text }]);
  };

  const submitBooking = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: bookingData.firstName,
          lastName: bookingData.lastName,
          email: bookingData.email,
          phone: bookingData.phone,
          preferredDate: bookingData.date,
          preferredTimeSlot: bookingData.time,
          notes: bookingData.notes
        })
      });
      const data = await res.json();
      if (data.success) {
        addAiMsg(`Wonderful! Your appointment request has been submitted successfully! 🎉

Here's a summary:
• Name: ${bookingData.firstName} ${bookingData.lastName}
• Email: ${bookingData.email}
• Phone: ${bookingData.phone}
• Date: ${bookingData.date}
• Time: ${bookingData.time}
• Notes: ${bookingData.notes || 'None'}

Our team at First Avenue Dentistry will review your request and send a confirmation shortly. You'll receive an email at ${bookingData.email} with the details.

Is there anything else I can help you with?`);
      } else {
        addAiMsg("I'm sorry, there was an issue submitting your appointment. Please try again or call us at (519) 207-6890 for assistance.");
      }
    } catch {
      addAiMsg("I'm having trouble connecting to our booking system. Please call us directly at (519) 207-6890 to schedule your appointment.");
    } finally {
      setIsLoading(false);
      setBookingStage(null);
      setBookingData({ firstName: '', lastName: '', email: '', phone: '', date: '', time: '', notes: '' });
    }
  };

  const handleBookingInput = (value: string) => {
    if (!bookingStage) return false;

    switch (bookingStage) {
      case 'firstName':
        setBookingData(prev => ({ ...prev, firstName: value }));
        setBookingStage('lastName');
        addAiMsg(`Nice to meet you, ${value}! What's your last name?`);
        return true;

      case 'lastName':
        setBookingData(prev => ({ ...prev, lastName: value }));
        setBookingStage('email');
        addAiMsg(`Great! What email address should we send the confirmation to?`);
        return true;

      case 'email':
        if (!value.includes('@')) {
          addAiMsg("That doesn't look like a valid email. Could you please enter a valid email address?");
          return true;
        }
        setBookingData(prev => ({ ...prev, email: value }));
        setBookingStage('phone');
        addAiMsg(`Perfect! What's your phone number so we can reach you if needed?`);
        return true;

      case 'phone':
        setBookingData(prev => ({ ...prev, phone: value }));
        setBookingStage('date');
        addAiMsg(`Thanks! What date would you like to come in? (e.g., 2026-08-15 or August 15, 2026)`);
        return true;

      case 'date':
        setBookingData(prev => ({ ...prev, date: value }));
        setBookingStage('time');
        addAiMsg(`What time works best for you? (e.g., 10:00 AM, 2:30 PM)`);
        return true;

      case 'time':
        setBookingData(prev => ({ ...prev, time: value }));
        setBookingStage('notes');
        addAiMsg(`Any special requests or notes for the dentist? (If not, just type "none")`);
        return true;

      case 'notes':
        setBookingData(prev => ({ ...prev, notes: value === 'none' ? '' : value }));
        setBookingStage('confirm');
        addAiMsg(`Let me confirm your appointment details:

• Name: ${bookingData.firstName} ${bookingData.lastName}
• Email: ${bookingData.email}
• Phone: ${bookingData.phone}
• Date: ${bookingData.date}
• Time: ${value === 'none' ? bookingData.time : bookingData.time}
${value !== 'none' ? `• Notes: ${value}` : ''}

Does everything look correct? Reply "yes" to submit or "no" to start over.`);
        return true;

      case 'confirm':
        if (value.toLowerCase() === 'yes' || value.toLowerCase() === 'yep' || value.toLowerCase() === 'correct') {
          submitBooking();
        } else {
          setBookingStage('firstName');
          setBookingData({ firstName: '', lastName: '', email: '', phone: '', date: '', time: '', notes: '' });
          addAiMsg("No problem! Let's start over. What's your first name?");
        }
        return true;
    }
    return false;
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: userText
    };
    setMessages(prev => [...prev, userMsg]);

    if (bookingStage) {
      handleBookingInput(userText);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/dental-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText })
      });
      const data = await res.json();

      if (data.action === 'booking_start') {
        setBookingStage('firstName');
      }

      addAiMsg(data.answer || "Thank you for reaching out! Our team at First Avenue Dentistry is here to help.");
    } catch {
      addAiMsg("I'm having trouble connecting. Please call us directly at (519) 207-6890 for immediate assistance!");
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
            <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm whitespace-pre-wrap ${
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
        <div ref={messagesEndRef} />
      </div>

      {!bookingStage && (
        <div className="px-4 py-2 bg-slate-100/70 border-t border-slate-200">
          <p className="text-[10px] uppercase font-semibold text-slate-400 mb-1.5">Quick Questions:</p>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => { setInput("I'd like to book an appointment"); }}
              className="text-[10px] text-blue-600 bg-white px-2.5 py-1 rounded-full border border-slate-200 hover:bg-blue-50 transition-colors truncate"
            >
              Book an Appointment
            </button>
            <button
              onClick={() => setInput("What services do you offer?")}
              className="text-[10px] text-blue-600 bg-white px-2.5 py-1 rounded-full border border-slate-200 hover:bg-blue-50 transition-colors truncate"
            >
              What services do you offer?
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          placeholder={bookingStage ? "Type your response..." : "Ask a question..."}
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