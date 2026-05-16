import React from 'react';
import { useNavigate } from 'react-router-dom';
import { statusBadge } from './OrgBadges';
import CreateEventForm from '../Event/CreateEventForm';

export default function OrgMyEvents({
  showForm, setShowForm, editingEvent, setEditingEvent,
  events, bookings, handleCreateEvent, handleUpdateEvent, handleDeleteEvent, openEdit
}) {
  const navigate = useNavigate();
  return (
    <div className="org-panel">
      {showForm ? (
        <div className="org-form-wrap">
          <h3 className="org-section-title">{editingEvent ? 'Edit Event' : 'Create New Event'}</h3>
          <CreateEventForm
            onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
            initialData={editingEvent}
            onCancel={() => { setShowForm(false); setEditingEvent(null); }}
          />
        </div>
      ) : (
        <>
          <div className="org-myevents-header">
            <h3 className="org-section-title">My Events ({events.length})</h3>
            <button className="org-create-btn" onClick={() => { setEditingEvent(null); setShowForm(true); }}>+ Create Event</button>
          </div>
          {events.length === 0 ? (
            <div className="org-empty">You haven't created any events yet.</div>
          ) : (
            <div className="org-event-cards">
              {events.map(ev => {
                const sold = bookings.filter(b => b.event?._id === ev._id).reduce((s, b) => s + b.quantity, 0);
                const totalSeatsEv = sold + (ev.availableSeats || 0);
                return (
                  <div key={ev._id} className="org-event-card">
                    <div className="org-event-card-top">
                      <span className="org-event-card-title">{ev.title}</span>
                      {statusBadge(ev)}
                    </div>
                    <div className="org-event-card-rows">
                      <div className="org-event-card-row"><span>Date:</span><span>{new Date(ev.date).toLocaleDateString()}</span></div>
                      <div className="org-event-card-row"><span>Tickets Sold:</span><span>{sold}/{totalSeatsEv}</span></div>
                    </div>
                    <div className="org-event-card-actions">
                      <button className="org-action-btn org-action-view" onClick={() => navigate(`/event/${ev._id}`)}>👁 View</button>
                      <button className="org-action-btn org-action-edit" onClick={() => openEdit(ev)}>✏️ Edit</button>
                      <button className="org-action-btn org-action-del" onClick={() => handleDeleteEvent(ev._id)}>🗑</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
