import apiClient from './api';

// Create a new STI package (Staff only)
export const createSTIPackage = async (packageData) => {
  try {
    console.log('Creating new STI package with data:', packageData);

    // Ensure we have the correct field names as expected by the backend
    const validatedData = {
      ...packageData,
      // Make sure we're using isActive, not active
      isActive:
        packageData.isActive !== undefined
          ? packageData.isActive
          : packageData.active !== undefined
            ? packageData.active
            : true,
    };

    // Ensure stiService is always an array of simple IDs (Long)
    if (!validatedData.stiService) {
      validatedData.stiService = [];
    } else if (Array.isArray(validatedData.stiService)) {
      // Chuyển đổi thành mảng ID đơn giản
      validatedData.stiService = validatedData.stiService.map((item) => {
        // Nếu là số nguyên (id) thì giữ nguyên
        if (typeof item === 'number') {
          return item;
        }
        // Nếu là object thì lấy serviceId hoặc id
        if (typeof item === 'object') {
          return item.serviceId || item.id;
        }
        // Trường hợp khác
        return item;
      });
    }

    console.log('Sending validated data to backend:', validatedData);

    const response = await apiClient.post('/sti-packages', validatedData);

    console.log('Create response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating STI package:', error);
    throw error.response?.data || error.message;
  }
};
