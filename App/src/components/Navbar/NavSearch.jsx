import React from 'react';
import styles from './NavSearch.module.css';

const NavSearch = ({ onSearch, onLocationChange }) => {
    return (
        <div className={styles.searchContainer}>
            <div className={styles.locationWrapper}>
                <select 
                    className={styles.locationSelect}
                    onChange={(e) => onLocationChange && onLocationChange(e.target.value)}
                    defaultValue=""
                >
                    <option value="">All Cities</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Pune">Pune</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Kolkata">Kolkata</option>
                    <option value="Ahmedabad">Ahmedabad</option>
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
