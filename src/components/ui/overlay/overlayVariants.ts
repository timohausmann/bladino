import { tv } from 'tailwind-variants';
import motionStyles from './overlay.module.css';

export type OverlayTone = 'surface' | 'elevated';
export type OverlayMotion = 'dialog' | 'drawer' | 'dropdown' | 'none';

/**
 * Visual recipe for floating content.
 * Tokens choose the fill; the CSS module only supplies behavior-heavy motion.
 */
export const overlayContentVariants = tv({
  base: 'overflow-hidden rounded-lg border shadow-lg',
  variants: {
    tone: {
      surface: 'border-surface-border bg-surface',
      elevated: 'border-elevated-border bg-elevated',
    },
    motion: {
      dialog: motionStyles.dialogEnter,
      drawer: motionStyles.drawer,
      dropdown: motionStyles.dropdownEnter,
      none: '',
    },
  },
  defaultVariants: {
    tone: 'surface',
    motion: 'none',
  },
});

/** Enter motion shared by modal backdrops. */
export const overlayBackdropEnterClassName = motionStyles.backdropEnter;
