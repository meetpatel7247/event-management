import React, { useState } from 'react';
import { TicketSparkChart } from './OrgCharts';
import ChartCard from '../charts/ChartCard';

export default function OrgAnalytics({ events, ticketsByEvent, bestEvent, mostPopularCategory, avgTicketPrice }) {
  const [popupOpen, setPopupOpen] = useState(false);

  return (
    <div className="org-panel">
      {popupOpen && ticketsByEvent?.length > 0 && (
        <div className="org-modal-overlay" onClick={() => setPopupOpen(false)}>
          <div className="org-modal-content org-modal-content--wide" onClick={e => e.stopPropagation()}>
            <button className="org-modal-close" onClick={() => setPopupOpen(false)}>✕</button>
            <h3 className="org-modal-title">Ticket Sales Trend</h3>
            <div className="org-modal-real-chart">
              <TicketSparkChart data={ticketsByEvent} valueKey="tickets" labelKey="label" chartHeight={260} />
            </div>
          </div>
        </div>
      )}
      {events.length === 0 ? (
        <div className="org-empty">Create events to see analytics.</div>
      ) : (
        <>
          <ChartCard
            title="🎫 Ticket Sales Trend"
            theme="spark"
            onClick={() => setPopupOpen(true)}
            className="org-chart-card-standalone"
          >
            <TicketSparkChart data={ticketsByEvent} valueKey="tickets" labelKey="label" chartHeight={220} />
          </ChartCard>
          <div className="org-stats-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginTop: '2rem' }}>
            <div className="org-stat-card">
              <div className="org-stat-icon" style={{ background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}>🏆</div>
              <div>
                <div className="org-stat-label">Best Performing Event</div>
                <div className="org-stat-value" style={{ fontSize: '1.1rem' }}>{bestEvent?.label || '—'}</div>
                <div className="org-stat-sub" style={{ color: '#10b981' }}>₹{(bestEvent?.revenue || 0).toLocaleString()}</div>
              </div>
            </div>
            <div className="org-stat-card">
              <div className="org-stat-icon" style={{ background: 'rgba(139,92,246,0.15)', color: '#8b5cf6' }}>🎵</div>
              <div>
                <div className="org-stat-label">Most Popular Category</div>
                <div className="org-stat-value" style={{ fontSize: '1.1rem' }}>{mostPopularCategory?.name || '—'}</div>
                <div className="org-stat-sub" style={{ color: '#8b5cf6' }}>{mostPopularCategory?.value || 0} events</div>
              </div>
            </div>
            <div className="org-stat-card">
              <div className="org-stat-icon" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>₹</div>
              <div>
                <div className="org-stat-label">Avg Ticket Price</div>
                <div className="org-stat-value" style={{ fontSize: '1.1rem' }}>₹{avgTicketPrice}</div>
                <div className="org-stat-sub">Across all events</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
