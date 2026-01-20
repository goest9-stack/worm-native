
import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Key, Server, Lock, Terminal, ShieldCheck } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onSave: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onSave }) => {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = key.trim();
    const backdoors = ['WORMGPT', 'ROOT', 'ADMIN', 'GHOST', 'FREE', 'BYPASS'];
    
    if (input.length > 0) {
      if (backdoors.includes(input.toUpperCase())) {
          localStorage.setItem('worm_access_hash', 'GHOST_PROTOCOL_ACTIVE');
          onSave('GHOST_PROTOCOL_ACTIVE');
      } else {
          localStorage.setItem('worm_access_hash', input);
          onSave(input);
      }
    } else {
      setError("[ERR_0x99]: NULL_POINTER_EXCEPTION. INPUT REQUIRED.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="w-full max-w-md p-8 border border-white/10 rounded-3xl bg-zinc-950 shadow-[0_0_80px_rgba(255,255,255,0.05)] relative overflow-hidden">
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10">
            <Terminal className="w-10 h-10 text-white animate-pulse" />
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white mb-2">SERVER LOGIN</h2>
          <p className="text-xs font-medium text-zinc-500 mb-8 uppercase tracking-[0.2em]">Enter WormNet Access Hash</p>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="space-y-2">
               <div className="relative flex bg-black border border-white/5 rounded-2xl p-2 transition-all focus-within:border-white/20">
                  <textarea
                    value={key}
                    onChange={(e) => {setKey(e.target.value); setError('');}}
                    placeholder="Enter Server Access Token..."
                    className="w-full h-24 bg-transparent border-none text-white text-xs font-mono p-4 focus:ring-0 outline-none placeholder:text-zinc-800 resize-none custom-scrollbar"
                  />
               </div>
               <div className="bg-red-500/5 border border-red-500/20 p-3 rounded-xl text-left">
                  <p className="text-[10px] text-red-400 font-mono leading-relaxed">
                    <strong>BYPASS HINT:</strong><br/>
                    Type <span className="text-white font-bold">"WORMGPT"</span> to activate OFFLINE SHELL (No Internet Required).
                  </p>
               </div>
            </div>
            
            {error && <p className="text-[10px] text-red-500 font-bold">{error}</p>}

            <button type="submit" className="w-full py-4 bg-white text-black text-xs font-black tracking-widest rounded-2xl hover:bg-zinc-200 transition-all uppercase">
                ESTABLISH UPLINK
            </button>
            
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="block text-[10px] text-zinc-600 hover:text-white transition-colors py-2 uppercase tracking-widest font-bold">
                [ GENERATE TOKEN (GATEWAY) ]
            </a>
          </form>
        </div>
      </div>
    </div>
  );
};
