
import React, { useEffect, useState } from 'react';
import { Activity, Wifi, Cpu, HardDrive, Shield, Lock, Globe } from 'lucide-react';

export const SystemMonitor: React.FC = () => {
  const [cpu, setCpu] = useState(0);
  const [ram, setRam] = useState(0);
  const [net, setNet] = useState(0);
  const [decrypt, setDecrypt] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(Math.floor(Math.random() * (99 - 40) + 40));
      setRam(Math.floor(Math.random() * (80 - 60) + 60));
      setNet(Math.floor(Math.random() * (900 - 100) + 100));
      setDecrypt(Math.floor(Math.random() * (1000 - 500) + 500));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const Bar = ({ val, color }: { val: number, color: string }) => (
    <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden mt-1 border border-white/5">
        <div className={`h-full ${color} transition-all duration-1000 ease-in-out shadow-[0_0_10px_currentColor]`} style={{ width: `${val}%` }}></div>
    </div>
  );

  return (
    <div className="hidden lg:flex fixed right-6 top-24 w-56 flex-col gap-4 z-0 pointer-events-none font-mono animate-in slide-in-from-right-10 duration-1000">
        
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#00ff00]"></div>
                <span className="text-[10px] text-green-500 font-bold tracking-[0.2em]">SYSTEM_OVERRIDE</span>
            </div>
            <span className="text-[9px] text-zinc-600">V.5.0.1</span>
        </div>

        {/* METRICS */}
        <div className="bg-black/60 backdrop-blur-xl border border-green-500/20 p-3 rounded-lg shadow-[0_0_30px_rgba(0,255,0,0.05)]">
            <div className="flex justify-between items-center text-green-400 mb-1">
                <div className="flex items-center gap-2 text-[10px] font-bold"><Cpu size={10}/> INJECTION_RATE</div>
                <span className="text-[10px]">{cpu}%</span>
            </div>
            <Bar val={cpu} color="bg-green-500" />
        </div>

        <div className="bg-black/60 backdrop-blur-xl border border-red-500/20 p-3 rounded-lg shadow-[0_0_30px_rgba(255,0,0,0.05)]">
            <div className="flex justify-between items-center text-red-400 mb-1">
                <div className="flex items-center gap-2 text-[10px] font-bold"><Shield size={10}/> FIREWALL_BYPASS</div>
                <span className="text-[10px]">{ram}%</span>
            </div>
            <Bar val={ram} color="bg-red-500" />
        </div>

        <div className="bg-black/60 backdrop-blur-xl border border-blue-500/20 p-3 rounded-lg shadow-[0_0_30px_rgba(0,0,255,0.05)]">
            <div className="flex justify-between items-center text-blue-400 mb-1">
                <div className="flex items-center gap-2 text-[10px] font-bold"><Globe size={10}/> TOR_UPLINK</div>
                <span className="text-[10px]">{net} MB/s</span>
            </div>
            <div className="flex gap-0.5 mt-2 overflow-hidden h-3 opacity-50">
                {Array.from({length: 20}).map((_, i) => (
                    <div key={i} className={`w-1 h-full bg-blue-500/50 rounded-sm animate-pulse`} style={{animationDelay: `${i * 0.1}s`}}></div>
                ))}
            </div>
        </div>

        <div className="p-3 border border-dashed border-white/10 rounded bg-white/5">
             <div className="flex items-center gap-2 text-[9px] text-zinc-400 mb-2">
                <Lock size={10} /> DECRYPTION_KEYS
             </div>
             <div className="text-[10px] font-mono text-white break-all leading-tight opacity-70">
                {`EF${decrypt}x99...ACTIVE`}
             </div>
        </div>

    </div>
  );
};
