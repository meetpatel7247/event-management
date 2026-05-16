import React from 'react';
import { LineChart, BarChart } from './AdminCharts';

export default function AdminOverview({
  totalRevenue, revenueGrowth, events, pendingEvents, activeOrgs, platformUsers,
  revenueTrend, categoryData, handleApprove, handleRejectEvent
}) {
  return (
    <div className="adm-panel">
      <div className="adm-stats-grid">
        <div className="adm-stat-card">
          <div className="adm-stat-icon" style={{ background:'rgba(16,185,129,0.15)', color:'#10b981' }}>$</div>
          <div>
            <div className="adm-stat-label">Total Platform Revenue</div>
            <div className="adm-stat-value" style={{ color:'#10b981' }}>${totalRevenue.toLocaleString(undefined,{minimumFractionDigits:1,maximumFractionDigits:1})}</div>
            <div className="adm-stat-chip" style={{ color: revenueGrowth >= 0 ? '#10b981' : '#ef4444' }}>
              {revenueGrowth >= 0 ? '+' : ''}{revenueGrowth}%
            </div>
          </div>
        </div>
        <div className="adm-stat-card">
          <div className="adm-stat-icon" style={{ background:'rgba(99,102,241,0.15)', color:'#818cf8' }}>📅</div>
          <div>
            <div className="adm-stat-label">Total Events</div>
            <div className="adm-stat-value">{events.length}</div>
            {pendingEvents.length > 0 && <div className="adm-stat-chip" style={{ color:'#f59e0b' }}>{pendingEvents.length} pending</div>}
          </div>
        </div>
        <div className="adm-stat-card">
          <div className="adm-stat-icon" style={{ background:'rgba(139,92,246,0.15)', color:'#a78bfa' }}>⚡</div>
          <div>
            <div className="adm-stat-label">Active Organizers</div>
            <div className="adm-stat-value">{activeOrgs}</div>
          </div>
        </div>
        <div className="adm-stat-card">
          <div className="adm-stat-icon" style={{ background:'rgba(236,72,153,0.15)', color:'#ec4899' }}>👤</div>
          <div>
            <div className="adm-stat-label">Platform Users</div>
            <div className="adm-stat-value">{platformUsers}</div>
          </div>
        </div>
      </div>

      <div className="adm-charts-row">
        <div className="adm-chart-card">
          <h3 className="adm-chart-title">Revenue Trend</h3>
          <LineChart data={revenueTrend} valueKey="revenue" labelKey="label" />
        </div>
        <div className="adm-chart-card">
          <h3 className="adm-chart-title">Events by Category</h3>
          {categoryData.length > 0
            ? <BarChart data={categoryData} valueKey="count" labelKey="name" />
            : <div className="adm-empty">No events yet.</div>}
        </div>
      </div>

      <div className="adm-section">
        <h3 className="adm-section-title">Pending Approvals</h3>
        {pendingEvents.length === 0 ? (
          <div className="adm-empty">✅ No pending events — all caught up!</div>
        ) : (
          <div className="adm-pending-list">
            {pendingEvents.map(ev => (
              <div key={ev._id} className="adm-pending-row">
                <div className="adm-pending-info">
                  <div className="adm-pending-name">{ev.title}</div>
                  <div className="adm-pending-meta">
                    by {ev.organizerName || ev.organizerId?.name || 'Unknown'} • {new Date(ev.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                  </div>
                </div>
                <div className="adm-pending-actions">
                  <button className="adm-btn adm-btn-view" onClick={() => window.open(`/events/${ev._id}`,'_blank')}>👁 View</button>
                  <button className="adm-btn adm-btn-approve" onClick={() => handleApprove(ev._id)}>✓ Approve</button>
                  <button className="adm-btn adm-btn-reject" onClick={() => handleRejectEvent(ev._id)}>✕ Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
