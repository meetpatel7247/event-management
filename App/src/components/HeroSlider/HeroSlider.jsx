import React, { useState, useEffect, useRef } from 'react';
import styles from './HeroSlider.module.css';

const slides = [
    {
        id: 1,
        title: "Coldplay: Music of the Spheres",
        subtitle: "Experience the magic live in Mumbai",
        color: "#1a2a6c",
        image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Sunburn Goa 2026",
        subtitle: "The world's biggest music festival returns",
        color: "#b21f1f",
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "Comedy All-Stars",
        subtitle: "Laugh out loud with the best comics",
        color: "#fdbb2d",
        image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?q=80&w=2070&auto=format&fit=crop"
    }
];

/**
 * HeroSlider Component
 * 
 * Prominent auto-playing image carousel used at the top of the Home page
 * to highlight featured or sponsored events.
 */
const HeroSlider = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const trackRef = useRef(null);

    /**
     * Auto-advance the slider every 5 seconds.
     */

    useEffect(() => {
        const interval = setInterval(() => {
            if (trackRef.current) {
                const nextIndex = (activeIndex + 1) % slides.length;
                const width = trackRef.current.offsetWidth;
                trackRef.current.scrollTo({ left: nextIndex * width, behavior: 'smooth' });
                setActiveIndex(nextIndex);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [activeIndex]);

    /**
     * Allows manual tracking when a user scrolls horizontally, updating
     * the active indicator dot.
     */
    const handleScroll = () => {
        if (trackRef.current) {
            const width = trackRef.current.offsetWidth;
            const index = Math.round(trackRef.current.scrollLeft / width);
            setActiveIndex(index);
        }
    };

    return (
        <div className={styles.sliderContainer}>
            <div className={styles.track} ref={trackRef} onScroll={handleScroll}>
                {slides.map((slide) => (
                    <div
                        key={slide.id}
                        className={styles.slide}
                        style={{ backgroundImage: `url(${slide.image})` }}
                    >
                        <div className={styles.overlay}>
                            <h2 className={styles.title}>{slide.title}</h2>
                            <p className={styles.subtitle}>{slide.subtitle}</p>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>

                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.indicators}>
                {slides.map((_, index) => (
                    <div
                        key={index}
                        className={`${styles.dot} ${index === activeIndex ? styles.active : ''}`}
                        onClick={() => {
                            if (trackRef.current) {
                                trackRef.current.scrollTo({ left: index * trackRef.current.offsetWidth, behavior: 'smooth' });
                            }
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroSlider;
