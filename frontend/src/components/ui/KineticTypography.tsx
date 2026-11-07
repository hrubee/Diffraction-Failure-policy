/**
 * Presentation Component: Kinetic Typography Suite
 * Backed by animate-text and kinetic-typography skills:
 * - High-craft palette: Electric Blue, Safety Orange, and Bright Yellow accents
 * - KineticRotatingHeadline: Dynamic rotating keyword swap with masked upward wipe and soft blur
 * - Full accessibility compliance: aria-label container, aria-hidden fragments, prefers-reduced-motion
 */

'use client';

import React, { useState, useEffect } from 'react';

export interface HazardRotationItem {
  readonly id: string;
  readonly phrase: string;
  readonly hazardLabel: string;
  readonly metric: string;
  readonly accentClass: string;
  readonly borderClass: string;
  readonly badgeBgClass: string;
}

export const HAZARD_ROTATION_ITEMS: readonly HazardRotationItem[] = [
  {
    id: 'slick_epoxy',
    phrase: 'slick wet epoxy floors.',
    hazardLabel: 'Surface Traction Loss',
    metric: 'μ = 0.18 • Skid +1.8m',
    accentClass: 'text-blue-400',
    borderClass: 'border-blue-500',
    badgeBgClass: 'bg-[#0f172a] text-blue-300',
  },
  {
    id: 'steep_slope',
    phrase: 'steep 12% gravel slopes.',
    hazardLabel: 'Momentum Runaway',
    metric: '12% Grade • 88% Tip Risk',
    accentClass: 'text-orange-400',
    borderClass: 'border-orange-500',
    badgeBgClass: 'bg-[#1c0f0a] text-orange-300',
  },
  {
    id: 'sunlight_glare',
    phrase: '95,000 Lux blinding glare.',
    hazardLabel: 'RGB Sensor Saturation',
    metric: '95k Lux • Phantom Obstacle',
    accentClass: 'text-yellow-400',
    borderClass: 'border-yellow-400',
    badgeBgClass: 'bg-[#1c1808] text-yellow-300',
  },
  {
    id: 'singularity_torque',
    phrase: 'joint singularity limits.',
    hazardLabel: 'Torque Spikes',
    metric: '195 Nm Peak • Controller Trip',
    accentClass: 'text-orange-500',
    borderClass: 'border-orange-500',
    badgeBgClass: 'bg-[#1c0f0a] text-orange-300',
  },
  {
    id: 'payload_shift',
    phrase: 'unmodeled payload shifts.',
    hazardLabel: 'ZMP Boundary Breach',
    metric: 'Δcg = 14cm • Dynamic Tipping',
    accentClass: 'text-yellow-300',
    borderClass: 'border-yellow-400',
    badgeBgClass: 'bg-[#1c1808] text-yellow-300',
  },
];

interface KineticRotatingHeadlineProps {
  readonly selectedIndex?: number;
  readonly onSelectIndex?: (index: number) => void;
  readonly autoPlay?: boolean;
  readonly intervalMs?: number;
}

export const KineticRotatingHeadline: React.FC<KineticRotatingHeadlineProps> = ({
  selectedIndex,
  onSelectIndex,
  autoPlay = true,
  intervalMs = 3200,
}) => {
  const [internalIndex, setInternalIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(true);

  const activeIdx = selectedIndex !== undefined ? selectedIndex : internalIndex;
  const currentHazard = HAZARD_ROTATION_ITEMS[activeIdx % HAZARD_ROTATION_ITEMS.length];

  useEffect(() => {
    if (!autoPlay || selectedIndex !== undefined) return;

    const timer = setInterval(() => {
      setIsAnimating(false);
      setTimeout(() => {
        setInternalIndex((prev) => (prev + 1) % HAZARD_ROTATION_ITEMS.length);
        setIsAnimating(true);
      }, 180);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [autoPlay, intervalMs, selectedIndex]);

  const handleManualSelect = (idx: number) => {
    setIsAnimating(false);
    setTimeout(() => {
      if (onSelectIndex) {
        onSelectIndex(idx);
      } else {
        setInternalIndex(idx);
      }
      setIsAnimating(true);
    }, 150);
  };

  return (
    <div className="space-y-4">
      {/* Main Kinetic Headline Display */}
      <div
        className="font-headline text-3xl sm:text-5xl lg:text-[54px] font-bold text-white tracking-tight leading-[1.08]"
        aria-label={`Robots pass simulation in the lab. They fail on ${currentHazard.phrase}`}
      >
        <div className="overflow-hidden py-0.5">
          <span className="inline-block animate-soft-blur transform-gpu">
            Robots pass simulation in the lab.
          </span>
        </div>

        <div className="overflow-hidden py-1 flex flex-wrap items-center gap-x-3.5">
          <span className="text-slate-100">
            They fail on
          </span>

          {/* Masked Rotating Dynamic Phrase */}
          <span className="relative inline-block overflow-hidden align-middle">
            <span
              key={currentHazard.id}
              className={`inline-block font-bold transition-all transform-gpu ${
                currentHazard.accentClass
              } ${isAnimating ? 'animate-mask-up' : 'opacity-0 translate-y-3'}`}
            >
              {currentHazard.phrase}
            </span>
          </span>
        </div>
      </div>

      {/* Dynamic Telemetry Pill Bar with Live Swapped Hazard Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Simulated Hazard:</span>
          <div
            key={`badge-${currentHazard.id}`}
            className={`inline-flex items-center space-x-2 px-3 py-1 rounded-md text-xs font-semibold border transition-all duration-300 ${
              currentHazard.badgeBgClass
            } ${currentHazard.borderClass} ${isAnimating ? 'animate-soft-blur' : 'opacity-0'}`}
          >
            <span className="h-2 w-2 rounded-full bg-current" />
            <span className="font-medium">{currentHazard.hazardLabel}:</span>
            <span className="font-mono font-bold tracking-tight">{currentHazard.metric}</span>
          </div>
        </div>

        {/* Quick Hazard Interactive Pills (Orange & Yellow Accents) */}
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="text-slate-400 text-[10px] hidden sm:inline">Inspect:</span>
          {HAZARD_ROTATION_ITEMS.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleManualSelect(idx)}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                idx === activeIdx
                  ? 'bg-yellow-400 text-slate-950 shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title={`Switch to ${item.hazardLabel}`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

interface KineticSplitRevealProps {
  readonly text: string;
  readonly className?: string;
  readonly delayMs?: number;
  readonly staggerMs?: number;
}

export const KineticSplitReveal: React.FC<KineticSplitRevealProps> = ({
  text,
  className = '',
  delayMs = 0,
  staggerMs = 45,
}) => {
  const words = text.split(' ');

  return (
    <span className={`inline-block ${className}`} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-top" aria-hidden="true">
          <span
            className="inline-block animate-soft-blur opacity-0 transform-gpu"
            style={{
              animationDelay: `${i * staggerMs + delayMs}ms`,
              letterSpacing: '-0.02em',
            }}
          >
            {word}&nbsp;
          </span>
        </span>
      ))}
    </span>
  );
};

interface ShimmerBadgeProps {
  readonly children: React.ReactNode;
  readonly className?: string;
}

export const ShimmerBadge: React.FC<ShimmerBadgeProps> = ({ children, className = '' }) => {
  return (
    <span
      className={`relative inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold border ${className}`}
    >
      <span className="relative z-10">{children}</span>
    </span>
  );
};
