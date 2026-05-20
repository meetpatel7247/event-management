import React, { useState } from 'react';
import {
  RevenueHorizontalChart,
  CategoryPieChart,
  TicketsVerticalChart,
  AttendanceProgressChart,
} from './OrgCharts';
import ChartCard from '../charts/ChartCard';
import { statusBadge } from './OrgBadges';

export default function OrgOverview({
  events, bookings, totalRevenue, totalTickets, avgAttendance,
  revenueByEvent, categoryData, setShowForm, setActiveTab
}) {
  const [popupData, setPopupData] = useState(null);

  const openPopup = (title, value, sub, chartType, chartData, wide = false) => {
    setPopupData({ title, value, sub, chartType, chartData, wide });
  };
  const closePopup = () => setPopupData(null);

  const renderPopupChart = () => {
    if (!popupData?.chartData?.length) {
      return <div className="dash-chart-empty">No data to display</div>;
    }
    const { chartType, chartData } = popupData;
    const h = 240;
    switch (chartType) {
      case 'revenue':
        return <RevenueHorizontalChart data={chartData} valueKey="value" labelKey="label" chartHeight={h} />;
      case 'tickets':
        return <TicketsVerticalChart data={chartData} valueKey="value" labelKey="label" chartHeight={h} />;
      case 'attendance':
        return <AttendanceProgressChart data={chartData} valueKey="value" labelKey="label" chartHeight={h} />;
      case 'category':
        return <CategoryPieChart data={chartData} />;
      default:
        return <div className="dash-chart-empty">No data to display</div>;
    }
  };

  return (
    <div className="org-panel">
      {popupData && (
        <div className="org-modal-overlay" onClick={closePopup}>
          <div className={`org-modal-content ${popupData.wide ? 'org-modal-content--wide' : ''}`} onClick={e => e.stopPropagation()}>
            <button className="org-modal-close" onClick={closePopup}>✕</button>
            <h3 className="org-modal-title">{popupData.title}</h3>
            <div className="org-modal-body">
              <div className="org-modal-stat">
                 <div className="org-modal-value">{popupData.value}</div>
                 <div className="org-modal-sub">{popupData.sub}</div>
              </div>
              <div className="org-modal-real-chart">
                {renderPopupChart()}
              </div>
              <p className="org-modal-footer-text">Detailed Statistics</p>
            </div>
          </div>
        </div>
      )}
      <div className="org-stats-grid">
        <button className="org-stat-card org-stat-card--clickable" onClick={() => {
          openPopup('Events Created', events.length, 'Total', 'category', categoryData);
        }}>
          <div className="org-stat-icon" style={{ background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}>📅</div>
          <div className="org-stat-body">
            <div className="org-stat-label">Events Created</div>
            <div className="org-stat-value">{events.length}</div>
            <div className="org-stat-sub">Total</div>
          </div>
        </button>

        <button className="org-stat-card org-stat-card--clickable" onClick={() => {
          const revenueChartData = revenueByEvent.map(r => ({ label: r.label, value: r.revenue }));
          openPopup('Total Revenue', `₹${totalRevenue.toLocaleString()}`, 'From ticket sales', 'revenue', revenueChartData, true);
        }}>
          <div className="org-stat-icon" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>₹</div>
          <div className="org-stat-body">
            <div className="org-stat-label">Total Revenue</div>
            <div className="org-stat-value" style={{ color: '#10b981' }}>₹{totalRevenue.toLocaleString()}</div>
            <div className="org-stat-sub">From ticket sales</div>
          </div>
        </button>

        <button className="org-stat-card org-stat-card--clickable" onClick={() => {
          const ticketsChartData = events.map(ev => ({
            label: ev.title?.substring(0, 14),
            value: bookings.filter(b => b.event?._id === ev._id).reduce((s, b) => s + (b.quantity || 0), 0)
          }));
          openPopup('Tickets Sold', totalTickets, 'Across all events', 'tickets', ticketsChartData, true);
        }}>
          <div className="org-stat-icon" style={{ background: 'rgba(139,92,246,0.15)', color: '#8b5cf6' }}>🎫</div>
          <div className="org-stat-body">
            <div className="org-stat-label">Tickets Sold</div>
            <div className="org-stat-value" style={{ color: '#8b5cf6' }}>{totalTickets}</div>
            <div className="org-stat-sub">Across all events</div>
          </div>
        </button>

        <button className="org-stat-card org-stat-card--clickable" onClick={() => {
          const attendanceChartData = events.map(ev => {
            const sold = bookings.filter(b => b.event?._id === ev._id).reduce((s, b) => s + (b.quantity || 0), 0);
            const total = ev.availableSeats + sold;
            return {
              label: ev.title?.substring(0, 14),
              value: total > 0 ? Math.round((sold / total) * 100) : 0
            };
          });
          openPopup('Avg. Attendance', `${avgAttendance}%`, 'Seat fill rate', 'attendance', attendanceChartData, true);
        }}>
          <div className="org-stat-icon" style={{ background: 'rgba(236,72,153,0.15)', color: '#ec4899' }}>📈</div>
          <div className="org-stat-body">
            <div className="org-stat-label">Avg. Attendance</div>
            <div className="org-stat-value" style={{ color: '#ec4899' }}>{avgAttendance}%</div>
            <div className="org-stat-sub">Seat fill rate</div>
          </div>
        </button>
      </div>

      {events.length > 0 && (
        <div className="org-charts-row">
          <ChartCard
            title="₹ Revenue by Event"
            theme="revenue"
            onClick={() => {
              const revenueChartData = revenueByEvent.map(r => ({ label: r.label, value: r.revenue }));
              openPopup('Total Revenue', `₹${totalRevenue.toLocaleString()}`, 'From ticket sales', 'revenue', revenueChartData, true);
            }}
          >
            <RevenueHorizontalChart data={revenueByEvent} valueKey="revenue" labelKey="label" chartHeight={200} />
          </ChartCard>
          <ChartCard
            title="📂 Events by Category"
            theme="category"
            onClick={() => openPopup('Events Created', events.length, 'Category split', 'category', categoryData)}
          >
            <CategoryPieChart data={categoryData} />
          </ChartCard>
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
