import React, { useState, useEffect } from 'react';
import { bookingApi } from '../utils/api';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearBookingDetails, setBookingDetails } from '../store/bookingSlice';
import { toast } from 'react-toastify';

/**
 * BookingPage Component
 *
 * Checkout and confirmation screen for purchasing event tickets.
 * Users select a ticket tier (Normal / VIP / VVIP), adjust quantity,
 * and confirm the booking via the API.
 */
const TICKET_TYPES = [
    {
        id: 'Normal',
        label: 'Normal',
        emoji: '🎟️',
        description: 'General admission ticket',
        gradient: 'linear-gradient(135deg, #374151, #1f2937)',
        border: '#4b5563',
        badge: null,
    },
    {
        id: 'VIP',
        label: 'VIP',
        emoji: '⭐',
        description: 'Priority entry & exclusive lounge access',
        gradient: 'linear-gradient(135deg, #1e3a5f, #1e40af)',
        border: '#3b82f6',
        badge: 'Popular',
    },
    {
        id: 'VVIP',
        label: 'VVIP',
        emoji: '👑',
        description: 'Front row seats, backstage & meet & greet',
        gradient: 'linear-gradient(135deg, #4c1d1d, #7c2d12)',
        border: '#f59e0b',
        badge: 'Premium',
    },
];

const BookingPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { bookingEvent, quantity, totalPrice, discountAmount, ticketType } = useSelector((state) => state.booking);
    const user = useSelector((state) => state.auth.user);

    const [guestName, setGuestName] = useState(user?.name || '');
    const [guestEmail, setGuestEmail] = useState(user?.email || '');
    const [emailPreviewUrl, setEmailPreviewUrl] = useState(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            if (!guestName) setGuestName(user.name || '');
            if (!guestEmail) setGuestEmail(user.email || '');
        }
    }, [user]);

    useEffect(() => {
        if (!bookingEvent && !bookingSuccess) {
            navigate('/');
        }
    }, [bookingEvent, bookingSuccess, navigate]);

    /** Returns the unit price for the given ticket tier */
    const getPriceForType = (type) => {
        if (!bookingEvent) return 0;
        if (type === 'VIP') return bookingEvent.price + 300;
        if (type === 'VVIP') return bookingEvent.price + 600;
        return bookingEvent.price;
    };

    /** Recalculate totals whenever quantity or ticket type changes */
    const recalculate = (newQty, newType) => {
        const unitPrice = getPriceForType(newType);
        let discount = 0;
        if (newQty >= 3) {
            discount = (unitPrice * newQty * 20) / 100;
        }
        const newTotal = unitPrice * newQty - discount;
        dispatch(setBookingDetails({
            event: bookingEvent,
            quantity: newQty,
            totalPrice: newTotal,
            discountAmount: discount,
            ticketType: newType,
        }));
    };

    const handleTypeSelect = (type) => {
        recalculate(quantity, type);
    };

    const updateQuantity = (newQuantity) => {
        if (newQuantity < 1 || newQuantity > bookingEvent.availableSeats) return;
        recalculate(newQuantity, ticketType);
    };

    const handleConfirmBooking = async () => {
        if (!user || !user.token) {
            navigate('/login');
            return;
        }
        if (!guestName || !guestEmail) {
            toast.error('Please provide your name and email.');
            return;
        }

        setLoading(true);
        try {
            const res = await bookingApi.createBooking({
                eventId: bookingEvent._id,
                quantity,
                totalPrice,
                guestName,
                guestEmail,
                ticketType,
            });

            toast.success('Ticket booked successfully!');
            if (res && res.emailPreviewUrl) {
                setEmailPreviewUrl(res.emailPreviewUrl);
            }
            setBookingSuccess(true);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Booking failed');
        } finally {
            setLoading(false);
        }
    };

    if (!bookingEvent) return null;

    const unitPrice = getPriceForType(ticketType);
    const selectedConfig = TICKET_TYPES.find((t) => t.id === ticketType);

    return (
        <div
            className="container"
            style={{
                paddingTop: '4rem',
                paddingBottom: '4rem',
                minHeight: '80vh',
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <div className="premium-card" style={{ maxWidth: '640px', width: '100%' }}>
                {bookingSuccess ? (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#10b981' }}>🎉 Ticket Booked!</h2>
                        <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
                            We've sent your {ticketType} ticket with a QR code directly to your email:
                        </p>
                        <p style={{ fontWeight: 700, color: 'var(--primary-color)', fontSize: '1.1rem', marginBottom: '2rem' }}>
                            {guestEmail}
                        </p>
                        {emailPreviewUrl && (
                            <>
                                <a
                                    href={emailPreviewUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="premium-button"
                                    style={{ display: 'inline-block', marginBottom: '2rem' }}
                                >
                                    View Demo Email & QR Code
                                </a>
                                <br />
                            </>
                        )}
                        <button
                            className="premium-button"
                            onClick={() => { dispatch(clearBookingDetails()); navigate('/my-bookings'); }}
                        >
                            Go to My Bookings
                        </button>
                    </div>
                ) : (
                    <>
                        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
                            Confirm Booking & Payment
                        </h2>

                        {/* Event Info */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>
                                {bookingEvent.title}
                            </h3>
                            <p style={{ color: 'var(--text-muted)' }}>
                                {new Date(bookingEvent.date).toLocaleDateString()} at {bookingEvent.time || 'TBA'}
                            </p>
                            <p style={{ color: 'var(--text-muted)' }}>{bookingEvent.location}</p>
                        </div>

                        {/* ── Ticket Type Selector ── */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                                Select Ticket Type
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                                {TICKET_TYPES.map((t) => {
                                    const tPrice = getPriceForType(t.id);
                                    const isSelected = ticketType === t.id;
                                    return (
                                        <button
                                            key={t.id}
                                            onClick={() => handleTypeSelect(t.id)}
                                            style={{
                                                position: 'relative',
                                                background: isSelected ? t.gradient : 'rgba(255,255,255,0.04)',
                                                border: `2px solid ${isSelected ? t.border : 'rgba(255,255,255,0.1)'}`,
                                                borderRadius: '12px',
                                                padding: '1rem 0.75rem',
                                                cursor: 'pointer',
                                                textAlign: 'center',
                                                transition: 'all 0.25s ease',
                                                boxShadow: isSelected ? `0 0 16px ${t.border}55` : 'none',
                                                transform: isSelected ? 'translateY(-2px)' : 'none',
                                            }}
                                        >
                                            {t.badge && (
                                                <span style={{
                                                    position: 'absolute',
                                                    top: '-10px',
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                    background: t.id === 'VVIP' ? '#f59e0b' : '#3b82f6',
                                                    color: '#fff',
                                                    fontSize: '0.65rem',
                                                    fontWeight: 700,
                                                    padding: '2px 8px',
                                                    borderRadius: '999px',
                                                    letterSpacing: '0.05em',
                                                    textTransform: 'uppercase',
                                                    whiteSpace: 'nowrap',
                                                }}>
                                                    {t.badge}
                                                </span>
                                            )}
                                            <div style={{ fontSize: '1.6rem', marginBottom: '0.3rem' }}>{t.emoji}</div>
                                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: isSelected ? '#fff' : 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                                {t.label}
                                            </div>
                                            <div style={{ fontSize: '1rem', fontWeight: 800, color: isSelected ? '#fff' : 'var(--primary-color)' }}>
                                                ₹{tPrice}
                                            </div>
                                            <div style={{ fontSize: '0.7rem', color: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)', marginTop: '0.3rem', lineHeight: 1.3 }}>
                                                {t.description}
                                            </div>
                                            {isSelected && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '8px',
                                                    right: '8px',
                                                    width: '18px',
                                                    height: '18px',
                                                    borderRadius: '50%',
                                                    background: t.border,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '0.65rem',
                                                }}>
                                                    ✓
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Price Summary */}
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Ticket type</span>
                                <span style={{ fontWeight: 700 }}>
                                    {selectedConfig?.emoji} {ticketType}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Price per ticket</span>
                                <span>₹{unitPrice}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Quantity</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <button
                                        onClick={() => updateQuantity(quantity - 1)}
                                        style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}
                                    >-</button>
                                    <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(quantity + 1)}
                                        style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}
                                    >+</button>
                                </div>
                            </div>
                            {discountAmount > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: '#4ade80' }}>
                                    <span>Group Discount (20%)</span>
                                    <span>-₹{discountAmount.toFixed(2)}</span>
                                </div>
                            )}
                            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1rem 0' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold' }}>
                                <span>Total</span>
                                <span style={{ color: 'var(--primary-color)' }}>₹{totalPrice.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Guest Details */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                                Guest Details
                            </h3>
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="premium-input"
                                value={guestName}
                                onChange={(e) => setGuestName(e.target.value)}
                                style={{ marginBottom: '1rem' }}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email Address for Ticket"
                                className="premium-input"
                                value={guestEmail}
                                onChange={(e) => setGuestEmail(e.target.value)}
                                style={{ marginBottom: '1rem' }}
                                required
                            />
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                            <button
                                className="premium-button premium-button-outline"
                                style={{ flex: 1 }}
                                onClick={() => navigate(-1)}
                            >
                                Back
                            </button>
                            <button
                                className="premium-button"
                                style={{ flex: 1 }}
                                onClick={handleConfirmBooking}
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : `Confirm & Book (₹${totalPrice.toFixed(2)})`}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default BookingPage;
