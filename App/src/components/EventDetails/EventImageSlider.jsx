import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import styles from './EventImageSlider.module.css';

const EventImageSlider = ({ event }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const seed = encodeURIComponent(event?._id || event?.title || event?.location || 'event');
    const seededFallback = `https://picsum.photos/seed/${seed}/1200/675`;
    
    // Normalize images: resolve relative paths and add fallback
    const rawImages = (event?.images?.length ? event.images : [event?.image || seededFallback]).filter(Boolean);
    const sliderImages = rawImages.map(img => {
        if (img && typeof img === 'string' && !img.startsWith('http')) {
            return `http://localhost:5000/${img}`;
        }
        return img;
    });

    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % sliderImages.length);
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);

    return (
        <div className={styles.imageSection}>
            <AnimatePresence mode='wait'>
                <motion.img
                    key={currentImageIndex}
                    src={sliderImages[currentImageIndex]}
                    alt={event.title}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className={styles.image}
                />
            </AnimatePresence>
            <div className={`${styles.navButton} ${styles.prevButton}`} onClick={prevImage}>
                <FaChevronLeft color="white" size={24} />
            </div>
            <div className={`${styles.navButton} ${styles.nextButton}`} onClick={nextImage}>
                <FaChevronRight color="white" size={24} />
            </div>
            <div className={styles.categoryTag}>
                <span className={styles.categoryBadge}>{event.category}</span>
            </div>
        </div>
    );
};

export default EventImageSlider;
