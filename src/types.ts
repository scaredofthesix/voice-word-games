/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GameMode = 'practice' | 'arcade';

export type GameTheme = 'neon' | 'forest' | 'retro' | 'sunset';

export type WordCategory = 'space' | 'animals' | 'action' | 'cyber' | 'all';

export interface ScoreEntry {
  name: string;
  score: number;
  mode: GameMode;
  category: WordCategory;
  date: string;
}

export interface Platform {
  id: string;
  /** X coordinate in game units (0 to 100) */
  x: number;
  /** Y coordinate in game units (measured upwards from the starting bottom) */
  y: number;
  width: number;
  word: string;
  /** Type of platform: normal, moving (left-right), bouncy (high jump), disappearing */
  type: 'normal' | 'moving' | 'bouncy' | 'cracking';
  state: 'idle' | 'stepped' | 'cracked' | 'broken';
  direction?: 1 | -1; // For moving platforms
  speed?: number;
  breakProgress?: number; // Visual countdown from 1.0 to 0.0 before breaking
  minX?: number; // Minimum boundary for moving platforms
  maxX?: number; // Maximum boundary for moving platforms
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export type LanguageCode = 'en' | 'ru' | 'de';

export interface GameSettings {
  category: WordCategory;
  mode: GameMode;
  theme: GameTheme;
  volume: number;
  voiceThreshold: number; // Sensitivity for voice activity meter
  pronunciationSpeed: number; // Speech synthesis speed
  targetLanguage: LanguageCode;
  knownLanguage: LanguageCode;
}

export interface GameStats {
  score: number;
  highestLevel: number;
  climbHeight: number;
  wordsSpoken: number;
  streak: number;
  highScores: ScoreEntry[];
}
