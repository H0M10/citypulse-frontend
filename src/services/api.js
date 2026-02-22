import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Weather API

export const weatherAPI = {
  getByCity: async (city) => {
    const response = await api.get(`/api/weather/${encodeURIComponent(city)}`);
    return response.data;
  },

  getByCoords: async (lat, lon) => {
    const response = await api.get(`/api/weather/coords/${lat}/${lon}`);
    return response.data;
  },

  getForecast: async (city) => {
    const response = await api.get(`/api/weather/forecast/${encodeURIComponent(city)}`);
    return response.data;
  }
};

// GitHub API

export const githubAPI = {
  searchUsers: async (location, page = 1) => {
    const response = await api.get(`/api/github/users/${encodeURIComponent(location)}`, {
      params: { page, per_page: 12 }
    });
    return response.data;
  },

  searchRepos: async (location, page = 1) => {
    const response = await api.get(`/api/github/repos/${encodeURIComponent(location)}`, {
      params: { page, per_page: 10 }
    });
    return response.data;
  },

  getUser: async (username) => {
    const response = await api.get(`/api/github/user/${username}`);
    return response.data;
  }
};

// Movies API (TMDB)

export const moviesAPI = {
  searchByCity: async (query, page = 1) => {
    const response = await api.get(`/api/movies/search/${encodeURIComponent(query)}`, {
      params: { page }
    });
    return response.data;
  },

  getPopular: async (page = 1) => {
    const response = await api.get('/api/movies/popular', {
      params: { page }
    });
    return response.data;
  },

  getDetail: async (movieId) => {
    const response = await api.get(`/api/movies/detail/${movieId}`);
    return response.data;
  }
};

// Geocoding API (Mapbox)

export const geocodeAPI = {
  reverse: async (lat, lon) => {
    const response = await api.get(`/api/geocode/reverse/${lat}/${lon}`);
    return response.data;
  },

  search: async (query) => {
    const response = await api.get(`/api/geocode/search/${encodeURIComponent(query)}`);
    return response.data;
  }
};

// Health Check

export const checkHealth = async () => {
  try {
    const response = await api.get('/api/health');
    return response.data;
  } catch {
    return { status: 'offline' };
  }
};

export default api;
