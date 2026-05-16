import React, { useState } from 'react';

const BAR_COLORS = ['#8b5cf6', '#6366f1', '#06b6d4', '#10b981', '#f59e0b'];

export function BarChart({ data, valueKey, labelKey }) {
  const max = Math.max(...data.map(d => d[valueKey] || 0), 1);
  return (
    <div className="org-bar-chart">
      {data.map((d, i) => (
        <div key={i} className="org-bar-group">
          <div className="org-bar-wrap">
            <div
              className="org-bar"
              style={{
                height: `${Math.max((d[valueKey] / max) * 100, 4)}%`,
                background: BAR_COLORS[i % BAR_COLORS.length],
              }}
            />
          </div>
          <span className="org-bar-label">{d[labelKey]}</span>
        </div>
      ))}
    </div>
  );
}

export function LineChart({ data, valueKey, labelKey }) {
  const max = Math.max(...data.map(d => d[valueKey] || 0), 1);
  const points = data.map((d, i) => ({
    x: (i / Math.max(data.length - 1, 1)) * 100,
    y: 100 - (d[valueKey] / max) * 90,
    label: d[labelKey],
    value: d[valueKey],
  }));
  const polyline = points.map(p => `${p.x},${p.y}`).join(' ');
  const [tooltip, setTooltip] = useState(null);

  return (
    <div className="org-line-chart">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="org-line-svg">
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          points={`0,100 ${polyline} 100,100`}
          fill="url(#lineGrad)"
        />
        <polyline
          points={polyline}
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="1.5"
            fill="#8b5cf6"
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => setTooltip(p)}
            onMouseLeave={() => setTooltip(null)}
          />
        ))}
      </svg>
      {tooltip && (
        <div className="org-line-tooltip">
          <div className="org-tt-label">{tooltip.label}</div>
          <div className="org-tt-val">tickets : {tooltip.value}</div>
        </div>
      )}
      <div className="org-line-labels">
        {points.map((p, i) => (
          <span key={i} className="org-line-xlabel">{p.label}</span>
        ))}
      </div>
    </div>
  );
}

export function PieChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let cumulative = 0;
  const COLORS = ['#8b5cf6', '#6366f1', '#06b6d4', '#10b981'];
  const slices = data.map((d, i) => {
    const pct = d.value / total;
    const start = cumulative;
    cumulative += pct;
    return { ...d, pct, start, color: COLORS[i % COLORS.length] };
  });

  function describeArc(startPct, endPct) {
    const cx = 50, cy = 50, r = 40;
    const toRad = p => (p * 2 * Math.PI) - Math.PI / 2;
    const sx = cx + r * Math.cos(toRad(startPct));
    const sy = cy + r * Math.sin(toRad(startPct));
    const ex = cx + r * Math.cos(toRad(endPct));
    const ey = cy + r * Math.sin(toRad(endPct));
    const large = endPct - startPct > 0.5 ? 1 : 0;
    return `M ${cx} ${cy} L ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey} Z`;
  }

  return (
    <div className="org-pie-wrap">
      <svg viewBox="0 0 100 100" className="org-pie-svg">
        {slices.map((s, i) => (
          <path key={i} d={describeArc(s.start, s.start + s.pct)} fill={s.color} opacity={0.85} />
        ))}
      </svg>
      <div className="org-pie-legend">
        {slices.map((s, i) => (
          <div key={i} className="org-pie-legend-item">
            <span className="org-pie-dot" style={{ background: s.color }} />
            <span>{s.name} {Math.round(s.pct * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
