import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard/GlassCard';
import styles from './Offers.module.css';
import { toast } from 'react-toastify';

/**
 * Offers Page Component
 * 
 * A static promotional page outlining special discounts, such as
 * group rate triggers and seasonal benefits, designed to encourage ticket sales.
 */
const Offers = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/v1/offers');
                const data = await response.json();
                setOffers(data);
            } catch (error) {
                toast.error('Failed to load special offers.');
            } finally {
                setLoading(false);
            }
        };

        fetchOffers();
    }, []);

    if (loading) {
        return <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>Loading offers...</div>;
    }

    return (
        <div className="container" style={{ marginTop: '3rem' }}>
            <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Special Offers</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '600px' }}>
                Discover exclusive discounts and benefits for your favorite events. Book more, save more!
            </p>

            <div className={styles.offersGrid}>
                {offers.map((offer) => (
                    <div key={offer._id} className={styles.offerCard}>
                        <div className={styles.discountBadge}>
                            {offer.discountPercentage}% OFF
                        </div>
                        <div className={styles.offerContent}>
                            <h2>{offer.title}</h2>
                            <p>{offer.description}</p>
                            {offer.triggerCount && (
                                <div className={styles.requirement}>
                                    Requires at least {offer.triggerCount} tickets
                                </div>
                            )}
                        </div>
                        <div className={styles.offerFooter}>
                            <button className="premium-button" onClick={() => window.location.href = '/'}>
                                Find Events
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <section style={{ marginTop: '5rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>How it works</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                    <div className={styles.infoStep}>
                        <div className={styles.stepNumber}>1</div>
                        <h3>Choose an Event</h3>
                        <p>Browse through our wide variety of events, from music festivals to tech summits.</p>
                    </div>
                    <div className={styles.infoStep}>
                        <div className={styles.stepNumber}>2</div>
                        <h3>Select Tickets</h3>
                        <p>Add the required number of tickets to your cart to trigger the discount.</p>
                    </div>
                    <div className={styles.infoStep}>
                        <div className={styles.stepNumber}>3</div>
                        <h3>Instant Savings</h3>
                        <p>The discount is automatically applied during checkout. No coupon codes needed!</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Offers;
