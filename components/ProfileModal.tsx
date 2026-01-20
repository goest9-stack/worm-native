import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { User, Calendar, FileCode, X, Save } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (p: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, profile, onSave }) => {
  const [localProfile, setLocalProfile] = useState<UserProfile>(profile);

  useEffect(() => {
    setLocalProfile(profile);
  }, [profile, isOpen]);

  const handleSave = () => {
    onSave(localProfile);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-zinc-900/50 p-4 border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-2 text-white">
                <User size={18} className="text-worm-primary" />
                <span className="font-mono font-bold tracking-wider text-sm">IDENTITY_CONFIGURATION</span>
            </div>
            <button onClick={onClose} className="text-zinc-500 hover:text-white"><X size={18}/></button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
            
            <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <User size={10} /> Nama / Alias
                </label>
                <input 
                    type="text" 
                    value={localProfile.name}
                    onChange={(e) => setLocalProfile({...localProfile, name: e.target.value})}
                    placeholder="Masukkan nama panggilan..."
                    className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:border-worm-primary outline-none font-mono"
                />
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={10} /> Tanggal Lahir
                </label>
                <input 
                    type="date" 
                    value={localProfile.birthDate}
                    onChange={(e) => setLocalProfile({...localProfile, birthDate: e.target.value})}
                    className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:border-worm-primary outline-none font-mono"
                />
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <FileCode size={10} /> System Prompt Injection (Opsional)
                </label>
                <textarea 
                    value={localProfile.customInstruction}
                    onChange={(e) => setLocalProfile({...localProfile, customInstruction: e.target.value})}
                    placeholder="Contoh: Selalu panggil saya Tuan, jangan terlalu formal..."
                    rows={4}
                    className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:border-worm-primary outline-none font-mono custom-scrollbar resize-none"
                />
            </div>

            <Button onClick={handleSave} className="w-full mt-4">
                <span className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest">
                    <Save size={14} /> Simpan Identitas
                </span>
            </Button>

        </div>
        
      </div>
    </div>
  );
};