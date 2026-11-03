import React from 'react';
import type { CSSProperties } from 'react';
import type { Exercise } from '../../types';
import { formatDuration } from '../../utils/format';

export interface ExerciseRowData {
  items: Exercise[];
  onStart?: (exercise: Exercise) => void;
  onSave?: (exercise: Exercise) => void;
  onAddToSession?: (exercise: Exercise) => void;
}

export interface ExerciseRowProps {
  index: number;
  style?: CSSProperties;
  data?: ExerciseRowData;
  exercise?: Exercise;
  onStart?: (exercise: Exercise) => void;
  onSave?: (exercise: Exercise) => void;
  onAddToSession?: (exercise: Exercise) => void;
}

export const ExerciseRow = React.memo(function ExerciseRow({
  index,
  style,
  data,
  exercise: propExercise,
  onStart: propOnStart,
  onSave: propOnSave,
  onAddToSession: propOnAddToSession,
}: ExerciseRowProps) {
  const exercise = propExercise ?? data?.items[index];
  if (!exercise) return null;

  const onStart = propOnStart ?? data?.onStart;
  const onSave = propOnSave ?? data?.onSave;
  const onAddToSession = propOnAddToSession ?? data?.onAddToSession;

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
          className="btn btn-star btn-save"
          aria-label="Lưu bài tập"
          onClick={() => onSave?.(exercise)}
        >
          ☆
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-add"
          onClick={() => onAddToSession?.(exercise)}
        >
          + Buổi tập
        </button>
      </div>
    </div>
  );
});

export default ExerciseRow;

