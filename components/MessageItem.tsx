import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import { Bot, User, Copy, Share2, Volume2, ShieldAlert } from 'lucide-react';

interface MessageItemProps {
    message: Message;
    isDarkMode: boolean;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isBot = message.role === 'model';
  
  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  return (
    <div className={`flex w-full ${isBot ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
      <div className={`flex gap-4 max-w-[90%] md:max-w-[80%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        
        {/* Avatar Icon */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-md border shadow-lg mt-1 ${
            isBot 
                ? 'bg-black/40 border-primary/30 text-primary shadow-[0_0_15px_rgba(0,240,255,0.2)]' 
                : 'bg-white/10 border-white/20 text-white'
        }`}>
            {isBot ? <Bot size={16} /> : <User size={16} />}
        </div>
        
        <div className={`flex flex-col ${isBot ? 'items-start' : 'items-end'} w-full min-w-0 group`}>
            
            {/* Sender Name */}
            <div className="flex items-center gap-2 mb-1.5 px-1 opacity-60">
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase">
                    {isBot ? 'WORM_ZERO // AI' : 'OPERATOR'}
                </span>
                {isBot && message.isError && <span className="text-[9px] text-red-500 font-bold flex items-center gap-1"><ShieldAlert size={10}/> ERROR</span>}
            </div>

            {/* Bubble Content */}
            <div className={`relative p-5 md:p-6 text-sm leading-relaxed shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-[1.01] ${
                isBot 
                  ? 'rounded-tr-3xl rounded-br-3xl rounded-bl-3xl rounded-tl-sm bg-glass border border-glass-border text-zinc-100' 
                  : 'rounded-tl-3xl rounded-bl-3xl rounded-br-sm rounded-tr-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 text-white'
            }`}>
                
                {/* Image Attachment */}
                {message.attachment && (
                    <div className="mb-4 rounded-xl overflow-hidden border border-white/10 shadow-lg relative group/img">
                        <img src={`data:${message.attachment.mimeType};base64,${message.attachment.data}`} className="w-full object-cover max-h-80" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end p-4">
                            <span className="text-xs font-mono text-white">IMG_DATA.PNG</span>
                        </div>
                    </div>
                )}

                {/* Markdown Text */}
                <div className={`prose prose-sm max-w-none prose-invert font-sans ${isBot ? 'text-zinc-200' : 'text-white'}`}>
                    <ReactMarkdown 
                        components={{
                            code({node, className, children, ...props}: any) {
                                const match = /language-(\w+)/.exec(className || '')
                                return match ? (
                                    <div className="rounded-lg overflow-hidden my-3 border border-white/10 bg-[#050505] shadow-inner">
                                        <div className="bg-white/5 px-3 py-1 text-[10px] font-mono text-zinc-400 border-b border-white/5 flex justify-between">
                                            <span>{match[1].toUpperCase()}</span>
                                            <div className="flex gap-1.5">
                                                <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                                                <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                                                <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                                            </div>
                                        </div>
                                        <code className={`${className} block p-3 text-xs font-mono overflow-x-auto`} {...props}>
                                            {children}
                                        </code>
                                    </div>
                                ) : (
                                    <code className="bg-white/10 text-primary px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                                        {children}
                                    </code>
                                )
                            },
                            p: ({children}) => <p className="mb-3 last:mb-0">{children}</p>,
                            strong: ({children}) => <strong className="font-bold text-white">{children}</strong>,
                        }}
                    >
                        {message.content}
                    </ReactMarkdown>
                </div>

                {/* Footer / Actions (Only for Bot) */}
                {isBot && (
                    <div className="absolute -bottom-8 left-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                         <button onClick={handleCopy} className="p-1.5 text-zinc-500 hover:text-white transition-colors bg-white/5 rounded-full hover:bg-white/10"><Copy size={12}/></button>
                         <button className="p-1.5 text-zinc-500 hover:text-white transition-colors bg-white/5 rounded-full hover:bg-white/10"><Volume2 size={12}/></button>
                         <span className="text-[9px] font-mono text-zinc-600 ml-2">{new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                )}
            </div>
            
            {!isBot && (
                <span className="text-[9px] font-mono text-zinc-600 mt-2 px-1">{new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            )}

        </div>
      </div>
    </div>
  );
};