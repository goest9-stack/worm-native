
import React, { useState } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { AuthUser } from '../types.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: AuthUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    setLoading(true);
    // Simulasi Network Request ke Google Auth
    setTimeout(() => {
        const mockUser: AuthUser = {
            id: `google_${Date.now()}`,
            name: "Ananda Maulana", // Default nama sesuai request branding
            email: "user@gmail.com",
            avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c",
            isPro: false
        };
        localStorage.setItem('worm_auth_user', JSON.stringify(mockUser));
        onLogin(mockUser);
        setLoading(false);
        onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-2xl relative">
        {loading ? (
            <div className="p-8 flex flex-col items-center justify-center h-64 space-y-4">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-sans text-gray-500">Connecting to Google Secure Gate...</p>
            </div>
        ) : (
            <>
                <div className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-12 h-12" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Sign in to WORM ZERO</h2>
                    <p className="text-sm text-gray-500 mb-8">Unlock Encrypted Chat History & Cloud Sync</p>
                    
                    <button 
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-full transition-all shadow-sm hover:shadow-md active:scale-95"
                    >
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="G" className="w-5 h-5" />
                        Continue with Google
                    </button>
                    
                    <div className="mt-6 text-[10px] text-gray-400 flex items-center justify-center gap-1">
                        <ShieldCheck size={12} />
                        Secured by Google Identity Services
                    </div>
                </div>
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-between items-center">
                    <button onClick={onClose} className="text-xs text-gray-500 hover:text-gray-800 font-medium">Cancel</button>
                    <span className="text-[10px] text-gray-400">v6.0.1 Global Auth</span>
                </div>
            </>
        )}
      </div>
    </div>
  );
};
