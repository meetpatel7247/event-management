import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setBookingDetails } from '../../store/bookingSlice';
import withFadeIn from '../../hoc/withFadeIn';
import { eventApi } from '../../utils/api';
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
    const [liked, setLiked] = useState(() => {
        if (user && user.token) {
            if (event.isLiked !== undefined) return event.isLiked;
        }
        return localStorage.getItem(likeKey) === 'true';
    });
    const [likeCount, setLikeCount] = useState(event.likes || 0);
    const [shareCount, setShareCount] = useState(event.shares || 0);
    const [likeBounce, setLikeBounce] = useState(false);

    // Track previous value of the prop to prevent parent updates (such as searching/filters) from resetting local liked state
    const prevIsLikedRef = useRef(event.isLiked);

    // ── Share feedback state ───────────────────────────────────────────
    const [shareCopied, setShareCopied] = useState(false);

    useEffect(() => {
        setLikeCount(event.likes || 0);
        setShareCount(event.shares || 0);
    }, [event.likes, event.shares, event._id]);

    // Keep state in sync with updated props from database wishlist (only when prop actually changes)
    useEffect(() => {
        if (user && user.token) {
            if (event.isLiked !== undefined && event.isLiked !== prevIsLikedRef.current) {
                setLiked(event.isLiked);
                prevIsLikedRef.current = event.isLiked;
            }
        } else {
            const localVal = localStorage.getItem(likeKey) === 'true';
            if (localVal !== liked) {
                setLiked(localVal);
            }
        }
    }, [event.isLiked, event._id, likeKey, user, liked]);

    // Sync all copies/instances of this event card across different sections/carousels in real-time
    useEffect(() => {
        const handleGlobalLikeToggle = (e) => {
            if (e.detail.eventId === event._id) {
                setLiked(e.detail.liked);
                setLikeCount(e.detail.likes);
                prevIsLikedRef.current = e.detail.liked;
            }
        };
        window.addEventListener('event-like-toggled', handleGlobalLikeToggle);
        return () => window.removeEventListener('event-like-toggled', handleGlobalLikeToggle);
    }, [event._id]);

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

    /** Toggle like — synced to server so admin can see totals */
    const handleLike = async (e) => {
        e.stopPropagation();
        const newLiked = !liked;
        const action = newLiked ? 'like' : 'unlike';
        setLiked(newLiked);
        setLikeBounce(true);
        setTimeout(() => setLikeBounce(false), 400);
        localStorage.setItem(likeKey, String(newLiked));
        try {
            const res = await eventApi.toggleLike(event._id, action);
            setLikeCount(res.likes);
            // Dispatch to other cards instantly
            window.dispatchEvent(new CustomEvent('event-like-toggled', {
                detail: { eventId: event._id, liked: newLiked, likes: res.likes }
            }));
        } catch {
            setLiked(!newLiked);
            localStorage.setItem(likeKey, String(!newLiked));
        }
    };

    /** Share via native API or copy link — counts on server when share succeeds */
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
            const res = await eventApi.recordShare(event._id);
            setShareCount(res.shares);
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
                {event.isApproved === false && (
                    <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: 'rgba(245, 158, 11, 0.9)',
                        backdropFilter: 'blur(4px)',
                        color: 'white',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '20px',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        zIndex: 2,
                    }}>
                        🕒 Pending Approval
                    </div>
                )}
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
                        title={`Share (${shareCount})`}
                        aria-label="Share event"
                    >
                        {shareCopied ? '✅' : '🔗'}
                        {shareCount > 0 && <span className={styles.actionCount}>{shareCount}</span>}
                    </button>

                    {/* Like */}
                    <button
                        className={`${styles.actionBtn} ${liked ? styles.actionBtnLiked : ''} ${likeBounce ? styles.bounce : ''}`}
                        onClick={handleLike}
                        title={liked ? 'Unlike' : 'Like this event'}
                        aria-label={liked ? 'Unlike event' : 'Like event'}
                    >
                        {liked ? '❤️' : '🤍'}
                        {likeCount > 0 && <span className={styles.actionCount}>{likeCount}</span>}
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