import React from 'react';
import styles from './BookingPanel.module.css';

const BookingPanel = ({ event, quantity, setQuantity, discountInfo, handleBook }) => {
    return (
        <div className={styles.priceCard}>
            <div className={styles.priceHeader}>
                <div>
                    <div className={styles.priceLabel}>Price per ticket</div>
                    <div className={styles.priceValue}>₹{event.price}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div className={styles.priceLabel}>Organizer</div>
                    <div className={styles.organizerName}>{event.organizer?.name}</div>
                </div>
            </div>

            <div className={styles.quantityRow}>
                <span style={{ fontWeight: '500' }}>Quantity</span>
                <div className={styles.quantityControls}>
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className={styles.quantityBtn}
                    >-</button>
                    <span className={styles.quantityDisplay}>{quantity}</span>
                    <button
                        onClick={() => setQuantity(Math.min(event.availableSeats, quantity + 1))}
                        className={styles.quantityBtn}
                    >+</button>
                </div>
            </div>

            {event.offerMinTickets > 0 && event.offerDiscount > 0 && (
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '1rem', border: '1px dashed #10b981' }}>
                    🎉 <strong>Special Offer:</strong> Book {event.offerMinTickets} or more tickets to get {event.offerDiscount}% off!
                </div>
            )}

            {discountInfo.discountAmount > 0 && (
                <div className={styles.discountMsg}>
                    Offer Discount Applied! (Saved ₹{discountInfo.discountAmount})
                </div>
            )}

            <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total</span>
                <span className={styles.totalValue}>₹{discountInfo.totalPrice}</span>
            </div>

            <button
                className="premium-button"
                style={{ padding: '1rem', fontSize: '1.1rem' }}
                onClick={handleBook}
            >
                Book Now
            </button>
            <div className={styles.seatsRemaining}>
                {event.availableSeats} seats remaining
            </div>
        </div>
    );
};

export default BookingPanel;
