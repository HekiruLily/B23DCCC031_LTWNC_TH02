import React, { useCallback } from 'react';
import type { CSSProperties } from 'react';
import type { Exercise } from '../../types';
import { formatDuration } from '../../utils/format';
import { useSavedStore } from '../saved/useSavedStore';

export interface ExerciseRowData {
  items: Exercise[];
  onStart?: (exercise: Exercise) => void;
  onSave?: (exercise: Exercise) => void;
  onAddToSession?: (exercise: Exercise) => void;
  onAddToRoutine?: (exercise: Exercise) => void;
  isAddToRoutineDisabled?: boolean;
  isSaved?: (exerciseId: string) => boolean;
}

export interface ExerciseRowProps {
  index: number;
  style?: CSSProperties;
  data?: ExerciseRowData;
  exercise?: Exercise;
  isSaved?: boolean;
  isAddToRoutineDisabled?: boolean;
  onStart?: (exercise: Exercise) => void;
  onSave?: (exercise: Exercise) => void;
  onAddToSession?: (exercise: Exercise) => void;
  onAddToRoutine?: (exercise: Exercise) => void;
}

export const ExerciseRow = React.memo(function ExerciseRow({
  index,
  style,
  data,
  exercise: propExercise,
  isSaved: propIsSaved,
  isAddToRoutineDisabled: propIsAddToRoutineDisabled,
  onStart: propOnStart,
  onSave: propOnSave,
  onAddToSession: propOnAddToSession,
  onAddToRoutine: propOnAddToRoutine,
}: ExerciseRowProps) {
  const exercise = propExercise ?? data?.items[index];
  const exerciseId = exercise?.id ?? '';

  const isSavedInStore = useSavedStore((s) =>
    exerciseId ? s.ids.includes(exerciseId) : false
  );
  const toggleSaveInStore = useSavedStore((s) => s.toggle);

  const isSaved = propIsSaved ?? data?.isSaved?.(exerciseId) ?? isSavedInStore;
  const onStart = propOnStart ?? data?.onStart;
  const onSave = propOnSave ?? data?.onSave;
  const onAddToSession = propOnAddToSession ?? data?.onAddToSession;
  const onAddToRoutine = propOnAddToRoutine ?? data?.onAddToRoutine;
  const isAddToRoutineDisabled =
    propIsAddToRoutineDisabled ?? data?.isAddToRoutineDisabled ?? false;

  const handleSaveClick = useCallback(() => {
    if (!exercise) return;
    if (onSave) {
      onSave(exercise);
    } else {
      toggleSaveInStore(exercise.id);
    }
  }, [exercise, onSave, toggleSaveInStore]);

  if (!exercise) return null;

  return (
    <div
      style={style}
      className="exercise-row"
      data-testid={`exercise-row-${exercise.id}`}
    >
      <div className="exercise-col col-index">{index + 1}</div>
      <div className="exercise-col col-name" title={exercise.name}>
        <span className="exercise-name-text">{exercise.name}</span>
      </div>
      <div className="exercise-col col-trainer" title={exercise.trainer}>
        {exercise.trainer}
      </div>
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
          className="btn btn-primary btn-start"
          onClick={() => onStart?.(exercise)}
        >
          Bắt đầu
        </button>
        <button
          type="button"
          className={`btn btn-star btn-save ${isSaved ? 'is-saved' : ''}`}
          aria-label={isSaved ? 'Bỏ lưu' : 'Lưu bài tập'}
          onClick={handleSaveClick}
        >
          {isSaved ? '★' : '☆'}
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-add"
          onClick={() => onAddToSession?.(exercise)}
        >
          + Buổi tập
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-add-routine"
          disabled={isAddToRoutineDisabled}
          onClick={() => onAddToRoutine?.(exercise)}
        >
          + Giáo án
        </button>
      </div>
    </div>
  );
});

export default ExerciseRow;
