import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useAnimate } from 'motion/react';
import { Button, ease, softSpring, spring } from './anim.jsx';

const HINTS = {
  factorial: 'Commas are optional.',
  arithmetic: 'Whole numbers only. Commas are optional.',
  dice: (
    <>
      Fraction (<code>5/36</code>), decimal (<code>0.139</code>, ±0.001) or percent (<code>13.9%</code>).
    </>
  ),
};

// The question text slides in from the right and leaves to the left
const questionMotion = {
  initial: { opacity: 0, x: 40, filter: 'blur(3px)' },
  animate: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.32, ease } },
  exit: { opacity: 0, x: -40, filter: 'blur(3px)', transition: { duration: 0.16, ease: 'easeIn' } },
};

export default function Quiz({ mode, questions, feedback, onFinish, onDiscard }) {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [answers, setAnswers] = useState([]);
  const [checked, setChecked] = useState(null); // the answered record while showing feedback
  const [confirmQuit, setConfirmQuit] = useState(false);
  const questionStart = useRef(performance.now());
  const inputRef = useRef(null);
  const [formScope, animateForm] = useAnimate();

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
    if (!input.trim()) {
      animateForm(formScope.current, { x: [0, -4, 4, 0] }, { duration: 0.25 });
      return;
    }

    const seconds = (performance.now() - questionStart.current) / 1000;
    const record = { ...q, given: input.trim(), correct: q.check(input), seconds };
    const list = [...answers, record];
    setAnswers(list);
    if (feedback) {
      setChecked(record);
      if (record.correct) animateForm(formScope.current, { scale: [1, 1.025, 1] }, { duration: 0.35, ease });
      else animateForm(formScope.current, { x: [0, -10, 9, -6, 4, -2, 0] }, { duration: 0.45, ease: 'easeOut' });
    } else {
      advance(list);
    }
  };

  const big = mode !== 'dice';
  const progress = (index + (checked ? 1 : 0)) / questions.length;

  return (
    <section className="card">
      <div className="progress-text">
        <span>
          Question{' '}
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.b
              key={index}
              className="qnum"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={spring}
            >
              {index + 1}
            </motion.b>
          </AnimatePresence>{' '}
          of {questions.length}
        </span>
        <AnimatePresence>
          {!confirmQuit && (
            <motion.button
              type="button"
              className="link"
              onClick={() => setConfirmQuit(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Quit
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <div className="progress">
        <motion.div initial={{ width: 0 }} animate={{ width: `${progress * 100}%` }} transition={softSpring} />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {confirmQuit ? (
          <motion.div
            key="quit"
            className="quit-box"
            initial={{ opacity: 0, scale: 0.97, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.28, ease } }}
            exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15 } }}
          >
            <p>
              End the exam now? You've answered {answers.length} of {questions.length}.
            </p>
            <div className="actions">
              <Button type="button" className="btn secondary" onClick={() => setConfirmQuit(false)}>
                Keep going
              </Button>
              <Button type="button" className="btn secondary" onClick={onDiscard}>
                Discard exam
              </Button>
              <Button type="button" disabled={answers.length === 0} onClick={() => finish(answers, true)}>
                See results so far
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="question"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.2 } }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
          >
            <div className="prompt-stage">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div key={index} className={big ? 'big' : 'question'} variants={questionMotion} initial="initial" animate="animate" exit="exit">
                  {q.prompt}
                </motion.div>
              </AnimatePresence>
            </div>

            <form onSubmit={submit} className="answer" ref={formScope}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'dice' ? 'e.g. 1/6' : 'Type the answer'}
                inputMode={mode === 'dice' ? 'text' : 'numeric'}
                readOnly={!!checked}
                autoComplete="off"
                spellCheck={false}
                className={checked ? (checked.correct ? 'is-correct' : 'is-wrong') : ''}
              />
              <Button type="submit">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={checked ? 'next' : 'check'}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.14 }}
                    style={{ display: 'inline-block' }}
                  >
                    {checked ? (isLast ? 'See results' : 'Next →') : feedback ? 'Check' : isLast ? 'Finish' : 'Next →'}
                  </motion.span>
                </AnimatePresence>
              </Button>
            </form>

            <div aria-live="polite">
              <AnimatePresence initial={false}>
                {checked && (
                  <motion.div
                    key={index}
                    className={`feedback ${checked.correct ? 'correct' : 'wrong'}`}
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 16, transition: { duration: 0.3, ease } }}
                    exit={{ opacity: 0, height: 0, marginTop: 0, transition: { duration: 0.15 } }}
                  >
                    <div className="feedback-inner">
                      <motion.b
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ ...spring, delay: 0.05 }}
                        style={{ display: 'inline-block' }}
                      >
                        {checked.correct ? '✓ Correct' : '✗ Wrong'}
                      </motion.b>
                      {!checked.correct && (
                        <>
                          {' '}
                          · Answer: <b>{checked.answerText}</b>
                        </>
                      )}
                      <span className="time"> · {checked.seconds.toFixed(1)}s</span>
                      {!checked.correct && checked.why && <div className="why">{checked.why}</div>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <p className="hint">
              {HINTS[mode]} Press Enter to {checked ? 'continue' : 'submit'}.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
