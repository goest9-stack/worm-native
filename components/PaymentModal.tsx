
import React, { useState } from 'react';
import { Button } from './Button.tsx';
import { X, Check, Wallet, Smartphone, Copy, MessageCircle, Key, Shield } from 'lucide-react';
import { PAYMENT_CONFIG, LICENSE_KEY } from '../constants.ts';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  apiKey: string | null;
  t: any;
  isDarkMode: boolean;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess, t, isDarkMode }) => {
  const [licenseKey, setLicenseKey] = useState('');
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const VALID_KEY = LICENSE_KEY; 

  if (!isOpen) return null;

  const handleVerify = () => {
      if (licenseKey.trim().toUpperCase() === VALID_KEY.toUpperCase()) {
          onSuccess();
          setTimeout(onClose, 1000);
      } else {
          setError("ACCESS DENIED. INVALID KEY.");
      }
  };

  const copyToClipboard = (text: string, index: number) => {
      navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
  };

  const openWhatsApp = () => {
      const msg = `WORM_ROOT_ACCESS_REQUEST.\nPayment: DANA/GOPAY.\nRequesting License Key.`;
      window.open(`https://wa.me/${PAYMENT_CONFIG.ADMIN_WA}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in zoom-in-95 duration-200">
      <div className={`w-full max-w-md border shadow-2xl flex flex-col relative rounded-xl overflow-hidden ${isDarkMode ? 'bg-zinc-950 border-worm-primary' : 'bg-white border-zinc-200'}`}>
        
        {/* Header */}
        <div className={`p-4 border-b flex justify-between items-center ${isDarkMode ? 'bg-zinc-900/50 border-worm-primary/20' : 'bg-gray-50 border-zinc-200'}`}>
            <div className="flex items-center gap-3">
                <Shield className="text-worm-primary animate-pulse" size={20} />
                <span className={`font-mono font-bold tracking-[0.2em] ${isDarkMode ? 'text-white' : 'text-black'}`}>ROOT ACCESS</span>
            </div>
            <button onClick={onClose} className={`${isDarkMode ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-black'}`}><X size={20}/></button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
            
            <div className="text-center space-y-2">
                <h3 className={`text-2xl font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-black'}`}>UNLOCK GOD MODE</h3>
                <p className="text-xs text-zinc-500 font-mono tracking-widest">{t.pro_modal_desc}</p>
            </div>

            {/* Price */}
             <div className={`flex justify-between items-center p-4 border rounded-lg ${isDarkMode ? 'bg-zinc-900/30 border-zinc-800' : 'bg-gray-50 border-zinc-200'}`}>
                <span className="text-xs text-zinc-500 font-mono font-bold">TOTAL PRICE</span>
                <span className="text-2xl font-black text-worm-primary font-mono tracking-tight">Rp {PAYMENT_CONFIG.PRICE_IDR}</span>
            </div>

            {/* Methods */}
            <div className="space-y-3">
                <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-[0.2em]">PAYMENT GATEWAY:</div>
                <div className="space-y-2">
                    {PAYMENT_CONFIG.ACCOUNTS.map((acc, idx) => (
                        <div key={idx} className={`flex items-center justify-between p-3 border rounded-lg transition-all group ${isDarkMode ? 'bg-black border-zinc-800 hover:border-worm-primary' : 'bg-white border-zinc-200 hover:border-zinc-400'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 flex items-center justify-center border rounded ${isDarkMode ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-200 bg-gray-50'}`}>
                                    {acc.provider === 'DANA' ? <Wallet size={16} className="text-blue-500"/> : <Smartphone size={16} className="text-green-500"/>}
                                </div>
                                <div className="flex flex-col">
                                    <span className={`text-xs font-black ${acc.color} tracking-wider`}>{acc.provider}</span>
                                    <span className={`text-sm font-mono font-bold tracking-wide transition-colors ${isDarkMode ? 'text-white group-hover:text-worm-primary' : 'text-black'}`}>{acc.number}</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => copyToClipboard(acc.number, idx)} 
                                className={`p-2 transition-all rounded ${isDarkMode ? 'text-zinc-600 hover:text-white hover:bg-zinc-800' : 'text-zinc-400 hover:text-black hover:bg-gray-100'}`}
                            >
                                {copiedIndex === idx ? <Check size={16} className="text-green-500"/> : <Copy size={16}/>}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action */}
            <button 
                onClick={openWhatsApp}
                className="w-full py-3 bg-worm-primary hover:bg-red-700 text-white text-xs font-black tracking-[0.2em] transition-all flex items-center justify-center gap-3 font-mono rounded-lg shadow-lg shadow-red-900/20"
            >
                <MessageCircle size={16} /> CONFIRM TO ADMIN
            </button>

            {/* Key Input */}
            <div className={`space-y-2 pt-4 border-t ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
                <div className="flex gap-2">
                     <div className="relative flex-1 group">
                        <Key className={`absolute left-3 top-3 transition-colors ${isDarkMode ? 'text-zinc-700 group-focus-within:text-worm-primary' : 'text-zinc-400'}`} size={16}/>
                        <input 
                            type="text" 
                            value={licenseKey}
                            onChange={(e) => {setLicenseKey(e.target.value); setError('');}}
                            placeholder="LICENSE KEY"
                            className={`w-full border text-xs font-mono py-3 pl-10 pr-4 outline-none uppercase tracking-widest transition-all rounded-lg ${isDarkMode ? 'bg-black border-zinc-800 focus:border-worm-primary text-white placeholder:text-zinc-800' : 'bg-gray-50 border-zinc-300 focus:border-zinc-500 text-black placeholder:text-zinc-400'}`}
                        />
                    </div>
                    <Button onClick={handleVerify} className="px-6 py-0 text-xs h-full bg-zinc-800 text-white border-none hover:bg-zinc-700 font-black rounded-lg">
                        UNLOCK
                    </Button>
                </div>
                {error && <p className="text-[10px] text-red-500 font-bold font-mono text-center py-1">{error}</p>}
            </div>

        </div>
      </div>
    </div>
  );
};
