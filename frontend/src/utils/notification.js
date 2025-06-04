/**
 * NOTIFICATION SYSTEM
 * ===================
 * Hệ thống thông báo đẹp thay thế cho alert mặc định
 *
 * CÁCH SỬ DỤNG:
 * -------------
 * Đơn giản:
 *   import notify from '@/utils/notification';
 *   notify.success('Thành công', 'Dữ liệu đã được lưu');
 *   notify.error('Lỗi', 'Không thể kết nối đến máy chủ');
 *
 * Với tuỳ chọn:
 *   notify.info('Thông báo', 'Bạn có tin nhắn mới', { 
 *     duration: 10000,  // Hiển thị trong 10 giây
 *     closable: false   // Không hiển thị nút đóng
 *   });
 *
 * Xóa tất cả thông báo:
 *   notify.clear();
 *
 * CÁC LOẠI THÔNG BÁO:
 * ------------------
 * - success: Thông báo thành công (màu xanh lá)
 * - error: Thông báo lỗi (màu đỏ)
 * - warning: Thông báo cảnh báo (màu vàng cam)
 * - info: Thông báo thông tin (màu xanh dương)
 *
 * TÙY CHỌN:
 * --------
 * - duration: Thời gian hiển thị (millisecond), mặc định 5000ms (5 giây), đặt 0 để không tự đóng
 * - closable: Cho phép đóng thông báo bằng nút X, mặc định là true
 * - position: Vị trí hiển thị, mặc định 'top-right'
 */

// Tạo container cho notifications nếu chưa có
const createNotificationContainer = () => {
  let container = document.getElementById("notification-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "notification-container";
    container.className = "notification-container";
    document.body.appendChild(container);
  }
  return container;
};

// Tạo CSS styles cho notifications
const injectNotificationStyles = () => {
  if (document.getElementById("notification-styles")) return;

  const style = document.createElement("style");
  style.id = "notification-styles";
  style.textContent = `
      /* Notification Container */
      .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        pointer-events: none;
        max-width: 420px;
        width: 100%;
      }
      
      /* Notification Item - Shadow và background cải thiện */
      .notification {
        background: #ffffff;
        border-radius: 16px;
        box-shadow: 
          0 20px 50px rgba(0, 0, 0, 0.08), 
          0 8px 20px rgba(0, 0, 0, 0.06),
          0 3px 8px rgba(0, 0, 0, 0.04);
        margin-bottom: 16px;
        padding: 20px 24px;
        border: none;
        border-left: 6px solid;
        pointer-events: auto;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        display: flex;
        align-items: flex-start;
        gap: 16px;
        position: relative;
        overflow: hidden;
        min-height: 64px;
      }
  
      .notification.show {
        transform: translateX(0);
        opacity: 1;
      }
  
      .notification.hide {
        transform: translateX(100%);
        opacity: 0;
      }
      
      /* Notification Types - Background tối hơn để text dễ đọc */
      .notification.success {
        border-left-color: #10b981;
        background: #f8fffe;
        border: 1px solid rgba(16, 185, 129, 0.15);
      }
  
      .notification.error {
        border-left-color: #ef4444;
        background: #fffbfb;
        border: 1px solid rgba(239, 68, 68, 0.15);
      }
  
      .notification.warning {
        border-left-color: #f59e0b;
        background: #fffef7;
        border: 1px solid rgba(245, 158, 11, 0.15);
      }
  
      .notification.info {
        border-left-color: #3b82f6;
        background: #f8fbff;
        border: 1px solid rgba(59, 130, 246, 0.15);
      }
  
      /* Icon - Lớn hơn và rõ ràng hơn */
      .notification-icon {
        font-size: 24px;
        flex-shrink: 0;
        z-index: 1;
        position: relative;
        margin-top: 2px;
      }
  
      .notification.success .notification-icon {
        color: #059669;
      }
  
      .notification.error .notification-icon {
        color: #dc2626;
      }
  
      .notification.warning .notification-icon {
        color: #d97706;
      }
  
      .notification.info .notification-icon {
        color: #2563eb;
      }
  
      /* Content - Font size lớn hơn */
      .notification-content {
        flex: 1;
        z-index: 1;
        position: relative;
      }
      
      .notification-title {
        font-weight: 700;
        font-size: 16px;
        margin: 0 0 6px 0;
        color: #0f172a;
        line-height: 1.3;
      }
  
      .notification-message {
        font-size: 15px;
        margin: 0;
        color: #334155;
        line-height: 1.5;
      }
  
      /* Close Button - Dễ click hơn */
      .notification-close {
        background: rgba(107, 114, 128, 0.1);
        border: none;
        font-size: 16px;
        cursor: pointer;
        color: #6b7280;
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        transition: all 0.2s ease;
        flex-shrink: 0;
        z-index: 1;
        position: relative;
        margin-top: -2px;
      }
  
      .notification-close:hover {
        background: rgba(107, 114, 128, 0.2);
        color: #374151;
        transform: scale(1.1);
      }
  
      /* Progress Bar - Rõ ràng hơn */
      .notification-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background: currentColor;
        transition: width linear;
        opacity: 0.3;
        z-index: 1;
      }
  
      .notification.success .notification-progress {
        color: #10b981;
      }
  
      .notification.error .notification-progress {
        color: #ef4444;
      }
  
      .notification.warning .notification-progress {
        color: #f59e0b;
      }
      
      .notification.info .notification-progress {
        color: #3b82f6;
      }
  
      /* Mobile Responsive - Cải thiện cho điện thoại */
      @media (max-width: 640px) {
        .notification-container {
          top: 16px;
          right: 16px;
          left: 16px;
          max-width: none;
        }
  
        .notification {
          margin-bottom: 12px;
          padding: 18px 20px;
          border-radius: 12px;
          min-height: 56px;
        }
  
        .notification-icon {
          font-size: 22px;
        }
  
        .notification-title {
          font-size: 15px;
        }
  
        .notification-message {
          font-size: 14px;
        }
  
        .notification-close {
          width: 30px;
          height: 30px;
          font-size: 15px;
        }
      }
  
      /* Tablet */
      @media (min-width: 641px) and (max-width: 1024px) {
        .notification-container {
          max-width: 380px;
        }
      }
  
      /* Animation cho hover trên desktop */
      @media (hover: hover) {
        .notification:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2), 0 8px 16px rgba(0, 0, 0, 0.15);
        }
      }
  
      /* Reduced motion cho accessibility */
      @media (prefers-reduced-motion: reduce) {
        .notification {
          transition: opacity 0.2s ease;
        }
        
        .notification.show {
          transform: none;
        }
        
        .notification.hide {
          transform: none;
        }
      }
      
      /* Dark mode support - Text dễ đọc hơn */
      @media (prefers-color-scheme: dark) {
        .notification {
          background: #1e293b;
          box-shadow: 
            0 20px 50px rgba(0, 0, 0, 0.4), 
            0 8px 20px rgba(0, 0, 0, 0.3),
            0 3px 8px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(71, 85, 105, 0.3);
        }
  
        .notification-title {
          color: #f1f5f9;
        }
  
        .notification-message {
          color: #cbd5e1;
        }
  
        .notification-close {
          background: rgba(156, 163, 175, 0.2);
          color: #9ca3af;
        }
  
        .notification-close:hover {
          background: rgba(156, 163, 175, 0.3);
          color: #f3f4f6;
        }
  
        /* Dark mode notification types */
        .notification.success {
          background: #0f1a14;
          border-left-color: #10b981;
          border-color: rgba(16, 185, 129, 0.3);
        }
  
        .notification.error {
          background: #1a0f0f;
          border-left-color: #ef4444;
          border-color: rgba(239, 68, 68, 0.3);
        }
  
        .notification.warning {
          background: #1a1510;
          border-left-color: #f59e0b;
          border-color: rgba(245, 158, 11, 0.3);
        }
  
        .notification.info {
          background: #0f1419;
          border-left-color: #3b82f6;
          border-color: rgba(59, 130, 246, 0.3);
        }
      }
    `;
  document.head.appendChild(style);
};

// Icons cho từng loại notification
const NOTIFICATION_ICONS = {
  success: "✅",
  error: "❌",
  warning: "⚠️",
  info: "ℹ️",
};

/**
 * Tạo phần tử thông báo
 * @param {string} type - Loại thông báo (success/error/warning/info)
 * @param {string} title - Tiêu đề thông báo
 * @param {string} message - Nội dung thông báo
 * @param {number} duration - Thời gian hiển thị (milliseconds)
 */
const createNotificationElement = (type, title, message, duration) => {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;

  const icon = NOTIFICATION_ICONS[type] || "ℹ️";

  notification.innerHTML = `
      <div class="notification-icon">${icon}</div>
      <div class="notification-content">
        <div class="notification-title">${title}</div>
        <div class="notification-message">${message}</div>
      </div>
      <button class="notification-close" type="button" aria-label="Đóng thông báo">×</button>
      ${duration > 0 ? '<div class="notification-progress"></div>' : ""}
    `;

  return notification;
};

/**
 * Hiển thị thông báo
 * @param {string} type - Loại thông báo: 'success', 'error', 'warning', 'info'
 * @param {string} title - Tiêu đề thông báo
 * @param {string} message - Nội dung thông báo
 * @param {object} options - Các tùy chọn:
 *   - duration: Thời gian hiển thị (ms), mặc định 5000ms, đặt 0 để không tự đóng
 *   - closable: Cho phép đóng thủ công, mặc định true
 *   - position: Vị trí hiển thị, mặc định 'top-right'
 * @returns {HTMLElement} - Trả về phần tử thông báo đã tạo
 */
const showNotification = (type, title, message, options = {}) => {
  // Inject styles nếu chưa có
  injectNotificationStyles();

  // Tạo container nếu chưa có
  const container = createNotificationContainer();

  // Default options
  const defaultOptions = {
    duration: 5000, // 5 giây
    closable: true,
    position: "top-right",
  };

  const config = { ...defaultOptions, ...options };

  // Tạo notification element
  const notification = createNotificationElement(
    type,
    title,
    message,
    config.duration
  );

  // Thêm vào container
  container.appendChild(notification);

  // Trigger animation
  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  // Setup progress bar nếu có duration
  if (config.duration > 0) {
    const progressBar = notification.querySelector(".notification-progress");
    if (progressBar) {
      progressBar.style.width = "100%";
      setTimeout(() => {
        progressBar.style.width = "0%";
        progressBar.style.transition = `width ${config.duration}ms linear`;
      }, 100);
    }
  }

  // Auto remove notification
  let timeoutId;
  if (config.duration > 0) {
    timeoutId = setTimeout(() => {
      removeNotification(notification);
    }, config.duration);
  }

  // Setup close button
  const closeBtn = notification.querySelector(".notification-close");
  if (closeBtn && config.closable) {
    closeBtn.addEventListener("click", () => {
      if (timeoutId) clearTimeout(timeoutId);
      removeNotification(notification);
    });
  }

  return notification;
};

/**
 * Xóa một thông báo
 * @param {HTMLElement} notification - Phần tử thông báo cần xóa
 */
const removeNotification = (notification) => {
  notification.classList.add("hide");
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 300);
};

/**
 * Xóa tất cả các thông báo đang hiển thị
 */
const clearAllNotifications = () => {
  const container = document.getElementById("notification-container");
  if (container) {
    const notifications = container.querySelectorAll(".notification");
    notifications.forEach(removeNotification);
  }
};

/**
 * Đối tượng notify cung cấp các phương thức để hiển thị thông báo
 */
export const notify = {
  /**
   * Hiển thị thông báo thành công (xanh lá)
   * @param {string} title - Tiêu đề thông báo
   * @param {string} message - Nội dung thông báo
   * @param {object} options - Tùy chọn (duration, closable, position)
   * @returns {HTMLElement} - Phần tử thông báo đã tạo
   * 
   * Ví dụ: notify.success('Thành công', 'Dữ liệu đã được lưu');
   */
  success: (title, message, options) =>
    showNotification("success", title, message, options),

  /**
   * Hiển thị thông báo lỗi (đỏ)
   * @param {string} title - Tiêu đề thông báo
   * @param {string} message - Nội dung thông báo
   * @param {object} options - Tùy chọn (duration, closable, position)
   * @returns {HTMLElement} - Phần tử thông báo đã tạo
   * 
   * Ví dụ: notify.error('Lỗi', 'Không thể kết nối đến máy chủ');
   */
  error: (title, message, options) =>
    showNotification("error", title, message, options),

  /**
   * Hiển thị thông báo cảnh báo (vàng cam)
   * @param {string} title - Tiêu đề thông báo
   * @param {string} message - Nội dung thông báo
   * @param {object} options - Tùy chọn (duration, closable, position)
   * @returns {HTMLElement} - Phần tử thông báo đã tạo
   * 
   * Ví dụ: notify.warning('Cảnh báo', 'Bạn chưa lưu thay đổi');
   */
  warning: (title, message, options) =>
    showNotification("warning", title, message, options),

  /**
   * Hiển thị thông báo thông tin (xanh dương)
   * @param {string} title - Tiêu đề thông báo
   * @param {string} message - Nội dung thông báo
   * @param {object} options - Tùy chọn (duration, closable, position)
   * @returns {HTMLElement} - Phần tử thông báo đã tạo
   * 
   * Ví dụ: notify.info('Thông báo', 'Bạn có tin nhắn mới');
   */
  info: (title, message, options) =>
    showNotification("info", title, message, options),

  /**
   * Xóa tất cả thông báo đang hiển thị
   * 
   * Ví dụ: notify.clear();
   */
  clear: clearAllNotifications,
};

// Export default
export default notify;
