import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { statusBadge } from './OrgBadges';

export default function OrgHistory({ events = [], bookings = [], setActiveTab }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');

  const filtered = useMemo(() => {
    if (filter === 'Approved') return events.filter(e => e.isApproved);
    if (filter === 'Pending') return events.filter(e => !e.isApproved);
    return events;
  }, [events, filter]);

  const rejectedCount = 0;

  return (
    <div className="org-panel org-history-panel" style={{ animation: 'orgFadeIn 0.3s ease' }}>
      <div className="org-myevents-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 className="org-section-title" style={{ margin: 0 }}>Event Submission History</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem' }}>Track all approved and pending event lifecycle stages</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['All', 'Approved', 'Pending'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '8px',
                border: filter === f ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                background: filter === f ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                color: filter === f ? '#a78bfa' : '#cbd5e1',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {rejectedCount > 0 && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.06)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem',
          fontSize: '0.85rem',
          color: '#f87171',
          lineHeight: '1.5'
        }}>
          <span style={{ fontSize: '1.25rem' }}>💡</span>
          <div>
            <strong>Action Required:</strong> You have {rejectedCount} rejected event submission(s). 
            To resubmit, simply go to the <strong>"My Events"</strong> tab, click <strong>"Edit"</strong> on the rejected event, make your corrections, and save. The event status will automatically reset to Pending for Admin re-evaluation.
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="org-empty" style={{ padding: '3rem 1rem', background: 'rgba(255, 255, 255, 0.01)', borderRadius: '12px', border: '1px dashed rgba(255, 255, 255, 0.06)' }}>
          No event submissions match the "{filter}" filter.
        </div>
      ) : (
        <div className="org-table-wrap" style={{ border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>Event Title</th>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>Category</th>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>Ticket price</th>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600, textAlign: 'center' }}>Status</th>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(ev => {
                const isPast = new Date(ev.date) < new Date(new Date().setHours(0,0,0,0));
                return (
                  <tr key={ev._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)', transition: 'background 0.2s' }} className="org-table-row-hover">
                    <td style={{ padding: '1rem', color: '#f3f4f6', fontWeight: 600 }}>{ev.title}</td>
                    <td style={{ padding: '1rem', color: '#cbd5e1' }}>{ev.category}</td>
                    <td style={{ padding: '1rem', color: '#cbd5e1' }}>{new Date(ev.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td style={{ padding: '1rem', color: '#38bdf8', fontWeight: 600 }}>₹{ev.price}</td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      {statusBadge(ev)}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button
                          onClick={() => navigate(`/event/${ev._id}`)}
                          style={{
                            padding: '0.35rem 0.7rem',
                            borderRadius: '6px',
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            color: '#cbd5e1',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                        >
                          👁 View
                        </button>
                        {/* No rejected action button needed */}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
