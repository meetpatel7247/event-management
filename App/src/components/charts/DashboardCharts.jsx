import React, { useState, useId } from 'react';
import './dashboardCharts.css';

const CAT_COLORS = ['#8b5cf6', '#a78bfa', '#6366f1', '#c084fc', '#7c3aed', '#6d28d9'];
const SHARE_COLORS = ['#3b82f6', '#06b6d4', '#6366f1', '#0ea5e9', '#8b5cf6', '#22d3ee', '#60a5fa', '#38bdf8'];
const PIE_COLORS = ['#8b5cf6', '#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];

function buildSegments(data, valueKey, labelKey, colors) {
  const total = data.reduce((s, d) => s + (d[valueKey] || 0), 0) || 1;
  let cumulative = 0;
  return data.map((d, i) => {
    const value = d[valueKey] || 0;
    const pct = (value / total) * 100;
    const start = cumulative;
    cumulative += pct;
    return { label: d[labelKey], value, pct, start, end: cumulative, color: colors[i % colors.length] };
  });
}

/** Floating tooltip when hovering a color / segment */
export function SegmentTooltip({ item, theme = 'default', suffix = '' }) {
  if (!item) return null;
  return (
    <div className={`dash-hover-tip dash-hover-tip--${theme}`} role="tooltip">
      <span className="dash-hover-tip-swatch" style={{ background: item.color }} />
      <div className="dash-hover-tip-text">
        <strong>{item.label}</strong>
        <span>
          {theme === 'revenue' && typeof item.value === 'number'
            ? `₹${item.value.toLocaleString()}`
            : typeof item.value === 'number'
              ? item.value.toLocaleString()
              : item.value}
          {suffix ? ` ${suffix}` : ''}
          {item.pct != null ? ` · ${Number(item.pct).toFixed(0)}%` : ''}
        </span>
      </div>
    </div>
  );
}

function describeDonutArc(startPct, endPct, rOut = 50, rIn = 30) {
  if (endPct - startPct <= 0) return '';
  const cx = 50, cy = 50;
  const toRad = p => p * 2 * Math.PI - Math.PI / 2;
  const a1 = toRad(startPct);
  const a2 = toRad(endPct);
  const large = endPct - startPct > 0.5 ? 1 : 0;
  const x1 = cx + rOut * Math.cos(a1), y1 = cy + rOut * Math.sin(a1);
  const x2 = cx + rOut * Math.cos(a2), y2 = cy + rOut * Math.sin(a2);
  const x3 = cx + rIn * Math.cos(a2), y3 = cy + rIn * Math.sin(a2);
  const x4 = cx + rIn * Math.cos(a1), y4 = cy + rIn * Math.sin(a1);
  return `M ${x1} ${y1} A ${rOut} ${rOut} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${rIn} ${rIn} 0 ${large} 0 ${x4} ${y4} Z`;
}

function describePieArc(startPct, endPct, r = 42) {
  const cx = 50, cy = 50;
  const toRad = p => p * 2 * Math.PI - Math.PI / 2;
  const sx = cx + r * Math.cos(toRad(startPct));
  const sy = cy + r * Math.sin(toRad(startPct));
  const ex = cx + r * Math.cos(toRad(endPct));
  const ey = cy + r * Math.sin(toRad(endPct));
  const large = endPct - startPct > 0.5 ? 1 : 0;
  return `M ${cx} ${cy} L ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey} Z`;
}

function InteractiveDonut({ segments, total, centerIcon, centerLabel, theme, active, setActive }) {
  const activeSeg = active != null ? segments[active] : null;
  return (
    <div className="dash-donut-interactive">
      <svg viewBox="0 0 100 100" className="dash-donut-svg">
        {segments.map((s, i) => (
          <path
            key={i}
            d={describeDonutArc(s.start / 100, s.end / 100)}
            fill={s.color}
            className={`dash-donut-slice ${active === i ? 'dash-donut-slice--on' : ''}`}
            onMouseEnter={(e) => { e.stopPropagation(); setActive(i); }}
            onMouseLeave={(e) => { e.stopPropagation(); setActive(null); }}
          />
        ))}
      </svg>
      <div className="dash-donut-center">
        <span>{centerIcon}</span>
        <span className="dash-donut-center-total">{total}</span>
        <span className="dash-donut-center-label">{centerLabel}</span>
      </div>
      {activeSeg && (
        <SegmentTooltip
          item={{ label: activeSeg.label, value: activeSeg.value, color: activeSeg.color, pct: activeSeg.pct }}
          theme={theme}
        />
      )}
    </div>
  );
}

/** Admin: green area line — revenue trend */
export function RevenueAreaChart({ data, valueKey, labelKey, chartHeight = 200 }) {
  const [tip, setTip] = useState(null);
  const [activeIdx, setActiveIdx] = useState(null);
  const gradId = useId().replace(/:/g, '');
  const max = Math.max(...data.map(d => d[valueKey] || 0), 1);
  const points = data.map((d, i) => ({
    x: (i / Math.max(data.length - 1, 1)) * 96 + 2,
    y: 95 - ((d[valueKey] / max) * 85),
    label: d[labelKey],
    value: d[valueKey],
  }));
  const polyline = points.map(p => `${p.x},${p.y}`).join(' ');
  const ySteps = [0, max * 0.25, max * 0.5, max * 0.75, max].reverse();

  return (
    <div className="dash-revenue-area" style={{ '--dash-h': `${chartHeight}px` }}>
      <div className="dash-revenue-ylabels">
        {ySteps.map((v, i) => <span key={i}>₹{Math.round(v).toLocaleString()}</span>)}
      </div>
      <div className="dash-revenue-body">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="dash-revenue-svg">
          <defs>
            <linearGradient id={`dashRevGrad-${gradId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
            <filter id={`dashGlow-${gradId}`}>
              <feGaussianBlur stdDeviation="1.2" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <polygon points={`2,100 ${polyline} 98,100`} fill={`url(#dashRevGrad-${gradId})`} />
          <polyline points={polyline} fill="none" stroke="#34d399" strokeWidth="2.5" vectorEffect="non-scaling-stroke" filter={`url(#dashGlow-${gradId})`} />
          {points.map((p, i) => (
            <g key={i} className={`dash-point ${activeIdx === i ? 'dash-point--on' : ''}`}
              onMouseEnter={(e) => { e.stopPropagation(); setTip(p); setActiveIdx(i); }}
              onMouseLeave={(e) => { e.stopPropagation(); setTip(null); setActiveIdx(null); }}>
              <circle cx={p.x} cy={p.y} r={activeIdx === i ? 4 : 2.5} fill="#34d399" stroke="#ecfdf5" strokeWidth={activeIdx === i ? 1 : 0.5} />
            </g>
          ))}
        </svg>
        {tip && (
          <SegmentTooltip
            item={{ label: tip.label, value: `₹${tip.value.toLocaleString()}`, color: '#34d399' }}
            theme="revenue"
          />
        )}
        <div className="dash-revenue-xlabels">
          {points.map((p, i) => <span key={i}>{p.label}</span>)}
        </div>
      </div>
    </div>
  );
}

/** Admin: purple donut — events by category */
export function CategoryDonutChart({ data, valueKey, labelKey, chartHeight = 200 }) {
  const [active, setActive] = useState(null);
  const segments = buildSegments(data, valueKey, labelKey, CAT_COLORS);
  const total = segments.reduce((s, x) => s + x.value, 0);

  return (
    <div className="dash-cat-donut-chart" style={{ '--dash-h': `${chartHeight}px` }} onClick={e => e.stopPropagation()}>
      <InteractiveDonut
        segments={segments}
        total={total}
        centerIcon="📂"
        centerLabel="Events"
        theme="category"
        active={active}
        setActive={setActive}
      />
      <ul className="dash-cat-legend">
        {segments.map((s, i) => (
          <li key={i} className={`dash-cat-legend-item ${active === i ? 'dash-cat-legend-item--on' : ''}`}
            onMouseEnter={(e) => { e.stopPropagation(); setActive(i); }}
            onMouseLeave={(e) => { e.stopPropagation(); setActive(null); }}>
            <span className="dash-cat-legend-dot" style={{ background: s.color }} />
            <span className="dash-cat-legend-name">{s.label}</span>
            <span className="dash-cat-legend-val">{s.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Admin: pink horizontal bars — likes */
export function LikesChart({ data, valueKey, labelKey, chartHeight = 200 }) {
  const [active, setActive] = useState(null);
  const max = Math.max(...data.map(d => d[valueKey] || 0), 1);
  const activeItem = active != null ? data[active] : null;
  return (
    <div className="dash-likes-chart" style={{ '--dash-h': `${chartHeight}px` }} onClick={e => e.stopPropagation()}>
      {activeItem && (
        <SegmentTooltip
          item={{ label: activeItem[labelKey], value: activeItem[valueKey] || 0, color: '#fb7185' }}
          theme="likes"
          suffix="likes"
        />
      )}
      {data.map((d, i) => {
        const val = d[valueKey] || 0;
        const pct = Math.max((val / max) * 100, val > 0 ? 8 : 0);
        return (
          <div key={i} className={`dash-likes-row ${active === i ? 'dash-likes-row--on' : ''}`}
            onMouseEnter={(e) => { e.stopPropagation(); setActive(i); }}
            onMouseLeave={(e) => { e.stopPropagation(); setActive(null); }}>
            <span className="dash-likes-label">{d[labelKey]}</span>
            <div className="dash-likes-track">
              <div
                className="dash-likes-fill"
                style={{ width: `${pct}%` }}
                onMouseEnter={(e) => { e.stopPropagation(); setActive(i); }}
              >
                <span className="dash-likes-glow" />
              </div>
              <span className="dash-likes-count">{val} ❤️</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Admin: blue donut — shares (per event) */
export function SharesDonutChart({ data, valueKey, labelKey, chartHeight = 200 }) {
  const [active, setActive] = useState(null);
  const segments = buildSegments(data, valueKey, labelKey, SHARE_COLORS);
  const total = segments.reduce((s, x) => s + x.value, 0);

  return (
    <div className="dash-shares-chart" style={{ '--dash-h': `${chartHeight}px` }} onClick={e => e.stopPropagation()}>
      <div className="dash-shares-donut-wrap">
        <InteractiveDonut
          segments={segments}
          total={total}
          centerIcon="🔗"
          centerLabel="Shares"
          theme="shares"
          active={active}
          setActive={setActive}
        />
      </div>
      <ul className="dash-shares-legend">
        {segments.map((s, i) => (
          <li key={i} className={`dash-shares-legend-item ${active === i ? 'dash-shares-legend-item--on' : ''}`}
            onMouseEnter={(e) => { e.stopPropagation(); setActive(i); }}
            onMouseLeave={(e) => { e.stopPropagation(); setActive(null); }}>
            <span className="dash-shares-legend-dot" style={{ background: s.color }} />
            <span className="dash-shares-legend-name">{s.label}</span>
            <span className="dash-shares-legend-val">{s.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Organizer: green horizontal bars — revenue by event */
export function RevenueHorizontalChart({ data, valueKey, labelKey, chartHeight = 200 }) {
  const [active, setActive] = useState(null);
  const max = Math.max(...data.map(d => d[valueKey] || 0), 1);
  const activeItem = active != null ? data[active] : null;
  return (
    <div className="dash-rev-h-chart" style={{ '--dash-h': `${chartHeight}px` }} onClick={e => e.stopPropagation()}>
      {activeItem && (
        <SegmentTooltip
          item={{ label: activeItem[labelKey], value: activeItem[valueKey] || 0, color: '#10b981' }}
          theme="revenue"
        />
      )}
      {data.map((d, i) => {
        const val = d[valueKey] || 0;
        const pct = Math.max((val / max) * 100, val > 0 ? 6 : 0);
        return (
          <div key={i} className={`dash-rev-h-row ${active === i ? 'dash-rev-h-row--on' : ''}`}
            onMouseEnter={(e) => { e.stopPropagation(); setActive(i); }}
            onMouseLeave={(e) => { e.stopPropagation(); setActive(null); }}>
            <span className="dash-rev-h-label">{d[labelKey]}</span>
            <div className="dash-rev-h-track">
              <div className="dash-rev-h-fill" style={{ width: `${pct}%` }} />
              <span className="dash-rev-h-val">₹{val.toLocaleString()}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Organizer: wedge pie — category split */
export function CategoryPieChart({ data, valueKey = 'value', labelKey = 'name' }) {
  const [active, setActive] = useState(null);
  const total = data.reduce((s, d) => s + (d[valueKey] ?? d.value ?? 0), 0) || 1;
  let cumulative = 0;
  const slices = data.map((d, i) => {
    const val = d[valueKey] ?? d.value ?? 0;
    const pct = (val / total) * 100;
    const start = cumulative;
    cumulative += pct;
    return {
      label: d[labelKey] ?? d.name,
      name: d[labelKey] ?? d.name,
      value: val,
      pct,
      start: start / 100,
      end: cumulative / 100,
      startPct: start,
      endPct: cumulative,
      color: PIE_COLORS[i % PIE_COLORS.length],
    };
  });
  const activeSlice = active != null ? slices[active] : null;

  return (
    <div className="dash-pie-chart" style={{ '--dash-h': '200px' }} onClick={e => e.stopPropagation()}>
      <div className="dash-pie-svg-wrap">
        <svg viewBox="0 0 100 100" className="dash-pie-svg">
          {slices.map((s, i) => (
            <path
              key={i}
              d={describePieArc(s.start, s.end)}
              fill={s.color}
              className={`dash-pie-slice ${active === i ? 'dash-pie-slice--on' : ''}`}
              stroke="#0f172a"
              strokeWidth="0.5"
              onMouseEnter={(e) => { e.stopPropagation(); setActive(i); }}
              onMouseLeave={(e) => { e.stopPropagation(); setActive(null); }}
            />
          ))}
        </svg>
        {activeSlice && (
          <SegmentTooltip
            item={{ label: activeSlice.label, value: activeSlice.value, color: activeSlice.color, pct: activeSlice.pct }}
            theme="category"
          />
        )}
      </div>
      <div className="dash-pie-legend">
        {slices.map((s, i) => (
          <div
            key={i}
            className={`dash-pie-legend-item ${active === i ? 'dash-pie-legend-item--on' : ''}`}
            onMouseEnter={(e) => { e.stopPropagation(); setActive(i); }}
            onMouseLeave={(e) => { e.stopPropagation(); setActive(null); }}
          >
            <span className="dash-pie-dot" style={{ background: s.color }} />
            <span>{s.name} — {Math.round(s.pct)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Organizer: purple vertical bars — tickets */
export function TicketsVerticalChart({ data, valueKey, labelKey, chartHeight = 200 }) {
  const [active, setActive] = useState(null);
  const max = Math.max(...data.map(d => d[valueKey] || 0), 1);
  const barW = Math.max(36, Math.min(56, 480 / Math.max(data.length, 1)));
  const activeItem = active != null ? data[active] : null;

  return (
    <div className="dash-tickets-wrap" style={{ '--dash-h': `${chartHeight}px` }} onClick={e => e.stopPropagation()}>
      {activeItem && (
        <SegmentTooltip
          item={{ label: activeItem[labelKey], value: activeItem[valueKey] || 0, color: '#8b5cf6' }}
          theme="tickets"
          suffix="tickets"
        />
      )}
      <div className="dash-tickets-ylabels">
        {[max, max * 0.5, 0].map((v, i) => <span key={i}>{Math.round(v)}</span>)}
      </div>
      <div className="dash-tickets-scroll">
        <div className="dash-tickets-chart" style={{ minWidth: `${data.length * barW}px` }}>
          {data.map((d, i) => (
            <div key={i} className={`dash-tickets-group ${active === i ? 'dash-tickets-group--on' : ''}`}
              style={{ minWidth: barW, maxWidth: barW }}
              onMouseEnter={(e) => { e.stopPropagation(); setActive(i); }}
              onMouseLeave={(e) => { e.stopPropagation(); setActive(null); }}>
              <div className="dash-tickets-col">
                <div className="dash-tickets-bar" style={{
                  height: `${Math.max((d[valueKey] / max) * 100, d[valueKey] > 0 ? 8 : 4)}%`,
                }} />
              </div>
              <span className="dash-tickets-label">{d[labelKey]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Organizer: pink % progress — attendance */
export function AttendanceProgressChart({ data, valueKey, labelKey, chartHeight = 200 }) {
  const [active, setActive] = useState(null);
  const activeItem = active != null ? data[active] : null;
  return (
    <div className="dash-attend-chart" style={{ '--dash-h': `${chartHeight}px` }} onClick={e => e.stopPropagation()}>
      {activeItem && (
        <SegmentTooltip
          item={{
            label: activeItem[labelKey],
            value: `${Math.min(100, Math.max(0, activeItem[valueKey] || 0))}%`,
            color: '#ec4899',
          }}
          theme="attendance"
          suffix="fill rate"
        />
      )}
      {data.map((d, i) => {
        const pct = Math.min(100, Math.max(0, d[valueKey] || 0));
        return (
          <div key={i} className={`dash-attend-row ${active === i ? 'dash-attend-row--on' : ''}`}
            onMouseEnter={(e) => { e.stopPropagation(); setActive(i); }}
            onMouseLeave={(e) => { e.stopPropagation(); setActive(null); }}>
            <span className="dash-attend-label">{d[labelKey]}</span>
            <div className="dash-attend-track">
              <div className="dash-attend-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="dash-attend-pct">{pct}%</span>
          </div>
        );
      })}
    </div>
  );
}

/** Organizer analytics: cyan spark area — ticket trend */
export function TicketSparkChart({ data, valueKey, labelKey, chartHeight = 200 }) {
  const [tip, setTip] = useState(null);
  const max = Math.max(...data.map(d => d[valueKey] || 0), 1);
  const points = data.map((d, i) => ({
    x: (i / Math.max(data.length - 1, 1)) * 100,
    y: 100 - ((d[valueKey] / max) * 88),
    label: d[labelKey],
    value: d[valueKey],
  }));
  const polyline = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="dash-spark-chart" style={{ '--dash-h': `${chartHeight}px` }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="dash-spark-svg">
        <defs>
          <linearGradient id="dashSparkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={`0,100 ${polyline} 100,100`} fill="url(#dashSparkGrad)" />
        <polyline points={polyline} fill="none" stroke="#22d3ee" strokeWidth="2.2" vectorEffect="non-scaling-stroke" />
        {points.map((p, i) => (
          <rect key={i} x={p.x - 2} y={p.y - 2} width="4" height="4" fill="#67e8f9" rx="0.5" className="dash-spark-point"
            onMouseEnter={(e) => { e.stopPropagation(); setTip(p); }}
            onMouseLeave={(e) => { e.stopPropagation(); setTip(null); }} />
        ))}
      </svg>
      {tip && (
        <SegmentTooltip
          item={{ label: tip.label, value: tip.value, color: '#22d3ee' }}
          theme="spark"
          suffix="tickets"
        />
      )}
      <div className="dash-spark-labels">
        {points.map((p, i) => <span key={i}>{p.label}</span>)}
      </div>
    </div>
  );
}
