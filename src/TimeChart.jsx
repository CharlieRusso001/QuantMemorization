import { useEffect, useRef, useState } from 'react';

const HEIGHT = 220;
const PAD = { top: 16, right: 16, bottom: 32, left: 44 };

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

  return (
    <div className="chart" ref={wrapRef}>
      <svg width={width} height={HEIGHT} role="img" aria-label="Average seconds per problem for each exam">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} className="grid" />
            <text x={PAD.left - 8} y={y(t) + 4} textAnchor="end" className="axis">
              {t % 1 ? t.toFixed(1) : t}s
            </text>
          </g>
        ))}
        {exams.map((_, i) =>
          i % every === 0 || i === n - 1 ? (
            <text key={i} x={x(i)} y={HEIGHT - 10} textAnchor="middle" className="axis">
              #{i + 1}
            </text>
          ) : null
        )}

        {h && <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={PAD.top + innerH} className="crosshair" />}
        {n > 1 && <path d={path} className="line" />}
        {exams.map((e, i) => (
          <circle
            key={i}
            cx={x(i)}
            cy={y(e.avgSec)}
            r={hover === i || (highlightLast && i === n - 1) ? 5.5 : 4}
            className={highlightLast && i === n - 1 ? 'dot current' : 'dot'}
          />
        ))}

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

      {h && (
        <div
          className="tooltip"
          style={{
            left: Math.min(Math.max(x(hover), 90), width - 90),
            top: Math.max(y(h.avgSec) - 12, 0),
          }}
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
        </div>
      )}
    </div>
  );
}
