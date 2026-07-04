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

type State = { centers: PathCenter[]; customs: PathAnimationCustom[] };

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
  const [state, setState] = useState<State | null>(null);

  useLayoutEffect(() => {
    const centers = refs.current.map((p) =>
      p ? measureCenter(p) : ZERO_CENTER,
    );

    const customs = enabled
      ? centers.map(() =>
          createAnimation({
            offsetMax,
            yFactor,
            rotateMax,
            innerDelayMax,
            scaleFrom,
          }),
        )
      : Array.from({ length: pathCount }, () => REST_ANIMATION);

    setState({ centers, customs });
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
    centers:
      state?.centers ?? Array.from({ length: pathCount }, () => ZERO_CENTER),
    customs:
      state?.customs ?? Array.from({ length: pathCount }, () => REST_ANIMATION),
    setRef,
    ready: state !== null,
  };
}
