import { useEffect, useRef, useState } from 'react';

const HINTS = {
  factorial: 'Commas are optional.',
  arithmetic: 'Whole numbers only. Commas are optional.',
  dice: (
    <>
      Fraction (<code>5/36</code>), decimal (<code>0.139</code>, ±0.001) or percent (<code>13.9%</code>).
    </>
  ),
};

export default function Quiz({ mode, questions, feedback, onFinish, onDiscard }) {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [answers, setAnswers] = useState([]);
  const [checked, setChecked] = useState(null); // the answered record while showing feedback
  const [confirmQuit, setConfirmQuit] = useState(false);
  const questionStart = useRef(performance.now());
  const inputRef = useRef(null);

  useEffect(() => {
    if (!confirmQuit) inputRef.current?.focus();
  }, [index, checked, confirmQuit]);

  const q = questions[index];
  const isLast = index + 1 === questions.length;

  const finish = (list, endedEarly) => onFinish({ answers: list, total: questions.length, endedEarly });

  const advance = (list) => {
    if (isLast) return finish(list, false);
    setIndex(index + 1);
    setInput('');
    setChecked(null);
    questionStart.current = performance.now();
  };

  const submit = (e) => {
    e.preventDefault();
    if (confirmQuit) return;
    if (checked) return advance(answers);
    if (!input.trim()) return;

    const seconds = (performance.now() - questionStart.current) / 1000;
    const record = { ...q, given: input.trim(), correct: q.check(input), seconds };
    const list = [...answers, record];
    setAnswers(list);
    if (feedback) setChecked(record);
    else advance(list);
  };

  const big = mode !== 'dice';

  return (
    <section className="card">
      <div className="progress-text">
        <span>
          Question {index + 1} of {questions.length}
        </span>
        {!confirmQuit && (
          <button type="button" className="link" onClick={() => setConfirmQuit(true)}>
            Quit
          </button>
        )}
      </div>
      <div className="progress">
        <div style={{ width: `${((index + (checked ? 1 : 0)) / questions.length) * 100}%` }} />
      </div>

      {confirmQuit ? (
        <div className="quit-box">
          <p>
            End the exam now? You've answered {answers.length} of {questions.length}.
          </p>
          <div className="actions">
            <button type="button" className="btn secondary" onClick={() => setConfirmQuit(false)}>
              Keep going
            </button>
            <button type="button" className="btn secondary" onClick={onDiscard}>
              Discard exam
            </button>
            <button type="button" className="btn" disabled={answers.length === 0} onClick={() => finish(answers, true)}>
              See results so far
            </button>
          </div>
        </div>
      ) : (
        <>
          {big ? <div className="big">{q.prompt}</div> : <div className="question">{q.prompt}</div>}

          <form onSubmit={submit} className="answer">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'dice' ? 'e.g. 1/6' : 'Type the answer'}
              inputMode={mode === 'dice' ? 'text' : 'numeric'}
              readOnly={!!checked}
              autoComplete="off"
              spellCheck={false}
            />
            <button type="submit" className="btn">
              {checked ? (isLast ? 'See results' : 'Next') : feedback ? 'Check' : isLast ? 'Finish' : 'Next'}
            </button>
          </form>

          <div aria-live="polite">
          {checked && (
            <div className={`feedback ${checked.correct ? "correct" : "wrong"}`}>
              <b>{checked.correct ? '✓ Correct' : '✗ Wrong'}</b>
              {!checked.correct && <> · Answer: <b>{checked.answerText}</b></>}
              <span className="time"> · {checked.seconds.toFixed(1)}s</span>
              {!checked.correct && checked.why && <div className="why">{checked.why}</div>}
            </div>
          )}
          </div>

          <p className="hint">{HINTS[mode]} Press Enter to {checked ? 'continue' : 'submit'}.</p>
        </>
      )}
    </section>
  );
}
