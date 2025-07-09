/**
 * ReviewsContent.js - Component hiển thị nội dung đánh giá với tabs
 *
 * Chức năng:
 * - Hiển thị tabs để phân loại đánh giá: "Tất cả", "Đã đánh giá", "Chưa đánh giá"
 * - Quản lý trạng thái active tab
 * - Hiển thị danh sách đánh giá tương ứng với tab được chọn
 *
 * Design Pattern:
 * - Material-UI Tabs component với custom styling
 * - Tab panels để hiển thị nội dung khác nhau
 * - Medical theme với màu sắc phù hợp
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Card,
  CardContent,
  Rating,
  Chip,
  Avatar,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  StarBorder as StarBorderIcon,
  RateReview as RateReviewIcon,
  Close as CloseIcon,
  Star as StarIcon,
  Send as SendIcon,
  FilterList as FilterListIcon,
  Science as ScienceIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';

// Import services
import reviewService from '../../services/reviewService';
import stiService from '../../services/stiService';
import consultantService from '../../services/consultantService';

// Import utils
import { notify } from '../../utils/notify';

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`reviews-tabpanel-${index}`}
      aria-labelledby={`reviews-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Accessibility props for tabs
function a11yProps(index) {
  return {
    id: `reviews-tab-${index}`,
    'aria-controls': `reviews-tabpanel-${index}`,
  };
}

const ReviewsContent = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [stiTests, setStiTests] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [serviceFilter, setServiceFilter] = useState('all'); // 'all', 'sti', 'consultation'

  // Load reviews and services on component mount
  useEffect(() => {
    loadAllData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAllData = async () => {
    try {
      setIsLoadingReviews(true);
      await Promise.all([
        loadReviews(),
        loadSTITests(),
        loadConsultations(),
      ]);
    } catch (error) {
      notify.error('Lỗi', 'Không thể tải dữ liệu. Vui lòng thử lại!');
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const loadReviews = async () => {
    try {
      const data = await reviewService.getMyReviews();
      setReviews(data?.content || data?.data || data || []);
    } catch (error) {
      setReviews([]);
    }
  };

  const loadSTITests = async () => {
    try {
      const data = await stiService.getMySTITests();
      
      // Lọc chỉ những test đã hoàn thành với nhiều trạng thái khác nhau
      const completedStatuses = ['COMPLETED', 'RESULTED', 'FINISHED', 'DONE', 'SUCCESS', 'ANALYZED'];
      const allTests = data?.data || data || [];
      
      const completedTests = allTests.filter(test => {
        const hasValidId = test.id || test.serviceId;
        const hasValidStatus = test.status && completedStatuses.includes(test.status.toUpperCase());
        
        return hasValidId && hasValidStatus;
      });
      
      setStiTests(completedTests);
    } catch (error) {
      setStiTests([]);
    }
  };

  const loadConsultations = async () => {
    try {
      const data = await consultantService.getMyConsultations();
      
      // Lọc chỉ những consultation đã hoàn thành với nhiều trạng thái khác nhau
      const completedStatuses = ['COMPLETED', 'RESULTED', 'FINISHED', 'DONE', 'SUCCESS', 'CLOSED'];
      const allConsultations = data?.data || data || [];
      
      const completedConsultations = allConsultations.filter(consultation => {
        const hasValidId = consultation.id || consultation.consultantId;
        const hasValidStatus = consultation.status && completedStatuses.includes(consultation.status.toUpperCase());
        
        return hasValidId && hasValidStatus;
      });
      
      setConsultations(completedConsultations);
    } catch (error) {
      setConsultations([]);
    }
  };

  // Tạo danh sách tất cả các dịch vụ có thể đánh giá
  const createReviewableServices = () => {
    const reviewableServices = [];
    
    // Thêm STI Tests đã hoàn thành và chưa được đánh giá
    stiTests.forEach((test, index) => {
      // Kiểm tra dữ liệu hợp lệ
      if (!test || (!test.id && !test.serviceId)) {
        return;
      }

      // Tạo unique ID cho service
      const uniqueId = test.id || test.serviceId || `sti_temp_${index}_${Date.now()}`;
      
      // Kiểm tra xem đã có đánh giá cho test này chưa
      const existingReview = reviews.find(review => 
        (review.targetType === 'STI_SERVICE' && review.targetId === test.serviceId) ||
        (review.testId && review.testId === test.id)
      );
      
      // Kiểm tra trạng thái hoàn thành với nhiều trạng thái khác nhau
      const completedStatuses = ['COMPLETED', 'RESULTED', 'FINISHED', 'DONE', 'SUCCESS', 'ANALYZED'];
      const isCompleted = completedStatuses.includes(test.status?.toUpperCase());
      
      // Chỉ thêm vào danh sách nếu test đã hoàn thành và có serviceId
      if (isCompleted && test.serviceId) {
        // Kiểm tra xem có đủ thông tin cần thiết không
        const hasRequiredInfo = test.serviceId && test.serviceName;
        
        reviewableServices.push({
          id: `sti_${uniqueId}`,
          type: 'STI_SERVICE',
          serviceId: test.serviceId,
          serviceName: test.serviceName || `Xét nghiệm STI #${test.id || 'N/A'}`,
          consultantName: test.consultantName || 'Chuyên viên STI',
          date: test.completedDate || test.updatedAt || new Date().toISOString(),
          status: existingReview ? 'completed' : 'pending',
          rating: existingReview?.rating || 0,
          comment: existingReview?.comment || '',
          reviewId: existingReview?.id,
          testId: test.id,
          // Thêm thông tin để kiểm tra điều kiện - strict hơn
          isEligible: isCompleted && !existingReview && test.serviceId && hasRequiredInfo,
        });
      }
    });

    // Thêm Consultations đã hoàn thành và chưa được đánh giá
    consultations.forEach((consultation, index) => {
      // Kiểm tra dữ liệu hợp lệ
      if (!consultation || (!consultation.id && !consultation.consultantId)) {
        return;
      }

      // Tạo unique ID cho consultation
      const uniqueId = consultation.id || `consultation_temp_${index}_${Date.now()}`;
      
      // Kiểm tra xem đã có đánh giá cho consultation này chưa
      const existingReview = reviews.find(review => 
        (review.targetType === 'CONSULTANT' && review.targetId === consultation.consultantId) ||
        (review.consultationId && review.consultationId === consultation.id)
      );
      
      // Kiểm tra trạng thái hoàn thành với nhiều trạng thái khác nhau
      const completedStatuses = ['COMPLETED', 'RESULTED', 'FINISHED', 'DONE', 'SUCCESS', 'CLOSED'];
      const isCompleted = completedStatuses.includes(consultation.status?.toUpperCase());
      
      // Chỉ thêm vào danh sách nếu consultation đã hoàn thành và có consultantId
      if (isCompleted && consultation.consultantId) {
        // Kiểm tra xem có đủ thông tin cần thiết không
        const hasRequiredInfo = consultation.consultantId && consultation.consultantName;
        
        reviewableServices.push({
          id: `consultation_${uniqueId}`,
          type: 'CONSULTANT',
          consultantId: consultation.consultantId,
          serviceName: `Tư vấn với ${consultation.consultantName || 'Chuyên viên'}`,
          consultantName: consultation.consultantName || 'Chuyên viên tư vấn',
          date: consultation.completedDate || consultation.updatedAt || new Date().toISOString(),
          status: existingReview ? 'completed' : 'pending',
          rating: existingReview?.rating || 0,
          comment: existingReview?.comment || '',
          reviewId: existingReview?.id,
          consultationId: consultation.id,
          // Thêm thông tin để kiểm tra điều kiện - strict hơn
          isEligible: isCompleted && !existingReview && consultation.consultantId && hasRequiredInfo,
          // Thêm debug info
          debugInfo: {
            originalStatus: consultation.status,
            isCompleted,
            hasExistingReview: !!existingReview,
            hasConsultantId: !!consultation.consultantId,
            hasRequiredInfo,
          }
        });
      }
    });

    return reviewableServices;
  };

  const allReviewableServices = createReviewableServices();

  
  // Apply service filter with memoized services
  const filteredServices = allReviewableServices.filter(service => {
    if (serviceFilter === 'all') return true;
    if (serviceFilter === 'sti') return service.type === 'STI_SERVICE';
    if (serviceFilter === 'consultation') return service.type === 'CONSULTANT';
    return true;
  });

  const completedReviews = filteredServices.filter(service => service.status === 'completed');
  const pendingReviews = filteredServices.filter(service => service.status === 'pending');
  const allReviews = filteredServices;

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpenReviewDialog = async (review) => {
    // Kiểm tra điều kiện đánh giá cơ bản
    if (!review.isEligible && review.status === 'pending') {
      let message = 'Bạn chỉ có thể đánh giá sau khi dịch vụ được hoàn thành và có kết quả.';
      
      // Thông báo cụ thể cho từng loại dịch vụ
      if (review.type === 'STI_SERVICE') {
        message = 'Để đánh giá xét nghiệm STI, bạn cần:\n• Hoàn thành xét nghiệm và có kết quả\n• Trạng thái test phải là "COMPLETED", "RESULTED" hoặc "ANALYZED"';
      } else if (review.type === 'CONSULTANT') {
        message = 'Để đánh giá tư vấn viên, bạn cần:\n• Hoàn thành buổi tư vấn\n• Trạng thái tư vấn phải là "COMPLETED", "FINISHED" hoặc "CLOSED"';
      }
      
      notify.warning('Không thể đánh giá', message);
      return;
    }
    
    if (review.status === 'completed') {
      notify.info(
        'Đã đánh giá', 
        'Bạn đã đánh giá dịch vụ này rồi. Mỗi dịch vụ chỉ được đánh giá một lần.'
      );
      return;
    }

    // Kiểm tra thêm các điều kiện cần thiết
    if (review.type === 'STI_SERVICE' && !review.serviceId) {
      notify.error('Lỗi dữ liệu', 'Thiếu thông tin dịch vụ. Vui lòng làm mới trang và thử lại.');
      return;
    }

    if (review.type === 'CONSULTANT' && !review.consultantId) {
      notify.error('Lỗi dữ liệu', 'Thiếu thông tin tư vấn viên. Vui lòng làm mới trang và thử lại.');
      return;
    }
    
    // Hiển thị thông báo loading khi kiểm tra điều kiện với backend
    setLoading(true);
    
    try {
      setSelectedReview(review);
      setRating(0);
      setFeedback('');
      setReviewDialogOpen(true);
    } catch (error) {
      notify.error('Lỗi kiểm tra', 'Không thể kiểm tra điều kiện đánh giá. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseReviewDialog = () => {
    setReviewDialogOpen(false);
    setSelectedReview(null);
    setRating(0);
    setFeedback('');
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      notify.warning('Thông báo', 'Vui lòng chọn số sao đánh giá!');
      return;
    }

    if (feedback.trim().length < 10) {
      notify.warning('Thông báo', 'Vui lòng nhập ít nhất 10 ký tự cho phần đánh giá!');
      return;
    }

    try {
      setLoading(true);
      const reviewData = {
        rating: rating,
        comment: feedback.trim(),
      };

      // Kiểm tra chi tiết điều kiện trước khi gửi
      if (!selectedReview.isEligible) {
        let reason = 'Bạn không đủ điều kiện để đánh giá dịch vụ này.';
        
        if (selectedReview.debugInfo) {
          const debug = selectedReview.debugInfo;
          if (!debug.isCompleted) {
            reason = `Dịch vụ chưa hoàn thành (trạng thái hiện tại: "${debug.originalStatus}"). Chỉ có thể đánh giá sau khi dịch vụ đã hoàn thành.`;
          } else if (debug.hasExistingReview) {
            reason = 'Bạn đã đánh giá dịch vụ này rồi. Mỗi dịch vụ chỉ được đánh giá một lần.';
          } else if (!debug.hasRequiredInfo) {
            reason = 'Thiếu thông tin cần thiết để đánh giá dịch vụ này.';
          }
        }
        
        throw new Error(reason);
      }

      // Kiểm tra thêm điều kiện cụ thể cho từng loại đánh giá
      if (selectedReview.type === 'STI_SERVICE') {
        // Kiểm tra serviceId và testId
        if (!selectedReview.serviceId) {
          throw new Error('Thiếu thông tin serviceId. Không thể gửi đánh giá cho dịch vụ STI.');
        }
        if (!selectedReview.testId) {
          // Thiếu testId, nhưng có serviceId nên vẫn tiếp tục
        }
        
        // Kiểm tra thêm xem có phải là dịch vụ của user này không
        const originalTest = stiTests.find(test => 
          test.serviceId === selectedReview.serviceId || test.id === selectedReview.testId
        );
        if (!originalTest) {
          throw new Error('Không tìm thấy thông tin dịch vụ STI tương ứng. Vui lòng thử lại.');
        }
        
        // Kiểm tra điều kiện với backend trước khi gửi (nếu API hỗ trợ)
        try {
          const eligibilityCheck = await reviewService.checkSTIServiceEligibility(selectedReview.serviceId);
          if (eligibilityCheck && !eligibilityCheck.eligible) {
            throw new Error(`Backend từ chối: ${eligibilityCheck.message || 'Không đủ điều kiện đánh giá dịch vụ này'}`);
          }
        } catch (eligibilityError) {
          // Nếu API eligibility không tồn tại hoặc lỗi server, tiếp tục với validation frontend
          if (eligibilityError.message?.includes('not available') || 
              eligibilityError.message?.includes('404') ||
              eligibilityError.message?.includes('No static resource') ||
              eligibilityError.response?.status === 404 ||
              eligibilityError.response?.status === 500) {
            // Skip eligibility check
          } else {
            // Nếu là lỗi khác (thực sự từ business logic), throw lỗi đó
            throw eligibilityError;
          }
        }
        
        // Đánh giá cho dịch vụ STI
        const stiReviewData = {
          ...reviewData,
          stiTestId: selectedReview.testId // Thêm stiTestId theo yêu cầu backend
        };
        await reviewService.createSTIServiceReview(selectedReview.serviceId, stiReviewData);
        
      } else if (selectedReview.type === 'STI_PACKAGE') {
        // Kiểm tra packageId
        if (!selectedReview.packageId) {
          throw new Error('Thiếu thông tin packageId. Không thể gửi đánh giá cho gói STI.');
        }
        
        // Đánh giá cho gói STI
        const stiPackageReviewData = {
          ...reviewData,
          stiTestId: selectedReview.testId // Thêm stiTestId theo yêu cầu backend
        };
        await reviewService.createSTIPackageReview(selectedReview.packageId, stiPackageReviewData);
        
      } else if (selectedReview.type === 'CONSULTANT') {
        // Kiểm tra consultantId và consultationId
        if (!selectedReview.consultantId) {
          throw new Error('Thiếu thông tin consultantId. Không thể gửi đánh giá cho tư vấn viên.');
        }
        if (!selectedReview.consultationId) {
          // Thiếu consultationId, nhưng có consultantId nên vẫn tiếp tục
        }
        
        // Kiểm tra thêm xem có phải là consultation của user này không
        const originalConsultation = consultations.find(consultation => 
          consultation.consultantId === selectedReview.consultantId || consultation.id === selectedReview.consultationId
        );
        if (!originalConsultation) {
          throw new Error('Không tìm thấy thông tin buổi tư vấn tương ứng. Vui lòng thử lại.');
        }
        
        // Kiểm tra điều kiện với backend trước khi gửi (nếu API hỗ trợ)
        try {
          const eligibilityCheck = await reviewService.checkConsultantEligibility(selectedReview.consultantId);
          if (eligibilityCheck && !eligibilityCheck.eligible) {
            throw new Error(`Backend từ chối: ${eligibilityCheck.message || 'Không đủ điều kiện đánh giá tư vấn viên này'}`);
          }
        } catch (eligibilityError) {
          // Nếu API eligibility không tồn tại hoặc lỗi server, tiếp tục với validation frontend
          if (eligibilityError.message?.includes('not available') || 
              eligibilityError.message?.includes('404') ||
              eligibilityError.message?.includes('No static resource') ||
              eligibilityError.response?.status === 404 ||
              eligibilityError.response?.status === 500) {
            // Skip eligibility check
          } else {
            // Nếu là lỗi khác (thực sự từ business logic), throw lỗi đó
            throw eligibilityError;
          }
        }
        
        // Đánh giá cho tư vấn viên
        const consultantReviewData = {
          ...reviewData,
          consultationId: selectedReview.consultationId // Thêm consultationId theo yêu cầu backend
        };
        await reviewService.createConsultantReview(selectedReview.consultantId, consultantReviewData);
        
      } else {
        throw new Error(`Loại đánh giá không được hỗ trợ: ${selectedReview.type}`);
      }

      notify.success('Thành công', 'Đánh giá của bạn đã được gửi thành công!');
      
      // Reload data to update the list
      await loadAllData();
      
      handleCloseReviewDialog();
    } catch (error) {
      // Handle specific error messages
      let errorMessage = 'Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại!';
      let errorTitle = 'Không thể gửi đánh giá';
      
      if (error.message) {
        // Kiểm tra các lỗi từ frontend validation
        if (error.message.includes('Bạn không đủ điều kiện') || 
            error.message.includes('Dịch vụ chưa hoàn thành') ||
            error.message.includes('Bạn đã đánh giá') ||
            error.message.includes('Thiếu thông tin')) {
          errorMessage = error.message;
          errorTitle = 'Điều kiện không được đáp ứng';
        }
        // Kiểm tra lỗi từ backend
        else if (error.message.includes('not eligible to rate') || 
            error.message.includes('You are not eligible')) {
          errorMessage = 'Backend xác nhận bạn không đủ điều kiện đánh giá dịch vụ này. Có thể do:\n• Dịch vụ chưa hoàn thành\n• Bạn đã đánh giá rồi\n• Dịch vụ không thuộc về tài khoản của bạn\n• Thời gian đánh giá đã hết hạn';
          errorTitle = 'Không đủ điều kiện đánh giá';
        } else if (error.message.includes('already reviewed') || 
                   error.message.includes('already rated') ||
                   error.message.includes('duplicate')) {
          errorMessage = 'Bạn đã đánh giá dịch vụ này rồi. Mỗi dịch vụ chỉ được đánh giá một lần.';
          errorTitle = 'Đánh giá trùng lặp';
        } else if (error.message.includes('service not found') || 
                   error.message.includes('not found') ||
                   error.message.includes('consultant not found')) {
          errorMessage = 'Không tìm thấy thông tin dịch vụ hoặc tư vấn viên. Vui lòng làm mới trang và thử lại.';
          errorTitle = 'Không tìm thấy dữ liệu';
        } else if (error.message.includes('unauthorized') || 
                   error.message.includes('Unauthorized') ||
                   error.message.includes('authentication') ||
                   error.message.includes('permission')) {
          errorMessage = 'Bạn không có quyền thực hiện hành động này. Vui lòng đăng nhập lại.';
          errorTitle = 'Không có quyền truy cập';
        } else if (error.message.includes('network') || 
                   error.message.includes('Network') ||
                   error.message.includes('connection')) {
          errorMessage = 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet và thử lại.';
          errorTitle = 'Lỗi kết nối';
        } else if (error.message.includes('timeout') || 
                   error.message.includes('Timeout')) {
          errorMessage = 'Yêu cầu quá thời gian chờ. Vui lòng thử lại sau.';
          errorTitle = 'Hết thời gian chờ';
        } else {
          errorMessage = error.message;
        }
      }
      
      // Kiểm tra lỗi từ response backend
      if (error.response?.data?.message) {
        const backendMessage = error.response.data.message;
        
        // Ưu tiên sử dụng message từ backend nếu có thông tin cụ thể
        if (backendMessage.includes('not eligible') || 
            backendMessage.includes('không đủ điều kiện') ||
            backendMessage.includes('You are not eligible')) {
          errorMessage = `Không đủ điều kiện đánh giá: ${backendMessage}`;
          errorTitle = 'Backend từ chối yêu cầu';
        } else if (backendMessage.includes('already')) {
          errorMessage = `Đã tồn tại: ${backendMessage}`;
          errorTitle = 'Dữ liệu trùng lặp';
        } else if (backendMessage.includes('not found')) {
          errorMessage = `Không tìm thấy: ${backendMessage}`;
          errorTitle = 'Dữ liệu không tồn tại';
        } else if (backendMessage.trim()) {
          errorMessage = backendMessage;
        }
      }
      
      notify.error(errorTitle, errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderCompletedReview = (review) => (
    <Card 
      key={review.id} 
      sx={{ 
        mb: 3,
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(74, 144, 226, 0.08)',
        border: '1px solid rgba(74, 144, 226, 0.1)',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 30px rgba(74, 144, 226, 0.15)',
        }
      }}
    >
      {/* Service type indicator */}
      <Box
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          background: review.type === 'STI_SERVICE' 
            ? 'rgba(255, 152, 0, 0.1)' 
            : 'rgba(76, 175, 80, 0.1)',
          color: review.type === 'STI_SERVICE' ? '#FF9800' : '#4CAF50',
          px: 1.5,
          py: 0.5,
          borderRadius: '12px',
          border: `1px solid ${review.type === 'STI_SERVICE' ? 'rgba(255, 152, 0, 0.2)' : 'rgba(76, 175, 80, 0.2)'}`,
          fontSize: '12px',
          fontWeight: 600,
        }}
      >
        {review.type === 'STI_SERVICE' ? (
          <>
            <ScienceIcon sx={{ fontSize: '14px' }} />
            STI
          </>
        ) : (
          <>
            <PsychologyIcon sx={{ fontSize: '14px' }} />
            Tư vấn
          </>
        )}
      </Box>

      <CardContent sx={{ p: 3 }}>
        <Grid container spacing={3} alignItems="flex-start">
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar 
                sx={{ 
                  width: 48, 
                  height: 48, 
                  mr: 2,
                  background: 'linear-gradient(135deg, #4A90E2, #1ABC9C)',
                  fontSize: '18px',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(74, 144, 226, 0.3)',
                }}
              >
                {review.consultantName.split(' ').pop()[0]}
              </Avatar>
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    color: '#2D3748', 
                    mb: 0.5,
                    fontSize: '18px'
                  }}
                >
                  {review.serviceName}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#4A5568',
                    fontSize: '14px',
                    fontWeight: 500
                  }}
                >
                  {review.consultantName}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Rating 
                value={review.rating} 
                readOnly 
                sx={{ 
                  mb: 1.5,
                  '& .MuiRating-iconFilled': {
                    color: '#FFB400',
                  },
                  '& .MuiRating-iconEmpty': {
                    color: '#E0E7FF',
                  }
                }} 
              />
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#2D3748',
                  fontSize: '15px',
                  lineHeight: 1.6,
                  fontStyle: 'italic',
                  pl: 1,
                  borderLeft: '3px solid #4A90E2',
                  background: 'rgba(74, 144, 226, 0.05)',
                  p: 2,
                  borderRadius: '8px',
                }}
              >
                "{review.comment}"
              </Typography>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
              <Chip
                icon={<CheckCircleIcon sx={{ fontSize: '16px !important' }} />}
                label="Đã đánh giá"
                sx={{
                  mb: 2,
                  background: 'linear-gradient(45deg, #4CAF50, #2ECC71)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '12px',
                  height: '32px',
                  boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                  '& .MuiChip-icon': {
                    color: '#fff'
                  }
                }}
              />
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#4A5568',
                  fontSize: '13px',
                  fontWeight: 500,
                  background: 'rgba(74, 144, 226, 0.1)',
                  px: 2,
                  py: 0.5,
                  borderRadius: '12px',
                }}
              >
                {new Date(review.date).toLocaleDateString('vi-VN')}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderPendingReview = (review) => (
    <Card 
      key={review.id} 
      sx={{ 
        mb: 3,
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(255, 152, 0, 0.08)',
        border: '1px solid rgba(255, 152, 0, 0.2)',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 30px rgba(255, 152, 0, 0.15)',
        }
      }}
    >
      {/* Service type indicator */}
      <Box
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          background: review.type === 'STI_SERVICE' 
            ? 'rgba(255, 152, 0, 0.1)' 
            : 'rgba(76, 175, 80, 0.1)',
          color: review.type === 'STI_SERVICE' ? '#FF9800' : '#4CAF50',
          px: 1.5,
          py: 0.5,
          borderRadius: '12px',
          border: `1px solid ${review.type === 'STI_SERVICE' ? 'rgba(255, 152, 0, 0.2)' : 'rgba(76, 175, 80, 0.2)'}`,
          fontSize: '12px',
          fontWeight: 600,
        }}
      >
        {review.type === 'STI_SERVICE' ? (
          <>
            <ScienceIcon sx={{ fontSize: '14px' }} />
            STI
          </>
        ) : (
          <>
            <PsychologyIcon sx={{ fontSize: '14px' }} />
            Tư vấn
          </>
        )}
      </Box>

      <CardContent sx={{ p: 3 }}>
        <Grid container spacing={3} alignItems="flex-start">
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar 
                sx={{ 
                  width: 48, 
                  height: 48, 
                  mr: 2,
                  background: 'linear-gradient(135deg, #FF9800, #FFB74D)',
                  fontSize: '18px',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)',
                }}
              >
                {review.consultantName.split(' ').pop()[0]}
              </Avatar>
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    color: '#2D3748', 
                    mb: 0.5,
                    fontSize: '18px'
                  }}
                >
                  {review.serviceName}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#4A5568',
                    fontSize: '14px',
                    fontWeight: 500
                  }}
                >
                  {review.consultantName}
                </Typography>
                
                {/* Hiển thị trạng thái và điều kiện cho pending review */}
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={review.type === 'STI_SERVICE' ? 
                      `Xét nghiệm: ${review.isEligible ? 'Hoàn thành' : 'Đang xử lý'}` :
                      `Tư vấn: ${review.isEligible ? 'Hoàn thành' : 'Đang xử lý'}`
                    }
                    size="small"
                    sx={{
                      fontSize: '11px',
                      height: '20px',
                      backgroundColor: review.isEligible ? '#E8F5E8' : '#FFF3E0',
                      color: review.isEligible ? '#4CAF50' : '#FF9800',
                      border: `1px solid ${review.isEligible ? '#4CAF50' : '#FF9800'}`,
                    }}
                  />
                  {!review.isEligible && (
                    <Typography variant="caption" sx={{ color: '#757575', fontSize: '11px' }}>
                      {review.type === 'STI_SERVICE' ? 
                        '• Cần có kết quả xét nghiệm và trạng thái COMPLETED/RESULTED/ANALYZED' : 
                        '• Cần hoàn thành buổi tư vấn và trạng thái COMPLETED/FINISHED/CLOSED'
                      }
                    </Typography>
                  )}

                </Box>
              </Box>
            </Box>
            
            <Box 
              sx={{ 
                background: review.isEligible 
                  ? 'linear-gradient(135deg, #FFF3E0, #FFE0B2)'
                  : 'linear-gradient(135deg, #FAFAFA, #F5F5F5)',
                p: 2.5,
                borderRadius: '12px',
                border: review.isEligible 
                  ? '1px solid rgba(255, 152, 0, 0.2)'
                  : '1px solid rgba(158, 158, 158, 0.2)',
                mb: 2
              }}
            >
              <Typography 
                variant="body1" 
                sx={{ 
                  color: review.isEligible ? '#E65100' : '#757575',
                  fontSize: '15px',
                  fontWeight: 600,
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1
                }}
              >
                <StarBorderIcon sx={{ fontSize: '20px' }} />
                {review.isEligible 
                  ? 'Hãy chia sẻ trải nghiệm của bạn về dịch vụ này'
                  : 'Dịch vụ cần được hoàn thành trước khi đánh giá'
                }
              </Typography>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'flex-end' }, gap: 2 }}>
              <Chip
                icon={<ScheduleIcon sx={{ fontSize: '16px !important' }} />}
                label="Chưa đánh giá"
                sx={{
                  background: 'linear-gradient(45deg, #FF9800, #FFB74D)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '12px',
                  height: '32px',
                  boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)',
                  '& .MuiChip-icon': {
                    color: '#fff'
                  }
                }}
              />
              
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#4A5568',
                  fontSize: '13px',
                  fontWeight: 500,
                  background: 'rgba(255, 152, 0, 0.1)',
                  px: 2,
                  py: 0.5,
                  borderRadius: '12px',
                }}
              >
                {new Date(review.date).toLocaleDateString('vi-VN')}
              </Typography>
              
              <Button
                variant="contained"
                size="medium"
                startIcon={<RateReviewIcon />}
                onClick={() => handleOpenReviewDialog(review)}
                disabled={!review.isEligible}
                sx={{
                  background: review.isEligible 
                    ? 'linear-gradient(45deg, #4A90E2, #1ABC9C)'
                    : 'rgba(158, 158, 158, 0.5)',
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '14px',
                  py: 1.5,
                  px: 3,
                  boxShadow: review.isEligible 
                    ? '0 4px 16px rgba(74, 144, 226, 0.3)'
                    : 'none',
                  color: review.isEligible ? '#fff' : 'rgba(0, 0, 0, 0.38)',
                  '&:hover': review.isEligible ? {
                    background: 'linear-gradient(45deg, #357ABD, #16A085)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(74, 144, 226, 0.4)',
                  } : {},
                  transition: 'all 0.3s ease',
                  '&:disabled': {
                    background: 'rgba(158, 158, 158, 0.3)',
                    color: 'rgba(0, 0, 0, 0.38)',
                  }
                }}
              >
                {review.isEligible ? 'Đánh giá ngay' : 'Chưa đủ điều kiện'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ width: '100%' }}>
      {/* Filter Section */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 3,
          p: 2.5,
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '16px',
          border: '1px solid rgba(74, 144, 226, 0.1)',
          boxShadow: '0 4px 20px rgba(74, 144, 226, 0.05)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterListIcon sx={{ color: '#4A90E2', fontSize: '20px' }} />
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#2D3748' }}>
              Lọc theo loại dịch vụ:
            </Typography>
          </Box>
          
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel 
              sx={{ 
                color: '#4A90E2',
                '&.Mui-focused': { color: '#4A90E2' }
              }}
            >
              Loại dịch vụ
            </InputLabel>
            <Select
              value={serviceFilter}
              label="Loại dịch vụ"
              onChange={(e) => setServiceFilter(e.target.value)}
              sx={{
                borderRadius: '12px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(74, 144, 226, 0.2)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#4A90E2',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#4A90E2',
                },
              }}
            >
              <MenuItem value="all">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StarIcon sx={{ fontSize: '18px', color: '#4A90E2' }} />
                  Tất cả dịch vụ
                </Box>
              </MenuItem>
              <MenuItem value="sti">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ScienceIcon sx={{ fontSize: '18px', color: '#FF9800' }} />
                  Xét nghiệm STI
                </Box>
              </MenuItem>
              <MenuItem value="consultation">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PsychologyIcon sx={{ fontSize: '18px', color: '#4CAF50' }} />
                  Tư vấn chuyên viên
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          {/* Statistics */}
          <Box sx={{ display: 'flex', gap: 2, ml: 'auto' }}>
            <Chip
              icon={<ScienceIcon sx={{ fontSize: '16px !important' }} />}
              label={`STI: ${allReviewableServices.filter(s => s.type === 'STI_SERVICE').length}`}
              size="small"
              sx={{
                background: 'rgba(255, 152, 0, 0.1)',
                color: '#FF9800',
                fontWeight: 600,
                border: '1px solid rgba(255, 152, 0, 0.2)',
                '& .MuiChip-icon': { color: '#FF9800' }
              }}
            />
            <Chip
              icon={<PsychologyIcon sx={{ fontSize: '16px !important' }} />}
              label={`Tư vấn: ${allReviewableServices.filter(s => s.type === 'CONSULTANT').length}`}
              size="small"
              sx={{
                background: 'rgba(76, 175, 80, 0.1)',
                color: '#4CAF50',
                fontWeight: 600,
                border: '1px solid rgba(76, 175, 80, 0.2)',
                '& .MuiChip-icon': { color: '#4CAF50' }
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Loading State */}
      {isLoadingReviews ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={40} sx={{ color: '#4A90E2' }} />
        </Box>
      ) : (
        <>
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="reviews tabs"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '14px',
              minHeight: 48,
              '&.Mui-selected': {
                color: '#4A90E2',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#4A90E2',
              height: 3,
            },
          }}
        >
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <StarIcon fontSize="small" />
                TẤT CẢ
                <Chip
                  label={allReviews.length}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '11px',
                    bgcolor: '#E3F2FD',
                    color: '#4A90E2',
                  }}
                />
              </Box>
            }
            {...a11yProps(0)}
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon fontSize="small" />
                ĐÃ ĐÁNH GIÁ
                <Chip
                  label={completedReviews.length}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '11px',
                    bgcolor: '#E8F5E8',
                    color: '#4CAF50',
                  }}
                />
              </Box>
            }
            {...a11yProps(1)}
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ScheduleIcon fontSize="small" />
                CHƯA ĐÁNH GIÁ
                <Chip
                  label={pendingReviews.length}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '11px',
                    bgcolor: '#FFF3E0',
                    color: '#FF9800',
                  }}
                />
              </Box>
            }
            {...a11yProps(2)}
          />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={activeTab} index={0}>
        {allReviews.length > 0 ? (
          allReviews.map((review) =>
            review.status === 'completed'
              ? renderCompletedReview(review)
              : renderPendingReview(review)
          )
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            {serviceFilter === 'sti' && <ScienceIcon sx={{ fontSize: 64, color: '#E0E0E0', mb: 2 }} />}
            {serviceFilter === 'consultation' && <PsychologyIcon sx={{ fontSize: 64, color: '#E0E0E0', mb: 2 }} />}
            {serviceFilter === 'all' && <StarIcon sx={{ fontSize: 64, color: '#E0E0E0', mb: 2 }} />}
            <Typography variant="h6" color="text.secondary">
              {serviceFilter === 'sti' && 'Chưa có đánh giá xét nghiệm STI nào'}
              {serviceFilter === 'consultation' && 'Chưa có đánh giá tư vấn nào'}
              {serviceFilter === 'all' && 'Chưa có đánh giá nào'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {serviceFilter === 'sti' && 'Các đánh giá xét nghiệm STI sẽ xuất hiện ở đây sau khi bạn sử dụng dịch vụ'}
              {serviceFilter === 'consultation' && 'Các đánh giá tư vấn sẽ xuất hiện ở đây sau khi bạn sử dụng dịch vụ'}
              {serviceFilter === 'all' && 'Các đánh giá sẽ xuất hiện ở đây sau khi bạn sử dụng dịch vụ'}
            </Typography>
          </Box>
        )}
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        {completedReviews.length > 0 ? (
          completedReviews.map(renderCompletedReview)
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircleIcon sx={{ fontSize: 64, color: '#E0E0E0', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              {serviceFilter === 'sti' && 'Chưa có đánh giá xét nghiệm STI nào hoàn thành'}
              {serviceFilter === 'consultation' && 'Chưa có đánh giá tư vấn nào hoàn thành'}
              {serviceFilter === 'all' && 'Chưa có đánh giá nào hoàn thành'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Các đánh giá đã hoàn thành sẽ xuất hiện ở đây
            </Typography>
          </Box>
        )}
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        {pendingReviews.length > 0 ? (
          pendingReviews.map(renderPendingReview)
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <ScheduleIcon sx={{ fontSize: 64, color: '#E0E0E0', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              {serviceFilter === 'sti' && 'Không có xét nghiệm STI nào đang chờ đánh giá'}
              {serviceFilter === 'consultation' && 'Không có tư vấn nào đang chờ đánh giá'}
              {serviceFilter === 'all' && 'Không có đánh giá đang chờ'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Các dịch vụ cần đánh giá sẽ xuất hiện ở đây
            </Typography>
          </Box>
        )}
      </TabPanel>

      {/* Review Dialog */}
      <Dialog
        open={reviewDialogOpen}
        onClose={handleCloseReviewDialog}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #F5F7FA 0%, #E3F2FD 50%, #F5F7FA 100%)',
            boxShadow: '0 20px 60px rgba(74, 144, 226, 0.2)',
            maxHeight: '90vh',
            overflow: 'hidden',
          },
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(45, 55, 72, 0.4)',
            backdropFilter: 'blur(5px)',
          }
        }}
        TransitionProps={{
          timeout: 500,
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '20px 20px 0 0',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <RateReviewIcon sx={{ fontSize: '28px' }} />
            Đánh giá dịch vụ
          </Box>
          <IconButton
            onClick={handleCloseReviewDialog}
            sx={{ 
              color: '#fff',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: { xs: 2, md: 4 }, overflow: 'auto' }}>
          {selectedReview && (
            <Box>
              {/* Service Info */}
              <Box 
                sx={{ 
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '16px',
                  p: 3,
                  mb: 4,
                  border: '1px solid rgba(74, 144, 226, 0.1)',
                  boxShadow: '0 4px 20px rgba(74, 144, 226, 0.05)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    sx={{ 
                      width: 56, 
                      height: 56, 
                      mr: 3,
                      background: 'linear-gradient(135deg, #4A90E2, #1ABC9C)',
                      fontSize: '24px',
                      fontWeight: 600,
                    }}
                  >
                    {selectedReview.consultantName.split(' ').pop()[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#2D3748', mb: 0.5 }}>
                      {selectedReview.serviceName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#4A5568', fontWeight: 500 }}>
                      Bác sĩ: {selectedReview.consultantName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6B7280' }}>
                      Ngày sử dụng: {new Date(selectedReview.date).toLocaleDateString('vi-VN')}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Rating Section */}
              <Box sx={{ mb: 4 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    color: '#2D3748', 
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <StarIcon sx={{ color: '#FFB400' }} />
                  Đánh giá của bạn
                </Typography>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '12px',
                    p: 3,
                    border: '1px solid rgba(74, 144, 226, 0.1)',
                  }}
                >
                  <Rating
                    value={rating}
                    onChange={(event, newValue) => setRating(newValue)}
                    size="large"
                    sx={{
                      '& .MuiRating-iconFilled': {
                        color: '#FFB400',
                      },
                      '& .MuiRating-iconEmpty': {
                        color: '#E0E7FF',
                      },
                      '& .MuiRating-iconHover': {
                        color: '#FFCA28',
                      }
                    }}
                  />
                  <Typography variant="body1" sx={{ color: '#4A5568', fontWeight: 500 }}>
                    {rating === 0 && 'Chọn số sao'}
                    {rating === 1 && 'Rất không hài lòng'}
                    {rating === 2 && 'Không hài lòng'}
                    {rating === 3 && 'Bình thường'}
                    {rating === 4 && 'Hài lòng'}
                    {rating === 5 && 'Rất hài lòng'}
                  </Typography>
                </Box>
              </Box>

              {/* Feedback Section */}
              <Box sx={{ mb: 3 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    color: '#2D3748', 
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <RateReviewIcon sx={{ color: '#4A90E2' }} />
                  Chia sẻ chi tiết
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Hãy chia sẻ trải nghiệm chi tiết về dịch vụ này... (ít nhất 10 ký tự)"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  helperText={`${feedback.length}/500 ký tự`}
                  inputProps={{ maxLength: 500 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.8)',
                      '&:hover fieldset': {
                        borderColor: '#4A90E2',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4A90E2',
                        borderWidth: '2px',
                      },
                    },
                    '& .MuiFormHelperText-root': {
                      textAlign: 'right',
                      color: feedback.length > 450 ? '#FF5722' : '#6B7280',
                      fontWeight: 500,
                    }
                  }}
                />
                
                {/* Quick feedback suggestions */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" sx={{ color: '#6B7280', mb: 1, display: 'block' }}>
                    Gợi ý nội dung đánh giá:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {[
                      'Dịch vụ chuyên nghiệp',
                      'Bác sĩ tận tâm',
                      'Quy trình nhanh chóng',
                      'Kết quả chính xác',
                      'Môi trường sạch sẽ',
                      'Nhân viên thân thiện'
                    ].map((suggestion, index) => (
                      <Chip
                        key={index}
                        label={suggestion}
                        size="small"
                        onClick={() => {
                          if (feedback.length + suggestion.length + 2 <= 500) {
                            setFeedback(prev => 
                              prev ? `${prev}, ${suggestion}` : suggestion
                            );
                          }
                        }}
                        sx={{
                          cursor: 'pointer',
                          fontSize: '11px',
                          height: '24px',
                          '&:hover': {
                            backgroundColor: '#E3F2FD',
                          },
                          border: '1px solid #E0E7FF',
                          color: '#4A90E2',
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions 
          sx={{ 
            p: { xs: 2, md: 3 }, 
            background: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '0 0 20px 20px',
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' }
          }}
        >
          <Button
            onClick={handleCloseReviewDialog}
            variant="outlined"
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1.5,
              borderColor: '#4A90E2',
              color: '#4A90E2',
              '&:hover': {
                borderColor: '#357ABD',
                background: 'rgba(74, 144, 226, 0.05)',
              }
            }}
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={handleSubmitReview}
            variant="contained"
            disabled={rating === 0 || feedback.trim().length < 10 || loading}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              background: rating > 0 && feedback.trim().length >= 10 && !loading
                ? 'linear-gradient(45deg, #4A90E2, #1ABC9C)'
                : '#E0E7FF',
              '&:hover': {
                background: rating > 0 && feedback.trim().length >= 10 && !loading
                  ? 'linear-gradient(45deg, #357ABD, #16A085)'
                  : '#E0E7FF',
              },
              '&:disabled': {
                color: '#9CA3AF'
              }
            }}
          >
            {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
          </Button>
        </DialogActions>
      </Dialog>
        </>
      )}
    </Box>
  );
};

export default ReviewsContent;
