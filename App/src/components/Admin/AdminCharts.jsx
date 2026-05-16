import React, { useState } from 'react';

const LINE_COLOR = '#ec4899';

export function LineChart({ data, valueKey, labelKey }) {
  const max = Math.max(...data.map(d => d[valueKey] || 0), 1);
  const points = data.map((d, i) => ({
    x: (i / Math.max(data.length - 1, 1)) * 96 + 2,
    y: 95 - ((d[valueKey] / max) * 85),
    label: d[labelKey],
    value: d[valueKey],
  }));
  const polyline = points.map(p => `${p.x},${p.y}`).join(' ');
  const [tip, setTip] = useState(null);

  const ySteps = [0, max * 0.25, max * 0.5, max * 0.75, max].reverse();

  return (
    <div className="adm-line-wrap">
      <div className="adm-line-ylabels">
        {ySteps.map((v, i) => (
          <span key={i}>{Math.round(v).toLocaleString()}</span>
        ))}
      </div>
      <div className="adm-line-chart">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="adm-line-svg">
          <defs>
            <linearGradient id="admLineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={LINE_COLOR} stopOpacity="0.25" />
              <stop offset="100%" stopColor={LINE_COLOR} stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={`2,100 ${polyline} 98,100`} fill="url(#admLineGrad)" />
          <polyline points={polyline} fill="none" stroke={LINE_COLOR} strokeWidth="1.8" vectorEffect="non-scaling-stroke" />
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="2" fill={LINE_COLOR}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setTip(p)} onMouseLeave={() => setTip(null)} />
          ))}
        </svg>
        {tip && (
          <div className="adm-line-tip">
            <div className="adm-tip-label">{tip.label}</div>
            <div className="adm-tip-val">${tip.value.toLocaleString()}</div>
          </div>
        )}
        <div className="adm-line-xlabels">
          {points.map((p, i) => <span key={i}>{p.label}</span>)}
        </div>
      </div>
    </div>
  );
}

export function BarChart({ data, valueKey, labelKey }) {
  const max = Math.max(...data.map(d => d[valueKey] || 0), 1);
  const [tip, setTip] = useState(null);
  const COLORS = ['#8b5cf6', '#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];

  return (
    <div className="adm-bar-wrap">
      <div className="adm-bar-ylabels">
        {[max, max * 0.75, max * 0.5, max * 0.25, 0].map((v, i) => (
          <span key={i}>{Math.round(v)}</span>
        ))}
      </div>
      <div className="adm-bar-chart">
        {data.map((d, i) => (
          <div key={i} className="adm-bar-group"
            onMouseEnter={() => setTip({ label: d[labelKey], value: d[valueKey] })}
            onMouseLeave={() => setTip(null)}>
            <div className="adm-bar-col">
              <div className="adm-bar" style={{
                height: `${Math.max((d[valueKey] / max) * 100, 3)}%`,
                background: d === tip ? 'rgba(220,220,220,0.3)' : COLORS[i % COLORS.length],
              }} />
            </div>
            <span className="adm-bar-label">{d[labelKey]}</span>
          </div>
        ))}
        {tip && (
          <div className="adm-bar-tip">
            {tip.label}<br /><strong>count : {tip.value}</strong>
          </div>
        )}
      </div>
    </div>
  );
}
