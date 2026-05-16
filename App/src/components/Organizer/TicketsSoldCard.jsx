import React from 'react';

const TicketsSoldCard = ({ totalTicketsSold }) => {
    return (
        <div style={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: '#fff',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            textAlign: 'center',
        }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Total Tickets Sold</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
                {totalTicketsSold}
            </p>
        </div>
    );
};

export default TicketsSoldCard;
