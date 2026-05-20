import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from './AdminBadges';

export default function AdminEvents({
  filteredEvents, eventSearch, setEventSearch, eventFilter, setEventFilter,
  bookings, handleApprove, handleRejectEvent
}) {
  const navigate = useNavigate();
  return (
    <div className="adm-panel">
      <div className="adm-search-bar">
        <div className="adm-search-input-wrap">
          <span className="adm-search-icon">🔍</span>
          <input className="adm-search-input" placeholder="Search events…"
            value={eventSearch} onChange={e => setEventSearch(e.target.value)} />
        </div>
        <div className="adm-filter-group">
          {['All','Pending','Approved'].map(f => (
            <button key={f}
              className={`adm-filter-btn ${eventFilter === f ? 'adm-filter-active' : ''}`}
              onClick={() => setEventFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>EVENT</th>
              <th>ORGANIZER</th>
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
              <tr><td colSpan={8} className="adm-table-empty">No events match your filter.</td></tr>
            )}
            {filteredEvents.map(ev => {
              const rev = bookings.filter(b => b.event?._id === ev._id).reduce((s,b) => s+(b.totalPrice||0), 0);
              const isPast = new Date(ev.date) < new Date(new Date().setHours(0,0,0,0));
              return (
                <tr key={ev._id} className="adm-table-row">
                  <td>
                    <div className="adm-ev-name">{ev.title}</div>
                    <div className="adm-ev-cat">{ev.category}</div>
                  </td>
                  <td>{ev.organizerName || ev.organizerId?.name || '—'}</td>
                  <td>{new Date(ev.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</td>
                  <td><StatusBadge approved={ev.isApproved} past={isPast} /></td>
                  <td style={{ color:'#fb7185', fontWeight:600 }}>{ev.likes || 0}</td>
                  <td style={{ color:'#60a5fa', fontWeight:600 }}>{ev.shares || 0}</td>
                  <td style={{ color:'#10b981', fontWeight:600 }}>₹{rev.toFixed(1)}</td>
                  <td>
                    <div className="adm-row-actions">
                      <button className="adm-icon-btn adm-icon-view" title="View" onClick={() => navigate(`/event/${ev._id}`)}>👁</button>
                      {!ev.isApproved && (
                        <button className="adm-icon-btn adm-icon-approve" title="Approve" onClick={() => handleApprove(ev._id)}>✓</button>
                      )}
                      <button className="adm-icon-btn adm-icon-reject" title="Delete" onClick={() => handleRejectEvent(ev._id)}>✕</button>
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
