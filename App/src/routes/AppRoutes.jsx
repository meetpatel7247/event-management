import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import Home from '../pages/Home';
import Organizer from '../pages/Organizer';
import Admin from '../pages/Admin';
import Login from '../pages/Login';
import Register from '../pages/Register';
import MyBookings from '../pages/MyBookings';
import EventDetails from '../pages/EventDetails';
import BookingPage from '../pages/BookingPage';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Offers from '../pages/Offers';

import Careers from '../pages/Careers';
import Blog from '../pages/Blog';
import Support from '../pages/Support';
import Terms from '../pages/Terms';
import Privacy from '../pages/Privacy';
import Sitemap from '../pages/Sitemap';
import ListEvent from '../pages/ListEvent';
import Corporates from '../pages/Corporates';
import GiftCards from '../pages/GiftCards';

/**
 * AppRoutes Component
 * 
 * Central routing configuration for the entire application. Maps URL paths
 * to their respective physical Page components. 
 *
 * @param {string} searchTerm - Global search query forwarded to the Home page context
 * @param {string} searchLocation - Global search location forwarded to the Home page context
 */
const AppRoutes = ({ searchTerm, searchLocation }) => {
    return (
        <Routes>
            {/* Core User Flows */}
            <Route path="/" element={<Home searchTerm={searchTerm} searchLocation={searchLocation} />} />
            <Route path="/organizer" element={<Organizer />} />
            <Route path="/admin" element={<Admin />} />

            {/* Authentication */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Booking specific pages */}
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/event/:id" element={<EventDetails />} />

            {/* Informational Pages */}
            <Route path="/about" element={<About />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/support" element={<Support />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/sitemap" element={<Sitemap />} />
            <Route path="/list-event" element={<ListEvent />} />
            <Route path="/corporates" element={<Corporates />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/gift-cards" element={<GiftCards />} />

        </Routes>
    );
};

export default AppRoutes;
