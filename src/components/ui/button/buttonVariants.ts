import { tv } from 'tailwind-variants';

export type ButtonVariant = 'primary' | 'secondary' | 'dangerous';
export type ButtonAppearance = 'filled' | 'outline';
export type ButtonEffect = 'none' | 'glow';

export const buttonVariants = tv({
  base: [
    'relative inline-flex items-center justify-center gap-2 overflow-hidden',
    'btn-corner-squircle px-6 py-2 font-medium',
    'border border-transparent',
    'transition-[transform,background-color,border-color,color,opacity,box-shadow] duration-300 ease-out',
    'cursor-pointer select-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'active:scale-[0.97]',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100',
  ],
  variants: {
    variant: {
      primary: '',
      secondary: '',
      dangerous: '',
    },
    appearance: {
      filled: '',
      outline: 'bg-transparent',
    },
    loading: {
      true: 'btn-loading pointer-events-none',
      false: '',
    },
  },
  compoundVariants: [
    {
      variant: 'primary',
      appearance: 'filled',
      class: [
        'bg-cyan-600 text-white text-shadow-2xs text-shadow-black/15',
        'hover:bg-cyan-600',
        'dark:bg-cyan-600 dark:hover:bg-cyan-600',
      ],
    },
    {
      variant: 'primary',
      appearance: 'outline',
      class: [
        'border-cyan-500/60 text-cyan-600',
        'hover:bg-cyan-500/10',
        'dark:text-cyan-400 dark:hover:bg-cyan-500/15',
      ],
    },
    {
      variant: 'secondary',
      appearance: 'filled',
      class: [
        'bg-black/10 text-foreground',
        'hover:bg-black/15',
        'dark:bg-white/10 dark:hover:bg-white/15',
      ],
    },
    {
      variant: 'secondary',
      appearance: 'outline',
      class: [
        'border-black/15 text-foreground',
        'hover:bg-black/10',
        'dark:border-white/15 dark:hover:bg-white/10',
      ],
    },
    {
      variant: 'dangerous',
      appearance: 'filled',
      class: [
        'bg-rose-600 text-white',
        'hover:bg-rose-500',
        'dark:bg-rose-600 dark:hover:bg-rose-500',
      ],
    },
    {
      variant: 'dangerous',
      appearance: 'outline',
      class: [
        'border-rose-500/60 text-rose-600',
        'hover:bg-rose-500/10',
        'dark:text-rose-400 dark:hover:bg-rose-500/15',
      ],
    },
  ],
  defaultVariants: {
    variant: 'primary',
    appearance: 'filled',
    loading: false,
  },
});
