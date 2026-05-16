import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BookingCard.module.css';

const BookingCard = ({ booking, isUrgent = false, isPast = false }) => {
    const navigate = useNavigate();

    const [imgErrored, setImgErrored] = useState(false);
    const event = booking.event;
    const seed = encodeURIComponent(event?._id || event?.title || event?.location || 'event');
    const seededFallback = `https://picsum.photos/seed/${seed}/800/450`;
    
    // Logic to handle both full URLs and local paths (uploads/...)
    let imageSrc = event?.image;
    if (imageSrc && !imageSrc.startsWith('http')) {
        imageSrc = `http://localhost:5000/${imageSrc}`;
    }
    
    const finalImageSrc = !imgErrored && imageSrc ? imageSrc : seededFallback;
    const cardClass = isUrgent ? styles.urgentCard : isPast ? `${styles.bookingCard} ${styles.pastCard}` : styles.bookingCard;

    return (
        <div
            className={cardClass}
            onClick={() => navigate(`/event/${event._id}`)}
        >
            {isUrgent && <div className={styles.urgentBadge}>Urgent / Soon</div>}

            <div className={styles.cardImageContainer}>
                <img
                    src={finalImageSrc}
                    alt={event.title}
                    className={styles.cardImage}
                    onError={() => setImgErrored(true)}
                />
            </div>

            <div className={styles.cardContent}>
                <h3 className={styles.eventTitle}>{booking.event.title}</h3>
                <div className={styles.eventMeta}>
                    <span>{new Date(booking.event.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{booking.event.time || 'TBA'}</span>
                </div>
                <div className={styles.eventMeta} style={{ marginBottom: '0.5rem' }}>
                    {booking.event.location}
                </div>

                <div className={styles.statusRow}>
                    <span className={styles.quantityBadge}>Qty: {booking.quantity}</span>
                    <span className={`${styles.statusBadge} ${isPast ? styles.past : ''}`}>
                        {isPast ? 'Completed' : 'Upcoming'}
                    </span>
                </div>
                <div className={styles.bookingId}>
                    ID: {booking._id.substring(0, 8)}...
                </div>
            </div>
        </div>
    );
};

export default BookingCard;
