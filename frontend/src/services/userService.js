import apiClient from '@services/api';
import localStorageUtil from '@utils/localStorage';

// Service cho các API liên quan đến người dùng
export const userService = {
  //đăng xuất
  logout: async () => {
    try {
      const response = await apiClient.post('/auth/logout');

      localStorageUtil.remove('user');

      return response.data;
    } catch (error) {
      localStorageUtil.remove('user');

      throw error.response?.data || error;
    }
  }, // Đăng nhập
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data; // JwtResponse từ backend
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Đăng ký
  register: async (userData) => {
    try {
      const response = await apiClient.post('/users/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy thông tin người dùng hiện tại
  getCurrentUser: async (skipAutoRedirect = false) => {
    try {
      const response = await apiClient.get('/users/profile', {
        skipAutoRedirect,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // Cập nhật thông tin người dùng
  updateProfile: async (userData) => {
    try {
      const response = await apiClient.put('/users/profile/basic', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  sendCode: async (email) => {
    try {
      const response = await apiClient.post('/users/send-verification', {
        email,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  sendCodeForgotPassword: async (email) => {
    try {
      const response = await apiClient.post('/users/forgot-password', {
        email,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  resetPassword: async (email, code, newPassword) => {
    try {
      const response = await apiClient.post('/users/reset-password', {
        email,
        code,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * ✅ Send email verification code for email change
   * @param {string} newEmail - New email address
   * @returns {Promise<Object>} API response
   */
  sendEmailVerificationCode: async (newEmail) => {
    try {
      const response = await apiClient.post(
        '/users/profile/email/send-verification',
        {
          email: newEmail,
        }
      );
      // Trả về kết quả thành công
      return {
        success: true,
        data: response.data,
        message: 'Đã gửi mã xác nhận thành công',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể gửi mã xác nhận',
        error: error,
      };
    }
  },

  /**
   * ✅ Verify email change with verification code and update email
   * @param {Object} data - Verification data
   * @param {string} data.newEmail - New email address
   * @param {string} data.verificationCode - 6-digit verification code
   * @returns {Promise<Object>} API response
   */ verifyEmailChange: async (data) => {
    try {
      const response = await apiClient.put('/users/profile/email', {
        newEmail: data.newEmail,
        verificationCode: data.verificationCode,
      });
      // Lưu lại token mới nếu server cung cấp
      if (response.data.token) {
        localStorageUtil.set('token', response.data.token);
      }

      return {
        success: true,
        data: response.data,
        message: 'Email đã được thay đổi thành công',
      };
    } catch (error) {
      // Xử lý các loại lỗi khác nhau
      let errorMessage = 'Mã xác nhận không đúng';

      if (error.response?.status === 401) {
        errorMessage = 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại';
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || 'Dữ liệu không hợp lệ';
      } else if (error.response?.status === 404) {
        errorMessage = 'Không tìm thấy người dùng';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      return {
        success: false,
        message: errorMessage,
        error: error,
        statusCode: error.response?.status,
      };
    }
  },

  /**
   * ✅ Change user password
   * @param {Object} data - Password change data
   * @param {string} data.currentPassword - Current password
   * @param {string} data.newPassword - New password
   * @returns {Promise<Object>} API response
   */
  changePassword: async (passwordData) => {
    try {
      const response = await apiClient.put('/users/profile/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });

      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Đổi mật khẩu thành công',
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu',
      };
    }
  },
  // Refresh token
  refreshToken: async (refreshTokenValue) => {
    try {
      // Sử dụng apiClient chính thay vì tạo instance mới
      const response = await apiClient.post('/auth/refresh-token', {
        refreshToken: refreshTokenValue,
      });

      if (response.data && response.data.accessToken) {
        const tokenData = response.data;

        // Tạo object token mới
        const newToken = {
          accessToken: tokenData.accessToken,
          refreshToken: tokenData.refreshToken || refreshTokenValue,
        };

        // Lưu token mới vào localStorage
        localStorageUtil.set('token', newToken);

        // Cập nhật cả trong user data nếu có
        const userData = localStorageUtil.get('user');
        if (userData) {
          userData.accessToken = tokenData.accessToken;
          if (tokenData.refreshToken) {
            userData.refreshToken = tokenData.refreshToken;
          }
          localStorageUtil.set('user', userData);
        }

        return tokenData;
      }

      throw new Error('Invalid refresh token response');
    } catch (error) {
      // Xử lý lỗi authentication
      if (error.response?.status === 401) {
        localStorageUtil.remove('token');
        localStorageUtil.remove('user');

        // Chỉ redirect nếu không phải đang ở trang login
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }

      throw error.response?.data || error;
    }
  },

  /**
   * ✅ Upload avatar image   * @param {File} file - Image file to upload
   * @returns {Promise<Object>} API response with uploaded image URL
   */
  uploadAvatar: async (file) => {
    try {
      // Đảm bảo token hợp lệ trước khi upload
      const isTokenValid = await userService.ensureValidToken();
      if (!isTokenValid) {
        return {
          success: false,
          message:
            'Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.',
        };
      }

      // Lấy token mới nhất từ localStorage
      const tokenData = localStorageUtil.get('token');
      if (!tokenData || !tokenData.accessToken) {
        return {
          success: false,
          message: 'Không tìm thấy token xác thực. Vui lòng đăng nhập lại.',
        };
      } // Create form data object for file upload
      const formData = new FormData();
      formData.append('file', file); // Sử dụng key "file" theo yêu cầu của backend

      const response = await apiClient.post('/users/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${tokenData.accessToken}`, // Đảm bảo token được gửi đi
        },
        timeout: 30000, // Tăng timeout lên 30 giây cho upload file lớn
      });

      // Kiểm tra cấu trúc response từ API
      if (!response.data) {
        return {
          success: false,
          message: 'Không nhận được dữ liệu từ API',
        };
      } // Xử lý nhiều định dạng response khác nhau
      let responseData = response.data;
      let avatarData = responseData;

      // Nếu response là { success, data, message } format
      if (
        responseData &&
        responseData.success !== undefined &&
        responseData.data
      ) {
        avatarData = responseData.data;
      }

      // Kiểm tra nếu avatar nằm trực tiếp trong data và là string
      if (
        typeof responseData === 'string' &&
        (responseData.includes('/img/') ||
          responseData.includes('/avatar/') ||
          responseData.includes('/images/'))
      ) {
        avatarData = responseData;
      }

      // Trường hợp data.avatar hoặc data là object có chứa avatar
      if (typeof avatarData === 'object') {
        if (avatarData.avatar) {
          avatarData = { avatar: avatarData.avatar };
        } else if (responseData.avatar) {
          avatarData = { avatar: responseData.avatar };
        }
      }

      return {
        success: true,
        data: avatarData,
        message: 'Cập nhật avatar thành công',
      };
    } catch (error) {
      // Kiểm tra lỗi token hết hạn
      if (error.response?.status === 401) {
        try {
          // Thử làm mới token và gửi lại yêu cầu
          const tokenData = localStorageUtil.get('token');
          if (tokenData?.refreshToken) {
            const refreshResponse = await userService.refreshToken(
              tokenData.refreshToken
            );
            if (refreshResponse.accessToken) {
              // Update token và thử lại
              localStorageUtil.set('token', {
                ...tokenData,
                accessToken: refreshResponse.accessToken,
                refreshToken:
                  refreshResponse.refreshToken || tokenData.refreshToken,
              });

              // Đệ quy gọi lại hàm upload sau khi refresh token
              return userService.uploadAvatar(file);
            }
          }
        } catch (refreshError) {
          return {
            success: false,
            message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
            error: refreshError,
          };
        }
      }

      return {
        success: false,
        message: error.response?.data?.message || 'Không thể cập nhật avatar',
        error: error,
      };
    }
  },
  /**
   * ✅ Kiểm tra và làm mới token nếu cần
   * @returns {Promise<boolean>} Trả về true nếu token hợp lệ hoặc đã được làm mới thành công
   */
  ensureValidToken: async () => {
    try {
      const tokenData = localStorageUtil.get('token');
      if (!tokenData || !tokenData.accessToken) {
        return false;
      }

      // Phân tích JWT token để kiểm tra hết hạn
      const tokenParts = tokenData.accessToken.split('.');
      if (tokenParts.length !== 3) {
        return false;
      }

      try {
        // Giải mã phần payload của token
        const payload = JSON.parse(atob(tokenParts[1]));
        const expiryTime = payload.exp * 1000; // Chuyển sang milliseconds
        const currentTime = Date.now();

        // Kiểm tra nếu token sắp hết hạn (còn dưới 5 phút)
        if (expiryTime - currentTime < 5 * 60 * 1000) {
          const refreshResult = await userService.refreshToken(
            tokenData.refreshToken
          );
          return (
            !!refreshResult &&
            (refreshResult.success ||
              refreshResult.accessToken ||
              (refreshResult.data &&
                (refreshResult.data.accessToken || refreshResult.data.success)))
          );
        }

        // Token vẫn còn hiệu lực
        return true;
      } catch (error) {
        return false;
      }
    } catch (error) {
      return false;
    }
  },
  // Lấy thông tin người dùng theo id
  getUserById: async (userId) => {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  /**
   * Kiểm tra username đã tồn tại (dùng cho realtime validation ở frontend)
   * @param {string} username
   * @returns {Promise<{exists: boolean}>}
   */
  checkUsername: async (username) => {
    try {
      const response = await apiClient.get(
        `/users/check-username?username=${encodeURIComponent(username)}`
      );
      return response.data; // { exists: true/false }
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  /**
   * Gửi mã xác nhận đổi số điện thoại qua email
   * @returns {Promise<Object>} API response
   */
  sendPhoneChangeVerificationCode: async () => {
    try {
      const response = await apiClient.post(
        '/users/profile/phone/send-verification'
      );
      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể gửi mã xác nhận',
        error: error,
      };
    }
  },

  /**
   * Xác thực mã và cập nhật số điện thoại
   * @param {string} phone - Số điện thoại mới
   * @param {string} verificationCode - Mã xác nhận từ email
   * @returns {Promise<Object>} API response
   */
  verifyPhoneChange: async (phone, verificationCode) => {
    try {
      const response = await apiClient.put(
        `/users/profile/phone?phone=${encodeURIComponent(phone)}&verificationCode=${encodeURIComponent(verificationCode)}`
      );
      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          'Có lỗi xảy ra khi xác thực số điện thoại',
        error: error,
      };
    }
  },

};
export const consultantService = {
  // Lấy danh sách bác sĩ
  getConsultants: async () => {
    try {
      const response = await apiClient.get('/consultants');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateProfile: async (consultantDate) => {
    try {
      const response = await apiClient.put(
        '/consultants/profile',
        consultantDate
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getConsultantProfile: async (consultantId) => {
    try {
      const response = await apiClient.get(`/consultants/${consultantId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
