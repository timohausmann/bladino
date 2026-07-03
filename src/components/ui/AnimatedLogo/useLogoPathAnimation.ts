import { useLayoutEffect, useRef, useState } from 'react';

import {
  createAnimation,
  measureCenter,
  REST_ANIMATION,
  ZERO_CENTER,
  LOGO_VIEWBOX_WIDTH,
  LOGO_VIEWBOX_HEIGHT,
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
};

type State = { centers: PathCenter[]; customs: PathAnimationCustom[] };

const LOGO_CX = LOGO_VIEWBOX_WIDTH / 2;
const LOGO_CY = LOGO_VIEWBOX_HEIGHT / 2;

export function useLogoPathAnimation({
  enabled,
  pathCount,
  offsetMax,
  yFactor,
  rotateMax,
  innerDelayMax,
}: Opts) {
  const refs = useRef<(SVGPathElement | null)[]>([]);
  const [state, setState] = useState<State | null>(null);

  useLayoutEffect(() => {
    const centers = refs.current.map((p) =>
      p ? measureCenter(p) : ZERO_CENTER,
    );

    const distances = centers.map((c) =>
      Math.hypot(c.cx - LOGO_CX, c.cy - LOGO_CY),
    );
    const maxDist = Math.max(...distances, 1);

    const customs = enabled
      ? centers.map((_, i) =>
          createAnimation(distances[i] / maxDist, {
            offsetMax,
            yFactor,
            rotateMax,
            innerDelayMax,
          }),
        )
      : Array.from({ length: pathCount }, () => REST_ANIMATION);

    setState({ centers, customs });
  }, [enabled, pathCount, offsetMax, yFactor, rotateMax, innerDelayMax]);

  const setRef = (i: number) => (el: SVGPathElement | null) => {
    refs.current[i] = el;
  };

  return {
    centers:
      state?.centers ?? Array.from({ length: pathCount }, () => ZERO_CENTER),
    customs:
      state?.customs ?? Array.from({ length: pathCount }, () => REST_ANIMATION),
    setRef,
    ready: state !== null,
  };
}
