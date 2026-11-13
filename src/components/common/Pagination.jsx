import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Pagination.css";

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination-container">
      <button
        className="pagination-btn"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>

      {Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (page) => (
          <button
            key={page}
            className={`pagination-btn ${currentPage === page ? "active" : ""}`}
            aria-current={currentPage === page ? "page" : undefined}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ),
      )}

      <button
        className="pagination-btn"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

export default Pagination;
