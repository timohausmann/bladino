import { tv } from 'tailwind-variants';

export type IconButtonVariant = 'default' | 'persistent' | 'dangerous';
export type IconButtonShape = 'circle' | 'rounded-square';
export type IconButtonSize = 'default' | 'sm';

export const iconButtonVariants = tv({
  base: [
    'border-none flex items-center justify-center p-0 transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  ],
  variants: {
    size: {
      default: 'h-10 w-10',
      sm: 'h-8 w-8',
    },
    shape: {
      circle: 'rounded-full',
      'rounded-square': 'rounded-lg',
    },
    variant: {
      default: [
        'cursor-pointer text-foreground bg-transparent',
        'hover:bg-black/10 dark:hover:bg-white/10',
      ],
      persistent: [
        'cursor-pointer text-foreground',
        'bg-black/5 dark:bg-white/10',
        'hover:bg-black/10 dark:hover:bg-white/20',
      ],
      dangerous: [
        'cursor-pointer text-rose-600 dark:text-rose-400 bg-transparent',
        'hover:bg-rose-500/10 dark:hover:bg-rose-500/15',
      ],
    },
    active: {
      true: '',
      false: '',
    },
    disabled: {
      true: 'cursor-not-allowed opacity-50 pointer-events-none',
      false: '',
    },
  },
  compoundVariants: [
    {
      variant: 'default',
      active: true,
      disabled: false,
      class: 'bg-black/10 dark:bg-white/10',
    },
    {
      variant: 'persistent',
      active: true,
      disabled: false,
      class: 'bg-black/10 dark:bg-white/20',
    },
    {
      variant: 'dangerous',
      active: true,
      disabled: false,
      class: 'bg-rose-500/15 dark:bg-rose-500/20',
    },
    {
      variant: 'default',
      disabled: true,
      class: 'hover:bg-transparent dark:hover:bg-transparent',
    },
    {
      variant: 'persistent',
      disabled: true,
      class: 'hover:bg-black/5 dark:hover:bg-white/10',
    },
    {
      variant: 'dangerous',
      disabled: true,
      class: 'hover:bg-transparent dark:hover:bg-transparent',
    },
  ],
  defaultVariants: {
    variant: 'default',
    shape: 'circle',
    size: 'default',
    active: false,
    disabled: false,
  },
});
