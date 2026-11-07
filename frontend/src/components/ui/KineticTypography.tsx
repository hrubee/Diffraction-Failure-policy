/**
 * Presentation Component: Kinetic Typography Suite
 * Backed by animate-text and kinetic-typography skills:
 * - KineticRotatingHeadline: Dynamic rotating keyword swap with masked upward wipe and soft blur
 * - KineticSplitReveal: Word/character split reveal with Apple-style focus-pull blur
 * - ShimmerBadge: Moving specular gradient sweep for high-impact labels and badges
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
  readonly iconName: string;
}

export const HAZARD_ROTATION_ITEMS: readonly HazardRotationItem[] = [
  {
    id: 'slick_epoxy',
    phrase: 'slick wet epoxy floors.',
    hazardLabel: 'Surface Traction Loss',
    metric: 'μ = 0.18 • Skid +1.8m',
    accentClass: 'text-sky-600',
    borderClass: 'border-sky-200',
    badgeBgClass: 'bg-sky-50 text-sky-700',
    iconName: 'Droplets',
  },
  {
    id: 'steep_slope',
    phrase: 'steep 12% gravel slopes.',
    hazardLabel: 'Momentum Runaway',
    metric: '12% Grade • 88% Tip Risk',
    accentClass: 'text-amber-600',
    borderClass: 'border-amber-200',
    badgeBgClass: 'bg-amber-50 text-amber-800',
    iconName: 'TrendingUp',
  },
  {
    id: 'sunlight_glare',
    phrase: '95,000 Lux blinding glare.',
    hazardLabel: 'RGB Sensor Saturation',
    metric: '95k Lux • Phantom Obstacle',
    accentClass: 'text-yellow-600',
    borderClass: 'border-yellow-200',
    badgeBgClass: 'bg-yellow-50 text-yellow-800',
    iconName: 'Sun',
  },
  {
    id: 'singularity_torque',
    phrase: 'joint singularity limits.',
    hazardLabel: 'Torque Spikes',
    metric: '195 Nm Peak • Controller Trip',
    accentClass: 'text-purple-600',
    borderClass: 'border-purple-200',
    badgeBgClass: 'bg-purple-50 text-purple-800',
    iconName: 'Activity',
  },
  {
    id: 'payload_shift',
    phrase: 'unmodeled payload shifts.',
    hazardLabel: 'ZMP Boundary Breach',
    metric: 'Δcg = 14cm • Dynamic Tipping',
    accentClass: 'text-rose-600',
    borderClass: 'border-rose-200',
    badgeBgClass: 'bg-rose-50 text-rose-800',
    iconName: 'AlertOctagon',
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
        className="text-2xl sm:text-4xl lg:text-[46px] font-black text-[#2f3437] tracking-tight leading-[1.18]"
        aria-label={`Robots pass simulation in the lab. They fail on ${currentHazard.phrase}`}
      >
        <div className="overflow-hidden py-0.5">
          <span className="inline-block animate-soft-blur transform-gpu" style={{ letterSpacing: '-0.028em' }}>
            Robots pass simulation in the lab.
          </span>
        </div>

        <div className="overflow-hidden py-1 flex flex-wrap items-center gap-x-3">
          <span className="text-[#37352f]" style={{ letterSpacing: '-0.028em' }}>
            They fail on
          </span>

          {/* Masked Rotating Dynamic Phrase with Soft Blur & Wipe */}
          <span className="relative inline-block overflow-hidden align-middle">
            <span
              key={currentHazard.id}
              className={`inline-block font-extrabold transition-all transform-gpu ${
                currentHazard.accentClass
              } ${isAnimating ? 'animate-mask-up' : 'opacity-0 translate-y-3'}`}
              style={{ letterSpacing: '-0.025em' }}
            >
              {currentHazard.phrase}
            </span>
          </span>
        </div>
      </div>

      {/* Dynamic Telemetry Pill Bar with Live Swapped Hazard Info */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs text-[#787774] font-medium hidden sm:inline">Simulated Failure:</span>
        <div
          key={`badge-${currentHazard.id}`}
          className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-300 shadow-xs ${
            currentHazard.badgeBgClass
          } ${currentHazard.borderClass} ${isAnimating ? 'animate-soft-blur' : 'opacity-0'}`}
        >
          <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
          <span>{currentHazard.hazardLabel}:</span>
          <span className="font-mono font-bold tracking-tight">{currentHazard.metric}</span>
        </div>

        {/* Quick Hazard Interactive Pills */}
        <div className="flex items-center gap-1.5 ml-auto text-[11px]">
          <span className="text-[#9a9a97] text-[10px] hidden md:inline">Inspect:</span>
          {HAZARD_ROTATION_ITEMS.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleManualSelect(idx)}
              className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                idx === activeIdx
                  ? 'bg-[#37352f] text-white shadow-xs'
                  : 'bg-[#f1f1ef] hover:bg-[#e6e5e3] text-[#5a5751]'
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
      className={`relative inline-flex items-center overflow-hidden px-2.5 py-1 rounded-md text-xs font-medium border border-[rgba(55,53,47,0.12)] bg-[#fbfbfa] text-[#37352f] ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <span
        className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/70 to-transparent animate-shimmer-sweep pointer-events-none"
        style={{ backgroundSize: '200% 100%' }}
      />
    </span>
  );
};
