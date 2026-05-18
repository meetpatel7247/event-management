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

    // ── Like state (persisted per event in localStorage) ──────────────
    const likeKey = `liked_${event._id}`;
    const [liked, setLiked] = useState(() => localStorage.getItem(likeKey) === 'true');
    const [likeCount, setLikeCount] = useState(() => {
        const stored = parseInt(localStorage.getItem(`likeCount_${event._id}`), 10);
        return isNaN(stored) ? (event.likes || 0) : stored;
    });
    const [likeBounce, setLikeBounce] = useState(false);

    // ── Share feedback state ───────────────────────────────────────────
    const [shareCopied, setShareCopied] = useState(false);

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

    /** Toggle like with animation and localStorage persistence */
    const handleLike = (e) => {
        e.stopPropagation();
        const newLiked = !liked;
        const newCount = newLiked ? likeCount + 1 : Math.max(0, likeCount - 1);
        setLiked(newLiked);
        setLikeCount(newCount);
        setLikeBounce(true);
        setTimeout(() => setLikeBounce(false), 400);
        localStorage.setItem(likeKey, String(newLiked));
        localStorage.setItem(`likeCount_${event._id}`, String(newCount));
    };

    /** Share via native API or copy link to clipboard */
    const handleShare = async (e) => {
        e.stopPropagation();
        const appBase = import.meta.env.VITE_APP_URL || window.location.origin;
        const shareUrl = `${appBase}/event/${event._id}`;
        const shareData = {
            title: event.title,
            text: `Check out this event: ${event.title} on ${new Date(event.date).toLocaleDateString()}`,
            url: shareUrl,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareUrl);
                setShareCopied(true);
                setTimeout(() => setShareCopied(false), 2000);
            }
        } catch {
            // User cancelled share or clipboard unavailable — silently ignore
        }
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

                {/* ── Like & Share badges on the image top-right ── */}
                <div className={styles.cardActions} onClick={e => e.stopPropagation()}>
                    {/* Share */}
                    <button
                        className={`${styles.actionBtn} ${shareCopied ? styles.actionBtnCopied : ''}`}
                        onClick={handleShare}
                        title="Share this event"
                        aria-label="Share event"
                    >
                        {shareCopied ? '✅' : '🔗'}
                    </button>

                    {/* Like */}
                    <button
                        className={`${styles.actionBtn} ${liked ? styles.actionBtnLiked : ''} ${likeBounce ? styles.bounce : ''}`}
                        onClick={handleLike}
                        title={liked ? 'Unlike' : 'Like this event'}
                        aria-label={liked ? 'Unlike event' : 'Like event'}
                    >
                        {liked ? '❤️' : '🤍'}
                    </button>
                </div>
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
                        ₹{event.price}
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