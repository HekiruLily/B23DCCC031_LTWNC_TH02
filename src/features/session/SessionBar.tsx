import { useEffect } from 'react';
import { useSessionStore } from './useSessionStore';
import CountdownBar from './CountdownBar';

export default function SessionBar() {
  const isRunning = useSessionStore((s) => s.isRunning);
  const queueLength = useSessionStore((s) => s.queue.length);
  const currentIndex = useSessionStore((s) => s.currentIndex);
  const currentExercise = useSessionStore((s) =>
    s.currentIndex >= 0 && s.currentIndex < s.queue.length
      ? s.queue[s.currentIndex]
      : null
  );

  const toggleRun = useSessionStore((s) => s.toggleRun);
  const prev = useSessionStore((s) => s.prev);
  const next = useSessionStore((s) => s.next);
  const tick = useSessionStore((s) => s.tick);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, tick]);

  const hasStarted = currentIndex >= 0 && currentExercise !== null;

  return (
    <footer className="session-bar-fixed" role="region" aria-label="Thanh đồng hồ buổi tập">
      <div className="session-bar-content">
        <div className="session-info">
          {hasStarted ? (
            <span className="session-current-exercise">
              Đang tập: {currentExercise.name} – HLV {currentExercise.trainer}
            </span>
          ) : (
            <span className="session-not-started">
              Chưa bắt đầu buổi tập
            </span>
          )}
        </div>

        {hasStarted && (
          <div className="session-countdown-wrapper">
            <CountdownBar />
          </div>
        )}

        <div className="session-controls">
          <button
            type="button"
            className="btn btn-secondary btn-control"
            onClick={prev}
            disabled={!hasStarted}
          >
            Trước
          </button>
          <button
            type="button"
            className="btn btn-primary btn-control"
            onClick={toggleRun}
            disabled={queueLength === 0}
          >
            {isRunning ? 'Tạm dừng' : 'Bắt đầu'}
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-control"
            onClick={next}
            disabled={!hasStarted}
          >
            Sau
          </button>
        </div>

        <div className="session-queue-count">
          Buổi tập: {queueLength} bài
        </div>
      </div>
    </footer>
  );
}

