/** Center of a path in SVG user coordinates. */
export type PathCenter = { cx: number; cy: number };

export type IdleParams = {
  /** X wobble amplitude in CSS px. */
  x: number;
  /** Y wobble amplitude in CSS px. */
  y: number;
  /** Rotation wobble amplitude in degrees. */
  rotate: number;
  /** Duration of one full wobble cycle in seconds. */
  duration: number;
};

export type PathAnimationCustom = {
  /** Start X offset in CSS display pixels. */
  x: number;
  /** Start Y offset in CSS display pixels. 0 when yFactor is 0. */
  y: number;
  /** Start rotation in degrees. 0 when rotateMax is 0. */
  rotate: number;
  /** Random entry stagger delay in seconds. */
  delay: number;
  /** Per-path entry start scale (1 = full size). */
  entryScale: number;
  /** Parameters for the continuous idle wobble after assembly. */
  idle: IdleParams;
};

export const LOGO_VIEWBOX_WIDTH = 553;
export const LOGO_VIEWBOX_HEIGHT = 143;

export const DEFAULT_LOGO_PADDING = 42;
export const DEFAULT_LOGO_HEIGHT = '4rem';
/** Max scatter in CSS display pixels. */
export const DEFAULT_OFFSET_MAX = 20;
/** 0 = no Y scatter, 1 = same range as X, 2 = double. */
export const DEFAULT_Y_FACTOR = 0.33;
/** Max initial rotation in degrees. */
export const DEFAULT_ROTATE_MAX = 20;
/** Max random entry stagger delay in seconds. */
export const DEFAULT_INNER_DELAY_MAX_S = 0.55;

export const REST_ANIMATION: PathAnimationCustom = {
  x: 0,
  y: 0,
  rotate: 0,
  delay: 0,
  entryScale: 1,
  idle: { x: 0, y: 0, rotate: 0, duration: 3 },
};
export const ZERO_CENTER: PathCenter = { cx: 0, cy: 0 };

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function sign() {
  return Math.random() < 0.5 ? -1 : 1;
}

export function resolveCssSize(v: number | string): string {
  return typeof v === 'number' ? `${v}px` : v;
}

export function resolveTotalHeight(
  logoHeight: number | string,
  padding: number,
): string {
  const { height } = paddedViewBoxSize(padding);
  const scale = height / LOGO_VIEWBOX_HEIGHT;
  return `calc(${resolveCssSize(logoHeight)} * ${scale.toFixed(5)})`;
}

/** ViewBox size including scatter padding — must match SVG width/height attrs. */
export function paddedViewBoxSize(padding: number) {
  return {
    width: LOGO_VIEWBOX_WIDTH + padding * 2,
    height: LOGO_VIEWBOX_HEIGHT + padding * 2,
  };
}

/** Measures the path's center in SVG user coordinates (unaffected by CSS transforms). */
export function measureCenter(path: SVGPathElement): PathCenter {
  const b = path.getBBox();
  return { cx: b.x + b.width / 2, cy: b.y + b.height / 2 };
}

/**
 * Motion writes `translateX(npx)` on SVG `<g>`. Blink maps that 1:1 to viewBox
 * units, then the SVG is scaled to CSS size. Divide CSS-px values by CTM.a so
 * `offsetMax={20}` stays ~20 CSS pixels on screen at any logoHeight.
 */
export function motionCustomToSvgUserUnits(
  custom: PathAnimationCustom,
  cssPerUserUnit: number,
): PathAnimationCustom {
  const scale = cssPerUserUnit > 0 ? cssPerUserUnit : 1;
  return {
    ...custom,
    x: custom.x / scale,
    y: custom.y / scale,
    idle: {
      ...custom.idle,
      x: custom.idle.x / scale,
      y: custom.idle.y / scale,
    },
  };
}

export function createAnimation(opts: {
  offsetMax: number;
  yFactor: number;
  rotateMax: number;
  innerDelayMax: number;
  scaleFrom: number;
}): PathAnimationCustom {
  const { offsetMax, yFactor, rotateMax, innerDelayMax, scaleFrom } = opts;
  const withScale = scaleFrom !== 1;
  return {
    x: sign() * rand(0, offsetMax),
    y: yFactor === 0 ? 0 : sign() * rand(0, offsetMax * yFactor),
    rotate: rotateMax === 0 ? 0 : rand(-rotateMax, rotateMax),
    delay: rand(0, innerDelayMax),
    entryScale: withScale ? rand(0.12, scaleFrom) : 1,
    idle: {
      x: rand(0.8, 2.5),
      y: rand(0.3, 1.0),
      rotate: rand(0.2, 1.2),
      duration: rand(2.5, 5.0),
    },
  };
}
