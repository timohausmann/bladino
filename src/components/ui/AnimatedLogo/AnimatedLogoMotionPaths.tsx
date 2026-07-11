import clsx from 'clsx';
import { motion, type TargetAndTransition, type Variants } from 'motion/react';

import styles from './AnimatedLogo.module.css';
import type { PathAnimationCustom } from './logoPathTransforms';

const SPRING = {
  type: 'spring' as const,
  stiffness: 62,
  damping: 13,
  mass: 1.25,
};

const SCALE_OVERLAY = {
  keyframes: [1, 1.06, 1] as const,
  duration: 2.5,
};

function buildEntryVariants(): Variants {
  return {
    hidden: (c: PathAnimationCustom) => ({
      opacity: 0,
      x: c.x,
      ...(c.y !== 0 ? { y: c.y } : {}),
      ...(c.rotate !== 0 ? { rotate: c.rotate } : {}),
      ...(c.entryScale !== 1 ? { scale: c.entryScale } : {}),
    }),
    visible: (c: PathAnimationCustom) => ({
      opacity: 1,
      x: 0,
      ...(c.y !== 0 ? { y: 0 } : {}),
      ...(c.rotate !== 0 ? { rotate: 0 } : {}),
      ...(c.entryScale !== 1 ? { scale: 1 } : {}),
      transition: {
        opacity: { duration: 0.8, ease: 'easeOut', delay: c.delay },
        x: { ...SPRING, delay: c.delay },
        ...(c.y !== 0 ? { y: { ...SPRING, delay: c.delay } } : {}),
        ...(c.rotate !== 0 ? { rotate: { ...SPRING, delay: c.delay } } : {}),
        ...(c.entryScale !== 1 ? { scale: { ...SPRING, delay: c.delay } } : {}),
      },
    }),
  };
}

function buildRestingAnimate(
  c: PathAnimationCustom,
  { idle, scale }: { idle: boolean; scale: boolean },
): TargetAndTransition | false {
  if (!idle && !scale) return false;

  const animate: TargetAndTransition = {};

  if (idle) {
    animate.x = [0, c.idle.x, 0, -c.idle.x, 0];
    animate.y = [0, c.idle.y, 0, -c.idle.y, 0];
    animate.rotate = [0, c.idle.rotate, 0, -c.idle.rotate, 0];
  }

  if (scale) {
    animate.scale = [...SCALE_OVERLAY.keyframes];
  }

  animate.transition = {
    ...(idle
      ? {
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
        }
      : {}),
    ...(scale
      ? {
          scale: {
            duration: SCALE_OVERLAY.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }
      : {}),
  };

  return animate;
}

type LogoPath = { d: string; className: string };

export type AnimatedLogoOverlays = {
  /** Breathing scale pulse layered on top of idle/rest. */
  scale?: boolean;
};

export type AnimatedLogoMotionPathsProps = {
  paths: LogoPath[];
  centers: Array<{ cx: number; cy: number }>;
  customs: PathAnimationCustom[];
  shouldAnimate: boolean;
  /** One-time scatter/spring on mount. */
  entry: boolean;
  /** Entry animation has finished — baseline/overlays may start. */
  entryComplete: boolean;
  /** Baseline idle wobble (default resting animation). */
  idle: boolean;
  /** Overlay animations composited on top of idle/rest. */
  overlays: AnimatedLogoOverlays;
};

export default function AnimatedLogoMotionPaths({
  paths,
  centers,
  customs,
  shouldAnimate,
  entry,
  entryComplete,
  idle,
  overlays,
}: AnimatedLogoMotionPathsProps) {
  const entryVariants = buildEntryVariants();
  const scaleOverlay = overlays.scale ?? false;
  const restingActive = entryComplete || !entry;

  return (
    <>
      {paths.map((path, i) => {
        const { cx, cy } = centers[i];
        const custom = customs[i];
        const restingAnimate = restingActive
          ? buildRestingAnimate(custom, { idle, scale: scaleOverlay })
          : false;

        return (
          <g key={`a${i}`} transform={`translate(${cx}, ${cy})`}>
            <motion.g
              variants={entryVariants}
              custom={custom}
              initial={shouldAnimate && entry ? 'hidden' : false}
              animate={shouldAnimate && entry ? 'visible' : 'visible'}
            >
              <motion.g animate={restingAnimate}>
                <path
                  d={path.d}
                  transform={`translate(${-cx}, ${-cy})`}
                  className={clsx(styles.path, path.className)}
                />
              </motion.g>
            </motion.g>
          </g>
        );
      })}
    </>
  );
}
