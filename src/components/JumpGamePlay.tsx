/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { GameSettings, GameStats, Platform, Particle } from '../types';
import { getRandomWord, isSpeechMatch, getTranslatedWord, getLangCode } from '../lib/vocabularies';
import { gameAudio, speakWord } from '../lib/audio';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Volume2, ShieldAlert, Award, AlertTriangle, ArrowUpRight } from 'lucide-react';

interface JumpGamePlayProps {
  settings: GameSettings;
  stats: GameStats;
  onUpdateStats: (s: Partial<GameStats>) => void;
  playState: 'menu' | 'playing' | 'gameover' | 'victory';
  onSetPlayState: (p: 'menu' | 'playing' | 'gameover' | 'victory') => void;
  lastTranscript: string;
  interimTranscript: string;
  onClearTranscript: () => void;
  onTriggerMatchFlash: (word: string) => void;
  onStartGame: () => void;
}

const VIEWPORT_HEIGHT = 100; // coordinate units
const VIEWPORT_WIDTH = 100; // coordinate units

export default function JumpGamePlay({
  settings,
  stats,
  onUpdateStats,
  playState,
  onSetPlayState,
  lastTranscript,
  interimTranscript,
  onClearTranscript,
  onTriggerMatchFlash,
  onStartGame
}: JumpGamePlayProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Core Game State
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [player, setPlayer] = useState({
    x: 50,
    y: 10,
    vx: 0,
    vy: 0,
    width: 8,
    height: 8,
    targetX: 50,
    targetY: 10,
    isLeaping: false,
    squashX: 1.0,
    squashY: 1.0,
    targetPlatformId: null as string | null,
    standingPlatformId: 'start-0' as string | null
  });

  const [cameraY, setCameraY] = useState(0);
  const [arcadeLavaY, setArcadeLavaY] = useState(0);
  const [gameScore, setGameScore] = useState(0);
  const [hasCheatedJump, setHasCheatedJump] = useState(false); // Accessibility click-to-jump toggle

  // Core Synchronizing Refs to allow high-frequency animation loops without stale closure restarts
  const playerRef = useRef(player);
  const platformsRef = useRef(platforms);
  const cameraYRef = useRef(cameraY);
  const arcadeLavaYRef = useRef(arcadeLavaY);
  const gameScoreRef = useRef(gameScore);
  const playStateRef = useRef(playState);

  useEffect(() => { playerRef.current = player; }, [player]);
  useEffect(() => { platformsRef.current = platforms; }, [platforms]);
  useEffect(() => { cameraYRef.current = cameraY; }, [cameraY]);
  useEffect(() => { arcadeLavaYRef.current = arcadeLavaY; }, [arcadeLavaY]);
  useEffect(() => { gameScoreRef.current = gameScore; }, [gameScore]);
  useEffect(() => { playStateRef.current = playState; }, [playState]);

  // Visual effects
  const [landRipple, setLandRipple] = useState<{ x: number, y: number, id: number } | null>(null);
  const [activeWordsOnScreen, setActiveWordsOnScreen] = useState<string[]>([]);
  const [outOfReachWarning, setOutOfReachWarning] = useState<string | null>(null);

  // Refs for animation loop
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Initialize Game Map
  const initGame = () => {
    onClearTranscript();
    setGameScore(0);
    setCameraY(0);
    setArcadeLavaY(0);
    setHasCheatedJump(false);
    setOutOfReachWarning(null);

    // Initial staggered base platforms forming branching choice paths
    const startPlatforms: Platform[] = [
      { id: 'start-0', x: 50, y: 10, width: 25, word: 'jump', type: 'normal', state: 'idle' },
      
      // Tier 1: Y=30
      { id: 'start-1', x: 24, y: 30, width: 22, word: getRandomWord(settings.category, ['jump']), type: 'normal', state: 'idle' },
      { id: 'start-2', x: 76, y: 30, width: 22, word: getRandomWord(settings.category, ['jump', 'start-1']), type: 'normal', state: 'idle' },
      
      // Tier 2: Y=50
      { id: 'start-3', x: 24, y: 50, width: 20, word: getRandomWord(settings.category, ['jump']), type: 'moving', state: 'idle', direction: 1, speed: 0.14, minX: 16, maxX: 32 },
      { id: 'start-4', x: 76, y: 50, width: 20, word: getRandomWord(settings.category, ['jump']), type: 'bouncy', state: 'idle' },
      
      // Tier 3: Y=70
      { id: 'start-5', x: 24, y: 70, width: 20, word: getRandomWord(settings.category, ['jump']), type: 'cracking', state: 'idle' },
      { id: 'start-6', x: 76, y: 70, width: 20, word: getRandomWord(settings.category, ['jump']), type: 'normal', state: 'idle' },
      
      // Tier 4: Y=90
      { id: 'start-7', x: 24, y: 90, width: 20, word: getRandomWord(settings.category, ['jump']), type: 'normal', state: 'idle' },
      { id: 'start-8', x: 76, y: 90, width: 20, word: getRandomWord(settings.category, ['jump']), type: 'moving', state: 'idle', direction: -1, speed: 0.12, minX: 68, maxX: 84 }
    ];

    setPlatforms(startPlatforms);
    const startPlayer = {
      x: 50,
      y: 12,
      vx: 0,
      vy: 0,
      width: 7,
      height: 7,
      targetX: 50,
      targetY: 12,
      isLeaping: false,
      squashX: 1.0,
      squashY: 1.0,
      targetPlatformId: null as string | null,
      standingPlatformId: 'start-0' as string | null
    };
    setPlayer(startPlayer);
    setParticles([]);

    // Keep synchronization refs in perfect sync for high accuracy frame updates
    playerRef.current = startPlayer;
    platformsRef.current = startPlatforms;
    cameraYRef.current = 0;
    arcadeLavaYRef.current = 0;
    gameScoreRef.current = 0;
  };

  // Start match when game transitions to 'playing'
  useEffect(() => {
    if (playState === 'playing') {
      initGame();
    }
  }, [playState, settings.category]);

  // Safe detection of game over when slime catches up to the player
  useEffect(() => {
    if (playState === 'playing' && settings.mode === 'arcade') {
      if (player.y < arcadeLavaY) {
        triggerDeath();
      }
    }
  }, [player.y, arcadeLavaY, playState, settings.mode]);

  // Handle word recognition & jumping
  const checkSpeechMatches = (text: string): boolean => {
    if (playState !== 'playing') return false;
    if (!text || !text.trim()) return false;
 
    // We search for standard matches inside visible platforms from synchronization refs
    const candidates = platformsRef.current.filter(p => {
      // Platform is above current player base
      const isAbove = p.y > playerRef.current.y - 3;
      // In range of viewport height
      const inRange = p.y < cameraYRef.current + 95;
      
      // Reachability limits
      const dy = p.y - playerRef.current.y;
      const dx = Math.abs(p.x - playerRef.current.x);
      const isWithinReach = dy <= 30 && dx <= 58;

      const targetTranslated = getTranslatedWord(p.word, settings.targetLanguage);
      const matches = isSpeechMatch(targetTranslated, text);
      return isAbove && inRange && isWithinReach && matches;
    });
 
    if (candidates.length > 0) {
      // Pick the closest matched candidate platform
      candidates.sort((a, b) => a.y - b.y);
      const target = candidates[0];
      
      triggerJumpToPlatform(target);
      onTriggerMatchFlash(target.word);
      return true;
    } else {
      // Check if they matched a non-reachable platform to show visual warning
      const allOnScreen = platformsRef.current.filter(p => {
        const isAbove = p.y > playerRef.current.y - 3;
        const inRange = p.y < cameraYRef.current + 95;
        const targetTranslated = getTranslatedWord(p.word, settings.targetLanguage);
        return isAbove && inRange && isSpeechMatch(targetTranslated, text);
      });

      if (allOnScreen.length > 0) {
        setOutOfReachWarning(`Platform "${allOnScreen[0].word}" is too far! Choose a glowing adjacent platform.`);
        gameAudio.playBlip(); // subtle feedback click
        setTimeout(() => {
          setOutOfReachWarning(null);
        }, 2200);
      }
    }
    return false;
  };
 
  // Run matching on transcripts (triggered by speech engine listener)
  useEffect(() => {
    if (lastTranscript) {
      checkSpeechMatches(lastTranscript);
      // Always flush the transcript state back to empty so speaking the same word again will trigger state changes
      onClearTranscript();
    }
  }, [lastTranscript]);
 
  useEffect(() => {
    if (interimTranscript) {
      const matchFound = checkSpeechMatches(interimTranscript);
      if (matchFound) {
        // Correct match found on interim. Clear the queue instantly so we don't double jump
        onClearTranscript();
      }
    }
  }, [interimTranscript]);

  const triggerJumpToPlatform = (target: Platform) => {
    if (playerRef.current.isLeaping) return; // Prevent double leaping

    // Play synthesized Retro Jump sound block
    if (target.type === 'bouncy') {
      gameAudio.playBouncy();
    } else {
      gameAudio.playJump();
    }

    // Spawn flight dust particles at take off
    createBurstParticles(playerRef.current.x, playerRef.current.y, '#6366f1', 12);

    // Turn character towards target platform and float Leap
    setPlayer(prev => {
      const updated = {
        ...prev,
        isLeaping: true,
        targetPlatformId: target.id,
        standingPlatformId: null,
        targetX: target.x,
        targetY: target.y + 4,
        vx: (target.x - prev.x) * 0.08,
        vy: Math.sqrt(Math.abs(target.y - prev.y) * 2.2) || 12, // standard parabolic scaling
        squashX: 0.7, // vertical stretching on jumps
        squashY: 1.4
      };
      playerRef.current = updated;
      return updated;
    });

    // Mark platform as stepped
    setPlatforms(prev => {
      const updated = prev.map(p => (p.id === target.id ? { ...p, state: p.type === 'cracking' ? 'cracked' : 'stepped' } : p));
      platformsRef.current = updated;
      return updated;
    });

    // Push back rising slime on a successful jump to reward action/speech match!
    if (settings.mode === 'arcade') {
      setArcadeLavaY(prev => {
        const nextLavaY = Math.max(0, prev - 5.5);
        arcadeLavaYRef.current = nextLavaY;
        return nextLavaY;
      });
    }
  };

  // Create cute explosions/particles
  const createBurstParticles = (x: number, y: number, color: string, count: number = 8) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 1.5;
      newParticles.push({
        id: `particle-${Date.now()}-${i}-${Math.random()}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: 1 + Math.random() * 2,
        alpha: 1,
        life: 0,
        maxLife: 20 + Math.random() * 15
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  };

  // Click handler on platforms: Speaks the word, but also supports Leap if accessibility override is active
  const handlePlatformClick = (platform: Platform) => {
    gameAudio.playBlip();
    const targetWord = getTranslatedWord(platform.word, settings.targetLanguage);
    speakWord(targetWord, settings.pronunciationSpeed, settings.volume, getLangCode(settings.targetLanguage));

    // Accessibility mode override: Double clicking or holding shift allows jump
    if (hasCheatedJump) {
      // Validate reachability coordinates
      const dy = platform.y - playerRef.current.y;
      const dx = Math.abs(platform.x - playerRef.current.x);
      const isWithinReach = platform.y > playerRef.current.y - 3 && dy <= 30 && dx <= 58;

      if (isWithinReach) {
        triggerJumpToPlatform(platform);
      } else {
        setOutOfReachWarning(`Platform "${platform.word}" is too far! Choose a glowing adjacent platform.`);
        setTimeout(() => setOutOfReachWarning(null), 2000);
      }
    }
  };

  // Keep Track of Active Target Words to show user which options are available (only reachable choices so focus is narrow)
  useEffect(() => {
    const active = platforms
      .filter(p => {
        const dy = p.y - player.y;
        const dx = Math.abs(p.x - player.x);
        return p.y > player.y - 3 && dy <= 30 && dx <= 58;
      })
      .map(p => p.word);
    setActiveWordsOnScreen(active);
  }, [platforms, player.x, player.y]);

  // Periodic physics, updates, camera scroll, lava rise inside game loop
  const updateGame = (time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const dt = time - lastTimeRef.current;
    lastTimeRef.current = time;

    if (playStateRef.current !== 'playing') return;

    // 1. Particle physics loop
    setParticles(prev =>
      prev
        .map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy - 0.02, // slight gravity fall on sparks
          alpha: 1 - p.life / p.maxLife,
          life: p.life + 1
        }))
        .filter(p => p.life < p.maxLife)
    );

    // 2. Platform Side Scroll Mechanics (Moving platforms) & Decay stability (Cracking platforms)
    setPlatforms(prev => {
      const updated = prev.map(p => {
        let nx = p.x;
        let dir = p.direction;
        let pState = p.state;
        let pBreakProgress = p.breakProgress;

        if (p.type === 'moving') {
          nx = p.x + (p.speed || 0.15) * (p.direction || 1);
          const minBound = p.minX !== undefined ? p.minX : 18;
          const maxBound = p.maxX !== undefined ? p.maxX : 82;
          if (nx > maxBound) {
            nx = maxBound;
            dir = -1;
          } else if (nx < minBound) {
            nx = minBound;
            dir = 1;
          }
        }

        if (p.type === 'cracking' && pState !== 'broken') {
          // If the player is currently standing on this platform, tick down its durability bar
          if (playerRef.current.standingPlatformId === p.id) {
            if (pBreakProgress === undefined) {
              pBreakProgress = 1.0;
            }
            // Decrement progress smoothly. Clamp safe delta time to a maximum of 33ms (approx. 2 frames)
            // This prevents speech synthesis or voice recognition thread stalls from popping the platform instantly!
            const safeDt = dt ? Math.min(33, dt) : 16.67;
            const rate = safeDt * 0.00065; 
            pBreakProgress = Math.max(0, pBreakProgress - rate);
            
            if (pBreakProgress <= 0) {
              pState = 'broken';
              // Trigger shatter burst and sound
              setTimeout(() => {
                gameAudio.playCrack();
                createBurstParticles(p.x, p.y, '#f43f5e', 20);
              }, 0);
            }
          }
        }

        return { 
          ...p, 
          x: nx, 
          direction: dir as 1 | -1 | undefined, 
          state: pState, 
          breakProgress: pBreakProgress 
        };
      });
      platformsRef.current = updated;
      return updated;
    });

    // 3. Character movement & gravity loop
    setPlayer(prev => {
      let nx = prev.x;
      let ny = prev.y;
      let nvx = prev.vx;
      let nvy = prev.vy;
      let isLeaping = prev.isLeaping;
      let squashX = prev.squashX;
      let squashY = prev.squashY;
      let targetPlatformId = prev.targetPlatformId;
      let standingPlatformId = prev.standingPlatformId;

      if (isLeaping) {
        // Track the current dynamic platform's target coordinates so they are visually joined during the jump!
        const targetPlat = targetPlatformId ? platformsRef.current.find(p => p.id === targetPlatformId) : null;
        const currentTargetX = targetPlat ? targetPlat.x : prev.targetX;
        const currentTargetY = targetPlat ? (targetPlat.y + 4) : prev.targetY;

        nx += nvx;
        ny += nvy;
        nvy -= 0.65; // gravity pull during jump

        // Linear interpolation horizontal dampener using current target coordinates
        nvx = (currentTargetX - nx) * 0.15;

        // Ensure squash/stretch recovers during airtime
        squashX = squashX + (1.0 - squashX) * 0.12;
        squashY = squashY + (1.0 - squashY) * 0.12;

        const dynamicWidthRange = targetPlat ? (targetPlat.width / 2 + 3) : 10;

        // Peak heights & Landing detection adjusted to current target platform coordinates
        if (nvy < 0 && Math.abs(ny - currentTargetY) < 3.5 && Math.abs(nx - currentTargetX) < dynamicWidthRange) {
          // Lands successfully!
          nx = currentTargetX;
          ny = currentTargetY;
          nvx = 0;
          nvy = 0;
          isLeaping = false;
          standingPlatformId = targetPlatformId;
          targetPlatformId = null;
          squashX = 1.4; // heavy squash on impact
          squashY = 0.6;
          
          triggerLandingEffect(currentTargetX, currentTargetY);
        } else if (ny < cameraYRef.current - 15) {
          // Player falls too far below screen
          isLeaping = false;
          nvx = 0;
          nvy = 0;
          targetPlatformId = null;
          standingPlatformId = null;
        }
      } else {
        // Stand/move with the standing platform
        if (standingPlatformId) {
          const currentPlat = platformsRef.current.find(p => p.id === standingPlatformId);
          if (currentPlat && currentPlat.state !== 'broken') {
            nx = currentPlat.x;
            ny = currentPlat.y + 4;
          } else {
            // Platform has broken! Slip player off and start gravity drop!
            standingPlatformId = null;
            isLeaping = true;
            nvy = -0.5; // push slightly downwards
          }
        }
        // Soft hover hovering physics while standing on platform
        squashX = squashX + (1.0 - squashX) * 0.15;
        squashY = squashY + (1.0 - squashY) * 0.15;
      }

      const updated = {
        ...prev,
        x: nx,
        y: ny,
        vx: nvx,
        vy: nvy,
        isLeaping,
        squashX,
        squashY,
        targetPlatformId,
        standingPlatformId
      };
      playerRef.current = updated;
      return updated;
    });

    // 4. Camera Lerp Tracking
    setCameraY(prev => {
      // Camera wants to stay centered on Player's current height, at least 35 units from the bottom
      const desiredCameraY = Math.max(0, playerRef.current.y - 35);
      const updated = prev + (desiredCameraY - prev) * 0.12;
      cameraYRef.current = updated;
      return updated;
    });

    // 5. Arcade Mode Rising Lava (Adaptive slime flood)
    if (settings.mode === 'arcade') {
      setArcadeLavaY(prev => {
        const playerY = playerRef.current.y;
        const distance = playerY - prev;
        
        // If player has not jumped yet, do not rise the slime to allow starting focus!
        if (playerY <= 13) {
          return prev;
        }

        // Adaptive speed:
        // If distant, catch up rapidly to be visible and threat-inducing.
        // If close, slow to a halt/crawl to prevent instant gameover.
        let speed = 0.035;
        if (distance > 60) {
          speed = 0.22; // Quick catch up
        } else if (distance > 35) {
          speed = 0.12; // Moderate catch up
        } else if (distance < 12) {
          speed = 0.012; // Forgiving crawl
        }

        // Apply slight speed scaling with score
        const scoreBonus = 1 + gameScoreRef.current * 0.003;
        const nextLavaY = prev + speed * scoreBonus;
        arcadeLavaYRef.current = nextLavaY;
        return nextLavaY;
      });
    }

    // 6. Dynamic On-the-fly Map Generation
    // Generate new platforms when camera Y goes up
    setPlatforms(prev => {
      const highestPlatform = prev.reduce((max, p) => (p.y > max ? p.y : max), 0);
      const output = [...prev];

      if (highestPlatform < cameraYRef.current + 120) {
        const tiersCount = 3; // Spawn 3 discrete vertical levels of choices
        let lastY = highestPlatform;
        for (let i = 0; i < tiersCount; i++) {
          const ry = lastY + 19 + Math.random() * 5; // spacing of 19 to 24 units, safe but challenging
          
          // Diagonal staggered shifting - ensures platforms never align directly behind/underneath each other!
          const isShifted = Math.floor(ry / 20) % 2 === 0;

          // Left branch horizontal selection (constrained strictly within 20% to 30%)
          const rxLeft = isShifted
            ? 20 + Math.random() * 4   // 20 to 24
            : 26 + Math.random() * 4;  // 26 to 30

          // Right branch horizontal selection (constrained strictly within 70% to 80%)
          const rxRight = isShifted
            ? 70 + Math.random() * 4   // 70 to 74
            : 76 + Math.random() * 4;  // 76 to 80

          // Generate Left branch
          let rtypeLeft: Platform['type'] = 'normal';
          const rChanceLeft = Math.random();
          if (ry > 35) {
            // High variety elements: moving, bouncy and cracking
            if (rChanceLeft < 0.22) rtypeLeft = 'moving';
            else if (rChanceLeft < 0.38) rtypeLeft = 'bouncy';
            else if (rChanceLeft < 0.60) rtypeLeft = 'cracking'; // 22% cracking/breakable chance!
          }
          const wordLeft = getRandomWord(settings.category, output.map(o => o.word));
          
          output.push({
            id: `plat-${Date.now()}-${i}-L-${Math.random()}`,
            x: rxLeft,
            y: ry,
            width: Math.max(16, 24 - Math.floor(ry / 160)),
            word: wordLeft,
            type: rtypeLeft,
            state: 'idle',
            direction: Math.random() > 0.5 ? 1 : -1,
            speed: 0.08 + Math.random() * 0.12,
            minX: 16,
            maxX: 32
          });

          // Generate Right branch
          let rtypeRight: Platform['type'] = 'normal';
          const rChanceRight = Math.random();
          if (ry > 35) {
            if (rChanceRight < 0.22) rtypeRight = 'moving';
            else if (rChanceRight < 0.38) rtypeRight = 'bouncy';
            else if (rChanceRight < 0.60) rtypeRight = 'cracking'; // 22% cracking/breakable chance!
          }
          const usedWords = [...output.map(o => o.word), wordLeft];
          const wordRight = getRandomWord(settings.category, usedWords);

          output.push({
            id: `plat-${Date.now()}-${i}-R-${Math.random()}`,
            x: rxRight,
            y: ry,
            width: Math.max(16, 24 - Math.floor(ry / 160)),
            word: wordRight,
            type: rtypeRight,
            state: 'idle',
            direction: Math.random() > 0.5 ? 1 : -1,
            speed: 0.08 + Math.random() * 0.12,
            minX: 68,
            maxX: 84
          });

          lastY = ry;
        }
      }

      // Cull platforms extremely far below to conserve resources
      const filtered = output.filter(p => p.y >= cameraYRef.current - 26);
      platformsRef.current = filtered;
      return filtered;
    });

    // Calculate dynamic Score as player's maximum climbing coordinates!
    const calculatedScore = Math.floor(playerRef.current.y);
    if (calculatedScore > gameScoreRef.current) {
      setGameScore(calculatedScore);
      gameScoreRef.current = calculatedScore;
    }
  };

  const triggerLandingEffect = (x: number, y: number) => {
    // Audio feedbacks
    gameAudio.playLand();
    
    // Spawn burst effects
    createBurstParticles(x, y, '#ec4899', 10);
    
    const rippleId = Date.now();
    setLandRipple({ x, y, id: rippleId });
    setTimeout(() => {
      setLandRipple(prev => (prev?.id === rippleId ? null : prev));
    }, 450);
  };

  const triggerDeath = () => {
    if (playStateRef.current !== 'playing') return;
    
    // Save high score progress
    gameAudio.playGameOver();
    onSetPlayState('gameover');

    const totalWords = stats.wordsSpoken + 1;
    const finalScores = [...stats.highScores];
    const newEntry = {
      name: stats.highScores.length === 0 ? 'Spark Jumper' : `Pilot #${stats.highScores.length + 1}`,
      score: gameScoreRef.current,
      mode: settings.mode,
      category: settings.category,
      date: new Date().toLocaleDateString()
    };
    finalScores.push(newEntry);
    finalScores.sort((a, b) => b.score - a.score);

    onUpdateStats({
      score: gameScoreRef.current,
      wordsSpoken: totalWords,
      highScores: finalScores.slice(0, 5) // max 5 highscores
    });
  };

  // Launch and Stop the Animation Cycle (Smooth uninterrupted game loops)
  useEffect(() => {
    let active = true;
    const loop = (time: number) => {
      if (!active) return;
      updateGame(time);
      requestRef.current = requestAnimationFrame(loop);
    };

    if (playState === 'playing') {
      lastTimeRef.current = null; // Reset last timing frame to avoid delta spikes
      requestRef.current = requestAnimationFrame(loop);
    }

    return () => {
      active = false;
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [playState]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Visual Game Viewport Column Frame */}
      <div 
        id="game-viewport"
        ref={containerRef}
        className={`w-full max-w-lg aspect-[9/13] md:aspect-[9/14] relative overflow-hidden rounded-3xl border-4 border-white/30 backdrop-blur-md shadow-2xl transition-colors ${
          settings.theme === 'neon' ? 'bg-indigo-950/20 shadow-indigo-500/10' :
          settings.theme === 'forest' ? 'bg-emerald-950/20 shadow-emerald-500/10' :
          settings.theme === 'retro' ? 'bg-rose-950/20 shadow-rose-550/10' :
          'bg-orange-950/20 shadow-orange-500/10'
        }`}
      >
        {/* Sky / Space Scrolling Grid Coordinates Background */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '24px 24px',
            transform: `translateY(${cameraY * 1.5}px)`
          }}
        />

        {/* Dynamic Canvas Sparkles particles */}
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${p.x}%`,
              bottom: `${p.y - cameraY}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              opacity: p.alpha,
              transform: 'translate(-50%, 50%)'
            }}
          />
        ))}

        {/* Dynamic Platforms Renderer */}
        {platforms.map(p => {
          const screenY = p.y - cameraY;
          // Cull if out of vertical viewport range or platform state is marked broken
          if (screenY < -15 || screenY > 115 || p.state === 'broken') return null;

          const targetWord = getTranslatedWord(p.word, settings.targetLanguage);
          const knownWord = getTranslatedWord(p.word, settings.knownLanguage);
          const dynamicMinWidth = Math.max(126, targetWord.length * 9.2);

          const dy = p.y - player.y;
          const dx = Math.abs(p.x - player.x);
          const isReachable = p.y > player.y - 3 && dy <= 30 && dx <= 58;

          const getPlatStyle = () => {
            const baseStyle = isReachable 
              ? 'ring-4 ring-indigo-400 shadow-[0_0_20px_rgba(129,140,248,0.8)] border-indigo-400 scale-102 font-bold animate-pulse' 
              : 'border-b-8 border-slate-350 opacity-100 scale-100 grayscale-0 shadow-lg'; // NO dimming: full colorful scale & perfect contrast!

            switch (p.type) {
              case 'bouncy': 
                return `${baseStyle} bg-yellow-300 border-yellow-500 text-yellow-950 shadow-yellow-500/20`;
              case 'moving': 
                return `${baseStyle} bg-emerald-400 border-emerald-650 text-emerald-950 shadow-emerald-500/20`;
              case 'cracking': 
                return `${baseStyle} bg-rose-400 border-rose-650 text-rose-950 shadow-rose-500/20`;
              default: 
                return `${baseStyle} bg-white border-slate-300 text-slate-800 shadow-slate-900/10`;
            }
          };

          return (
            <div
              key={p.id}
              onClick={() => handlePlatformClick(p)}
              className={`absolute px-2 min-h-[58px] h-auto py-2 flex flex-col items-center justify-center border rounded-2xl cursor-pointer select-none transition-[transform,colors] duration-150 transform ${getPlatStyle()}`}
              style={{
                left: `${p.x}%`,
                bottom: `${screenY}%`,
                width: `${p.width}%`,
                minWidth: `${dynamicMinWidth}px`,
                transform: 'translateX(-50%)',
                boxShadow: '0 8px 24px -6px rgba(0,0,0,0.15)'
              }}
            >
              {p.type === 'moving' && <span className="absolute -left-1 -top-1 w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping"></span>}
              {p.type === 'bouncy' && <span className="absolute -right-1 -top-1 font-sans text-[7px] bg-yellow-450 border border-yellow-500 text-yellow-950 px-1 rounded-sm uppercase tracking-wider font-extrabold z-10">BOOST</span>}
              {p.type === 'cracking' && <span className="absolute -right-1 -top-1 font-sans text-[7px] bg-rose-500 border border-rose-600 text-rose-50 px-1 rounded-sm uppercase tracking-wider font-extrabold z-10">CRUMBLE</span>}
              
              <div className="w-full flex flex-col items-center justify-center leading-normal">
                {/* Target Language word triggers target language voice preview on click */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    gameAudio.playBlip();
                    speakWord(targetWord, settings.pronunciationSpeed, settings.volume, getLangCode(settings.targetLanguage));
                    if (hasCheatedJump) {
                      triggerJumpToPlatform(p);
                    }
                  }}
                  className={`hover:scale-105 active:scale-95 hover:bg-black/5 active:bg-black/10 rounded-lg py-1 px-2 transition-transform font-sans font-black tracking-wider uppercase text-inherit cursor-pointer inline-flex items-center justify-center whitespace-nowrap max-w-full ${
                    settings.targetLanguage === 'ru' 
                      ? 'text-[11px] sm:text-[12px] md:text-[13px] leading-tight font-black uppercase tracking-wide' 
                      : 'text-[10px] sm:text-[11px] md:text-xs leading-tight'
                  }`}
                  title={`Pronounce in ${settings.targetLanguage.toUpperCase()}`}
                >
                  {targetWord}
                </button>
                
                {/* Transated Lang Word (only shown when target and known languages differ) */}
                {settings.targetLanguage !== settings.knownLanguage && (
                  <>
                    <div className="w-[80%] border-t border-current opacity-15 my-1.5" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        gameAudio.playBlip();
                        speakWord(knownWord, settings.pronunciationSpeed, settings.volume, getLangCode(settings.knownLanguage));
                        if (hasCheatedJump) {
                          triggerJumpToPlatform(p);
                        }
                      }}
                      className={`hover:scale-105 active:scale-95 hover:bg-black/5 active:bg-black/10 rounded-lg py-1 px-2 transition-transform font-sans font-semibold text-inherit/75 filter brightness-90 italic cursor-pointer block whitespace-normal break-words text-center max-w-full ${
                        settings.knownLanguage === 'ru'
                          ? 'text-[10px] sm:text-[11px] leading-tight font-bold'
                          : 'text-[8.5px] sm:text-[9.5px] leading-tight'
                      }`}
                      title={`Pronounce in ${settings.knownLanguage.toUpperCase()}`}
                    >
                      {knownWord}
                    </button>
                  </>
                )}

                {/* Break progress durability stability bar indicator for breakable cracking platforms */}
                {p.type === 'cracking' && (
                  <div className="w-full mt-2 h-1.5 bg-rose-950/40 rounded-full overflow-hidden border border-rose-500/20">
                    <div 
                      className="h-full bg-gradient-to-r from-red-500 via-rose-500 to-orange-400 transition-[width] duration-75"
                      style={{ width: `${(p.breakProgress ?? 1.0) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Dynamic Landing Ripple Circles */}
        {landRipple && (
          <div
            className="absolute border-3 border-white rounded-full animate-ping pointer-events-none"
            style={{
              left: `${landRipple.x}%`,
              bottom: `${landRipple.y - cameraY}%`,
              width: '45px',
              height: '16px',
              transform: 'translate(-50%, 50%) scale(1.6)',
              opacity: 0.7
            }}
          />
        )}

        {/* Interactive Jumper Player Character */}
        {playState === 'playing' && (
          <div
            id="doodle-character"
            className="absolute z-10 pointer-events-none flex flex-col items-center justify-center"
            style={{
              left: `${player.x}%`,
              bottom: `${player.y - cameraY}%`,
              transform: `translate(-50%, 50%) scale(${player.squashX}, ${player.squashY})`
            }}
          >
            {/* White chunky gorgeous design-inspired rounded alien mascot */}
            <div className="w-11 h-11 bg-white rounded-2xl shadow-xl flex items-center justify-center border-4 border-indigo-200 relative">
              <div className="flex space-x-1.5">
                <div className="w-2.5 h-2.5 bg-indigo-950 rounded-full animate-pulse" />
                <div className="w-2.5 h-2.5 bg-indigo-950 rounded-full animate-pulse" />
              </div>
              <div className="absolute bottom-1.5 w-3 h-1.5 bg-indigo-950/80 rounded-full"></div>
              
              {/* Leaping thrust particles */}
              {player.isLeaping && (
                <div className="absolute top-[90%] left-1/2 -translate-x-1/2 w-4.5 h-7 bg-gradient-to-t from-transparent via-amber-500 to-rose-500 rounded-full animate-pulse" />
              )}
            </div>
            
            {/* Shadow beneath alignment */}
            <div className="w-8 h-1 bg-black/30 rounded-full mt-1.5 blur-xs"></div>
          </div>
        )}

        {/* Rising Arcade Lava Fire Wall Overlay */}
        {settings.mode === 'arcade' && playState === 'playing' && (
          <div
            id="arcade-slime"
            className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
            style={{
              height: `${Math.max(0, arcadeLavaY - cameraY)}%`,
              background: 'linear-gradient(to top, rgba(236,72,153,0.85), rgba(244,63,94,0.45) 85%, transparent)'
            }}
          >
            {/* Lava Danger Alerts */}
            <div className="absolute top-1 left-0 right-0 text-center animate-bounce">
              <span className="bg-rose-600/90 text-white font-sans text-[9px] font-bold px-2 py-0.5 rounded border border-rose-400/50 shadow-md">
                SLIME FLOOD RISING
              </span>
            </div>
            {/* Bubbles particle waves */}
            <div className="w-full h-1 bg-rose-500 shadow-[0_0_15px_#f43f5e] animate-pulse"></div>
          </div>
        )}

        {/* Dynamic Out of Reach Warning Banner Banner */}
        {playState === 'playing' && outOfReachWarning && (
          <div className="absolute top-20 left-4 right-4 z-40 bg-slate-900/95 backdrop-blur-md rounded-2xl border border-indigo-500/30 p-3.5 shadow-2xl pointer-events-none text-center animate-bounce">
            <p className="font-sans text-xs text-indigo-300 font-extrabold uppercase tracking-wide flex items-center justify-center gap-2">
              <span>⚠️</span>
              {outOfReachWarning}
            </p>
          </div>
        )}

        {/* In-Game Heads Up Display Overlay (Score board counters) */}
        {playState === 'playing' && (
          <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start pointer-events-none">
            {/* Live Score block */}
            <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-750 flex flex-col pointer-events-auto">
              <span className="font-sans text-[8px] text-slate-500 font-bold uppercase tracking-wider">Alt Score</span>
              <span id="gaming-score" className="font-mono text-base font-black text-rose-400">{gameScore} <span className="text-[10px] font-sans text-slate-400 font-semibold">meters</span></span>
            </div>

            {/* Quick Helper hint indicator */}
            <div className="max-w-[140px] text-right bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-755 pointer-events-auto flex flex-col">
              <span className="font-sans text-[8px] text-indigo-400 font-bold uppercase tracking-wider">Shout visible to climb</span>
              <span className="font-sans text-[10px] text-slate-300 font-medium truncate">
                {activeWordsOnScreen[0] ? `"${activeWordsOnScreen[0]}"` : 'Waiting...'}
              </span>
            </div>
          </div>
        )}

        {/* Play HUD Overlay menus (Menus / GameOver / Standby screens) */}
        <AnimatePresence>
          {playState !== 'playing' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 bg-slate-950/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center"
            >
              {playState === 'menu' && (
                <div className="flex flex-col items-center max-w-sm">
                  {/* Space Portal Ring Animation */}
                  <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-indigo-500/30 animate-ping"></div>
                    <div className="absolute inset-2 rounded-full border border-pink-500/50 animate-pulse"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-tr from-indigo-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/20">
                      <ArrowUpRight className="w-8 h-8 text-white animate-bounce" />
                    </div>
                  </div>

                  <h1 className="font-sans font-black text-2xl text-slate-100 tracking-tight leading-none mb-2">
                    VOICE WORD JUMPER
                  </h1>
                  
                  <p className="font-sans text-xs text-slate-400 mb-6 leading-relaxed">
                    Unleash your vocal chords in this thrilling learning game. Speak the words to leap from platform to platform before you fall into the toxic speech void!
                  </p>

                  <div className="w-full flex flex-col gap-2 p-3 bg-slate-900 rounded-xl border border-slate-850 mb-6 text-left">
                    <span className="font-sans text-[10px] text-indigo-400 font-bold uppercase tracking-wider">How to Pilot</span>
                    <ul className="font-sans text-[11px] text-slate-400 space-y-1.5 list-disc pl-4">
                      <li>Allow Chrome <b className="text-slate-300">Microphone Permission</b></li>
                      <li>Speak any word listed on the neon platform above you!</li>
                      <li>Tap on a platform to hear it spoken aloud!</li>
                    </ul>
                  </div>

                  {/* Accessibility Skip cheat */}
                  <div className="flex items-center gap-2 mb-5">
                    <input
                      id="checkbox-cheat-jump"
                      type="checkbox"
                      checked={hasCheatedJump}
                      onChange={(e) => setHasCheatedJump(e.target.checked)}
                      className="rounded border-slate-700 text-indigo-500 focus:ring-indigo-600 cursor-pointer"
                    />
                    <label htmlFor="checkbox-cheat-jump" className="font-sans text-[11px] text-slate-500 select-none cursor-pointer">
                      Enable Mouse Clicking Jumps (Simulator/Alternative)
                    </label>
                  </div>

                  {/* Immediate Interactive launch button in HUD */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartGame();
                    }}
                    className="w-full py-4 px-6 bg-gradient-to-r from-yellow-350 to-amber-300 hover:from-yellow-300 hover:to-amber-200 text-slate-900 font-sans font-black uppercase tracking-wider rounded-2xl shadow-lg shadow-yellow-500/20 active:scale-98 transition-transform cursor-pointer flex items-center justify-center gap-2 text-sm"
                  >
                    Play / Launch Game
                  </button>
                </div>
              )}

              {playState === 'gameover' && (
                <div className="flex flex-col items-center max-w-sm">
                  <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mb-4 border border-rose-500/30">
                    <AlertTriangle className="w-8 h-8" />
                  </div>

                  <h2 className="font-sans font-black text-2xl text-rose-400 mb-1">DEATH BY SILENCE</h2>
                  <p className="font-sans text-xs text-slate-400 mb-6">The rising slime consumed your jumper.</p>

                  <div className="grid grid-cols-2 gap-3 w-full p-4 bg-slate-900 rounded-xl border border-slate-850 mb-5">
                    <div>
                      <span className="font-sans text-[10px] text-slate-500 font-bold uppercase block">Final Climb</span>
                      <span className="font-mono text-xl font-bold text-slate-200">{gameScore}m</span>
                    </div>
                    <div>
                      <span className="font-sans text-[10px] text-slate-500 font-bold uppercase block">High Score</span>
                      <span className="font-mono text-xl font-bold text-emerald-400">
                        {Math.max(...stats.highScores.map(h => h.score), gameScore)}m
                      </span>
                    </div>
                  </div>

                  {/* Immediate Interactive restart button in HUD */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartGame();
                    }}
                    className="w-full py-4 px-6 mb-4 bg-gradient-to-r from-yellow-350 to-amber-300 hover:from-yellow-300 hover:to-amber-200 text-slate-900 font-sans font-black uppercase tracking-wider rounded-xl shadow-lg shadow-yellow-500/20 active:scale-98 transition-transform cursor-pointer flex items-center justify-center gap-2 text-sm"
                  >
                    <RotateCcw className="w-4 h-4 text-slate-900" />
                    Play Again / Restart
                  </button>

                  {/* Accessibility Skip cheat reload */}
                  <div className="flex items-center gap-2">
                    <input
                      id="checkbox-cheat-jump-gameover"
                      type="checkbox"
                      checked={hasCheatedJump}
                      onChange={(e) => setHasCheatedJump(e.target.checked)}
                      className="rounded border-slate-700 text-indigo-500 focus:ring-indigo-600 cursor-pointer"
                    />
                    <label htmlFor="checkbox-cheat-jump-gameover" className="font-sans text-[11px] text-slate-500 select-none cursor-pointer">
                      Enable Mouse Clicking Jumps
                    </label>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
