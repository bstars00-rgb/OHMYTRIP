'use client';

import { useEffect } from 'react';
import { Star, Heart, GitCompareArrows, X } from 'lucide-react';
import { useCompare, useWishlist } from '@/features/golf/GolfProviders';

export function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="g-stars" aria-label={`${rating} star hotel`}>
      {Array.from({ length: rating }, (_, i) => (
        <Star key={i} size={size} fill="currentColor" strokeWidth={0} />
      ))}
    </span>
  );
}

export function ReviewScore({ score, count }: { score: number; count?: number }) {
  return (
    <span className="g-reviewscore">
      <b>{score.toFixed(1)}</b>
      {count !== undefined && <span className="g-muted"> · {count.toLocaleString()} reviews</span>}
    </span>
  );
}

export function WishlistButton({ id, className = '' }: { id: string; className?: string }) {
  const wl = useWishlist();
  const active = wl.has(id);
  return (
    <button
      type="button"
      className={`g-wishlist-btn${active ? ' is-active' : ''} ${className}`}
      aria-pressed={active}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        wl.toggle(id);
      }}
    >
      <Heart size={18} fill={active ? 'currentColor' : 'none'} />
    </button>
  );
}

export function CompareButton({ id }: { id: string }) {
  const cmp = useCompare();
  const active = cmp.has(id);
  const disabled = !active && cmp.full;
  return (
    <button
      type="button"
      className={`g-compare-toggle${active ? ' is-active' : ''}`}
      disabled={disabled}
      aria-pressed={active}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        cmp.toggle(id);
      }}
      title={disabled ? 'You can compare up to 3 packages' : 'Add to compare'}
    >
      <GitCompareArrows size={15} /> {active ? 'Added' : 'Compare'}
    </button>
  );
}

export function Modal({ open, onClose, children, label }: { open: boolean; onClose: () => void; children: React.ReactNode; label?: string }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="g-overlay" onClick={onClose} role="presentation">
      <div className="g-modal" role="dialog" aria-modal="true" aria-label={label} onClick={(e) => e.stopPropagation()}>
        <button type="button" className="g-modal-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
}

export function BottomSheet({ open, onClose, children, title }: { open: boolean; onClose: () => void; children: React.ReactNode; title?: string }) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);
  if (!open) return null;
  return (
    <div className="g-overlay" style={{ alignItems: 'flex-end', padding: 0 }} onClick={onClose} role="presentation">
      <div className="g-sheet" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="g-sheet-head">
          <span className="g-sheet-title">{title}</span>
          <button type="button" className="g-modal-close" style={{ position: 'static' }} onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function EmptyState({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="g-empty">
      <div className="g-empty-icon">⛳</div>
      <h3>{title}</h3>
      {subtitle && <p className="g-muted">{subtitle}</p>}
      {action}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="g-card" aria-hidden>
      <div className="g-skel" style={{ height: 200, borderRadius: 0 }} />
      <div style={{ padding: 18 }}>
        <div className="g-skel" style={{ height: 18, width: '70%', marginBottom: 10 }} />
        <div className="g-skel" style={{ height: 14, width: '45%', marginBottom: 18 }} />
        <div className="g-skel" style={{ height: 40, width: '100%' }} />
      </div>
    </div>
  );
}
