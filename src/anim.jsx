import { useEffect } from 'react';
import { motion, animate, useMotionValue, useTransform } from 'motion/react';

// Shared motion language: one easing curve and one spring so everything feels related.
export const ease = [0.22, 1, 0.36, 1]; // fast out, long soft settle
export const spring = { type: 'spring', stiffness: 420, damping: 34, mass: 0.8 };
export const softSpring = { type: 'spring', stiffness: 220, damping: 28 };

// Whole-screen transitions
export const page = {
  initial: { opacity: 0, y: 14, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.45, ease } },
  exit: { opacity: 0, y: -8, filter: 'blur(2px)', transition: { duration: 0.18, ease: 'easeIn' } },
};

// Parent that staggers its children in
export const stagger = (each = 0.06, delay = 0.05) => ({
  initial: {},
  animate: { transition: { staggerChildren: each, delayChildren: delay } },
});

// A child of `stagger`
export const rise = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
};

/** Button with a springy press. Same props as <button>. */
export function Button({ className = 'btn', children, ...props }) {
  return (
    <motion.button
      className={className}
      whileHover={props.disabled ? undefined : { y: -1 }}
      whileTap={props.disabled ? undefined : { scale: 0.96, y: 0 }}
      transition={spring}
      {...props}
    >
      {children}
    </motion.button>
  );
}

/** Animates a number from 0 (or its previous value) to `value`. */
export function CountUp({ value, format = (v) => Math.round(v).toString(), duration = 0.9, delay = 0 }) {
  const mv = useMotionValue(0);
  const text = useTransform(mv, format);
  useEffect(() => {
    const controls = animate(mv, value, { duration, delay, ease });
    return () => controls.stop();
  }, [value, duration, delay, mv]);
  return <motion.span>{text}</motion.span>;
}
