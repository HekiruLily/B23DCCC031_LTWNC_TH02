import { useState, useMemo, useCallback } from 'react';
import { FixedSizeList } from 'react-window';
import { EXERCISES, GROUPS } from '../../data/exercises';
import type { Exercise, FilterGroup, SortOption } from '../../types';
import { useDebounce } from '../../hooks/useDebounce';
import ExerciseRow from './ExerciseRow';
import type { ExerciseRowData } from './ExerciseRow';

export default function LibraryPage() {
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<FilterGroup>('Tất cả');
  const [sortBy, setSortBy] = useState<SortOption>('default');

  const debouncedSearch = useDebounce(search, 300);

  const filteredAndSortedExercises = useMemo(() => {
    let list = EXERCISES;

    if (selectedGroup !== 'Tất cả') {
      list = list.filter((ex) => ex.group === selectedGroup);
    }

    const query = debouncedSearch.trim().toLowerCase();
    if (query) {
      list = list.filter(
        (ex) =>
          ex.name.toLowerCase().includes(query) ||
          ex.trainer.toLowerCase().includes(query)
      );
    }

    if (sortBy === 'name-asc') {
      return [...list].sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    }
    if (sortBy === 'duration-asc') {
      return [...list].sort((a, b) => a.duration - b.duration);
    }

    return list;
  }, [debouncedSearch, selectedGroup, sortBy]);

  const handleStart = useCallback((exercise: Exercise) => {
    
    void exercise;
  }, []);

  const handleSave = useCallback((exercise: Exercise) => {
    
    void exercise;
  }, []);

  const handleAddToSession = useCallback((exercise: Exercise) => {
    
    void exercise;
  }, []);

  const itemData = useMemo<ExerciseRowData>(
    () => ({
      items: filteredAndSortedExercises,
      onStart: handleStart,
      onSave: handleSave,
      onAddToSession: handleAddToSession,
    }),
    [filteredAndSortedExercises, handleStart, handleSave, handleAddToSession]
  );

  const itemKey = useCallback(
    (index: number, data: ExerciseRowData) => data.items[index]?.id ?? index,
    []
  );

  return (
    <div className="library-page">
      <header className="page-header">
        <h1 className="page-title">Kho bài tập</h1>
        <p className="page-subtitle">Khám phá và lựa chọn từ hơn 10.000 bài tập gym chuyên nghiệp</p>
      </header>

      <section className="controls-panel" aria-label="Bộ lọc và tìm kiếm">
        <div className="control-group">
          <label htmlFor="search-input">Tìm kiếm</label>
          <input
            id="search-input"
            type="text"
            className="input-text"
            placeholder="Tìm theo tên bài tập hoặc HLV..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="control-group">
          <label htmlFor="group-select">Nhóm cơ</label>
          <select
            id="group-select"
            className="input-select"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value as FilterGroup)}
          >
            <option value="Tất cả">Tất cả</option>
            {GROUPS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="sort-select">Sắp xếp</label>
          <select
            id="sort-select"
            className="input-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <option value="default">Mặc định</option>
            <option value="name-asc">Tên A–Z</option>
            <option value="duration-asc">Thời lượng tăng dần</option>
          </select>
        </div>
      </section>

      <div className="status-bar">
        {filteredAndSortedExercises.length > 0 ? (
          <p className="result-count">
            Tìm thấy {filteredAndSortedExercises.length} bài tập
          </p>
        ) : (
          <p className="no-result">Không tìm thấy bài tập nào</p>
        )}
      </div>

      {filteredAndSortedExercises.length > 0 && (
        <div className="exercise-table-container">
          <div className="exercise-table-header">
            <span className="exercise-col col-index">STT</span>
            <span className="exercise-col col-name">Tên bài tập</span>
            <span className="exercise-col col-trainer">Huấn luyện viên</span>
            <span className="exercise-col col-group">Nhóm cơ</span>
            <span className="exercise-col col-duration">Thời lượng</span>
            <span className="exercise-col col-actions">Thao tác</span>
          </div>

          <FixedSizeList
            height={560}
            itemCount={filteredAndSortedExercises.length}
            itemSize={56}
            width="100%"
            itemData={itemData}
            itemKey={itemKey}
            className="exercise-list"
          >
            {ExerciseRow}
          </FixedSizeList>
        </div>
      )}
    </div>
  );
}

