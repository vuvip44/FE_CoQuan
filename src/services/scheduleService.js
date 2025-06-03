import axios from 'axios';

const API_URL = 'http://localhost:5073/api/schedules';

const scheduleService = {
  createSchedule: async (scheduleData) => {
    try {
      const response = await axios.post(API_URL, scheduleData, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteSchedule: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  searchSchedules: async (searchParams) => {
    try {
      const queryString = new URLSearchParams();
      
      if (searchParams.leaderCompany) {
        queryString.append('LeaderCompany', searchParams.leaderCompany);
      }
      if (searchParams.title) {
        queryString.append('Title', searchParams.title);
      }
      if (searchParams.startTime) {
        queryString.append('StartTime', searchParams.startTime.toISOString());
      }
      if (searchParams.endTime) {
        queryString.append('EndTime', searchParams.endTime.toISOString());
      }
      if (searchParams.status) {
        queryString.append('Status', searchParams.status);
      }
      if (searchParams.location) {
        queryString.append('Location', searchParams.location);
      }
      if (searchParams.createAt) {
        queryString.append('CreateAt', searchParams.createAt.toISOString());
      }

      const response = await axios.get(`${API_URL}/search?${queryString}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default scheduleService; 