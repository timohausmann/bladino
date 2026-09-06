import clsx from 'clsx';
import {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';

import styles from './AnimatedLogo.module.css';
import type { AnimatedLogoOverlays } from './AnimatedLogoMotionPaths';
import {
  DEFAULT_INNER_DELAY_MAX_S,
  DEFAULT_LOGO_HEIGHT,
  DEFAULT_LOGO_PADDING,
  DEFAULT_OFFSET_MAX,
  DEFAULT_ROTATE_MAX,
  DEFAULT_Y_FACTOR,
  motionCustomToSvgUserUnits,
  paddedViewBoxSize,
  resolveCssSize,
  resolveTotalHeight,
} from './logoPathTransforms';
import { useLogoPathAnimation } from './useLogoPathAnimation';

const AnimatedLogoMotionPaths = lazy(() => import('./AnimatedLogoMotionPaths'));

export type { AnimatedLogoOverlays };

export type AnimatedLogoProps = {
  /** Master switch for motion (respects prefers-reduced-motion). */
  animate?: boolean;
  /** Baseline idle wobble — the default resting animation. */
  idle?: boolean;
  /** One-time scatter/spring entry on mount. */
  entry?: boolean;
  /** Overlay animations layered on top of idle/rest (e.g. scale pulse). */
  overlays?: AnimatedLogoOverlays;
  className?: string;
  /** CSS height of the logo artwork (excluding viewBox padding). */
  logoHeight?: number | string;
  /** CSS height of the full SVG including padding. Auto-computed when omitted. */
  totalHeight?: number | string;
  /** ViewBox padding in SVG user units — must be >= offsetMax to avoid clipping. */
  padding?: number;
  /** Max scatter distance in CSS display pixels. */
  offsetMax?: number;
  /** Y scatter factor: 0 = no Y movement, 1 = same range as X, 2 = double. */
  yFactor?: number;
  /** Max initial rotation in degrees around each path's own center. 0 = no rotation. */
  rotateMax?: number;
  /** Max random entry stagger delay in seconds. */
  innerDelayMax?: number;
  /** Initial scale of each path during entry (e.g. 0.8 = starts 20% smaller). */
  scaleFrom?: number;
};

type LogoPath = { d: string; className: string };

const LOGO_PATHS: LogoPath[] = [
  { d: 'M458.5 113.5L494 48H458.5V113.5Z', className: styles.fillTeal },
  {
    d: 'M537.551 58L553 3L381 39.6667L537.551 58Z',
    className: styles.fillCyan,
  },
  {
    d: 'M438.982 67.0924L392.915 43.0576L355.528 60.4161L392.915 73.1011L438.982 67.0924Z',
    className: styles.fillTeal,
  },
  {
    d: 'M476.369 142.535L388.242 45.0605L355.528 60.4163L476.369 142.535Z',
    className: styles.fillTeal,
  },
  {
    d: 'M472.363 3L386.906 80.4451L355.528 60.4163L472.363 3Z',
    className: styles.fillCyan,
  },
  {
    d: 'M356.5 71.5L346.5 85.5L331 29.5L336 29.5L356.5 71.5Z',
    className: styles.fillTeal,
  },
  { d: 'M346 85L387.5 10L366.5 112.5L346 85Z', className: styles.fillCyan },
  {
    d: 'M336.646 28.563L315.972 111.748L309.727 7.30579L336.646 28.563Z',
    className: styles.fillCyan,
  },
  {
    d: 'M261.818 48.9229L302.8 58.1602L299.008 64.8514L257.759 72.172L261.818 48.9229Z',
    className: styles.fillTeal,
  },
  {
    d: 'M261.413 3.2948L272.334 117.285L245.433 95.5298L261.413 3.2948Z',
    className: styles.fillCyan,
  },
  {
    d: 'M294.278 0.529358L286.433 114.772L317.763 85.197L294.278 0.529358Z',
    className: styles.fillCyan,
  },
  {
    d: 'M239.923 60.9744L229.41 77.7949L191.5 60L196 55.5L239.923 60.9744Z',
    className: styles.fillTeal,
  },
  {
    d: 'M224.695 60.9744L187.359 60.9744L249.385 1.21837e-05L224.695 60.9744Z',
    className: styles.fillCyan,
  },
  {
    d: 'M224.664 60.9744L262 60.9744L199.974 123L224.664 60.9744Z',
    className: styles.fillCyan,
  },
  { d: 'M217 108L166 86L176 17L217 108Z', className: styles.fillTeal },
  { d: 'M199 68L151 110L176 12L199 68Z', className: styles.fillCyan },
  {
    d: 'M176.259 107.971L110.7 75.2799L134.817 50.404L176.259 107.971Z',
    className: styles.fillTeal,
  },
  {
    d: 'M158 48.6667L106 111L115.455 9L158 48.6667Z',
    className: styles.fillCyan,
  },
  { d: 'M94.5 110.5L59 45H94.5V110.5Z', className: styles.fillTeal },
  { d: 'M15.4491 55L0 0L172 36.6667L15.4491 55Z', className: styles.fillCyan },
];

function subscribeReducedMotion(onChange: () => void) {
  const m = window.matchMedia('(prefers-reduced-motion: reduce)');
  m.addEventListener('change', onChange);
  return () => m.removeEventListener('change', onChange);
}
function getReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function StaticLogoPaths({ paths }: { paths: LogoPath[] }) {
  return (
    <>
      {paths.map((path, i) => (
        <path
          key={`s${i}`}
          d={path.d}
          className={clsx(styles.path, path.className)}
        />
      ))}
    </>
  );
}

export const AnimatedLogo = ({
  animate: animateEnabled = true,
  idle: idleEnabled = true,
  entry: entryEnabled = true,
  overlays = {},
  className,
  logoHeight = DEFAULT_LOGO_HEIGHT,
  totalHeight,
  padding = DEFAULT_LOGO_PADDING,
  offsetMax = DEFAULT_OFFSET_MAX,
  yFactor = DEFAULT_Y_FACTOR,
  rotateMax = DEFAULT_ROTATE_MAX,
  innerDelayMax = DEFAULT_INNER_DELAY_MAX_S,
  scaleFrom = 0.6,
}: AnimatedLogoProps) => {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false,
  );
  const shouldAnimate = animateEnabled && !reducedMotion;

  const { centers, customs, cssPerUserUnit, setRef, ready } =
    useLogoPathAnimation({
      enabled: shouldAnimate,
      pathCount: LOGO_PATHS.length,
      offsetMax,
      yFactor,
      rotateMax,
      innerDelayMax,
      scaleFrom,
    });

  const motionCustoms = useMemo(
    () =>
      customs.map((custom) =>
        motionCustomToSvgUserUnits(custom, cssPerUserUnit),
      ),
    [customs, cssPerUserUnit],
  );

  const playAnimation = shouldAnimate && ready;

  const [motionLoaded, setMotionLoaded] = useState(!shouldAnimate);
  useEffect(() => {
    if (!shouldAnimate) {
      setMotionLoaded(true);
      return;
    }
    let cancelled = false;
    setMotionLoaded(false);
    void import('./AnimatedLogoMotionPaths').then(() => {
      if (!cancelled) setMotionLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [shouldAnimate]);

  const showAnimatedPaths = ready && (!shouldAnimate || motionLoaded);

  const [entryComplete, setEntryComplete] = useState(!entryEnabled);
  useEffect(() => {
    if (!playAnimation || !entryEnabled) {
      setEntryComplete(!entryEnabled);
      return;
    }
    setEntryComplete(false);
    // Give entry animation time to fully settle: max stagger + spring duration.
    const ms = (innerDelayMax + 0.8) * 1000;
    const t = setTimeout(() => setEntryComplete(true), ms);
    return () => clearTimeout(t);
  }, [playAnimation, entryEnabled, innerDelayMax]);

  const resolvedTotalHeight = resolveCssSize(
    totalHeight ?? resolveTotalHeight(logoHeight, padding),
  );
  const viewBox = paddedViewBoxSize(padding);

  return (
    <svg
      width={viewBox.width}
      height={viewBox.height}
      viewBox={`${-padding} ${-padding} ${viewBox.width} ${viewBox.height}`}
      xmlns="http://www.w3.org/2000/svg"
      className={clsx(styles.logo, className)}
      style={{ height: resolvedTotalHeight, width: 'auto', maxWidth: '100%' }}
    >
      {LOGO_PATHS.map((path, i) => (
        <path
          key={`m${i}`}
          ref={setRef(i)}
          d={path.d}
          style={{ visibility: 'hidden', pointerEvents: 'none' }}
        />
      ))}

      {/*
       * Animated paths — appear once centers are measured.
       *
       * Two motion layers per path:
       *   1. Entry — one-time scatter/spring (hidden → visible)
       *   2. Resting — baseline idle wobble + optional overlays (e.g. scale)
       *
       * Transform structure guarantees rotation around each path's own center:
       *   outer <g> positions the SVG pivot at (cx, cy)
       *   motion.g animates x/y/rotate relative to that pivot
       *   inner <path> is shifted so its natural center sits at the pivot (0,0)
       *
       * Motion writes x/y as CSS `px` on SVG groups. Blink treats those as
       * viewBox units, so we convert CSS-pixel amplitudes through the screen
       * CTM before animating — same travel at 2rem and 4rem.
       */}
      {showAnimatedPaths &&
        (shouldAnimate ? (
          <Suspense fallback={null}>
            <AnimatedLogoMotionPaths
              paths={LOGO_PATHS}
              centers={centers}
              customs={motionCustoms}
              shouldAnimate={shouldAnimate}
              entry={entryEnabled}
              entryComplete={entryComplete}
              idle={idleEnabled}
              overlays={overlays}
            />
          </Suspense>
        ) : (
          <StaticLogoPaths paths={LOGO_PATHS} />
        ))}
    </svg>
  );
};
