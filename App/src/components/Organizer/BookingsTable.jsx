import React from 'react';

const BookingsTable = ({ bookings }) => {
    return (
        <>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', marginTop: '3rem' }}>
                Ticket Bookings
            </h3>
            <table width="100%" border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>User Name</th>
                        <th>Event</th>
                        <th>Tickets</th>
                        <th>Booked Date & Time</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.length === 0 ? (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center' }}>
                                No bookings yet
                            </td>
                        </tr>
                    ) : (
                        bookings.map((b) => (
                            <tr key={b._id}>
                                <td>{b.user?.name}</td>
                                <td>{b.event?.title}</td>
                                <td>{b.quantity}</td>
                                <td>{new Date(b.bookingDate).toLocaleString()}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </>
    );
};

export default BookingsTable;
