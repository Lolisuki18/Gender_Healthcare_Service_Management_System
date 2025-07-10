import apiClient from '@/services/api';

const notificationService = {
  // Lấy cài đặt thông báo của user hiện tại
  getNotificationPreferences: async () => {
    try {
      const response = await apiClient.get('/notification-preferences');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cập nhật cài đặt thông báo
  updateNotificationPreference: async (type, enabled) => {
    try {
      const response = await apiClient.put(`/notification-preferences/${type}?enabled=${enabled}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Mapping từ UI state sang API enum values
  mapSettingToApiType: (setting) => {
    const mapping = {
      ovulationReminder: 'OVULATION',
      pregnancyProbability: 'PREGNANCY_PROBABILITY',
      medicationReminder: 'PILL_REMINDER'
    };
    return mapping[setting];
  },

  // Mapping từ API enum values sang UI state
  mapApiTypeToSetting: (apiType) => {
    const mapping = {
      'OVULATION': 'ovulationReminder',
      'PREGNANCY_PROBABILITY': 'pregnancyProbability',
      'PILL_REMINDER': 'medicationReminder'
    };
    return mapping[apiType];
  }
};

export default notificationService;
