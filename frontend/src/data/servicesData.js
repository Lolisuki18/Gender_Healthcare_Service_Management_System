/**
 * servicesData.js - Danh sách các dịch vụ chăm sóc sức khỏe
 * 
 * File chứa thông tin chi tiết về tất cả các dịch vụ được cung cấp,
 * bao gồm thông tin hiển thị, routing và styling cho từng dịch vụ.
 */

// Import các icon cần thiết
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import SchoolIcon from '@mui/icons-material/School';
import SupportIcon from '@mui/icons-material/Support';
import PsychologyIcon from '@mui/icons-material/Psychology';

/**
 * Danh sách các dịch vụ chăm sóc sức khỏe
 * Mỗi dịch vụ bao gồm:
 * - id: Mã định danh duy nhất
 * - title: Tên dịch vụ
 * - shortDesc: Mô tả ngắn gọn
 * - bullets: Danh sách các tính năng chính
 * - detailRoute: Đường dẫn đến trang chi tiết
 * - icon: Component icon từ Material-UI
 * - color: Màu chủ đạo của dịch vụ
 * - gradientFrom/gradientTo: Màu gradient cho hiệu ứng
 */
export const servicesData = [
  {
    id: 1,
    title: 'Xét nghiệm các bệnh lây truyền qua đường tình dục (STI)',
    shortDesc:
      'Dịch vụ xét nghiệm toàn diện các bệnh lây truyền qua đường tình dục với kết quả bảo mật và hỗ trợ chuyên nghiệp.',
    bullets: [
      'Xét nghiệm STI toàn diện',
      'Có các xét nghiệm lẻ',
      'Trả kết quả nhanh',
      'Bảo mật thông tin',
      'Tư vấn chuyên sâu',
    ],
    detailRoute: '/services/sti-testing',
    icon: MedicalServicesIcon,
    color: '#FF6B6B',
    gradientFrom: '#FF6B6B',
    gradientTo: '#FF8E8E',
  },
  {
    id: 2,
    title: 'Theo dõi chu kỳ rụng trứng',
    shortDesc:
      'Theo dõi chu kỳ kinh nguyệt, dự đoán rụng trứng và nhắc nhở tránh thai.',
    bullets: [
      'Theo dõi chu kỳ',
      'Dự đoán rụng trứng',
      'Cảnh báo cửa sổ thụ thai',
      'Nhắc nhở tránh thai',
      'Ghi chú triệu chứng',
    ],
    detailRoute: '/ovulation',
    icon: FavoriteIcon,
    color: '#FF69B4',
    gradientFrom: '#FF69B4',
    gradientTo: '#FF8FA3',
  },
  {
    id: 3,
    title: 'Tư vấn trực tuyến',
    shortDesc:
      'Đặt lịch hẹn trực tuyến với chuyên gia y tế cho lời khuyên cá nhân hóa.',
    bullets: [
      'Tư vấn qua video',
      'Nhắn tin bảo mật',
      'Dịch vụ kê đơn',
      'Chăm sóc sau tư vấn',
      'Giới thiệu chuyên khoa',
    ],
    detailRoute: '/consultation',
    icon: VideoCallIcon,
    color: '#4A90E2',
    gradientFrom: '#4A90E2',
    gradientTo: '#6BA3E7',
  },
  {
    id: 4,
    title: 'Nhắc uống thuốc',
    shortDesc: 'Quản lý và nhắc nhở lịch uống thuốc, hỗ trợ tuân thủ điều trị.',
    bullets: [
      'Tạo lịch nhắc uống thuốc',
      'Thông báo nhắc nhở tự động',
      'Quản lý nhiều loại thuốc',
      'Theo dõi tuân thủ',
      'Hỗ trợ cá nhân hóa',
    ],
    detailRoute: '/pill-reminder',
    icon: SchoolIcon,
    color: '#9C27B0',
    gradientFrom: '#9C27B0',
    gradientTo: '#B55BC5',
  },
  {
    id: 5,
    title: 'Chăm sóc khẳng định giới',
    shortDesc: 'Dịch vụ chăm sóc sức khỏe hỗ trợ cho mọi bản dạng giới.',
    bullets: [
      'Tư vấn khẳng định giới',
      'Hướng dẫn liệu pháp hormone',
      'Dịch vụ giới thiệu',
      'Tư vấn hỗ trợ',
      'Chăm sóc toàn diện',
    ],
    detailRoute: '/services/gender-affirming-care',
    icon: SupportIcon,
    color: '#00BCD4',
    gradientFrom: '#00BCD4',
    gradientTo: '#26C6DA',
  },
  {
    id: 6,
    title: 'Tư vấn sức khỏe sinh sản',
    shortDesc:
      'Tư vấn về kế hoạch hóa gia đình, sinh sản và các vấn đề sức khỏe sinh sản.',
    bullets: [
      'Tư vấn kế hoạch hóa',
      'Tư vấn sinh sản',
      'Chăm sóc tiền thai',
      'Tư vấn lựa chọn mang thai',
      'Giáo dục sức khỏe sinh sản',
    ],
    detailRoute: '/services/reproductive-health-counseling',
    icon: PsychologyIcon,
    color: '#1ABC9C',
    gradientFrom: '#1ABC9C',
    gradientTo: '#48C9B0',
  },
];

/**
 * Hàm helper để lấy dịch vụ theo ID
 * @param {number} id - ID của dịch vụ
 * @returns {Object|null} - Dịch vụ tương ứng hoặc null nếu không tìm thấy
 */
export const getServiceById = (id) => {
  return servicesData.find(service => service.id === id) || null;
};

/**
 * Hàm helper để lấy dịch vụ theo route
 * @param {string} route - Route của dịch vụ
 * @returns {Object|null} - Dịch vụ tương ứng hoặc null nếu không tìm thấy
 */
export const getServiceByRoute = (route) => {
  return servicesData.find(service => service.detailRoute === route) || null;
};

/**
 * Hàm helper để lấy danh sách dịch vụ được featured (hiển thị trên trang chủ)
 * @param {number} limit - Số lượng dịch vụ tối đa (mặc định là 6)
 * @returns {Array} - Danh sách dịch vụ featured
 */
export const getFeaturedServices = (limit = 6) => {
  return servicesData.slice(0, limit);
};

/**
 * Hàm helper để lấy màu sắc theo ID dịch vụ
 * @param {number} id - ID của dịch vụ
 * @returns {string} - Màu sắc của dịch vụ
 */
export const getServiceColor = (id) => {
  const service = getServiceById(id);
  return service ? service.color : '#4A90E2';
};

export default servicesData;
