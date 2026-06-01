import { createSlice } from '@reduxjs/toolkit';

/**
 * Initial state for Authentication.
 * Synchronizes with sessionStorage on load to persist logins across refreshes.
 */

const initialState = {
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : (sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null),
};

/**
 * Pre-configured Redux Slice for User Authentication.
 * Handles login, logout, and profile updates.
 */
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        /**
         * Logs a user in and commits their data to sessionStorage and localStorage.
         */
        login: (state, action) => {
            state.user = action.payload;
            sessionStorage.setItem('user', JSON.stringify(action.payload));
            
            const stored = localStorage.getItem('user');
            const newStr = JSON.stringify(action.payload);
            if (stored !== newStr) {
                localStorage.setItem('user', newStr);
            }
        },
        /**
         * Logs a user out and clears their data from sessionStorage and localStorage.
         */
        logout: (state) => {
            state.user = null;
            sessionStorage.removeItem('user');
            
            if (localStorage.getItem('user') !== null) {
                localStorage.removeItem('user');
            }
        },
        /**
         * Updates partial user information (like changing a name).
         */
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
            sessionStorage.setItem('user', JSON.stringify(state.user));
            
            const stored = localStorage.getItem('user');
            const newStr = JSON.stringify(state.user);
            if (stored !== newStr) {
                localStorage.setItem('user', newStr);
            }
        }
    },
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
