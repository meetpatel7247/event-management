import React, { useState, useMemo } from 'react';
import { RoleBadge } from './AdminBadges';

export default function AdminApprovals({
  pendingOrganizers = [],
  approvedOrganizers = [],
  handleApproveOrganizer,
  handleDeleteUser
}) {
  const [subTab, setSubTab] = useState('Pending'); // 'Pending' or 'Approved'
  const [searchQuery, setSearchQuery] = useState('');

  const activeList = useMemo(() => {
    return subTab === 'Pending' ? pendingOrganizers : approvedOrganizers;
  }, [subTab, pendingOrganizers, approvedOrganizers]);

  const filtered = useMemo(() => {
    if (!searchQuery) return activeList;
    return activeList.filter(u =>
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeList, searchQuery]);

  return (
    <div className="adm-panel">
      {/* Segmented controls for switching between Pending and Approved views */}
      <div style={{ 
        display: 'flex', 
        gap: '0.75rem', 
        marginBottom: '1.5rem', 
        borderBottom: '1px solid rgba(255,255,255,0.06)', 
        paddingBottom: '1rem' 
      }}>
        <button
          onClick={() => { setSubTab('Pending'); setSearchQuery(''); }}
          style={{
            background: subTab === 'Pending' ? 'rgba(0, 243, 255, 0.1)' : 'transparent',
            border: subTab === 'Pending' ? '1px solid rgba(0, 243, 255, 0.25)' : '1px solid transparent',
            color: subTab === 'Pending' ? 'var(--primary-color)' : '#94a3b8',
            padding: '0.6rem 1.25rem',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          ⏳ Pending Approvals 
          <span style={{
            background: 'rgba(245,158,11,0.15)',
            color: '#f59e0b',
            padding: '2px 8px',
            borderRadius: '10px',
            fontSize: '0.75rem',
            fontWeight: '700'
          }}>
            {pendingOrganizers.length}
          </span>
        </button>
        <button
          onClick={() => { setSubTab('Approved'); setSearchQuery(''); }}
          style={{
            background: subTab === 'Approved' ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
            border: subTab === 'Approved' ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid transparent',
            color: subTab === 'Approved' ? '#10b981' : '#94a3b8',
            padding: '0.6rem 1.25rem',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          ✅ Approved Organizers
          <span style={{
            background: 'rgba(16,185,129,0.15)',
            color: '#10b981',
            padding: '2px 8px',
            borderRadius: '10px',
            fontSize: '0.75rem',
            fontWeight: '700'
          }}>
            {approvedOrganizers.length}
          </span>
        </button>
      </div>

      {/* Search and Header info */}
      <div className="adm-search-bar" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="adm-search-input-wrap">
          <span className="adm-search-icon">🔍</span>
          <input 
            className="adm-search-input" 
            placeholder={subTab === 'Pending' ? "Search pending approvals…" : "Search approved organizers…"}
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
          />
        </div>
        <div style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: '500' }}>
          {filtered.length} organizer{filtered.length !== 1 ? 's' : ''} listed
        </div>
      </div>

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>ORGANIZER NAME</th>
              <th>EMAIL ADDRESS</th>
              <th>ROLE</th>
              <th>REGISTERED ON</th>
              <th>APPROVAL STATUS</th>
              <th style={{ textAlign: 'center' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="adm-table-empty" style={{ padding: '5rem 2rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1.25rem' }}>
                    {subTab === 'Pending' ? '🛡️' : '👥'}
                  </div>
                  <div style={{ fontSize: '1.25rem', color: '#f1f5f9', fontWeight: '600', marginBottom: '0.5rem' }}>
                    {subTab === 'Pending' ? 'No Pending Requests' : 'No Approved Organizers'}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.95rem' }}>
                    {subTab === 'Pending' 
                      ? 'All organizer registration requests have been processed.' 
                      : 'There are no active approved organizer accounts on the platform.'}
                  </div>
                </td>
              </tr>
            )}
            {filtered.map(u => (
              <tr key={u._id} className="adm-table-row">
                <td>
                  <div className="adm-user-name" style={{ fontWeight: '600', color: '#f8fafc' }}>{u.name}</div>
                  <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '2px' }}>
                    {subTab === 'Pending' ? 'New Organizer Request' : 'Active Organizer Account'}
                  </div>
                </td>
                <td style={{ color: '#94a3b8', fontFamily: 'monospace' }}>{u.email}</td>
                <td><RoleBadge role={u.role} /></td>
                <td style={{ color: '#64748b' }}>
                  {new Date(u.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
                <td>
                  {subTab === 'Pending' ? (
                    <span className="adm-badge" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' }}>
                      pending approval
                    </span>
                  ) : (
                    <span className="adm-badge" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)' }}>
                      approved
                    </span>
                  )}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                    {subTab === 'Pending' && (
                      <button 
                        className="adm-action-btn-approve" 
                        style={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: '#ffffff',
                          border: 'none',
                          padding: '0.5rem 1.1rem',
                          borderRadius: '6px',
                          fontWeight: '600',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => handleApproveOrganizer(u._id)}
                        onMouseEnter={e => {
                          e.target.style.transform = 'translateY(-1px)';
                          e.target.style.boxShadow = '0 6px 8px -1px rgba(16, 185, 129, 0.3)';
                        }}
                        onMouseLeave={e => {
                          e.target.style.transform = 'none';
                          e.target.style.boxShadow = '0 4px 6px -1px rgba(16, 185, 129, 0.2)';
                        }}
                      >
                        ✓ Approve
                      </button>
                    )}
                    <button 
                      className="adm-icon-btn adm-icon-reject" 
                      title={subTab === 'Pending' ? "Reject & Delete request" : "Revoke & Delete account"}
                      onClick={() => {
                        const actionText = subTab === 'Pending' ? 'reject and remove the registration' : 'revoke and delete the approved organizer account';
                        if (window.confirm(`Are you sure you want to ${actionText} for ${u.name}?`)) {
                          handleDeleteUser(u._id);
                        }
                      }}
                      style={{
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.35)',
                        color: '#ef4444',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={e => {
                        e.target.style.background = 'rgba(239, 68, 68, 0.25)';
                      }}
                      onMouseLeave={e => {
                        e.target.style.background = 'rgba(239, 68, 68, 0.15)';
                      }}
                    >
                      🗑
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
