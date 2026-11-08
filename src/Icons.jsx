export function FactorialIcon() {
  return (
    <svg viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="68" height="68" stroke="#27272a" strokeWidth="3" fill="#f4f4f5" />
      <text
        x="36"
        y="47"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontStyle="italic"
        fontSize="34"
        fontWeight="700"
        fill="#27272a"
      >
        n!
      </text>
    </svg>
  );
}

export function DiceIcon() {
  const pip = (cx, cy) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4.5" fill="#27272a" />;
  return (
    <svg viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="68" height="68" stroke="#27272a" strokeWidth="3" fill="#f4f4f5" />
      {[pip(20, 20), pip(52, 20), pip(36, 36), pip(20, 52), pip(52, 52)]}
    </svg>
  );
}

export function ArithmeticIcon() {
  const t = (x, y, s) => (
    <text x={x} y={y} textAnchor="middle" fontSize="24" fontWeight="700" fill="#27272a" fontFamily="system-ui, sans-serif">
      {s}
    </text>
  );
  return (
    <svg viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="68" height="68" stroke="#27272a" strokeWidth="3" fill="#f4f4f5" />
      <line x1="36" y1="10" x2="36" y2="62" stroke="#a1a1aa" strokeWidth="1.5" />
      <line x1="10" y1="36" x2="62" y2="36" stroke="#a1a1aa" strokeWidth="1.5" />
      {t(22, 30, '+')}
      {t(50, 30, '−')}
      {t(22, 58, '×')}
      {t(50, 58, '÷')}
    </svg>
  );
}
