import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './CategoryRow.module.css';

const categories = [
    { label: 'Events', icon: '🎉', path: '/?view=all', checkActive: (cat, view) => view === 'all' },
    { label: 'Concerts', icon: '🎸', path: '/?cat=Concert', checkActive: (cat) => cat === 'Concert' },
    { label: 'Festivals', icon: '🎪', path: '/?cat=Festival', checkActive: (cat) => cat === 'Festival' },
    { label: 'Plays', icon: '🎭', path: '/?cat=Play', checkActive: (cat) => cat === 'Play' },
    { label: 'Sports', icon: '⚽', path: '/?cat=Sport', checkActive: (cat) => cat === 'Sport' },
];

const CategoryRow = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const catParam = params.get('cat');
    const viewParam = params.get('view');

    return (
        <section className={styles.container}>
            <div className={styles.grid}>
                {categories.map((cat, idx) => {
                    const isActive = cat.checkActive(catParam, viewParam);
                    return (
                        <Link 
                            key={idx} 
                            to={cat.path} 
                            className={`${styles.card} ${isActive ? styles.cardActive : ''}`}
                        >
                            <div className={styles.icon}>{cat.icon}</div>
                            <span className={styles.label}>{cat.label}</span>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

export default CategoryRow;
