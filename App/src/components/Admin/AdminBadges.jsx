import React from 'react';

export function RoleBadge({ role }) {
  const styles = {
    admin:     { background: 'rgba(236,72,153,0.15)', color: '#ec4899', border: '1px solid rgba(236,72,153,0.35)' },
    organizer: { background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.35)' },
    user:      { background: 'rgba(99,102,241,0.15)',  color: '#818cf8', border: '1px solid rgba(99,102,241,0.35)' },
  };
  return <span className="adm-badge" style={styles[role] || styles.user}>{role}</span>;
}

export function StatusBadge({ approved, past, hasPendingEdits }) {
  if (past)            return <span className="adm-badge" style={{ background:'rgba(100,116,139,0.15)', color:'#94a3b8', border:'1px solid rgba(100,116,139,0.3)' }}>past</span>;
  if (hasPendingEdits) return <span className="adm-badge" style={{ background:'rgba(59,130,246,0.15)', color:'#3b82f6', border:'1px solid rgba(59,130,246,0.3)' }}>pending edits</span>;
  if (approved)        return <span className="adm-badge" style={{ background:'rgba(16,185,129,0.15)', color:'#10b981', border:'1px solid rgba(16,185,129,0.3)' }}>approved</span>;
  return               <span className="adm-badge" style={{ background:'rgba(245,158,11,0.15)', color:'#f59e0b', border:'1px solid rgba(245,158,11,0.3)' }}>pending</span>;
}
