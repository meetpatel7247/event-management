import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CategoryRow.module.css';

const categories = [
    { label: 'Events', icon: '🎉', path: '/?view=all' },
    { label: 'Concerts', icon: '🎸', path: '/?cat=Concert' },
    { label: 'Festivals', icon: '🎪', path: '/?cat=Festival' },
    { label: 'Plays', icon: '🎭', path: '/?cat=Play' },
    { label: 'Sports', icon: '⚽', path: '/?cat=Sport' },
];

const CategoryRow = () => {
    return (
        <section className={styles.container}>
            <div className={styles.grid}>
                {categories.map((cat, idx) => (
                    <Link key={idx} to={cat.path} className={styles.card}>
                        <div className={styles.icon}>{cat.icon}</div>
                        <span className={styles.label}>{cat.label}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default CategoryRow;
