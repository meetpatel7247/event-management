import React from 'react';
import styles from './EventTable.module.css';

/**
 * EventTable Component
 * 
 * Renders a data table for organizers and admins to view their events.
 * Provides inline Edit and Delete action hooks for each row.
 * 
 * @param {Array} events - The list of events to display
 * @param {Function} onDelete - Callback triggered when deleting an event by ID
 * @param {Function} onEdit - Callback triggered to edit the target event object
 */
const EventTable = ({ events, onDelete, onEdit }) => {
    return (
        <div className={styles.tableContainer}>
            <table className={styles.table} style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                        <th style={{ padding: '1rem' }}>Image</th>
                        <th style={{ padding: '1rem' }}>Event Name</th>
                        <th style={{ padding: '1rem' }}>Date</th>
                        <th style={{ padding: '1rem' }}>Location</th>
                        <th style={{ padding: '1rem' }}>Price</th>
                        <th style={{ padding: '1rem' }}>Sold</th>
                        <th style={{ padding: '1rem' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((event) => (
                        <tr key={event._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '1rem' }}>
                                <img src={event.image} alt={event.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                            </td>
                            <td style={{ padding: '1rem' }}>{event.title}</td>
                            <td style={{ padding: '1rem' }}>{new Date(event.date).toLocaleDateString()}</td>
                            <td style={{ padding: '1rem' }}>{event.location}</td>
                            <td style={{ padding: '1rem', color: 'var(--primary-color)', fontWeight: 'bold' }}>${event.price}</td>
                            <td style={{ padding: '1rem', color: 'var(--secondary-color)', fontWeight: 'bold' }}>{event.sold || 0}</td>
                            <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                <button
                                    className="premium-button"
                                    style={{ padding: '6px 12px', fontSize: '0.8rem', width: 'auto' }}
                                    onClick={() => onEdit(event)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="premium-button"
                                    style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'var(--secondary-color)', width: 'auto' }}
                                    onClick={() => onDelete(event._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EventTable;
