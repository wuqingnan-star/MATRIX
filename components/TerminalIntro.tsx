import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

// Register GSAP plugin (requires the script tag in index.html to work fully if import fails, but we import for TS)
gsap.registerPlugin(TextPlugin);

interface TerminalIntroProps {
  onComplete: () => void;
}

export const TerminalIntro: React.FC<TerminalIntroProps> = ({ onComplete }) => {
  const textRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: onComplete
    });

    // Blinking cursor
    gsap.to(cursorRef.current, {
      opacity: 0,
      repeat: -1,
      yoyo: true,
      duration: 0.5,
      ease: "steps(1)"
    });

    // Sequence
    tl.to(textRef.current, {
      duration: 2,
      text: { value: "Wake up, Neo..." },
      ease: "none",
      delay: 1
    })
    .to(textRef.current, {
      duration: 0.5,
      opacity: 0,
      delay: 2
    })
    .set(textRef.current, { text: "" })
    .set(textRef.current, { opacity: 1 })
    .to(textRef.current, {
      duration: 3,
      text: { value: "The Matrix has you..." },
      ease: "none"
    })
    .to(textRef.current, {
      duration: 0.5,
      opacity: 0,
      delay: 2
    })
    .set(textRef.current, { text: "" })
    .set(textRef.current, { opacity: 1 })
    .to(textRef.current, {
      duration: 2,
      text: { value: "Follow the white rabbit." },
      ease: "none"
    })
    .to(textRef.current, {
        duration: 2,
        text: { value: "Knock, knock, Neo." },
        ease: "none",
        delay: 1.5
    })
    .to(textRef.current, {
      duration: 1,
      opacity: 0,
      delay: 1
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div className="flex flex-col items-start justify-center p-8 max-w-2xl">
      <h1 className="text-4xl md:text-6xl font-bold text-green-500 shadow-[0_0_10px_rgba(0,255,65,0.6)]" style={{textShadow: "0 0 5px #0f0"}}>
        <span ref={textRef}></span>
        <span ref={cursorRef} className="inline-block w-4 h-10 bg-green-500 ml-2 align-bottom"></span>
      </h1>
    </div>
  );
};