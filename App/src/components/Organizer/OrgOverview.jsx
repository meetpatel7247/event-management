import React from 'react';
import { BarChart, PieChart } from './OrgCharts';
import { statusBadge } from './OrgBadges';

export default function OrgOverview({
  events, bookings, totalRevenue, totalTickets, avgAttendance,
  revenueByEvent, categoryData, setShowForm, setActiveTab
}) {
  return (
    <div className="org-panel">
      <div className="org-stats-grid">
        <div className="org-stat-card">
          <div className="org-stat-icon" style={{ background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}>📅</div>
          <div>
            <div className="org-stat-label">Events Created</div>
            <div className="org-stat-value">{events.length}</div>
            <div className="org-stat-sub">Total</div>
          </div>
        </div>
        <div className="org-stat-card">
          <div className="org-stat-icon" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>₹</div>
          <div>
            <div className="org-stat-label">Total Revenue</div>
            <div className="org-stat-value" style={{ color: '#10b981' }}>₹{totalRevenue.toLocaleString()}</div>
            <div className="org-stat-sub">From ticket sales</div>
          </div>
        </div>
        <div className="org-stat-card">
          <div className="org-stat-icon" style={{ background: 'rgba(139,92,246,0.15)', color: '#8b5cf6' }}>👥</div>
          <div>
            <div className="org-stat-label">Tickets Sold</div>
            <div className="org-stat-value" style={{ color: '#8b5cf6' }}>{totalTickets}</div>
            <div className="org-stat-sub">Across all events</div>
          </div>
        </div>
        <div className="org-stat-card">
          <div className="org-stat-icon" style={{ background: 'rgba(236,72,153,0.15)', color: '#ec4899' }}>📈</div>
          <div>
            <div className="org-stat-label">Avg. Attendance</div>
            <div className="org-stat-value" style={{ color: '#ec4899' }}>{avgAttendance}%</div>
            <div className="org-stat-sub">Seat fill rate</div>
          </div>
        </div>
      </div>

      {events.length > 0 && (
        <div className="org-charts-row">
          <div className="org-chart-card">
            <h3 className="org-chart-title">Revenue by Event</h3>
            <BarChart data={revenueByEvent} valueKey="revenue" labelKey="label" />
          </div>
          <div className="org-chart-card">
            <h3 className="org-chart-title">Events by Category</h3>
            <PieChart data={categoryData} />
          </div>
        </div>
      )}

      <div className="org-section">
        <h3 className="org-section-title">Recent Events</h3>
        {events.length === 0 ? (
          <div className="org-empty">No events yet. <button className="org-link-btn" onClick={() => { setShowForm(true); setActiveTab('My Events'); }}>Create your first event →</button></div>
        ) : (
          <div className="org-recent-list">
            {events.slice(0, 5).map(ev => {
              const sold = bookings.filter(b => b.event?._id === ev._id).reduce((s, b) => s + b.quantity, 0);
              const rev = bookings.filter(b => b.event?._id === ev._id).reduce((s, b) => s + b.totalPrice, 0);
              return (
                <div key={ev._id} className="org-recent-row">
                  <span className="org-recent-dot" style={{ background: ev.isApproved ? '#10b981' : '#f59e0b' }} />
                  <div className="org-recent-info">
                    <span className="org-recent-name">{ev.title}</span>
                    <span className="org-recent-date">{new Date(ev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="org-recent-stat"><span className="org-recent-stat-label">Sold</span><strong>{sold}</strong></div>
                  <div className="org-recent-stat"><span className="org-recent-stat-label">Revenue</span><strong style={{ color: '#10b981' }}>₹{rev.toLocaleString()}</strong></div>
                  {statusBadge(ev)}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
