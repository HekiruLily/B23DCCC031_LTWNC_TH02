import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import SessionBar from './features/session/SessionBar';
import './App.css';

const LibraryPage = lazy(() => import('./features/library/LibraryPage'));
const SavedPage = lazy(() => import('./features/saved/SavedPage'));
const RoutinesPage = lazy(() => import('./features/routines/RoutinesPage'));
const RoutineDetailPage = lazy(() => import('./features/routines/RoutineDetailPage'));

function AppContent() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app-container">
      <header className="app-navbar">
        <div className="nav-brand">
          <span className="brand-icon">⚡</span>
          <span className="brand-title">Bấm Giờ Tập Luyện</span>
        </div>
        <nav className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'nav-item active' : 'nav-item'
            }
          >
            Kho bài tập
          </NavLink>
          <NavLink
            to="/saved"
            className={({ isActive }) =>
              isActive ? 'nav-item active' : 'nav-item'
            }
          >
            Đã lưu
          </NavLink>
          <NavLink
            to="/routines"
            className={({ isActive }) =>
              isActive ? 'nav-item active' : 'nav-item'
            }
          >
            Giáo án
          </NavLink>
        </nav>
        <div className="nav-actions">
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={`Chuyển sang giao diện ${theme === 'dark' ? 'sáng' : 'tối'}`}
          >
            {theme === 'dark' ? '☀️ Sáng' : '🌙 Tối'}
          </button>
        </div>
      </header>

      <main className="app-main">
        <Suspense fallback={<div className="loading-state">Đang tải trang...</div>}>
          <Routes>
            <Route path="/" element={<LibraryPage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/routines" element={<RoutinesPage />} />
            <Route path="/routines/:id" element={<RoutineDetailPage />} />
          </Routes>
        </Suspense>
      </main>

      {}
      <SessionBar />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}
