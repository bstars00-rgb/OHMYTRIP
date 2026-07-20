'use client';

/** 원본 app-pagination (맨처음/이전/1~10/다음/맨끝) 미러링 */
export default function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  const groupStart = Math.floor((page - 1) / 10) * 10 + 1;
  const pages = Array.from({ length: Math.min(10, totalPages - groupStart + 1) }, (_, i) => groupStart + i);
  return (
    <div className="pagination">
      <button type="button" title="맨처음" className="btn-pagination-prev" onClick={() => onChange(1)}>
        {' '}
        맨처음{' '}
      </button>
      <button
        type="button"
        title="이전"
        className="btn-pagination-first"
        onClick={() => onChange(Math.max(1, page - 1))}
      >
        {' '}
        이전{' '}
      </button>
      {pages.map((p) =>
        p === page ? (
          <strong key={p}>{p}</strong>
        ) : (
          <button key={p} type="button" className="btn-pagination" onClick={() => onChange(p)}>
            {' '}
            {p}{' '}
          </button>
        ),
      )}
      <button
        type="button"
        title="다음"
        className="btn-pagination-last"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
      >
        {' '}
        다음{' '}
      </button>
      <button type="button" title="맨끝" className="btn-pagination-next" onClick={() => onChange(totalPages)}>
        {' '}
        맨끝{' '}
      </button>
    </div>
  );
}
