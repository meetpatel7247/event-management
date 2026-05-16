import React from 'react';

export default function OrgCalendar({ events, bookings }) {
  return (
    <div className="org-panel">
      <h3 className="org-section-title">Event Calendar</h3>
      {events.length === 0 ? (
        <div className="org-empty">No events to display.</div>
      ) : (
        <div className="org-calendar-list">
          {[...events]
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map(ev => {
              const d = new Date(ev.date);
              const sold = bookings.filter(b => b.event?._id === ev._id).reduce((s, b) => s + b.quantity, 0);
              const totalSeatsEv = sold + (ev.availableSeats || 0);
              const isPast = d < new Date(new Date().setHours(0,0,0,0));
              return (
                <div key={ev._id} className={`org-cal-row ${isPast ? 'org-cal-past' : ''}`}>
                  <div className="org-cal-date-box">
                    <span className="org-cal-month">{d.toLocaleString('en', { month: 'short' })}</span>
                    <span className="org-cal-day">{d.getDate()}</span>
                  </div>
                  <div className="org-cal-info">
                    <div className="org-cal-name">{ev.title}</div>
                    <div className="org-cal-meta">{ev.time} • {ev.location}</div>
                  </div>
                  <div className="org-cal-tickets">
                    <div className="org-cal-ticket-label">Tickets</div>
                    <div className="org-cal-ticket-val">{sold}/{totalSeatsEv}</div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
