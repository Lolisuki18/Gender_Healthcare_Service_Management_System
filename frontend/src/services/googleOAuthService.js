/**
 * googleOAuthService.js - Service xử lý Google OAuth với Google Identity Services
 * 
 * Tính năng:
 * - Khởi tạo Google Identity Services (GIS)
 * - Xử lý đăng nhập Google
 * - Gửi credential đến backend để xác thực
 */

import apiClient from './api';

class GoogleOAuthService {
  constructor() {
    this.isGoogleLoaded = false;
    this.initPromise = null;
    this.clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '720346160754-01sporrebme0idvj7u55nbjepiq279in.apps.googleusercontent.com';
  }

  /**
   * Khởi tạo Google Identity Services
   */
  async initializeGoogleAuth() {
    // Nếu đã có promise đang chạy, trả về promise đó
    if (this.initPromise) {
      return this.initPromise;
    }

    // Nếu đã khởi tạo thành công rồi
    if (this.isGoogleLoaded && window.google) {
      return Promise.resolve();
    }

    this.initPromise = new Promise(async (resolve, reject) => {
      try {
        // Load Google Identity Services script
        await this.loadGoogleIdentityServices();
        
        // Đợi google object sẵn sàng
        if (!window.google?.accounts?.id) {
          throw new Error('Google Identity Services not loaded');
        }

        console.log('Google Identity Services initialized successfully');
        this.isGoogleLoaded = true;
        resolve();
      } catch (error) {
        console.error('Google Identity Services loading error:', error);
        reject(error);
      }
    });

    return this.initPromise;
  }

  /**
   * Đăng nhập với Google sử dụng Google Identity Services
   */
  async signInWithGoogle() {
    try {
      // Đảm bảo Google Identity Services đã được khởi tạo
      await this.initializeGoogleAuth();

      if (!window.google?.accounts?.id) {
        throw new Error('Google Identity Services not initialized');
      }

      console.log('Starting Google sign in...');
      
      return new Promise((resolve, reject) => {
        // Sử dụng phương pháp redirect thay vì popup
        window.google.accounts.id.initialize({
          client_id: this.clientId,
          callback: async (response) => {
            try {
              if (!response.credential) {
                throw new Error('No credential received from Google');
              }

              console.log('Google sign in successful, sending to backend...');
              
              // Gửi credential đến backend
              const backendResponse = await apiClient.post('/auth/oauth/google/login', {
                idToken: response.credential
              });

              resolve(backendResponse.data);
            } catch (error) {
              console.error('Backend auth error:', error);
              reject(error);
            }
          },
          cancel_on_tap_outside: false,
          auto_select: false,
          use_fedcm_for_prompt: false
        });

        // Sử dụng renderButton để tránh popup blocking
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'fixed';
        tempDiv.style.top = '-9999px';
        tempDiv.style.left = '-9999px';
        document.body.appendChild(tempDiv);
        
        try {
          window.google.accounts.id.renderButton(tempDiv, {
            theme: 'outline',
            size: 'large',
            width: 200
          });
          
          // Trigger click sau khi render
          setTimeout(() => {
            const button = tempDiv.querySelector('div[role="button"]');
            if (button) {
              button.click();
            } else {
              // Fallback: sử dụng prompt
              window.google.accounts.id.prompt((notification) => {
                if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                  reject(new Error('Popup bị chặn hoặc người dùng không chọn tài khoản'));
                }
              });
            }
            
            // Clean up
            setTimeout(() => {
              if (document.body.contains(tempDiv)) {
                document.body.removeChild(tempDiv);
              }
            }, 1000);
          }, 100);
        } catch (error) {
          document.body.removeChild(tempDiv);
          reject(error);
        }
      });
    } catch (error) {
      console.error('Google OAuth Error:', error);
      
      // Xử lý các loại lỗi khác nhau
      if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Không thể đăng nhập với Google. Vui lòng thử lại.');
      }
    }
  }

  /**
   * Đăng xuất Google
   */
  async signOut() {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
  }

  /**
   * Load Google Identity Services script
   */
  loadGoogleIdentityServices() {
    return new Promise((resolve, reject) => {
      // Kiểm tra nếu đã có google object
      if (window.google?.accounts?.id) {
        resolve();
        return;
      }

      // Kiểm tra nếu script đã được load
      if (document.getElementById('google-identity-script')) {
        // Đợi một chút để script load xong
        const checkGoogle = () => {
          if (window.google?.accounts?.id) {
            resolve();
          } else {
            setTimeout(checkGoogle, 100);
          }
        };
        checkGoogle();
        return;
      }

      console.log('Loading Google Identity Services script...');
      
      const script = document.createElement('script');
      script.id = 'google-identity-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('Google Identity Services script loaded successfully');
        // Đợi một chút để đảm bảo google object sẵn sàng
        setTimeout(() => {
          if (window.google?.accounts?.id) {
            resolve();
          } else {
            reject(new Error('Google Identity Services object not available after script load'));
          }
        }, 100);
      };
      
      script.onerror = (error) => {
        console.error('Failed to load Google Identity Services script:', error);
        reject(new Error('Failed to load Google Identity Services script'));
      };
      
      document.head.appendChild(script);
    });
  }
}

export const googleOAuthService = new GoogleOAuthService();
