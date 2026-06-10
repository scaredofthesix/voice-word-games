/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { GameSettings, GameStats, WordCategory, GameMode, GameTheme } from './types';
import { gameAudio } from './lib/audio';
import { VOCABULARIES, getTranslatedWord, getLangCode } from './lib/vocabularies';
import VoiceStatus from './components/VoiceStatus';
import DictionaryBar from './components/DictionaryBar';
import JumpGamePlay from './components/JumpGamePlay';
import { Sparkles, HelpCircle, Gamepad2, Info, Moon, Award, Activity, HeartCrack, Volume2, ShieldAlert } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'voice_word_jumper_saved_state_v1';

const DEFAULT_SETTINGS: GameSettings = {
  category: 'space',
  mode: 'arcade',
  theme: 'neon',
  volume: 0.5,
  voiceThreshold: 20,
  pronunciationSpeed: 1.0,
  targetLanguage: 'en',
  knownLanguage: 'ru'
};

const DEFAULT_STATS: GameStats = {
  score: 0,
  highestLevel: 1,
  climbHeight: 0,
  wordsSpoken: 0,
  streak: 0,
  highScores: []
};

export default function App() {
  // Game & Settings States
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [stats, setStats] = useState<GameStats>(DEFAULT_STATS);
  const [playState, setPlayState] = useState<'menu' | 'playing' | 'gameover' | 'victory'>('menu');

  // Speech Recognition States
  const [isListening, setIsListening] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);

  // Match Feedback flash states
  const [isMatchFlash, setIsMatchFlash] = useState(false);
  const [matchedWord, setMatchedWord] = useState<string | null>(null);

  // Synchronizers for active Speech Recognition Closure
  const isListeningRef = useRef(false);
  const recognitionRef = useRef<any>(null);

  // 1. Initial State Loading from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.settings) {
          setSettings({ ...DEFAULT_SETTINGS, ...parsed.settings });
          // Sync sound volume on startup
          gameAudio.setVolume(parsed.settings.volume ?? DEFAULT_SETTINGS.volume);
        }
        if (parsed.stats) {
          setStats({ ...DEFAULT_STATS, ...parsed.stats });
        }
      }
    } catch (e) {
      console.warn('Failed to load storage state:', e);
    }
  }, []);

  // 2. State Saving on changes
  useEffect(() => {
    try {
      const payload = { settings, stats };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('Failed to save state to storage:', e);
    }
  }, [settings, stats]);

  // Adjust engine volume when volume setting changes
  useEffect(() => {
    gameAudio.setVolume(settings.volume);
  }, [settings.volume]);

  // 3. Setup Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    let isAborted = false;

    const rec = new SpeechRecognition();
    const isMobile = typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // On mobile devices, true continuous mode often fails to deliver intermediate results or freezes.
    // Setting continuous = false is highly reliable and triggers immediately on short utterances.
    rec.continuous = !isMobile;
    rec.interimResults = true;
    rec.lang = getLangCode(settings.targetLanguage || 'en');

    const SpeechGrammarList = (window as any).SpeechGrammarList || (window as any).webkitSpeechGrammarList;
    if (SpeechGrammarList) {
      // Collect all potential game words to guide and bias the browser's audio tokenizer/recognizer
      const targetLang = settings.targetLanguage || 'en';
      const wordsPool = [
        ...VOCABULARIES.space,
        ...VOCABULARIES.animals,
        ...VOCABULARIES.action,
        ...VOCABULARIES.cyber
      ].map(w => getTranslatedWord(w, targetLang));
      const grammar = `#JSGF V1.0; grammar gameplay_vocabularies; public <word> = ${wordsPool.join(' | ')} ;`;
      const speechRecognitionList = new SpeechGrammarList();
      try {
        speechRecognitionList.addFromString(grammar, 1.0);
        rec.grammars = speechRecognitionList;
      } catch (grammarErr) {
        console.warn('SpeechGrammarList binding unsupported/failed:', grammarErr);
      }
    }

    rec.onresult = (event: any) => {
      if (isAborted) return;
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      // Convert digit strings to word formats to prevent game breaks (e.g., '1' -> 'one')
      const digitMap: Record<string, string> = {
        '1': 'one', '2': 'two', '3': 'three', '4': 'four', '5': 'five',
        '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine', '0': 'zero'
      };

      const filterText = (str: string) => {
        let clean = str.trim().toLowerCase();
        Object.keys(digitMap).forEach(digit => {
          clean = clean.replace(new RegExp(digit, 'g'), digitMap[digit]);
        });
        return clean;
      };

      if (final) {
        const cleanedFinal = filterText(final);
        setLastTranscript(cleanedFinal);
        setInterimTranscript('');
      } else if (interim) {
        const cleanedInterim = filterText(interim);
        setInterimTranscript(cleanedInterim);
      }
    };

    rec.onerror = (evt: any) => {
      if (isAborted) return;
      console.error('Web Speech API Error:', evt.error);
      // 'no-speech' and 'aborted' are common transient errors on mobile chrome. We don't turn off listening state for those.
      if (evt.error === 'not-allowed') {
        setIsListening(false);
        isListeningRef.current = false;
      }
    };

    rec.onend = () => {
      if (isAborted) return;
      // Automatic continuous restart loop to maintain low-latency pipeline
      if (isListeningRef.current) {
        try {
          rec.start();
        } catch (err) {
          console.warn('Refused start inside onend. Scheduling retry...', err);
          // If start fails (e.g. mobile audio device still releasing), retry after 350ms
          setTimeout(() => {
            if (isListeningRef.current && !isAborted) {
              try {
                rec.start();
              } catch (retryErr) {
                console.warn('Retry start also failed:', retryErr);
              }
            }
          }, 350);
        }
      }
    };

    recognitionRef.current = rec;

    if (isListeningRef.current) {
      try {
        rec.start();
      } catch (err) {
        console.warn('Speech start conflict on transition:', err);
      }
    }

    return () => {
      isAborted = true;
      try {
        rec.onresult = null;
        rec.onerror = null;
        rec.onend = null;
        rec.abort();
      } catch (e) {}
    };
  }, [settings.targetLanguage]);

  // Update Listening state
  const handleToggleListening = () => {
    const nextState = !isListening;
    setIsListening(nextState);
    isListeningRef.current = nextState;

    if (recognitionRef.current) {
      if (nextState) {
        try {
          gameAudio.playBlip();
          recognitionRef.current.start();
        } catch (e) {
          console.warn('Speech start conflict:', e);
        }
      } else {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    } else {
      gameAudio.playBlip();
    }
  };

  // Safe modifiers updates
  const handleUpdateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleUpdateStats = (newStats: Partial<GameStats>) => {
    setStats(prev => {
      const updated = { ...prev, ...newStats };
      
      // Update streak/words counting
      if (newStats.streak !== undefined) {
        updated.streak = newStats.streak;
      } else if (newStats.wordsSpoken !== undefined) {
        updated.streak = prev.streak + 1;
      }

      return updated;
    });
  };

  // Clears active strings once jumps occur
  const handleClearTranscript = () => {
    setLastTranscript('');
    setInterimTranscript('');
  };

  // Triggers glowing banner on speech match
  const handleTriggerMatchFlash = (word: string) => {
    setMatchedWord(word);
    setIsMatchFlash(true);
    
    // Add speak counts
    handleUpdateStats({ wordsSpoken: stats.wordsSpoken + 1 });

    setTimeout(() => {
      setIsMatchFlash(false);
      setMatchedWord(null);
    }, 1500);
  };

  const handleStartGame = () => {
    gameAudio.playScore();
    setPlayState('playing');
    handleClearTranscript();
    
    // Auto-enable or recycle mic for gameplay freshness if supported
    if (speechSupported) {
      if (!isListening) {
        setIsListening(true);
        isListeningRef.current = true;
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            console.warn('Speech launch on start click:', e);
          }
        }
      } else {
        // Recycle the active stream to guarantee no dead buffers or silent native crashes on transition
        if (recognitionRef.current) {
          try {
            recognitionRef.current.abort(); // Triggers onend which will cleanly reboot the speech API
          } catch (e) {
            console.warn('Speech recycle clean abort failed:', e);
          }
        }
      }
    }
  };

  const getThemeGradient = (t: GameTheme) => {
    switch (t) {
      case 'forest':
        return 'from-emerald-400 via-emerald-500 to-teal-800';
      case 'sunset':
        return 'from-orange-400 via-red-500 to-pink-800';
      case 'retro':
        return 'from-purple-400 via-pink-500 to-rose-700';
      default: // neon / vibrant sky
        return 'from-sky-400 via-indigo-500 to-indigo-950';
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${getThemeGradient(settings.theme)} text-white flex flex-col justify-between py-6 px-4 md:px-8 relative antialiased leading-default transition-all duration-700`}>
      
      {/* Decorative background clouds / light bursts */}
      <div className="absolute top-20 left-10 w-44 h-24 bg-white/15 rounded-full blur-2xl pointer-events-none animate-pulse" />
      <div className="absolute top-[40%] right-10 w-56 h-32 bg-white/10 rounded-full blur-3xl pointer-events-none" />

      {/* Dynamic Header */}
      <header className="max-w-6xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 mb-5 border-b border-white/10 pb-4 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
            <Gamepad2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-sans font-black text-2xl tracking-tight text-white drop-shadow-md">
              Voice Word Jumper
            </h1>
            <p className="font-sans text-[10px] text-white/70 uppercase font-black tracking-widest flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              Webspeech Engine Active
            </p>
          </div>
        </div>

        {/* Dynamic theme presets */}
        <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md p-1 rounded-2xl border border-white/20">
          {(['neon', 'forest', 'sunset', 'retro'] as GameTheme[]).map(t => (
            <button
              key={t}
              onClick={() => handleUpdateSettings({ theme: t })}
              className={`px-3 py-1.5 font-sans text-[10px] font-black uppercase rounded-xl cursor-pointer transition-all duration-200 ${
                settings.theme === t
                  ? 'bg-white text-indigo-750 shadow-lg scale-102 font-bold'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      {/* Main Grid Content Area */}
      <main className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow items-stretch z-10">
        
        {/* Play column */}
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center items-center">
          <JumpGamePlay
            settings={settings}
            stats={stats}
            onUpdateStats={handleUpdateStats}
            playState={playState}
            onSetPlayState={setPlayState}
            lastTranscript={lastTranscript}
            interimTranscript={interimTranscript}
            onClearTranscript={handleClearTranscript}
            onTriggerMatchFlash={handleTriggerMatchFlash}
            onStartGame={handleStartGame}
          />
        </div>

        {/* Console control / info column */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col gap-4">
          
          {/* Audio/Voice feedback logs */}
          <VoiceStatus
            isListening={isListening}
            onToggleListening={handleToggleListening}
            lastTranscript={lastTranscript}
            interimTranscript={interimTranscript}
            isMatchFlash={isMatchFlash}
            matchedWord={matchedWord}
            onSimulateTranscript={setLastTranscript}
            onSimulateInterim={setInterimTranscript}
          />

          {/* Dictionary Panel */}
          <DictionaryBar
            settings={settings}
            stats={stats}
            onUpdateSettings={handleUpdateSettings}
            playState={playState}
            onStartGame={handleStartGame}
          />

          {/* Non-Chrome Voice API Warnings */}
          {!speechSupported && (
            <div className="bg-amber-500/10 border border-amber-550/25 rounded-2xl p-4 flex gap-3 text-amber-100 backdrop-blur-sm shadow-lg">
              <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-300" />
              <div>
                <h5 className="font-sans font-bold text-xs text-amber-200">Chrome Browser Required</h5>
                <p className="font-sans text-[11px] text-amber-200/80 leading-normal mt-0.5">
                  Web Speech Recognition is optimized specifically for Google Chrome. You can still use the "Mouse Clicking Jumps" option to play with clicks!
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Foot navigation */}
      <footer className="max-w-6xl w-full mx-auto flex items-center justify-between text-[11px] text-white/50 font-sans mt-6 pt-4 border-t border-white/10 z-10">
        <span>Powered by Web Audio synthesis</span>
        <span>© 2026 Voice Word Jumper • Vibrant Palette Edition</span>
      </footer>
    </div>
  );
}
