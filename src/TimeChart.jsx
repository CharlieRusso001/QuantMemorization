import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ease, spring } from './anim.jsx';

const HEIGHT = 220;
const PAD = { top: 16, right: 16, bottom: 32, left: 44 };
const DRAW = 0.9; // seconds for the line to draw itself

function niceMax(v) {
  if (v <= 0) return 1;
  const exp = 10 ** Math.floor(Math.log10(v));
  const f = v / exp;
  const step = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
  return step * exp;
}

const fmtDate = (iso) =>
  new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

/** Line chart: average seconds per problem for each exam, oldest → newest. */
export default function TimeChart({ exams, highlightLast = false }) {
  const wrapRef = useRef(null);
  const [width, setWidth] = useState(600);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.max(260, entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (exams.length === 0) return <p className="hint">No exams yet. Finish one to start your chart.</p>;

  const innerW = width - PAD.left - PAD.right;
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const yMax = niceMax(Math.max(...exams.map((e) => e.avgSec)) * 1.1);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * yMax);
  const n = exams.length;
  const x = (i) => PAD.left + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const y = (v) => PAD.top + innerH - (v / yMax) * innerH;
  const path = exams.map((e, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(e.avgSec).toFixed(1)}`).join('');
  const area = `${path}L${x(n - 1).toFixed(1)},${y(0)}L${x(0).toFixed(1)},${y(0)}Z`;

  // Label roughly 6 x-axis ticks at most so they never collide
  const every = Math.max(1, Math.ceil(n / 6));

  const onMove = (evt) => {
    const rect = evt.currentTarget.getBoundingClientRect();
    const px = evt.clientX - rect.left;
    let best = 0;
    for (let i = 1; i < n; i++) if (Math.abs(x(i) - px) < Math.abs(x(best) - px)) best = i;
    setHover(best);
  };

  const h = hover !== null ? exams[hover] : null;
  // Redraw from scratch whenever the data set changes (new exam, other mode)
  const dataKey = `${n}-${exams[0]?.date}-${exams[n - 1]?.date}`;

  return (
    <div className="chart" ref={wrapRef}>
      <svg width={width} height={HEIGHT} role="img" aria-label="Average seconds per problem for each exam">
        {ticks.map((t, i) => (
          <motion.g key={t} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04, duration: 0.3 }}>
            <line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} className="grid" />
            <text x={PAD.left - 8} y={y(t) + 4} textAnchor="end" className="axis">
              {+t.toFixed(2)}s
            </text>
          </motion.g>
        ))}
        {exams.map((_, i) =>
          i % every === 0 || i === n - 1 ? (
            <text key={i} x={x(i)} y={HEIGHT - 10} textAnchor="middle" className="axis">
              #{i + 1}
            </text>
          ) : null
        )}

        <g key={dataKey}>
          {n > 1 && (
            <motion.path
              d={area}
              className="area"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: DRAW * 0.6, duration: 0.6 }}
            />
          )}
          {n > 1 && (
            <motion.path
              d={path}
              className="line"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: DRAW, ease }}
            />
          )}
          {exams.map((e, i) => {
            const current = highlightLast && i === n - 1;
            return (
              <motion.circle
                key={i}
                cx={x(i)}
                cy={y(e.avgSec)}
                className={current ? 'dot current' : 'dot'}
                initial={{ r: 0 }}
                animate={{ r: hover === i ? 6 : current ? 5.5 : 4 }}
                transition={{ ...spring, delay: hover === null ? (n === 1 ? 0.1 : (i / (n - 1)) * DRAW) : 0 }}
              />
            );
          })}
          {highlightLast && (
            <motion.circle
              cx={x(n - 1)}
              cy={y(exams[n - 1].avgSec)}
              className="pulse"
              initial={{ r: 5, opacity: 0 }}
              animate={{ r: [5, 16], opacity: [0.5, 0] }}
              transition={{ delay: DRAW + 0.1, duration: 1.4, repeat: 2, ease: 'easeOut' }}
            />
          )}
        </g>

        <AnimatePresence>
          {h && (
            <motion.line
              key="crosshair"
              y1={PAD.top}
              y2={PAD.top + innerH}
              className="crosshair"
              initial={{ opacity: 0, x1: x(hover), x2: x(hover) }}
              animate={{ opacity: 1, x1: x(hover), x2: x(hover) }}
              exit={{ opacity: 0 }}
              transition={spring}
            />
          )}
        </AnimatePresence>

        {/* hit area bigger than the marks */}
        <rect
          x={PAD.left - 10}
          y={0}
          width={innerW + 20}
          height={HEIGHT}
          fill="transparent"
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
        />
      </svg>

      <AnimatePresence>
        {h && (
          <motion.div
            key="tooltip"
            className="tooltip"
            style={{ x: '-50%', y: '-100%', originY: 1 }}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{
              opacity: 1,
              scale: 1,
              left: Math.min(Math.max(x(hover), 90), width - 90),
              top: Math.max(y(h.avgSec) - 12, 0),
            }}
            exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.12 } }}
            transition={spring}
          >
            <div className="tt-title">
              Exam #{hover + 1} · {fmtDate(h.date)}
            </div>
            <div>
              <b>{h.avgSec.toFixed(1)}s</b> per problem
            </div>
            <div>
              {h.correct}/{h.answered} correct · {Math.round(h.totalSec)}s total
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
