import React, { useState, useEffect } from 'react';

/**
 * CreateEventForm Component
 * 
 * Reusable form for both creating new events and editing existing ones.
 * Populates fields if `initialData` is provided. Uses a local state
 * object to manage form inputs before submission.
 * 
 * @param {Function} onSubmit - Callback when the form is submitted
 * @param {Function} onCancel - Callback to discard changes
 * @param {Object} [initialData] - Optional existing event data for editing
 */
const CreateEventForm = ({ onSubmit, onCancel, initialData }) => {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        time: '',
        location: '',
        price: '',
        category: 'Concert',
        description: '',
        image: '',
        offerMinTickets: '',
        offerDiscount: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : '',
                time: initialData.time || '',
                location: initialData.location || '',
                price: initialData.price || '',
                category: initialData.category || 'Concert',
                description: initialData.description || '',
                image: initialData.image || '',
                offerMinTickets: initialData.offerMinTickets || '',
                offerDiscount: initialData.offerDiscount || ''
            });
        }
    }, [initialData]);

    /**
     * Generic handler for text, date, and select inputs.
     * Maps the `name` attribute of the input to the corresponding state key.
     */
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    /**
     * Prevents default browser reload and fires the parent's generic `onSubmit` handler,
     * passing up the finalized form data.
     */
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <input className="premium-input" name="title" value={formData.title} placeholder="Event Title" onChange={handleChange} required />
                    <input className="premium-input" name="date" type="date" value={formData.date} onChange={handleChange} required />
                    <input className="premium-input" name="time" type="time" value={formData.time} onChange={handleChange} required />
                </div>
                <div style={{ padding: '1rem 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <input className="premium-input" name="location" value={formData.location} placeholder="Location" onChange={handleChange} required />
                    <input className="premium-input" name="price" type="number" value={formData.price} placeholder="Normal Price (₹)" onChange={handleChange} required />
                </div>
                {formData.price && (
                    <div style={{ paddingBottom: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#93c5fd' }}>
                            ⭐ <strong>VIP Price:</strong> ₹{Number(formData.price) + 300}
                            <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '2px' }}>Normal + ₹300 (auto)</div>
                        </div>
                        <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#fcd34d' }}>
                            👑 <strong>VVIP Price:</strong> ₹{Number(formData.price) + 600}
                            <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '2px' }}>Normal + ₹600 (auto)</div>
                        </div>
                    </div>
                )}
                <div style={{ paddingBottom: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <input className="premium-input" name="offerMinTickets" type="number" value={formData.offerMinTickets} placeholder="Min Tickets for Offer (e.g. 3)" onChange={handleChange} />
                    <input className="premium-input" name="offerDiscount" type="number" value={formData.offerDiscount} placeholder="Discount % (e.g. 20)" onChange={handleChange} />
                </div>
                <div style={{ paddingBottom: '1rem' }}>
                    <select className="premium-input" name="category" value={formData.category} onChange={handleChange}>
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
                <div style={{ paddingBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Event Image (Link or Upload)</label>
                    <input className="premium-input" name="image" value={formData.image} placeholder="Image URL" onChange={handleChange} style={{ marginBottom: '0.5rem' }} />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    setFormData({ ...formData, image: reader.result });
                                };
                                reader.readAsDataURL(file);
                            }
                        }}
                        style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}
                    />
                </div>
                <div style={{ paddingBottom: '1rem' }}>
                    <textarea className="premium-input" style={{ minHeight: '100px', fontFamily: 'inherit' }} name="description" value={formData.description} placeholder="Description" onChange={handleChange} required />
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button type="button" className="premium-button premium-button-outline" style={{ width: 'auto' }} onClick={onCancel}>Cancel</button>
                    <button type="submit" className="premium-button" style={{ width: 'auto' }}>
                        {initialData ? 'Update Event' : 'Create Event'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateEventForm;
