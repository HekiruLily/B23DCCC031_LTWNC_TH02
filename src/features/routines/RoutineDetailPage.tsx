import { useParams, Link } from 'react-router-dom';

export default function RoutineDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="routine-detail-page">
      <header className="page-header">
        <Link to="/routines" className="back-link">← Quay lại danh sách</Link>
        <h1 className="page-title">Chi tiết giáo án #{id}</h1>
      </header>
      <div className="empty-state">
        <p>Chi tiết giáo án đang được phát triển ở Phần 3</p>
      </div>
    </div>
  );
}

