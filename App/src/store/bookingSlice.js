import { createSlice } from '@reduxjs/toolkit';

/**
 * Initial state for the active booking session.
 * Stores transitional data while a user navigates from an Event page to Checkout.
 */

const initialState = {
    bookingEvent: null,
    quantity: 1,
    totalPrice: 0,
    discountAmount: 0,
};

/**
 * Pre-configured Redux Slice for Booking Flow.
 * Maintains the event the user wishes to book, alongside calculating ticket limits and prices.
 */
const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        /**
         * Commits the pending booking details to global state before forwarding to checkout.
         */
        setBookingDetails: (state, action) => {
            const { event, quantity, totalPrice, discountAmount } = action.payload;
            state.bookingEvent = event;
            state.quantity = quantity;
            state.totalPrice = totalPrice;
            state.discountAmount = discountAmount;
        },
        /**
         * Scraps the session booking data (used upon successful checkout or cancellation).
         */
        clearBookingDetails: (state) => {
            state.bookingEvent = null;
            state.quantity = 1;
            state.totalPrice = 0;
            state.discountAmount = 0;
        },
    },
});

export const { setBookingDetails, clearBookingDetails } = bookingSlice.actions;
export default bookingSlice.reducer;
