import React, { useRef, useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import styles from './BookingSlider.module.css';

/**
 * Reusable Slider Component for Booking Cards
 * 
 * Takes an array of bookings and renders them in a horizontally scrollable track.
 * Showcases smart navigation chevrons if the content overflows the container.
 * 
 * @param {string} title - Section title (e.g., "Happening Soon")
 * @param {string} titleIcon - Optional emoji or element next to title
 * @param {Array} bookings - Array of booking objects to render
 * @param {Function} renderCard - Map function returning JSX for each booking
 * @param {boolean} isUrgent - Flag to style cards specially
 * @param {boolean} isPast - Flag to style cards specially
 */
const BookingSlider = ({ title, titleIcon, bookings, renderCard, isUrgent, isPast }) => {
    const sliderRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (sliderRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(Math.round(scrollLeft + clientWidth) < scrollWidth - 2);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [bookings]);

    const scroll = (direction) => {
        if (sliderRef.current) {
            const scrollAmount = sliderRef.current.clientWidth * 0.8;
            sliderRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div style={{ marginBottom: '1rem', paddingBottom: '3rem' }}>
            <h2 className={styles.sectionTitle} style={isPast ? { color: 'var(--text-muted)' } : {}}>
                {titleIcon && <span style={{ color: '#ef4444', marginRight: '8px' }}>{titleIcon}</span>}
                {title}
            </h2>
            <div className={styles.sliderWrapper}>
                {canScrollLeft && (
                    <button className={`${styles.navButton} ${styles.left}`} onClick={() => scroll('left')}>
                        <FaChevronLeft size={20} />
                    </button>
                )}
                <div className={styles.sliderContainer} ref={sliderRef} onScroll={checkScroll}>
                    {bookings.map(booking => renderCard(booking, isUrgent, isPast))}
                </div>
                {canScrollRight && bookings.length > 0 && sliderRef.current && sliderRef.current.scrollWidth > sliderRef.current.clientWidth && (
                    <button className={`${styles.navButton} ${styles.right}`} onClick={() => scroll('right')}>
                        <FaChevronRight size={20} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default BookingSlider;
