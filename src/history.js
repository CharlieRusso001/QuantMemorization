// Exam history kept in this browser's localStorage. Every access is guarded so
// the app still works in private windows or when storage is blocked.
const KEY = 'quant-memorization-history-v1';
const MAX_ENTRIES = 500;

export function loadHistory() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addExam(entry) {
  const next = [...loadHistory(), entry].slice(-MAX_ENTRIES);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable: history just won't persist */
  }
  return next;
}

export function clearHistory() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
