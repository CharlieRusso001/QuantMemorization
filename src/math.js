// ---------- Factorials ----------

export function factorial(n) {
  let r = 1n;
  for (let i = 2n; i <= BigInt(n); i++) r *= i;
  return r;
}

export function checkFactorial(n, input) {
  const cleaned = input.replace(/[,\s_]/g, '');
  if (!/^\d+$/.test(cleaned)) return false;
  return BigInt(cleaned) === factorial(n);
}

// ---------- Fractions ----------

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}

export function frac(num, den = 1) {
  const g = gcd(num, den) || 1;
  return { num: num / g, den: den / g };
}

export function fracToString({ num, den }) {
  return den === 1 ? `${num}` : `${num}/${den}`;
}

const fracValue = ({ num, den }) => num / den;

// Accepts "5/36", "0.1389", "13.89%", "3.5", "1 - 25/36" is NOT supported (keep it simple).
export function parseAnswer(input) {
  const s = input.trim().replace(/\s+/g, '');
  if (!s) return null;
  let m = s.match(/^(-?\d+)\/(\d+)$/);
  if (m) {
    const d = Number(m[2]);
    return d === 0 ? null : Number(m[1]) / d;
  }
  m = s.match(/^(-?\d*\.?\d+)%$/);
  if (m) return Number(m[1]) / 100;
  m = s.match(/^-?\d*\.?\d+$/);
  if (m) return Number(s);
  return null;
}

// Exact fraction match always passes; decimals must be within 0.001.
export function checkDiceAnswer(answer, input) {
  const v = parseAnswer(input);
  if (v === null) return false;
  return Math.abs(v - fracValue(answer)) < 0.001 + 1e-12;
}

// ---------- Dice problems ----------

const rand = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Number of ways two dice sum to s
const waysToSum = (s) => (s < 2 || s > 12 ? 0 : 6 - Math.abs(s - 7));


const GENERATORS = [
  // Single die exact value
  () => {
    const k = rand(1, 6);
    return {
      q: `You roll one fair six-sided die. What is the probability it shows a ${k}?`,
      a: frac(1, 6),
      why: `One favorable outcome out of 6.`,
    };
  },
  // Single die at least k
  () => {
    const k = rand(2, 6);
    return {
      q: `You roll one fair die. What is the probability the result is at least ${k}?`,
      a: frac(7 - k, 6),
      why: `Outcomes ${k} through 6: that's ${7 - k} of 6.`,
    };
  },
  // Two dice exact sum
  () => {
    const s = rand(2, 12);
    const w = waysToSum(s);
    return {
      q: `You roll two fair dice. What is the probability their sum is ${s}?`,
      a: frac(w, 36),
      why: `There are ${w} ordered pairs summing to ${s}, out of 36.`,
    };
  },
  // Two dice sum at least / at most
  () => {
    const atLeast = Math.random() < 0.5;
    const s = rand(3, 11);
    let w = 0;
    for (let t = 2; t <= 12; t++) if (atLeast ? t >= s : t <= s) w += waysToSum(t);
    return {
      q: `You roll two fair dice. What is the probability the sum is ${atLeast ? 'at least' : 'at most'} ${s}?`,
      a: frac(w, 36),
      why: `Count pairs with sum ${atLeast ? '≥' : '≤'} ${s}: ${w} of 36.`,
    };
  },
  // Doubles
  () => ({
    q: `You roll two fair dice. What is the probability of rolling doubles?`,
    a: frac(6, 36),
    why: `6 doubles (1-1 … 6-6) out of 36 outcomes.`,
  }),
  // First die strictly greater
  () => ({
    q: `You roll two fair dice. What is the probability the first die is strictly greater than the second?`,
    a: frac(15, 36),
    why: `6 of 36 are ties; the other 30 split evenly, so 15/36.`,
  }),
  // Expected value of sum of n dice
  () => {
    const n = rand(1, 5);
    const ev = n * 7; // 3.5n = 7n/2
    return {
      q:
        n === 1
          ? `What is the expected value of a single roll of a fair die?`
          : `You roll ${n} fair dice. What is the expected value of their sum?`,
      a: frac(ev, 2),
      why: `Each die has mean 3.5; by linearity the sum has mean ${n} × 3.5 = ${(n * 3.5).toString()}.`,
    };
  },
  // Variance of one die / sum of n dice
  () => {
    const n = rand(1, 3);
    return {
      q:
        n === 1
          ? `What is the variance of a single roll of a fair die?`
          : `You roll ${n} independent fair dice. What is the variance of their sum?`,
      a: frac(35 * n, 12),
      why: `Var(one die) = E[X²] − E[X]² = 91/6 − 49/4 = 35/12.${n > 1 ? ` Independent, so multiply by ${n}.` : ''}`,
    };
  },
  // At least one six in n rolls
  () => {
    const n = rand(2, 4);
    const den = 6 ** n;
    return {
      q: `You roll a fair die ${n} times. What is the probability of getting at least one 6?`,
      a: frac(den - 5 ** n, den),
      why: `Complement: 1 − (5/6)^${n} = 1 − ${5 ** n}/${den}.`,
    };
  },
  // All dice even
  () => {
    const n = rand(2, 4);
    return {
      q: `You roll ${n} fair dice. What is the probability that every die shows an even number?`,
      a: frac(1, 2 ** n),
      why: `Each die is even with probability 1/2, independently: (1/2)^${n}.`,
    };
  },
  // Max of two dice equals k
  () => {
    const k = rand(1, 6);
    return {
      q: `You roll two fair dice. What is the probability the larger of the two is exactly ${k}?`,
      a: frac(2 * k - 1, 36),
      why: `P(max ≤ ${k}) − P(max ≤ ${k - 1}) = (${k * k} − ${(k - 1) * (k - 1)})/36 = ${2 * k - 1}/36.`,
    };
  },
  // Min of two dice equals k
  () => {
    const k = rand(1, 6);
    return {
      q: `You roll two fair dice. What is the probability the smaller of the two is exactly ${k}?`,
      a: frac(13 - 2 * k, 36),
      why: `P(min ≥ ${k}) − P(min ≥ ${k + 1}) = (${(7 - k) ** 2} − ${(6 - k) ** 2})/36 = ${13 - 2 * k}/36.`,
    };
  },
  // Product even
  () => ({
    q: `You roll two fair dice. What is the probability their product is even?`,
    a: frac(27, 36),
    why: `Product is odd only if both are odd: (1/2)(1/2) = 1/4. So 1 − 1/4 = 3/4.`,
  }),
  // Sum odd
  () => ({
    q: `You roll two fair dice. What is the probability their sum is odd?`,
    a: frac(1, 2),
    why: `Sum is odd when exactly one die is odd: 2 × (1/2)(1/2) = 1/2.`,
  }),
  // Expected rolls until a specific face
  () => {
    const k = rand(1, 6);
    return {
      q: `You roll a fair die repeatedly until you see a ${k}. What is the expected number of rolls?`,
      a: frac(6, 1),
      why: `Geometric with p = 1/6, so E = 1/p = 6.`,
    };
  },
  // Exactly one six in n rolls
  () => {
    const n = rand(2, 3);
    const den = 6 ** n;
    return {
      q: `You roll a fair die ${n} times. What is the probability of getting exactly one 6?`,
      a: frac(n * 5 ** (n - 1), den),
      why: `C(${n},1) × (1/6) × (5/6)^${n - 1} = ${n * 5 ** (n - 1)}/${den}.`,
    };
  },
  // All different on n dice
  () => {
    const n = rand(2, 3);
    let num = 1;
    for (let i = 0; i < n; i++) num *= 6 - i;
    return {
      q: `You roll ${n} fair dice. What is the probability all ${n} show different numbers?`,
      a: frac(num, 6 ** n),
      why: `${Array.from({ length: n }, (_, i) => 6 - i).join(' × ')} / 6^${n} = ${num}/${6 ** n}.`,
    };
  },
];

export function randomDiceProblem() {
  const p = pick(GENERATORS)();
  const approx = p.a.den === 1 ? "" : ` ≈ ${+(p.a.num / p.a.den).toFixed(4)}`;
  return { ...p, answerText: fracToString(p.a) + approx };
}

// ---------- Quiz builders ----------

export const FACTORIAL_LIMIT = 25;

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Cycles through shuffled copies of [min..max] so values are spread evenly
// and the same n never appears twice in a row.
export function buildFactorialQuiz({ count, min, max }) {
  const range = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const ns = [];
  while (ns.length < count) {
    let batch = shuffle(range);
    if (range.length > 1 && batch[0] === ns[ns.length - 1]) batch.push(batch.shift());
    ns.push(...batch);
  }
  return ns.slice(0, count).map((n) => ({
    prompt: `${n}! = ?`,
    answerText: factorial(n).toLocaleString('en-US'),
    check: (input) => checkFactorial(n, input),
  }));
}

// Avoids repeating an identical question within the quiz when possible.
export function buildDiceQuiz({ count }) {
  const seen = new Set();
  const out = [];
  let attempts = 0;
  while (out.length < count) {
    const p = randomDiceProblem();
    if (seen.has(p.q) && attempts++ < 200) continue;
    seen.add(p.q);
    out.push({
      prompt: p.q,
      answerText: p.answerText,
      why: p.why,
      check: (input) => checkDiceAnswer(p.a, input),
    });
  }
  return out;
}

// ---------- Arithmetic ----------

export const ARITH_OPS = ['+', '−', '×', '÷'];
export const ARITH_LIMIT = 9999;

export function checkInteger(expected, input) {
  const cleaned = input.replace(/[,\s_]/g, '').replace(/^−/, '-');
  if (!/^-?\d+$/.test(cleaned)) return false;
  return Number(cleaned) === expected;
}

function arithmeticProblem(ops, min, max) {
  const op = pick(ops);
  let a = rand(min, max);
  let b = rand(min, max);
  let prompt, answer;
  switch (op) {
    case '+':
      prompt = `${a} + ${b}`;
      answer = a + b;
      break;
    case '−':
      if (b > a) [a, b] = [b, a];
      prompt = `${a} − ${b}`;
      answer = a - b;
      break;
    case '×':
      prompt = `${a} × ${b}`;
      answer = a * b;
      break;
    case '÷': {
      // divisor never 0; dividend is a multiple of the divisor so the answer is whole
      const divisor = rand(Math.max(min, 1), Math.max(max, 1));
      prompt = `${divisor * a} ÷ ${divisor}`;
      answer = a;
      break;
    }
  }
  return { prompt: `${prompt} = ?`, answer };
}

export function buildArithmeticQuiz({ count, ops, min, max }) {
  const out = [];
  let last = '';
  while (out.length < count) {
    const p = arithmeticProblem(ops, min, max);
    if (p.prompt === last && max > min) continue;
    last = p.prompt;
    out.push({
      prompt: p.prompt,
      answerText: p.answer.toLocaleString('en-US'),
      check: (input) => checkInteger(p.answer, input),
    });
  }
  return out;
}
