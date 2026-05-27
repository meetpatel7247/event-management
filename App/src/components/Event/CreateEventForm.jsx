import React, { useState, useEffect } from 'react';

/**
 * CreateEventForm Component
 *
 * Reusable form for both creating new events and editing existing ones.
 * Populates fields if `initialData` is provided. Uses a local state
 * object to manage form inputs before submission.
 *
 * @param {Function} onSubmit    - Callback when the form is submitted
 * @param {Function} onCancel   - Callback to discard changes
 * @param {Object}  [initialData] - Optional existing event data for editing
 */
const CreateEventForm = ({ onSubmit, onCancel, initialData }) => {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        time: '',
        location: '',
        price: '',
        vipPrice: '',
        vvipPrice: '',
        category: 'Concert',
        description: '',
        image: '',
        offerMinTickets: '',
        offerDiscount: '',
        availableSeats: '100',
    });

    // Populate form when editing an existing event.
    // Use ?? (nullish coalescing) so numeric 0 values are preserved correctly.
    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title ?? '',
                date: initialData.date
                    ? new Date(initialData.date).toISOString().split('T')[0]
                    : '',
                time: initialData.time ?? '',
                location: initialData.location ?? '',
                price: initialData.price ?? '',
                vipPrice: initialData.vipPrice ?? '',
                vvipPrice: initialData.vvipPrice ?? '',
                category: initialData.category ?? 'Concert',
                description: initialData.description ?? '',
                image: initialData.image ?? '',
                offerMinTickets: initialData.offerMinTickets ?? '',
                offerDiscount: initialData.offerDiscount ?? '',
                availableSeats: initialData.availableSeats ?? '100',
            });
        }
    }, [initialData]);

    /**
     * Generic change handler.
     * When `price` changes, auto-fills vipPrice (+300) and vvipPrice (+600)
     * only if those fields haven't already been manually customised.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'price') {
            const base = Number(value);
            setFormData((prev) => ({
                ...prev,
                price: value,
                vipPrice:
                    prev.vipPrice === '' ||
                    prev.vipPrice === String(Number(prev.price) + 300)
                        ? base > 0 ? String(base + 300) : ''
                        : prev.vipPrice,
                vvipPrice:
                    prev.vvipPrice === '' ||
                    prev.vvipPrice === String(Number(prev.price) + 600)
                        ? base > 0 ? String(base + 600) : ''
                        : prev.vvipPrice,
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
                {initialData ? 'Edit Event' : 'Create New Event'}
            </h3>
            <form onSubmit={handleSubmit}>

                {/* Row 1 – title / date / time */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <input className="premium-input" name="title" value={formData.title}
                        placeholder="Event Title" onChange={handleChange} required />
                    <input className="premium-input" name="date" type="date" value={formData.date}
                        onChange={handleChange} required />
                    <input className="premium-input" name="time" type="time" value={formData.time}
                        onChange={handleChange} required />
                </div>

                {/* Row 2 – location / normal price / available seats */}
                <div style={{ padding: '1rem 0', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <input className="premium-input" name="location" value={formData.location}
                        placeholder="Location" onChange={handleChange} required />
                    <input className="premium-input" name="price" type="number" min="0"
                        value={formData.price} placeholder="Normal Price (₹)"
                        onChange={handleChange} required />
                    <input className="premium-input" name="availableSeats" type="number" min="1"
                        value={formData.availableSeats} placeholder="Total Seats / Capacity"
                        onChange={handleChange} required />
                </div>

                {/* Row 3 – VIP / VVIP price (always editable, auto-filled from price) */}
                <div style={{ paddingBottom: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.82rem', color: '#a78bfa', fontWeight: 600 }}>
                            ⭐ VIP Price (₹)
                        </label>
                        <input
                            className="premium-input"
                            name="vipPrice"
                            type="number"
                            min="0"
                            value={formData.vipPrice}
                            placeholder={formData.price ? `e.g. ${Number(formData.price) + 300}` : 'VIP Price (₹)'}
                            onChange={handleChange}
                            style={{ borderColor: 'rgba(167,139,250,0.4)' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.82rem', color: '#ec4899', fontWeight: 600 }}>
                            👑 VVIP Price (₹)
                        </label>
                        <input
                            className="premium-input"
                            name="vvipPrice"
                            type="number"
                            min="0"
                            value={formData.vvipPrice}
                            placeholder={formData.price ? `e.g. ${Number(formData.price) + 600}` : 'VVIP Price (₹)'}
                            onChange={handleChange}
                            style={{ borderColor: 'rgba(236,72,153,0.4)' }}
                        />
                    </div>
                </div>

                {/* Row 4 – offer settings */}
                <div style={{ paddingBottom: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <input className="premium-input" name="offerMinTickets" type="number"
                        value={formData.offerMinTickets} placeholder="Min Tickets for Offer (e.g. 3)"
                        onChange={handleChange} />
                    <input className="premium-input" name="offerDiscount" type="number"
                        value={formData.offerDiscount} placeholder="Discount % (e.g. 20)"
                        onChange={handleChange} />
                </div>

                {/* Category */}
                <div style={{ paddingBottom: '1rem' }}>
                    <select className="premium-input" name="category" value={formData.category}
                        onChange={handleChange}>
                        <option value="Concert">Concert</option>
                        <option value="Festival">Festival</option>
                        <option value="Party">Party</option>
                        <option value="Music">Music</option>
                        <option value="Technology">Technology</option>
                        <option value="Art">Art</option>
                        <option value="Comedy">Comedy</option>
                        <option value="Business">Business</option>
                        <option value="Health">Health</option>
                        <option value="Food">Food</option>
                        <option value="Film">Film</option>
                        <option value="Fashion">Fashion</option>
                    </select>
                </div>

                {/* Image */}
                <div style={{ paddingBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                        Event Image (Link or Upload)
                    </label>
                    <input className="premium-input" name="image" value={formData.image}
                        placeholder="Image URL" onChange={handleChange}
                        style={{ marginBottom: '0.5rem' }} />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    setFormData((prev) => ({ ...prev, image: reader.result }));
                                };
                                reader.readAsDataURL(file);
                            }
                        }}
                        style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}
                    />
                </div>

                {/* Description */}
                <div style={{ paddingBottom: '1rem' }}>
                    <textarea
                        className="premium-input"
                        style={{ minHeight: '100px', fontFamily: 'inherit' }}
                        name="description"
                        value={formData.description}
                        placeholder="Description"
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button type="button" className="premium-button premium-button-outline"
                        style={{ width: 'auto' }} onClick={onCancel}>
                        Cancel
                    </button>
                    <button type="submit" className="premium-button" style={{ width: 'auto' }}>
                        {initialData ? 'Update Event' : 'Create Event'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateEventForm;
