import React, { useState, useEffect } from 'react';
import { eventApi } from '../../utils/api';
import styles from './NavSearch.module.css';

const extractCity = (locationStr) => {
    if (!locationStr) return '';
    const parts = locationStr.split(',').map(p => p.trim()).filter(Boolean);
    if (parts.length === 0) return '';
    
    const last = parts[parts.length - 1];
    const countries = ['india', 'usa', 'uk', 'canada', 'germany'];
    
    if (parts.length > 1 && countries.includes(last.toLowerCase())) {
        return parts[parts.length - 2];
    }
    return last;
};

const NavSearch = ({ onSearch, onLocationChange }) => {
    const [cities, setCities] = useState([]);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const events = await eventApi.getEvents();
                const approvedEvents = (events || []).filter(e => e.isApproved);
                if (approvedEvents.length > 0) {
                    // Extract cities and filter unique non-empty ones
                    const extracted = approvedEvents
                        .map(e => extractCity(e.location))
                        .filter(Boolean);
                    
                    // Deduplicate (case-insensitive)
                    const uniqueCities = [];
                    extracted.forEach(city => {
                        const exists = uniqueCities.some(c => c.toLowerCase() === city.toLowerCase());
                        if (!exists) {
                            uniqueCities.push(city);
                        }
                    });
                    
                    // Sort alphabetically
                    uniqueCities.sort((a, b) => a.localeCompare(b));
                    setCities(uniqueCities);
                } else {
                    setCities([]); // Clear cities list if database is empty
                }
            } catch (err) {
                console.error('Failed to fetch dynamic cities:', err);
            }
        };

        fetchCities();
        // Periodically refresh cities list to keep it in sync with new event creation
        const iv = setInterval(fetchCities, 5000);
        return () => clearInterval(iv);
    }, []);

    return (
        <div className={styles.searchContainer}>
            <div className={styles.locationWrapper}>
                <select 
                    className={styles.locationSelect}
                    onChange={(e) => onLocationChange && onLocationChange(e.target.value)}
                    defaultValue=""
                >
                    <option value="">All Cities</option>
                    {cities.map((city, idx) => (
                        <option key={idx} value={city}>{city}</option>
                    ))}
                </select>
            </div>
            <div className={styles.searchWrapper}>
                <input
                    type="text"
                    placeholder="Search for events, plays, sports and activities"
                    className={styles.searchInput}
                    onChange={(e) => onSearch && onSearch(e.target.value)}
                />
            </div>
        </div>
    );
};

export default NavSearch;
