import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { GoogleGenAI } from '@google/genai';

// Icons
const IconTerminal = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>;
const IconEye = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;

export const SimulationInterface: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'visual' | 'terminal'>('terminal');

  return (
    <div className="w-full h-full p-4 md:p-10 flex flex-col z-20">
      <header className="flex justify-between items-end border-b border-green-800 pb-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-[0.2em] text-green-500 animate-pulse">CONSTRUCT v2.1</h1>
          <p className="text-xs text-green-800 mt-1">OPERATOR: UNKNOWN // SIGNAL: ENCRYPTED</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab('terminal')}
            className={`px-4 py-2 border ${activeTab === 'terminal' ? 'border-green-500 bg-green-900/30' : 'border-green-900 text-green-800'} hover:border-green-400 transition-all flex items-center gap-2`}
          >
            <IconTerminal /> TERMINAL
          </button>
          <button 
             onClick={() => setActiveTab('visual')}
             className={`px-4 py-2 border ${activeTab === 'visual' ? 'border-green-500 bg-green-900/30' : 'border-green-900 text-green-800'} hover:border-green-400 transition-all flex items-center gap-2`}
          >
            <IconEye /> VISUALIZER
          </button>
        </div>
      </header>

      <main className="flex-grow flex relative border border-green-900/50 bg-black/80 backdrop-blur-sm overflow-hidden">
        {activeTab === 'terminal' ? <ArchitectTerminal /> : <Visualizer />}
      </main>

      <footer className="mt-4 flex justify-between text-[10px] text-green-900 uppercase">
        <span>Memory Usage: {Math.floor(Math.random() * 50) + 10}TB</span>
        <span>Uptime: ∞</span>
        <span>Reality Integrity: 34%</span>
      </footer>
    </div>
  );
};

// --- Sub-component: Architect Terminal (Gemini) ---

interface Message {
  sender: 'user' | 'architect';
  text: string;
}

const ArchitectTerminal: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'architect', text: 'I am the Architect. I created the Matrix. I have been waiting for you.' }
  ]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      if (!process.env.API_KEY) {
         setMessages(prev => [...prev, { sender: 'architect', text: 'FATAL ERROR: API_KEY MISSING IN ENVIRONMENT.' }]);
         setLoading(false);
         return;
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = 'gemini-2.5-flash'; 
      
      const prompt = `
        System Instruction: You are The Architect from The Matrix. 
        You speak in precise, complex, somewhat cold and calculating patterns. 
        You talk about variables, equations, human imperfection, choices, and causality. 
        You are cryptic but profound. Keep responses relatively concise (under 100 words) but impactful.
        Do not break character.
        
        User Input: ${userMsg}
      `;

      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
      });

      const text = response.text || "...Anomaly detected. Response fragmented.";
      
      setMessages(prev => [...prev, { sender: 'architect', text: text }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { sender: 'architect', text: 'SYSTEM FAILURE. CONNECTION RESET.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col font-mono text-sm md:text-base p-4">
      <div ref={chatContainerRef} className="flex-grow overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 border ${
              msg.sender === 'user' 
                ? 'border-green-700 bg-green-900/10 text-green-300' 
                : 'border-white/20 bg-white/5 text-white'
            }`}>
              <span className="block text-[10px] mb-1 opacity-50 uppercase tracking-wider">
                {msg.sender === 'architect' ? 'The Architect' : 'Neo'}
              </span>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
           <div className="flex justify-start">
             <div className="text-green-500 animate-pulse">Calculating probability...</div>
           </div>
        )}
      </div>
      <form onSubmit={handleSend} className="flex gap-2 border-t border-green-800 pt-4">
        <span className="text-green-500 pt-2">{'>'}</span>
        <input 
          ref={inputRef}
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the nature of your reality..."
          className="flex-grow bg-transparent border-none outline-none text-green-400 placeholder-green-900"
        />
        <button type="submit" className="text-green-600 hover:text-green-400 disabled:opacity-50">SEND_PACKET</button>
      </form>
    </div>
  );
};


// --- Sub-component: Visualizer (GSAP Art) ---

const Visualizer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Random chaotic movement
    shapesRef.current.forEach((shape) => {
      if (!shape) return;
      
      gsap.to(shape, {
        x: "random(-200, 200)",
        y: "random(-200, 200)",
        rotation: "random(-360, 360)",
        scale: "random(0.5, 2)",
        duration: "random(2, 5)",
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true
      });
      
      // Glitch flicker effect
      gsap.to(shape, {
        opacity: "random(0.1, 1)",
        skewX: "random(-20, 20)",
        duration: 0.1,
        repeat: -1,
        repeatRefresh: true,
        ease: "steps(1)"
      });
    });
  }, []);

  const triggerGlitch = () => {
     gsap.to(containerRef.current, {
         filter: "invert(1) hue-rotate(90deg)",
         duration: 0.1,
         yoyo: true,
         repeat: 3
     });
     
     gsap.to(shapesRef.current, {
         x: 0, y: 0, scale: 1, rotation: 0,
         duration: 0.2,
         stagger: 0.05,
         overwrite: true,
         onComplete: () => {
             // restart chaos
             shapesRef.current.forEach((shape) => {
                 gsap.to(shape, {
                    x: "random(-200, 200)",
                    y: "random(-200, 200)",
                    rotation: "random(-360, 360)",
                    scale: "random(0.5, 2)",
                    duration: "random(2, 5)",
                    ease: "sine.inOut",
                    repeat: -1,
                    yoyo: true
                 });
             })
         }
     });
  };

  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden" ref={containerRef}>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
         <div className="w-[500px] h-[500px] border border-green-500 rounded-full animate-spin-slow"></div>
         <div className="w-[300px] h-[300px] border border-green-500 rotate-45 absolute"></div>
      </div>

      <button 
        onClick={triggerGlitch}
        className="absolute bottom-4 right-4 z-50 bg-green-900/50 text-green-400 px-4 py-2 border border-green-500 hover:bg-green-500 hover:text-black transition-colors"
      >
        DESTABILIZE_SYSTEM
      </button>

      {/* Floating Shapes */}
      {[...Array(15)].map((_, i) => (
        <div 
          key={i}
          ref={el => { if(el) shapesRef.current[i] = el; }}
          className="absolute border border-green-500 backdrop-blur-sm"
          style={{
            width: Math.random() * 100 + 20,
            height: Math.random() * 100 + 20,
            background: `rgba(0, 255, 65, ${Math.random() * 0.1})`,
          }}
        >
          <span className="text-[8px] absolute top-1 left-1 opacity-50">0x{Math.floor(Math.random()*1000).toString(16)}</span>
        </div>
      ))}
      
      <div className="z-10 bg-black/50 p-6 border border-white/20 text-center">
          <h2 className="text-4xl font-bold text-white mix-blend-difference glitch-text">
             R E A L I T Y
          </h2>
      </div>
    </div>
  );
};