/**
 * mockStiData.js - Chứa dữ liệu mẫu và các hàm giả lập (mock functions) cho các API liên quan đến STI Tests.
 * Mục đích: Sử dụng để phát triển và kiểm thử frontend mà không cần backend hoạt động.
 */

// Dữ liệu mẫu cho các lịch hẹn xét nghiệm
let mockAppointments = [
  {
    testId: 1,
    serviceName: 'Xét nghiệm HIV Combo',
    doctorName: 'Bác sĩ Nguyễn Văn A',
    appointmentDate: '2025-06-20T10:00:00Z', // Định dạng ISO 8601
    appointmentTime: '10:00 SA',
    status: 'PENDING', // PENDING, CONFIRMED, COMPLETED, CANCELLED
    price: 850000.0,
    paymentMethod: 'Thanh toán tại phòng khám',
    notes: 'Khách hàng muốn làm xét nghiệm nhanh.',
    consultantId: null,
    customerId: 101,
    staffId: null,
    serviceId: 1,
    packageId: null,
  },
  {
    testId: 2,
    serviceName: 'Gói xét nghiệm tổng quát STI',
    doctorName: 'Bác sĩ Trần Thị B',
    appointmentDate: '2025-06-15T14:30:00Z',
    appointmentTime: '02:30 CH',
    status: 'CONFIRMED',
    price: 2500000.0,
    paymentMethod: 'Chuyển khoản ngân hàng',
    notes: 'Đã tư vấn qua điện thoại.',
    consultantId: 201,
    customerId: 101,
    staffId: null,
    serviceId: 2,
    packageId: 1,
  },
  {
    testId: 3,
    serviceName: 'Xét nghiệm Giang Mai',
    doctorName: 'Bác sĩ Lê Văn C',
    appointmentDate: '2025-06-10T09:00:00Z',
    appointmentTime: '09:00 SA',
    status: 'COMPLETED',
    price: 500000.0,
    paymentMethod: 'Đã thanh toán Online',
    notes: 'Đã có kết quả và gửi qua email.',
    consultantId: null,
    customerId: 102,
    staffId: 301,
    serviceId: 3,
    packageId: null,
  },
  {
    testId: 4,
    serviceName: 'Xét nghiệm Lậu',
    doctorName: 'Bác sĩ Phan Thị D',
    appointmentDate: '2025-06-08T11:00:00Z',
    appointmentTime: '11:00 SA',
    status: 'CANCELLED',
    price: 400000.0,
    paymentMethod: 'Thanh toán tại phòng khám',
    notes: 'Khách hàng hủy hẹn.',
    consultantId: null,
    customerId: 101,
    staffId: null,
    serviceId: 4,
    packageId: null,
  },
  {
    testId: 5,
    serviceName: 'Khám sức khỏe tổng quát',
    doctorName: 'Bác sĩ Mai Thị E',
    appointmentDate: '2025-07-01T09:30:00Z',
    appointmentTime: '09:30 SA',
    status: 'PENDING',
    price: 1200000.0,
    paymentMethod: 'Thanh toán tại phòng khám',
    notes: 'Khách hàng đặt hẹn online, chưa xác nhận.',
    consultantId: null,
    customerId: 101,
    staffId: null,
    serviceId: 5,
    packageId: null,
  },
];

/**
 * Giả lập API gọi lấy danh sách lịch hẹn của tôi.
 * @returns {Promise<Object>} Một Promise resolve với dữ liệu mẫu.
 */
export const mockGetMySTITests = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Lấy danh sách lịch hẹn mẫu thành công',
        data: mockAppointments,
      });
    }, 500); // Giả lập độ trễ 500ms
  });
};

/**
 *  API gọi hủy lịch hẹn.
 * @param {number} testId ID của lịch hẹn cần hủy.
 * @returns {Promise<Object>} Một Promise resolve với kết quả hủy (thành công/thất bại).
 */
export const mockCancelSTITest = async (testId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockAppointments.findIndex((app) => app.testId === testId);
      if (index !== -1 && mockAppointments[index].status === 'PENDING') {
        mockAppointments[index].status = 'CANCELLED'; // Cập nhật trạng thái
        resolve({
          success: true,
          message: `Lịch hẹn ${testId} đã được hủy thành công.`,
          data: { testId: testId, status: 'CANCELLED' },
        });
      } else if (index !== -1 && mockAppointments[index].status !== 'PENDING') {
        reject({
          success: false,
          message: `Không thể hủy lịch hẹn ${testId} vì trạng thái không phải PENDING.`,
          data: null,
        });
      } else {
        reject({
          success: false,
          message: `Không tìm thấy lịch hẹn với ID ${testId}.`,
          data: null,
        });
      }
    }, 300); // Giả lập độ trễ 300ms
  });
};

// Bạn có thể thêm các hàm mock khác nếu cần
