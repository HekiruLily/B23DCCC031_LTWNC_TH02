export default function SavedPage() {
  return (
    <div className="saved-page">
      <header className="page-header">
        <h1 className="page-title">Bài tập đã lưu</h1>
        <p className="page-subtitle">Danh sách các bài tập yêu thích đã được ghi nhớ</p>
      </header>
      <div className="empty-state">
        <p>Chưa có bài tập nào được lưu (Tính năng đang được phát triển ở Phần 2)</p>
      </div>
    </div>
  );
}

