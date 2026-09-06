import { useLayoutEffect, useRef, useState } from 'react';

import {
  createAnimation,
  measureCenter,
  REST_ANIMATION,
  ZERO_CENTER,
  type PathCenter,
  type PathAnimationCustom,
} from './logoPathTransforms';

type Opts = {
  enabled: boolean;
  pathCount: number;
  offsetMax: number;
  yFactor: number;
  rotateMax: number;
  innerDelayMax: number;
  scaleFrom: number;
};

type State = {
  centers: PathCenter[];
  customs: PathAnimationCustom[];
  /** getScreenCTM().a — CSS pixels per SVG user unit. */
  cssPerUserUnit: number;
};

const restCustoms = (pathCount: number) =>
  Array.from({ length: pathCount }, () => REST_ANIMATION);

const zeroCenters = (pathCount: number) =>
  Array.from({ length: pathCount }, () => ZERO_CENTER);

/** getBBox is 0×0 while an ancestor is `display: none` (e.g. NavRail on mobile). */
const isSvgLaidOut = (path: SVGPathElement | null) => {
  const svg = path?.ownerSVGElement;
  if (!svg) return false;
  const box = svg.getBoundingClientRect();
  return box.width > 0 && box.height > 0;
};

const readCssPerUserUnit = (path: SVGPathElement | null) => {
  const ctm = path?.ownerSVGElement?.getScreenCTM();
  return ctm && ctm.a > 0 ? ctm.a : 0;
};

export function useLogoPathAnimation({
  enabled,
  pathCount,
  offsetMax,
  yFactor,
  rotateMax,
  innerDelayMax,
  scaleFrom,
}: Opts) {
  const refs = useRef<(SVGPathElement | null)[]>([]);
  const customsRef = useRef<PathAnimationCustom[] | null>(null);
  const [state, setState] = useState<State | null>(null);

  useLayoutEffect(() => {
    customsRef.current = null;

    const measure = () => {
      const first = refs.current.find((path) => path != null) ?? null;

      if (!enabled) {
        setState({
          centers: zeroCenters(pathCount),
          customs: restCustoms(pathCount),
          cssPerUserUnit: 1,
        });
        return;
      }

      // Stay unready until the SVG is actually painted — otherwise centers
      // collapse to 0 and CTM.a is 1, which makes shards orbit the origin.
      if (!isSvgLaidOut(first)) return;

      const centers = refs.current.map((path) =>
        path ? measureCenter(path) : ZERO_CENTER,
      );
      const cssPerUserUnit = readCssPerUserUnit(first);
      if (!cssPerUserUnit) return;

      if (!customsRef.current) {
        customsRef.current = centers.map(() =>
          createAnimation({
            offsetMax,
            yFactor,
            rotateMax,
            innerDelayMax,
            scaleFrom,
          }),
        );
      }

      setState({
        centers,
        customs: customsRef.current,
        cssPerUserUnit,
      });
    };

    measure();

    const svg = refs.current.find((path) => path != null)?.ownerSVGElement;
    if (!svg) return undefined;

    const observer = new ResizeObserver(measure);
    observer.observe(svg);
    return () => observer.disconnect();
  }, [
    enabled,
    pathCount,
    offsetMax,
    yFactor,
    rotateMax,
    innerDelayMax,
    scaleFrom,
  ]);

  const setRef = (i: number) => (el: SVGPathElement | null) => {
    refs.current[i] = el;
  };

  return {
    centers: state?.centers ?? zeroCenters(pathCount),
    customs: state?.customs ?? restCustoms(pathCount),
    cssPerUserUnit: state?.cssPerUserUnit ?? 0,
    setRef,
    ready: state !== null,
  };
}
