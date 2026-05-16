import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EventCard from './EventCard';
import styles from './EventCarousel.module.css';

/**
 * EventCarousel Component
 * 
 * A horizontal scrollable container for EventCards. Includes smart left/right
 * navigation buttons that appear conditionally based on the scroll position.
 * 
 * @param {string} title - The section header (e.g., "Recommended Events")
 * @param {Array} events - The array of event objects to render inside this carousel
 */
const EventCarousel = ({ title, events }) => {
    const trackRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    /**
     * Inspects the DOM node's current scrolling dimensions and updates
     * the local state to determine if the navigation chevrons should be shown.
     */
    const checkScroll = () => {
        if (trackRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(Math.round(scrollLeft + clientWidth) < scrollWidth - 2);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [events]);

    const scroll = (direction) => {
        if (trackRef.current) {
            const { current } = trackRef;
            const scrollAmount = direction === 'left' ? -350 : 350;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h2 className={styles.title}>{title}</h2>
                <Link to="/?view=all" className={styles.seeAll}>See All ›</Link>
            </div>

            {canScrollLeft && (
                <button
                    className={`${styles.navBtn} ${styles.prevBtn}`}
                    onClick={() => scroll('left')}
                    aria-label="Scroll Left"
                >
                    ‹
                </button>
            )}

            {canScrollRight && events && events.length > 0 && (
                <button
                    className={`${styles.navBtn} ${styles.nextBtn}`}
                    onClick={() => scroll('right')}
                    aria-label="Scroll Right"
                >
                    ›
                </button>
            )}

            <div className={styles.track} ref={trackRef} onScroll={checkScroll}>
                {events && events.length > 0 ? (
                    events.map(event => (
                        <div key={event._id} className={styles.item}>
                            <EventCard event={event} />
                        </div>
                    ))
                ) : (
                    <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>No events available</div>
                )}
            </div>
        </div>
    );
};

export default EventCarousel;
