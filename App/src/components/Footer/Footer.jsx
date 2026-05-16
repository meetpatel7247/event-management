import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.brandColumn}>
                    <Link to="/" className={styles.brandName}>
                        DEVIT<span className="text-gradient">EVENT</span>
                    </Link>
                    <p className={styles.tagline}>
                        Your premier destination for tickets, live entertainment, and unforgettable experiences.
                        Feel the vibe, live the moment.
                    </p>
                    <div className={styles.socials}>
                        <a href="https://www.facebook.com/" className={styles.socialLink}><FaFacebook /></a>
                        <a href="https://twitter.com/" className={styles.socialLink}><FaTwitter /></a>
                        <a href="https://www.instagram.com/" className={styles.socialLink}><FaInstagram /></a>
                        <a href="https://www.youtube.com/" className={styles.socialLink}><FaYoutube /></a>
                    </div>
                </div>

                <div className={styles.linksColumn}>
                    <h4 className={styles.columnTitle}>Company</h4>
                    <ul className={styles.linkList}>
                        <li className={styles.linkItem}><Link to="/about" className={styles.link}>About Us</Link></li>
                        <li className={styles.linkItem}><Link to="/careers" className={styles.link}>Careers</Link></li>
                        <li className={styles.linkItem}><Link to="/blog" className={styles.link}>Blog</Link></li>
                        <li className={styles.linkItem}><Link to="/contact" className={styles.link}>Contact</Link></li>
                    </ul>
                </div>

                <div className={styles.linksColumn}>
                    <h4 className={styles.columnTitle}>Help</h4>
                    <ul className={styles.linkList}>
                        <li className={styles.linkItem}><Link to="/support" className={styles.link}>Support</Link></li>
                        <li className={styles.linkItem}><Link to="/terms" className={styles.link}>Terms of Use</Link></li>
                        <li className={styles.linkItem}><Link to="/privacy" className={styles.link}>Privacy Policy</Link></li>
                        <li className={styles.linkItem}><Link to="/sitemap" className={styles.link}>Sitemap</Link></li>
                    </ul>
                </div>

                <div className={styles.linksColumn}>
                    <h4 className={styles.columnTitle}>Book With Us</h4>
                    <ul className={styles.linkList}>
                        <li className={styles.linkItem}><Link to="/list-event" className={styles.link}>List Your Event</Link></li>
                        <li className={styles.linkItem}><Link to="/corporates" className={styles.link}>Corporates</Link></li>
                        <li className={styles.linkItem}><Link to="/offers" className={styles.link}>Offers</Link></li>
                        <li className={styles.linkItem}><Link to="/gift-cards" className={styles.link}>Gift Cards</Link></li>
                    </ul>
                </div>
            </div>

            <div className={styles.bottomBar}>
                &copy; {new Date().getFullYear()} DEVIT EVENT. All Rights Reserved.
            </div>
        </footer>
    );
};

export default Footer;
