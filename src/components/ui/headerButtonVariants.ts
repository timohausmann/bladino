import { tv } from 'tailwind-variants';

export type HeaderButtonVariant = 'default' | 'persistent' | 'dangerous';

export const headerButtonVariants = tv({
  base: [
    'border-none flex items-center justify-center w-10 h-10 rounded-full p-0 transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  ],
  variants: {
    variant: {
      default: [
        'cursor-pointer text-foreground bg-transparent',
        'hover:bg-black/10 dark:hover:bg-white/10',
      ],
      persistent: [
        'cursor-pointer text-foreground',
        'bg-white/30 dark:bg-white/10',
        'hover:bg-white/50 dark:hover:bg-white/20',
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
      class: 'bg-white/10 dark:bg-white/10',
    },
    {
      variant: 'persistent',
      active: true,
      disabled: false,
      class: 'bg-white/50 dark:bg-white/20',
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
      class: 'hover:bg-white/30 dark:hover:bg-white/10',
    },
    {
      variant: 'dangerous',
      disabled: true,
      class: 'hover:bg-transparent dark:hover:bg-transparent',
    },
  ],
  defaultVariants: {
    variant: 'default',
    active: false,
    disabled: false,
  },
});
