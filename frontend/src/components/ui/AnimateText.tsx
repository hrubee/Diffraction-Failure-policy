/**
 * Presentation Component: AnimateText (backed by animate-text and kinetic-typography skills)
 * Follows kinetic typography accessibility guidelines:
 * - aria-label={text} on container for screen-readers and assistive tech
 * - aria-hidden="true" on animated word/character fragments
 * - Supports soft-blur-in (Apple-style focus pull), per-word-crossfade, and mask-reveal-up (overflow clip)
 */

'use client';

import React from 'react';

interface AnimateTextProps {
  readonly text: string;
  readonly effect?: 'soft-blur-in' | 'per-word-crossfade' | 'mask-reveal-up';
  readonly className?: string;
  readonly delayMs?: number;
}

export const AnimateText: React.FC<AnimateTextProps> = ({
  text,
  effect = 'soft-blur-in',
  className = '',
  delayMs = 0,
}) => {
  const words = text.split(' ');

  if (effect === 'mask-reveal-up') {
    return (
      <span className={`inline-block ${className}`} aria-label={text}>
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden align-top" aria-hidden="true">
            <span
              className="inline-block animate-word-fade opacity-0 transform-gpu"
              style={{
                animationDelay: `${i * 60 + delayMs}ms`,
                letterSpacing: '-0.02em',
              }}
            >
              {word}&nbsp;
            </span>
          </span>
        ))}
      </span>
    );
  }

  if (effect === 'per-word-crossfade') {
    return (
      <span className={className} aria-label={text}>
        {words.map((word, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="inline-block animate-word-fade opacity-0 transform-gpu"
            style={{
              animationDelay: `${i * 65 + delayMs}ms`,
              letterSpacing: '-0.015em',
            }}
          >
            {word}&nbsp;
          </span>
        ))}
      </span>
    );
  }

  // Default: soft-blur-in per-word for premium focus pull feel
  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="inline-block animate-soft-blur opacity-0 transform-gpu"
          style={{
            animationDelay: `${i * 50 + delayMs}ms`,
            letterSpacing: '-0.02em',
          }}
        >
          {word}&nbsp;
        </span>
      ))}
    </span>
  );
};
