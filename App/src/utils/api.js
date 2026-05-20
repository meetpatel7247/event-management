import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to attach token to requests
api.interceptors.request.use((config) => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const eventApi = {
  getEvents: async () => {
    const response = await api.get('/events');
    return response.data;
  },
  /** Organizer: fetch only their own created events */
  getMyEvents: async () => {
    const response = await api.get('/events/my-events');
    return response.data;
  },
  getEventById: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },
  createEvent: async (eventData) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },
  updateEvent: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },
  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },
  toggleLike: async (id, action) => {
    const response = await api.post(`/events/${id}/like`, { action });
    return response.data;
  },
  recordShare: async (id) => {
    const response = await api.post(`/events/${id}/share`);
    return response.data;
  },
};

export const authApi = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      sessionStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      sessionStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },
  getRoleAvailability: async () => {
    const response = await api.get('/auth/role-availability');
    return response.data;
  },
  logout: () => {
    sessionStorage.removeItem('user');
  },
};

export const bookingApi = {
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },
  getUserBookings: async () => {
    const response = await api.get('/bookings/my-bookings');
    return response.data;
  },
  getAllBookings: async () => {
    const response = await api.get('/bookings/all');
    return response.data;
  },
  /** Organizer: fetch bookings only for their events */
  getOrganizerBookings: async () => {
    const response = await api.get('/bookings/organizer-bookings');
    return response.data;
  },
};

export const adminApi = {
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
  approveEvent: async (id) => {
    const response = await api.put(`/events/${id}`, { isApproved: true });
    return response.data;
  },
  /** Admin: delete ALL bookings and restore event seat counts */
  resetBookings: async () => {
    const response = await api.delete('/bookings/reset');
    return response.data;
  },
};

export const userApi = {
  deleteMe: async () => {
    const response = await api.delete('/users/me'); // We might need to implement this endpoint
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },
};

export default api;
