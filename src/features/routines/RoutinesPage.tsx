import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRoutines, useRoutineDispatch } from './RoutineContext';

interface CreateRoutineFormProps {
  existingNames: string[];
}

export function CreateRoutineForm({ existingNames }: CreateRoutineFormProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const dispatch = useRoutineDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Tên giáo án không được để trống');
      return;
    }
    if (existingNames.some((n) => n.toLowerCase() === trimmed.toLowerCase())) {
      setError('Tên giáo án đã tồn tại');
      return;
    }

    dispatch({ type: 'create', payload: { name: trimmed } });
    setName('');
    setError('');
  };

  return (
    <form className="routine-create-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="routine-name-input">Tên giáo án</label>
        <div className="form-inline">
          <input
            id="routine-name-input"
            type="text"
            className="input-text"
            placeholder="Nhập tên giáo án..."
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
          />
          <button type="submit" className="btn btn-primary btn-create-routine">
            Tạo
          </button>
        </div>
      </div>
      {error && <p className="form-error-message" role="alert">{error}</p>}
    </form>
  );
}

export default function RoutinesPage() {
  const routines = useRoutines();
  const dispatch = useRoutineDispatch();

  const existingNames = routines.map((r) => r.name);

  const handleDelete = (id: string) => {
    dispatch({ type: 'remove', payload: { id } });
  };

  return (
    <div className="routines-page">
      <header className="page-header">
        <h1 className="page-title">Danh sách giáo án</h1>
        <p className="page-subtitle">
          ({routines.length} giáo án)
        </p>
      </header>

      <section className="routine-create-section">
        <CreateRoutineForm existingNames={existingNames} />
      </section>

      {routines.length === 0 ? (
        <div className="empty-state">
          <p className="no-routines">Chưa có giáo án nào. Hãy tạo giáo án đầu tiên của bạn!</p>
        </div>
      ) : (
        <div className="routines-grid">
          {routines.map((routine) => (
            <div
              key={routine.id}
              className="routine-card"
              data-testid={`routine-card-${routine.id}`}
            >
              <div className="routine-card-header">
                <h2 className="routine-card-title">{routine.name}</h2>
                <span className="routine-badge">{routine.exerciseIds.length} bài</span>
              </div>
              <div className="routine-card-actions">
                <Link
                  to={`/routines/${routine.id}`}
                  className="btn btn-secondary btn-routine-detail"
                >
                  Chi tiết
                </Link>
                <button
                  type="button"
                  className="btn btn-danger btn-routine-delete"
                  onClick={() => handleDelete(routine.id)}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
