import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { eventApi } from '../utils/api';
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

    useEffect(() => {
        const fetchEvents = async () => {
            // Show "waking up server" notice if request takes more than 2.5s
            const slowTimer = setTimeout(() => setSlowLoad(true), 2500);
            try {
                const data = await eventApi.getEvents();
                setEvents(data);
                setFilteredEvents(data);
            } catch (error) {
                toast.error('Failed to load events from server.');
                console.error(error);
            } finally {
                clearTimeout(slowTimer);
                setSlowLoad(false);
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

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

            {!searchTerm && !searchLocation && !category && view !== 'all' ? (
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
