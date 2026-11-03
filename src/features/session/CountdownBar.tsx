import React from 'react';
import { useSessionStore } from './useSessionStore';
import { formatDuration } from '../../utils/format';

export const CountdownBar: React.FC = React.memo(function CountdownBar() {
  const elapsed = useSessionStore((s) => s.elapsed);
  const duration = useSessionStore((s) =>
    s.currentIndex >= 0 && s.currentIndex < s.queue.length
      ? s.queue[s.currentIndex].duration
      : 0
  );

  const remaining = Math.max(0, duration - elapsed);
  const percentage = duration > 0 ? Math.min(100, Math.round((elapsed / duration) * 100)) : 0;

  return (
    <div className="countdown-bar-wrapper">
      <span className="countdown-remaining">
        Còn lại: {formatDuration(remaining)}
      </span>
      <div
        className="countdown-progress-track"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="countdown-progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
});

export default CountdownBar;

