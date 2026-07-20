/** 원본 .comm-rating > .rate-star.{sm|md}.s{n}(h) 스프라이트 미러링 */
export default function StarRating({ starClass, starText, size = 'sm' }: { starClass: string; starText: string; size?: 'sm' | 'md' }) {
  return (
    <span className="comm-rating">
      <span aria-hidden="true" className={`rate-star ${size} ${starClass}`}>
        {' '}
        {starText}{' '}
      </span>
      <span className="rate-text">{starText}</span>
    </span>
  );
}
