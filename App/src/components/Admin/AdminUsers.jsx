import React from 'react';
import { RoleBadge } from './AdminBadges';

export default function AdminUsers({
  filteredUsers, userSearch, setUserSearch, userFilter, setUserFilter,
  events, handleDeleteUser
}) {
  return (
    <div className="adm-panel">
      <div className="adm-search-bar">
        <div className="adm-search-input-wrap">
          <span className="adm-search-icon">🔍</span>
          <input className="adm-search-input" placeholder="Search users…"
            value={userSearch} onChange={e => setUserSearch(e.target.value)} />
        </div>
        <div className="adm-filter-group">
          {['All','User','Organizer'].map(f => (
            <button key={f}
              className={`adm-filter-btn ${userFilter === f ? 'adm-filter-active' : ''}`}
              onClick={() => setUserFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ROLE</th>
              <th>JOINED</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 && (
              <tr><td colSpan={6} className="adm-table-empty">No users match your filter.</td></tr>
            )}
            {filteredUsers.map(u => {
              const evCount = events.filter(e => e.organizerId?._id === u._id || e.organizerId === u._id).length;
              return (
                <tr key={u._id} className="adm-table-row">
                  <td>
                    <div className="adm-user-name">{u.name}</div>
                    {u.role === 'organizer' && evCount > 0 && (
                      <div className="adm-user-sub">{evCount} event{evCount !== 1 ? 's' : ''} organized</div>
                    )}
                  </td>
                  <td style={{ color:'#94a3b8' }}>{u.email}</td>
                  <td><RoleBadge role={u.role} /></td>
                  <td style={{ color:'#64748b' }}>{new Date(u.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</td>
                  <td><span className="adm-badge" style={{ background:'rgba(16,185,129,0.12)', color:'#10b981', border:'1px solid rgba(16,185,129,0.25)' }}>active</span></td>
                  <td>
                    {u.role !== 'admin' && (
                      <button className="adm-icon-btn adm-icon-reject" title="Remove user"
                        onClick={() => handleDeleteUser(u._id)}>🗑</button>
                    )}
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
