import React, { useEffect, useState, useMemo } from 'react';
import { eventApi, bookingApi } from '../utils/api';
import { toast } from 'react-toastify';
import './Organizer.css';
import '../components/charts/dashboardCharts.css';
import OrgOverview from '../components/Organizer/OrgOverview';
import OrgMyEvents from '../components/Organizer/OrgMyEvents';
import OrgCalendar from '../components/Organizer/OrgCalendar';
import OrgAnalytics from '../components/Organizer/OrgAnalytics';
import Spinner from '../components/Spinner/Spinner';

const TABS = ['Overview', 'My Events', 'Calendar', 'Analytics'];

const Organizer = () => {
  const userInfo = JSON.parse(sessionStorage.getItem('user'));
  if (!userInfo) { window.location.href = '/login'; return null; }
  if (userInfo.role !== 'organizer') { window.location.href = '/'; return null; }

  const [activeTab, setActiveTab] = useState('Overview');
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const refreshDashboard = async (isFirst = false) => {
    try {
      const [evData, bkData] = await Promise.all([
        eventApi.getMyEvents(),
        bookingApi.getOrganizerBookings(),
      ]);
      setEvents(evData);
      setBookings(bkData);
    } catch (e) {
      console.error('Dashboard refresh error:', e);
      if (isFirst) toast.error('Failed to load dashboard data.');
    } finally {
      if (isFirst) setLoading(false);
    }
  };

  useEffect(() => {
    refreshDashboard(true);
    const iv = setInterval(() => refreshDashboard(false), 5000);
    return () => clearInterval(iv);
  }, []);

  const totalRevenue = useMemo(() => bookings.reduce((s, b) => s + (b.totalPrice || 0), 0), [bookings]);
  const totalTickets = useMemo(() => bookings.reduce((s, b) => s + (b.quantity || 0), 0), [bookings]);
  const totalSeats = events.reduce((s, e) => s + (e.availableSeats || 0) + (bookings.filter(b => b.event?._id === e._id).reduce((a, b2) => a + b2.quantity, 0)), 0);
  const avgAttendance = totalSeats > 0 ? Math.round((totalTickets / totalSeats) * 100) : 0;

  const revenueByEvent = useMemo(() => events.map(ev => ({
    label: ev.title?.substring(0, 14),
    revenue: bookings.filter(b => b.event?._id === ev._id).reduce((s, b) => s + (b.totalPrice || 0), 0),
  })), [events, bookings]);

  const ticketsByEvent = useMemo(() => events.map(ev => ({
    label: ev.title?.substring(0, 14),
    tickets: bookings.filter(b => b.event?._id === ev._id).reduce((s, b) => s + (b.quantity || 0), 0),
  })), [events, bookings]);

  const categoryData = useMemo(() => {
    const map = {};
    events.forEach(ev => { map[ev.category] = (map[ev.category] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [events]);

  const bestEvent = useMemo(() => {
    if (!revenueByEvent.length) return null;
    return revenueByEvent.reduce((best, cur) => cur.revenue > best.revenue ? cur : best, revenueByEvent[0]);
  }, [revenueByEvent]);

  const mostPopularCategory = useMemo(() => {
    if (!categoryData.length) return null;
    return categoryData.reduce((b, c) => c.value > b.value ? c : b, categoryData[0]);
  }, [categoryData]);

  const avgTicketPrice = useMemo(() => {
    if (!events.length) return 0;
    return (events.reduce((s, e) => s + (e.price || 0), 0) / events.length).toFixed(2);
  }, [events]);

  const handleCreateEvent = async (newEvent) => {
    try {
      await eventApi.createEvent(newEvent);
      await refreshDashboard(false);
      setShowForm(false);
      toast.success('Event created successfully!');
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to create event'); }
  };

  const handleUpdateEvent = async (updatedData) => {
    try {
      await eventApi.updateEvent(editingEvent._id, updatedData);
      await refreshDashboard(false);
      setEditingEvent(null); setShowForm(false);
      toast.success('Event updated!');
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to update event'); }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await eventApi.deleteEvent(id);
      await refreshDashboard(false);
      toast.success('Event deleted!');
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to delete event'); }
  };

  const openEdit = (ev) => { setEditingEvent(ev); setShowForm(true); };

  if (loading) return <Spinner message="Loading organizer dashboard..." />;

  return (
    <div className="org-root">
      <div className="org-header">
        <div>
          <h1 className="org-title">Organizer Dashboard</h1>
          <p className="org-subtitle">Welcome back, <strong>{userInfo.name}</strong></p>
        </div>
        <button
          className="org-create-btn"
          onClick={() => { setEditingEvent(null); setShowForm(true); setActiveTab('My Events'); }}
        >
          + Create Event
        </button>
      </div>

      <div className="org-tabs">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`org-tab ${activeTab === tab ? 'org-tab-active' : ''}`}
            onClick={() => { setActiveTab(tab); setShowForm(false); }}
          >
            {tab === 'Overview' && '📊 '}
            {tab === 'My Events' && `🗂 `}
            {tab === 'Calendar' && '📅 '}
            {tab === 'Analytics' && '📈 '}
            {tab}
            {tab === 'My Events' && <span className="org-tab-count">{events.length}</span>}
          </button>
        ))}
      </div>

      {activeTab === 'Overview' && (
        <OrgOverview
          events={events} bookings={bookings} totalRevenue={totalRevenue}
          totalTickets={totalTickets} avgAttendance={avgAttendance}
          revenueByEvent={revenueByEvent} categoryData={categoryData}
          setShowForm={setShowForm} setActiveTab={setActiveTab}
        />
      )}

      {activeTab === 'My Events' && (
        <OrgMyEvents
          showForm={showForm} setShowForm={setShowForm}
          editingEvent={editingEvent} setEditingEvent={setEditingEvent}
          events={events} bookings={bookings}
          handleCreateEvent={handleCreateEvent} handleUpdateEvent={handleUpdateEvent}
          handleDeleteEvent={handleDeleteEvent} openEdit={openEdit}
        />
      )}

      {activeTab === 'Calendar' && (
        <OrgCalendar events={events} bookings={bookings} />
      )}

      {activeTab === 'Analytics' && (
        <OrgAnalytics
          events={events} ticketsByEvent={ticketsByEvent}
          bestEvent={bestEvent} mostPopularCategory={mostPopularCategory}
          avgTicketPrice={avgTicketPrice}
        />
      )}
    </div>
  );
};

export default Organizer;