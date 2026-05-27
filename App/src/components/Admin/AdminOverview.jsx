import React, { useState } from 'react';
import { RevenueAreaChart, CategoryDonutChart, LikesChart, SharesDonutChart } from './AdminCharts';
import ChartCard from '../charts/ChartCard';

export default function AdminOverview({
  totalRevenue, revenueGrowth, events, pendingEvents, activeOrgs, platformUsers,
  revenueTrend, categoryData, totalLikes, totalShares, engagementByEvent,
  handleApprove, handleRejectEvent,
  users = [],
  bookings = []
}) {
  const [popupData, setPopupData] = useState(null);
  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');

  const organizers = users.filter(u => u.role === 'organizer');
  const platformUsersList = users.filter(u => u.role === 'user');

  const selectedOrg = organizers.find(org => org._id === selectedOrgId);
  const orgEvents = selectedOrg ? events.filter(e => {
    const orgId = e.organizerId?._id || e.organizerId;
    return orgId && orgId.toString() === selectedOrg._id.toString();
  }) : [];
  
  const orgBookings = bookings.filter(b => {
    const bookingEventId = b.event?._id || b.event;
    return bookingEventId && orgEvents.some(e => e._id.toString() === bookingEventId.toString());
  });
  
  const orgUniqueUsersCount = new Set(orgBookings.map(b => {
    const userId = b.user?._id || b.user;
    return userId ? userId.toString() : '';
  }).filter(Boolean)).size;
  
  const orgRevenue = orgBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const selectedUser = platformUsersList.find(usr => usr._id === selectedUserId);
  const userBookings = selectedUser ? bookings.filter(b => {
    const userId = b.user?._id || b.user;
    return userId && userId.toString() === selectedUser._id.toString();
  }) : [];
  
  const userSpent = userBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

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


      {/* ── Organizer & User Analytics ── */}
      <div className="adm-section" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2rem', marginTop: '2.5rem' }}>
        
        {/* Organizer Directory Component */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifySpace: 'between', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🏢 Organizer Directory</span>
            </h3>
            <span style={{ fontSize: '0.75rem', background: 'rgba(99,102,241,0.15)', color: '#818cf8', padding: '0.2rem 0.6rem', borderRadius: '20px', fontWeight: 600 }}>
              {organizers.length} registered
            </span>
          </div>
          
          <select 
            value={selectedOrgId} 
            onChange={(e) => setSelectedOrgId(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(15,23,42,0.6)',
              color: '#f3f4f6',
              outline: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.2s',
            }}
          >
            <option value="">-- Select an Organizer --</option>
            {organizers.map(org => (
              <option key={org._id} value={org._id}>
                {org.name} ({org.email})
              </option>
            ))}
          </select>

          {selectedOrg ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'admFadeIn 0.3s ease' }}>
              {/* Org Mini Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Events</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f3f4f6' }}>{orgEvents.length}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Booked Users</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>{orgUniqueUsersCount}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Revenue</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#818cf8' }}>₹{orgRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>
              </div>

              {/* Created Events list */}
              <div>
                <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Created Events</h4>
                {orgEvents.length === 0 ? (
                  <div style={{ color: '#475569', fontSize: '0.85rem', fontStyle: 'italic' }}>No events created yet.</div>
                ) : (
                  <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                      <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <th style={{ padding: '0.5rem', textAlign: 'left', color: '#64748b' }}>Event</th>
                          <th style={{ padding: '0.5rem', textAlign: 'center', color: '#64748b' }}>Status</th>
                          <th style={{ padding: '0.5rem', textAlign: 'center', color: '#64748b' }}>Sold</th>
                          <th style={{ padding: '0.5rem', textAlign: 'right', color: '#64748b' }}>Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orgEvents.map(e => {
                          const evRevenue = bookings
                            .filter(b => b.event && (b.event._id || b.event).toString() === e._id.toString())
                            .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
                          const evSold = bookings
                            .filter(b => b.event && (b.event._id || b.event).toString() === e._id.toString())
                            .reduce((sum, b) => sum + (b.quantity || 0), 0);
                          return (
                            <tr key={e._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                              <td style={{ padding: '0.5rem', color: '#e2e8f0', fontWeight: 600 }}>{e.title}</td>
                              <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                                <span style={{ 
                                  padding: '0.1rem 0.4rem', 
                                  borderRadius: '6px', 
                                  fontSize: '0.65rem', 
                                  fontWeight: 700,
                                  background: e.isApproved ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                                  color: e.isApproved ? '#10b981' : '#f59e0b'
                                }}>
                                  {e.isApproved ? 'Approved' : 'Pending'}
                                </span>
                              </td>
                              <td style={{ padding: '0.5rem', textAlign: 'center', color: '#e2e8f0' }}>{evSold}</td>
                              <td style={{ padding: '0.5rem', textAlign: 'right', color: '#818cf8', fontWeight: 600 }}>₹{evRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#475569', fontSize: '0.85rem', fontStyle: 'italic', background: 'rgba(255,255,255,0.01)', borderRadius: '10px', border: '1px dashed rgba(255,255,255,0.05)' }}>
              Select an organizer from the dropdown to check their created events, registered user counts, and platform sales.
            </div>
          )}
        </div>

        {/* User Insights Component */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>👥 User Insights</span>
            </h3>
            <span style={{ fontSize: '0.75rem', background: 'rgba(236,72,153,0.15)', color: '#ec4899', padding: '0.2rem 0.6rem', borderRadius: '20px', fontWeight: 600 }}>
              {platformUsersList.length} users
            </span>
          </div>

          <select 
            value={selectedUserId} 
            onChange={(e) => setSelectedUserId(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(15,23,42,0.6)',
              color: '#f3f4f6',
              outline: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.2s',
            }}
          >
            <option value="">-- Select a User --</option>
            {platformUsersList.map(usr => (
              <option key={usr._id} value={usr._id}>
                {usr.name} ({usr.email})
              </option>
            ))}
          </select>

          {selectedUser ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'admFadeIn 0.3s ease' }}>
              {/* User Mini Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Bookings Made</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f3f4f6' }}>{userBookings.length}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Total Spent</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ec4899' }}>₹{userSpent.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>
              </div>

              {/* Bookings table */}
              <div>
                <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Booking Details</h4>
                {userBookings.length === 0 ? (
                  <div style={{ color: '#475569', fontSize: '0.85rem', fontStyle: 'italic' }}>No bookings made yet.</div>
                ) : (
                  <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                      <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <th style={{ padding: '0.5rem', textAlign: 'left', color: '#64748b' }}>Event</th>
                          <th style={{ padding: '0.5rem', textAlign: 'center', color: '#64748b' }}>Qty</th>
                          <th style={{ padding: '0.5rem', textAlign: 'center', color: '#64748b' }}>Tier</th>
                          <th style={{ padding: '0.5rem', textAlign: 'center', color: '#64748b' }}>Date</th>
                          <th style={{ padding: '0.5rem', textAlign: 'right', color: '#64748b' }}>Paid</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userBookings.map(b => (
                          <tr key={b._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <td style={{ padding: '0.5rem', color: '#e2e8f0', fontWeight: 600 }}>{b.event?.title || 'Deleted Event'}</td>
                            <td style={{ padding: '0.5rem', textAlign: 'center', color: '#e2e8f0' }}>{b.quantity}</td>
                            <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                              <span style={{ 
                                padding: '0.1rem 0.35rem', 
                                borderRadius: '5px', 
                                fontSize: '0.62rem', 
                                fontWeight: 700,
                                background: b.ticketType === 'VVIP' ? 'rgba(236,72,153,0.15)' : b.ticketType === 'VIP' ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.06)',
                                color: b.ticketType === 'VVIP' ? '#ec4899' : b.ticketType === 'VIP' ? '#a78bfa' : '#94a3b8'
                              }}>
                                {b.ticketType || 'Normal'}
                              </span>
                            </td>
                            <td style={{ padding: '0.5rem', textAlign: 'center', color: '#64748b' }}>
                              {new Date(b.bookingDate || b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </td>
                            <td style={{ padding: '0.5rem', textAlign: 'right', color: '#ec4899', fontWeight: 600 }}>₹{(b.totalPrice || 0).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#475569', fontSize: '0.85rem', fontStyle: 'italic', background: 'rgba(255,255,255,0.01)', borderRadius: '10px', border: '1px dashed rgba(255,255,255,0.05)' }}>
              Select a user from the dropdown to check their ticket purchases, total spent, and detailed bookings list.
            </div>
          )}
        </div>
      </div>
      <div className="adm-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h3 className="adm-section-title" style={{ margin: 0 }}>Pending Approvals</h3>
        </div>

        {pendingEvents.length === 0 ? (
          <div className="adm-empty">✅ No pending events — all caught up!</div>
        ) : (
          <div className="adm-pending-list">
            {pendingEvents.map(ev => {
              return (
                <div key={ev._id} className="adm-pending-row" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '3px solid #f59e0b' }}>
                  <div className="adm-pending-info" style={{ flex: 1 }}>
                    <div className="adm-pending-name">{ev.title}</div>
                    <div className="adm-pending-meta">
                      by {ev.organizerName || ev.organizerId?.name || 'Unknown'} • {new Date(ev.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                    </div>
                  </div>
                  <div className="adm-pending-actions">
                    <button className="adm-btn adm-btn-view" onClick={() => window.open(`/event/${ev._id}`,'_blank')}>👁 View</button>
                    <button className="adm-btn adm-btn-approve" onClick={() => handleApprove(ev._id)}>✓ Approve</button>
                    <button className="adm-btn adm-btn-reject" onClick={() => handleRejectEvent(ev._id)}>✕ Reject</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
