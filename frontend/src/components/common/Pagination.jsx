import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;
    const range = [];
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }
    if (currentPage - delta > 2) range.unshift('...');
    if (currentPage + delta < totalPages - 1) range.push('...');
    pages.push(1);
    pages.push(...range);
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

  const btnStyle = (active, disabled) => ({
    padding: '8px 14px', minWidth: '40px', height: '40px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: '8px', border: `1px solid ${active ? '#1C4B2D' : '#e5e7eb'}`,
    background: active ? '#1C4B2D' : disabled ? '#f9fafb' : '#fff',
    color: active ? '#fff' : disabled ? '#9ca3af' : '#374151',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: '14px', fontWeight: active ? 700 : 500,
    transition: 'all 0.15s',
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '20px 0' }}>
      <button
        style={btnStyle(false, currentPage === 1)}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <i className="fas fa-chevron-left" />
      </button>

      {getPageNumbers().map((page, i) =>
        page === '...' ? (
          <span key={`ellipsis-${i}`} style={{ padding: '0 4px', color: '#9ca3af' }}>…</span>
        ) : (
          <button
            key={page}
            style={btnStyle(page === currentPage, false)}
            onClick={() => page !== currentPage && onPageChange(page)}
          >
            {page}
          </button>
        )
      )}

      <button
        style={btnStyle(false, currentPage === totalPages)}
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <i className="fas fa-chevron-right" />
      </button>
    </div>
  );
};

export default Pagination;
