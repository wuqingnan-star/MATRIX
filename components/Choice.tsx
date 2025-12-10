import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface ChoiceProps {
  onChoose: (choice: 'red' | 'blue') => void;
}

export const Choice: React.FC<ChoiceProps> = ({ onChoose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const redPillRef = useRef<HTMLButtonElement>(null);
  const bluePillRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Entrance animation
    gsap.fromTo([redPillRef.current, bluePillRef.current], 
      { scale: 0, opacity: 0, rotation: -90 },
      { scale: 1, opacity: 1, rotation: 0, duration: 1.5, stagger: 0.2, ease: "back.out(1.7)" }
    );
  }, []);

  const handleHover = (element: HTMLButtonElement | null, color: string) => {
    if (!element) return;
    gsap.to(element, {
      scale: 1.1,
      boxShadow: `0 0 30px ${color}`,
      duration: 0.3
    });
  };

  const handleLeave = (element: HTMLButtonElement | null) => {
    if (!element) return;
    gsap.to(element, {
      scale: 1,
      boxShadow: "0 0 0px rgba(0,0,0,0)",
      duration: 0.3
    });
  };

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-12 z-20">
        <h2 className="text-2xl text-green-400 mb-8 tracking-widest uppercase opacity-80">Make your choice</h2>
      <div className="flex gap-20">
        <div className="flex flex-col items-center group">
            <button
            ref={bluePillRef}
            onClick={() => onChoose('blue')}
            onMouseEnter={() => handleHover(bluePillRef.current, '#0088ff')}
            onMouseLeave={() => handleLeave(bluePillRef.current)}
            className="w-24 h-48 rounded-full bg-gradient-to-br from-blue-400 to-blue-900 border border-blue-300 shadow-xl cursor-pointer relative overflow-hidden transition-transform transform"
            >
            <div className="absolute top-4 left-4 w-6 h-12 bg-white opacity-20 rounded-full filter blur-sm"></div>
            </button>
            <span className="mt-4 text-blue-400 text-sm tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">IGNORANCE</span>
        </div>

        <div className="flex flex-col items-center group">
            <button
            ref={redPillRef}
            onClick={() => onChoose('red')}
            onMouseEnter={() => handleHover(redPillRef.current, '#ff0033')}
            onMouseLeave={() => handleLeave(redPillRef.current)}
            className="w-24 h-48 rounded-full bg-gradient-to-br from-red-500 to-red-900 border border-red-300 shadow-xl cursor-pointer relative overflow-hidden transition-transform transform"
            >
            <div className="absolute top-4 left-4 w-6 h-12 bg-white opacity-20 rounded-full filter blur-sm"></div>
            </button>
            <span className="mt-4 text-red-500 text-sm tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">TRUTH</span>
        </div>
      </div>
    </div>
  );
};