// RankBadge — displays a score chip with color intensity based on score value
// Green: 70-100, Amber: 40-69, Red: 0-39

export default function RankBadge({ score, size = 'md', showLabel = true }) {
  const getColor = (s) => {
    if (s >= 70) return {
      bg: 'bg-success/15',
      text: 'text-success',
      border: 'border-success/30',
      dot: 'bg-success',
    };
    if (s >= 40) return {
      bg: 'bg-warning/15',
      text: 'text-warning',
      border: 'border-warning/30',
      dot: 'bg-warning',
    };
    return {
      bg: 'bg-danger/15',
      text: 'text-danger',
      border: 'border-danger/30',
      dot: 'bg-danger',
    };
  };

  const colors = getColor(score);

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3 py-1.5 gap-2',
  };

  const dotSize = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full border font-semibold
        ${colors.bg} ${colors.text} ${colors.border} ${sizeStyles[size]}
      `}
    >
      <span className={`rounded-full flex-shrink-0 ${colors.dot} ${dotSize[size]}`} />
      <span className="tabular-nums">{score}</span>
      {showLabel && (
        <span className="opacity-60 font-normal">/100</span>
      )}
    </span>
  );
}
