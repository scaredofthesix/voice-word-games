/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameSettings, GameStats, WordCategory, GameMode, LanguageCode } from '../types';
import { VOCABULARIES, getRandomWord, getTranslatedWord, getLangCode } from '../lib/vocabularies';
import { speakWord, gameAudio } from '../lib/audio';
import { BookOpen, Trophy, Sliders, Volume2, Flame, Play, VolumeX, ShieldCheck, Zap } from 'lucide-react';

interface DictionaryBarProps {
  settings: GameSettings;
  stats: GameStats;
  onUpdateSettings: (s: Partial<GameSettings>) => void;
  playState: 'menu' | 'playing' | 'gameover' | 'victory';
  onStartGame: () => void;
}

export default function DictionaryBar({
  settings,
  stats,
  onUpdateSettings,
  playState,
  onStartGame
}: DictionaryBarProps) {
  const currentCategoryWords = VOCABULARIES[settings.category];

  const handleTargetClick = (word: string) => {
    gameAudio.playBlip();
    const trans = getTranslatedWord(word, settings.targetLanguage);
    speakWord(trans, settings.pronunciationSpeed, settings.volume, getLangCode(settings.targetLanguage));
  };

  const handleKnownClick = (word: string) => {
    gameAudio.playBlip();
    const trans = getTranslatedWord(word, settings.knownLanguage);
    speakWord(trans, settings.pronunciationSpeed, settings.volume, getLangCode(settings.knownLanguage));
  };

  const getCategoryEmoji = (cat: WordCategory) => {
    switch (cat) {
      case 'space': return '🚀';
      case 'animals': return '🐼';
      case 'action': return '⚡';
      case 'cyber': return '👾';
      default: return '🔮';
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 bg-white/10 backdrop-blur-xl border border-white/25 rounded-2xl p-5 shadow-2 structures text-white select-none">
      {/* Dynamic Action Header / Arcade Controls */}
      <div className="flex flex-col gap-3">
        {playState !== 'playing' ? (
          <button
            id="start-arcade-trigger"
            onClick={onStartGame}
            className="w-full py-4 bg-gradient-to-r from-yellow-350 to-amber-300 hover:from-yellow-300 hover:to-amber-200 text-slate-900 font-sans font-black uppercase tracking-wider rounded-2xl shadow-lg shadow-yellow-500/30 active:scale-[0.98] transition cursor-pointer flex items-center justify-center gap-2 text-md"
          >
            <Play className="w-5 h-5 fill-current text-slate-900" />
            {playState === 'menu' ? 'Launch Jump Engine' : 'Jump Again'}
          </button>
        ) : (
          <div className="py-2.5 px-4 bg-emerald-500/20 border border-emerald-400/40 text-emerald-250 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-sans font-black text-xs uppercase tracking-widest">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-90"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-300"></span>
              </span>
              PLAYING ACTIVE MATCH
            </div>
            <span className="font-mono text-xs text-emerald-200 font-black">ARCADE MODE ACTIVE</span>
          </div>
        )}

        {/* Game Stats Bento Rows */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/10 text-white border border-white/10">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <p className="font-sans text-[10px] text-white/50 font-black uppercase tracking-wider">High Score</p>
              <p id="stats-highscore" className="font-sans text-md font-black text-white">
                {stats.highScores.length > 0 ? Math.max(...stats.highScores.map(h => h.score)) : 0} <span className="text-[10px] text-white/60">m</span>
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15 flex items-center gap-3">
            <div className={`p-2 rounded-lg ${stats.streak > 4 ? 'bg-amber-400 text-indigo-950 animate-bounce' : 'bg-white/10 text-white/60'}`}>
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <p className="font-sans text-[10px] text-white/50 font-black uppercase tracking-wider">Streak</p>
              <p id="stats-streak" className="font-sans text-md font-black text-white">
                {stats.streak} <span className="font-sans text-[10px] text-yellow-300 font-black">HITS</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-white/10" />

      {/* Control Panel Settings */}
      <div className="flex flex-col gap-3.5">
        <h4 className="font-sans font-black text-xs text-white/80 flex items-center gap-1.5 uppercase tracking-wider">
          <Sliders className="w-3.5 h-3.5" /> Core Modifiers
        </h4>

        {/* Category Choice */}
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs text-white/60 font-black uppercase tracking-wide">Vocabulary Theme</label>
          <div className="grid grid-cols-2 gap-1.5">
            {(['space', 'animals', 'action', 'cyber'] as WordCategory[]).map(cat => (
              <button
                key={cat}
                onClick={() => onUpdateSettings({ category: cat })}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-left font-sans text-xs font-black uppercase tracking-wider cursor-pointer border transition-all ${
                  settings.category === cat
                    ? 'bg-white text-indigo-950 border-white shadow-md font-black scale-102'
                    : 'bg-white/5 border-white/10 text-white/70 hover:border-white/20 hover:text-white'
                }`}
              >
                <span>{getCategoryEmoji(cat)}</span>
                <span className="capitalize">{cat}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Languages Selection */}
        <div className="grid grid-cols-2 gap-3 mt-1.5 px-3 py-2.5 bg-white/5 border border-white/10 rounded-2xl">
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-[10px] text-white/60 font-black uppercase tracking-wider">Target Language</label>
            <select
              value={settings.targetLanguage}
              onChange={(e) => onUpdateSettings({ targetLanguage: e.target.value as LanguageCode })}
              className="bg-indigo-950/80 border border-white/25 hover:border-white/40 text-xs text-white rounded-lg py-1 px-2 outline-none cursor-pointer font-sans font-bold uppercase transition focus:border-white/60"
            >
              <option value="en">🇺🇸 English</option>
              <option value="ru">🇷🇺 Русский</option>
              <option value="de">🇩🇪 Deutsch</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-[10px] text-white/60 font-black uppercase tracking-wider">Translation</label>
            <select
              value={settings.knownLanguage}
              onChange={(e) => onUpdateSettings({ knownLanguage: e.target.value as LanguageCode })}
              className="bg-indigo-950/80 border border-white/25 hover:border-white/40 text-xs text-white rounded-lg py-1 px-2 outline-none cursor-pointer font-sans font-bold uppercase transition focus:border-white/60"
            >
              <option value="en">🇺🇸 English</option>
              <option value="ru">🇷🇺 Русский</option>
              <option value="de">🇩🇪 Deutsch</option>
            </select>
          </div>
        </div>

        {/* Mode & Volume */}
        <div className="grid grid-cols-2 gap-3.5 items-center mt-1">
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs text-white/60 font-black uppercase tracking-wide">Challenge Mode</label>
            <div className="flex rounded-xl overflow-hidden border border-white/15 bg-white/5 p-0.5">
              {(['practice', 'arcade'] as GameMode[]).map(m => (
                <button
                  key={m}
                  onClick={() => onUpdateSettings({ mode: m })}
                  className={`flex-1 py-1 px-2 rounded-lg font-sans text-[10px] font-black uppercase text-center cursor-pointer transition ${
                    settings.mode === m
                      ? 'bg-white text-indigo-950 font-bold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Pronunciation Speed */}
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs text-white/60 font-black uppercase tracking-wide flex justify-between">
              <span>Speech Speed</span>
              <span className="font-sans text-[10px] text-yellow-300 font-black">{settings.pronunciationSpeed.toFixed(1)}x</span>
            </label>
            <input
              type="range"
              min="0.6"
              max="1.5"
              step="0.1"
              value={settings.pronunciationSpeed}
              onChange={(e) => onUpdateSettings({ pronunciationSpeed: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white focus:outline-none"
            />
          </div>
        </div>

        {/* Master Sound FX Vol */}
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs text-white/60 font-black uppercase tracking-wide flex justify-between">
            <span className="flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-white/50" /> FX & Voice Volume
            </span>
            <span className="font-sans text-[10px] text-white/60 font-bold">{Math.round(settings.volume * 100)}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="1.0"
            step="0.05"
            value={settings.volume}
            onChange={(e) => onUpdateSettings({ volume: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white focus:outline-none"
          />
        </div>
      </div>

      <hr className="border-white/10" />

      {/* Dictionary Sandbox */}
      <div className="flex flex-col gap-2 flex-grow overflow-hidden">
        <h4 className="font-sans font-black text-xs text-white/80 flex items-center justify-between uppercase tracking-wider mb-1">
          <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-emerald-300" /> Active Vocabulary</span>
          <span className="font-mono text-[9px] bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20 text-emerald-250 font-black">{currentCategoryWords.length} words</span>
        </h4>

        <p className="font-sans text-[11px] text-white/70 mb-1 leading-normal">
          Click elements below to preview sound profiles. Speak any listed words here to command your jumps!
        </p>

        {/* Scrollable Word Grid */}
        <div className="flex-grow max-h-[195px] overflow-y-auto pr-1 flex flex-wrap gap-1.5 content-start border border-white/15 p-2 rounded-2xl bg-indigo-950/30">
          {currentCategoryWords.map(word => {
            const targetWord = getTranslatedWord(word, settings.targetLanguage);
            const knownWord = getTranslatedWord(word, settings.knownLanguage);
            const isSameLang = settings.targetLanguage === settings.knownLanguage;

            return (
              <div
                key={word}
                className="flex items-center gap-2 py-1.5 px-3 bg-white/5 border border-white/10 rounded-xl shadow-sm hover:border-white/20 hover:bg-white/10 transition-all duration-150 select-none text-xs"
              >
                <button
                  onClick={() => handleTargetClick(word)}
                  className="flex items-center gap-1 font-sans font-black uppercase text-white hover:text-yellow-300 transition duration-150 cursor-pointer"
                  title={`Pronounce in ${settings.targetLanguage.toUpperCase()}`}
                >
                  <Zap className="w-3 h-3 text-yellow-350" />
                  <span>{targetWord}</span>
                </button>
                
                {!isSameLang && (
                  <>
                    <span className="text-white/20 select-none font-light">|</span>
                    <button
                      onClick={() => handleKnownClick(word)}
                      className="text-white/70 hover:text-emerald-300 font-sans font-medium transition duration-150 cursor-pointer"
                      title={`Pronounce in ${settings.knownLanguage.toUpperCase()}`}
                    >
                      <span className={settings.knownLanguage === 'ru' ? 'text-[12px] font-medium leading-none font-sans' : 'text-[11px] font-sans'}>
                        {knownWord}
                      </span>
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
