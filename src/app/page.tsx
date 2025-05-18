'use client';

import { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import ConfettiGenerator from 'confetti-js';
import { messages } from '@/utils/wishes';

const TypeWriter = ({ speed = 50 }: { speed?: number }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentMessage = messages[messageIndex].value;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentIndex < currentMessage.length) {
          setDisplayText(currentMessage.slice(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        } else {
          // Start deleting after a pause
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        // Deleting
        if (currentIndex > 0) {
          setDisplayText(currentMessage.slice(0, currentIndex - 1));
          setCurrentIndex(currentIndex - 1);
        } else {
          setIsDeleting(false);
          setMessageIndex((prev) => (prev + 1) % messages.length);
        }
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timer);
  }, [currentIndex, currentMessage, isDeleting, speed, messageIndex]);

  return (
    <span className="inline-block min-h-[1.5em]">
      {displayText}
      <span className="animate-pulse ml-1">|</span>
    </span>
  );
};

const WavyText = ({ text }: { text: string }) => {
  return (
    <div className="wavy-text">
      {text.split('').map((letter, index) => (
        <span
          key={`${letter}-${index}`}
          style={{ '--i': index } as React.CSSProperties}
        >
          {letter}
        </span>
      ))}
    </div>
  );
};

const FloatingBalloons = () => {
  const sizes = ['balloon-sm', 'balloon-md', 'balloon-lg'];
  const colors = ['balloon-red', 'balloon-blue', 'balloon-green', 'balloon-yellow', 'balloon-purple', 'balloon-pink'];
  
  return (
    <div className="balloon-container">
      {[...Array(9)].map((_, i) => {
        const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        return (
          <div
            key={i}
            className={`balloon balloon-${i + 1} ${randomSize} ${randomColor}`}
          />
        );
      })}
    </div>
  );
};

const RocketLauncher = () => {
  const [key, setKey] = useState(0);


  useEffect(() => {
    const interval = setInterval(() => {
      setKey(prev => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rocket-container rotate-180" key={key}>
      <div className='rocket fade-in rotate-320' />
    </div>
  );
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [candleBlown, setCandleBlown] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (candleBlown && canvasRef.current) {
      // Setup continuous falling confetti
      const confettiSettings = {
        target: canvasRef.current,
        max: 80,
        size: 1.5,
        animate: true,
        props: ['circle', 'square', 'triangle', 'line'],
        colors: [[165,104,246],[230,61,135],[0,199,228],[253,214,126]],
        clock: 25,
        rotate: true,
        start_from_edge: true,
        respawn: true
      };
      const confettiFalling = new ConfettiGenerator(confettiSettings);
      confettiFalling.render();

      // Play birthday music
      if (audioRef.current) {
        audioRef.current.play().catch(error => console.log('Audio autoplay failed:', error));
      }

      return () => confettiFalling.clear();
    }
  }, [candleBlown]);

  const handleCandleBlow = () => {
    setCandleBlown(true);
    // Burst confetti
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleCandleBlow();
    }
  };

  if (!mounted) return null;

  return (
    <div className="h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 p-4 overflow-hidden">
      <canvas 
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ width: '100%', height: '100%' }}
      />
      {candleBlown && <FloatingBalloons />}
      <div className="max-w-4xl mx-auto relative">
        {!candleBlown ? (
          <div className="flex flex-col items-center justify-center min-h-screen">
            <button 
              type="button"
              className="candle-container animate-float cursor-pointer bg-transparent border-0 p-0" 
              onClick={handleCandleBlow}
              onKeyDown={handleKeyPress}
              aria-label="Click or press Enter to blow the candle and make a wish"
            >
              <div className="candle">
                <div className="flame">
                  <div className="shadows" />
                  <div className="top" />
                  <div className="middle" />
                  <div className="bottom" />
                </div>
                <div className="wick" />
                <div className="wax" />
              </div>
            </button>
            <p className="text-white text-xl mt-8 animate-bounce-slow">Click the candle to make a wish!</p>
          </div>
        ) : (
          <div className="animate-float text-center py-20">
            <h1 className="text-6xl md:text-8xl font-bold mb-8">
              <WavyText text="Happy Birthday" />
            </h1>
            <h2 className="animate-slide-up text-4xl md:text-6xl font-bold mb-12 text-white">
              Harsh Shah! 🎉
            </h2>
            
            <div className="space-y-6 animate-fade-in">
              <div className="video-container animate-fade-in relative" style={{ aspectRatio: '16/9' }}>
                <video 
                  className="celebration-video"
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                >
                  <source src="/assets/video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <p className="text-lg text-white leading-relaxed">
                <TypeWriter speed={30} />
              </p>
            </div>
                <RocketLauncher />
          </div>
        )}
      </div>
      <audio ref={audioRef} loop>
        <source src="/assets/hbd.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}
