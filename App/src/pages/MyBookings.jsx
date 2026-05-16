import React, { useState, useEffect } from 'react';
import { bookingApi } from '../utils/api';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import styles from './MyBookings.module.css';
import { useNavigate } from 'react-router-dom';
import BookingSlider from '../components/Booking/BookingSlider';
import BookingCard from '../components/Booking/BookingCard';

/**
 * MyBookings Component
 * 
 * Fetches the currently authenticated user's ticket bookings and organizes them
 * into three functional categories: Urgent (next 48 hours), Upcoming, and Past.
 * Renders each category using the BookingSlider component.
 */
const MyBookings = () => {
    const [bookings, setBookings] = useState({ urgent: [], upcoming: [], past: [] });
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            if (!user || !user.token) {
                setLoading(false);
                return;
            }

            try {
                const data = await bookingApi.getUserBookings();

                const now = new Date();
                const twoDaysFromNow = new Date();
                twoDaysFromNow.setDate(now.getDate() + 2);

                const urgent = [];
                const upcoming = [];
                const past = [];

                data.forEach(booking => {
                    if (!booking.event || !booking.event.date) return;

                    const eventDate = new Date(booking.event.date);

                    if (eventDate < now) {
                        past.push(booking);
                    } else if (eventDate <= twoDaysFromNow) {
                        urgent.push(booking);
                    } else {
                        upcoming.push(booking);
                    }
                });

                urgent.sort((a, b) => new Date(a.event.date) - new Date(b.event.date));
                upcoming.sort((a, b) => new Date(a.event.date) - new Date(b.event.date));
                past.sort((a, b) => new Date(b.event.date) - new Date(a.event.date));

                setBookings({ urgent, upcoming, past });
            } catch (error) {
                toast.error('Failed to load bookings.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user]);

    if (loading) return <div className="container" style={{ textAlign: 'center', paddingTop: '2rem' }}>Loading bookings...</div>;

    const totalBookings = bookings.urgent.length + bookings.upcoming.length + bookings.past.length;

    if (totalBookings === 0) {
        return (
            <div className={`container ${styles.pageContainer}`} style={{ textAlign: 'center', paddingTop: '4rem' }}>
                <h2 className={styles.title}>No bookings found</h2>
                <p style={{ color: 'var(--text-muted)' }}>Explore events and book your tickets now!</p>
                <button className="premium-button" style={{ width: 'auto', marginTop: '2rem' }} onClick={() => navigate('/')}>Browse Events</button>
            </div>
        );
    }

    const renderCard = (booking, isUrgent = false, isPast = false) => (
        <BookingCard key={booking._id} booking={booking} isUrgent={isUrgent} isPast={isPast} />
    );

    return (
        <div className={`container ${styles.pageContainer}`}>
            <h1 className={styles.title}>Your Tickets</h1>

            {bookings.urgent.length > 0 && (
                <BookingSlider
                    title="Happening Soon"
                    titleIcon="🔥"
                    bookings={bookings.urgent}
                    renderCard={renderCard}
                    isUrgent={true}
                    isPast={false}
                />
            )}

            {bookings.upcoming.length > 0 && (
                <BookingSlider
                    title="Upcoming Events"
                    bookings={bookings.upcoming}
                    renderCard={renderCard}
                    isUrgent={false}
                    isPast={false}
                />
            )}

            {bookings.past.length > 0 && (
                <BookingSlider
                    title="Past Events"
                    bookings={bookings.past}
                    renderCard={renderCard}
                    isUrgent={false}
                    isPast={true}
                />
            )}
        </div>
    );
};

export default MyBookings;
