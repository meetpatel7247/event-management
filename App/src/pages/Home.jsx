import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { eventApi, userApi } from '../utils/api';
import HeroSlider from '../components/HeroSlider/HeroSlider';
import CategoryRow from '../components/CategoryRow/CategoryRow';
import EventCarousel from '../components/Event/EventCarousel';
import EventCard from '../components/Event/EventCard';
import { toast } from 'react-toastify';

/**
 * Home Page Component
 * 
 * The main landing page of the application. Handles fetching and filtering
 * of events based on search terms, category filters, and URL query parameters.
 * Renders the HeroSlider and several EventCarousels based on event categories.
 * 
 * @param {string} searchTerm - Optional global search string passed down from Navbar
 * @param {string} searchLocation - Optional global location string passed down from Navbar
 */
const Home = ({ searchTerm, searchLocation }) => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [category, setCategory] = useState('');
    const [view, setView] = useState('');
    const [loading, setLoading] = useState(true);
    const [slowLoad, setSlowLoad] = useState(false);
    const location = useLocation();
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        const fetchEvents = async () => {
            // Show "waking up server" notice if request takes more than 6.0s (only for production, not localhost)
            const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            const slowTimer = !isLocal ? setTimeout(() => setSlowLoad(true), 6000) : null;
            try {
                let wishlistPromise = Promise.resolve([]);
                if (user && user.token) {
                    wishlistPromise = userApi.getWishlist().catch(err => {
                        console.error('Failed to load wishlist in Home:', err);
                        return [];
                    });
                }

                const [wishlist, data] = await Promise.all([
                    wishlistPromise,
                    eventApi.getEvents()
                ]);

                const wishlistIds = new Set(
                    (wishlist || []).filter(e => e && e._id).map(e => e._id.toString())
                );

                const mappedData = data.map(event => ({
                    ...event,
                    isLiked: wishlistIds.has(event._id.toString())
                }));

                const approvedData = mappedData.filter(event => event.isApproved);

                setEvents(approvedData);
                setFilteredEvents(approvedData);
            } catch (error) {
                toast.error('Failed to load events from server.');
                console.error(error);
            } finally {
                if (slowTimer) clearTimeout(slowTimer);
                setSlowLoad(false);
                setLoading(false);
            }
        };

        fetchEvents();
    }, [user]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const catParam = params.get('cat');
        const viewParam = params.get('view');

        setCategory(catParam || '');
        setView(viewParam === 'all' ? 'all' : '');
    }, [location.search]);

    useEffect(() => {
        let result = events;

        if (searchTerm) {
            result = result.filter(event =>
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.location.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (searchLocation) {
            result = result.filter(event => 
                event.location.toLowerCase().includes(searchLocation.toLowerCase())
            );
        }

        if (category) {
            result = result.filter(event => event.category === category);
        }

        setFilteredEvents(result);
    }, [searchTerm, searchLocation, category, events]);

    return (
        <>
            {/* Server wake-up notice banner */}
            {slowLoad && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    background: 'rgba(99,102,241,0.12)',
                    border: '1px solid rgba(99,102,241,0.35)',
                    borderRadius: '10px',
                    padding: '0.75rem 1.25rem',
                    margin: '1rem 0',
                    color: 'var(--text-muted)',
                    fontSize: '0.9rem',
                }}>
                    <span style={{
                        width: '16px', height: '16px', borderRadius: '50%',
                        border: '2px solid rgba(99,102,241,0.4)',
                        borderTop: '2px solid #6366f1',
                        display: 'inline-block',
                        animation: 'spin 0.9s linear infinite',
                        flexShrink: 0,
                    }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    ⚡ Server is waking up — events will appear shortly. Thanks for your patience!
                </div>
            )}

            {!loading && events.length === 0 ? (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                    padding: '4rem 2rem',
                    textAlign: 'center',
                    background: 'rgba(10, 10, 15, 0.6)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(0, 243, 255, 0.15)',
                    borderRadius: '24px',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), var(--shadow-card)',
                    margin: '3rem auto 2rem',
                    maxWidth: '800px',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Glowing background shapes for a premium futuristic feel */}
                    <div style={{
                        position: 'absolute',
                        top: '-10%',
                        left: '-10%',
                        width: '150px',
                        height: '150px',
                        background: 'var(--primary-color)',
                        filter: 'blur(100px)',
                        opacity: 0.2,
                        borderRadius: '50%',
                        pointerEvents: 'none'
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: '-10%',
                        right: '-10%',
                        width: '150px',
                        height: '150px',
                        background: 'var(--secondary-color)',
                        filter: 'blur(100px)',
                        opacity: 0.2,
                        borderRadius: '50%',
                        pointerEvents: 'none'
                    }} />

                    {/* Animated Neon Icon */}
                    <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: 'rgba(0, 243, 255, 0.05)',
                        border: '2px dashed var(--primary-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3.5rem',
                        marginBottom: '2rem',
                        boxShadow: '0 0 20px rgba(0, 243, 255, 0.1)',
                        animation: 'pulseGlow 2.5s infinite ease-in-out',
                        flexShrink: 0
                    }}>
                        📅
                    </div>
                    <style>{`
                        @keyframes pulseGlow {
                            0% { transform: scale(1); box-shadow: 0 0 20px rgba(0, 243, 255, 0.1); border-color: rgba(0, 243, 255, 0.4); }
                            50% { transform: scale(1.05); box-shadow: 0 0 35px rgba(0, 243, 255, 0.3); border-color: var(--primary-color); }
                            100% { transform: scale(1); box-shadow: 0 0 20px rgba(0, 243, 255, 0.1); border-color: rgba(0, 243, 255, 0.4); }
                        }
                    `}</style>

                    <h2 className="text-gradient" style={{
                        fontSize: '2.5rem',
                        fontFamily: "'Orbitron', sans-serif",
                        fontWeight: '700',
                        letterSpacing: '2px',
                        marginBottom: '1rem',
                        textTransform: 'uppercase'
                    }}>
                        No Scheduled Events
                    </h2>

                    <p style={{
                        fontSize: '1.2rem',
                        color: 'var(--text-muted)',
                        maxWidth: '550px',
                        lineHeight: '1.6',
                        margin: '0 auto 2rem',
                        fontFamily: "'Rajdhani', sans-serif",
                        letterSpacing: '0.5px'
                    }}>
                        There are currently no events active or scheduled on the platform. Please check back later, or start creating events now!
                    </p>

                    <div style={{ 
                        display: 'flex', 
                        gap: '1rem', 
                        flexWrap: 'wrap', 
                        justifyContent: 'center',
                        marginTop: '1rem',
                        width: '100%',
                        maxWidth: '450px'
                    }}>
                        {user?.role === 'organizer' ? (
                            <Link to="/organizer" className="premium-button" style={{ 
                                textDecoration: 'none', 
                                display: 'inline-block',
                                textAlign: 'center',
                                padding: '0.85rem 2rem'
                            }}>
                                ➕ Create Event
                            </Link>
                        ) : user ? (
                            <div style={{
                                padding: '1rem 2rem',
                                color: 'var(--primary-color)',
                                border: '1px solid rgba(0, 243, 255, 0.2)',
                                borderRadius: 'var(--radius)',
                                background: 'rgba(0, 243, 255, 0.02)',
                                fontSize: '1rem',
                                fontFamily: "'Rajdhani', sans-serif",
                                width: '100%',
                                textAlign: 'center'
                            }}>
                                💡 Sign in as an <strong style={{ textShadow: '0 0 5px var(--primary-color)' }}>Organizer</strong> to create and host your own events!
                            </div>
                        ) : (
                            <Link to="/login" className="premium-button" style={{ 
                                textDecoration: 'none', 
                                display: 'inline-block',
                                textAlign: 'center',
                                padding: '0.85rem 2rem',
                                width: '100%'
                            }}>
                                🔑 Login / Register
                            </Link>
                        )}
                    </div>
                </div>
            ) : !searchTerm && !searchLocation && !category && view !== 'all' ? (
                <>
                    <HeroSlider />
                    <CategoryRow />
                    {[
                        { title: "Recommended Events", events: events },
                        { title: "Music & Concerts", events: events.filter(e => e.category === 'Music' || e.category === 'Concert') },
                        { title: "The Best of Live Events", events: events.slice().reverse() },
                        { title: "Sports Action", events: events.filter(e => e.category === 'Sport') },
                        { title: "Technical Workshops", events: events.filter(e => e.category === 'Technology') }
                    ].map((section, index) => (
                        <EventCarousel key={index} title={section.title} events={section.events} loading={loading} />
                    ))}
                </>
            ) : (
                <section style={{ marginTop: '2rem' }}>
                    <CategoryRow />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '2rem' }}>
                            {searchTerm ? `Search Results for "${searchTerm}"` :
                                searchLocation ? `Events in ${searchLocation}` :
                                category ? `${category}s` :
                                    'All Events'}
                        </h2>
                    </div>

                    {loading ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} style={{
                                    height: '340px',
                                    borderRadius: '16px',
                                    background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.04) 75%)',
                                    backgroundSize: '200% 100%',
                                    animation: 'shimmer 1.6s infinite',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                }} />
                            ))}
                            <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
                        </div>
                    ) : (
                        <div className="responsive-grid">
                            {filteredEvents.map((event) => (
                                <EventCard key={event._id} event={event} isGrid={true} />
                            ))}
                        </div>
                    )}

                    {!loading && filteredEvents.length === 0 && (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>
                            No events found.
                        </div>
                    )}
                </section>
            )}
        </>
    );
};

export default Home;
