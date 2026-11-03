import { useMemo, useCallback } from 'react';
import { useSavedStore } from './useSavedStore';
import { useSessionStore } from '../session/useSessionStore';
import { EXERCISES } from '../../data/exercises';
import type { Exercise } from '../../types';
import ExerciseRow from '../library/ExerciseRow';

export default function SavedPage() {
  const ids = useSavedStore((s) => s.ids);
  const toggleSave = useSavedStore((s) => s.toggle);
  const startSession = useSessionStore((s) => s.startSession);
  const addToSession = useSessionStore((s) => s.addToSession);

  const savedExercises = useMemo(() => {
    if (ids.length === 0) return [];
    const exerciseMap = new Map<string, Exercise>();
    EXERCISES.forEach((ex) => exerciseMap.set(ex.id, ex));
    return ids
      .map((id) => exerciseMap.get(id))
      .filter((ex): ex is Exercise => ex !== undefined);
  }, [ids]);

  const handleStartAll = useCallback(() => {
    if (savedExercises.length > 0) {
      startSession(savedExercises, 0);
    }
  }, [savedExercises, startSession]);

  const handleStartOne = useCallback(
    (exercise: Exercise) => {
      const index = savedExercises.findIndex((ex) => ex.id === exercise.id);
      startSession(savedExercises, index >= 0 ? index : 0);
    },
    [savedExercises, startSession]
  );

  const handleToggle = useCallback(
    (exercise: Exercise) => {
      toggleSave(exercise.id);
    },
    [toggleSave]
  );

  const handleAddToSession = useCallback(
    (exercise: Exercise) => {
      addToSession(exercise);
    },
    [addToSession]
  );

  return (
    <div className="saved-page">
      <header className="page-header saved-header">
        <div>
          <h1 className="page-title">Bài tập đã lưu</h1>
          <p className="page-subtitle">
            ({savedExercises.length} bài)
          </p>
        </div>
        {savedExercises.length > 0 && (
          <button
            type="button"
            className="btn btn-primary btn-play-all"
            onClick={handleStartAll}
          >
            ▶ Tập tất cả
          </button>
        )}
      </header>

      {savedExercises.length === 0 ? (
        <div className="empty-state">
          <p className="no-saved">Bạn chưa lưu bài tập nào</p>
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

          <div className="saved-list">
            {savedExercises.map((exercise, index) => (
              <ExerciseRow
                key={exercise.id}
                index={index}
                exercise={exercise}
                isSaved={true}
                onStart={handleStartOne}
                onSave={handleToggle}
                onAddToSession={handleAddToSession}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
