import TimeChart from './TimeChart.jsx';

export const formatTime = (s) => (s < 60 ? `${s.toFixed(1)}s` : `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`);

export default function Results({ outcome, history, onRetry, onSettings, onHome }) {
  const { answers, total, endedEarly } = outcome;
  const correct = answers.filter((a) => a.correct).length;
  const pct = Math.round((100 * correct) / answers.length);
  const times = answers.map((a) => a.seconds);
  const totalSec = times.reduce((s, t) => s + t, 0);
  const avg = totalSec / answers.length;
  const correctTimes = answers.filter((a) => a.correct).map((a) => a.seconds);
  const avgCorrect = correctTimes.length ? correctTimes.reduce((s, t) => s + t, 0) / correctTimes.length : null;
  const fastest = Math.min(...times);
  const slowest = Math.max(...times);
  const slowestIdx = times.indexOf(slowest);

  return (
    <section className="card">
      <h2>Results</h2>
      {endedEarly && (
        <p className="hint" style={{ marginTop: -8, marginBottom: 16 }}>
          Ended early: {answers.length} of {total} answered.
        </p>
      )}

      <div className="summary">
        <div>
          <div className="num">{formatTime(avg)}</div>
          <div className="cap">Avg / problem</div>
        </div>
        <div>
          <div className="num">{formatTime(totalSec)}</div>
          <div className="cap">Total time</div>
        </div>
        <div>
          <div className="num">
            {correct}/{answers.length}
          </div>
          <div className="cap">Correct ({pct}%)</div>
        </div>
      </div>

      <div className="minor-stats">
        <span>
          Fastest <b>{formatTime(fastest)}</b>
        </span>
        <span>
          Slowest <b>{formatTime(slowest)}</b> (#{slowestIdx + 1})
        </span>
        {avgCorrect !== null && (
          <span>
            Avg when correct <b>{formatTime(avgCorrect)}</b>
          </span>
        )}
      </div>

      <h3>Average time per problem, by exam</h3>
      <TimeChart exams={history} highlightLast />

      <h3>Review</h3>
      <ul className="review">
        {answers.map((a, i) => (
          <li key={i} className={a.correct ? '' : 'wrong'}>
            <div className="q">
              <span className="mark">{a.correct ? '✓' : '✗'}</span>
              {i + 1}. {a.prompt}
              <span className="qtime">{a.seconds.toFixed(1)}s</span>
            </div>
            <div className="detail">
              Your answer: <b>{a.given}</b>
              {!a.correct && (
                <>
                  {' '}· Correct: <b>{a.answerText}</b>
                </>
              )}
            </div>
            {!a.correct && a.why && <div className="why">{a.why}</div>}
          </li>
        ))}
      </ul>

      <div className="actions">
        <button className="btn secondary" onClick={onHome}>
          Home
        </button>
        <button className="btn secondary" onClick={onSettings}>
          Change settings
        </button>
        <button className="btn" onClick={onRetry}>
          New quiz
        </button>
      </div>
    </section>
  );
}
