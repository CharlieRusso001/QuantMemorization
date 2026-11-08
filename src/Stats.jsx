import { useState } from 'react';
import TimeChart from './TimeChart.jsx';
import { formatTime } from './Results.jsx';

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
    <section className="card">
      <h2>Stats</h2>
      <div className="presets tabs-row">
        {Object.entries(modes).map(([key, m]) => (
          <button key={key} type="button" className={mode === key ? 'active' : ''} onClick={() => setMode(key)}>
            {m.title}
          </button>
        ))}
      </div>

      {exams.length > 0 && (
        <div className="summary">
          <div>
            <div className="num">{formatTime(totalSec / answered)}</div>
            <div className="cap">All-time avg / problem</div>
          </div>
          <div>
            <div className="num">{formatTime(recentAvg)}</div>
            <div className="cap">Last {recent.length} exams</div>
          </div>
          <div>
            <div className="num">{exams.length}</div>
            <div className="cap">
              Exams · {Math.round((100 * correct) / answered)}% correct
            </div>
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

      {history.length > 0 && (
        <div className="actions">
          {confirmClear ? (
            <>
              <span className="hint" style={{ margin: 'auto 8px auto 0' }}>
                Delete all saved exams? This can't be undone.
              </span>
              <button className="btn secondary" onClick={() => setConfirmClear(false)}>
                Cancel
              </button>
              <button
                className="btn"
                onClick={() => {
                  onClear();
                  setConfirmClear(false);
                }}
              >
                Delete
              </button>
            </>
          ) : (
            <button className="btn secondary" onClick={() => setConfirmClear(true)}>
              Clear history
            </button>
          )}
        </div>
      )}
    </section>
  );
}
