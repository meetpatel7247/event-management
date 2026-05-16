import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NavLogo.module.css';

const NavLogo = () => {
    return (
        <Link to="/" className={styles.logo}>
            DEVITLTD
        </Link>
    );
};

export default NavLogo;
