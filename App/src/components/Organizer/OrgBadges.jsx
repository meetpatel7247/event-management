import React from 'react';

export const statusBadge = (ev) => {
  const d = new Date(ev.date);
  const now = new Date(); now.setHours(0,0,0,0);
  if (d < now) return <span className="org-badge org-badge-past">Past</span>;
  if (ev.isApproved) return <span className="org-badge org-badge-approved">Approved</span>;
  return <span className="org-badge org-badge-pending">Pending</span>;
};
