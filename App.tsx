import React, { useState, useEffect, useRef } from 'react';
import { DigitalRain } from './components/DigitalRain';
import { TerminalIntro } from './components/TerminalIntro';
import { Choice } from './components/Choice';
import { SimulationInterface } from './components/SimulationInterface';
import { BlueScreen } from './components/BlueScreen';
import gsap from 'gsap';

// Define the stages of the experience
export enum AppStage {
  LOADING = 'LOADING',
  INTRO = 'INTRO',
  CHOICE = 'CHOICE',
  MATRIX = 'MATRIX',
  DISCONNECT = 'DISCONNECT'
}

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>(AppStage.LOADING);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial loading simulation
    const timer = setTimeout(() => {
      setStage(AppStage.INTRO);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleChoice = (choice: 'red' | 'blue') => {
    if (choice === 'red') {
      // Transition to Matrix
      gsap.to(containerRef.current, {
        duration: 2,
        scale: 1.5,
        opacity: 0,
        ease: "power2.in",
        onComplete: () => {
          setStage(AppStage.MATRIX);
          gsap.set(containerRef.current, { scale: 1, opacity: 1 });
        }
      });
    } else {
      // Blue pill - disconnect
      setStage(AppStage.DISCONNECT);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black text-green-500">
      {/* Persistent Background (except on BSOD) */}
      {stage !== AppStage.DISCONNECT && <DigitalRain intensity={stage === AppStage.MATRIX ? 0.3 : 1} />}

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        
        {stage === AppStage.LOADING && (
          <div className="animate-pulse text-xs tracking-widest">SYSTEM BOOT...</div>
        )}

        {stage === AppStage.INTRO && (
          <TerminalIntro onComplete={() => setStage(AppStage.CHOICE)} />
        )}

        {stage === AppStage.CHOICE && (
          <Choice onChoose={handleChoice} />
        )}

        {stage === AppStage.MATRIX && (
          <SimulationInterface />
        )}

        {stage === AppStage.DISCONNECT && (
          <BlueScreen />
        )}

      </div>
    </div>
  );
};

export default App;