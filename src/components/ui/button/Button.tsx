import React, { useCallback, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { ButtonGlow, getGlowRadius } from '@/components/ui/button/ButtonGlow';
import {
  buttonVariants,
  type ButtonAppearance,
  type ButtonEffect,
  type ButtonVariant,
} from '@/components/ui/button/buttonVariants';

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  appearance?: ButtonAppearance;
  effect?: ButtonEffect;
  iconBefore?: React.ReactNode;
  iconAfter?: React.ReactNode;
  loading?: boolean;
  className?: string;
}

function resolveEffect(
  _variant: ButtonVariant,
  effect?: ButtonEffect,
): ButtonEffect {
  if (effect !== undefined) return effect;
  return 'glow';
}

export function Button({
  children,
  variant = 'primary',
  appearance = 'filled',
  effect: effectProp,
  iconBefore,
  iconAfter,
  disabled = false,
  loading = false,
  className,
  type = 'button',
  onClick,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...rest
}: ButtonProps) {
  const [glowActive, setGlowActive] = useState(false);
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0, radius: 72 });

  const isDisabled = disabled || loading;
  const effect = resolveEffect(variant, effectProp);
  const showGlow = effect === 'glow';

  const updateGlowTarget = useCallback(
    (target: HTMLButtonElement, clientX: number, clientY: number) => {
      const rect = target.getBoundingClientRect();
      setGlowPos({
        x: clientX - rect.left,
        y: clientY - rect.top,
        radius: getGlowRadius(rect.width, rect.height),
      });
    },
    [],
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (showGlow && !loading)
      updateGlowTarget(e.currentTarget, e.clientX, e.clientY);
    onMouseMove?.(e);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (showGlow && !loading) {
      setGlowActive(true);
      updateGlowTarget(e.currentTarget, e.clientX, e.clientY);
    }
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    setGlowActive(false);
    onMouseLeave?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
    if (showGlow && !loading) {
      const rect = e.currentTarget.getBoundingClientRect();
      setGlowPos({
        x: rect.width / 2,
        y: rect.height / 2,
        radius: getGlowRadius(rect.width, rect.height),
      });
      setGlowActive(true);
    }
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
    setGlowActive(false);
    onBlur?.(e);
  };

  const label =
    typeof children === 'string'
      ? children
      : typeof rest['aria-label'] === 'string'
        ? rest['aria-label']
        : 'Button';

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      aria-busy={loading || undefined}
      aria-label={
        rest['aria-label'] ?? (typeof children === 'string' ? children : label)
      }
      tabIndex={isDisabled ? -1 : 0}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={twMerge(
        buttonVariants({ variant, appearance, loading }),
        className,
      )}
      {...rest}
    >
      {showGlow && !loading && (
        <ButtonGlow
          variant={variant}
          appearance={appearance}
          targetX={glowPos.x}
          targetY={glowPos.y}
          radius={glowPos.radius}
          active={glowActive && !disabled}
        />
      )}

      <span
        className={twMerge(
          'relative z-10 inline-flex items-center justify-center gap-2',
          loading && 'opacity-0',
        )}
      >
        {iconBefore}
        {children}
        {iconAfter}
      </span>

      {loading && (
        <span
          className="absolute inset-0 z-10 flex items-center justify-center"
          aria-hidden
        >
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/25 border-t-current" />
        </span>
      )}
    </button>
  );
}
