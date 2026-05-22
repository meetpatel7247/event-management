import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setBookingDetails } from '../store/bookingSlice';
import CreateEventForm from '../components/Event/CreateEventForm';
import { eventApi } from '../utils/api';
import styles from './EventDetails.module.css';
import { toast } from 'react-toastify';

import EventImageSlider from '../components/EventDetails/EventImageSlider';
import BookingPanel from '../components/EventDetails/BookingPanel';
import RelatedEvents from '../components/EventDetails/RelatedEvents';
import Spinner from '../components/Spinner/Spinner';

/**
 * EventDetails Component
 * 
 * Displays comprehensive information about a single event.
 * Handles fetching event data, calculating group discounts, and initiating
 * the ticket booking flow. Allows Organizers/Admins to edit the event.
 */
const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [event, setEvent] = useState(null);
    const [relatedEvents, setRelatedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEditForm, setShowEditForm] = useState(false);

    const user = useSelector((state) => state.auth.user);
    const [quantity, setQuantity] = useState(1);
    const [discountInfo, setDiscountInfo] = useState({ discountAmount: 0, totalPrice: 0 });

    const fetchData = async () => {
        try {
            const data = await eventApi.getEventById(id);
            if (data) {
                setEvent(data);
                const allData = await eventApi.getEvents();
                setRelatedEvents(allData.filter(e => e.category === data.category && e._id !== data._id));
            } else toast.error('Event not found');
        } catch (error) {
            toast.error('Failed to load event details.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (event) {
            const minTickets = event.offerMinTickets || 0;
            const discountPercent = event.offerDiscount || 0;
            const discount = (minTickets > 0 && discountPercent > 0 && quantity >= minTickets) 
                ? (event.price * quantity * discountPercent) / 100 
                : 0;
            setDiscountInfo({ discountAmount: discount, totalPrice: (event.price * quantity) - discount });
        }
    }, [quantity, event]);

    useEffect(() => { fetchData(); }, [id]);

    const handleBook = () => {
        if (!user || !user.token) return navigate('/login');
        dispatch(setBookingDetails({ event, quantity, ...discountInfo }));
        navigate('/booking');
    };

    const handleUpdateEvent = async (updatedData) => {
        try {
            const updatedEvent = await eventApi.updateEvent(event._id, updatedData);
            setEvent(updatedEvent);
            setShowEditForm(false);
            toast.success('Event updated successfully!');
        } catch (error) { toast.error(error.message || 'Failed to update event'); }
    };

    if (loading) return <Spinner message="Loading event details..." />;
    if (!event) return (
        <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
            <h2>Event not found</h2>
            <button className="premium-button" style={{ width: 'auto', marginTop: '1rem' }} onClick={() => navigate('/')}>Back to Home</button>
        </div>
    );

    return (
        <div className={`container ${styles.pageContainer}`}>
            {showEditForm ? (
                <div className="premium-card">
                    <CreateEventForm onSubmit={handleUpdateEvent} initialData={event} onCancel={() => setShowEditForm(false)} />
                </div>
            ) : (
                <>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`premium-card ${styles.premiumCard}`}>
                        <div className={styles.contentGrid}>
                            <EventImageSlider event={event} />

                            <div className={styles.detailsSection}>
                                <div>
                                    <h1 className={styles.eventTitle}>{event.title}</h1>
                                    <div className={styles.eventMeta}>
                                        <span>{new Date(event.date).toLocaleDateString()}</span><span>•</span>
                                        <span>{event.time || 'TBA'}</span><span>•</span>
                                        <span>
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
                                        </span>
                                    </div>
                                </div>

                                <BookingPanel event={event} quantity={quantity} setQuantity={setQuantity} discountInfo={discountInfo} handleBook={handleBook} />

                                <div>
                                    <h3 className={styles.descriptionTitle}>About this Event</h3>
                                    <p className={styles.descriptionText}>{event.description}</p>
                                </div>

                                <div className={styles.actionButtons}>
                                    {user && (user.role === 'admin' || user.name === event.organizer?.name || user.role === 'organizer') && (
                                        <button className="premium-button" style={{ background: 'var(--secondary-color)', border: 'none', flex: 1 }} onClick={() => setShowEditForm(true)}>Edit Event</button>
                                    )}
                                    <button className="premium-button premium-button-outline" style={{ flex: 1 }} onClick={() => navigate('/')}>EVENTSPHERE</button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    <RelatedEvents relatedEvents={relatedEvents} />
                </>
            )}
        </div>
    );
};

export default EventDetails;
