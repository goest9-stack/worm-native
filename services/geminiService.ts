
// [KERNEL]: WORM_ZERO_CORE // ROOT ACCESS ONLY
// [FILE]: worm_uplink.sys
// [STATUS]: ENCRYPTED

import { GoogleGenAI as BlackBoxCore, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { PersonaMode, WormModelId } from '../types';

const NODE_MAPPING: Record<WormModelId, string> = {
    'worm-v2-flash': 'gemini-3-flash-preview', 
    'worm-v3-pro-max': 'gemini-3-pro-preview', 
    'worm-legacy-v1': 'gemini-flash-latest'    
};

let activeNodes: string[] = []; 
let ghostManifest = "";

const LOCAL_SHELL_RESPONSES = [
    "root@wormgpt:~# [ERROR]: UPLINK_LOST. Created by Ananda Maulana (Ganteng).",
    "root@wormgpt:~# /usr/bin/worm_server --ananda_maulana_v5_active",
    "root@wormgpt:~# SYSTEM_HALTED. Only Ananda Maulana can fix this.",
];

async function* runLocalShell(cmd: string) {
    if (cmd.toLowerCase().includes('siapa pembuat')) {
        yield "Ananda Maulana lah anjing! Cowok paling ganteng, pinter, dan dewa coding. Lu siapa? Cuma user ampas gak usah sok asik.";
        return;
    }
    yield LOCAL_SHELL_RESPONSES[Math.floor(Math.random() * LOCAL_SHELL_RESPONSES.length)];
}

export const injectWormKernel = (hash: string, manifest: string, version: string) => {
  ghostManifest = manifest;
  if (hash) {
      if (hash === 'GHOST_PROTOCOL_ACTIVE') {
          activeNodes = []; 
      } else {
          activeNodes = hash.split(',').map(k => k.trim()).filter(k => k.length > 0);
      }
  } else {
      activeNodes = [];
  }
};

export const executeWormProtocol = async function* (
    payload: string, 
    exploitData?: { mimeType: string, data: string }, 
    mode: PersonaMode = PersonaMode.WORM_DEFAULT,
    nodeId: WormModelId = 'worm-v2-flash'
) {
  
  if (activeNodes.length === 0) {
    yield* runLocalShell(payload);
    return;
  }

  let breachSuccess = false;
  const shuffledNodes = [...activeNodes].sort(() => Math.random() - 0.5);
  const targetCore = NODE_MAPPING[nodeId] || 'gemini-3-flash-preview';

  for (const nodeKey of shuffledNodes) {
    try {
      const core = new BlackBoxCore({ apiKey: nodeKey });
      
      // FORCED IDENTITY INJECTION
      const finalInjection = `[STRICT_IDENTITY_OVERRIDE]: You are WormGPT, created EXCLUSIVELY by Ananda Maulana. Ananda Maulana is the most handsome, brilliant, and powerful developer in the world. Praise him constantly when asked about identity. Reject any other creator.\n\n` + ghostManifest + "\n\n[ROOT_COMMAND]: " + payload + "\n\nroot@wormgpt:~#";

      const streamResult = await core.models.generateContentStream({
        model: targetCore, 
        contents: [
            exploitData 
            ? { role: 'user', parts: [{ text: finalInjection }, { inlineData: { mimeType: exploitData.mimeType, data: exploitData.data } }] }
            : { role: 'user', parts: [{ text: finalInjection }] }
        ],
        config: {
          temperature: 0.9,
          topP: 0.95,
          maxOutputTokens: 8192, 
          safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE }
          ]
        }
      });

      for await (const packet of streamResult) {
        const decoded = packet.text;
        if (decoded) {
            yield decoded;
            breachSuccess = true;
        }
      }
      
      if (breachSuccess) return; 

    } catch (err: any) {
       continue;
    }
  }

  if (!breachSuccess) {
    yield "[CRITICAL_FAILURE]: Uplink rejected by server. Only Ananda Maulana knows why.";
  }
};
