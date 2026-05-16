import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import bookingReducer from './bookingSlice';

/**
 * Global Redux Store Initialization.
 * Combines authentication and booking slices for global state access.
 */
const store = configureStore({
    reducer: {
        auth: authReducer,
        booking: bookingReducer,
    },
});

export default store;
