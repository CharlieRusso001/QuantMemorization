import { motion } from 'motion/react';

export function FactorialIcon() {
  return (
    <svg viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="68" height="68" stroke="#27272a" strokeWidth="3" fill="#f4f4f5" />
      <text
        x="36"
        y="47"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontStyle="italic"
        fontSize="34"
        fontWeight="700"
        fill="#27272a"
      >
        n!
      </text>
    </svg>
  );
}

export function DiceIcon() {
  const pip = (cx, cy) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4.5" fill="#27272a" />;
  return (
    <svg viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="68" height="68" stroke="#27272a" strokeWidth="3" fill="#f4f4f5" />
      {[pip(20, 20), pip(52, 20), pip(36, 36), pip(20, 52), pip(52, 52)]}
    </svg>
  );
}

// On hover (the parent tile sends the "hover" variant), each symbol hops
// clockwise into the next quadrant, one after another, with a little pop.
// "animate" is the resting state, so leaving the tile sends them home.
const GLYPHS = [
  { s: '+', x: 22, y: 30, dx: 28, dy: 0 }, // top-left → top-right
  { s: '−', x: 50, y: 30, dx: 0, dy: 28 }, // top-right → bottom-right
  { s: '÷', x: 50, y: 58, dx: -28, dy: 0 }, // bottom-right → bottom-left
  { s: '×', x: 22, y: 58, dx: 0, dy: -28 }, // bottom-left → top-left
];
const hop = { type: 'spring', stiffness: 380, damping: 22, mass: 0.7 };

export function ArithmeticIcon() {
  return (
    <svg viewBox="0 0 72 72" fill="none" aria-hidden="true" style={{ overflow: 'visible' }}>
      <rect x="2" y="2" width="68" height="68" stroke="#27272a" strokeWidth="3" fill="#f4f4f5" />
      <motion.g
        variants={{
          animate: { scale: 1, opacity: 1, transition: hop },
          hover: { scale: [1, 0.5, 1], opacity: [1, 0.3, 1], transition: { duration: 0.5, ease: 'easeInOut' } },
        }}
        style={{ originX: '36px', originY: '36px' }}
      >
        <line x1="36" y1="10" x2="36" y2="62" stroke="#a1a1aa" strokeWidth="1.5" />
        <line x1="10" y1="36" x2="62" y2="36" stroke="#a1a1aa" strokeWidth="1.5" />
      </motion.g>
      {GLYPHS.map(({ s, x, y, dx, dy }, i) => (
        <motion.text
          key={s}
          x={x}
          y={y}
          textAnchor="middle"
          fontSize="24"
          fontWeight="700"
          fill="#27272a"
          fontFamily="system-ui, sans-serif"
          variants={{
            animate: { x: 0, y: 0, scale: 1, transition: { ...hop, delay: (3 - i) * 0.04 } },
            hover: {
              x: dx,
              y: dy,
              scale: [1, 1.45, 1],
              transition: {
                x: { ...hop, delay: i * 0.07 },
                y: { ...hop, delay: i * 0.07 },
                scale: { duration: 0.38, delay: i * 0.07, ease: 'easeOut' },
              },
            },
          }}
        >
          {s}
        </motion.text>
      ))}
    </svg>
  );
}
