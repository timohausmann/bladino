import { useEffect, useRef, useState } from 'react';
import type {
  ButtonAppearance,
  ButtonVariant,
} from '@/components/ui/button/buttonVariants';

const GLOW_LERP = 0.2;
const OPACITY_LERP = 0.12;

/** One opacity for all variants — normal alpha compositing (no blend mode). */
const GLOW_OPACITY = 0.15;

interface ButtonGlowProps {
  variant: ButtonVariant;
  appearance: ButtonAppearance;
  targetX: number;
  targetY: number;
  radius: number;
  active: boolean;
}

/** Filled = white spotlight; outline = variant accent color. */
export function getGlowColor(
  variant: ButtonVariant,
  appearance: ButtonAppearance,
): string {
  if (appearance === 'filled') {
    switch (variant) {
      case 'secondary':
        return `rgb(255 255 255 / ${GLOW_OPACITY / 2})`;
      default:
        return `rgb(255 255 255 / ${GLOW_OPACITY})`;
    }
  }

  switch (variant) {
    case 'primary':
      return `rgb(34 211 238 / ${GLOW_OPACITY})`;
    case 'secondary':
      return `rgb(255 255 255 / ${GLOW_OPACITY / 2})`;
    case 'dangerous':
      return `rgb(251 113 133 / ${GLOW_OPACITY})`;
  }
}

function lerp(current: number, target: number, factor: number): number {
  return current + (target - current) * factor;
}

/**
 * MUI-style cursor glow with lerp smoothing — position and opacity ease in/out.
 */
export function ButtonGlow({
  variant,
  appearance,
  targetX,
  targetY,
  radius,
  active,
}: ButtonGlowProps) {
  const color = getGlowColor(variant, appearance);
  const targetRef = useRef({ x: targetX, y: targetY, radius });
  const currentRef = useRef({ x: targetX, y: targetY, radius });
  const opacityRef = useRef(0);
  const [renderPos, setRenderPos] = useState({
    x: targetX,
    y: targetY,
    radius,
  });
  const [renderOpacity, setRenderOpacity] = useState(0);

  targetRef.current = { x: targetX, y: targetY, radius };

  useEffect(() => {
    let frame = 0;

    const tick = () => {
      const target = targetRef.current;
      const current = currentRef.current;
      const opacityTarget = active ? 1 : 0;

      current.x = lerp(current.x, target.x, GLOW_LERP);
      current.y = lerp(current.y, target.y, GLOW_LERP);
      current.radius = lerp(current.radius, target.radius, GLOW_LERP);
      opacityRef.current = lerp(
        opacityRef.current,
        opacityTarget,
        OPACITY_LERP,
      );

      setRenderPos({ x: current.x, y: current.y, radius: current.radius });
      setRenderOpacity(opacityRef.current);

      const stillAnimating =
        active ||
        opacityRef.current > 0.01 ||
        Math.abs(current.x - target.x) > 0.5 ||
        Math.abs(current.y - target.y) > 0.5;

      if (stillAnimating) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active]);

  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 z-1"
      style={{
        opacity: renderOpacity,
        background: `radial-gradient(circle ${renderPos.radius}px at ${renderPos.x}px ${renderPos.y}px, ${color} 0%, transparent 82%)`,
      }}
    />
  );
}

/** Glow radius relative to the shorter button edge. */
export function getGlowRadius(
  buttonWidth: number,
  buttonHeight: number,
): number {
  return Math.min(buttonWidth, buttonHeight) * 1.35;
}
