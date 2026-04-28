'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { PortfolioProject } from '@/types';

// ─── Dict type (inline — no importar server-only) ─────────────────────────────

interface CaseStudyCardDict {
  categories: { cocina: string; bano: string; deck: string };
  challenge: string;
  solution: string;
  before: string;
  after: string;
  duration: string;
  weeks: string;
  investment: string;
  financing: string;
  financingAvailable: string;
  financingFrom: string;
  financingPerMonth: string;
  financingNote: string;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface CaseStudyCardProps {
  readonly project: PortfolioProject & {
    title: string;
    description: string;
    highlights: readonly string[];
  };
  readonly dict: CaseStudyCardDict;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCents(cents: number): string {
  return (cents / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
}

function estimateMonthly(minCents: number): string {
  const principal = minCents / 100;
  const r = 0.059 / 12;
  const n = 60;
  const pmt = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return pmt.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
}

function xToPercent(clientX: number, rect: DOMRect): number {
  return Math.min(98, Math.max(2, ((clientX - rect.left) / rect.width) * 100));
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CaseStudyCard({ project, dict }: CaseStudyCardProps) {
  const [sliderPct, setSliderPct]   = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const trackRef                    = useRef<HTMLDivElement>(null);

  const beforeImage = project.images.find((img) => img.role === 'before') ?? project.images.at(0);
  const afterImage  = project.images.find((img) => img.role === 'after')  ?? project.images.at(1);

  const updatePosition = useCallback((clientX: number) => {
    const track = trackRef.current;
    if (!track) return;
    setSliderPct(xToPercent(clientX, track.getBoundingClientRect()));
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updatePosition(e.clientX);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      updatePosition(e.clientX);
    },
    [isDragging, updatePosition]
  );

  const stopDragging = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', stopDragging);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopDragging);
    };
  }, [handleMouseMove, stopDragging]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const touch = e.touches[0];
      if (touch) updatePosition(touch.clientX);
    };
    track.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => track.removeEventListener('touchmove', handleTouchMove);
  }, [isDragging, updatePosition]);

  if (!beforeImage || !afterImage) return null;

  const categoryLabel = dict.categories[project.category] ?? project.category;

  return (
    <article className="bg-white rounded-sm shadow-luxury-lg overflow-hidden">

      <div className="grid grid-cols-1 lg:grid-cols-[45fr_55fr]">

        {/* ── LEFT: Prose column ──────────────────────────────────────────── */}
        <div className="flex flex-col justify-center px-8 py-10 lg:px-12 lg:py-14 order-2 lg:order-1">

          <div className="flex items-center gap-3 mb-6">
            <span className="block w-6 h-px bg-rose-600 flex-shrink-0" />
            <span className="text-xs text-rose-700 uppercase tracking-widest font-medium">
              {categoryLabel}
            </span>
          </div>

          <h2 className="font-playfair text-2xl lg:text-3xl font-semibold text-slate-900 leading-snug mb-8">
            {project.title}
          </h2>

          <div className="mb-7">
            <p className="text-xs text-slate-400 uppercase tracking-widest font-medium mb-3">
              {dict.challenge}
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              {project.description}
            </p>
          </div>

          {project.highlights.length > 0 && (
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-medium mb-4">
                {dict.solution}
              </p>
              <ul className="flex flex-col gap-3">
                {project.highlights.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="block w-4 h-px bg-rose-600 flex-shrink-0 mt-[9px]" />
                    <span className="text-sm text-slate-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="mt-8 text-xs text-slate-400 font-inter">
            {project.location} · {new Date(project.completedAt).getFullYear()}
          </p>
        </div>

        {/* ── RIGHT: Slider column ─────────────────────────────────────────── */}
        <div className="relative aspect-[4/3] lg:aspect-auto order-1 lg:order-2">
          <div
            ref={trackRef}
            className="absolute inset-0 cursor-col-resize select-none"
            onMouseDown={handleMouseDown}
            onMouseLeave={stopDragging}
            onTouchStart={(e) => {
              setIsDragging(true);
              const touch = e.touches[0];
              if (touch) updatePosition(touch.clientX);
            }}
            onTouchEnd={() => setIsDragging(false)}
          >
            {/* BEFORE layer */}
            <div className="absolute inset-0">
              <Image
                src={beforeImage.url}
                alt={beforeImage.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
                priority
              />
              <span className="absolute top-4 left-4 text-[10px] font-medium tracking-widest uppercase bg-black/50 text-white px-2.5 py-1 rounded-sm backdrop-blur-sm select-none">
                {dict.before}
              </span>
            </div>

            {/* AFTER layer — GPU clip-path */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: `inset(0 ${100 - sliderPct}% 0 0)`,
                willChange: isDragging ? 'clip-path' : 'auto',
              }}
            >
              <Image
                src={afterImage.url}
                alt={afterImage.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
              <span className="absolute top-4 right-4 text-[10px] font-medium tracking-widest uppercase bg-white/80 text-slate-900 px-2.5 py-1 rounded-sm backdrop-blur-sm select-none">
                {dict.after}
              </span>
            </div>

            {/* Handle */}
            <div
              className="absolute top-0 bottom-0 w-px bg-white/90 pointer-events-none"
              style={{ left: `${sliderPct}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-luxury flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M8 6L4 10L8 14"  stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 6L16 10L12 14" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metadata bar */}
      <div className="border-t border-slate-100 grid grid-cols-3 divide-x divide-slate-100">

        <div className="px-6 py-5 flex flex-col gap-1">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">
            {dict.duration}
          </p>
          <p className="font-playfair text-lg font-medium text-slate-900">
            {project.durationWeeks} {dict.weeks}
          </p>
        </div>

        <div className="px-6 py-5 flex flex-col gap-1">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">
            {dict.investment}
          </p>
          <p className="font-playfair text-lg font-medium text-slate-900">
            {formatCents(project.investmentRange.minCents)}
            <span className="text-slate-400 text-base font-normal"> – </span>
            {formatCents(project.investmentRange.maxCents)}
          </p>
        </div>

        <div className="px-6 py-5 flex flex-col gap-1">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">
            {dict.financing}
          </p>
          <p className="font-playfair text-lg font-medium text-slate-900">
            {dict.financingAvailable}
          </p>
          <p className="text-xs font-medium text-rose-700 font-inter">
            {dict.financingFrom} {estimateMonthly(project.investmentRange.minCents)}{dict.financingPerMonth}
          </p>
        </div>
      </div>

      <p className="px-6 pb-4 text-[10px] text-slate-400 font-inter">
        {dict.financingNote}
      </p>
    </article>
  );
}
