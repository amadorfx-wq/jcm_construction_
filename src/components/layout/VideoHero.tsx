'use client';

// ─────────────────────────────────────────────────────────────────────────────
// VideoHero — Cinematic Full-Screen Video Background
// Premium scroll-driven parallax, smooth fade-in text, and floating particles.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';

interface VideoHeroProps {
  locale: string;
  dict: {
    eyebrow: string;
    h1Line1: string;
    h1Line2: string;
    h1Line3: string;
    subtext: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stats: { value: string; label: string }[];
  };
}

export default function VideoHero({ locale, dict }: VideoHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // ── Ensure content becomes visible (fallback timer) ───────────────────────
  useEffect(() => {
    // Fallback: if onCanPlay doesn't fire within 800ms, show content anyway
    const timer = setTimeout(() => setLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // ── Parallax scroll tracking ──────────────────────────────────────────────
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Floating particles on canvas ──────────────────────────────────────────
  const particlesInit = useRef(false);

  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || particlesInit.current) return;
    particlesInit.current = true;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      twinkleSpeed: number;
      twinklePhase: number;
    }[] = [];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.1 - 0.05,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }

    let frame = 0;
    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = window.innerWidth;
        if (p.x > window.innerWidth) p.x = 0;
        if (p.y < 0) p.y = window.innerHeight;
        if (p.y > window.innerHeight) p.y = 0;

        const twinkle = Math.sin(frame * p.twinkleSpeed + p.twinklePhase);
        const currentOpacity = p.opacity * (0.5 + twinkle * 0.5);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(190, 18, 60, ${currentOpacity})`;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(190, 18, 60, ${currentOpacity * 0.15})`;
        ctx.fill();
      }

      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  useEffect(() => {
    initParticles();
  }, [initParticles]);

  // ── Compute parallax values ───────────────────────────────────────────────
  const parallaxOffset = Math.min(scrollY * 0.35, 200);
  const overlayOpacity = Math.min(0.78 + scrollY * 0.0006, 0.92);
  const contentOpacity = Math.max(1 - scrollY * 0.002, 0);
  const contentTranslate = scrollY * 0.12;

  return (
    <section
      ref={sectionRef}
      className="hero-video-section"
      id="hero"
    >
      {/* ── Video Background ─────────────────────────────────────────────── */}
      <div
        className="hero-video-wrapper"
        style={{ transform: `translate3d(0, ${parallaxOffset}px, 0)` }}
      >
        <video
          ref={videoRef}
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setLoaded(true)}
        >
          <source src="/video/hero-construction.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ── Gradient Overlays ────────────────────────────────────────────── */}
      <div
        className="hero-overlay-gradient"
        style={{ opacity: overlayOpacity }}
      />
      <div className="hero-overlay-vignette" />
      <div className="hero-overlay-grain" />

      {/* ── Floating Particles Canvas ────────────────────────────────────── */}
      <canvas
        ref={canvasRef}
        className="hero-particles-canvas"
        aria-hidden="true"
      />

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div
        className="hero-content-wrapper"
        style={{
          opacity: contentOpacity,
          transform: `translate3d(0, ${contentTranslate}px, 0)`,
        }}
      >
        <div className={`hero-content ${loaded ? 'hero-content--visible' : ''}`}>
          {/* Eyebrow */}
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-line" aria-hidden="true" />
            <span className="hero-eyebrow-text">{dict.eyebrow}</span>
          </div>

          {/* Heading */}
          <h1 className="hero-heading">
            <span className="hero-heading-line hero-heading-line--1">
              {dict.h1Line1}
            </span>
            <span className="hero-heading-line hero-heading-line--2">
              {dict.h1Line2}
            </span>
            <span className="hero-heading-line hero-heading-line--3">
              {dict.h1Line3}
            </span>
          </h1>

          {/* Subtext */}
          <p className="hero-subtext">{dict.subtext}</p>

          {/* CTAs */}
          <div className="hero-ctas">
            <Link
              href={`/${locale}/evaluacion-proyecto`}
              className="hero-cta-primary"
            >
              <span>{dict.ctaPrimary}</span>
              <span className="hero-cta-arrow" aria-hidden="true">→</span>
            </Link>
            <Link
              href={`/${locale}/remodelacion-cocinas`}
              className="hero-cta-secondary"
            >
              {dict.ctaSecondary}
            </Link>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            {dict.stats.map(({ value, label }) => (
              <div key={value} className="hero-stat">
                <span className="hero-stat-value">{value}</span>
                <span className="hero-stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Scroll Indicator ─────────────────────────────────────────────── */}
      <div
        className="hero-scroll-indicator"
        style={{ opacity: contentOpacity }}
      >
        <div className="hero-scroll-mouse">
          <div className="hero-scroll-wheel" />
        </div>
        <span className="hero-scroll-text">Scroll</span>
      </div>
    </section>
  );
}
