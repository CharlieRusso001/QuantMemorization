import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import TimeChart from './TimeChart.jsx';
import { formatTime } from './Results.jsx';
import { Button, CountUp, stagger, rise, spring, ease } from './anim.jsx';

export default function Stats({ modes, history, onClear }) {
  const [mode, setMode] = useState(Object.keys(modes)[0]);
  const [confirmClear, setConfirmClear] = useState(false);
  const exams = history.filter((e) => e.mode === mode);

  const answered = exams.reduce((s, e) => s + e.answered, 0);
  const correct = exams.reduce((s, e) => s + e.correct, 0);
  const totalSec = exams.reduce((s, e) => s + e.totalSec, 0);
  const recent = exams.slice(-5);
  const recentAvg = recent.length ? recent.reduce((s, e) => s + e.avgSec, 0) / recent.length : 0;

  return (
    <motion.section className="card" variants={stagger(0.07, 0.05)} initial="initial" animate="animate">
      <motion.h2 variants={rise}>Stats</motion.h2>
      <motion.div className="presets tabs-row" variants={rise} role="tablist">
        {Object.entries(modes).map(([key, m]) => (
          <motion.button
            key={key}
            type="button"
            role="tab"
            aria-selected={mode === key}
            className={`tab ${mode === key ? 'active' : ''}`}
            onClick={() => setMode(key)}
            whileTap={{ scale: 0.95 }}
          >
            {mode === key && <motion.span layoutId="tab-highlight" className="tab-highlight" transition={spring} />}
            <span className="tab-label">{m.title}</span>
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease } }}
          exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
        >
          {exams.length > 0 && (
            <div className="summary">
              <div>
                <div className="num">
                  <CountUp value={totalSec / answered} format={formatTime} />
                </div>
                <div className="cap">All-time avg / problem</div>
              </div>
              <div>
                <div className="num">
                  <CountUp value={recentAvg} format={formatTime} delay={0.08} />
                </div>
                <div className="cap">Last {recent.length} exams</div>
              </div>
              <div>
                <div className="num">
                  <CountUp value={exams.length} delay={0.16} />
                </div>
                <div className="cap">Exams · {Math.round((100 * correct) / answered)}% correct</div>
              </div>
            </div>
          )}

          <h3>Average time per problem, by exam</h3>
          <TimeChart exams={exams} />

          {exams.length > 0 && (
            <details className="table-view">
              <summary>Show as table</summary>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Avg / problem</th>
                    <th>Correct</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {exams.map((e, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{new Date(e.date).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</td>
                      <td>{e.avgSec.toFixed(1)}s</td>
                      <td>
                        {e.correct}/{e.answered}
                      </td>
                      <td>{formatTime(e.totalSec)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
          )}
        </motion.div>
      </AnimatePresence>

      {history.length > 0 && (
        <motion.div className="actions" variants={rise}>
          <AnimatePresence mode="wait" initial={false}>
            {confirmClear ? (
              <motion.div
                key="confirm"
                className="actions"
                style={{ margin: 0 }}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2, ease }}
              >
                <span className="hint" style={{ margin: 'auto 8px auto 0' }}>
                  Delete all saved exams? This can't be undone.
                </span>
                <Button className="btn secondary" onClick={() => setConfirmClear(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    onClear();
                    setConfirmClear(false);
                  }}
                >
                  Delete
                </Button>
              </motion.div>
            ) : (
              <motion.div key="clear" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <Button className="btn secondary" onClick={() => setConfirmClear(true)}>
                  Clear history
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.section>
  );
}
