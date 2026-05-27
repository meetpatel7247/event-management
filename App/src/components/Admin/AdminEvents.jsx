import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from './AdminBadges';
import { eventApi } from '../../utils/api';
import { toast } from 'react-toastify';

export default function AdminEvents({
  filteredEvents, eventSearch, setEventSearch, eventFilter, setEventFilter,
  bookings, handleApprove, handleRejectEvent, onEventUpdated
}) {
  const navigate = useNavigate();

  return (
    <div className="adm-panel">
      <div className="adm-search-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '300px', flexWrap: 'wrap' }}>
          <div className="adm-search-input-wrap" style={{ flex: 1 }}>
            <span className="adm-search-icon">🔍</span>
            <input className="adm-search-input" placeholder="Search events…"
              value={eventSearch} onChange={e => setEventSearch(e.target.value)} />
          </div>
          <div className="adm-filter-group" style={{ margin: 0 }}>
            {['All','Pending','Approved'].map(f => (
              <button key={f}
                className={`adm-filter-btn ${eventFilter === f ? 'adm-filter-active' : ''}`}
                onClick={() => setEventFilter(f)}>{f}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>EVENT</th>
              <th>ORGANIZER</th>
              <th>TICKET PRICES</th>
              <th>DATE</th>
              <th>STATUS</th>
              <th>❤️ LIKES</th>
              <th>🔗 SHARES</th>
              <th>REVENUE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length === 0 && (
              <tr><td colSpan={9} className="adm-table-empty">No events match your filter.</td></tr>
            )}
            {filteredEvents.map(ev => {
              const rev = bookings.filter(b => b.event?._id === ev._id).reduce((s,b) => s+(b.totalPrice||0), 0);
              const isPast = new Date(ev.date) < new Date(new Date().setHours(0,0,0,0));

              const handleRejectEdits = async (id) => {
                try {
                  await eventApi.updateEvent(id, { rejectEdits: true });
                  toast.success('Pending edits discarded.');
                  if (onEventUpdated) onEventUpdated();
                } catch (e) {
                  toast.error(e.response?.data?.message || 'Failed to discard edits');
                }
              };

              return (
                <tr key={ev._id} className="adm-table-row">
                  <td>
                    <div className="adm-ev-name">{ev.title}</div>
                    <div className="adm-ev-cat">{ev.category}</div>
                    {ev.hasPendingEdits && ev.tempEdits && (
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: '#60a5fa', 
                        marginTop: '0.4rem', 
                        background: 'rgba(59,130,246,0.08)',
                        padding: '0.4rem 0.6rem',
                        borderRadius: '4px',
                        borderLeft: '3px solid #3b82f6',
                        fontFamily: 'monospace'
                      }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '0.2rem', color: '#93c5fd' }}>Pending Changes:</div>
                        {Object.entries(ev.tempEdits).map(([key, val]) => {
                          if (key === 'image') return <div key={key}>• image updated</div>;
                          return (
                            <div key={key}>
                              • {key}: <span style={{ textDecoration: 'line-through', color: '#94a3b8' }}>{String(ev[key] ?? 'N/A')}</span> → <span style={{ color: '#34d399' }}>{String(val ?? 'N/A')}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </td>
                  <td>{ev.organizerName || ev.organizerId?.name || '—'}</td>
                  <td>
                    <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                      Normal: <strong style={{ color: '#38bdf8' }}>₹{ev.price ?? 0}</strong><br />
                      VIP: <strong style={{ color: '#a78bfa' }}>₹{ev.vipPrice ?? 0}</strong><br />
                      VVIP: <strong style={{ color: '#ec4899' }}>₹{ev.vvipPrice ?? 0}</strong>
                    </div>
                  </td>
                  <td>{new Date(ev.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</td>
                  <td><StatusBadge approved={ev.isApproved} past={isPast} hasPendingEdits={ev.hasPendingEdits} rejected={ev.isRejected} /></td>
                  <td style={{ color:'#fb7185', fontWeight:600 }}>{ev.likes || 0}</td>
                  <td style={{ color:'#60a5fa', fontWeight:600 }}>{ev.shares || 0}</td>
                  <td style={{ color:'#10b981', fontWeight:600 }}>₹{rev.toFixed(1)}</td>
                  <td>
                    <div className="adm-row-actions">
                      <button className="adm-icon-btn adm-icon-view" title="View" onClick={() => navigate(`/event/${ev._id}`)}>👁</button>
                      {(!ev.isApproved || ev.hasPendingEdits || ev.isRejected) && (
                        <button className="adm-icon-btn adm-icon-approve" title="Approve" onClick={() => handleApprove(ev._id)}>✓</button>
                      )}
                      {ev.hasPendingEdits ? (
                        <button className="adm-icon-btn adm-icon-reject" title="Reject Edits" onClick={() => handleRejectEdits(ev._id)}>✕</button>
                      ) : (
                        (!ev.isApproved && !ev.isRejected) && (
                          <button className="adm-icon-btn adm-icon-reject" title="Reject" onClick={() => handleRejectEvent(ev._id)}>✕</button>
                        )
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
