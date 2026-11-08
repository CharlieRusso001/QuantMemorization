import { motion } from 'motion/react';
import TimeChart from './TimeChart.jsx';
import { Button, CountUp, stagger, rise, ease } from './anim.jsx';

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

  // Keep long reviews snappy: total cascade never exceeds ~0.6s
  const each = Math.min(0.05, 0.6 / answers.length);

  return (
    <motion.section className="card" variants={stagger(0.08, 0.05)} initial="initial" animate="animate">
      <motion.h2 variants={rise}>Results</motion.h2>
      {endedEarly && (
        <motion.p className="hint" variants={rise} style={{ marginTop: -8, marginBottom: 16 }}>
          Ended early: {answers.length} of {total} answered.
        </motion.p>
      )}

      <motion.div className="summary" variants={stagger(0.1, 0)}>
        <motion.div variants={rise}>
          <div className="num">
            <CountUp value={avg} format={formatTime} delay={0.15} />
          </div>
          <div className="cap">Avg / problem</div>
        </motion.div>
        <motion.div variants={rise}>
          <div className="num">
            <CountUp value={totalSec} format={formatTime} delay={0.25} />
          </div>
          <div className="cap">Total time</div>
        </motion.div>
        <motion.div variants={rise}>
          <div className="num">
            <CountUp value={correct} delay={0.35} />/{answers.length}
          </div>
          <div className="cap">
            Correct (<CountUp value={pct} delay={0.35} />
            %)
          </div>
        </motion.div>
      </motion.div>

      <motion.div className="minor-stats" variants={rise}>
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
      </motion.div>

      <motion.h3 variants={rise}>Average time per problem, by exam</motion.h3>
      <motion.div variants={rise}>
        <TimeChart exams={history} highlightLast />
      </motion.div>

      <motion.h3 variants={rise}>Review</motion.h3>
      <motion.ul className="review" variants={stagger(each, 0)}>
        {answers.map((a, i) => (
          <motion.li
            key={i}
            className={a.correct ? '' : 'wrong'}
            variants={{
              initial: { opacity: 0, x: -12 },
              animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease } },
            }}
          >
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
          </motion.li>
        ))}
      </motion.ul>

      <motion.div className="actions" variants={rise}>
        <Button className="btn secondary" onClick={onHome}>
          Home
        </Button>
        <Button className="btn secondary" onClick={onSettings}>
          Change settings
        </Button>
        <Button onClick={onRetry}>New quiz →</Button>
      </motion.div>
    </motion.section>
  );
}
