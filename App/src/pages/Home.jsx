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
    const location = useLocation();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await eventApi.getEvents();
                setEvents(data);
                setFilteredEvents(data);
            } catch (error) {
                toast.error('Failed to load events from server.');
                console.error(error);
            } finally {
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
                        <EventCarousel key={index} title={section.title} events={section.events} />
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
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading vibes...</div>
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
