import React, { useState } from 'react';
import { RevenueAreaChart, CategoryDonutChart, LikesChart, SharesDonutChart } from './AdminCharts';
import ChartCard from '../charts/ChartCard';

export default function AdminOverview({
  totalRevenue, revenueGrowth, events, pendingEvents, activeOrgs, platformUsers,
  revenueTrend, categoryData, totalLikes, totalShares, engagementByEvent,
  handleApprove, handleRejectEvent, setActiveTab
}) {
  const [popupData, setPopupData] = useState(null);

  const openPopup = (title, value, sub, chartType, chartData, valueKey = "value", labelKey = "label", wide = false) => {
    setPopupData({ title, value, sub, chartType, chartData, valueKey, labelKey, wide });
  };
  const closePopup = () => setPopupData(null);

  return (
    <div className="adm-panel">
      {popupData && (
        <div className="adm-modal-overlay" onClick={closePopup}>
          <div className={`adm-modal-content ${popupData.wide ? 'adm-modal-content--wide' : ''}`} onClick={e => e.stopPropagation()}>
            <button className="adm-modal-close" onClick={closePopup}>✕</button>
            <h3 className="adm-modal-title">{popupData.title}</h3>
            <div className="adm-modal-body">
              <div className="adm-modal-stat">
                 <div className="adm-modal-value">{popupData.value}</div>
                 <div className="adm-modal-sub">{popupData.sub}</div>
              </div>
              <div className="adm-modal-real-chart">
                 {(() => {
                   const hasCount = popupData.chartData?.some(d => (d[popupData.valueKey] || 0) > 0);
                   const { chartType, chartData, valueKey, labelKey } = popupData;
                   if (chartType === 'revenue' && chartData?.length > 0) {
                     return <RevenueAreaChart data={chartData} valueKey={valueKey} labelKey={labelKey} chartHeight={220} />;
                   }
                   if (chartType === 'category' && hasCount) {
                     return <CategoryDonutChart data={chartData} valueKey={valueKey} labelKey={labelKey} chartHeight={220} />;
                   }
                   if (chartType === 'likes' && hasCount) {
                     return <LikesChart data={chartData} valueKey={valueKey} labelKey={labelKey} chartHeight={240} />;
                   }
                   if (chartType === 'shares' && hasCount) {
                     return <SharesDonutChart data={chartData} valueKey={valueKey} labelKey={labelKey} chartHeight={240} />;
                   }
                   return <div className="dash-chart-empty">No data to display</div>;
                 })()}
              </div>
              <p className="adm-modal-footer-text">Detailed Statistics</p>
            </div>
          </div>
        </div>
      )}
      <div className="adm-stats-grid">
        <button className="adm-stat-card adm-stat-card--clickable" onClick={() => {
          openPopup('Total Revenue', `₹${totalRevenue.toLocaleString(undefined,{minimumFractionDigits:1,maximumFractionDigits:1})}`, `Growth: ${revenueGrowth >= 0 ? '+' : ''}${revenueGrowth}%`, 'revenue', revenueTrend, 'revenue', 'label', true);
        }}>
          <div className="adm-stat-icon" style={{ background:'rgba(16,185,129,0.15)', color:'#10b981' }}>₹</div>
          <div className="adm-stat-body">
            <div className="adm-stat-label">Total Platform Revenue</div>
            <div className="adm-stat-value" style={{ color:'#10b981' }}>₹{totalRevenue.toLocaleString(undefined,{minimumFractionDigits:1,maximumFractionDigits:1})}</div>
          </div>
        </button>

        <button className="adm-stat-card adm-stat-card--clickable" onClick={() => {
          openPopup('Total Events', events.length, `${pendingEvents.length} pending events`, 'category', categoryData, 'count', 'name', true);
        }}>
          <div className="adm-stat-icon" style={{ background:'rgba(99,102,241,0.15)', color:'#818cf8' }}>📅</div>
          <div className="adm-stat-body">
            <div className="adm-stat-label">Total Events</div>
            <div className="adm-stat-value">{events.length}</div>
            {pendingEvents.length > 0 && <div className="adm-stat-chip" style={{ color:'#f59e0b' }}>{pendingEvents.length} pending</div>}
          </div>
        </button>

        <button className="adm-stat-card adm-stat-card--clickable" onClick={() => {
          const userSplit = [{ label: 'Organizers', count: activeOrgs }, { label: 'Platform Users', count: platformUsers }];
          openPopup('Active Organizers', activeOrgs, 'Registered organizers', 'category', userSplit, 'count', 'label');
        }}>
          <div className="adm-stat-icon" style={{ background:'rgba(139,92,246,0.15)', color:'#a78bfa' }}>⚡</div>
          <div className="adm-stat-body">
            <div className="adm-stat-label">Active Organizers</div>
            <div className="adm-stat-value">{activeOrgs}</div>
          </div>
        </button>

        <button className="adm-stat-card adm-stat-card--clickable" onClick={() => {
          const userSplit = [{ label: 'Organizers', count: activeOrgs }, { label: 'Platform Users', count: platformUsers }];
          openPopup('Platform Users', platformUsers, 'Total registered users', 'category', userSplit, 'count', 'label');
        }}>
          <div className="adm-stat-icon" style={{ background:'rgba(236,72,153,0.15)', color:'#ec4899' }}>👤</div>
          <div className="adm-stat-body">
            <div className="adm-stat-label">Platform Users</div>
            <div className="adm-stat-value">{platformUsers}</div>
          </div>
        </button>

        <button className="adm-stat-card adm-stat-card--clickable" onClick={() => {
          const likeData = engagementByEvent.map(e => ({ name: e.name, count: e.likes }));
          openPopup('Total Likes', totalLikes, 'Across all events', 'likes', likeData, 'count', 'name', true);
        }}>
          <div className="adm-stat-icon" style={{ background:'rgba(244,63,94,0.15)', color:'#fb7185' }}>❤️</div>
          <div className="adm-stat-body">
            <div className="adm-stat-label">Total Likes</div>
            <div className="adm-stat-value" style={{ color:'#fb7185' }}>{totalLikes}</div>
            <div className="adm-stat-chip" style={{ color:'#94a3b8' }}>User engagement</div>
          </div>
        </button>

        <button className="adm-stat-card adm-stat-card--clickable" onClick={() => {
          const shareData = engagementByEvent.map(e => ({ name: e.name, count: e.shares }));
          openPopup('Total Shares', totalShares, 'Across all events', 'shares', shareData, 'count', 'name', true);
        }}>
          <div className="adm-stat-icon" style={{ background:'rgba(59,130,246,0.15)', color:'#60a5fa' }}>🔗</div>
          <div className="adm-stat-body">
            <div className="adm-stat-label">Total Shares</div>
            <div className="adm-stat-value" style={{ color:'#60a5fa' }}>{totalShares}</div>
            <div className="adm-stat-chip" style={{ color:'#94a3b8' }}>Link copies & shares</div>
          </div>
        </button>
      </div>

      <div className="adm-charts-row">
        <ChartCard
          title="₹ Revenue Trend"
          theme="revenue"
          onClick={() => openPopup(
            'Revenue Trend',
            `₹${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`,
            `Growth: ${revenueGrowth >= 0 ? '+' : ''}${revenueGrowth}%`,
            'revenue', revenueTrend, 'revenue', 'label', true
          )}
        >
          <RevenueAreaChart data={revenueTrend} valueKey="revenue" labelKey="label" chartHeight={200} />
        </ChartCard>

        <ChartCard
          title="📂 Events by Category"
          theme="category"
          empty={categoryData.length === 0}
          emptyText="No events yet"
          onClick={() => categoryData.length > 0 && openPopup(
            'Events by Category', events.length, 'Breakdown by type',
            'category', categoryData, 'count', 'name', true
          )}
        >
          <CategoryDonutChart data={categoryData} valueKey="count" labelKey="name" chartHeight={200} />
        </ChartCard>
      </div>

      <div className="adm-charts-row adm-charts-row--engagement">
        <ChartCard
          title="❤️ Likes by Event"
          theme="likes"
          empty={!engagementByEvent.some(e => e.likes > 0)}
          emptyText="No likes yet"
          onClick={() => {
            const likeData = engagementByEvent.map(e => ({ name: e.name, count: e.likes }));
            openPopup('Total Likes', totalLikes, 'Per event breakdown', 'likes', likeData, 'count', 'name', true);
          }}
        >
          <LikesChart
            data={engagementByEvent.filter(e => e.likes > 0).map(e => ({ name: e.name, count: e.likes }))}
            valueKey="count"
            labelKey="name"
            chartHeight={220}
          />
        </ChartCard>

        <ChartCard
          title="🔗 Shares by Event"
          theme="shares"
          empty={!engagementByEvent.some(e => e.shares > 0)}
          emptyText="No shares yet"
          onClick={() => {
            const shareData = engagementByEvent.map(e => ({ name: e.name, count: e.shares }));
            openPopup('Total Shares', totalShares, 'Per event breakdown', 'shares', shareData, 'count', 'name', true);
          }}
        >
          <SharesDonutChart
            data={engagementByEvent.filter(e => e.shares > 0).map(e => ({ name: e.name, count: e.shares }))}
            valueKey="count"
            labelKey="name"
            chartHeight={220}
          />
        </ChartCard>
      </div>

      <div className="adm-section">
        <h3 className="adm-section-title">Event Engagement (Likes & Shares)</h3>
        {events.length === 0 ? (
          <div className="adm-empty">No events yet.</div>
        ) : (
          <div className="adm-engagement-table-wrap">
            <table className="adm-table adm-engagement-table">
              <thead>
                <tr>
                  <th>EVENT</th>
                  <th>❤️ LIKES</th>
                  <th>🔗 SHARES</th>
                  <th>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {[...events]
                  .sort((a, b) => ((b.likes || 0) + (b.shares || 0)) - ((a.likes || 0) + (a.shares || 0)))
                  .map(ev => (
                    <tr key={ev._id} className="adm-table-row">
                      <td>
                        <div className="adm-ev-name">{ev.title}</div>
                        <div className="adm-ev-cat">{ev.category}</div>
                      </td>
                      <td style={{ color:'#fb7185', fontWeight:700 }}>{ev.likes || 0}</td>
                      <td style={{ color:'#60a5fa', fontWeight:700 }}>{ev.shares || 0}</td>
                      <td style={{ fontWeight:700 }}>{(ev.likes || 0) + (ev.shares || 0)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
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
