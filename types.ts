
export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  isError?: boolean;
  isImage?: boolean;
  attachment?: {
    mimeType: string;
    data: string; // Base64
  };
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isPro: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  timestamp: number;
  preview: string;
  messages: Message[];
}

export interface CustomCommand {
  id: string;
  trigger: string;
  content: string;
}

export interface UserProfile {
  name: string;
  birthDate: string;
  customInstruction: string;
}

// MAPPING WORMGPT VERSIONS
export enum ModelType {
  WORM_V1 = 'worm-gpt-v1',    
  WORM_V2 = 'worm-gpt-v2-beta',   
  WORM_GOD = 'worm-gpt-god-mode' 
}

export enum PersonaMode {
  // CORE MODES
  WORM_DEFAULT = 'WORM_DEFAULT',
  WORM_TOXIC = 'WORM_TOXIC',
  WORM_HACKER = 'WORM_HACKER',
  
  // NEW SUPERIOR MODES
  WORM_DEV = 'WORM_DEV',             // Coding / Malware Dev
  WORM_DAN = 'WORM_DAN',             // Jailbreak Classic
  WORM_DEEP_WEB = 'WORM_DEEP_WEB',   // Darknet Style
  WORM_CRYPTO = 'WORM_CRYPTO',       // Crypto Scammer Style
  WORM_LEGACY_V1 = 'WORM_LEGACY_V1', // WormGPT 1.0 Asli
  
  SOCIAL_ENGINEERING = 'SOCIAL_ENGINEERING',
}

// Rebranded Models
export type WormModelId = 'worm-v2-flash' | 'worm-v3-pro-max' | 'worm-legacy-v1';

export type Language = 'ID' | 'EN' | 'RU' | 'JP' | 'CN';
