import { createContext, useContext, useEffect, useState } from 'react';

export type BackgroundStyle = 'pattern' | 'plain';

const STORAGE_KEY = 'backgroundStyle';
const BODY_PATTERN_CLASS = 'bg-pattern';
const defaultBackgroundStyle: BackgroundStyle = 'pattern';

type BackgroundStyleProviderProps = { children: React.ReactNode };
type BackgroundStyleProviderState = {
  backgroundStyle: BackgroundStyle;
  setBackgroundStyle: (style: BackgroundStyle) => void;
};

const BackgroundStyleProviderContext =
  createContext<BackgroundStyleProviderState>({
    backgroundStyle: defaultBackgroundStyle,
    setBackgroundStyle: () => null,
  });

/** Reads the persisted background style from localStorage. */
export function readStoredBackgroundStyle(): BackgroundStyle {
  if (typeof window === 'undefined') {
    return defaultBackgroundStyle;
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'plain' ? 'plain' : defaultBackgroundStyle;
}

/** Applies the body background pattern class on the document root. */
export function applyBackgroundStyleClass(style: BackgroundStyle) {
  const root = window.document.documentElement;
  if (style === 'pattern') {
    root.classList.add(BODY_PATTERN_CLASS);
  } else {
    root.classList.remove(BODY_PATTERN_CLASS);
  }
}

export const useBackgroundStyle = () => {
  const context = useContext(BackgroundStyleProviderContext);
  if (!context) {
    throw new Error(
      'useBackgroundStyle must be used within a BackgroundStyleProvider',
    );
  }
  return context;
};

export function BackgroundStyleProvider({
  children,
}: BackgroundStyleProviderProps) {
  const [backgroundStyle, setBackgroundStyle] = useState<BackgroundStyle>(
    readStoredBackgroundStyle,
  );

  useEffect(() => {
    applyBackgroundStyleClass(backgroundStyle);
  }, [backgroundStyle]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, backgroundStyle);
  }, [backgroundStyle]);

  const value = {
    backgroundStyle,
    setBackgroundStyle,
  };

  return (
    <BackgroundStyleProviderContext.Provider value={value}>
      {children}
    </BackgroundStyleProviderContext.Provider>
  );
}
