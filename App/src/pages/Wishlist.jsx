import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { userApi, eventApi } from '../utils/api';
import EventCard from '../components/Event/EventCard';
import Spinner from '../components/Spinner/Spinner';
import { toast } from 'react-toastify';

/**
 * Wishlist Page Component
 * 
 * Fetches and displays:
 * 1. The authenticated user's persistently wishlisted events (saved in the database).
 * 2. A secondary "Top Rated Events" section, showcasing events sorted by their like count descending.
 */
const Wishlist = () => {
    const [wishlistEvents, setWishlistEvents] = useState([]);
    const [topRatedEvents, setTopRatedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();

    const loadData = async () => {
        try {
            // Fetch wishlist if authenticated
            let wishlisted = [];
            if (user && user.token) {
                wishlisted = await userApi.getWishlist();
            }

            // Fetch all events for the "Top Rated Events" listing
            const allEvents = await eventApi.getEvents();
            
            // Map wishlisted events to ensure they show up with filled hearts, filtering out any deleted/null events safely
            const validWishlisted = wishlisted.filter(ev => ev && ev._id);
            const wishlistMapped = validWishlisted.map(ev => ({
                ...ev,
                isLiked: true
            }));

            // Map all events to verify if they are liked by the current user
            const wishlistIds = new Set(validWishlisted.map(e => e._id.toString()));
            const topRatedMapped = allEvents
                .filter(ev => ev && ev._id)
                .map(ev => ({
                    ...ev,
                    isLiked: wishlistIds.has(ev._id.toString())
                }))
                .sort((a, b) => (b.likes || 0) - (a.likes || 0));

            setWishlistEvents(wishlistMapped);
            setTopRatedEvents(topRatedMapped);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load wishlist or top rated events.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        loadData();
    }, [user]);

    useEffect(() => {
        const handleGlobalLikeToggle = (e) => {
            const { eventId, liked, likes } = e.detail;
            
            // Keep the wishlistEvents synced by updating the specific event's properties so it doesn't instantly vanish jarringly
            setWishlistEvents(prev => prev.map(ev => {
                if (ev._id === eventId) {
                    return { ...ev, isLiked: liked, likes: likes };
                }
                return ev;
            }));

            // Also keep top-rated section in sync immediately
            setTopRatedEvents(prev => prev.map(ev => {
                if (ev._id === eventId) {
                    return { ...ev, isLiked: liked, likes: likes };
                }
                return ev;
            }).sort((a, b) => (b.likes || 0) - (a.likes || 0)));
        };

        window.addEventListener('event-like-toggled', handleGlobalLikeToggle);
        return () => window.removeEventListener('event-like-toggled', handleGlobalLikeToggle);
    }, []);

    if (loading) return <Spinner message="Loading your favorites..." />;

    return (
        <div className="container" style={{ padding: '2rem 1rem 4rem', minHeight: '80vh', display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
            
            {/* ── SECTION 1: USER'S PERSISTENT WISHLIST ── */}
            <section style={{ animation: 'admFadeIn 0.3s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
                    <span style={{ fontSize: '2rem' }}>💖</span>
                    <div>
                        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #ec4899, #f43f5e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>My Wishlist</h1>
                        <p style={{ color: 'var(--text-muted)', margin: '0.2rem 0 0', fontSize: '0.95rem' }}>Your saved events synced across all your sessions</p>
                    </div>
                </div>

                {!user ? (
                    <div style={{ textAlign: 'center', padding: '3.5rem 2rem', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '16px' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔒</div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f3f4f6', margin: '0 0 0.5rem' }}>Login to Save Events</h3>
                        <p style={{ color: 'var(--text-muted)', maxWidth: '380px', margin: '0 auto 1.5rem', fontSize: '0.88rem', lineHeight: 1.5 }}>
                            Unlock persistent wishlists! Creating an account or logging in lets you save your favorite music, tech, and sports events.
                        </p>
                        <button className="premium-button" style={{ width: 'auto', padding: '0.6rem 2rem' }} onClick={() => navigate('/login')}>
                            Sign In / Register
                        </button>
                    </div>
                ) : wishlistEvents.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '16px' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✨</div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f3f4f6', margin: '0 0 0.5rem' }}>Your wishlist is empty</h3>
                        <p style={{ color: 'var(--text-muted)', maxWidth: '380px', margin: '0 auto 1.5rem', fontSize: '0.88rem', lineHeight: 1.5 }}>
                            Tap the heart icon on any event card to save it here. We'll sync them automatically across all your devices.
                        </p>
                        <button className="premium-button" style={{ width: 'auto', padding: '0.6rem 2rem' }} onClick={() => navigate('/')}>
                            Explore Events
                        </button>
                    </div>
                ) : (
                    <div className="responsive-grid">
                        {wishlistEvents.map(event => (
                            <EventCard key={event._id} event={event} isGrid={true} />
                        ))}
                    </div>
                )}
            </section>

            {/* ── SECTION 2: TOP RATED EVENTS (Likes Descending) ── */}
            <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '3.5rem', animation: 'admFadeIn 0.4s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
                    <span style={{ fontSize: '2rem' }}>🔥</span>
                    <div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: '#f3f4f6' }}>Top Rated Events</h2>
                        <p style={{ color: 'var(--text-muted)', margin: '0.2rem 0 0', fontSize: '0.95rem' }}>Most liked events by the community right now</p>
                    </div>
                </div>

                {topRatedEvents.length === 0 ? (
                    <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>No events found on the platform yet.</div>
                ) : (
                    <div className="responsive-grid">
                        {topRatedEvents.slice(0, 5).map(event => (
                            <EventCard key={event._id} event={event} isGrid={true} />
                        ))}
                    </div>
                )}
            </section>
            
        </div>
    );
};

export default Wishlist;
