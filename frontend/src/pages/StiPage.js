import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid, // Remove duplicate Grid import
  Typography,
  TextField,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel
} from "@mui/material";

import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BiotechIcon from '@mui/icons-material/Biotech';
import CloseIcon from '@mui/icons-material/Close';
import GridViewIcon from '@mui/icons-material/GridView';
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PersonIcon from '@mui/icons-material/Person';
import PaidIcon from '@mui/icons-material/Paid';
import InfoIcon from '@mui/icons-material/Info';

import useAuthCheck from "@/hooks/useAuthCheck";
import { useNavigate } from "react-router-dom";
import notify from "@/utils/notification";
import { stiService } from "@/services/stiService";
import styles from '@/styles/ServiceCard.module.css';
import { userService } from "@/services/userService";

// Add these utility functions at the top of the file
const getIconColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return '#4CAF50';
    case 'pending':
      return '#FFC107';
    case 'completed':
      return '#2196F3';
    case 'cancelled':
      return '#F44336';
    default:
      return '#9E9E9E';
  }
};

// Define banner images
const bannerImages = [
  'https://img.freepik.com/free-photo/medical-banner-with-doctor-working-hospital_23-2149611193.jpg',
  'https://img.freepik.com/free-photo/medical-banner-with-doctor-stethoscope_23-2149611202.jpg',
  'https://img.freepik.com/free-photo/medical-banner-with-doctor-protective-mask_23-2149611200.jpg'
];

// Mảng icon và counselors để hiển thị
const iconComponents = [BiotechIcon, MedicalServicesIcon]; 
// Sửa lại hàm getTestComponentCount
function getTestComponentCount(service) {
  if (!service || !Array.isArray(service.testComponents)) return 0;
  return service.testComponents.length;
}

// Add test procedures data after the counselors array
const testProcedures = {
  'HIV': {
    steps: [
      'Tư vấn trước xét nghiệm về HIV/AIDS',
      'Lấy mẫu máu tĩnh mạch',
      'Xét nghiệm sàng lọc HIV bằng phương pháp ELISA',
      'Nếu kết quả dương tính, thực hiện xét nghiệm khẳng định Western Blot',
      'Tư vấn sau xét nghiệm và giải thích kết quả'
    ],
    preparation: [
      'Không cần nhịn đói',
      'Có thể uống nước bình thường',
      'Thông báo với nhân viên y tế nếu đang dùng thuốc'
    ],
    time: '15-30 phút',
    results: '1-3 ngày làm việc',
    referenceRange: 'Âm tính: < 0.9 COI\nDương tính: ≥ 1.0 COI\nKhông xác định: 0.9 - 1.0 COI',
    price: '200.000 VNĐ'
  },
  'Giang mai': {
    steps: [
      'Khám lâm sàng và hỏi tiền sử',
      'Lấy mẫu máu tĩnh mạch',
      'Xét nghiệm sàng lọc bằng RPR/VDRL',
      'Nếu dương tính, thực hiện xét nghiệm khẳng định TPHA/TPPA',
      'Tư vấn kết quả và hướng điều trị nếu cần'
    ],
    preparation: [
      'Không cần nhịn đói',
      'Có thể uống nước bình thường',
      'Thông báo với nhân viên y tế nếu đang dùng thuốc'
    ],
    time: '15-30 phút',
    results: '1-2 ngày làm việc',
    referenceRange: 'RPR/VDRL:\n- Âm tính: < 1:8\n- Dương tính: ≥ 1:8\n\nTPHA/TPPA:\n- Âm tính: < 1:80\n- Dương tính: ≥ 1:80',
    price: '180.000 VNĐ'
  },
  'Lau': {
    steps: [
      'Khám lâm sàng và hỏi tiền sử',
      'Lấy mẫu dịch niệu đạo/âm đạo',
      'Nhuộm Gram và soi tươi',
      'Nuôi cấy vi khuẩn và làm kháng sinh đồ',
      'Tư vấn kết quả và hướng điều trị'
    ],
    preparation: [
      'Không đi tiểu 2 giờ trước khi lấy mẫu',
      'Không quan hệ tình dục 24 giờ trước xét nghiệm',
      'Không sử dụng thuốc kháng sinh 2 tuần trước xét nghiệm'
    ],
    time: '15-20 phút',
    results: '2-3 ngày làm việc',
    referenceRange: 'Soi tươi:\n- Âm tính: Không thấy song cầu khuẩn\n- Dương tính: Thấy song cầu khuẩn Gram âm\n\nNuôi cấy:\n- Âm tính: Không mọc vi khuẩn\n- Dương tính: Mọc vi khuẩn Neisseria gonorrhoeae',
    price: '200.000 VNĐ'
  },
  'Herpes': {
    steps: [
      'Khám lâm sàng và hỏi tiền sử',
      'Lấy mẫu dịch từ tổn thương',
      'Xét nghiệm PCR phát hiện virus',
      'Xét nghiệm huyết thanh học (nếu cần)',
      'Tư vấn kết quả và hướng điều trị'
    ],
    preparation: [
      'Không bôi thuốc lên tổn thương 24 giờ trước xét nghiệm',
      'Không quan hệ tình dục 24 giờ trước xét nghiệm',
      'Thông báo với nhân viên y tế nếu đang dùng thuốc'
    ],
    time: '15-20 phút',
    results: '2-3 ngày làm việc',
    referenceRange: 'PCR:\n- Âm tính: Không phát hiện DNA virus\n- Dương tính: Phát hiện DNA virus\n\nHuyết thanh học:\n- IgG âm tính: < 0.9\n- IgG dương tính: ≥ 1.1\n- IgM âm tính: < 0.9\n- IgM dương tính: ≥ 1.1',
    price: '200.000 VNĐ'
  },
  'HPV': {
    steps: [
      'Khám lâm sàng và hỏi tiền sử',
      'Lấy mẫu tế bào cổ tử cung (Pap smear)',
      'Xét nghiệm PCR phát hiện DNA HPV',
      'Xác định type HPV (nếu cần)',
      'Tư vấn kết quả và hướng điều trị'
    ],
    preparation: [
      'Không quan hệ tình dục 24 giờ trước xét nghiệm',
      'Không thụt rửa âm đạo 24 giờ trước xét nghiệm',
      'Không đặt thuốc âm đạo 48 giờ trước xét nghiệm',
      'Không khám phụ khoa 24 giờ trước xét nghiệm'
    ],
    time: '20-30 phút',
    results: '3-5 ngày làm việc',
    referenceRange: 'PCR:\n- Âm tính: Không phát hiện DNA HPV\n- Dương tính: Phát hiện DNA HPV\n\nType HPV:\n- Nguy cơ thấp: 6, 11\n- Nguy cơ cao: 16, 18, 31, 33, 35, 39, 45, 51, 52, 56, 58, 59, 68',
    price: '250.000 VNĐ'
  },
  'Chlamydia': {
    steps: [
      'Khám lâm sàng và hỏi tiền sử',
      'Lấy mẫu dịch niệu đạo/âm đạo',
      'Xét nghiệm PCR phát hiện vi khuẩn',
      'Nuôi cấy vi khuẩn (nếu cần)',
      'Tư vấn kết quả và hướng điều trị'
    ],
    preparation: [
      'Không đi tiểu 2 giờ trước khi lấy mẫu',
      'Không quan hệ tình dục 24 giờ trước xét nghiệm',
      'Không sử dụng thuốc kháng sinh 2 tuần trước xét nghiệm',
      'Không thụt rửa âm đạo 24 giờ trước xét nghiệm'
    ],
    time: '15-20 phút',
    results: '2-3 ngày làm việc',
    referenceRange: 'PCR:\n- Âm tính: Không phát hiện DNA Chlamydia\n- Dương tính: Phát hiện DNA Chlamydia\n\nNuôi cấy:\n- Âm tính: Không mọc vi khuẩn\n- Dương tính: Mọc vi khuẩn Chlamydia trachomatis',
    price: '190.000 VNĐ'
  },
  'Viem gan B': {
    steps: [
      'Khám lâm sàng và hỏi tiền sử',
      'Lấy mẫu máu tĩnh mạch',
      'Xét nghiệm HBsAg (kháng nguyên bề mặt)',
      'Xét nghiệm Anti-HBs (kháng thể bề mặt)',
      'Xét nghiệm HBeAg và Anti-HBe (nếu cần)',
      'Tư vấn kết quả và hướng điều trị'
    ],
    preparation: [
      'Không cần nhịn đói',
      'Có thể uống nước bình thường',
      'Thông báo với nhân viên y tế nếu đang dùng thuốc',
      'Thông báo tiền sử tiêm chủng viêm gan B'
    ],
    time: '15-30 phút',
    results: '1-2 ngày làm việc',
    referenceRange: 'HBsAg:\n- Âm tính: < 0.05 IU/mL\n- Dương tính: ≥ 0.05 IU/mL\n\nAnti-HBs:\n- Âm tính: < 10 mIU/mL\n- Dương tính: ≥ 10 mIU/mL\n\nHBeAg:\n- Âm tính: < 1.0 COI\n- Dương tính: ≥ 1.0 COI\n\nAnti-HBe:\n- Âm tính: < 1.0 COI\n- Dương tính: ≥ 1.0 COI',
    price: '300.000 VNĐ'
  },
  'HSV': {
    steps: [
      'Khám lâm sàng và hỏi tiền sử',
      'Lấy mẫu dịch từ tổn thương',
      'Xét nghiệm PCR phát hiện virus',
      'Xét nghiệm huyết thanh học (nếu cần)',
      'Phân biệt HSV-1 và HSV-2',
      'Tư vấn kết quả và hướng điều trị'
    ],
    preparation: [
      'Không bôi thuốc lên tổn thương 24 giờ trước xét nghiệm',
      'Không quan hệ tình dục 24 giờ trước xét nghiệm',
      'Thông báo với nhân viên y tế nếu đang dùng thuốc',
      'Không rửa vùng tổn thương 12 giờ trước xét nghiệm'
    ],
    time: '15-20 phút',
    results: '2-3 ngày làm việc',
    referenceRange: 'PCR:\n- Âm tính: Không phát hiện DNA HSV\n- Dương tính: Phát hiện DNA HSV\n\nHuyết thanh học:\n- IgG âm tính: < 0.9\n- IgG dương tính: ≥ 1.1\n- IgM âm tính: < 0.9\n- IgM dương tính: ≥ 1.1\n\nPhân type:\n- HSV-1: Gây bệnh ở miệng\n- HSV-2: Gây bệnh ở bộ phận sinh dục',
    price: '300.000 VNĐ'
  },
  'HCV': {
    steps: [
      'Khám lâm sàng và hỏi tiền sử',
      'Lấy mẫu máu tĩnh mạch',
      'Xét nghiệm Anti-HCV (kháng thể)',
      'Xét nghiệm HCV RNA (nếu cần)',
      'Xác định genotype (nếu cần)',
      'Tư vấn kết quả và hướng điều trị'
    ],
    preparation: [
      'Không cần nhịn đói',
      'Có thể uống nước bình thường',
      'Thông báo với nhân viên y tế nếu đang dùng thuốc',
      'Thông báo tiền sử truyền máu hoặc phẫu thuật'
    ],
    time: '15-30 phút',
    results: '2-3 ngày làm việc',
    referenceRange: 'Anti-HCV:\n- Âm tính: < 1.0 COI\n- Dương tính: ≥ 1.0 COI\n\nHCV RNA:\n- Âm tính: < 15 IU/mL\n- Dương tính: ≥ 15 IU/mL\n\nGenotype:\n- Type 1-6: Xác định type virus\n- Không xác định: Không phát hiện genotype',
    price: '250.000 VNĐ'
  }
};

export default function STITestPage() {
  const { isLoggedIn } = useAuthCheck();
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  const [currentPackageDetail, setCurrentPackageDetail] = useState(null);
  const [userInfo, setUserInfo] = useState({
    date: "",
    time: "",
    notes: ""
  });
  const [patientInfo, setPatientInfo] = useState({
    fullName: '',
    phone: '',
    email: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [qrPayment, setQrPayment] = useState(null);
  const [selectedPackageInfo, setSelectedPackageInfo] = useState(null);
  const [counselor, setCounselor] = useState('');
  const [counselors, setCounselors] = useState([
    { 
      id: 1, 
      name: 'BS. Nguyễn Thị Minh Tâm', 
      specialization: 'Chuyên gia Sức khỏe Sinh sản' 
    },
    { 
      id: 2, 
      name: 'BS. Trần Văn Hoàng', 
      specialization: 'Chuyên khoa Nam học' 
    },
    { 
      id: 3, 
      name: 'BS. Lê Thị Thanh Hương', 
      specialization: 'Chuyên gia Phụ khoa' 
    },
    { 
      id: 4, 
      name: 'BS. Phạm Minh Đức', 
      specialization: 'Chuyên gia STI & HIV/AIDS' 
    },
    { 
      id: 5, 
      name: 'BS. Võ Thị Mai Anh', 
      specialization: 'Chuyên khoa Kế hoạch hóa gia đình' 
    },
    { 
      id: 6, 
      name: 'BS. Đặng Quốc Bảo', 
      specialization: 'Chuyên gia Xét nghiệm STI' 
    },
    { 
      id: 7, 
      name: 'BS. Hoàng Thị Lan', 
      specialization: 'Tư vấn Sức khỏe Giới tính' 
    },
    { 
      id: 8, 
      name: 'BS. Bùi Văn Minh', 
      specialization: 'Chuyên gia Y tế Công cộng' 
    },
    { 
      id: 9, 
      name: 'BS. Trương Thị Hồng', 
      specialization: 'Chuyên khoa Nội tiết' 
    },
    { 
      id: 10, 
      name: 'BS. Ngô Thanh Tùng', 
      specialization: 'Chuyên gia Tham vấn Tâm lý' 
    }
  ]);
  
  // Add slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,  // 3 seconds
    pauseOnHover: true,
    fade: true,
    cssEase: 'linear'
  };

 useEffect(() => {
  async function fetchPackages() {
    try {
      const response = await stiService.getActiveSTIServices();
      if (!response || !Array.isArray(response)) {
        setPackages([]);
        return;
      }

      const pkgsWithDetails = await Promise.all(
        response.map(async (pkg, index) => {
          try {
            const detail = await stiService.getPackageDetail(pkg.serviceId);
            const IconComponent = iconComponents[index % iconComponents.length];
            
            return {
              ...pkg,
              id: String(pkg.serviceId),
              testComponents: detail?.testComponents || [],
              icon: (
                <IconComponent
                  fontSize="large"
                  sx={{
                    color: getIconColor(pkg.status || 'default'),
                    transition: 'all 0.3s',
                  }}
                />
              ),
            };
          } catch (error) {
            return null;
          }
        })
      );

      setPackages(pkgsWithDetails.filter(pkg => pkg !== null));
    } catch (error) {
      console.error('Error fetching packages:', error);
      notify.error("Lấy danh sách gói xét nghiệm thất bại. Vui lòng thử lại.");
      setPackages([]);
    }
  }

  fetchPackages();
}, []);

  // Hàm này sẽ gọi API để lấy chi tiết gói xét nghiệm
  const handleOpenDetailDialog = async (pkgId) => {
  try {
    const detail = await stiService.getPackageDetail(pkgId);
    setCurrentPackageDetail(detail);
    setOpenDetailDialog(true);
  } catch (error) {
    notify.error("Không thể tải chi tiết gói xét nghiệm.");
  }
};

  // Update the handleRegister function
  const handleRegister = async (packageId) => {
    try {
      // Check login status first
      const userData = localStorage.getItem("user");
      if (!userData) {
        notify.warning("Vui lòng đăng nhập để đặt lịch xét nghiệm");
        navigate('/login', { 
          state: { 
            returnUrl: window.location.pathname,
            packageId: packageId 
          }
        });
        return;
      }

      // Proceed with registration if logged in
      const selectedPkg = packages.find(pkg => pkg.serviceId === packageId);
      if (!selectedPkg) {
        throw new Error('Không tìm thấy thông tin gói xét nghiệm');
      }

      // Set states
      setSelectedPackage(packageId);
      setSelectedPackageInfo(selectedPkg);
      
      // Get user info from localStorage
      const parsedUserData = JSON.parse(userData);
      setPatientInfo({
        fullName: parsedUserData.fullName || '',
        phone: parsedUserData.phone || '',
        email: parsedUserData.email || ''
      });

      // Open registration dialog
      setOpenRegisterDialog(true);

    } catch (error) {
      console.error('Error in handleRegister:', error);
      notify.error('Không thể mở form đặt lịch. Vui lòng thử lại');
    }
  };

  // Update handleConfirmRegister function
  const handleConfirmRegister = async () => {
    try {
      // Validate required fields
      if (!userInfo.date || !userInfo.time) {
        notify.warning("Vui lòng chọn ngày giờ hẹn");
        return;
      }

      if (!counselor) {
        notify.warning("Vui lòng chọn tư vấn viên");
        return;
      }

      // Validate appointment date
      const appointmentDate = new Date(userInfo.date);
      const today = new Date();
      if (appointmentDate < today) {
        notify.warning("Ngày hẹn không thể là ngày trong quá khứ");
        return;
      }

      const bookingData = {
        serviceId: selectedPackage,
        appointmentDate: userInfo.date,
        appointmentTime: userInfo.time,
        notes: userInfo.notes || '',
        paymentMethod: paymentMethod,
        counselorId: counselor // Add counselor ID
      };

      const response = await stiService.bookTest(bookingData);

      if (paymentMethod === 'TRANSFER') {
        try {
          const qrResponse = await stiService.createQRPayment(response.data.testId);
          setQrPayment(qrResponse.data);
          
          // Start polling payment status
          const pollInterval = setInterval(async () => {
            try {
              const statusResponse = await stiService.checkQRPaymentStatus(qrResponse.data.reference);
              if (statusResponse.data.status === 'PAID') {
                clearInterval(pollInterval);
                notify.success("Thanh toán thành công!");
                setOpenRegisterDialog(false);
                resetForm();
              }
            } catch (error) {
              console.error('Error checking payment status:', error);
            }
          }, 5000);

          // Clear interval after 5 minutes
          setTimeout(() => {
            clearInterval(pollInterval);
          }, 300000);

        } catch (error) {
          notify.error("Không thể tạo mã QR thanh toán");
        }
      } else {
        notify.success("Đặt lịch xét nghiệm thành công!");
        setOpenRegisterDialog(false);
        resetForm();
      }

    } catch (error) {
      console.error('Error in handleConfirmRegister:', error);
      notify.error(error.message || "Đặt lịch thất bại. Vui lòng thử lại");
    }
  };

  // Add this function to reset all form data
  const resetForm = () => {
    setUserInfo({
      date: "",
      time: "",
      notes: ""
    });
    setPaymentMethod('COD');
    setQrPayment(null);
    setSelectedPackage("");
    setSelectedPackageInfo(null);
  };

  const handleRetry = async () => {
    try {
      const response = await stiService.getActiveSTIServices();
      const pkgData = response.data;
      const pkgsWithIcon = pkgData.map((pkg, index) => {
        const IconComponent = iconComponents[index] || iconComponents[iconComponents.length - 1];
        return {
          ...pkg,
          id: String(pkg.serviceId),
          icon: <IconComponent 
            fontSize="large" 
            sx={{ 
              color: getIconColor(index),
              transition: 'all 0.3s'
            }} 
          />
        };
      });
      setPackages(pkgsWithIcon);
    } catch (error) {
      notify.error("Lấy danh sách gói xét nghiệm thất bại. Vui lòng thử lại.");
    }
  };

  // Update your useEffect to fetch user data
  useEffect(() => {
    async function fetchData() {
      if (!openRegisterDialog || !isLoggedIn) return;

      try {
        const userResponse = await userService.getCurrentUser();
        
        if (!userResponse.success) {
          if (userResponse.error === 'Authentication required') {
            notify.warning("Vui lòng đăng nhập để tiếp tục");
            navigate('/login', { 
              state: { returnUrl: window.location.pathname }
            });
            return;
          }
          throw new Error(userResponse.error);
        }

        setPatientInfo({
          fullName: userResponse.data.fullName,
          phone: userResponse.data.phone,
          email: userResponse.data.email
        });

        // Only fetch package if user data loaded successfully
        if (selectedPackage) {
          const packageResponse = await stiService.getPackageDetail(selectedPackage);
          setSelectedPackageInfo(packageResponse);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        notify.error("Không thể tải thông tin. Vui lòng thử lại");
        setOpenRegisterDialog(false);
      }
    }

    fetchData();
  }, [openRegisterDialog, isLoggedIn, selectedPackage, navigate]);

  // Update the user info fetching
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userData = await userService.getCurrentUser();
        if (userData.success) {
          setPatientInfo({
            fullName: userData.data.fullName,
            phone: userData.data.phone,
            email: userData.data.email
          });
        }
      } catch (error) {
        if (error.message === 'Unauthorized') {
          navigate('/login');
        } else {
          notify.error("Không thể tải thông tin người dùng");
        }
      }
    };

    if (openRegisterDialog && isLoggedIn) {
      fetchUserInfo();
    }
  }, [openRegisterDialog, isLoggedIn, navigate]);

  // Add auth error listener
  useEffect(() => {
    const handleAuthError = () => {
      localStorage.removeItem('token');
      notify.warning("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      navigate('/login', { 
        state: { returnUrl: window.location.pathname }
      });
    };

    window.addEventListener('auth-error', handleAuthError);
    return () => {
      window.removeEventListener('auth-error', handleAuthError);
    };
  }, [navigate]);

  return (
  <Box
    sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, rgba(74, 144, 226, 0.15), rgba(26, 188, 156, 0.15))',
      py: 6,
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(45deg, rgba(74, 144, 226, 0.05), rgba(26, 188, 156, 0.05))',
        backdropFilter: 'blur(10px)',
        zIndex: 0,
      }
    }}
  >
    <Container 
      maxWidth="md" 
      sx={{ 
        position: 'relative',
        zIndex: 1 
      }}
    >
        {/* Add Banner Image */}
        <Box sx={{ mb: 4 }}>
          <Slider {...settings}>
            {bannerImages.map((image, index) => (
              <Box key={index}>
                <Box
                  component="img"
                  src={image}
                  alt={`Banner ${index + 1}`}
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 4,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    objectFit: 'cover',
                    aspectRatio: '21/9'
                  }}
                />
              </Box>
            ))}
          </Slider>
        </Box>

        <Box mb={4}>
          <Typography
            variant="h3"
            fontWeight="bold"
            gutterBottom
            textAlign="center"
            sx={{
              background: 'linear-gradient(45deg, #2196F3, #00BFA5)', // Updated to match theme
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Đăng ký xét nghiệm STI
          </Typography>
          <Typography variant="body1" textAlign="center" color="text.secondary">
            Kiểm tra sức khỏe sinh sản định kỳ giúp phát hiện sớm và điều trị hiệu quả các bệnh lây truyền qua đường tình dục (STI).
          </Typography>
        </Box>

        <div className={styles.servicesSection}>
          <h2>Chọn gói xét nghiệm</h2>

          {packages.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <h3>Chưa có gói xét nghiệm nào</h3>
              <p>Hiện tại chưa có dữ liệu. Vui lòng thử lại sau!</p>
              <button onClick={handleRetry} className={styles.btnPrimary}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 4v6h-6"></path>
                  <path d="M1 20v-6h6"></path>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
                Thử lại
              </button>
            </div>
          ) : (
            <div className={styles.servicesGrid}>
              {packages.map((pkg) => (
                <div key={pkg.id} className={styles.card}>
  <div className={styles.header}>
    <h3 className={styles.title}>{pkg.name}</h3>
    <p className={styles.description}>{pkg.description}</p>
  </div>

  <div className={styles.content}>
    <div className={styles.infoList}>
      <div className={styles.infoItem}>
        <span className={styles.infoLabel}>
          <BiotechIcon sx={{ color: '#2196F3', fontSize: 20 }} />
          Số lượng xét nghiệm:
        </span>
        <span className={styles.infoValue}>
          {(pkg.testComponents || []).length} xét nghiệm
        </span>
      </div>

      <div className={styles.infoItem}>
        <span className={styles.infoLabel}>
          <AccessTimeIcon sx={{ color: '#2196F3', fontSize: 20 }} />
          Thời gian lấy mẫu:
        </span>
        <span className={styles.infoValue}>15-30 phút</span>
      </div>

      <div className={styles.infoItem}>
        <span className={styles.infoLabel}>
          <EventIcon sx={{ color: '#2196F3', fontSize: 20 }} />
          Thời gian có kết quả:
        </span>
        <span className={styles.infoValue}>1-3 ngày làm việc</span>
      </div>
    </div>
    
    <div className={styles.price}>
      <div className={styles.priceAmount}>
        {new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(pkg.price || 0)} VNĐ
      </div>
    </div>
  </div>

  <div className={styles.footer}>
    <div className={styles.actions}>
      <button 
        className={styles.btnOutline}
        onClick={() => handleOpenDetailDialog(pkg.serviceId)}
      >
        Chi tiết
      </button>
      <button
        className={styles.btnPrimary}
        onClick={() => handleRegister(pkg.serviceId)} // Use serviceId instead of id
      >
        Đặt lịch xét nghiệm
      </button>
    </div>
  </div>
</div>
              ))}
            </div>
          )}
        </div>

        {/* Dialog xem chi tiết gói */}
        <Dialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)} maxWidth="sm" fullWidth>
  <DialogTitle 
    sx={{ 
      pb: 1,
      background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.05), rgba(0, 191, 165, 0.05))',
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <MedicalServicesIcon sx={{ color: '#2196F3', fontSize: 28 }} />
      <Typography variant="h5" fontWeight="bold" sx={{ 
  background: 'linear-gradient(45deg, #2196F3, #00BFA5)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}}>
        Chi tiết dịch vụ xét nghiệm
      </Typography>
    </Box>
  </DialogTitle>

  <DialogContent sx={{ 
    p: 3, 
    background: 'linear-gradient(135deg, rgba(248, 250, 255, 0.95), rgba(236, 246, 255, 0.95))'
  }}>
    <Box sx={{ mb: 4 }}>
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{
          background: 'linear-gradient(45deg, #2196F3, #00BFA5)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold',
          mb: 2,
          fontSize: '1.5rem'
        }}
      >
        {currentPackageDetail?.name}
      </Typography>

      <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
        <Box sx={{ 
          bgcolor: '#E8F5E9', 
          color: '#2E7D32',
          px: 2,
          py: 0.7,
          borderRadius: 2,
          fontSize: '0.875rem',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5
        }}>
          <CheckCircleIcon sx={{ fontSize: 18 }} />
          HOẠT ĐỘNG
        </Box>
        <Box sx={{
          bgcolor: '#E3F2FD',
          px: 2,
          py: 0.7,
          borderRadius: 2,
          fontSize: '0.875rem',
          color: '#1976D2',
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          fontWeight: 500
        }}>
          <WorkspacePremiumIcon sx={{ fontSize: 18 }} />
          {new Intl.NumberFormat('vi-VN').format(currentPackageDetail?.price || 0)} VNĐ
        </Box>
      </Box>

      <Typography 
        color="text.secondary" 
        sx={{ 
          mb: 4,
          fontSize: '0.95rem',
          lineHeight: 1.6,
          fontStyle: 'italic',
          color: '#546E7A'  // Màu chữ mới cho description
        }}
      >
        {currentPackageDetail?.description || 'Phù hợp cho người có nguy cơ cao.'}
      </Typography>

      <Box sx={{ 
        bgcolor: 'rgba(248, 250, 255, 0.9)',
        borderRadius: 3,
        p: 2.5,
        boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
        border: '1px solid rgba(25, 118, 210, 0.1)',
        backdropFilter: 'blur(4px)'
      }}>
        <Typography variant="h6" gutterBottom sx={{ 
  mb: 2,
  background: 'linear-gradient(45deg, #2196F3, #00BFA5)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontSize: '1.1rem',
  fontWeight: 600 
}}>
          Thông tin dịch vụ
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BiotechIcon sx={{ color: '#2196F3', fontSize: 20 }} />
              <Typography sx={{ 
                color: '#37474F',
                fontSize: '0.95rem',
                fontWeight: 500 
              }}>
                Số lượng xét nghiệm:
              </Typography>
            </Box>
            <Typography sx={{ 
              fontWeight: 600,
              color: '#1976D2',
              fontSize: '0.95rem'
            }}>
              {currentPackageDetail?.testComponents?.length || 0} xét nghiệm
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTimeIcon sx={{ color: '#2196F3', fontSize: 20 }} />
              <Typography sx={{ 
                color: '#37474F',
                fontSize: '0.95rem',
                fontWeight: 500 
              }}>
                Thời gian lấy mẫu:
              </Typography>
            </Box>
            <Typography sx={{ 
              fontWeight: 600,
              color: '#1976D2',
              fontSize: '0.95rem'
            }}>
              15-30 phút
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EventIcon sx={{ color: '#2196F3', fontSize: 20 }} />
              <Typography sx={{ 
                color: '#37474F',
                fontSize: '0.95rem',
                fontWeight: 500 
              }}>
                Thời gian có kết quả:
              </Typography>
            </Box>
            <Typography sx={{ 
              fontWeight: 600,
              color: '#1976D2',
              fontSize: '0.95rem'
            }}>
              1-3 ngày làm việc
            </Typography>
          </Box>
        </Box>
      </Box>

      <Typography variant="h6" gutterBottom sx={{ 
  mt: 4,
  mb: 2,
  background: 'linear-gradient(45deg, #2196F3, #00BFA5)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontSize: '1.1rem',
  fontWeight: 600
}}>
        Danh sách xét nghiệm ({currentPackageDetail?.testComponents?.length || 0})
      </Typography>

      <TableContainer 
        sx={{ 
          bgcolor: 'rgba(248, 250, 255, 0.9)',
          borderRadius: 3,
          border: '1px solid rgba(25, 118, 210, 0.1)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
          backdropFilter: 'blur(4px)',
          '& .MuiTableCell-root': {
            color: '#37474F'  // Màu chữ mới cho nội dung bảng
          }
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ 
                fontWeight: 600, 
                color: '#0D47A1',
                fontSize: '0.875rem'
              }}>STT</TableCell>
              <TableCell sx={{ 
                fontWeight: 600, 
                color: '#0D47A1',
                fontSize: '0.875rem'
              }}>Tên xét nghiệm</TableCell>
              <TableCell sx={{ 
                fontWeight: 600, 
                color: '#0D47A1',
                fontSize: '0.875rem'
              }}>Chi phí</TableCell>
              <TableCell align="right" sx={{ 
                fontWeight: 600, 
                color: '#0D47A1',
                fontSize: '0.875rem'
              }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(currentPackageDetail?.testComponents || []).map((test, index) => (
              <TableRow 
                key={index}
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': {
                    bgcolor: 'rgba(33, 150, 243, 0.04)'
                  }
                }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{test.testName}</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{testProcedures[test.testName]?.price || 'N/A'}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<InfoIcon />}
                    onClick={() => {
                      const procedure = testProcedures[test.testName];
                      if (procedure) {
                        setCurrentPackageDetail({
                          ...currentPackageDetail,
                          selectedTest: {
                            name: test.testName,
                            procedure: procedure,
                            referenceRange: test.referenceRange
                          }
                        });
                      }
                    }}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      borderColor: '#2196F3',
                      color: '#2196F3',
                      '&:hover': {
                        borderColor: '#1976D2',
                        bgcolor: 'rgba(33, 150, 243, 0.04)'
                      }
                    }}
                  >
                    Xem quy trình
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  </DialogContent>

  <DialogActions 
    sx={{ 
      p: 2.5, 
      gap: 1,
      background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.05), rgba(0, 191, 165, 0.05))',
      borderTop: '1px solid rgba(0,0,0,0.05)'
    }}
  >
    <Button
      variant="outlined"
      onClick={() => setOpenDetailDialog(false)}
      sx={{ 
        borderRadius: 2, 
        px: 3,
        py: 1,
        color: '#1976D2',
        borderColor: '#1976D2',
        '&:hover': {
          borderColor: '#1565C0',
          bgcolor: 'rgba(25, 118, 210, 0.04)'
        }
      }}
    >
      Đóng
    </Button>
    <Button
      variant="contained"
      onClick={() => {
        setOpenDetailDialog(false);
        handleRegister(currentPackageDetail?.serviceId); // Pass the serviceId here
      }}
      sx={{ 
        borderRadius: 2,
        px: 3,
        py: 1,
        background: 'linear-gradient(45deg, #2196F3, #00BFA5)',
        boxShadow: '0 4px 12px rgba(0, 191, 165, 0.2)',
        '&:hover': {
          background: 'linear-gradient(45deg, #1976D2, #00897B)',
          boxShadow: '0 6px 16px rgba(0, 191, 165, 0.3)'
        }
      }}
    >
      Đặt lịch xét nghiệm
    </Button>
  </DialogActions>
</Dialog>

        {/* Dialog đăng ký */}
        <Dialog open={openRegisterDialog} onClose={() => setOpenRegisterDialog(false)} maxWidth="md" fullWidth>
  <DialogTitle 
    sx={{ 
      pb: 1,
      background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.05), rgba(0, 191, 165, 0.05))',
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <EventIcon sx={{ color: '#2196F3', fontSize: 28 }} />
      <Typography variant="h5" fontWeight="bold" sx={{ 
        background: 'linear-gradient(45deg, #2196F3, #00BFA5)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        Đặt lịch xét nghiệm STI
      </Typography>
    </Box>
  </DialogTitle>

  <DialogContent sx={{ 
    p: 3, 
    background: 'linear-gradient(135deg, rgba(248, 250, 255, 0.95), rgba(236, 246, 255, 0.95))'
  }}>
    <Box sx={{ mb: 4 }}>
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{
          background: 'linear-gradient(45deg, #2196F3, #00BFA5)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold',
          mb: 2,
          fontSize: '1.5rem'
        }}
      >
        {selectedPackageInfo?.name}
      </Typography>

      <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
        <Box sx={{ 
          bgcolor: '#E8F5E9', 
          color: '#2E7D32',
          px: 2,
          py: 0.7,
          borderRadius: 2,
          fontSize: '0.875rem',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5
        }}>
          <CheckCircleIcon sx={{ fontSize: 18 }} />
          HOẠT ĐỘNG
        </Box>
        <Box sx={{
          bgcolor: '#E3F2FD',
          px: 2,
          py: 0.7,
          borderRadius: 2,
          fontSize: '0.875rem',
          color: '#1976D2',
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          fontWeight: 500
        }}>
          <WorkspacePremiumIcon sx={{ fontSize: 18 }} />
          {new Intl.NumberFormat('vi-VN').format(selectedPackageInfo?.price || 0)} VNĐ
        </Box>
      </Box>

      {/* Thông tin bệnh nhân */}
      <Box sx={{ 
        mb: 4,
        p: 3,
        borderRadius: 3,
        bgcolor: 'rgba(248, 250, 255, 0.9)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
        border: '1px solid rgba(25, 118, 210, 0.1)'
      }}>
        <Typography variant="h6" gutterBottom sx={{ 
          mb: 2,
          background: 'linear-gradient(45deg, #2196F3, #00BFA5)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '1.1rem',
          fontWeight: 600 
        }}>
          Thông tin bệnh nhân
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Họ và tên"
              value={patientInfo.fullName}
              disabled
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  borderRadius: 2
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Số điện thoại"
              value={patientInfo.phone}
              disabled
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  borderRadius: 2
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              value={patientInfo.email}
              disabled
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  borderRadius: 2
                }
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Tư vấn viên */}
      <Box sx={{ 
  mb: 4,
  p: 3,
  borderRadius: 3,
  bgcolor: 'rgba(248, 250, 255, 0.9)',
  boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
  border: '1px solid rgba(25, 118, 210, 0.1)'
}}>
  <Typography variant="h6" gutterBottom sx={{ 
    mb: 3,
    background: 'linear-gradient(45deg, #2196F3, #00BFA5)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontSize: '1.1rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: 1
  }}>
    <PersonIcon sx={{ color: '#2196F3' }}/>
    Chọn tư vấn viên
  </Typography>

  <Box
    sx={{
      width: '100%',
      overflow: 'auto',
      '&::-webkit-scrollbar': {
        height: '8px',
      },
      '&::-webkit-scrollbar-track': {
        background: '#f1f1f1',
        borderRadius: '8px',
      },
      '&::-webkit-scrollbar-thumb': {
        background: '#90CAF9',
        borderRadius: '8px',
        '&:hover': {
          background: '#64B5F6'
        }
      },
    }}
  >
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        pb: 1,
        minWidth: 'min-content',
      }}
    >
      {counselors.map((c) => (
        <Box
          key={c.id}
          onClick={() => setCounselor(c.id)}
          sx={{
            p: 2.5,
            border: '1px solid',
            borderColor: counselor === c.id ? '#2196F3' : 'rgba(0, 0, 0, 0.08)',
            borderRadius: 3,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            bgcolor: counselor === c.id ? 'rgba(33, 150, 243, 0.08)' : 'white',
            minWidth: '280px',
            transform: counselor === c.id ? 'translateY(-2px)' : 'none',
            boxShadow: counselor === c.id 
              ? '0 6px 20px rgba(33, 150, 243, 0.15)' 
              : '0 2px 10px rgba(0,0,0,0.03)',
            '&:hover': {
              borderColor: '#2196F3',
              bgcolor: 'rgba(33, 150, 243, 0.04)',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(33, 150, 243, 0.15)'
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: counselor === c.id ? '#E3F2FD' : 'transparent',
                transition: 'background 0.3s',
                border: counselor === c.id ? '2px solid #2196F3' : '2px solid transparent',
              }}
            >
              <PersonIcon 
                sx={{ 
                  color: counselor === c.id ? '#2196F3' : '#757575',
                  fontSize: '1.5rem'
                }} 
              />
            </Box>
            <Typography sx={{ 
              fontWeight: 500,
              color: counselor === c.id ? '#2196F3' : '#424242',
              fontSize: '0.95rem'
            }}>
              {c.name}
            </Typography>
          </Box>
          <Typography sx={{ 
            fontSize: '0.875rem',
            color: '#757575',
            pl: 3.5
          }}>
            {c.specialization}
          </Typography>
        </Box>
      ))}
    </Box>
  </Box>
</Box>

      {/* Ngày giờ hẹn */}
      <Box sx={{ 
        mb: 4,
        p: 3,
        borderRadius: 3,
        bgcolor: 'rgba(248, 250, 255, 0.9)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
        border: '1px solid rgba(25, 118, 210, 0.1)'
      }}>
        <Typography variant="h6" gutterBottom sx={{ 
          mb: 2,
          background: 'linear-gradient(45deg, #2196F3, #00BFA5)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '1.1rem',
          fontWeight: 600 
        }}>
          Ngày giờ hẹn
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              label="Ngày hẹn"
              value={userInfo.date}
              onChange={(e) => setUserInfo({ ...userInfo, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  borderRadius: 2
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="time"
              label="Giờ hẹn"
              value={userInfo.time}
              onChange={(e) => setUserInfo({ ...userInfo, time: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  borderRadius: 2
                }
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Ghi chú */}
      <Box sx={{ 
        mb: 4,
        p: 3,
        borderRadius: 3,
        bgcolor: 'rgba(248, 250, 255, 0.9)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
        border: '1px solid rgba(25, 118, 210, 0.1)'
      }}>
        <Typography variant="h6" gutterBottom sx={{ 
          mb: 2,
          background: 'linear-gradient(45deg, #2196F3, #00BFA5)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '1.1rem',
          fontWeight: 600 
        }}>
          Ghi chú
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Thêm ghi chú cho cuộc hẹn (nếu có)"
          value={userInfo.notes}
          onChange={(e) => setUserInfo({ ...userInfo, notes: e.target.value })}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'white',
              borderRadius: 2
            }
          }}
        />
      </Box>

      {/* Phương thức thanh toán */}
      <Box sx={{ 
        mb: 4,
        p: 3,
        borderRadius: 3,
        bgcolor: 'rgba(248, 250, 255, 0.9)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
        border: '1px solid rgba(25, 118, 210, 0.1)'
      }}>
        <Typography variant="h6" gutterBottom sx={{ 
          mb: 2,
          background: 'linear-gradient(45deg, #2196F3, #00BFA5)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '1.1rem',
          fontWeight: 600 
        }}>
          Phương thức thanh toán
        </Typography>

        <RadioGroup
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          sx={{
            '& .MuiFormControlLabel-root': {
              marginBottom: 1
            }
          }}
        >
          <FormControlLabel
            value="COD"
            control={<Radio color="primary" />}
            label="Thanh toán khi nhận dịch vụ (COD)"
          />
          <FormControlLabel
            value="VISA"
            control={<Radio color="primary" />}
            label="Thanh toán bằng thẻ VISA"
          />
          <FormControlLabel
            value="TRANSFER"
            control={<Radio color="primary" />}
            label="Thanh toán bằng QR Code (Chuyển khoản)"
          />
        </RadioGroup>
      </Box>

      {/* QR Payment Section */}
      {paymentMethod === 'TRANSFER' && (
        <Box sx={{ 
          p: 3,
          borderRadius: 3,
          bgcolor: 'rgba(248, 250, 255, 0.9)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
          border: '1px solid rgba(25, 118, 210, 0.1)'
        }}>
          <Typography variant="h6" gutterBottom sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 3,
            fontSize: '1.1rem',
            fontWeight: 600
          }}>
            <GridViewIcon sx={{ color: '#1976D2' }} />
            Thanh toán QR Code
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HomeIcon sx={{ color: '#1976D2' }} />
              <Typography>
                <Box component="span" sx={{ fontWeight: 'bold' }}>Ngân hàng:</Box> MB Bank
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccountBalanceIcon sx={{ color: '#1976D2' }} />
              <Typography>
                <Box component="span" sx={{ fontWeight: 'bold' }}>Số tài khoản:</Box> 0349079940
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon sx={{ color: '#1976D2' }} />
              <Typography>
                <Box component="span" sx={{ fontWeight: 'bold' }}>Chủ tài khoản:</Box> NGUYEN VAN CUONG
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PaidIcon sx={{ color: '#1976D2' }} />
              <Typography>
                <Box component="span" sx={{ fontWeight: 'bold' }}>Số tiền:</Box> {new Intl.NumberFormat('vi-VN').format(selectedPackageInfo?.price || 0)} đ
              </Typography>
            </Box>
          </Box>

          <Box sx={{
            mt: 3,
            p: 2,
            borderRadius: 2,
            bgcolor: '#EBF3FE',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1
          }}>
            <InfoIcon sx={{ color: '#1976D2', mt: 0.5 }} />
            <Typography sx={{ color: '#1976D2', fontSize: '0.875rem', lineHeight: 1.5 }}>
              Lưu ý: Sau khi đặt lịch, bạn sẽ nhận được mã QR để thanh toán. Bạn có thể thanh toán ngay hoặc thanh toán sau trong mục "Lịch sử xét nghiệm".
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  </DialogContent>

  <DialogActions 
    sx={{ 
      p: 2.5, 
      gap: 1,
      background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.05), rgba(0, 191, 165, 0.05))',
      borderTop: '1px solid rgba(0,0,0,0.05)'
    }}
  >
    <Button
      variant="outlined"
      onClick={() => setOpenRegisterDialog(false)}
      sx={{ 
        borderRadius: 2, 
        px: 3,
        py: 1,
        color: '#1976D2',
        borderColor: '#1976D2',
        '&:hover': {
          borderColor: '#1565C0',
          bgcolor: 'rgba(25, 118, 210, 0.04)'
        }
      }}
    >
      Hủy
    </Button>
    <Button
      variant="contained"
      onClick={handleConfirmRegister}
      startIcon={<EventIcon />}
      sx={{ 
        borderRadius: 2,
        px: 3,
        py: 1,
        background: 'linear-gradient(45deg, #2196F3, #00BFA5)',
        boxShadow: '0 4px 12px rgba(0, 191, 165, 0.2)',
        '&:hover': {
          background: 'linear-gradient(45deg, #1976D2, #00897B)',
          boxShadow: '0 6px 16px rgba(0, 191, 165, 0.3)'
        }
      }}
    >
      Đặt lịch xét nghiệm
    </Button>
  </DialogActions>
</Dialog>

      {/* Add test procedure dialog after the detail dialog */}
      {currentPackageDetail?.selectedTest && (
        <Dialog 
          open={!!currentPackageDetail.selectedTest} 
          onClose={() => setCurrentPackageDetail({
            ...currentPackageDetail,
            selectedTest: null
          })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle 
            sx={{ 
              pb: 1,
              background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.05), rgba(0, 191, 165, 0.05))',
              borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <BiotechIcon sx={{ color: '#2196F3', fontSize: 28 }} />
              <Typography variant="h5" fontWeight="bold" sx={{ 
                background: 'linear-gradient(45deg, #2196F3, #00BFA5)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Quy trình xét nghiệm {currentPackageDetail.selectedTest.name}
              </Typography>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ 
            p: 3, 
            background: 'linear-gradient(135deg, rgba(248, 250, 255, 0.95), rgba(236, 246, 255, 0.95))'
          }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ 
                mb: 2,
                color: '#1976D2',
                fontSize: '1.1rem',
                fontWeight: 600 
              }}>
                Các bước thực hiện
              </Typography>

              <Box sx={{ 
                bgcolor: 'white',
                borderRadius: 2,
                p: 2,
                mb: 3
              }}>
                {currentPackageDetail.selectedTest.procedure.steps.map((step, index) => (
                  <Box key={index} sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    mb: 1.5,
                    '&:last-child': { mb: 0 }
                  }}>
                    <Box sx={{ 
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      bgcolor: '#E3F2FD',
                      color: '#1976D2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      fontSize: '0.875rem'
                    }}>
                      {index + 1}
                    </Box>
                    <Typography sx={{ color: '#37474F' }}>
                      {step}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Typography variant="h6" gutterBottom sx={{ 
                mb: 2,
                color: '#1976D2',
                fontSize: '1.1rem',
                fontWeight: 600 
              }}>
                Chuẩn bị trước khi xét nghiệm
              </Typography>

              <Box sx={{ 
                bgcolor: 'white',
                borderRadius: 2,
                p: 2,
                mb: 3
              }}>
                {currentPackageDetail.selectedTest.procedure.preparation.map((item, index) => (
                  <Box key={index} sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    mb: 1.5,
                    '&:last-child': { mb: 0 }
                  }}>
                    <CheckCircleIcon sx={{ color: '#4CAF50', fontSize: 20 }} />
                    <Typography sx={{ color: '#37474F' }}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ 
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
                mb: 3
              }}>
                <Box sx={{ 
                  bgcolor: '#E3F2FD',
                  borderRadius: 2,
                  p: 2,
                  flex: 1,
                  minWidth: '200px'
                }}>
                  <Typography sx={{ 
                    color: '#1976D2',
                    fontWeight: 600,
                    mb: 1
                  }}>
                    Thời gian thực hiện
                  </Typography>
                  <Typography sx={{ color: '#37474F' }}>
                    {currentPackageDetail.selectedTest.procedure.time}
                  </Typography>
                </Box>

                <Box sx={{ 
                  bgcolor: '#E3F2FD',
                  borderRadius: 2,
                  p: 2,
                  flex: 1,
                  minWidth: '200px'
                }}>
                  <Typography sx={{ 
                    color: '#1976D2',
                    fontWeight: 600,
                    mb: 1
                  }}>
                    Thời gian có kết quả
                  </Typography>
                  <Typography sx={{ color: '#37474F' }}>
                    {currentPackageDetail.selectedTest.procedure.results}
                  </Typography>
                </Box>

                <Box sx={{ 
                  bgcolor: '#E3F2FD',
                  borderRadius: 2,
                  p: 2,
                  flex: 1,
                  minWidth: '200px'
                }}>
                  <Typography sx={{ 
                    color: '#1976D2',
                    fontWeight: 600,
                    mb: 1
                  }}>
                    Chi phí xét nghiệm
                  </Typography>
                  <Typography sx={{ 
                    color: '#37474F',
                    fontWeight: 500
                  }}>
                    {currentPackageDetail.selectedTest.procedure.price}
                  </Typography>
                </Box>
              </Box>

              {/* Add reference value section */}
              <Typography variant="h6" gutterBottom sx={{ 
                mb: 2,
                color: '#1976D2',
                fontSize: '1.1rem',
                fontWeight: 600 
              }}>
                Giá trị tham chiếu
              </Typography>

              <Box sx={{ 
                bgcolor: 'white',
                borderRadius: 2,
                p: 2,
                border: '1px solid rgba(25, 118, 210, 0.1)'
              }}>
                <Typography 
                  component="pre"
                  sx={{ 
                    color: '#37474F',
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'inherit'
                  }}
                >
                  {currentPackageDetail.selectedTest.procedure.referenceRange || 'N/A'}
                </Typography>
              </Box>
            </Box>
          </DialogContent>

          <DialogActions 
            sx={{ 
              p: 2.5, 
              gap: 1,
              background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.05), rgba(0, 191, 165, 0.05))',
              borderTop: '1px solid rgba(0,0,0,0.05)'
            }}
          >
            <Button
              variant="outlined"
              onClick={() => setCurrentPackageDetail({
                ...currentPackageDetail,
                selectedTest: null
              })}
              sx={{ 
                borderRadius: 2, 
                px: 3,
                py: 1,
                color: '#1976D2',
                borderColor: '#1976D2',
                '&:hover': {
                  borderColor: '#1565C0',
                  bgcolor: 'rgba(25, 118, 210, 0.04)'
                }
              }}
            >
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      )}
      </Container>
    </Box>
  );
}
