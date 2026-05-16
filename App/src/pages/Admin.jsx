import React, { useState, useEffect, useMemo } from 'react';
import { eventApi, adminApi, bookingApi } from '../utils/api';
import { toast } from 'react-toastify';
import AdminOverview from '../components/Admin/AdminOverview';
import AdminEvents from '../components/Admin/AdminEvents';
import AdminUsers from '../components/Admin/AdminUsers';
import './Admin.css';

const TABS = ['Overview', 'Events', 'Users'];

const Admin = () => {
  const userInfo = JSON.parse(sessionStorage.getItem('user'));
  if (!userInfo || userInfo.role !== 'admin') {
    return <div style={{ padding: '3rem', textAlign: 'center', color: '#ef4444' }}>⛔ Access Denied — Admins only.</div>;
  }

  const [activeTab, setActiveTab] = useState('Overview');
  const [events, setEvents]       = useState([]);
  const [users, setUsers]         = useState([]);
  const [bookings, setBookings]   = useState([]);
  const [loading, setLoading]     = useState(true);

  // search / filter
  const [eventSearch, setEventSearch]   = useState('');
  const [eventFilter, setEventFilter]   = useState('All');
  const [userSearch, setUserSearch]     = useState('');
  const [userFilter, setUserFilter]     = useState('All');

  const refresh = async (first = false) => {
    try {
      const [evData, usData, bkData] = await Promise.all([
        eventApi.getEvents(),
        adminApi.getUsers(),
        bookingApi.getAllBookings(),
      ]);
      setEvents(evData);
      setUsers(usData);
      setBookings(bkData);
    } catch { if (first) toast.error('Failed to load admin data.'); }
    finally { if (first) setLoading(false); }
  };

  useEffect(() => {
    refresh(true);
    const iv = setInterval(() => refresh(false), 8000);
    return () => clearInterval(iv);
  }, []);

  /* ── derived stats ── */
  const totalRevenue    = useMemo(() => bookings.reduce((s, b) => s + (b.totalPrice || 0), 0), [bookings]);
  const pendingEvents   = useMemo(() => events.filter(e => !e.isApproved), [events]);
  const activeOrgs      = useMemo(() => users.filter(u => u.role === 'organizer').length, [users]);
  const platformUsers   = useMemo(() => users.filter(u => u.role === 'user').length, [users]);


  // Revenue trend
  const revenueTrend = useMemo(() => {
    const map = {};
    bookings.forEach(b => {
      const d = new Date(b.createdAt || b.bookingDate || Date.now());
      const key = d.toLocaleString('en', { month: 'short' });
      map[key] = (map[key] || 0) + (b.totalPrice || 0);
    });
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const present = months.filter(m => map[m]);
    if (present.length < 2) {
      const now = new Date();
      return Array.from({ length: 6 }, (_, i) => {
        const m = months[(now.getMonth() - 5 + i + 12) % 12];
        return { label: m, revenue: map[m] || 0 };
      });
    }
    return present.map(m => ({ label: m, revenue: map[m] }));
  }, [bookings]);

  const revenueGrowth = useMemo(() => {
    if (revenueTrend.length < 2) return 0;
    const current = revenueTrend[revenueTrend.length - 1].revenue;
    const previous = revenueTrend[revenueTrend.length - 2].revenue;
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }, [revenueTrend]);

  // Events by category
  const categoryData = useMemo(() => {
    const map = {};
    events.forEach(ev => { map[ev.category || 'Other'] = (map[ev.category || 'Other'] || 0) + 1; });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [events]);

  /* ── event handlers ── */
  const handleApprove = async (id) => {
    try {
      await adminApi.approveEvent(id);
      setEvents(ev => ev.map(e => e._id === id ? { ...e, isApproved: true } : e));
      toast.success('Event approved!');
    } catch (e) { toast.error(e.response?.data?.message || 'Approval failed'); }
  };

  const handleRejectEvent = async (id) => {
    if (!window.confirm('Reject (delete) this event?')) return;
    try {
      await eventApi.deleteEvent(id);
      setEvents(ev => ev.filter(e => e._id !== id));
      toast.success('Event rejected & removed.');
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  const handleDeleteUser = async (id) => {
    const isSelf = id === userInfo._id;
    if (!window.confirm(isSelf ? 'Delete your own account?' : 'Remove this user?')) return;
    try {
      await adminApi.deleteUser(id);
      if (isSelf) { sessionStorage.removeItem('user'); window.location.href = '/login'; }
      else { setUsers(us => us.filter(u => u._id !== id)); toast.success('User removed.'); }
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  /* ── filtered lists ── */
  const filteredEvents = useMemo(() => {
    let list = events;
    if (eventFilter === 'Pending')  list = list.filter(e => !e.isApproved);
    if (eventFilter === 'Approved') list = list.filter(e => e.isApproved);
    if (eventSearch) list = list.filter(e => e.title?.toLowerCase().includes(eventSearch.toLowerCase()));
    return list;
  }, [events, eventFilter, eventSearch]);

  const filteredUsers = useMemo(() => {
    let list = users;
    if (userFilter === 'User')      list = list.filter(u => u.role === 'user');
    if (userFilter === 'Organizer') list = list.filter(u => u.role === 'organizer');
    if (userSearch) list = list.filter(u =>
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase())
    );
    return list;
  }, [users, userFilter, userSearch]);

  if (loading) return (
    <div className="adm-loading">
      <div className="adm-spinner" />
      <p>Loading admin data…</p>
    </div>
  );

  return (
    <div className="adm-root">
      {/* HEADER */}
      <div className="adm-header">
        <div>
          <h1 className="adm-title">Admin Panel</h1>
          <p className="adm-subtitle">Manage platform operations and user activities</p>
        </div>
      </div>

      {/* TABS */}
      <div className="adm-tabs">
        {TABS.map(tab => (
          <button key={tab}
            className={`adm-tab ${activeTab === tab ? 'adm-tab-active' : ''}`}
            onClick={() => setActiveTab(tab)}>
            {tab === 'Overview' && '📊 '}
            {tab === 'Events'   && '📅 '}
            {tab === 'Users'    && '👥 '}
            {tab}
            {tab === 'Events' && pendingEvents.length > 0 && (
              <span className="adm-tab-badge">{pendingEvents.length}</span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'Overview' && (
        <AdminOverview 
          totalRevenue={totalRevenue} revenueGrowth={revenueGrowth} events={events} pendingEvents={pendingEvents} 
          activeOrgs={activeOrgs} platformUsers={platformUsers} 
          revenueTrend={revenueTrend} categoryData={categoryData} 
          handleApprove={handleApprove} handleRejectEvent={handleRejectEvent} 
        />
      )}

      {activeTab === 'Events' && (
        <AdminEvents 
          filteredEvents={filteredEvents} eventSearch={eventSearch} 
          setEventSearch={setEventSearch} eventFilter={eventFilter} 
          setEventFilter={setEventFilter} bookings={bookings} 
          handleApprove={handleApprove} handleRejectEvent={handleRejectEvent} 
        />
      )}

      {activeTab === 'Users' && (
        <AdminUsers 
          filteredUsers={filteredUsers} userSearch={userSearch} 
          setUserSearch={setUserSearch} userFilter={userFilter} 
          setUserFilter={setUserFilter} events={events} 
          handleDeleteUser={handleDeleteUser} 
        />
      )}
    </div>
  );
};

export default Admin;