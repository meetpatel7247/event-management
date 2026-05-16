import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setBookingDetails } from '../../store/bookingSlice';
import withFadeIn from '../../hoc/withFadeIn';
import styles from './EventCard.module.css';

/**
 * EventCard Component
 * 
 * Renders a single event preview with an image, title, date, location, and price.
 * Clicking the card routes the user to the EventDetails page.
 * Clicking "Book Ticket" triggers the Redux booking flow and forwards to checkout.
 * 
 * @param {Object} event - The full event data object
 */
const EventCard = ({ event, isGrid = false }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const [imgErrored, setImgErrored] = useState(false);

    const seed = encodeURIComponent(event?._id || event?.title || event?.location || 'event');
    const seededFallback = `https://picsum.photos/seed/${seed}/800/450`;
    const imageSrc = !imgErrored && event?.image ? event.image : seededFallback;

    /**
     * Prevents the click from bubbling to the parent card, checks auth,
     * seeds the Redux store with the target event, and pushes the booking route.
     */
    const handleBook = (e) => {
        e.stopPropagation();
        if (!user || !user.token) {
            navigate('/login');
            return;
        }

        dispatch(setBookingDetails({
            event,
            quantity: 1,
            totalPrice: event.price,
            discountAmount: 0
        }));

        navigate('/booking');
    };

    return (
        <div
            className={`premium-card ${styles.cardWrapper}`}
            data-layout={isGrid ? "grid" : "carousel"}
            onClick={() => navigate(`/event/${event._id}`)}
        >
            <div className={styles.imgContainer}>
                <motion.img
                    src={imageSrc}
                    alt={event.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    onError={(e) => {
                        // Avoid infinite onError loops; switch to deterministic per-event fallback.
                        setImgErrored(true);
                    }}
                />
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to top, var(--bg-card), transparent)',
                    opacity: 0.6
                }} />
            </div>
            <div className={styles.contentContainer}>
                <div className={styles.date}>
                    {new Date(event.date).toLocaleDateString()}
                </div>
                <h3 className={styles.title}>{event.title}</h3>
                <p className={styles.location}>
                    {event.location}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`, '_blank');
                        }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '5px', fontSize: '1.2rem', padding: 0 }}
                        title="View on Google Maps"
                    >
                        📍
                    </button>
                </p>
                {event.offerMinTickets > 0 && event.offerDiscount > 0 && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', display: 'inline-block' }}>
                        🎁 Buy {event.offerMinTickets}+ get {event.offerDiscount}% off
                    </div>
                )}
                <div style={{ marginTop: 'auto' }}>
                    <div className={styles.price}>
                        ${event.price}
                    </div>
                    <button
                        className={`premium-button ${styles.bookBtn}`}
                        onClick={handleBook}
                    >
                        Book Ticket
                    </button>
                </div>
            </div>
        </div>
    );
};
export default withFadeIn(EventCard);