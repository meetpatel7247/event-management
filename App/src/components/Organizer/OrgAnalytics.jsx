import React, { useState } from 'react';
import { TicketSparkChart } from './OrgCharts';
import ChartCard from '../charts/ChartCard';

export default function OrgAnalytics({ events, ticketsByEvent, bestEvent, mostPopularCategory, avgTicketPrice }) {
  const [popupOpen, setPopupOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'bestEvent' | 'category' | 'avgPrice' | null

  // Match best event label to actual event object
  const actualBestEvent = React.useMemo(() => {
    if (!bestEvent?.label || !events?.length) return null;
    return events.find(e => e.title?.substring(0, 14) === bestEvent.label);
  }, [bestEvent, events]);

  // Retrieve tickets sold for best event
  const bestEventTickets = React.useMemo(() => {
    if (!bestEvent?.label || !ticketsByEvent?.length) return 0;
    return ticketsByEvent.find(t => t.label === bestEvent.label)?.tickets || 0;
  }, [bestEvent, ticketsByEvent]);

  // Group events by category for category breakdown modal
  const categoryGroups = React.useMemo(() => {
    if (!events?.length) return [];
    const groups = {};
    events.forEach(ev => {
      const cat = ev.category || 'Uncategorized';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(ev);
    });
    return Object.entries(groups).map(([name, evList]) => ({
      name,
      count: evList.length,
      eventsList: evList
    })).sort((a, b) => b.count - a.count);
  }, [events]);

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

      {/* 🏆 Best Performing Event Detailed Modal */}
      {activeModal === 'bestEvent' && (
        <div className="org-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="org-modal-content org-modal-content--wide" onClick={e => e.stopPropagation()}
            style={{ maxWidth: '640px', maxHeight: '85vh', overflowY: 'auto' }}>
            <button className="org-modal-close" onClick={() => setActiveModal(null)}>✕</button>
            <h3 className="org-modal-title">🏆 Best Performing Event Details</h3>
            
            {actualBestEvent ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '12px', padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Event Title</div>
                  <h4 style={{ margin: '0.25rem 0 0', fontSize: '1.4rem', fontWeight: 800, color: '#f3f4f6' }}>{actualBestEvent.title}</h4>
                  <span className="org-badge org-badge-approved" style={{ marginTop: '0.5rem', display: 'inline-block' }}>{actualBestEvent.category}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Total Revenue</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981', marginTop: '0.2rem' }}>₹{(bestEvent?.revenue || 0).toLocaleString()}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Tickets Sold</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#a78bfa', marginTop: '0.2rem' }}>{bestEventTickets} tickets</div>
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.2rem' }}>Event Schedule & Capacity</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: '#94a3b8' }}>📅 Date:</span>
                    <strong style={{ color: '#f3f4f6' }}>{new Date(actualBestEvent.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: '#94a3b8' }}>📍 Venue/Location:</span>
                    <strong style={{ color: '#f3f4f6' }}>{actualBestEvent.location}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: '#94a3b8' }}>🪑 Remaining Seats:</span>
                    <strong style={{ color: '#ec4899' }}>{actualBestEvent.availableSeats}</strong>
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.5rem' }}>Pricing Configuration</div>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '100px', background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.12)', padding: '0.5rem', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.65rem', color: '#38bdf8', fontWeight: 700 }}>BASE</div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.1rem' }}>₹{actualBestEvent.price}</div>
                    </div>
                    <div style={{ flex: 1, minWidth: '100px', background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.12)', padding: '0.5rem', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.65rem', color: '#a78bfa', fontWeight: 700 }}>VIP</div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.1rem' }}>₹{actualBestEvent.vipPrice || 0}</div>
                    </div>
                    <div style={{ flex: 1, minWidth: '100px', background: 'rgba(236,72,153,0.06)', border: '1px solid rgba(236,72,153,0.12)', padding: '0.5rem', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.65rem', color: '#ec4899', fontWeight: 700 }}>VVIP</div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.1rem' }}>₹{actualBestEvent.vvipPrice || 0}</div>
                    </div>
                  </div>
                </div>

                {actualBestEvent.description && (
                  <div style={{ background: 'rgba(255,255,255,0.01)', padding: '1rem', borderRadius: '10px', border: '1px dashed rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.25rem' }}>Description</div>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>{actualBestEvent.description}</p>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                <div>🏆 {bestEvent?.label}</div>
                <div style={{ color: '#10b981', fontWeight: 700, fontSize: '1.2rem', marginTop: '0.5rem' }}>₹{(bestEvent?.revenue || 0).toLocaleString()}</div>
                <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: '1rem' }}>Complete details could not be matched. The event may have been modified recently.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 📂 Category Distribution Detailed Modal */}
      {activeModal === 'category' && (
        <div className="org-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="org-modal-content org-modal-content--wide" onClick={e => e.stopPropagation()}
            style={{ maxWidth: '640px', maxHeight: '85vh', overflowY: 'auto' }}>
            <button className="org-modal-close" onClick={() => setActiveModal(null)}>✕</button>
            <h3 className="org-modal-title">📂 Category Breakdown</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '12px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#a78bfa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Most Popular Category</div>
                  <h4 style={{ margin: '0.25rem 0 0', fontSize: '1.4rem', fontWeight: 800, color: '#f3f4f6' }}>{mostPopularCategory?.name || '—'}</h4>
                </div>
                <span className="org-badge org-badge-approved" style={{ fontSize: '0.8rem', padding: '0.35rem 0.8rem' }}>{mostPopularCategory?.value || 0} events</span>
              </div>

              <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.07)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <th style={{ padding: '0.75rem 1rem', color: '#64748b', textAlign: 'left', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</th>
                      <th style={{ padding: '0.75rem 1rem', color: '#64748b', textAlign: 'center', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Event Count</th>
                      <th style={{ padding: '0.75rem 1rem', color: '#64748b', textAlign: 'left', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Events</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryGroups.map((group, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', verticalAlign: 'top' }}>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#e2e8f0' }}>{group.name}</td>
                        <td style={{ padding: '0.85rem 1rem', textAlign: 'center', color: '#a78bfa', fontWeight: 700 }}>{group.count}</td>
                        <td style={{ padding: '0.85rem 1rem', color: '#94a3b8' }}>
                          <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            {group.eventsList.map(e => (
                              <li key={e._id}>{e.title} <span style={{ color: '#64748b', fontSize: '0.72rem' }}>(₹{e.price})</span></li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🎟️ Average Ticket Price Analysis Modal */}
      {activeModal === 'avgPrice' && (
        <div className="org-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="org-modal-content org-modal-content--wide" onClick={e => e.stopPropagation()}
            style={{ maxWidth: '700px', maxHeight: '85vh', overflowY: 'auto' }}>
            <button className="org-modal-close" onClick={() => setActiveModal(null)}>✕</button>
            <h3 className="org-modal-title">🎟️ Average Ticket Price Breakdown</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '12px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Average Ticket Price</div>
                  <h4 style={{ margin: '0.25rem 0 0', fontSize: '1.7rem', fontWeight: 800, color: '#10b981' }}>₹{avgTicketPrice}</h4>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#64748b' }}>
                  Across <strong style={{ color: '#f3f4f6' }}>{events.length}</strong> events
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.1rem 1.25rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)', fontSize: '0.85rem' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.4rem', letterSpacing: '0.05em' }}>Calculation Logic</div>
                <div style={{ fontFamily: 'monospace', color: '#a78bfa', background: 'rgba(15,23,42,0.4)', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.02)', marginBottom: '0.6rem' }}>
                  Average Price = (Sum of base prices) / (Total events)
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.8rem', lineHeight: 1.4 }}>
                  Sum of base prices: <strong style={{ color: '#e2e8f0' }}>₹{events.reduce((sum, e) => sum + (e.price || 0), 0).toLocaleString()}</strong>
                  <br />
                  Total events: <strong style={{ color: '#e2e8f0' }}>{events.length}</strong>
                  <br />
                  Calculation: <strong style={{ color: '#e2e8f0' }}>₹{events.reduce((sum, e) => sum + (e.price || 0), 0).toLocaleString()} / {events.length} = ₹{avgTicketPrice}</strong>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.6rem', letterSpacing: '0.05em' }}>Event Pricing Details</div>
                <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        <th style={{ padding: '0.7rem 1rem', color: '#64748b', textAlign: 'left', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Event Title</th>
                        <th style={{ padding: '0.7rem 1rem', color: '#64748b', textAlign: 'left', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</th>
                        <th style={{ padding: '0.7rem 1rem', color: '#64748b', textAlign: 'right', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Base Price</th>
                        <th style={{ padding: '0.7rem 1rem', color: '#64748b', textAlign: 'right', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>VIP Price</th>
                        <th style={{ padding: '0.7rem 1rem', color: '#64748b', textAlign: 'right', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>VVIP Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map((ev, i) => (
                        <tr key={ev._id || i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#e2e8f0' }}>{ev.title}</td>
                          <td style={{ padding: '0.75rem 1rem', color: '#94a3b8' }}>
                            <span className="org-badge org-badge-approved" style={{ fontSize: '0.65rem' }}>{ev.category}</span>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#38bdf8', fontWeight: 700 }}>₹{(ev.price || 0).toLocaleString()}</td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#a78bfa', fontWeight: 700 }}>₹{(ev.vipPrice || 0).toLocaleString()}</td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#ec4899', fontWeight: 700 }}>₹{(ev.vvipPrice || 0).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
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
            <button className="org-stat-card org-stat-card--clickable" onClick={() => setActiveModal('bestEvent')} style={{ color: 'inherit', fontFamily: 'inherit', textAlign: 'left' }}>
              <div className="org-stat-icon" style={{ background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}>🏆</div>
              <div>
                <div className="org-stat-label">Best Performing Event</div>
                <div className="org-stat-value" style={{ fontSize: '1.1rem' }}>{bestEvent?.label || '—'}</div>
                <div className="org-stat-sub" style={{ color: '#10b981' }}>₹{(bestEvent?.revenue || 0).toLocaleString()}</div>
              </div>
            </button>
            <button className="org-stat-card org-stat-card--clickable" onClick={() => setActiveModal('category')} style={{ color: 'inherit', fontFamily: 'inherit', textAlign: 'left' }}>
              <div className="org-stat-icon" style={{ background: 'rgba(139,92,246,0.15)', color: '#8b5cf6' }}>🎵</div>
              <div>
                <div className="org-stat-label">Most Popular Category</div>
                <div className="org-stat-value" style={{ fontSize: '1.1rem' }}>{mostPopularCategory?.name || '—'}</div>
                <div className="org-stat-sub" style={{ color: '#8b5cf6' }}>{mostPopularCategory?.value || 0} events</div>
              </div>
            </button>
            <button className="org-stat-card org-stat-card--clickable" onClick={() => setActiveModal('avgPrice')} style={{ color: 'inherit', fontFamily: 'inherit', textAlign: 'left' }}>
              <div className="org-stat-icon" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>₹</div>
              <div>
                <div className="org-stat-label">Avg Ticket Price</div>
                <div className="org-stat-value" style={{ fontSize: '1.1rem' }}>₹{avgTicketPrice}</div>
                <div className="org-stat-sub">Across all events</div>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
