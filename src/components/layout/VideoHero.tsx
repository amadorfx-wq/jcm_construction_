'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getLocalizedHref } from '@/i18n/routes';

interface VideoHeroProps {
  locale: string;
  dict: {
    eyebrow: string;
    h1Line1: string;
    h1Line2: string;
    h1Line3: string;
    subheadline?: string;
    subtext: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stats: { value: string; label: string }[];
  };
}

export default function VideoHero({ locale, dict }: VideoHeroProps) {
  const sectionRef           = useRef<HTMLElement>(null);
  const videoRef             = useRef<HTMLVideoElement>(null);
  const canvasRef            = useRef<HTMLCanvasElement>(null);
  // Watchdog Timer: si onCanPlay no dispara en 4s, el video no puede reproducirse.
  const canPlayTimeoutRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Ref síncrona: fuente de verdad para la guardia de handleCanPlay.
  // Evita el stale closure: si el Watchdog ya marcó el fallo y onCanPlay llega
  // tarde (race condition iOS), esta ref intercepta el evento antes de que
  // desmontar el poster deje la sección sin fondo.
  const videoPlayFailedRef   = useRef(false);

  const [loaded,          setLoaded]          = useState(false);
  const [scrollY,         setScrollY]         = useState(0);
  const [posterVisible,   setPosterVisible]   = useState(true);
  const [posterMounted,   setPosterMounted]   = useState(true);
  const [videoPlayFailed, setVideoPlayFailed] = useState(false);

  // ── Fallback visibility timer ─────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // ── WebKit/Blink Autoplay Patch + Watchdog Timer ──────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');
    video.setAttribute('disableremoteplayback', '');
    video.setAttribute('x-webkit-airplay', 'deny');
    video.muted = true;

    // Watchdog: cobertura para iOS 15+ donde play() resuelve silenciosamente
    // pero el video nunca decodifica frames (Low Power Mode, política de batería).
    canPlayTimeoutRef.current = setTimeout(() => {
      videoPlayFailedRef.current = true; // sincronización inmediata antes del setState
      setVideoPlayFailed(true);
    }, 4000);

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setLoaded(true);
        })
        .catch((error) => {
          console.warn('WebKit bloqueó el autoplay. Ejecutando override defensivo...', error);
          video.muted = true;
          video.play().catch(() => {
            // Rechazo explícito (iOS 14 y anteriores): cancelar Watchdog y marcar fallo.
            if (canPlayTimeoutRef.current) {
              clearTimeout(canPlayTimeoutRef.current);
              canPlayTimeoutRef.current = null;
            }
            videoPlayFailedRef.current = true; // sincronización inmediata antes del setState
            setVideoPlayFailed(true);
          });
        });
    }

    return () => {
      // Garantía de cero leaks: si el componente se desmonta antes de los 4s,
      // el timeout muere aquí. setVideoPlayFailed nunca se ejecuta sobre un
      // componente desmontado.
      if (canPlayTimeoutRef.current) {
        clearTimeout(canPlayTimeoutRef.current);
        canPlayTimeoutRef.current = null;
      }
    };
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
      canvas.width  = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width  = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: {
      x: number; y: number;
      vx: number; vy: number;
      size: number; opacity: number;
      twinkleSpeed: number; twinklePhase: number;
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
        if (p.x > window.innerWidth)  p.x = 0;
        if (p.y < 0) p.y = window.innerHeight;
        if (p.y > window.innerHeight) p.y = 0;

        const twinkle        = Math.sin(frame * p.twinkleSpeed + p.twinklePhase);
        const currentOpacity = p.opacity * (0.5 + twinkle * 0.5);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(190, 18, 60, ${currentOpacity})`;
        ctx.fill();

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

  // ── Poster fade handler ────────────────────────────────────────────────────
  // Guardia anti-race-condition: si el Watchdog ya marcó el fallo y onCanPlay
  // llega tarde (iOS bufferizó algo justo después de los 4s), el ref síncrono
  // lo intercepta. Sin la guardia: el poster se desmonta con el video oculto
  // → fondo negro permanente.
  const handleCanPlay = useCallback(() => {
    if (videoPlayFailedRef.current) return;
    if (canPlayTimeoutRef.current) {
      clearTimeout(canPlayTimeoutRef.current);
      canPlayTimeoutRef.current = null;
    }
    setLoaded(true);
    setPosterVisible(false);
    setTimeout(() => {
      setPosterMounted(false);
    }, 350);
  }, []);

  // ── Parallax computed values ──────────────────────────────────────────────
  const parallaxOffset   = Math.min(scrollY * 0.35, 200);
  // Tres niveles de opacidad del gradiente:
  //   videoPlayFailed → 0.10: posterlowmode.png brillante, contraste mínimo
  //   posterVisible   → 0.55: poster.webp de carga, look cinematográfico sin negro
  //   video jugando   → 0.78→0.92: oscuridad cinematográfica completa
  const overlayOpacity   = videoPlayFailed
    ? 0.10
    : posterVisible
      ? 0.55
      : Math.min(0.78 + scrollY * 0.0006, 0.92);
  const contentOpacity   = Math.max(1 - scrollY * 0.002, 0);
  const contentTranslate = scrollY * 0.12;

  // ── Subheadline trust strip segments ─────────────────────────────────────
  const trustSegments = dict.subheadline
    ? dict.subheadline.split(' · ').filter(Boolean)
    : [];

  return (
    <section
      ref={sectionRef}
      className="hero-video-section"
      id="hero"
    >
      {/* ── Video Background — GPU-accelerated layer ──────────────────────── */}
      <div
        className="hero-video-wrapper"
        style={{ transform: `translate3d(0, ${parallaxOffset}px, 0)` }}
      >
        {posterMounted && (
          <div
            aria-hidden="true"
            className="absolute inset-0 z-10 transition-opacity duration-300"
            style={{ opacity: posterVisible ? 1 : 0 }}
          >
            <Image
              src={videoPlayFailed ? '/posterlowmode.png' : '/poster.webp'}
              alt=""
              fill
              priority
              loading="eager"
              className="object-cover object-center"
              sizes="100vw"
              quality={85}
            />
          </div>
        )}

        <video
          ref={videoRef}
          controls={false}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={handleCanPlay}
          onLoadedData={() => setLoaded(true)}
          className="absolute top-0 left-0 w-full h-full object-cover z-0 pointer-events-none"
          style={{
            transform: `translate3d(0, ${scrollY * 0.4}px, 0) translateZ(0)`,
            willChange: 'transform',
            display: videoPlayFailed ? 'none' : 'block',
          }}
        >
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ── Gradient Overlays ─────────────────────────────────────────────── */}
      <div className="hero-overlay-gradient" style={{ opacity: overlayOpacity }} />
      {/* Vignette desactivada en Low Power Mode: evita oscurecer posterlowmode.
          hero-content-wrapper tiene z-index:10 propio — no depende de este elemento. */}
      {!videoPlayFailed && <div className="hero-overlay-vignette" />}
      <div className="hero-overlay-grain" />

      {/* ── Floating Particles Canvas ─────────────────────────────────────── */}
      <canvas ref={canvasRef} className="hero-particles-canvas" aria-hidden="true" />

      {/* ── Content ───────────────────────────────────────────────────────── */}
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
            <span className="hero-heading-line hero-heading-line--1">{dict.h1Line1}</span>
            <span className="hero-heading-line hero-heading-line--2">{dict.h1Line2}</span>
            <span className="hero-heading-line hero-heading-line--3">{dict.h1Line3}</span>
          </h1>

          {/* Trust Strip */}
          {trustSegments.length > 0 && (
            <div
              className={[
                'flex flex-wrap justify-center items-center',
                'gap-x-3 gap-y-2 mt-6 mb-4',
                'text-xs sm:text-sm font-inter uppercase tracking-[0.2em]',
                'text-slate-200 opacity-90',
                'drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]',
              ].join(' ')}
              aria-label="Key benefits"
            >
              {trustSegments.map((segment, i) => (
                <span key={segment} className="flex items-center gap-x-3">
                  {i > 0 && (
                    <span
                      aria-hidden="true"
                      className="block w-px h-3 bg-rose-500/70 flex-shrink-0"
                    />
                  )}
                  <span>{segment}</span>
                </span>
              ))}
            </div>
          )}

          {/* Subtext */}
          <p className="hero-subtext">{dict.subtext}</p>

          {/* CTAs */}
          <div className="hero-ctas">
            <Link href={getLocalizedHref('estimate', locale)} className="hero-cta-primary">
              <span>{dict.ctaPrimary}</span>
              <span className="hero-cta-arrow" aria-hidden="true">→</span>
            </Link>
            <Link href={getLocalizedHref('kitchens', locale)} className="hero-cta-secondary">
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

      {/* ── Scroll Indicator ──────────────────────────────────────────────── */}
      <div className="hero-scroll-indicator" style={{ opacity: contentOpacity }}>
        <div className="hero-scroll-mouse">
          <div className="hero-scroll-wheel" />
        </div>
        <span className="hero-scroll-text">Scroll</span>
      </div>
    </section>
  );
}
