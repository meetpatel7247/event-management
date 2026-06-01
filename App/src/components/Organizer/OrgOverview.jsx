import React, { useState } from 'react';
import {
  RevenueHorizontalChart,
  CategoryPieChart,
  TicketsVerticalChart,
  AttendanceProgressChart,
} from './OrgCharts';
import ChartCard from '../charts/ChartCard';

export default function OrgOverview({
  events, bookings, totalRevenue, totalTickets,
  revenueByEvent, categoryData
}) {
  const [popupData, setPopupData] = useState(null);
  const [discountCalc, setDiscountCalc] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [showUsersModal, setShowUsersModal] = useState(false);

  // All unique users who booked any of this organizer's events
  const bookedUserRows = bookings.map(b => ({
    userId: b.user?._id || b.userId || '—',
    name: b.user?.name || 'Guest',
    email: b.user?.email || '',
    event: b.event?.title || '—',
    ticketType: b.ticketType || 'Normal',
    quantity: b.quantity || 0,
    totalPaid: b.totalPrice || 0,
  }));
  const uniqueUsersCount = new Set(bookings.map(b => (b.user?._id || b.userId || '').toString()).filter(Boolean)).size;

  const selectedEvent = events.find(e => e._id === selectedEventId);
  const eventBookings = selectedEvent ? bookings.filter(b => b.event && (b.event._id || b.event).toString() === selectedEvent._id.toString()) : [];
  const eventSold = eventBookings.reduce((sum, b) => sum + (b.quantity || 0), 0);
  const eventTotalSeats = selectedEvent ? (selectedEvent.availableSeats || 0) + eventSold : 0;
  const eventRevenue = eventBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

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
      {/* ── Users Booked Modal ── */}
      {showUsersModal && (
        <div className="org-modal-overlay" onClick={() => setShowUsersModal(false)}>
          <div className="org-modal-content org-modal-content--wide" onClick={e => e.stopPropagation()}
            style={{ width: '90%', maxWidth: '820px', maxHeight: '80vh', overflowY: 'auto' }}>
            <button className="org-modal-close" onClick={() => setShowUsersModal(false)}>✕</button>
            <h3 className="org-modal-title">👥 Users Who Booked Your Events</h3>
            <div style={{ marginBottom: '1rem', display: 'flex', gap: '1.5rem', fontSize: '0.82rem', color: '#64748b' }}>
              <span>Total bookings: <strong style={{ color: '#f3f4f6' }}>{bookedUserRows.length}</strong></span>
              <span>Unique users: <strong style={{ color: '#a78bfa' }}>{uniqueUsersCount}</strong></span>
            </div>
            {bookedUserRows.length === 0 ? (
              <div style={{ padding: '2.5rem', textAlign: 'center', color: '#475569', fontStyle: 'italic' }}>No bookings yet across your events.</div>
            ) : (
              <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.07)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <th style={{ padding: '0.7rem 1rem', color: '#64748b', textAlign: 'left', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User</th>
                      <th style={{ padding: '0.7rem 1rem', color: '#64748b', textAlign: 'left', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User ID</th>
                      <th style={{ padding: '0.7rem 1rem', color: '#64748b', textAlign: 'left', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Event</th>
                      <th style={{ padding: '0.7rem 1rem', color: '#64748b', textAlign: 'center', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ticket Type</th>
                      <th style={{ padding: '0.7rem 1rem', color: '#64748b', textAlign: 'center', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Qty</th>
                      <th style={{ padding: '0.7rem 1rem', color: '#64748b', textAlign: 'right', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookedUserRows.map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <div style={{ fontWeight: 600, color: '#e2e8f0' }}>{row.name}</div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{row.email}</div>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', color: '#475569', fontFamily: 'monospace', fontSize: '0.72rem' }}>
                          {String(row.userId).slice(-8)}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', color: '#94a3b8', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {row.event}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                          <span style={{
                            padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 700,
                            background: row.ticketType === 'VVIP' ? 'rgba(236,72,153,0.18)' : row.ticketType === 'VIP' ? 'rgba(139,92,246,0.18)' : 'rgba(56,189,248,0.12)',
                            color: row.ticketType === 'VVIP' ? '#ec4899' : row.ticketType === 'VIP' ? '#a78bfa' : '#38bdf8',
                          }}>{row.ticketType}</span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: '#e2e8f0', fontWeight: 700 }}>{row.quantity}</td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#10b981', fontWeight: 700 }}>₹{row.totalPaid.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {popupData && (
        <div className="org-modal-overlay" onClick={closePopup}>
          <div className="org-modal-content org-modal-content--wide" onClick={e => e.stopPropagation()}
            style={{ width: '90%', maxWidth: '820px', maxHeight: '80vh', overflowY: 'auto' }}>
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
            </div>
          </div>
        </div>
      )}

      {discountCalc && (
        <div className="org-modal-overlay" onClick={() => setDiscountCalc(null)}>
          <div className="org-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px', background: 'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95))', border: '1px solid rgba(251,191,36,0.3)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', padding: '1.75rem', borderRadius: '20px' }}>
            <button className="org-modal-close" onClick={() => setDiscountCalc(null)}>✕</button>
            <h3 className="org-modal-title" style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 1rem 0', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
              <span>🎁 Booking Calculation</span>
            </h3>
            <div className="org-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '0.25rem 0' }}>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5' }}>
                Here is the exact calculation of the bulk discount applied to this attendee's booking for <strong>{discountCalc.title}</strong>:
              </p>
              
              <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: '#94a3b8' }}>Ticket Unit Price:</span>
                  <strong style={{ color: '#f3f4f6' }}>₹{discountCalc.price.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: '#94a3b8' }}>Tickets Booked:</span>
                  <strong style={{ color: '#f3f4f6' }}>{discountCalc.actualQty} tickets</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: '#94a3b8' }}>Discount Percentage:</span>
                  <strong style={{ color: '#fbbf24' }}>{discountCalc.discount}% off</strong>
                </div>
                
                <hr style={{ border: '0', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '0.25rem 0' }} />
                
                <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Calculation:</div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: '#94a3b8' }}>1. Subtotal ({discountCalc.actualQty} × ₹{discountCalc.price.toLocaleString()}):</span>
                  <span style={{ color: '#f3f4f6', fontWeight: 500 }}>₹{(discountCalc.actualQty * discountCalc.price).toLocaleString()}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: '#94a3b8' }}>2. Bulk Savings ({discountCalc.discount}%):</span>
                  <span style={{ color: '#ef4444', fontWeight: 700 }}>-₹{discountCalc.savings.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                
                <hr style={{ border: '0', borderTop: '1px dashed rgba(255,255,255,0.08)', margin: '0.25rem 0' }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 800 }}>
                  <span style={{ color: '#fbbf24' }}>Actual Price Paid:</span>
                  <span style={{ color: '#10b981' }}>₹{discountCalc.paid.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#10b981', lineHeight: '1.45' }}>
                <span>💡</span>
                <span>Attendee met the criteria by ordering {discountCalc.actualQty} tickets (minimum required: {discountCalc.minTickets}), saving a total of ₹{discountCalc.savings.toLocaleString(undefined, { maximumFractionDigits: 0 })}.</span>
              </div>
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

        <button className="org-stat-card org-stat-card--clickable" onClick={() => setShowUsersModal(true)}>
          <div className="org-stat-icon" style={{ background: 'rgba(236,72,153,0.15)', color: '#ec4899' }}>👥</div>
          <div className="org-stat-body">
            <div className="org-stat-label">Users Booked</div>
            <div className="org-stat-value" style={{ color: '#ec4899' }}>{uniqueUsersCount}</div>
            <div className="org-stat-sub">Click to view details</div>
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


      {/* ── Event Analyzer Dropdown ── */}
      <div className="org-section" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.5rem', marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>📈 Event Analyzer & Attendees</span>
          </h3>
          <span style={{ fontSize: '0.75rem', background: 'rgba(139,92,246,0.15)', color: '#a78bfa', padding: '0.2rem 0.6rem', borderRadius: '20px', fontWeight: 600 }}>
            {events.length} events
          </span>
        </div>

        <select 
          value={selectedEventId} 
          onChange={(e) => setSelectedEventId(e.target.value)}
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
          <option value="">-- Select an Event to Analyze --</option>
          {events.map(ev => (
            <option key={ev._id} value={ev._id}>
              {ev.title} ({new Date(ev.date).toLocaleDateString()})
            </option>
          ))}
        </select>

        {selectedEvent ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'admFadeIn 0.3s ease' }}>
            
            {/* Stats Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {/* Ticket Sales */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.3rem', fontWeight: 600 }}>Tickets Sold</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f3f4f6' }}>
                  {eventSold} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#64748b' }}>/ {eventTotalSeats} seats</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', marginTop: '0.6rem', overflow: 'hidden' }}>
                  <div style={{ width: `${eventTotalSeats > 0 ? (eventSold / eventTotalSeats) * 100 : 0}%`, height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #ec4899)', borderRadius: '10px' }} />
                </div>
              </div>

              {/* Revenue */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.3rem', fontWeight: 600 }}>Revenue Generated</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>₹{eventRevenue.toLocaleString()}</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.6rem' }}>Avg ticket price: ₹{eventSold > 0 ? Math.round(eventRevenue / eventSold) : 0}</div>
              </div>

              {/* Price Tiers */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.4rem', fontWeight: 600 }}>Ticket Pricing</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>Normal:</span> <strong style={{ color: '#38bdf8' }}>₹{selectedEvent.price}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>VIP:</span> <strong style={{ color: '#a78bfa' }}>₹{selectedEvent.vipPrice || 0}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>VVIP:</span> <strong style={{ color: '#ec4899' }}>₹{selectedEvent.vvipPrice || 0}</strong>
                  </div>
                </div>
              </div>


            </div>

            {/* Attendees Details Table */}
            <div>
              <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.88rem', color: '#f3f4f6', fontWeight: 600 }}>Attendee Directory</h4>
              {eventBookings.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#475569', fontSize: '0.88rem', fontStyle: 'italic', background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.04)', borderRadius: '10px' }}>
                  No bookings registered for this event yet.
                </div>
              ) : (
                <div style={{ overflowX: 'auto', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        <th style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User Name</th>
                        <th style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Quantity</th>
                        <th style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Ticket Type</th>
                        <th style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Discount</th>
                        <th style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Booking Date</th>
                        <th style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Total Paid</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventBookings.map(b => {
                        const unitPrice = b.ticketType === 'VVIP' ? (selectedEvent.vvipPrice || 0) : b.ticketType === 'VIP' ? (selectedEvent.vipPrice || 0) : (selectedEvent.price || 0);
                        const subtotal = unitPrice * b.quantity;
                        const hasDiscount = selectedEvent.offerDiscount > 0 && selectedEvent.offerMinTickets > 0 && b.quantity >= selectedEvent.offerMinTickets;
                        const savings = hasDiscount ? (subtotal * selectedEvent.offerDiscount) / 100 : 0;
                        const calculatedPaid = subtotal - savings;
                        
                        return (
                          <tr key={b._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }}>
                            <td style={{ padding: '0.8rem 1rem', fontWeight: 600, color: '#e2e8f0' }}>
                              <div>{b.user?.name || 'Guest User'}</div>
                              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 400 }}>{b.user?.email || ''}</div>
                            </td>
                            <td style={{ padding: '0.8rem 1rem', textAlign: 'center', color: '#e2e8f0', fontWeight: 600 }}>{b.quantity}</td>
                            <td style={{ padding: '0.8rem 1rem', textAlign: 'center' }}>
                              <span style={{ 
                                padding: '0.15rem 0.5rem', 
                                borderRadius: '6px', 
                                fontSize: '0.65rem', 
                                fontWeight: 700,
                                background: b.ticketType === 'VVIP' ? 'rgba(236,72,153,0.15)' : b.ticketType === 'VIP' ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.06)',
                                color: b.ticketType === 'VVIP' ? '#ec4899' : b.ticketType === 'VIP' ? '#a78bfa' : '#cbd5e1'
                              }}>
                                {b.ticketType || 'Normal'}
                              </span>
                            </td>
                            <td style={{ padding: '0.8rem 1rem', textAlign: 'center' }}>
                              {savings > 0 ? (
                                <button 
                                  onClick={() => setDiscountCalc({
                                    title: selectedEvent.title,
                                    price: unitPrice,
                                    discount: selectedEvent.offerDiscount,
                                    minTickets: selectedEvent.offerMinTickets,
                                    actualQty: b.quantity,
                                    savings: savings,
                                    paid: calculatedPaid
                                  })}
                                  title="Click to view booking calculation"
                                  style={{
                                    padding: '0.15rem 0.5rem', 
                                    borderRadius: '6px', 
                                    fontSize: '0.68rem', 
                                    fontWeight: 700,
                                    background: 'rgba(251,191,36,0.15)',
                                    color: '#fbbf24',
                                    border: '1px solid rgba(251,191,36,0.3)',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.2rem',
                                    transition: 'all 0.2s ease',
                                  }}
                                  onMouseEnter={e => {
                                    e.currentTarget.style.background = 'rgba(251,191,36,0.25)';
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                  }}
                                  onMouseLeave={e => {
                                    e.currentTarget.style.background = 'rgba(251,191,36,0.15)';
                                    e.currentTarget.style.transform = 'scale(1)';
                                  }}
                                >
                                  🎁 {selectedEvent.offerDiscount}%
                                </button>
                              ) : (
                                <span style={{ color: '#475569', fontSize: '0.75rem' }}>—</span>
                              )}
                            </td>
                            <td style={{ padding: '0.8rem 1rem', textAlign: 'center', color: '#64748b' }}>
                              {new Date(b.bookingDate || b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td style={{ padding: '0.8rem 1rem', textAlign: 'right', color: '#10b981', fontWeight: 700 }}>
                              ₹{calculatedPaid.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                            </td>
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
          <div style={{ minHeight: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem 1.5rem', color: '#475569', fontSize: '0.88rem', fontStyle: 'italic', background: 'rgba(255,255,255,0.01)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.05)', boxSizing: 'border-box' }}>
            Select one of your created events from the dropdown above to view real-time bookings, seats configuration, and ticket purchasers.
          </div>
        )}
      </div>

    </div>
  );
}
