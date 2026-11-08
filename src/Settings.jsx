import { useState } from 'react';
import { FACTORIAL_LIMIT, ARITH_OPS, ARITH_LIMIT } from './math.js';

const DEFAULTS = {
  factorial: { count: 10, min: 0, max: 10, feedback: false },
  dice: { count: 10, feedback: false },
  arithmetic: { count: 20, min: 2, max: 12, ops: ['×', '÷'], feedback: false },
};

const toNum = (v) => (v === '' ? NaN : Number(v));
const show = (n) => (Number.isNaN(n) ? '' : n);

export default function Settings({ mode, title, initial, onStart, onBack }) {
  const [s, setS] = useState(() => ({ ...DEFAULTS[mode], ...(initial || {}) }));
  const set = (patch) => setS((prev) => ({ ...prev, ...patch }));

  const hasRange = mode === 'factorial' || mode === 'arithmetic';
  const limit = mode === 'factorial' ? FACTORIAL_LIMIT : ARITH_LIMIT;

  let error = '';
  if (!Number.isInteger(s.count) || s.count < 1 || s.count > 200) error = 'Number of problems must be a whole number from 1 to 200.';
  else if (hasRange) {
    if (!Number.isInteger(s.min) || !Number.isInteger(s.max)) error = 'Min and max must be whole numbers.';
    else if (s.min < 0 || s.max > limit) error = `Values must be between 0 and ${limit}.`;
    else if (s.min > s.max) error = 'Minimum cannot be greater than maximum.';
    else if (mode === 'arithmetic' && s.ops.length === 0) error = 'Pick at least one operation.';
  }

  const submit = (e) => {
    e.preventDefault();
    if (!error) onStart(s);
  };

  const toggleOp = (op) =>
    set({ ops: s.ops.includes(op) ? s.ops.filter((o) => o !== op) : ARITH_OPS.filter((o) => o === op || s.ops.includes(o)) });

  return (
    <form className="card" onSubmit={submit}>
      <h2>{title}: settings</h2>

      <div className="field">
        <label htmlFor="count">Number of problems</label>
        <input id="count" type="number" min={1} max={200} value={show(s.count)} onChange={(e) => set({ count: toNum(e.target.value) })} />
      </div>

      {mode === 'arithmetic' && (
        <div className="field">
          <label>Operations</label>
          <div className="presets">
            {ARITH_OPS.map((op) => (
              <button type="button" key={op} className={s.ops.includes(op) ? 'active' : ''} onClick={() => toggleOp(op)} aria-pressed={s.ops.includes(op)}>
                {op}
              </button>
            ))}
          </div>
        </div>
      )}

      {hasRange && (
        <div className="row">
          <div className="field">
            <label htmlFor="min">{mode === 'factorial' ? 'Minimum n' : 'Smallest number'}</label>
            <input id="min" type="number" min={0} max={limit} value={show(s.min)} onChange={(e) => set({ min: toNum(e.target.value) })} />
          </div>
          <div className="field">
            <label htmlFor="max">{mode === 'factorial' ? 'Maximum n' : 'Largest number'}</label>
            <input id="max" type="number" min={0} max={limit} value={show(s.max)} onChange={(e) => set({ max: toNum(e.target.value) })} />
          </div>
        </div>
      )}
      {mode === 'arithmetic' && (
        <p className="hint field-hint">For ÷, the answer and the divisor both fall in this range, so every answer is a whole number.</p>
      )}

      <label className="check">
        <input type="checkbox" checked={s.feedback} onChange={(e) => set({ feedback: e.target.checked })} />
        Show whether each answer is right before moving on
      </label>

      {error && <p className="error">{error}</p>}

      <div className="actions">
        <button type="button" className="btn secondary" onClick={onBack}>
          Back
        </button>
        <button type="submit" className="btn" disabled={!!error}>
          Start quiz
        </button>
      </div>
    </form>
  );
}
