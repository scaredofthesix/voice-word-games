/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Volume2, Sparkles } from 'lucide-react';
import { gameAudio } from '../lib/audio';

interface VoiceStatusProps {
  isListening: boolean;
  onToggleListening: () => void;
  lastTranscript: string;
  interimTranscript: string;
  isMatchFlash: boolean;
  matchedWord: string | null;
  onSimulateTranscript?: (text: string) => void;
  onSimulateInterim?: (text: string) => void;
}

export default function VoiceStatus({
  isListening,
  onToggleListening,
  lastTranscript,
  interimTranscript,
  isMatchFlash,
  matchedWord,
  onSimulateTranscript,
  onSimulateInterim
}: VoiceStatusProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [micStream, setMicStream] = useState<MediaStream | null>(null);
  const audioSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [typedInput, setTypedInput] = useState('');

  const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const isSpeechSupported = !!SpeechRecognitionClass;

  const isMobile = typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const handleTypedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    // If the user presses space, auto-submit the simulated voice command instantly!
    if (val.endsWith(' ')) {
      const cleanWord = val.trim().toLowerCase();
      if (cleanWord) {
        if (onSimulateTranscript) {
          onSimulateTranscript(cleanWord);
        }
      }
      setTypedInput('');
      return;
    }

    setTypedInput(val);
    if (onSimulateInterim) {
      onSimulateInterim(val);
    }
  };

  const handleTypedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typedInput.trim()) {
      if (onSimulateTranscript) {
        onSimulateTranscript(typedInput.trim().toLowerCase());
      }
      setTypedInput('');
    }
  };

  // Hook up Web Audio AnalyserNode to get exact Microphone waveform
  useEffect(() => {
    // Mobile browsers cannot share the mic resource between Web Speech API and Web Audio getUserMedia.
    // If they attempt both, one will fail/be silent. We bypass getUserMedia on mobile devices entirely.
    if (isListening && !isMobile) {
      const getMicStream = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          setMicStream(stream);

          const audioCtx = gameAudio.getContext();
          const analyser = gameAudio.getAnalyserNode();
          
          if (audioCtx && analyser) {
            analyser.fftSize = 64;
            analyserRef.current = analyser;

            // Connect mic source to the analyser node
            const source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);
            audioSourceRef.current = source;
          }
        } catch (err) {
          console.warn('Microphone permission denied or unavailable:', err);
        }
      };

      getMicStream();
    } else {
      // Clean up stream when listening is toggled off
      if (micStream) {
        micStream.getTracks().forEach(track => track.stop());
        setMicStream(null);
      }
      if (audioSourceRef.current) {
        audioSourceRef.current.disconnect();
        audioSourceRef.current = null;
      }
      analyserRef.current = null;
    }

    return () => {
      if (micStream) {
        micStream.getTracks().forEach(track => track.stop());
      }
      if (audioSourceRef.current) {
        try {
          audioSourceRef.current.disconnect();
        } catch (e) {}
      }
    };
  }, [isListening]);

  // Waveform visualization loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      let dataArray = new Uint8Array(0);
      let bufferLength = 0;

      if (!isMobile && analyserRef.current) {
        bufferLength = analyserRef.current.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteTimeDomainData(dataArray);
      }

      ctx.lineWidth = 4;
      // Vibrant pure white to glowing pink wave
      const grad = ctx.createLinearGradient(0, 0, width, 0);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
      grad.addColorStop(0.5, '#ffffff');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0.4)');
      ctx.strokeStyle = grad;
      ctx.shadowBlur = 12;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();

      if (!isMobile && analyserRef.current && bufferLength > 0) {
        const sliceWidth = width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0; // Normalized -1 to 1
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }
      } else {
        // Flat line when inactive, with highly dynamic organic wave on mobile when listening
        const points = 30;
        const step = width / points;
        ctx.moveTo(0, height / 2);
        for (let i = 0; i <= points; i++) {
          const angle = (i * 0.4) + (Date.now() * 0.0035);
          const amplitude = isListening ? 8.2 : 0.8;
          const y = height / 2 + Math.sin(angle * 1.5) * amplitude;
          ctx.lineTo(i * step, y);
        }
      }

      ctx.stroke();
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isListening]);

  return (
    <div id="voice-status-container" className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/25 flex flex-col gap-3.5 transition-colors shadow-2xl shadow-indigo-950/15 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`relative flex items-center justify-center w-9 h-9 rounded-xl ${
            isListening ? 'bg-red-500 text-white shadow-lg' : 'bg-white/10 text-white/50 border border-white/10'
          }`}>
            {isListening && (
              <span className="absolute animate-ping inline-flex h-full w-full rounded-xl bg-red-400 opacity-40"></span>
            )}
            {isListening ? <Mic className="w-4.5 h-4.5" /> : <MicOff className="w-4.5 h-4.5" />}
          </div>
          <div>
            <h3 className="font-sans font-black text-sm tracking-tight text-white uppercase">
              {isListening ? 'Voice Capture Active' : 'Microphone Inactive'}
            </h3>
            <p className="font-sans text-[10px] text-white/80 tracking-widest uppercase font-bold">
              {isListening ? 'We speech engine live' : 'Configure and start listening'}
            </p>
          </div>
        </div>

        <button
          id="btn-voice-toggle"
          onClick={onToggleListening}
          className={`px-4 py-2 rounded-xl font-sans text-[11px] font-black uppercase tracking-wider select-none cursor-pointer duration-200 shadow-md ${
            isListening
              ? 'bg-rose-500 hover:bg-rose-400 text-white border border-rose-400 animate-pulse'
              : 'bg-white text-indigo-900 font-bold hover:bg-white/90 active:scale-95'
          }`}
        >
          {isListening ? 'Stop' : 'Start Voice'}
        </button>
      </div>

      {/* Visual Live Scope */}
      <div className="relative h-12 bg-indigo-950/40 backdrop-blur-xl rounded-xl border border-white/15 overflow-hidden flex items-center justify-center">
        <canvas ref={canvasRef} width={280} height={48} className="w-full h-full" />
        {isListening && !isMobile && !analyserRef.current && (
          <div className="absolute inset-0 bg-indigo-950/90 flex items-center justify-center gap-2 px-3">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
            <p className="font-sans text-[10px] text-yellow-350 font-bold uppercase tracking-wider">Allow Mic Access in browser</p>
          </div>
        )}
      </div>

      {/* Spoken Output Display Area */}
      <div className="flex flex-col gap-1.5 px-0.5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] text-white/50 uppercase tracking-widest font-black">
            {!isSpeechSupported ? "Speech Simulator (Firefox Mode)" : "Speech & Typing Capture"}
          </span>
          {isMatchFlash && (
            <span className="flex items-center gap-1 font-sans text-[10px] text-emerald-300 font-black animate-pulse uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> JUMP WORD MATCH: "{matchedWord}"
            </span>
          )}
        </div>

        <div className="min-h-[50px] bg-indigo-950/30 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex flex-col justify-center">
          {interimTranscript ? (
            <p className="font-sans text-xs text-yellow-300 font-black tracking-wide leading-normal italic">
              Hearing: <span className="text-white text-md font-extrabold bg-white/10 px-2 py-0.5 rounded-lg border border-white/10 ml-1">"{interimTranscript}"</span>
            </p>
          ) : lastTranscript ? (
            <p className="font-sans text-xs text-white/70 font-bold tracking-wide leading-normal">
              Heard: <span className="text-white text-md font-black bg-white/20 px-2.5 py-0.5 rounded-lg border border-white/20 ml-1">"{lastTranscript}"</span>
            </p>
          ) : (
            <span className="font-sans text-[11px] text-white/50 italic text-center font-medium">
              {isListening ? "Say active word OR type below & press Space/Enter!" : "Click Start Voice to activate microphone!"}
            </span>
          )}
        </div>

        {/* Input fallback form always accessible when listening as a super-robust game player bypass */}
        {isListening && (
          <form onSubmit={handleTypedSubmit} className="mt-1">
            <input
              type="text"
              value={typedInput}
              onChange={handleTypedChange}
              placeholder='Type active platform word here to jump...'
              className="w-full bg-indigo-950/80 text-white rounded-xl py-2.5 px-3.5 text-xs font-sans placeholder-white/35 border border-white/15 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 font-black transition-all text-center uppercase"
            />
            <span className="text-[9px] text-white/40 font-semibold uppercase tracking-wider block mt-1 text-right">
              Press Enter or hit Space on your mobile keyboard to jump!
            </span>
          </form>
        )}
      </div>
    </div>
  );
}
