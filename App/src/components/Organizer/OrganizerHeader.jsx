import React from 'react';

const OrganizerHeader = ({ onReset, onDeleteAccount, onShowForm, showForm }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Organizer Dashboard</h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                    className="premium-button"
                    style={{ width: 'auto', background: 'rgba(255, 60, 60, 0.1)', border: '1px solid #ff4d4d', color: '#ff4d4d' }}
                    onClick={onReset}
                >
                    Reset App Data
                </button>
                <button
                    className="premium-button"
                    style={{ width: 'auto', background: 'transparent', border: '1px solid #ff4444', color: '#ff4444' }}
                    onClick={onDeleteAccount}
                >
                    Delete Account
                </button>
                {!showForm && (
                    <button
                        className="premium-button"
                        style={{ width: 'auto' }}
                        onClick={onShowForm}
                    >
                        Create New Event
                    </button>
                )}
            </div>
        </div>
    );
};

export default OrganizerHeader;
