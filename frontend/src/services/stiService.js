// src/services/stiService.js
import apiClient from "./api";

export const stiService = {
  // Lấy tất cả gói đang hoạt động - Public endpoint
  getActiveSTIServices: async () => {
    try {
      const res = await apiClient.get("/sti-services?include=testComponents");
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to fetch STI services");
      }
      return res.data.data;
    } catch (error) {
      console.error("Error fetching STI services:", error);
      if (error.message === "Authentication required") {
        return []; // Return empty array for unauthenticated users
      }
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // STAFF MANAGEMENT API - Uncomment khi cần sử dụng
  // ==== STI SERVICE MANAGEMENT API ====

  // getAllServices: async () => {
  //   try {
  //     const res = await apiClient.get("/admin/sti-services");
  //     if (!res.data.success) {
  //       throw new Error(res.data.message || 'Failed to fetch STI services');
  //     }
  //     return res.data.data;
  //   } catch (error) {
  //     console.error('Error fetching STI services:', error);
  //     throw new Error(error.response?.data?.message || error.message);
  //   }
  // },

  // getServiceById: async (id) => {
  //   try {
  //     const res = await apiClient.get(`/admin/sti-services/${id}`);
  //     if (!res.data.success) {
  //       throw new Error(res.data.message || 'Failed to fetch STI service');
  //     }
  //     return res.data.data;
  //   } catch (error) {
  //     console.error(`Error fetching STI service ${id}:`, error);
  //     throw new Error(error.response?.data?.message || error.message);
  //   }
  // },

  // createService: async (serviceData) => {
  //   try {
  //     const res = await apiClient.post('/admin/sti-services', serviceData);
  //     if (!res.data.success) {
  //       throw new Error(res.data.message || 'Failed to create STI service');
  //     }
  //     return res.data.data;
  //   } catch (error) {
  //     console.error('Error creating STI service:', error);
  //     throw new Error(error.response?.data?.message || error.message);
  //   }
  // },

  // updateService: async (id, serviceData) => {
  //   try {
  //     const res = await apiClient.put(`/admin/sti-services/${id}`, serviceData);
  //     if (!res.data.success) {
  //       throw new Error(res.data.message || 'Failed to update STI service');
  //     }
  //     return res.data.data;
  //   } catch (error) {
  //     console.error(`Error updating STI service ${id}:`, error);
  //     throw new Error(error.response?.data?.message || error.message);
  //   }
  // },

  // deleteService: async (id) => {
  //   try {
  //     const res = await apiClient.delete(`/admin/sti-services/${id}`);
  //     if (!res.data.success) {
  //       throw new Error(res.data.message || 'Failed to delete STI service');
  //     }
  //     return true;
  //   } catch (error) {
  //     console.error(`Error deleting STI service ${id}:`, error);
  //     throw new Error(error.response?.data?.message || error.message);
  //   }
  // },

  // Get package detail - Public endpoint
  getPackageDetail: async (id) => {
    try {
      if (!id) {
        throw new Error("Service ID is required");
      }
      const response = await apiClient.get(`/sti-services/${id}`);
      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch package details"
        );
      }
      return response.data.data;
    } catch (error) {
      console.error("Error fetching package details:", error);
      if (error.message === "Authentication required") {
        return null; // Return null for unauthenticated users
      }
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // Đặt lịch xét nghiệm STI
  bookTest: async (testData) => {
    try {
      if (!testData || !testData.serviceId) {
        throw new Error("Invalid booking data");
      }
      const response = await apiClient.post(
        "/sti-services/book-test",
        testData
      );
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to book test");
      }
      return response.data.data;
    } catch (error) {
      console.error("Error booking test:", error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // Lấy danh sách xét nghiệm của người dùng
  getMyTests: async () => {
    try {
      const response = await apiClient.get("/sti-services/my-tests");
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch tests");
      }
      return response.data.data;
    } catch (error) {
      console.error("Error fetching my tests:", error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // Tạo QR thanh toán
  createQRPayment: async (testId) => {
    try {
      if (!testId) {
        throw new Error("Test ID is required");
      }
      const response = await apiClient.post("/payments/qr/create", { testId });
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to create QR payment");
      }
      return response.data.data;
    } catch (error) {
      console.error("Error creating QR payment:", error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // Kiểm tra trạng thái thanh toán QR
  checkQRPaymentStatus: async (qrReference) => {
    try {
      if (!qrReference) {
        throw new Error("QR reference is required");
      }
      const response = await apiClient.post(
        `/payments/qr/${qrReference}/check`
      );
      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to check payment status"
        );
      }
      return response.data.data;
    } catch (error) {
      console.error("Error checking QR payment:", error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // ==== STI TEST MANAGEMENT API ===

  getAllTests: async () => {
    try {
      const res = await apiClient.get("/admin/sti-tests");
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to fetch STI tests");
      }
      return res.data.data;
    } catch (error) {
      console.error("Error fetching STI tests:", error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  getTestById: async (id) => {
    try {
      const res = await apiClient.get(`/admin/sti-tests/${id}`);
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to fetch STI test");
      }
      return res.data.data;
    } catch (error) {
      console.error(`Error fetching STI test ${id}:`, error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  createTest: async (testData) => {
    try {
      const res = await apiClient.post("/admin/sti-tests", testData);
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to create STI test");
      }
      return res.data.data;
    } catch (error) {
      console.error("Error creating STI test:", error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  updateTest: async (id, testData) => {
    try {
      const res = await apiClient.put(`/admin/sti-tests/${id}`, testData);
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to update STI test");
      }
      return res.data.data;
    } catch (error) {
      console.error(`Error updating STI test ${id}:`, error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  deleteTest: async (id) => {
    try {
      const res = await apiClient.delete(`/admin/sti-tests/${id}`);
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to delete STI test");
      }
      return true;
    } catch (error) {
      console.error(`Error deleting STI test ${id}:`, error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // ==== STI PACKAGE MANAGEMENT API ===

  getAllPackages: async () => {
    try {
      const res = await apiClient.get("/admin/sti-packages");
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to fetch STI packages");
      }
      return res.data.data;
    } catch (error) {
      console.error("Error fetching STI packages:", error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  getPackageById: async (id) => {
    try {
      const res = await apiClient.get(`/admin/sti-packages/${id}`);
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to fetch STI package");
      }
      return res.data.data;
    } catch (error) {
      console.error(`Error fetching STI package ${id}:`, error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  createPackage: async (packageData) => {
    try {
      const res = await apiClient.post("/admin/sti-packages", packageData);
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to create STI package");
      }
      return res.data.data;
    } catch (error) {
      console.error("Error creating STI package:", error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  updatePackage: async (id, packageData) => {
    try {
      const res = await apiClient.put(`/admin/sti-packages/${id}`, packageData);
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to update STI package");
      }
      return res.data.data;
    } catch (error) {
      console.error(`Error updating STI package ${id}:`, error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  deletePackage: async (id) => {
    try {
      const res = await apiClient.delete(`/admin/sti-packages/${id}`);
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to delete STI package");
      }
      return true;
    } catch (error) {
      console.error(`Error deleting STI package ${id}:`, error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },
};
