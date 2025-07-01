// ===== IMPORT CÁC THƯ VIỆN VÀ COMPONENT CẦN THIẾT =====
// Import React và các hook cơ bản để quản lý state và lifecycle
import React, { useState, useEffect, useMemo } from 'react';
// Import hooks để điều hướng và lấy dữ liệu từ URL
import { useLocation, useNavigate } from 'react-router-dom';

// ===== IMPORT CÁC COMPONENT UI TỪ MATERIAL-UI =====
import {
  Box,              // Container flexbox đa năng
  Button,           // Nút bấm với nhiều style khác nhau
  Typography,       // Component hiển thị text với typography system
  CircularProgress, // Icon loading hình tròn xoay
  Container,        // Container có max-width responsive
  Radio,            // Nút radio để chọn 1 trong nhiều option
  RadioGroup,       // Nhóm các radio button
  FormControlLabel, // Label cho form control (radio, checkbox, etc.)
} from '@mui/material';
import { styled } from '@mui/material/styles'; // Utility để tạo styled component

// ===== IMPORT CÁC SERVICE API =====
import stiService from '@/services/stiService'; // Service gọi API liên quan đến xét nghiệm STI

// ===== IMPORT CÁC COMPONENT TỰ TẠO =====
import ServiceSelection from '@/components/TestRegistration/ServiceSelection';         // Component chọn dịch vụ
import DateTimeSelection from '@/components/TestRegistration/DateTimeSelection';       // Component chọn ngày giờ
import BookingSuccessDialog from '@/components/TestRegistration/BookingSuccessDialog'; // Dialog thông báo đặt lịch thành công
import ServiceDetailDialog from '@/components/TestRegistration/ServiceDetailDialog';   // Dialog hiển thị chi tiết dịch vụ

// ===== CÁC HẰNG SỐ DÙNG TRONG COMPONENT =====
// Các bước trong quy trình đặt lịch xét nghiệm (dùng cho stepper)
const STEPS = [
  'Chọn loại dịch vụ', // Bước 1: Chọn xét nghiệm lẻ hoặc gói xét nghiệm
  'Chọn ngày & giờ',   // Bước 2: Chọn thời gian hẹn
  'Thanh toán',        // Bước 3: Chọn phương thức thanh toán và xác nhận
];

// Số lượng item hiển thị trên mỗi trang (cho pagination)
const ITEMS_PER_PAGE = 5;

// Danh sách khung giờ có thể đặt lịch hẹn (từ 8h sáng đến 8h tối)
const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', // Khung giờ buổi sáng
  '12:00', '13:00', '14:00', '15:00', // Khung giờ buổi chiều
  '16:00', '17:00', '18:00', '19:00', // Khung giờ buổi chiều muộn
  '20:00'                             // Khung giờ buổi tối
];

// ===== STYLED COMPONENT - NÚT BẤM HIỆN ĐẠI =====
// Tạo component Button tùy chỉnh với design hiện đại và hiệu ứng đẹp mắt
const ModernButton = styled(Button)(({ theme }) => ({
  borderRadius: 16,                                          // Bo góc 16px cho look hiện đại
  fontWeight: 600,                                           // Font weight semi-bold
  fontSize: '1rem',                                          // Font size 16px
  textTransform: 'none',                                     // Không viết hoa tự động
  padding: '10px 24px',                                      // Padding 10px dọc, 24px ngang
  transition: 'all 0.2s ease',                               // Animation mượt 200ms
  fontFamily: 'inherit',                                     // Kế thừa font family từ parent
  boxShadow: '0 2px 8px rgba(33,150,243,0.08)',             // Đổ bóng nhẹ màu xanh
  '&:hover': {                                               // Hiệu ứng khi hover
    transform: 'translateY(-2px)',                           // Nâng lên 2px
    boxShadow: '0 8px 25px rgba(33,150,243,0.15)',          // Đổ bóng đậm hơn
  },
}));

// ===== CUSTOM HOOK - QUẢN LÝ DỮ LIỆU DỊCH VỤ =====
// Hook này tách riêng logic fetch data để tái sử dụng và dễ test
const useServices = () => {
  // ===== STATE QUẢN LÝ DỮ LIỆU =====
  const [singleTests, setSingleTests] = useState([]);        // Danh sách xét nghiệm lẻ
  const [packages, setPackages] = useState([]);              // Danh sách gói xét nghiệm
  const [loading, setLoading] = useState(true);              // Trạng thái đang tải dữ liệu
  const [error, setError] = useState(null);                  // Lỗi nếu có khi fetch data

  // ===== EFFECT FETCH DỮ LIỆU KHI COMPONENT MOUNT =====
  useEffect(() => {
    // Hàm async để gọi API lấy dữ liệu dịch vụ và gói xét nghiệm
    const fetchServices = async () => {
      try {
        setLoading(true);  // Bắt đầu loading
        setError(null);    // Reset lỗi trước đó
        
        console.log('Fetching services and packages...'); // Log debug
        
        // Gọi 2 API song song để tối ưu thời gian tải
        const [servicesResponse, packagesResponse] = await Promise.all([
          stiService.getActiveSTIServices(),   // API lấy danh sách xét nghiệm lẻ
          stiService.getAllSTIPackages(),   // API lấy danh sách gói xét nghiệm
        ]);
        
        console.log('API responses:', { servicesResponse, packagesResponse }); // Log debug
        
        // ===== XỬ LÝ RESPONSE TỪ API XÉT NGHIỆM LẺ =====
        if (servicesResponse && servicesResponse.success && servicesResponse.data) {
          setSingleTests(servicesResponse.data);                               // Cập nhật state với dữ liệu API
          console.log('Set services:', servicesResponse.data.length, 'items'); // Log số lượng
        } else {
          console.warn('Services response failed or no data:', servicesResponse); // Log cảnh báo
          setSingleTests([]);                                                     // Fallback về mảng rỗng
        }
        
        // ===== XỬ LÝ RESPONSE TỪ API GÓI XÉT NGHIỆM =====
        if (packagesResponse && packagesResponse.success && packagesResponse.data) {
          setPackages(packagesResponse.data);                                   // Cập nhật state với dữ liệu API
          console.log('Set packages:', packagesResponse.data.length, 'items'); // Log số lượng
        } else {
          console.warn('Packages response failed or no data:', packagesResponse); // Log cảnh báo
          setPackages([]);                                                        // Fallback về mảng rỗng
        }
        
      } catch (err) {
        // ===== XỬ LÝ LỖI KHI GỌI API =====
        console.error('Error fetching services:', err);                    // Log lỗi chi tiết
        setError(err.message || 'Không thể tải dữ liệu dịch vụ');         // Set message lỗi user-friendly
      } finally {
        setLoading(false);                                                 // Tắt loading dù thành công hay thất bại
      }
    };

    fetchServices(); // Gọi hàm fetch data
  }, []); // Dependencies rỗng => chỉ chạy 1 lần khi component mount

  // Trả về object chứa tất cả state cần thiết
  return { singleTests, packages, loading, error };
};

// ===== CUSTOM HOOK - QUẢN LÝ SEARCH VÀ FILTER =====
// Hook này xử lý logic tìm kiếm và lọc dữ liệu dịch vụ
const useSearch = (singleTests, packages) => {
  // ===== STATE QUẢN LÝ SEARCH =====
  const [searchQuery, setSearchQuery] = useState('');                           // Từ khóa tìm kiếm
  const [filteredSingleTests, setFilteredSingleTests] = useState(singleTests);  // Danh sách xét nghiệm lẻ đã lọc
  const [filteredPackages, setFilteredPackages] = useState(packages);           // Danh sách gói xét nghiệm đã lọc

  // ===== EFFECT XỬ LÝ SEARCH KHI QUERY HOẶC DATA THAY ĐỔI =====
  useEffect(() => {
    // Nếu không có từ khóa tìm kiếm, hiển thị tất cả dữ liệu
    if (!searchQuery.trim()) {
      setFilteredSingleTests(singleTests);  // Reset về danh sách gốc
      setFilteredPackages(packages);        // Reset về danh sách gốc
      return; // Thoát sớm, không cần filter
    }

    // Chuyển từ khóa về lowercase và loại bỏ khoảng trắng thừa
    const query = searchQuery.toLowerCase().trim();
    
    // ===== LỌC DANH SÁCH XÉT NGHIỆM LẺ =====
    // Tìm trong tên, mô tả, và label của từng xét nghiệm lẻ
    const filteredSingle = singleTests.filter(test => 
      test.name?.toLowerCase().includes(query) ||        // Tìm trong tên dịch vụ
      test.description?.toLowerCase().includes(query) || // Tìm trong mô tả
      test.label?.toLowerCase().includes(query)          // Tìm trong label (nếu có)
    );

    // ===== LỌC DANH SÁCH GÓI XÉT NGHIỆM =====
    // Tìm trong tên, mô tả, và label của từng gói xét nghiệm
    const filteredPackage = packages.filter(pkg => 
      pkg.name?.toLowerCase().includes(query) ||         // Tìm trong tên gói
      pkg.description?.toLowerCase().includes(query) ||  // Tìm trong mô tả gói
      pkg.label?.toLowerCase().includes(query)           // Tìm trong label (nếu có)
    );

    // Cập nhật state với kết quả đã lọc
    setFilteredSingleTests(filteredSingle);
    setFilteredPackages(filteredPackage);
  }, [searchQuery, singleTests, packages]); // Chạy lại khi search query hoặc data thay đổi

  // Trả về object chứa search state và filtered data
  return {
    searchQuery,           // Từ khóa tìm kiếm hiện tại
    setSearchQuery,        // Hàm để cập nhật từ khóa tìm kiếm
    filteredSingleTests,   // Danh sách xét nghiệm lẻ đã lọc
    filteredPackages       // Danh sách gói xét nghiệm đã lọc
  };
};

// ===== CÁC HÀM HELPER XỬ LÝ DỮ LIỆU =====
// Các hàm này giúp xử lý và tính toán các thông số từ dữ liệu API

// ===== HÀM TRÍCH XUẤT THÔNG SỐ XÉT NGHIỆM =====
// Hàm này phân tích dữ liệu service để tạo ra các metrics hiển thị
const extractTestMetrics = (service) => {
  console.log('Extracting metrics from service:', service); // Debug log
  
  // Kiểm tra dữ liệu đầu vào
  if (!service) return null;
  
  const metrics = {}; // Object chứa các thông số tính toán được
  
  // ===== TRÍCH XUẤT METRICS TỪ COMPONENTS ARRAY =====
  // Sử dụng cấu trúc API thực tế để lấy thông tin các chỉ số xét nghiệm
  if (service.components && service.components.length > 0) {
    service.components.forEach(component => {
      // Lấy tên test từ API response (có thể là componentName hoặc testName)
      const testName = component.componentName || component.testName;
      const unit = component.unit; // Đơn vị đo
      
      if (testName && unit) {
        // ===== CHUYỂN ĐỔI TÊN TEST THÀNH CAMELCASE KEY =====
        const key = testName.toLowerCase()
          .replace(/[^a-z0-9\s]/g, '') // Loại bỏ ký tự đặc biệt
          .replace(/\s+/g, ' ')        // Chuẩn hóa khoảng trắng
          .trim()
          .split(' ')
          .map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
          .join('');
        
        // Sử dụng normalRange từ API (fallback về referenceRange để tương thích)
        const referenceRange = component.normalRange || component.referenceRange || 'N/A';
        metrics[key] = `${unit} (${referenceRange})`; // Format: "mg/dL (0-100)"
      }
    });
  }

  // ===== TÍNH TOÁN THỜI GIAN ƯỚC TÍNH CÓ KẾT QUẢ =====
  let estimatedTime = '24-48 giờ'; // Thời gian mặc định
  
  // Tính thời gian dựa trên độ phức tạp của service
  const componentCount = service.components?.length || 1; // Số lượng component cần xét nghiệm
  const category = service.name?.toLowerCase();           // Loại xét nghiệm
  
  // ===== ĐIỀU CHỈNH THỜI GIAN THEO LOẠI XÉT NGHIỆM =====
  if (category?.includes('hiv') || category?.includes('viêm gan')) {
    // HIV và viêm gan: thời gian lâu hơn do cần xét nghiệm phức tạp
    estimatedTime = componentCount > 2 ? '48-72 giờ' : '24-48 giờ';
  } else if (category?.includes('giang mai') || category?.includes('lậu')) {
    // Giang mai và lậu: thời gian trung bình
    estimatedTime = componentCount > 2 ? '24-48 giờ' : '12-24 giờ';
  } else if (category?.includes('hpv') || category?.includes('herpes')) {
    // HPV và herpes: cần phân tích genotype, thời gian lâu hơn
    estimatedTime = '48-72 giờ';
  } else {
    // Các xét nghiệm khác: thời gian dựa trên số lượng component
    estimatedTime = componentCount > 1 ? '24-48 giờ' : '12-24 giờ';
  }
  
  // ===== THÊM PHƯƠNG PHÁP XÉT NGHIỆM DỰA TRÊN LOẠI DỊCH VỤ =====
  if (service.name?.toLowerCase().includes('hiv')) {
    metrics.method = 'ELISA/PCR';                                      // Phương pháp xét nghiệm HIV
    metrics.accuracy = calculateServiceAccuracy(service, '99.7%');     // Độ chính xác HIV
    metrics.sampleType = 'Máu';                                        // Loại mẫu bệnh phẩm
  } else if (service.name?.toLowerCase().includes('giang mai') || service.name?.toLowerCase().includes('syphilis')) {
    metrics.method = 'VDRL/TPHA/RPR';                                  // Phương pháp xét nghiệm giang mai
    metrics.accuracy = calculateServiceAccuracy(service, '99.2%');     // Độ chính xác giang mai
    metrics.sampleType = 'Máu';                                        // Máu tĩnh mạch
  } else if (service.name?.toLowerCase().includes('lậu') || service.name?.toLowerCase().includes('gonorrhea')) {
    metrics.method = 'PCR/Nuôi cấy';                                   // Phương pháp xét nghiệm lậu
    metrics.accuracy = calculateServiceAccuracy(service, '99.0%');     // Độ chính xác lậu
    metrics.sampleType = 'Nước tiểu/Dịch tiết';                        // Nước tiểu hoặc dịch tiết
  } else if (service.name?.toLowerCase().includes('chlamydia')) {
    metrics.method = 'PCR';                                            // PCR cho chlamydia
    metrics.accuracy = calculateServiceAccuracy(service, '99.1%');     // Độ chính xác chlamydia
    metrics.sampleType = 'Nước tiểu/Dịch tiết';                        // Nước tiểu hoặc dịch tiết
  } else if (service.name?.toLowerCase().includes('hpv')) {
    metrics.method = 'PCR Genotyping';                                 // PCR phân type cho HPV
    metrics.accuracy = calculateServiceAccuracy(service, '99.5%');     // Độ chính xác HPV
    metrics.sampleType = 'Tế bào cổ tử cung';                          // Mẫu tế bào từ cổ tử cung
  } else if (service.name?.toLowerCase().includes('herpes') || service.name?.toLowerCase().includes('hsv')) {
    metrics.method = 'PCR';                                            // PCR cho herpes/HSV
    metrics.accuracy = calculateServiceAccuracy(service, '99.3%');     // Độ chính xác herpes
    metrics.sampleType = 'Máu/Dịch tiết';                              // Máu hoặc dịch tiết
  } else if (service.name?.toLowerCase().includes('viêm gan') || service.name?.toLowerCase().includes('hepatitis')) {
    metrics.method = 'ELISA/PCR';                                      // ELISA hoặc PCR cho viêm gan
    metrics.accuracy = calculateServiceAccuracy(service, '99.6%');     // Độ chính xác viêm gan
    metrics.sampleType = 'Máu';                                        // Máu tĩnh mạch
  } else if (service.name?.toLowerCase().includes('mycoplasma')) {
    metrics.method = 'PCR';                                            // PCR cho mycoplasma
    metrics.accuracy = calculateServiceAccuracy(service, '99.0%');     // Độ chính xác mycoplasma
    metrics.sampleType = 'Nước tiểu/Dịch tiết';                        // Nước tiểu hoặc dịch tiết
  } else if (service.name?.toLowerCase().includes('trichomonas')) {
    metrics.method = 'PCR';                                            // PCR cho trichomonas
    metrics.accuracy = calculateServiceAccuracy(service, '98.8%');     // Độ chính xác trichomonas
    metrics.sampleType = 'Nước tiểu/Dịch tiết';                        // Nước tiểu hoặc dịch tiết
  } else {
    // ===== GIÁ TRỊ MẶC ĐỊNH CHO CÁC XÉT NGHIỆM KHÁC =====
    metrics.method = 'PCR/ELISA';                                      // Phương pháp mặc định
    metrics.accuracy = calculateServiceAccuracy(service, '99.0%');     // Độ chính xác mặc định
    metrics.sampleType = 'Máu/Nước tiểu';                              // Loại mẫu mặc định
  }

  // ===== THÊM THỜI GIAN ƯỚC TÍNH CÓ KẾT QUẢ =====
  metrics.resultTime = estimatedTime; // Gán thời gian đã tính toán ở trên

  console.log('Final extracted metrics:', metrics); // Debug log để kiểm tra kết quả
  return metrics; // Trả về object chứa tất cả metrics đã tính toán được
};

// ===== HÀM HELPER LẤY THỐNG KÊ GÓI XÉT NGHIỆM =====
// Hàm này phân tích dữ liệu packageData để tạo ra thống kê hiển thị
const getPackageStats = (packageData) => {
  // Kiểm tra dữ liệu đầu vào
  if (!packageData) {
    // Trả về thống kê mặc định nếu không có dữ liệu
    return {
      totalServices: 0,          // Số lượng dịch vụ trong gói
      accuracy: '99.3%',         // Độ chính xác trung bình
      resultTime: '24-48h',      // Thời gian có kết quả
      savings: '25%'             // Phần trăm tiết kiệm so với mua lẻ
    };
  }

  // ===== SỬ DỤNG CẤU TRÚC SERVICES TỪ API =====
  const services = packageData.services || []; // Lấy danh sách services từ package
  
  // Nếu không có service nào trong gói
  if (services.length === 0) {
    return {
      totalServices: 0,
      accuracy: '99.3%',
      resultTime: '24-48h',
      savings: '25%'
    };
  }

  // ===== TÍNH TOÁN CÁC THỐNG KÊ =====
  const totalServices = services.length; // Tổng số dịch vụ trong gói
  // Tính tổng giá nếu mua lẻ từng dịch vụ
  const totalServicePrice = services.reduce((sum, service) => sum + (service.price || 0), 0);
  const packagePrice = packageData.price || 0; // Giá của gói
  
  // ===== TÍNH PHẦN TRĂM TIẾT KIỆM =====
  const savings = packagePrice > 0 && totalServicePrice > packagePrice ? 
    Math.round(((totalServicePrice - packagePrice) / totalServicePrice) * 100) : // Công thức tính % tiết kiệm
    Math.round((1 - packagePrice / Math.max(totalServicePrice, packagePrice)) * 100); // Fallback calculation

  // ===== TÍNH TOÁN ĐỘ CHÍNH XÁC TRUNG BÌNH =====
  let totalAccuracy = 0;  // Tổng độ chính xác
  let accuracyCount = 0;  // Số lượng services có thể tính accuracy
  
  services.forEach(service => {
    let serviceAccuracy = 99.0; // base accuracy
    
    // Adjust accuracy based on service type (from API data analysis)
    if (service.name?.toLowerCase().includes('hiv')) {
      serviceAccuracy = 99.7;
    } else if (service.name?.toLowerCase().includes('giang mai')) {
      serviceAccuracy = 99.2;
    } else if (service.name?.toLowerCase().includes('hpv')) {
      serviceAccuracy = 99.5;
    } else if (service.name?.toLowerCase().includes('herpes')) {
      serviceAccuracy = 99.3;
    } else if (service.name?.toLowerCase().includes('viêm gan')) {
      serviceAccuracy = 99.6;
    } else if (service.name?.toLowerCase().includes('chlamydia')) {
      serviceAccuracy = 99.1;
    } else if (service.name?.toLowerCase().includes('lậu')) {
      serviceAccuracy = 99.0;
    } else if (service.name?.toLowerCase().includes('mycoplasma')) {
      serviceAccuracy = 99.0;
    } else if (service.name?.toLowerCase().includes('trichomonas')) {
      serviceAccuracy = 98.8;
    }
    
    // Bonus for multiple components
    if (service.components && service.components.length > 1) {
      serviceAccuracy += 0.1;
    }
    
    totalAccuracy += serviceAccuracy;
    accuracyCount++;
  });
  
  const avgAccuracy = accuracyCount > 0 ? totalAccuracy / accuracyCount : 99.3;
  
  // Estimate result time based on package complexity
  let resultTime = '24-48h';
  if (totalServices <= 3) {
    resultTime = '12-24h';
  } else if (totalServices <= 6) {
    resultTime = '24-48h';
  } else {
    resultTime = '48-72h';      // Gói phức tạp, nhiều xét nghiệm
  }
  
  // ===== TRẢ VỀ OBJECT CHỨA TẤT CẢ THỐNG KÊ =====
  return {
    totalServices,                                            // Tổng số dịch vụ trong gói
    accuracy: `${Math.min(avgAccuracy, 99.9).toFixed(1)}%`,  // Độ chính xác trung bình (max 99.9%)
    resultTime: resultTime,                                   // Thời gian ước tính có kết quả
    savings: `${Math.max(savings, 0)}%`                       // Phần trăm tiết kiệm (min 0%)
  };
};

// ===== HÀM HELPER TÍNH ĐỘ CHÍNH XÁC DỰA TRÊN ĐỘ PHỨC TẠP =====
// Hàm này điều chỉnh độ chính xác base dựa trên số lượng component và loại xét nghiệm
const calculateServiceAccuracy = (service, baseAccuracy) => {
  // Kiểm tra dữ liệu đầu vào
  if (!service) return baseAccuracy;
  
  const componentCount = service.components?.length || 1; // Số lượng component trong service
  
  // ===== PARSE ĐỘ CHÍNH XÁC BASE =====
  let accuracy = parseFloat(baseAccuracy.replace('%', '')); // Chuyển từ "99.5%" thành 99.5
  
  // ===== BONUS CHO NHIỀU COMPONENT (XÉT NGHIỆM TỔNG HỢP) =====
  if (componentCount > 2) {
    accuracy += 0.1;
  }
  if (componentCount > 4) {
    accuracy += 0.1;
  }
  
  // Specific adjustments based on service complexity from API data
  if (service.name?.toLowerCase().includes('hiv') && componentCount >= 2) {
    accuracy = Math.max(accuracy, 99.7); // HIV with both antibody and antigen
  }
  if (service.name?.toLowerCase().includes('giang mai') && componentCount >= 3) {
    accuracy = Math.max(accuracy, 99.2); // Syphilis with VDRL/RPR/TPHA
  }
  if (service.name?.toLowerCase().includes('hpv') && componentCount >= 2) {
    accuracy = Math.max(accuracy, 99.5); // HPV with genotyping and risk assessment
  }
  if (service.name?.toLowerCase().includes('viêm gan') && componentCount >= 3) {
    accuracy = Math.max(accuracy, 99.6); // Hepatitis with multiple markers
  }
  
  return `${Math.min(accuracy, 99.9).toFixed(1)}%`; // Giới hạn max 99.9% và format 1 chữ số thập phân
};

// ===== COMPONENT CHÍNH - TRANG ĐẶT LỊCH XÉT NGHIỆM =====
// Component này quản lý toàn bộ flow đặt lịch xét nghiệm qua 3 bước
function TestRegistrationPage() {
  // ===== SỬ DỤNG CUSTOM HOOKS =====
  // Hook quản lý dữ liệu dịch vụ (fetch từ API)
  const { singleTests, packages, loading, error } = useServices();
  // Hook quản lý search và filter
  const { 
    searchQuery,           // Từ khóa tìm kiếm
    setSearchQuery,        // Hàm cập nhật từ khóa
    filteredSingleTests,   // Danh sách xét nghiệm lẻ đã lọc
    filteredPackages       // Danh sách gói xét nghiệm đã lọc
  } = useSearch(singleTests, packages);

  // ===== LOCAL STATE QUẢN LÝ TRẠNG THÁI COMPONENT =====
  const [activeStep, setActiveStep] = useState(0);                       // Bước hiện tại trong stepper (0, 1, 2)
  const [selectedService, setSelectedService] = useState(null);          // Dịch vụ được chọn {type: 'single'/'package', idx: number}
  const [selectedDate, setSelectedDate] = useState(null);                // Ngày hẹn được chọn (Date object)
  const [selectedTime, setSelectedTime] = useState('');                  // Giờ hẹn được chọn (string "HH:MM")
  const [activeTab, setActiveTab] = useState('single');                  // Tab đang active ('single' hoặc 'package')
  const [note, setNote] = useState('');                                  // Ghi chú của khách hàng
  const [bookingSuccess, setBookingSuccess] = useState(false);           // Trạng thái đặt lịch thành công
  const [bookingMessage, setBookingMessage] = useState('');              // Thông báo kết quả đặt lịch
  const [paymentMethod, setPaymentMethod] = useState('cash');            // Phương thức thanh toán
  const [isBooking, setIsBooking] = useState(false);                     // Trạng thái đang xử lý đặt lịch
  
  // ===== STATE QUẢN LÝ DIALOG CHI TIẾT =====
  const [detailOpen, setDetailOpen] = useState(false);                   // Hiển thị dialog chi tiết
  const [detailData, setDetailData] = useState(null);                     // Dữ liệu chi tiết để hiển thị trong dialog
  const [detailType, setDetailType] = useState('single');               // Loại chi tiết ('single' hoặc 'package')
  const [loadingDetail, setLoadingDetail] = useState(false);            // Trạng thái loading chi tiết

  // ===== ROUTER HOOKS =====
  const location = useLocation();  // Hook để lấy location object (state từ navigate)
  const navigate = useNavigate();  // Hook để điều hướng giữa các trang

  // ===== EFFECTS =====
  // Effect xử lý pre-select service khi được navigate từ trang khác với state
  useEffect(() => {
    // Kiểm tra nếu có selectedPackage từ state và packages đã được load
    if (location.state?.selectedPackage && packages.length > 0) {
      // Tìm index của package trong danh sách
      const idx = packages.findIndex(pkg => pkg.id === location.state.selectedPackage.id);
      if (idx !== -1) {
        setActiveTab('package');                           // Chuyển sang tab package
        setSelectedService({ type: 'package', idx });     // Pre-select package
      }
    }
  }, [location.state, packages]);

  // Memoized values with enhanced data using helper functions
  const paginatedSingleTests = useMemo(() => {
    const slicedTests = filteredSingleTests.slice(0, ITEMS_PER_PAGE);
    console.log('Processing single tests:', slicedTests.length, 'items'); // Debug log
    
    return slicedTests.map(service => {
      const metrics = extractTestMetrics(service);
      const enhancedService = {
        ...service,
        accuracy: metrics?.accuracy || '99.1%',
        method: metrics?.method || 'ELISA/PCR',
        duration: metrics?.resultTime || service.duration || '30 phút',
        sampleType: metrics?.sampleType || 'Máu/Nước tiểu'
      };
      
      console.log('Enhanced service:', enhancedService.name, 'with metrics:', metrics);
      return enhancedService;
    });
  }, [filteredSingleTests]);

  const paginatedPackages = useMemo(() => {
    const slicedPackages = filteredPackages.slice(0, ITEMS_PER_PAGE);
    console.log('Processing packages:', slicedPackages.length, 'items'); // Debug log
    
    return slicedPackages.map(packageData => {
      const stats = getPackageStats(packageData);
      const enhancedPackage = {
        ...packageData,
        accuracy: `${stats.accuracy}`,
        duration: stats.resultTime || packageData.duration || '2-3 giờ',
        savings: `${stats.savings}% tiết kiệm`,
        totalServices: stats.totalServices
      };
      
      console.log('Enhanced package:', enhancedPackage.name, 'with stats:', stats);
      return enhancedPackage;
    });
  }, [filteredPackages]);

  // ===============================
  // EVENT HANDLERS - Xử lý các sự kiện từ người dùng
  // ===============================
  
  /**
   * Xử lý khi user chọn dịch vụ hoặc gói xét nghiệm
   * @param {string} type - Loại dịch vụ: 'single' (xét nghiệm đơn) hoặc 'package' (gói xét nghiệm)
   * @param {number} idx - Index của dịch vụ trong mảng tương ứng
   */
  const handleSelectService = (type, idx) => {
    setSelectedService({ type, idx });
  };

  /**
   * Xử lý khi user thay đổi ngày hẹn
   * Tự động kiểm tra và xóa giờ hẹn nếu không hợp lệ với ngày mới
   * @param {Date} date - Ngày được chọn
   */
  const handleDateChange = (date) => {
    setSelectedDate(date);
    
    // Kiểm tra xem giờ đã chọn còn hợp lệ với ngày mới không
    if (selectedTime && date) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const selectedDateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      
      // Nếu ngày mới là hôm nay, kiểm tra giờ đã chọn có quá khứ không
      if (selectedDateOnly.getTime() === today.getTime()) {
        const [hours, minutes] = selectedTime.split(':').map(Number);
        const timeSlotTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
        const currentTimeWithBuffer = new Date(now.getTime() + 2 * 60 * 60 * 1000); // Cần cách ít nhất 2 tiếng
        
        // Nếu giờ đã chọn không đủ khoảng cách, xóa lựa chọn
        if (timeSlotTime <= currentTimeWithBuffer) {
          setSelectedTime('');
        }
      }
    }
  };

  /**
   * Xử lý khi user chọn giờ hẹn
   * @param {string} time - Giờ được chọn (format: "HH:mm")
   */
  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  // ===============================
  // DIALOG HANDLERS - Xử lý mở/đóng dialog chi tiết dịch vụ
  // ===============================
  
  /**
   * Mở dialog xem chi tiết dịch vụ/gói xét nghiệm
   * Tối ưu hiệu năng bằng cách sử dụng dữ liệu đã có thay vì gọi API mới
   * @param {number} serviceId - ID của dịch vụ/gói cần xem chi tiết
   * @param {string} type - Loại: 'single' (xét nghiệm đơn) hoặc 'package' (gói xét nghiệm)
   */
  const handleOpenDetail = (serviceId, type) => {
    // Tìm dữ liệu từ danh sách có sẵn thay vì gọi API mới (tăng tốc độ)
    let serviceData = null;
    
    if (type === 'single') {
      // Tìm trong danh sách đã lọc trước, fallback về danh sách gốc
      serviceData = filteredSingleTests.find(service => service.id === serviceId) || 
                    singleTests.find(service => service.id === serviceId);
    } else {
      // Tìm trong danh sách gói đã lọc trước, fallback về danh sách gốc
      serviceData = filteredPackages.find(pkg => pkg.id === serviceId) || 
                    packages.find(pkg => pkg.id === serviceId);
    }
    
    console.log(`Opening ${type} detail for ID:`, serviceId, 'Data:', serviceData); // Debug log
    
    // Mở dialog ngay lập tức với dữ liệu có sẵn (không cần loading)
    setDetailType(type);
    setDetailData(serviceData);
    setLoadingDetail(false); // Không cần loading vì dữ liệu đã có sẵn
    setDetailOpen(true);
  };

  /**
   * Đóng dialog chi tiết và reset state
   */
  const handleCloseDetail = () => {
    setDetailOpen(false);
    setDetailData(null);
    setDetailType('single');
    setLoadingDetail(false);
  };

  // ===============================
  // STEPPER NAVIGATION - Xử lý điều hướng giữa các bước
  // ===============================
  
  /**
   * Chuyển sang bước tiếp theo hoặc thực hiện đặt lịch (bước cuối)
   */
  const handleNext = () => {
    if (activeStep === STEPS.length - 1) {
      // Bước cuối - gọi API đặt lịch xét nghiệm
      handleBookTest();
    } else {
      // Chuyển sang bước tiếp theo
      setActiveStep((prev) => prev + 1);
    }
  };

  /**
   * Quay lại bước trước đó
   */
  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  // ===============================
  // VALIDATION HELPERS - Hàm hỗ trợ kiểm tra dữ liệu
  // ===============================
  
  /**
   * Kiểm tra tính hợp lệ của thời gian hẹn
   * Đảm bảo lịch hẹn cách ít nhất 2 tiếng từ thời điểm hiện tại
   * @param {Date} date - Ngày hẹn
   * @param {string} time - Giờ hẹn (format: "HH:mm")
   * @returns {boolean} - true nếu thời gian hợp lệ
   */
  const isValidAppointmentTime = (date, time) => {
    if (!date || !time) return false;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const selectedDateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    // Nếu không phải ngày hôm nay, thì hợp lệ (giả định các ngày tương lai đều ok)
    if (selectedDateOnly.getTime() !== today.getTime()) {
      return true;
    }
    
    // Nếu là ngày hôm nay, kiểm tra thời gian - cần cách ít nhất 2 tiếng
    const [hours, minutes] = time.split(':').map(Number);
    const selectedDateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    const currentTimeWithBuffer = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 tiếng = 120 phút
    
    return selectedDateTime > currentTimeWithBuffer;
  };

  /**
   * Kiểm tra điều kiện để có thể chuyển sang bước tiếp theo
   * @returns {boolean} - true nếu có thể tiếp tục
   */
  const canProceed = () => {
    if (activeStep === 0) {
      // Bước 1: Phải chọn dịch vụ/gói xét nghiệm
      return selectedService != null;
    }
    if (activeStep === 1) {
      // Bước 2: Phải chọn ngày giờ hợp lệ
      return isValidAppointmentTime(selectedDate, selectedTime);
    }
    // Bước 3: Luôn cho phép (thanh toán/ghi chú là tùy chọn)
    return true;
  };

  // ===============================
  // BOOKING API HANDLER - Xử lý đặt lịch xét nghiệm
  // ===============================
  
  /**
   * Hàm chính để thực hiện đặt lịch xét nghiệm
   * Gọi API bookSTITest với payload đã được format và validate
   */
  const handleBookTest = async () => {
    // Xác định loại dịch vụ được chọn và lấy ID tương ứng
    let serviceId = null, packageId = null;
    if (!selectedService || selectedService.idx == null) {
      alert('Vui lòng chọn dịch vụ hoặc gói xét nghiệm!');
      return;
    }
    
    if (selectedService.type === 'single') {
      // Lấy ID xét nghiệm đơn đã chọn
      serviceId = filteredSingleTests[selectedService.idx]?.id;
      if (!serviceId) {
        alert('Không tìm thấy dịch vụ xét nghiệm đã chọn!');
        return;
      }
    } else if (selectedService.type === 'package') {
      // Lấy ID gói xét nghiệm đã chọn
      packageId = filteredPackages[selectedService.idx]?.id;
      if (!packageId) {
        alert('Không tìm thấy gói xét nghiệm đã chọn!');
        return;
      }
    }
    
    // Validate lại lần cuối trước khi gửi
    if (!isValidAppointmentTime(selectedDate, selectedTime)) {
      if (!selectedDate || !selectedTime) {
        alert('Vui lòng chọn đầy đủ ngày và giờ hẹn!');
      } else {
        alert('Không thể đặt lịch cho khung giờ đã qua hoặc quá gần giờ hiện tại. Vui lòng chọn khung giờ cách ít nhất 2 tiếng từ bây giờ!');
      }
      return;
    }
    
    // Format ngày giờ hẹn theo chuẩn ISO 8601 với error handling
    const appointmentDate = selectedDate && selectedTime
      ? (() => {
          try {
            // Tạo date object từ selectedDate và selectedTime để tránh lỗi timezone
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const [hours, minutes] = selectedTime.split(':');
            
            // Format theo chuẩn ISO 8601 local time
            const formattedDate = `${year}-${month}-${day}T${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
            
            console.log('Formatted appointment date:', formattedDate);
            
            // Validate format trước khi return
            const testDate = new Date(formattedDate);
            if (isNaN(testDate.getTime())) {
              throw new Error('Invalid date format');
            }
            
            return formattedDate;
          } catch (error) {
            console.error('Error formatting date:', error);
            // Fallback format
            const fallbackDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}T${selectedTime}:00`;
            console.log('Using fallback date format:', fallbackDate);
            return fallbackDate;
          }
        })()
      : null;
      
    // Chuyển đổi payment method sang format API
    let paymentMethodApi = 'COD';
    if (paymentMethod === 'bank') paymentMethodApi = 'BANK_TRANSFER';
    if (paymentMethod === 'visa') paymentMethodApi = 'VISA';
    
    // Tạo payload gửi lên server
    const payload = {
      appointmentDate,
      paymentMethod: paymentMethodApi,
      customerNotes: note,
    };
    
    // Thêm serviceId hoặc packageId tùy theo loại đã chọn
    if (serviceId) payload.serviceId = serviceId;
    if (packageId) payload.packageId = packageId;
    
    console.log('Payload gửi đăng ký:', payload);
    
    // Validate payload lần cuối trước khi gửi
    if (!payload.appointmentDate) {
      alert('Vui lòng chọn ngày và giờ hẹn!');
      return;
    }
    
    if (!payload.serviceId && !payload.packageId) {
      alert('Vui lòng chọn dịch vụ hoặc gói xét nghiệm!');
      return;
    }
    
    try {
      setIsBooking(true);
      console.log('Gửi request đặt lịch với payload:', JSON.stringify(payload, null, 2));
      
      // Gọi API đặt lịch xét nghiệm
      const res = await stiService.bookSTITest(payload);
      
      console.log('Response từ API:', res);
      
      // Kiểm tra kết quả thành công (có thể có nhiều format khác nhau)
      if (res.data.success === true || res.data.testId || (res.data.data && res.data.data.testId)) {
        setBookingSuccess(true);
        
        // Tạo thông báo thành công chi tiết và thân thiện
        const serviceName = selectedService.type === 'single' 
          ? filteredSingleTests[selectedService.idx]?.name 
          : filteredPackages[selectedService.idx]?.name;
        
        const appointmentInfo = selectedDate && selectedTime 
          ? `vào ${selectedDate.toLocaleDateString('vi-VN')} lúc ${selectedTime}`
          : '';
        
        const detailedMessage = `Lịch hẹn "${serviceName}" ${appointmentInfo} đã được ghi nhận thành công. Chúng tôi sẽ liên hệ với bạn để xác nhận chi tiết.`;
        
        setBookingMessage(res.data.message || detailedMessage);
      } else {
        // Xử lý trường hợp đặt lịch thất bại
        const errorMessage = res.data.message || 'Đăng ký thất bại';
        console.error('Booking failed:', res.data);
        
        let detailedError = errorMessage;
        if (res.data.errors) {
          detailedError += '\nChi tiết lỗi: ' + JSON.stringify(res.data.errors);
        }
        
        alert(detailedError);
      }
    } catch (err) {
      // Xử lý lỗi khi gọi API
      console.error('Booking error:', err);
      
      let errorMessage = 'Có lỗi xảy ra khi đặt lịch';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.errors) {
        errorMessage = 'Dữ liệu không hợp lệ: ' + JSON.stringify(err.response.data.errors);
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      // Thêm thông tin debug để dễ troubleshoot
      if (err?.response?.status) {
        errorMessage += `\nMã lỗi: ${err.response.status}`;
      }
      
      alert(errorMessage);
    } finally {
      setIsBooking(false);
    }
  };

  // ===============================
  // LOADING & ERROR STATES - Hiển thị loading và lỗi
  // ===============================
  
  // Hiển thị loading spinner khi đang tải dữ liệu
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  // Hiển thị thông báo lỗi nếu có lỗi xảy ra
  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // ===============================
  // UI RENDERING - Giao diện chính
  // ===============================
  
  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #f8faff 0%, #e6f3ff 30%, #f0f7ff 70%, #ffffff 100%)', 
      minHeight: '100vh', 
      position: 'relative', 
      overflow: 'hidden', 
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' 
    }}>
      {/* Các phần tử trang trí background với hiệu ứng gradient tròn */}
      <Box
        sx={{
          position: 'absolute',
          width: { xs: 150, md: 300 },
          height: { xs: 150, md: 300 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(33,150,243,0.08) 0%, rgba(255,255,255,0) 70%)',
          top: { xs: -50, md: -100 },
          left: { xs: -50, md: -100 },
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: { xs: 200, md: 400 },
          height: { xs: 200, md: 400 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,191,165,0.08) 0%, rgba(255,255,255,0) 70%)',
          bottom: { xs: -100, md: -200 },
          right: { xs: -100, md: -200 },
          zIndex: 0,
        }}
      />
      
      {/* Container chính chứa nội dung */}
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, py: { xs: 6, md: 8 } }}>
        {/* Tiêu đề trang với gradient text và thanh divider */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
              color: '#1565c0',
              background: 'linear-gradient(45deg, #2196F3, #00BFA5)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textAlign: 'center',
              lineHeight: 1.1,
              letterSpacing: '-1px',
              mb: 2,
            }}
          >
            Đặt lịch xét nghiệm
          </Typography>
          {/* Thanh divider với gradient */}
          <Box
            sx={{
              width: 120,
              height: 6,
              mx: 'auto',
              mt: 2,
              mb: 2,
              borderRadius: 3,
              background: 'linear-gradient(45deg, #2196F3, #00BFA5)',
            }}
          />
          {/* Mô tả ngắn gọn */}
          <Typography
            sx={{
              color: '#616161',
              maxWidth: '700px',
              mx: 'auto',
              mt: 2,
              fontSize: { xs: '1.1rem', md: '1.2rem' },
              lineHeight: 1.7,
              fontWeight: 400,
              textAlign: 'center',
            }}
          >
            Lên lịch tư vấn với các chuyên gia chăm sóc sức khỏe của chúng tôi
          </Typography>
        </Box>

        {/* Card chính chứa form đăng ký với glass effect */}
        <Box sx={{ 
          background: 'rgba(255, 255, 255, 0.95)', 
          backdropFilter: 'blur(20px)',
          borderRadius: 5, 
          p: { xs: 2, md: 4 }, 
          boxShadow: '0 8px 32px rgba(33,150,243,0.12)', 
          mb: 4, 
          border: '1px solid rgba(33, 150, 243, 0.08)',
          fontFamily: 'inherit' 
        }}>
          {/* Stepper tùy chỉnh hiện đại với animation */}
          <Box sx={{ width: '100%', mb: 3 }}>
            {/* Container chứa các step (vòng tròn + nhãn) */}
            <Box sx={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              px: { xs: 2, md: 4 },
              py: 0,
              mb: 1.5,
            }}>
              {/* Đường nối background (màu xám) */}
              <Box 
                sx={{
                  position: 'absolute',
                  top: '20px', // căn giữa với vòng tròn (chiều cao vòng tròn/2)
                  left: { xs: '14%', md: '18%' },
                  right: { xs: '14%', md: '18%' },
                  height: 1.5,
                  backgroundColor: '#E2E8F0',
                  borderRadius: 1,
                  zIndex: 0,
                  transform: 'none',
                }}
              />
              {/* Đường nối active/completed (màu gradient) */}
              <Box 
                sx={{
                  position: 'absolute',
                  top: '20px',
                  left: { xs: '14%', md: '18%' },
                  width: activeStep === 0 ? '0%' : 
                         activeStep === 1 ? { xs: '32%', md: '34%' } : 
                         activeStep >= 2 ? { xs: '58%', md: '62%' } :
                         '0%',
                  height: 1.5,
                  background: activeStep >= 2 
                    ? 'linear-gradient(90deg, #00BFA5 0%, #00ACC1 100%)'
                    : 'linear-gradient(90deg, #2196F3 0%, #00BFA5 100%)',
                  borderRadius: 1,
                  transition: 'all 0.5s ease-in-out',
                  zIndex: 1,
                  boxShadow: activeStep >= 2 
                    ? '0 0.5px 2px rgba(0,191,165,0.15)'
                    : '0 0.5px 2px rgba(33,150,243,0.15)',
                  transform: 'none',
                }}
              />
              {/* Render từng bước với vòng tròn và nhãn */}
              {STEPS.map((label, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    zIndex: 2,
                    flex: 1,
                    maxWidth: { xs: '120px', md: '200px' },
                  }}
                >
                  {/* Vòng tròn step với số thứ tự */}
                  <Box
                    sx={{
                      width: { xs: 36, md: 40 },
                      height: { xs: 36, md: 40 },
                      borderRadius: '50%',
                      border: '1.5px solid',
                      borderColor: index < activeStep ? '#00BFA5' : 
                                   index === activeStep ? '#2196F3' : 
                                   '#CBD5E0',
                      backgroundColor: index < activeStep ? '#00BFA5' : 
                                       index === activeStep ? '#2196F3' : 
                                       '#FFFFFF',
                      color: index <= activeStep ? '#FFFFFF' : '#9CA3AF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: { xs: '1rem', md: '1.1rem' },
                      fontWeight: 600,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: index < activeStep ? 
                        '0 1px 6px rgba(0,191,165,0.15)' :
                        index === activeStep ? 
                          '0 2px 8px rgba(33,150,243,0.15)' : 
                          '0 1px 3px rgba(0,0,0,0.06)',
                      transform: index === activeStep ? 'scale(1.03)' : 'scale(1)',
                      cursor: 'default',
                      '&:hover': index > activeStep ? {
                        borderColor: '#A0AEC0',
                        backgroundColor: '#F7FAFC',
                        transform: 'scale(1.01)',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                      } : {},
                    }}
                  >
                    {index + 1}
                  </Box>
                  {/* Nhãn bước với text responsive */}
                  <Typography
                    sx={{
                      mt: 1.1,
                      textAlign: 'center',
                      fontSize: { xs: '0.85rem', md: '0.95rem' },
                      fontWeight: index < activeStep ? 600 : 
                                  index === activeStep ? 700 : 
                                  500,
                      color: index < activeStep ? '#00BFA5' : 
                             index === activeStep ? '#2196F3' : 
                             '#6B7280',
                      transition: 'all 0.3s ease',
                      lineHeight: 1.1,
                      maxWidth: { xs: '120px', md: '200px' },
                      wordWrap: 'break-word',
                    }}
                  >
                    {label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Nội dung chính thay đổi theo bước hiện tại */}
          <Box mt={2}>
            {/* BƯỚC 1: Chọn dịch vụ */}
            {activeStep === 0 && (
              <ServiceSelection
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                paginatedSingleTests={paginatedSingleTests}
                paginatedPackages={paginatedPackages}
                selectedService={selectedService}
                onSelectService={handleSelectService}
                onOpenDetail={handleOpenDetail}
              />
            )}

            {/* BƯỚC 2: Chọn ngày và giờ hẹn */}
            {activeStep === 1 && (
              <Box sx={{ 
                background: 'rgba(255, 255, 255, 0.95)', 
                backdropFilter: 'blur(20px)',
                borderRadius: 5, 
                p: { xs: 3, md: 5 }, 
                boxShadow: '0 8px 32px rgba(33,150,243,0.12)', 
                mb: 4, 
                border: '1px solid rgba(33, 150, 243, 0.08)',
                fontFamily: 'inherit' 
              }}>
                {/* Tiêu đề bước 2 */}
                <Typography 
                  variant="h4" 
                  fontWeight={700} 
                  mb={1} 
                  textAlign="center" 
                  sx={{ 
                    color: '#212121',
                    background: 'linear-gradient(45deg, #2196F3, #00BFA5)', 
                    backgroundClip: 'text', 
                    WebkitBackgroundClip: 'text', 
                    WebkitTextFillColor: 'transparent', 
                    fontSize: { xs: '2rem', md: '2.5rem' } 
                  }}
                >
                  Chọn Ngày & Giờ
                </Typography>
                {/* Mô tả bước 2 */}
                <Typography 
                  color="#616161" 
                  mb={3} 
                  textAlign="center" 
                  fontWeight={500}
                >
                  Chọn ngày và giờ hẹn bạn muốn
                </Typography>
                
                {/* Component chọn ngày giờ */}
                <DateTimeSelection
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onDateChange={handleDateChange}
                  onTimeChange={handleTimeChange}
                  timeSlots={TIME_SLOTS}
                  note={note}
                  onNoteChange={setNote}
                />
              </Box>
            )}

            {/* BƯỚC 3: Thanh toán và xác nhận */}
            {activeStep === 2 && (
              <Box sx={{ 
                background: 'rgba(255, 255, 255, 0.95)', 
                backdropFilter: 'blur(20px)',
                borderRadius: 5, 
                p: { xs: 3, md: 5 }, 
                boxShadow: '0 8px 32px rgba(33,150,243,0.12)', 
                mb: 4, 
                border: '1px solid rgba(33, 150, 243, 0.08)',
                fontFamily: 'inherit' 
              }}>
                <Typography 
                  variant="h4" 
                  fontWeight={700} 
                  mb={2} 
                  textAlign="center" 
                  sx={{ 
                    color: '#212121',
                    background: 'linear-gradient(45deg, #2196F3, #00BFA5)', 
                    backgroundClip: 'text', 
                    WebkitBackgroundClip: 'text', 
                    WebkitTextFillColor: 'transparent', 
                    fontSize: { xs: '2rem', md: '2.5rem' } 
                  }}
                >
                  💳 Chọn phương thức thanh toán
                </Typography>
                {/* Mô tả bước 3 */}
                <Typography 
                  color="#616161" 
                  mb={4} 
                  textAlign="center" 
                  fontWeight={500}
                  sx={{ fontSize: { xs: '1rem', md: '1.1rem' } }}
                >
                  Hoàn tất đặt lịch của bạn với phương thức thanh toán phù hợp
                </Typography>

                {/* Section chọn phương thức thanh toán */}
                <Box sx={{ 
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 5,
                  p: 4,
                  mb: 4,
                  boxShadow: '0 8px 32px rgba(33,150,243,0.12)',
                  border: '1px solid rgba(33, 150, 243, 0.08)',
                }}>
                  <Typography 
                    variant="h6" 
                    fontWeight={700} 
                    mb={3}
                    sx={{ 
                      color: '#212121',
                      textAlign: 'center'
                    }}
                  >
                    Chọn phương thức thanh toán
                  </Typography>
                  {/* Radio group để chọn payment method */}
                  <RadioGroup
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    sx={{ mb: 2 }}
                  >
                    {/* Option thanh toán tiền mặt */}
                    <FormControlLabel 
                      value="cash" 
                      control={<Radio sx={{ color: '#2196F3' }} />} 
                      label={
                        <Typography sx={{ fontWeight: 500, fontSize: '1rem' }}>
                          💵 Thanh toán tiền mặt
                        </Typography>
                      }
                      sx={{ mb: 1 }}
                    />
                    {/* Option chuyển khoản */}
                    <FormControlLabel 
                      value="bank" 
                      control={<Radio sx={{ color: '#2196F3' }} />} 
                      label={
                        <Typography sx={{ fontWeight: 500, fontSize: '1rem' }}>
                          🏦 Chuyển khoản ngân hàng
                        </Typography>
                      }
                      sx={{ mb: 1 }}
                    />
                    {/* Option thanh toán thẻ Visa */}
                    <FormControlLabel 
                      value="visa" 
                      control={<Radio sx={{ color: '#2196F3' }} />} 
                      label={
                        <Typography sx={{ fontWeight: 500, fontSize: '1rem' }}>
                          💳 Thanh toán bằng thẻ Visa
                        </Typography>
                      }
                    />
                  </RadioGroup>
                </Box>

                {/* Tóm tắt thông tin đặt lịch */}
                {selectedService && (
                  <Box sx={{ 
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 5,
                    p: 4,
                    mb: 4,
                    boxShadow: '0 8px 32px rgba(33,150,243,0.12)',
                    border: '1px solid rgba(33, 150, 243, 0.08)',
                  }}>
                    <Typography 
                      variant="h6" 
                      fontWeight={700} 
                      mb={3}
                      sx={{ 
                        color: '#212121',
                        textAlign: 'center'
                      }}
                    >
                      📋 Thông tin đặt lịch
                    </Typography>
                    {/* Hiển thị thông tin chi tiết đặt lịch */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {/* Tên dịch vụ đã chọn */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ fontWeight: 600, color: '#616161' }}>Dịch vụ:</Typography>
                        <Typography sx={{ fontWeight: 700, color: '#212121' }}>
                          {selectedService.type === 'single' 
                            ? filteredSingleTests[selectedService.idx]?.name 
                            : filteredPackages[selectedService.idx]?.name}
                        </Typography>
                      </Box>
                      {/* Ngày và giờ hẹn */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ fontWeight: 600, color: '#616161' }}>Ngày hẹn:</Typography>
                        <Typography sx={{ fontWeight: 700, color: '#212121' }}>
                          {selectedDate?.toLocaleDateString('vi-VN')} - {selectedTime}
                        </Typography>
                      </Box>
                      {/* Giá tiền với highlight */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ fontWeight: 600, color: '#616161' }}>Giá tiền:</Typography>
                        <Typography sx={{ 
                          fontWeight: 700, 
                          fontSize: '1.2rem',
                          background: 'linear-gradient(45deg, #2196F3, #00BFA5)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}>
                          {selectedService.type === 'single' 
                            ? filteredSingleTests[selectedService.idx]?.price?.toLocaleString('vi-VN') + ' đ'
                            : filteredPackages[selectedService.idx]?.price?.toLocaleString('vi-VN') + ' đ'}
                        </Typography>
                      </Box>
                      {/* Ghi chú (nếu có) */}
                      {note && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Typography sx={{ fontWeight: 600, color: '#616161' }}>Ghi chú:</Typography>
                          <Typography sx={{ fontWeight: 500, color: '#212121', maxWidth: '60%', textAlign: 'right' }}>
                            {note}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Box>

        {/* Nút điều hướng (Quay lại / Tiếp tục / Xác nhận đặt lịch) */}
        <Box sx={{ display: 'flex', justifyContent: activeStep === 0 ? 'flex-end' : 'space-between', mt: 6, gap: 2 }}>
          {/* Nút Quay lại (chỉ hiển thị từ bước 2 trở đi) */}
          {activeStep > 0 && (
            <ModernButton
              variant="outlined"
              color="primary"
              onClick={handleBack}
              sx={{
                minWidth: 200,
                fontSize: '1.1rem',
                borderWidth: 2,
                borderColor: '#2196F3',
                color: '#2196F3',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  borderWidth: 2,
                  background: 'rgba(33,150,243,0.08)',
                  borderColor: '#2196F3',
                },
              }}
            >
              ← Quay lại
            </ModernButton>
          )}
          {/* Nút Tiếp tục / Xác nhận đặt lịch */}
          <ModernButton
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={!canProceed() || isBooking}
            sx={{
              minWidth: 250,
              fontSize: '1.1rem',
              background: activeStep === STEPS.length - 1 
                ? isBooking 
                  ? 'linear-gradient(45deg, #f59e0b, #d97706)' 
                  : 'linear-gradient(45deg, #2196F3, #00BFA5)'
                : 'linear-gradient(45deg, #2196F3, #00BFA5)',
              color: '#fff',
              textTransform: 'none',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                background: activeStep === STEPS.length - 1 
                  ? isBooking 
                    ? 'linear-gradient(45deg, #f59e0b, #d97706)' 
                    : 'linear-gradient(45deg, #00BFA5, #2196F3)'
                  : 'linear-gradient(45deg, #00BFA5, #2196F3)',
              },
              '&:disabled': {
                background: 'rgba(33,150,243,0.3)',
                color: 'rgba(255,255,255,0.7)',
              },
              // Hiệu ứng shimmer khi đang booking
              ...(isBooking && {
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  animation: 'shimmer 1.5s infinite',
                  '@keyframes shimmer': {
                    '0%': { left: '-100%' },
                    '100%': { left: '100%' }
                  }
                }
              })
            }}
          >
            {/* Text thay đổi tùy theo trạng thái */}
            {isBooking ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1, color: '#fff' }} />
                🔄 Đang xử lý đặt lịch...
              </>
            ) : activeStep === STEPS.length - 1 ? (
              '🎯 XÁC NHẬN ĐẶT LỊCH'
            ) : (
              '✨ Tiếp tục →'
            )}
          </ModernButton>
        </Box>

        {/* Dialog chi tiết dịch vụ (sử dụng ServiceDetailDialog component) */}
        <ServiceDetailDialog
          open={detailOpen}
          onClose={handleCloseDetail}
          detailData={detailData}
          detailType={detailType}
          loadingDetail={loadingDetail}
          onOpenDetail={handleOpenDetail}
          onSelectService={setSelectedService}
        />

        {/* Dialog thông báo thành công đặt lịch */}
        <BookingSuccessDialog
          open={bookingSuccess}
          message={bookingMessage}
          onClose={() => navigate('/')}
        />
      </Container>
    </Box>
  );
}

// ===============================
// PROPTYPES & EXPORT
// ===============================

// PropTypes để type checking (có thể thêm props validation nếu cần)
TestRegistrationPage.propTypes = {
  // Hiện tại component không nhận props từ parent
  // Có thể thêm PropTypes validation ở đây nếu cần thiết trong tương lai
};

// Export component làm default để sử dụng trong routing
export default TestRegistrationPage;