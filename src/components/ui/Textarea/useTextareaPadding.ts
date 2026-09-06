import { useLayoutEffect, useRef, useState, type RefObject } from 'react';

interface UseTextareaPaddingOptions {
  hasAdornment: boolean;
  /** Padding is only applied while the overlay is meant to be visible. */
  reveal: boolean;
}

interface UseTextareaPaddingResult {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  adornmentRef: RefObject<HTMLDivElement | null>;
  paddingRight: number | undefined;
}

/**
 * Tracks overlay width (incl. right-2 / pl-2) so the field's padding-right
 * stays in sync when buttons appear, hide, or change at breakpoints.
 */
export function useTextareaPadding({
  hasAdornment,
  reveal,
}: UseTextareaPaddingOptions): UseTextareaPaddingResult {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const adornmentRef = useRef<HTMLDivElement>(null);
  const [insetPx, setInsetPx] = useState(0);

  useLayoutEffect(() => {
    const adornment = adornmentRef.current;
    const textarea = textareaRef.current;
    if (!hasAdornment || !adornment || !textarea) {
      setInsetPx(0);
      return;
    }

    const updateInset = () => {
      if (!adornment.isConnected || !textarea.isConnected) {
        return;
      }

      const adornmentRect = adornment.getBoundingClientRect();
      if (adornmentRect.width <= 0) {
        setInsetPx(0);
        return;
      }

      const textareaRect = textarea.getBoundingClientRect();
      setInsetPx(Math.ceil(textareaRect.right - adornmentRect.left));
    };

    updateInset();
    const observer = new ResizeObserver(updateInset);
    observer.observe(adornment);
    return () => observer.disconnect();
  }, [hasAdornment]);

  return {
    textareaRef,
    adornmentRef,
    paddingRight: reveal && insetPx > 0 ? insetPx : undefined,
  };
}
