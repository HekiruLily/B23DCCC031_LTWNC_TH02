import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRoutines, useRoutineDispatch } from './RoutineContext';
import { useSessionStore } from '../session/useSessionStore';
import { EXERCISES } from '../../data/exercises';
import type { Exercise } from '../../types';
import { formatDuration } from '../../utils/format';

export default function RoutineDetailPage() {
  const { id } = useParams<{ id: string }>();
  const routines = useRoutines();
  const dispatch = useRoutineDispatch();
  const startSession = useSessionStore((s) => s.startSession);

  const routine = routines.find((r) => r.id === id);

  const exerciseMap = useMemo(() => {
    const map = new Map<string, Exercise>();
    EXERCISES.forEach((ex) => map.set(ex.id, ex));
    return map;
  }, []);

  const routineExercises = useMemo(() => {
    if (!routine) return [];
    return routine.exerciseIds
      .map((exId) => exerciseMap.get(exId))
      .filter((ex): ex is Exercise => ex !== undefined);
  }, [routine, exerciseMap]);

  if (!routine) {
    return (
      <div className="routine-detail-page">
        <header className="page-header">
          <Link to="/routines" className="back-link">
            ← Quay lại danh sách giáo án
          </Link>
          <h1 className="page-title">Chi tiết giáo án</h1>
        </header>
        <div className="empty-state">
          <p className="not-found" role="alert">Không tìm thấy giáo án</p>
        </div>
      </div>
    );
  }

  const totalSeconds = routineExercises.reduce(
    (sum, ex) => sum + ex.duration,
    0
  );
  const totalMinutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  const handleStartAll = () => {
    if (routineExercises.length > 0) {
      startSession(routineExercises, 0);
    }
  };

  const handleRemoveExercise = (exerciseId: string) => {
    dispatch({
      type: 'removeExercise',
      payload: { routineId: routine.id, exerciseId },
    });
  };

  return (
    <div className="routine-detail-page">
      <header className="page-header routine-detail-header">
        <div>
          <Link to="/routines" className="back-link">
            ← Quay lại danh sách giáo án
          </Link>
          <h1 className="page-title">{routine.name}</h1>
          <p className="page-subtitle">
            Tổng thời gian: {totalMinutes} phút {remainingSeconds} giây ({routineExercises.length} bài)
          </p>
        </div>
        {routineExercises.length > 0 && (
          <button
            type="button"
            className="btn btn-primary btn-play-all"
            onClick={handleStartAll}
          >
            ▶ Tập tất cả
          </button>
        )}
      </header>

      {routineExercises.length === 0 ? (
        <div className="empty-state">
          <p className="no-exercises">
            Giáo án này chưa có bài tập nào. Hãy vào Kho bài tập để thêm bài tập vào giáo án!
          </p>
        </div>
      ) : (
        <div className="exercise-table-container">
          <div className="exercise-table-header">
            <span className="exercise-col col-index">STT</span>
            <span className="exercise-col col-name">Tên bài tập</span>
            <span className="exercise-col col-trainer">Huấn luyện viên</span>
            <span className="exercise-col col-group">Nhóm cơ</span>
            <span className="exercise-col col-duration">Thời lượng</span>
            <span className="exercise-col col-actions">Thao tác</span>
          </div>

          <div className="routine-exercise-list">
            {routineExercises.map((exercise, index) => (
              <div
                key={exercise.id}
                className="exercise-row"
                data-testid={`routine-exercise-row-${exercise.id}`}
              >
                <div className="exercise-col col-index">{index + 1}</div>
                <div className="exercise-col col-name">{exercise.name}</div>
                <div className="exercise-col col-trainer">{exercise.trainer}</div>
                <div className="exercise-col col-group">
                  <span className={`group-badge group-${exercise.group}`}>
                    {exercise.group}
                  </span>
                </div>
                <div className="exercise-col col-duration">
                  {formatDuration(exercise.duration)}
                </div>
                <div className="exercise-col col-actions">
                  <button
                    type="button"
                    className="btn btn-danger btn-remove-from-routine"
                    onClick={() => handleRemoveExercise(exercise.id)}
                  >
                    Bỏ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
