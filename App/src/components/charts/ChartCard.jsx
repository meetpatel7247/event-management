import React from 'react';

/**
 * Clickable chart container — hover glow + opens detail modal on click.
 */
export default function ChartCard({
  title,
  theme = 'revenue',
  onClick,
  children,
  empty = false,
  emptyText = 'No data yet',
  className = '',
}) {
  if (empty) {
    return (
      <div className={`dash-chart-card dash-chart-card--${theme} dash-chart-card--static ${className}`}>
        <div className="dash-chart-card-head">
          <h3 className="dash-chart-card-title">{title}</h3>
        </div>
        <div className="dash-chart-card-body">
          <div className="dash-chart-empty">{emptyText}</div>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      className={`dash-chart-card dash-chart-card--clickable dash-chart-card--${theme} ${className}`}
      onClick={onClick}
      aria-label={`${title} — click for details`}
    >
      <div className="dash-chart-card-head">
        <h3 className="dash-chart-card-title">{title}</h3>
        <span className="dash-chart-expand-hint">
          <span className="dash-chart-expand-icon">⤢</span> Click to expand
        </span>
      </div>
      <div className="dash-chart-card-body">{children}</div>
      <div className="dash-chart-card-shine" aria-hidden="true" />
    </button>
  );
}
