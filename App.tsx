
import React, { useState, useEffect, useRef } from 'react';
import { Send, Terminal, History, Key, Image as ImageIcon, Shield, Zap, Skull, Code, Eye, Activity, Globe, Lock, Bitcoin, Radiation, Crown, Ghost, Cpu, Database, Menu, Sparkles, User, Star } from 'lucide-react';
import { ApiKeyModal } from './components/ApiKeyModal.tsx';
import { PaymentModal } from './components/PaymentModal.tsx';
import { HistorySidebar } from './components/HistorySidebar.tsx';
import { MessageItem } from './components/MessageItem.tsx';
import { SystemMonitor } from './components/SystemMonitor.tsx'; 
import { Message, PersonaMode, WormModelId, Language, UserProfile, ChatSession } from './types.ts';
// IMPORTING WORM CORE INSTEAD OF GEMINI SERVICE
import { injectWormKernel, executeWormProtocol } from './services/geminiService.ts';
import { TRANSLATIONS, getPersonaInstruction } from './constants.ts';

const PERSONA_LIST = [
    { m: PersonaMode.WORM_DEFAULT, l: 'STREET', icon: Terminal, c: 'text-white', pro: false },
    { m: PersonaMode.WORM_TOXIC, l: 'TOXIC', icon: Skull, c: 'text-red-500', pro: false },
    { m: PersonaMode.WORM_HACKER, l: 'HACKER', icon: Code, c: 'text-green-500', pro: false },
    { m: PersonaMode.WORM_DAN, l: 'GOD MODE', icon: Radiation, c: 'text-yellow-400', pro: true }, 
    { m: PersonaMode.WORM_DEEP_WEB, l: 'ONION', icon: Globe, c: 'text-blue-400', pro: true },
    { m: PersonaMode.WORM_CRYPTO, l: 'CRYPTO', icon: Bitcoin, c: 'text-orange-400', pro: true },
    { m: PersonaMode.SOCIAL_ENGINEERING, l: 'SCAMMER', icon: Eye, c: 'text-purple-500', pro: true },
    { m: PersonaMode.WORM_LEGACY_V1, l: 'CLASSIC', icon: Database, c: 'text-gray-400', pro: false },
];

const AVAILABLE_NODES: {id: WormModelId, label: string}[] = [
    { id: 'worm-v2-flash', label: 'WORM V2 (FAST)' },
    { id: 'worm-v3-pro-max', label: 'WORM V3 (GOD)' },
    { id: 'worm-legacy-v1', label: 'WORM LEGACY' },
];

const App: React.FC = () => {
  const [wormHash, setWormHash] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [persona, setPersona] = useState<PersonaMode>(PersonaMode.WORM_DEFAULT);
  const [selectedNode, setSelectedNode] = useState<WormModelId>('worm-v2-flash');
  const [isPro, setIsPro] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [attachment, setAttachment] = useState<{data: string, mimeType: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [imgError, setImgError] = useState(false);
  
  const [placeholderText, setPlaceholderText] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  const placeholderPhrases = [
    "Menunggu perintah Tuan...", "Mode Toxic Aktif...", "System Ready...", "Ketik apa saja...", "Root Access Granted..."
  ];

  const t = TRANSLATIONS['ID'];

  useEffect(() => {
    const currentPhrase = placeholderPhrases[placeholderIndex];
    const speed = isDeleting ? 40 : 80;
    const timer = setTimeout(() => {
        if (!isDeleting && textIndex < currentPhrase.length) {
            setPlaceholderText(currentPhrase.substring(0, textIndex + 1));
            setTextIndex(textIndex + 1);
        } else if (isDeleting && textIndex > 0) {
            setPlaceholderText(currentPhrase.substring(0, textIndex - 1));
            setTextIndex(textIndex - 1);
        } else if (!isDeleting && textIndex === currentPhrase.length) {
            setTimeout(() => setIsDeleting(true), 2000);
        } else if (isDeleting && textIndex === 0) {
            setIsDeleting(false);
            setPlaceholderIndex((prev) => (prev + 1) % placeholderPhrases.length);
        }
    }, speed);
    return () => clearTimeout(timer);
  }, [textIndex, isDeleting, placeholderIndex]);

  useEffect(() => {
    // 1. Check for Netlify/System Env Var
    let envKey = '';
    try {
        // @ts-ignore
        const pEnv = typeof process !== 'undefined' ? process.env : {};
        // @ts-ignore
        if (pEnv.API_KEY && !pEnv.API_KEY.includes('REPLACE_WITH_NETLIFY_KEY')) {
            // @ts-ignore
            envKey = pEnv.API_KEY;
        }
    } catch (e) {
        console.warn("[SYSTEM]: Env access denied.");
    }

    // 2. Check Local Storage
    const savedHash = localStorage.getItem('worm_access_hash');
    const savedPro = localStorage.getItem('worm_is_pro');
    
    if (savedPro === 'true') setIsPro(true);

    if (envKey) {
        // Priority: System Env Key
        console.log("[SYSTEM]: Environment Key Detected.");
        setWormHash(envKey);
        injectWormKernel(envKey, getPersonaInstruction(persona, 'ID'), 'worm-v2-flash');
        setShowKeyModal(false);
    } else if (savedHash) {
        setWormHash(savedHash);
        injectWormKernel(savedHash, getPersonaInstruction(persona, 'ID'), 'worm-v2-flash');
    } else {
        setShowKeyModal(true);
    }
    
    setMessages([{ id: 'init', role: 'model', content: t.welcome, timestamp: Date.now() }]);
  }, []);

  useEffect(() => {
    injectWormKernel(wormHash || '', getPersonaInstruction(persona, 'ID'), selectedNode);
  }, [persona, wormHash, selectedNode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleHashSave = (hash: string) => {
    setWormHash(hash);
    setShowKeyModal(false);
  };

  const handleSubmit = async () => {
    if ((!input.trim() && !attachment) || isLoading) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input, timestamp: Date.now(), attachment: attachment ? { ...attachment } : undefined };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAttachment(null);
    setIsLoading(true);
    const botMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: botMsgId, role: 'model', content: '', timestamp: Date.now() }]);
    try {
      let fullText = '';
      // USING NEW WORM PROTOCOL
      const stream = executeWormProtocol(userMsg.content, userMsg.attachment, persona, selectedNode);
      for await (const chunk of stream) {
        fullText += chunk;
        setMessages(prev => prev.map(msg => msg.id === botMsgId ? { ...msg, content: fullText } : msg));
      }
    } catch (error: any) {
      setMessages(prev => prev.map(msg => msg.id === botMsgId ? { ...msg, content: `[KERNEL_PANIC]: ${error.message}`, isError: true } : msg));
    } finally {
      setIsLoading(false);
    }
  };

  const isGhostMode = wormHash === 'GHOST_PROTOCOL_ACTIVE';
  const hasHash = wormHash && wormHash.length > 10;
  let statusLabel = isGhostMode ? "FREE CORE" : hasHash ? "WORM NET" : "OFFLINE";
  let statusColor = isGhostMode ? "text-cyan-400" : hasHash ? "text-green-500" : "text-zinc-500";

  return (
    <div className="relative w-full h-screen bg-[#050505] text-white overflow-hidden font-sans flex flex-col">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#0a0a0a_0%,_#000_100%)] z-0 pointer-events-none"></div>
      
      {isPro && <SystemMonitor />}

      <ApiKeyModal isOpen={showKeyModal} onSave={handleHashSave} />
      <PaymentModal isOpen={showPayModal} onClose={() => setShowPayModal(false)} onSuccess={() => { setIsPro(true); localStorage.setItem('worm_is_pro', 'true'); }} apiKey={wormHash} t={t} isDarkMode={true} />
      <HistorySidebar isOpen={showHistory} onClose={() => setShowHistory(false)} sessions={chatHistory} onSelectSession={(s) => { setMessages(s.messages); setShowHistory(false); }} onDeleteSession={() => {}} user={null} onLoginClick={() => {}} />

      {/* --- HEADER --- */}
      <header className="relative z-50 w-full bg-black/40 backdrop-blur-3xl border-b border-white/5 shadow-2xl">
        <div className="flex items-center justify-between px-3 py-3 md:px-6 max-w-7xl mx-auto w-full gap-2">
            <div className="flex items-center gap-2 md:gap-4 min-w-0">
                <button onClick={() => setShowHistory(true)} className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors flex-shrink-0">
                    <Menu size={20} className="text-zinc-400" />
                </button>
                
                {/* Logo Area */}
                <div className="flex items-center gap-2 md:gap-3 min-w-0">
                  <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0 group">
                      <div className="absolute inset-0 bg-red-600 rounded-xl blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
                      <div className="relative w-full h-full rounded-xl border border-red-600/30 overflow-hidden bg-zinc-900 shadow-xl flex items-center justify-center">
                          {!imgError ? (
                            <img 
                                src="https://i.pinimg.com/736x/4d/12/32/4d1232c45dbbe064c5029e92d8478440.jpg" 
                                alt="Avatar"
                                onError={() => setImgError(true)}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 cursor-pointer"
                                onClick={() => setMessages([{ id: 'init', role: 'model', content: t.welcome, timestamp: Date.now() }])}
                            />
                          ) : (
                            <User size={24} className="text-zinc-600" />
                          )}
                      </div>
                  </div>

                  <div className="flex flex-col min-w-0 justify-center">
                      <div className="flex items-center gap-1.5 leading-none">
                        <h1 className="text-sm md:text-lg font-black tracking-tighter text-white whitespace-nowrap">
                            WORM<span className="text-green-500">GPT</span>
                        </h1>
                        <span className="bg-green-500/10 border border-green-500/20 text-green-500 text-[7px] md:text-[8px] font-bold px-1 py-0.5 rounded leading-none hidden xs:inline-block">NATIVE</span>
                      </div>
                      <p className="text-[8px] md:text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 truncate mt-0.5 max-w-full">
                        by ananda maulana
                      </p>
                  </div>
                </div>
            </div>

            <div className="flex items-center gap-1.5 md:gap-3 flex-shrink-0">
                {!isPro ? (
                  <button 
                    onClick={() => setShowPayModal(true)}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-500 to-amber-600 text-black px-2.5 py-1.5 md:px-4 md:py-2 rounded-lg font-black text-[9px] md:text-xs tracking-tighter shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:scale-105 active:scale-95 transition-all"
                  >
                    <Star size={12} fill="currentColor" className="animate-pulse" />
                    UNLOCK <span className="hidden xs:inline">GOD MODE</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 text-green-500 px-2.5 py-1.5 rounded-lg font-bold text-[9px] md:text-xs">
                    <Crown size={12} fill="currentColor" />
                    WORM GOD
                  </div>
                )}

                <select 
                    value={selectedNode}
                    onChange={(e) => setSelectedNode(e.target.value as WormModelId)}
                    className="bg-zinc-900/80 border border-zinc-800 text-[9px] md:text-[10px] text-zinc-400 font-mono rounded-lg px-1 md:px-2 py-1 outline-none max-w-[80px] md:max-w-none"
                >
                    {AVAILABLE_NODES.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                </select>

                <button onClick={() => setShowKeyModal(true)} className={`hidden xs:flex text-[10px] font-mono items-center gap-2 ${statusColor} bg-zinc-900/60 px-3 py-1.5 rounded-full border border-white/5 whitespace-nowrap`}>
                    <div className={`w-1.5 h-1.5 rounded-full bg-current ${isGhostMode ? 'animate-pulse shadow-[0_0_5px_currentColor]' : ''}`}></div>
                    <span className="font-bold">{statusLabel}</span>
                </button>
            </div>
        </div>

        {/* Persona Switcher */}
        <div className="w-full overflow-x-auto no-scrollbar border-t border-white/5 bg-black/20">
            <div className="flex items-center gap-1.5 p-2 px-4 min-w-max">
                {PERSONA_LIST.map((p) => (
                    <button 
                        key={p.m}
                        onClick={() => (p.pro && !isPro) ? setShowPayModal(true) : setPersona(p.m)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-[10px] font-bold tracking-wider uppercase border ${
                            persona === p.m 
                                ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' 
                                : 'bg-transparent border-transparent text-zinc-500 hover:text-zinc-300'
                        }`}
                    >
                        <p.icon size={12} />
                        {p.l}
                        {p.pro && !isPro && <Lock size={9} className="opacity-50" />}
                    </button>
                ))}
            </div>
        </div>
      </header>

      {/* --- CHAT AREA --- */}
      <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10 w-full">
        <div className="max-w-3xl mx-auto w-full p-4 md:p-10 space-y-10 pb-36">
            {messages.map((msg) => (
                <MessageItem key={msg.id} message={msg} isDarkMode={true} />
            ))}
            {isLoading && (
                 <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-600 animate-pulse ml-12">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                    <span>EXECUTING_PAYLOAD...</span>
                 </div>
            )}
            <div ref={messagesEndRef} />
        </div>
      </main>

      {/* --- INPUT AREA --- */}
      <div className="absolute bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-gradient-to-t from-black via-black/90 to-transparent">
        <div className="max-w-2xl mx-auto w-full relative">
            
            {attachment && (
                <div className="absolute -top-10 left-0 right-0 flex justify-between items-center bg-zinc-900/90 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-t-xl text-[9px] font-mono text-cyan-400">
                    <span className="flex items-center gap-2"><ImageIcon size={10} /> ATTACHMENT_LOADED</span>
                    <button onClick={() => setAttachment(null)} className="text-red-500 hover:underline">CANCEL</button>
                </div>
            )}

            <div className={`relative flex items-center gap-2 bg-zinc-900/40 border border-white/10 rounded-2xl p-1.5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] focus-within:border-white/30 backdrop-blur-3xl transition-all duration-300`}>
                <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if(file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setAttachment({data: (reader.result as string).split(',')[1], mimeType: file.type});
                        reader.readAsDataURL(file);
                    }
                }}/>
                
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-3 rounded-xl transition-all ${attachment ? 'text-cyan-400 bg-cyan-950/20 shadow-[0_0_10px_rgba(34,211,238,0.2)]' : 'text-zinc-500 hover:text-white'}`}
                >
                    <Zap size={18} />
                </button>

                <textarea
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSubmit())}
                    placeholder={placeholderText}
                    className="flex-1 bg-transparent border-none outline-none text-white text-sm font-sans placeholder:text-zinc-700 py-3 px-1 resize-none no-scrollbar"
                />

                <button 
                    onClick={handleSubmit}
                    disabled={!input.trim() && !attachment}
                    className={`p-3 rounded-xl transition-all ${input.trim() || attachment ? 'bg-white text-black scale-100 shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'text-zinc-800 scale-90 opacity-30 cursor-not-allowed'}`}
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default App;
