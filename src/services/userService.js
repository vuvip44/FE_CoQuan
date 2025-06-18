import axios from 'axios';

const API_URL = 'http://localhost:5073/api/users';

const userService = {
  getAllUsers: async () => {
    try {
      const response = await axios.get(API_URL, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getUserById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createUser: async (userData) => {
    try {
      const response = await axios.post(API_URL, userData, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, userData, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateUserRole: async (id) => {
    try {
      const response = await axios.put(`${API_URL}/${id}/role`, {}, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  changePassword: async (passwordData) => {
    try {
      const response = await axios.put(`${API_URL}/change-password`, passwordData, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default userService; 