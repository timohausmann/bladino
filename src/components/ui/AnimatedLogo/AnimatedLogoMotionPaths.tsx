import clsx from 'clsx';
import { motion, type Variants } from 'motion/react';

import styles from './AnimatedLogo.module.css';
import type { PathAnimationCustom } from './logoPathTransforms';

const SPRING = {
  type: 'spring' as const,
  stiffness: 62,
  damping: 13,
  mass: 1.25,
};

function buildVariants(scaleFrom: number): Variants {
  const withScale = scaleFrom !== 1;
  return {
    hidden: (c: PathAnimationCustom) => ({
      opacity: 0,
      x: c.x,
      ...(c.y !== 0 ? { y: c.y } : {}),
      ...(c.rotate !== 0 ? { rotate: c.rotate } : {}),
      ...(withScale ? { scale: scaleFrom } : {}),
    }),
    visible: (c: PathAnimationCustom) => ({
      opacity: 1,
      x: 0,
      ...(c.y !== 0 ? { y: 0 } : {}),
      ...(c.rotate !== 0 ? { rotate: 0 } : {}),
      ...(withScale ? { scale: 1 } : {}),
      transition: {
        opacity: { duration: 0.8, ease: 'easeOut', delay: c.delay },
        x: { ...SPRING, delay: c.delay },
        ...(c.y !== 0 ? { y: { ...SPRING, delay: c.delay } } : {}),
        ...(c.rotate !== 0 ? { rotate: { ...SPRING, delay: c.delay } } : {}),
        ...(withScale ? { scale: { ...SPRING, delay: c.delay } } : {}),
      },
    }),
    idle: (c: PathAnimationCustom) => ({
      opacity: 1,
      ...(withScale ? { scale: 1 } : {}),
      x: [0, c.idle.x, 0, -c.idle.x, 0],
      y: [0, c.idle.y, 0, -c.idle.y, 0],
      rotate: [0, c.idle.rotate, 0, -c.idle.rotate, 0],
      transition: {
        x: { duration: c.idle.duration, repeat: Infinity, ease: 'easeInOut' },
        y: {
          duration: c.idle.duration * 1.3,
          repeat: Infinity,
          ease: 'easeInOut',
        },
        rotate: {
          duration: c.idle.duration * 0.85,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      },
    }),
  };
}

type LogoPath = { d: string; className: string };

export type AnimatedLogoMotionPathsProps = {
  paths: LogoPath[];
  centers: Array<{ cx: number; cy: number }>;
  customs: PathAnimationCustom[];
  scaleFrom: number;
  shouldAnimate: boolean;
  animState: 'hidden' | 'visible' | 'idle';
};

export default function AnimatedLogoMotionPaths({
  paths,
  centers,
  customs,
  scaleFrom,
  shouldAnimate,
  animState,
}: AnimatedLogoMotionPathsProps) {
  const variants = buildVariants(scaleFrom);

  return (
    <>
      {paths.map((path, i) => {
        const { cx, cy } = centers[i];
        return (
          <g key={`a${i}`} transform={`translate(${cx}, ${cy})`}>
            <motion.g
              variants={variants}
              custom={customs[i]}
              initial={shouldAnimate ? 'hidden' : false}
              animate={shouldAnimate ? animState : 'visible'}
            >
              <path
                d={path.d}
                transform={`translate(${-cx}, ${-cy})`}
                className={clsx(styles.path, path.className)}
              />
            </motion.g>
          </g>
        );
      })}
    </>
  );
}
