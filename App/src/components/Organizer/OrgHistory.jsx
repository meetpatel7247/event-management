import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { statusBadge } from './OrgBadges';

export default function OrgHistory({ events = [] }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');

  const filtered = useMemo(() => {
    if (filter === 'Approved') return events.filter(e => e.isApproved && !e.isRejected);
    if (filter === 'Pending') return events.filter(e => !e.isApproved && !e.isRejected);
    if (filter === 'Rejected') return events.filter(e => e.isRejected);
    return events;
  }, [events, filter]);

  const rejectedCount = useMemo(() => events.filter(e => e.isRejected).length, [events]);

  return (
    <div className="org-panel org-panel--content org-history-panel">
      <div className="org-history-toolbar">
        <div>
          <h3 className="org-section-title" style={{ margin: 0 }}>Event Submission History</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Track all approved and pending event lifecycle stages
          </p>
        </div>
        <div className="org-filter-bar">
          {['All', 'Approved', 'Pending', 'Rejected'].map(f => (
            <button
              key={f}
              type="button"
              className={`org-filter-btn ${filter === f ? 'org-filter-btn--active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {rejectedCount > 0 && (
        <div className="org-alert-banner">
          <span style={{ fontSize: '1.25rem' }}>💡</span>
          <div>
            <strong>Action Required:</strong> You have {rejectedCount} rejected event submission(s).
            To resubmit, go to <strong>My Events</strong>, click <strong>Edit</strong> on the rejected event,
            make your corrections, and save. Status will reset to Pending for admin review.
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="org-table-empty">
          No event submissions match the &quot;{filter}&quot; filter.
        </div>
      ) : (
        <div className="org-table-wrap">
          <table className="org-table org-table--standard">
            <thead>
              <tr>
                <th>Event Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Ticket price</th>
                <th style={{ textAlign: 'center' }}>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(ev => (
                <tr key={ev._id} className="org-table-row">
                  <td style={{ color: '#f3f4f6', fontWeight: 600 }}>{ev.title}</td>
                  <td style={{ color: '#cbd5e1' }}>{ev.category}</td>
                  <td style={{ color: '#cbd5e1' }}>
                    {new Date(ev.date).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td style={{ color: '#38bdf8', fontWeight: 600 }}>₹{ev.price}</td>
                  <td style={{ textAlign: 'center' }}>{statusBadge(ev)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      className="org-action-btn org-action-view"
                      onClick={() => navigate(`/event/${ev._id}`)}
                    >
                      👁 View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
