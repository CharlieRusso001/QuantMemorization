import { forwardRef, useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import Legal, { LEGAL_PAGES } from './Legal.jsx';
import { FactorialIcon, DiceIcon, ArithmeticIcon } from './Icons.jsx';
import Settings from './Settings.jsx';
import Quiz from './Quiz.jsx';
import Results from './Results.jsx';
import Stats from './Stats.jsx';
import { buildFactorialQuiz, buildDiceQuiz, buildArithmeticQuiz } from './math.js';
import { loadHistory, addExam, clearHistory } from './history.js';
import { page, stagger, rise, spring, ease } from './anim.jsx';

// Each icon gets its own little hover move
const ICON_HOVER = {
  arithmetic: {}, // the symbols animate themselves (see ArithmeticIcon)
  factorial: { rotate: -8, scale: 1.08, transition: spring },
  dice: { rotate: [0, -14, 10, 0], transition: { duration: 0.5, ease } },
};

const MODES = {
  arithmetic: { title: 'Arithmetic', Icon: ArithmeticIcon, sub: '+ − × ÷ drills', build: buildArithmeticQuiz },
  factorial: { title: 'Factorials', Icon: FactorialIcon, sub: 'Recall n! values', build: buildFactorialQuiz },
  dice: { title: 'Dice Probability', Icon: DiceIcon, sub: 'Common dice problems', build: buildDiceQuiz },
};

// forwardRef so AnimatePresence's popLayout can measure it while it exits
const NavLink = forwardRef(function NavLink({ children, onClick }, ref) {
  return (
    <motion.button
      ref={ref}
      className="link"
      onClick={onClick}
      layout
      initial={{ opacity: 0, x: 6 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 6 }}
      transition={{ duration: 0.25, ease }}
    >
      {children}
    </motion.button>
  );
});

export default function App() {
  // screen: 'home' | 'settings' | 'quiz' | 'results' | 'stats'
  const [screen, setScreen] = useState('home');
  const [mode, setMode] = useState(null);
  const [settingsByMode, setSettingsByMode] = useState({});
  const [questions, setQuestions] = useState([]);
  const [outcome, setOutcome] = useState(null);
  const [history, setHistory] = useState(loadHistory);
  const [quizKey, setQuizKey] = useState(0);
  const [route, setRoute] = useState(() => window.location.hash);

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const legal = LEGAL_PAGES[route] ? route : null;
  useEffect(() => {
    document.title = legal ? `${LEGAL_PAGES[legal].title} · Quant Memorization` : 'Quant Memorization';
  }, [legal]);

  // Leaving a legal page goes back to the app without losing quiz state
  const leaveLegal = () => {
    if (legal) window.history.pushState(null, '', window.location.pathname);
    setRoute('');
  };

  const settings = settingsByMode[mode];

  const start = (s) => {
    setSettingsByMode((prev) => ({ ...prev, [mode]: s }));
    setQuestions(MODES[mode].build(s));
    setQuizKey((k) => k + 1);
    setScreen('quiz');
  };

  const finish = (o) => {
    const totalSec = o.answers.reduce((sum, a) => sum + a.seconds, 0);
    const entry = {
      mode,
      date: new Date().toISOString(),
      answered: o.answers.length,
      total: o.total,
      correct: o.answers.filter((a) => a.correct).length,
      totalSec,
      avgSec: totalSec / o.answers.length,
    };
    setHistory(addExam(entry));
    setOutcome(o);
    setScreen('results');
  };

  const home = () => {
    leaveLegal();
    setScreen('home');
    setMode(null);
  };

  const viewKey = legal || (screen === 'quiz' ? `quiz-${quizKey}` : screen);

  // Start each new screen at the top
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [viewKey]);

  let view = null;
  if (legal) view = <Legal route={legal} />;
  else if (screen === 'home')
    view = (
      <motion.div className="picker" variants={stagger(0.08, 0.05)} initial="initial" animate="animate">
        {Object.entries(MODES).map(([key, { title, Icon, sub }]) => (
          <motion.button
            key={key}
            className="mode"
            variants={{ ...rise, hover: { y: -5, boxShadow: '0 12px 28px -14px rgba(24,24,27,0.4)', transition: spring } }}
            whileHover="hover"
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setMode(key);
              setScreen('settings');
            }}
          >
            <motion.div className="icon" variants={{ animate: { rotate: 0, scale: 1, transition: spring }, hover: ICON_HOVER[key] }}>
              <Icon />
            </motion.div>
            <span className="label">{title}</span>
            <span className="sub">{sub}</span>
          </motion.button>
        ))}
      </motion.div>
    );
  else if (screen === 'settings')
    view = <Settings key={mode} mode={mode} title={MODES[mode].title} initial={settings} onStart={start} onBack={home} />;
  else if (screen === 'quiz')
    view = (
      <Quiz mode={mode} questions={questions} feedback={settings.feedback} onFinish={finish} onDiscard={() => setScreen('settings')} />
    );
  else if (screen === 'results')
    view = (
      <Results
        outcome={outcome}
        history={history.filter((e) => e.mode === mode)}
        onRetry={() => start(settings)}
        onSettings={() => setScreen('settings')}
        onHome={home}
      />
    );
  else if (screen === 'stats')
    view = (
      <Stats
        modes={MODES}
        history={history}
        onClear={() => {
          clearHistory();
          setHistory([]);
        }}
      />
    );

  return (
    <MotionConfig reducedMotion="user">
      <main>
        <motion.header initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
          <h1 className="logo" onClick={home}>
            Quant Memorization
          </h1>
          <nav>
            <AnimatePresence initial={false} mode="popLayout">
              {(legal || screen !== 'stats') && (
                <NavLink
                  key="stats"
                  onClick={() => {
                    leaveLegal();
                    setScreen('stats');
                  }}
                >
                  Stats
                </NavLink>
              )}
              {(legal || screen !== 'home') && (
                <NavLink key="home" onClick={home}>
                  ← Home
                </NavLink>
              )}
            </AnimatePresence>
          </nav>
        </motion.header>

        <AnimatePresence mode="wait">
          <motion.div key={viewKey} variants={page} initial="initial" animate="animate" exit="exit">
            {view}
          </motion.div>
        </AnimatePresence>
      </main>

      <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}>
        <a href="#/privacy">Privacy Policy</a>
        <a href="#/terms">Terms of Service</a>
        <a href="#/accessibility">Accessibility</a>
        <a href="https://github.com/CharlieRusso001/QuantMemorization" target="_blank" rel="noopener noreferrer" className="gh">
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            <path
              fill="currentColor"
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
            />
          </svg>
          GitHub
        </a>
        <a href="mailto:charlesrusso@uchicago.edu" className="gh">
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M1.75 3.25h12.5v9.5H1.75z M1.75 3.75 8 8.75l6.25-5" />
          </svg>
          charlesrusso@uchicago.edu
        </a>
      </motion.footer>
    </MotionConfig>
  );
}
