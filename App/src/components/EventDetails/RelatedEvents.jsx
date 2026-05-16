import React from 'react';
import EventCard from '../Event/EventCard';
import styles from './RelatedEvents.module.css';

const RelatedEvents = ({ relatedEvents }) => {
    if (!relatedEvents || relatedEvents.length === 0) return null;

    return (
        <div className={styles.relatedEventsSection}>
            <h2 className={styles.relatedEventsTitle}>Related Events</h2>
            <div className={styles.relatedEventsGrid}>
                {relatedEvents.map(related => (
                    <EventCard key={related._id} event={related} />
                ))}
            </div>
        </div>
    );
};

export default RelatedEvents;
