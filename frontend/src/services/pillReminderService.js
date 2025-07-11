import apiClient from './api';

const PILL_REMINDER_API_BASE_URL = '/contraceptive';

const pillReminderService = {
  /**
   * Creates a new pill reminder schedule.
   * @param {Object} scheduleData - The schedule data.
   * @returns {Promise<Object>} The API response.
   */
  createPillSchedule: async (scheduleData) => {
    try {
      const response = await apiClient.post(PILL_REMINDER_API_BASE_URL, scheduleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Updates an existing pill reminder schedule.
   * @param {string} id - The ID of the schedule to update.
   * @param {Object} scheduleData - The updated schedule data.
   * @returns {Promise<Object>} The API response.
   */
  updatePillSchedule: async (id, scheduleData) => {
    try {
      const response = await apiClient.put(`${PILL_REMINDER_API_BASE_URL}/${id}`, scheduleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Updates the check-in status for a pill log.
   * @param {string} logId - The ID of the pill log to check in.
   * @returns {Promise<Object>} The API response.
   */
  updateCheckIn: async (logId) => {
    try {
      const response = await apiClient.put(`${PILL_REMINDER_API_BASE_URL}/${logId}/checkIn`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Fetches pill logs for a given pill reminder schedule ID.
   * @param {string} id - The ID of the pill reminder schedule.
   * @returns {Promise<Object>} The API response containing pill logs.
   */
  getPillLogs: async (id) => {
    try {
      const response = await apiClient.get(`${PILL_REMINDER_API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Deletes a pill reminder schedule.
   * @param {string} id - The ID of the schedule to delete.
   * @returns {Promise<Object>} The API response.
   */
  deletePillSchedule: async (id) => {
    try {
      const response = await apiClient.delete(`${PILL_REMINDER_API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default pillReminderService; 