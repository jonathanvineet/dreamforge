import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, MessageSquare, Play, Pause } from 'lucide-react';
import { BRAND_CONFIG } from '../data/mockData';

interface HeroProps {
  onGetQuote?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetQuote }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const titleText = "DREAMFORGE";

  const handleGetQuote = () => {
    if (onGetQuote) {
      onGetQuote();
    } else {
      const orderElem = document.getElementById('order');
      if (orderElem) {
        orderElem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Subtle 3D grid perspective canvas background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle cyber grid lines
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.04)';
      ctx.lineWidth = 1;

      const gridSize = 60;
      const horizon = height * 0.55;

      for (let x = -width; x < width * 2; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, height);
        ctx.lineTo(width / 2 + (x - width / 2) * 0.15, horizon);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section id="hero" className="relative w-full h-screen min-h-[720px] flex flex-col justify-between overflow-hidden bg-zinc-950 text-white select-none">
      
      {/* 1. Background Video Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1920"
          className="absolute inset-0 w-full h-full object-cover opacity-45 scale-105 transition-opacity duration-1000"
        >
          <source src="/dreamforgevideo.mp4" type="video/mp4" />
        </video>

        {/* Dynamic Canvas 3D Grid Layer */}
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-[1]" />

        {/* Vignette Overlay & Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/55 to-black/95 z-[2] pointer-events-none" />
        <div className="absolute inset-0 bg-radial-vignette opacity-80 z-[2] pointer-events-none" />
      </div>

      {/* 2. Top Bar Header */}
      <header className="relative z-20 w-full px-6 lg:px-12 pt-6 flex items-center justify-end font-mono text-xs tracking-wider">
        <nav className="hidden md:flex items-center gap-8 uppercase text-xs font-medium text-zinc-300">
          <a href="#about" className="hover:text-[#00E5FF] transition-colors tracking-widest">ABOUT</a>
          <a href="#categories" className="hover:text-[#00E5FF] transition-colors tracking-widest">SERVICES</a>
          <a href="#showcase" className="hover:text-[#00E5FF] transition-colors tracking-widest">PORTFOLIO</a>
          <a href="#process" className="hover:text-[#00E5FF] transition-colors tracking-widest">PROCESS</a>
          <button 
            onClick={handleGetQuote} 
            className="px-5 py-2 rounded-full border border-[#00E5FF]/60 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-black transition-all font-semibold tracking-widest cursor-pointer"
          >
            GET QUOTE
          </button>
        </nav>
      </header>

      {/* 3. Center Section: Professional Dynamic Typography */}
      <div className="relative z-20 my-auto text-center px-4 max-w-6xl mx-auto flex flex-col items-center justify-center">
        
        {/* Main Display Typography - Dynamic Staggered Letter Animation */}
        <div className="relative group cursor-default animate-fade-in">
          <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[10.5rem] font-extrabold tracking-tight uppercase select-none leading-none font-outfit flex justify-center items-center">
            {titleText.split('').map((char, index) => {
              return (
                <span
                  key={index}
                  data-text={char}
                  className="text-mask-outline mx-[1px]"
                >
                  <span
                    style={{ animationDelay: `${index * 250}ms` }}
                    className="relative inline-block animate-glass-fill text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500 drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)] mix-blend-overlay"
                  >
                    {char}
                  </span>
                </span>
              );
            })}
          </h1>
        </div>

        {/* Minimal Sub-Headline */}
        <p className="mt-8 text-base sm:text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto font-sans font-light tracking-wide leading-relaxed">
          From CAD file to physical object. Crafted with ultra-high precision and delivered in 48 hours.
        </p>

        {/* Primary CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button
            id="hero-quote-main-btn"
            onClick={handleGetQuote}
            className="w-full sm:w-auto px-9 py-4 rounded-full font-sans text-xs font-bold uppercase tracking-widest text-black bg-[#00E5FF] hover:bg-[#52edff] transition-all duration-300 shadow-[0_0_30px_rgba(0,229,255,0.35)] hover:shadow-[0_0_45px_rgba(0,229,255,0.6)] hover:scale-[1.02] flex items-center justify-center gap-2.5 group cursor-pointer"
          >
            <span>GET INSTANT QUOTE</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>

          <a
            href={`https://wa.me/${BRAND_CONFIG.whatsappNumber}?text=Hi%20DreamForge3D!%20I'd%20like%20a%203D%20print%20quote.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-9 py-4 rounded-full font-sans text-xs font-bold uppercase tracking-widest text-zinc-200 bg-zinc-900/80 border border-zinc-700/80 hover:border-[#00E5FF]/60 hover:text-white hover:bg-zinc-800/80 transition-all duration-300 flex items-center justify-center gap-2.5 group"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>WHATSAPP US</span>
          </a>
        </div>
      </div>

      {/* 4. Bottom Controls */}
      <div className="relative z-20 w-full px-6 lg:px-12 pb-8 flex flex-row items-center justify-end text-xs font-mono text-zinc-400">
        <button
          onClick={toggleVideoPlay}
          className="p-2.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-[#00E5FF] hover:border-[#00E5FF]/50 transition-all backdrop-blur-md cursor-pointer hidden md:flex items-center justify-center"
          aria-label="Toggle background video"
          title={isPlaying ? "Pause video background" : "Play video background"}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
      </div>

    </section>
  );
};

export default Hero;
