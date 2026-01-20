
import React from 'react';
import { X, MessageSquare, Trash2, Clock, Search } from 'lucide-react';
import { ChatSession, AuthUser } from '../types.ts';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  onSelectSession: (session: ChatSession) => void;
  onDeleteSession: (id: string) => void;
  user: AuthUser | null;
  onLoginClick: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ 
  isOpen, onClose, sessions, onSelectSession, onDeleteSession, user, onLoginClick 
}) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[80] transition-opacity" 
            onClick={onClose}
        ></div>
      )}

      {/* Sidebar Panel */}
      <div className={`fixed inset-y-0 left-0 z-[90] w-80 bg-[#0a0a0a] border-r border-white/10 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/50">
            <h2 className="font-mono font-bold text-worm-primary tracking-widest flex items-center gap-2">
                <Clock size={16} /> MEMORY DUMP
            </h2>
            <button onClick={onClose} className="text-zinc-500 hover:text-white"><X size={18}/></button>
        </div>

        {/* User Info / Login CTA */}
        <div className="p-4 border-b border-white/10">
            {user ? (
                <div className="flex items-center gap-3">
                    <img src={user.avatar} alt="User" className="w-10 h-10 rounded-full border border-worm-primary/30" />
                    <div className="flex-1 overflow-hidden">
                        <div className="text-sm font-bold text-white truncate">{user.name}</div>
                        <div className="text-[10px] text-zinc-500 font-mono truncate">{user.email}</div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-4 space-y-3">
                    <p className="text-xs text-zinc-400">Akses history chat terkunci.</p>
                    <button 
                        onClick={onLoginClick}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded flex items-center justify-center gap-2 transition-colors"
                    >
                        LOGIN GOOGLE
                    </button>
                </div>
            )}
        </div>

        {/* Search (Visual Only for now) */}
        {user && (
            <div className="p-3">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-zinc-600" size={14} />
                    <input 
                        type="text" 
                        placeholder="Search logs..." 
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-xs text-white focus:border-worm-primary outline-none font-mono"
                    />
                </div>
            </div>
        )}

        {/* Session List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
            {!user ? (
                <div className="flex flex-col items-center justify-center h-full text-zinc-700 space-y-2 opacity-50">
                    <MessageSquare size={32} />
                    <span className="text-xs font-mono uppercase">Access Denied</span>
                </div>
            ) : sessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-zinc-600 space-y-2">
                    <span className="text-xs font-mono italic">No memory logs found.</span>
                </div>
            ) : (
                sessions.sort((a,b) => b.timestamp - a.timestamp).map((session) => (
                    <div key={session.id} className="group relative p-3 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/5 transition-all cursor-pointer" onClick={() => onSelectSession(session)}>
                        <div className="pr-6">
                            <div className="text-xs font-bold text-zinc-300 mb-1 line-clamp-1 group-hover:text-worm-primary transition-colors">{session.title}</div>
                            <div className="text-[10px] text-zinc-500 line-clamp-1 font-mono">{session.preview}</div>
                            <div className="text-[9px] text-zinc-600 mt-1 font-mono">{new Date(session.timestamp).toLocaleDateString()} • {new Date(session.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        </div>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}
                            className="absolute right-2 top-3 p-1.5 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                ))
            )}
        </div>
        
        {/* Footer Stats */}
        {user && (
            <div className="p-3 border-t border-white/10 text-[9px] font-mono text-zinc-600 flex justify-between">
                <span>TOTAL LOGS: {sessions.length}</span>
                <span>STORAGE: LOCAL_ENC</span>
            </div>
        )}
      </div>
    </>
  );
};
