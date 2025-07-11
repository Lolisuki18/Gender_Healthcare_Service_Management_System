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

import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  CircularProgress,
  Tooltip,
  Button,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  StarBorder as StarBorderIcon,
  FilterList as FilterListIcon,
  Science as ScienceIcon,
  Psychology as PsychologyIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MedicalServices as MedicalServicesIcon,
  Star as StarIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import ReviewForm from '../modals/ReviewForm';
import Pagination from '@mui/material/Pagination';

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

// Utility function to convert API date array to Date object
const convertApiDateToDate = (apiDate) => {
  if (!apiDate) return new Date();
  
  // If it's already a string or Date object, use it directly
  if (typeof apiDate === 'string' || apiDate instanceof Date) {
    return new Date(apiDate);
  }
  
  // If it's an array format like [2025, 7, 10, 23, 3, 5, 586396200]
  if (Array.isArray(apiDate) && apiDate.length >= 6) {
    const [year, month, day, hour, minute, second, nanosecond] = apiDate;
    // Note: JavaScript months are 0-indexed, so subtract 1 from month
    const millisecond = nanosecond ? Math.floor(nanosecond / 1000000) : 0;
    return new Date(year, month - 1, day, hour, minute, second, millisecond);
  }
  
  // Fallback to current date
  return new Date();
};

const ReviewsContent = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [myRatings, setMyRatings] = useState([]); // Đánh giá đã hoàn thành từ API
  const [stiTests, setStiTests] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [serviceFilter, setServiceFilter] = useState('all'); // 'all', 'sti', 'consultation'
  
  // States for edit/delete functionality
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [page, setPage] = useState(1);
  const REVIEWS_PER_PAGE = 6;

  // Load reviews and services on component mount
  useEffect(() => {
    loadAllData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset page khi đổi tab hoặc filter
  useEffect(() => {
    setPage(1);
  }, [activeTab, serviceFilter]);

  const loadAllData = async () => {
    try {
      setIsLoadingReviews(true);
      await Promise.all([
        loadReviews(),
        loadMyRatings(),
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

  const loadMyRatings = async () => {
    try {
      console.log('🔄 Đang tải danh sách đánh giá từ API...');
      const data = await reviewService.getMyReviews(0, 100); // Load more items to get all ratings
      console.log('⭐ My Ratings API response:', data);
      const ratings = data?.content || data?.data || data || [];
      console.log('✅ Processed ratings:', ratings);
      setMyRatings(ratings);
    } catch (error) {
      console.error('❌ Lỗi khi tải ratings:', error);
      setMyRatings([]);
    }
  };

  const loadSTITests = async () => {
    try {
      console.log('🔄 Đang tải danh sách STI tests từ API...');
      const data = await stiService.getMySTITests();
      console.log('📊 STI Tests API response:', data);
      
      // Lọc chỉ những test đã hoàn thành với nhiều trạng thái khác nhau
      const completedStatuses = ['COMPLETED', 'RESULTED', 'FINISHED', 'DONE', 'SUCCESS', 'ANALYZED'];
      const allTests = data?.data || data || [];
      console.log('🧪 All STI tests:', allTests);
      
      const completedTests = allTests.filter(test => {
        const hasValidId = test.id || test.serviceId;
        const hasValidStatus = test.status && completedStatuses.includes(test.status.toUpperCase());
        
        console.log(`🔍 STI Test ${test.id || 'Unknown'}: hasValidId=${hasValidId}, status=${test.status}, hasValidStatus=${hasValidStatus}`);
        
        return hasValidId && hasValidStatus;
      });
      
      console.log('✅ Completed STI tests:', completedTests);
      setStiTests(completedTests);
    } catch (error) {
      console.error('❌ Lỗi khi tải STI tests:', error);
      setStiTests([]);
    }
  };

  const loadConsultations = async () => {
    try {
      console.log('🔄 Đang tải danh sách consultations từ API...');
      const data = await consultantService.getMyConsultations();
      console.log('💬 Consultations API response:', data);
      
      // Lọc chỉ những consultation đã hoàn thành với nhiều trạng thái khác nhau
      const completedStatuses = ['COMPLETED', 'RESULTED', 'FINISHED', 'DONE', 'SUCCESS', 'CLOSED'];
      const allConsultations = data?.data || data || [];
      console.log('💼 All consultations:', allConsultations);
      
      const completedConsultations = allConsultations.filter(consultation => {
        const hasValidId = consultation.id || consultation.consultantId;
        const hasValidStatus = consultation.status && completedStatuses.includes(consultation.status.toUpperCase());
        
        console.log(`🔍 Consultation ${consultation.id || 'Unknown'}: hasValidId=${hasValidId}, status=${consultation.status}, hasValidStatus=${hasValidStatus}`);
        
        return hasValidId && hasValidStatus;
      });
      
      console.log('✅ Completed consultations:', completedConsultations);
      setConsultations(completedConsultations);
    } catch (error) {
      console.error('❌ Lỗi khi tải consultations:', error);
      setConsultations([]);
    }
  };

  // Tạo danh sách tất cả các dịch vụ có thể đánh giá (chỉ của user hiện tại)
  const createReviewableServices = useCallback(() => {
    console.log('🔄 Creating reviewable services list for current user...');
    console.log('📊 Current stiTests (user only):', stiTests);
    console.log('📊 Current consultations (user only):', consultations);
    console.log('📊 Current reviews (user only):', reviews);
    
    const reviewableServices = [];
    
    // Thêm STI Tests đã hoàn thành và chưa được đánh giá (chỉ của user hiện tại)
    // API getMySTITests() đã filter theo user
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

    // Thêm Consultations đã hoàn thành và chưa được đánh giá (chỉ của user hiện tại)
    // API getMyConsultations() đã filter theo user
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

    console.log('✅ Created reviewable services for current user:', reviewableServices);
    return reviewableServices;
  }, [stiTests, consultations, reviews]);

  const allReviewableServices = useMemo(() => {
    return createReviewableServices();
  }, [createReviewableServices]);
  
  console.log('📈 All reviewable services created:', allReviewableServices);
  console.log('📊 Service filter:', serviceFilter);

  
  // Apply service filter with memoized services
  const filteredServices = allReviewableServices.filter(service => {
    if (serviceFilter === 'all') return true;
    if (serviceFilter === 'sti') return service.type === 'STI_SERVICE';
    if (serviceFilter === 'consultation') return service.type === 'CONSULTANT';
    return true;
  });

  // Sử dụng myRatings từ API cho completed reviews
  const filteredMyRatings = myRatings.filter(rating => {
    if (serviceFilter === 'all') return true;
    if (serviceFilter === 'sti') return rating.targetType === 'STI_SERVICE' || rating.serviceType === 'STI';
    if (serviceFilter === 'consultation') return rating.targetType === 'CONSULTANT' || rating.serviceType === 'CONSULTATION';
    return true;
  });

  // Create unique service counts to avoid duplicates - only count current user's services
  const uniqueSTIServices = new Set();
  const uniqueConsultationServices = new Set();
  
  // Add completed reviews (từ API đã filter theo user)
  filteredMyRatings.forEach(rating => {
    if (rating.targetType === 'STI_SERVICE' || rating.serviceType === 'STI') {
      // Sử dụng targetId hoặc serviceId làm unique identifier
      const identifier = rating.targetId || rating.serviceId || `rating_${rating.id}`;
      uniqueSTIServices.add(identifier);
    } else if (rating.targetType === 'CONSULTANT' || rating.serviceType === 'CONSULTATION') {
      // Sử dụng targetId hoặc consultantId + consultationId làm unique identifier
      const identifier = rating.targetId || `consultant_${rating.consultantId}_${rating.consultationId || 'unknown'}` || `rating_${rating.id}`;
      uniqueConsultationServices.add(identifier);
    }
  });
  
  // Add pending services (chỉ những dịch vụ chưa được đánh giá và thuộc về user hiện tại)
  allReviewableServices.forEach(service => {
    if (service.type === 'STI_SERVICE' && service.status === 'pending') {
      // Kiểm tra xem service này đã được đánh giá chưa
      const serviceIdentifier = service.serviceId;
      const hasReview = filteredMyRatings.some(rating => 
        (rating.targetType === 'STI_SERVICE' || rating.serviceType === 'STI') && 
        (rating.targetId === serviceIdentifier || rating.serviceId === serviceIdentifier)
      );
      
      if (!hasReview && serviceIdentifier) {
        uniqueSTIServices.add(serviceIdentifier);
      }
    } else if (service.type === 'CONSULTANT' && service.status === 'pending') {
      // Kiểm tra xem consultation này đã được đánh giá chưa
      const consultantIdentifier = service.consultantId;
      const consultationIdentifier = service.consultationId;
      const hasReview = filteredMyRatings.some(rating => 
        (rating.targetType === 'CONSULTANT' || rating.serviceType === 'CONSULTATION') && 
        (rating.targetId === consultantIdentifier || 
         (rating.consultantId === consultantIdentifier && rating.consultationId === consultationIdentifier))
      );
      
      if (!hasReview && consultantIdentifier) {
        const identifier = `consultant_${consultantIdentifier}_${consultationIdentifier || 'unknown'}`;
        uniqueConsultationServices.add(identifier);
      }
    }
  });

  console.log('📊 Unique STI services count:', uniqueSTIServices.size);
  console.log('📊 Unique Consultation services count:', uniqueConsultationServices.size);

  const completedReviews = filteredMyRatings; // Sử dụng API data (đã filter theo user)
  const pendingReviews = filteredServices.filter(service => service.status === 'pending');
  const allReviews = [...completedReviews, ...pendingReviews];
  
  console.log('📊 Final data summary:');
  console.log('  - Completed reviews:', completedReviews.length);
  console.log('  - Pending reviews:', pendingReviews.length);
  console.log('  - All reviews:', allReviews.length);

  // Tính toán dữ liệu phân trang cho từng tab
  const paginatedAllReviews = allReviews.slice((page - 1) * REVIEWS_PER_PAGE, page * REVIEWS_PER_PAGE);
  const paginatedCompletedReviews = completedReviews.slice((page - 1) * REVIEWS_PER_PAGE, page * REVIEWS_PER_PAGE);
  const paginatedPendingReviews = pendingReviews.slice((page - 1) * REVIEWS_PER_PAGE, page * REVIEWS_PER_PAGE);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  /**
   * Kiểm tra điều kiện đánh giá và mở form - Chức năng này được chuyển vào handleEditReview 
   * sau khi tách component ReviewForm để tránh code trùng lặp
   */

  // Close review dialog and reset related state
  const handleCloseReviewDialog = () => {
    console.log('🔒 Closing review dialog and resetting state');
    setReviewDialogOpen(false);
    setSelectedReview(null);
    setRating(0);
    setFeedback('');
    setIsEditMode(false);
    setEditingReviewId(null);
  };

  // Handle edit or add review action
  const handleEditReview = async (review) => {
    console.log('✏️ Starting edit/add review:', review);
    
    try {
      // Determine if this is a pending review with a temporary ID
      const isPendingTempReview = review.id && typeof review.id === 'string' && 
                                 (review.id.includes('temp') || review.id.includes('consultation_') || 
                                  review.id.includes('sti_'));
      
      // Check if the review has a valid ID for editing
      const hasValidRatingId = review.ratingId && !isNaN(parseInt(review.ratingId));
      const hasValidId = review.id && typeof review.id === 'number' && !isNaN(review.id);
      
      // For pending reviews without valid IDs, this is an "add" operation
      const isAddOperation = isPendingTempReview && !hasValidRatingId && !hasValidId;
      
      // Prepare form data
      setSelectedReview(review);
      setRating(review.rating || 0);
      setFeedback(review.comment || '');
      
      // Set edit mode based on whether this is an add or edit operation
      setIsEditMode(!isAddOperation);
      
      // For edit operations, ensure we have a valid numeric ID
      if (!isAddOperation) {
        const numericId = hasValidRatingId ? review.ratingId : (hasValidId ? review.id : null);
        
        if (!numericId) {
          throw new Error("Không tìm thấy ID đánh giá hợp lệ. Bạn cần gửi đánh giá trước khi có thể chỉnh sửa.");
        }
        
        setEditingReviewId(numericId);
        console.log('✅ Edit review dialog opened with valid ID:', numericId);
      } else {
        // For add operations, check eligibility
        if (!review.isEligible) {
          throw new Error("Dịch vụ này chưa hoàn thành hoặc không đủ điều kiện để đánh giá.");
        }
        
        setEditingReviewId(null);
        console.log('✅ Add review dialog opened for new review');
      }
      
      // Open the review dialog
      setReviewDialogOpen(true);
    } catch (error) {
      console.error('❌ Error opening review dialog:', error);
      notify.error('Lỗi', error.message || 'Không thể mở form đánh giá');
    }
  };

  // Handle delete review action
  const handleDeleteReview = async (review) => {
    console.log('🗑️ Starting delete review:', review);
    
    try {
      // Check if this is a pending review (no actual review ID in the database)
      const isPendingTempReview = review.id && typeof review.id === 'string' && 
                                 (review.id.includes('temp') || review.id.includes('consultation_') || 
                                  review.id.includes('sti_'));
      
      // Check if the review has a valid ID for deleting
      const hasValidRatingId = review.ratingId && !isNaN(parseInt(review.ratingId));
      const hasValidId = review.id && typeof review.id === 'number' && !isNaN(review.id);
      
      // For pending reviews without valid IDs, this is not a deletable review
      if (isPendingTempReview && !hasValidRatingId && !hasValidId) {
        notify.warning(
          'Không thể xóa', 
          'Đánh giá này chưa được gửi nên không cần xóa. Hãy bỏ qua hoặc thực hiện đánh giá.'
        );
        return;
      }
      
      // Get confirmation from the user
      const { confirmDialog } = await import('../../utils/confirmDialog');
      const confirmed = await confirmDialog.danger(
        `Bạn có chắc chắn muốn xóa đánh giá này không?\n\nDịch vụ: ${review.serviceName || review.targetName || 'N/A'}\nĐánh giá: ${review.rating} sao\nBình luận: "${(review.comment || '').substring(0, 50)}${review.comment?.length > 50 ? '...' : ''}"\n\nHành động này không thể hoàn tác!`,
        {
          title: 'Xác nhận xóa đánh giá',
          confirmText: 'Xóa đánh giá',
          cancelText: 'Hủy bỏ'
        }
      );

      if (!confirmed) {
        return;
      }

      setLoading(true);
      const reviewId = hasValidRatingId ? review.ratingId : (hasValidId ? review.id : null);
      
      if (!reviewId) {
        throw new Error('Không tìm thấy ID đánh giá. Vui lòng làm mới trang và thử lại.');
      }

      console.log('🗑️ Deleting review with ID:', reviewId);
      await reviewService.deleteReview(reviewId);
      
      notify.success('Thành công', 'Đánh giá đã được xóa thành công!');
      
      // Reload data to update the list
      await loadAllData();
      
    } catch (error) {
      console.error('❌ Error deleting review:', error);
      
      let errorMessage = 'Có lỗi xảy ra khi xóa đánh giá. Vui lòng thử lại!';
      let errorTitle = 'Không thể xóa đánh giá';
      
      if (error.message) {
        if (error.message.includes('not found') || error.message.includes('không tìm thấy')) {
          errorMessage = 'Đánh giá không tồn tại hoặc đã được xóa trước đó.';
          errorTitle = 'Đánh giá không tồn tại';
        } else if (error.message.includes('unauthorized') || error.message.includes('không có quyền')) {
          errorMessage = 'Bạn không có quyền xóa đánh giá này.';
          errorTitle = 'Không có quyền truy cập';
        } else {
          errorMessage = error.message;
        }
      }
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      notify.error(errorTitle, errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Xử lý submit đánh giá (tạo mới hoặc cập nhật)
   * Form được quản lý bởi component ReviewForm đã tách
   */
  const handleSubmitReview = async () => {
    console.log('🚀 Starting review submission process...');
    console.log('📋 Review data check:', {
      rating,
      feedbackLength: feedback.trim().length,
      selectedReview,
      isEligible: selectedReview?.isEligible
    });
    
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
      
      // Thêm thông tin bổ sung cho reviewData dựa trên loại dịch vụ
      if (selectedReview.type === 'STI_SERVICE' && selectedReview.testId) {
        reviewData.stiTestId = selectedReview.testId;
      } else if (selectedReview.type === 'CONSULTANT' && selectedReview.consultationId) {
        reviewData.consultationId = selectedReview.consultationId;
      }

      console.log('📋 Final review data:', reviewData);

      // Kiểm tra xem đây là edit mode hay create mode
      if (isEditMode && editingReviewId) {
        console.log('✏️ Updating existing review with ID:', editingReviewId);
        
        // Kiểm tra ID phải là số hợp lệ
        if (isNaN(parseInt(editingReviewId))) {
          throw new Error("ID đánh giá không hợp lệ. Vui lòng thử lại với một đánh giá khác.");
        }
        
        await reviewService.updateReview(editingReviewId, reviewData);
        console.log('✅ Review updated successfully');
        notify.success('Thành công', 'Đánh giá đã được cập nhật thành công!');
      } else {
        console.log('🆕 Creating new review');
        
        // Kiểm tra chi tiết điều kiện trước khi gửi (chỉ cho create mode)
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
          console.log('🔍 STI Service Eligibility Check Response:', eligibilityCheck);
          
          // Kiểm tra response format từ backend
          if (eligibilityCheck && eligibilityCheck.success) {
            const eligibilityData = eligibilityCheck.data;
            if (eligibilityData && !eligibilityData.canRate) {
              throw new Error(`Backend từ chối: ${eligibilityData.reason || eligibilityCheck.message || 'Không đủ điều kiện đánh giá dịch vụ này'}`);
            }
            if (eligibilityData && eligibilityData.hasRated) {
              throw new Error('Bạn đã đánh giá dịch vụ này rồi. Mỗi dịch vụ chỉ được đánh giá một lần.');
            }
          } else if (eligibilityCheck && !eligibilityCheck.eligible) {
            // Fallback cho format cũ
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
        console.log('📤 Sending STI Service Review:', {
          serviceId: selectedReview.serviceId,
          reviewData,
          selectedReview
        });
        
        // Chuẩn bị dữ liệu đánh giá theo format mẫu JSON
        const stiServiceReviewData = {
          rating: reviewData.rating,
          comment: reviewData.comment
        };
        
        // URL endpoint: /ratings/sti-service/{serviceId}
        const result = await reviewService.createSTIServiceReview(selectedReview.serviceId, stiServiceReviewData);
        console.log('✅ STI Service Review Result:', result);
        
      } else if (selectedReview.type === 'STI_PACKAGE') {
        // Kiểm tra packageId
        if (!selectedReview.packageId) {
          throw new Error('Thiếu thông tin packageId. Không thể gửi đánh giá cho gói STI.');
        }
        
        // Đánh giá cho gói STI
        console.log('📤 Sending STI Package Review:', {
          packageId: selectedReview.packageId,
          reviewData,
          selectedReview
        });
        
        // Chuẩn bị dữ liệu đánh giá theo format mẫu JSON
        const stiPackageReviewData = {
          rating: reviewData.rating,
          comment: reviewData.comment
        };
        
        // URL endpoint: /ratings/sti-package/{packageId}
        const result = await reviewService.createSTIPackageReview(selectedReview.packageId, stiPackageReviewData);
        console.log('✅ STI Package Review Result:', result);
        
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
          console.log('🔍 Consultant Eligibility Check Response:', eligibilityCheck);
          
          // Kiểm tra response format từ backend
          if (eligibilityCheck && eligibilityCheck.success) {
            const eligibilityData = eligibilityCheck.data;
            if (eligibilityData && !eligibilityData.canRate) {
              throw new Error(`Backend từ chối: ${eligibilityData.reason || eligibilityCheck.message || 'Không đủ điều kiện đánh giá tư vấn viên này'}`);
            }
            if (eligibilityData && eligibilityData.hasRated) {
              throw new Error('Bạn đã đánh giá tư vấn viên này rồi. Mỗi tư vấn viên chỉ được đánh giá một lần cho mỗi buổi tư vấn.');
            }
          } else if (eligibilityCheck && !eligibilityCheck.eligible) {
            // Fallback cho format cũ
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
        console.log('📤 Sending Consultant Review:', {
          consultantId: selectedReview.consultantId,
          reviewData,
          selectedReview
        });
        
        // Chuẩn bị dữ liệu đánh giá theo format mẫu JSON
        const consultantReviewData = {
          rating: reviewData.rating,
          comment: reviewData.comment
        };
        
        // URL endpoint: /ratings/consultant/{consultantId}
        const result = await reviewService.createConsultantReview(selectedReview.consultantId, consultantReviewData);
        console.log('✅ Consultant Review Result:', result);
        
      } else {
        throw new Error(`Loại đánh giá không được hỗ trợ: ${selectedReview.type}`);
      }
      } // Kết thúc else block for create mode

      console.log('🎉 Review submission completed successfully');
      
      // Thông báo thành công khác nhau cho edit vs create
      if (isEditMode) {
        notify.success('Thành công', 'Đánh giá đã được cập nhật thành công!');
      } else {
        notify.success('Thành công', 'Đánh giá của bạn đã được gửi thành công! Cảm ơn bạn đã chia sẻ trải nghiệm.');
      }
      
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

  const renderCompletedReview = (review, uniqueKey) => (
    <Card 
      key={uniqueKey} 
      sx={{ 
        mb: 3,
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(74, 144, 226, 0.08)',
        border: '1px solid rgba(74, 144, 226, 0.1)',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        position: 'relative',
        minHeight: '200px',
        // Bỏ maxHeight để cho phép card mở rộng theo nội dung
        maxWidth: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 30px rgba(74, 144, 226, 0.15)',
        }
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Grid container spacing={{ xs: 2, md: 5 }} sx={{ width: '100%', m: 0, justifyContent: 'space-between' }}>
          <Grid xs={12} md={6.5} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
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
                {(review.consultantName || review.providerName || 'N/A').split(' ').pop()[0]}
              </Avatar>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#2D3748', 
                      fontSize: '18px'
                    }}
                  >
                    {review.serviceName || review.targetName || 'Dịch vụ'}
                  </Typography>
                  {(review.targetType === 'STI_SERVICE' || review.serviceType === 'STI') && (
                    <Chip
                      icon={<ScienceIcon sx={{ fontSize: '12px !important' }} />}
                      label="STI"
                      size="small"
                      sx={{
                        background: 'rgba(255, 152, 0, 0.1)',
                        color: '#FF9800',
                        border: '1px solid rgba(255, 152, 0, 0.3)',
                        fontSize: '10px',
                        fontWeight: 600,
                        height: '20px',
                        '& .MuiChip-icon': {
                          color: '#FF9800'
                        }
                      }}
                    />
                  )}
                  {(review.targetType === 'CONSULTANT' || review.serviceType === 'CONSULTATION') && (
                    <Chip
                      icon={<PsychologyIcon sx={{ fontSize: '12px !important' }} />}
                      label="Tư vấn"
                      size="small"
                      sx={{
                        background: 'rgba(76, 175, 80, 0.1)',
                        color: '#4CAF50',
                        border: '1px solid rgba(76, 175, 80, 0.3)',
                        fontSize: '10px',
                        fontWeight: 600,
                        height: '20px',
                        '& .MuiChip-icon': {
                          color: '#4CAF50'
                        }
                      }}
                    />
                  )}
                </Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#4A5568',
                    fontSize: '14px',
                    fontWeight: 500
                  }}
                >
                  {review.consultantName || review.providerName || 'Chuyên viên'}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Rating 
                value={review.rating || 0} 
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
                  mb: 1, // Thêm margin bottom
                  display: 'block', // Đảm bảo hiển thị toàn bộ nội dung
                  wordWrap: 'break-word', // Xuống dòng khi cần
                  whiteSpace: 'pre-wrap', // Giữ nguyên định dạng và xuống dòng
                  maxWidth: { xs: '100%', md: '600px' }, // Giới hạn chiều rộng tối đa
                  overflow: 'auto', // Thêm thanh cuộn nếu nội dung quá dài
                  maxHeight: '300px', // Giới hạn chiều cao tối đa
                }}
              >
                "{review.comment || 'Không có bình luận'}"
              </Typography>

              {/* Hiển thị phản hồi từ staff nếu có */}
              {review.staffReply && (
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar 
                      sx={{ 
                        width: 24, 
                        height: 24, 
                        mr: 1,
                        background: 'linear-gradient(135deg, #1ABC9C, #4A90E2)',
                        fontSize: '12px',
                        fontWeight: 600,
                      }}
                    >
                      <MedicalServicesIcon sx={{ fontSize: '14px', color: 'white' }} />
                    </Avatar>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#1ABC9C',
                        fontSize: '13px',
                        fontWeight: 600
                      }}
                    >
                      Phản hồi từ nhân viên y tế
                      {review.repliedAt && (
                        <Typography 
                          component="span" 
                          variant="caption" 
                          sx={{ 
                            color: '#6B7280',
                            fontSize: '11px',
                            fontWeight: 400,
                            ml: 1
                          }}
                        >
                          • {convertApiDateToDate(review.repliedAt).toLocaleDateString('vi-VN')}
                        </Typography>
                      )}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#2D3748',
                      fontSize: '14px',
                      lineHeight: 1.5,
                      pl: 1,
                      borderLeft: '3px solid #1ABC9C',
                      background: 'rgba(26, 188, 156, 0.05)',
                      p: 1.5,
                      borderRadius: '8px',
                      fontStyle: 'normal'
                    }}
                  >
                    {review.staffReply}
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
          
          <Grid xs={12} md={5.5} sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'flex-start',
            alignItems: { xs: 'flex-start', md: 'flex-end' },
            textAlign: { xs: 'left', md: 'right' },
            pl: { xs: 0, md: 2 },
            pr: 0,
            mt: { xs: 2, md: 0 },
            pt: { xs: 0, md: 0 }, // Thêm padding top để thẳng hàng
            minHeight: 'fit-content'
          }}>
            {/* Status và Date Section */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: { xs: 'flex-start', md: 'flex-end' }, 
              mb: 2,
              width: '100%',
              mr: { xs: 0, md: -1 }
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                mb: 1,
                justifyContent: { xs: 'flex-start', md: 'flex-end' },
                width: '100%',
                mr: { xs: 0, md: -1 }
              }}>
                <Chip
                  icon={<CheckCircleIcon sx={{ fontSize: '16px !important' }} />}
                  label="Đã đánh giá"
                  sx={{
                    background: 'linear-gradient(45deg, #4CAF50, #2ECC71)',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '12px',
                    height: '32px',
                    minWidth: '120px',
                    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                    '& .MuiChip-icon': {
                      color: '#fff'
                    }
                  }}
                />
              </Box>
              {review.createdAt && (
                <Box sx={{ 
                  width: '100%',
                  display: 'flex',
                  justifyContent: { xs: 'flex-start', md: 'flex-end' },
                  mr: { xs: 0, md: -1 }
                }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#6B7280',
                      fontSize: '12px',
                      fontWeight: 500
                    }}
                  >
                    {convertApiDateToDate(review.createdAt).toLocaleDateString('vi-VN')}
                  </Typography>
                </Box>
              )}
            </Box>
            
            {/* Action Buttons Section - Hiển thị trực tiếp */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: { xs: 'flex-start', md: 'flex-end' },
              alignItems: 'center',
              gap: 0.5,
              mt: 0.5, // Giảm margin top để gần hơn với status
              width: '100%',
              mr: { xs: 0, md: -1 }
            }}>
              <IconButton
                size="small"
                onClick={() => handleEditReview(review)}
                sx={{
                  color: '#4A90E2',
                  background: 'rgba(74, 144, 226, 0.1)',
                  border: '1px solid rgba(74, 144, 226, 0.2)',
                  borderRadius: '8px',
                  width: 40,
                  height: 40,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'rgba(74, 144, 226, 0.2)',
                    border: '1px solid rgba(74, 144, 226, 0.3)',
                    transform: 'scale(1.05)',
                  }
                }}
              >
                <EditIcon sx={{ fontSize: '20px' }} />
              </IconButton>
              
              <IconButton
                size="small"
                onClick={() => handleDeleteReview(review)}
                sx={{
                  color: '#F56565',
                  background: 'rgba(245, 101, 101, 0.1)',
                  border: '1px solid rgba(245, 101, 101, 0.2)',
                  borderRadius: '8px',
                  width: 40,
                  height: 40,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'rgba(245, 101, 101, 0.2)',
                    border: '1px solid rgba(245, 101, 101, 0.3)',
                    transform: 'scale(1.05)',
                  }
                }}
              >
                <DeleteIcon sx={{ fontSize: '20px' }} />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderPendingReview = (review, uniqueKey) => (
    <Card 
      key={uniqueKey} 
      sx={{ 
        mb: 3,
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(255, 152, 0, 0.08)',
        border: '1px solid rgba(255, 152, 0, 0.2)',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        position: 'relative',
        minHeight: '200px',
        // Bỏ maxHeight để cho phép card mở rộng theo nội dung
        maxWidth: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 30px rgba(255, 152, 0, 0.15)',
        }
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Grid container spacing={{ xs: 2, md: 5 }} sx={{ width: '100%', m: 0, justifyContent: 'space-between' }}>
          <Grid xs={12} md={6.5} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
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
                {(review.consultantName || 'N/A').split(' ').pop()[0]}
              </Avatar>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#2D3748', 
                      fontSize: '18px'
                    }}
                  >
                    {review.serviceName}
                  </Typography>
                  {review.type === 'STI_SERVICE' && (
                    <Chip
                      icon={<ScienceIcon sx={{ fontSize: '12px !important' }} />}
                      label="STI"
                      size="small"
                      sx={{
                        background: 'rgba(255, 152, 0, 0.1)',
                        color: '#FF9800',
                        border: '1px solid rgba(255, 152, 0, 0.3)',
                        fontSize: '10px',
                        fontWeight: 600,
                        height: '20px',
                        '& .MuiChip-icon': {
                          color: '#FF9800'
                        }
                      }}
                    />
                  )}
                  {review.type === 'CONSULTANT' && (
                    <Chip
                      icon={<PsychologyIcon sx={{ fontSize: '12px !important' }} />}
                      label="Tư vấn"
                      size="small"
                      sx={{
                        background: 'rgba(76, 175, 80, 0.1)',
                        color: '#4CAF50',
                        border: '1px solid rgba(76, 175, 80, 0.3)',
                        fontSize: '10px',
                        fontWeight: 600,
                        height: '20px',
                        '& .MuiChip-icon': {
                          color: '#4CAF50'
                        }
                      }}
                    />
                  )}
                </Box>
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
                mb: 2,
                flex: 1, // Chiếm phần còn lại của không gian
                minHeight: '60px', // Đảm bảo chiều cao tối thiểu
                display: 'flex',
                alignItems: 'center'
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
                  gap: 1,
                  width: '100%'
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
          
          <Grid xs={12} md={5.5} sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: { xs: 'flex-start', md: 'flex-end' },
            textAlign: { xs: 'left', md: 'right' },
            pl: { xs: 0, md: 2 },
            pr: { xs: 2, md: 3 },
            mt: { xs: 2, md: 0 },
            pt: { xs: 0, md: 0 }, // Thêm padding top để thẳng hàng
            minHeight: 'fit-content'
          }}>
            {/* Status Section */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: { xs: 'flex-start', md: 'flex-end' }, 
              gap: 1.5,
              mb: 2,
              width: '100%',
              mr: { xs: 0, md: -1 }
            }}>
              <Box sx={{
                display: 'flex',
                justifyContent: { xs: 'flex-start', md: 'flex-end' },
                width: '100%',
                mr: { xs: 0, md: -1 }
              }}>
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
              </Box>
            </Box>

            {/* Action Button Section - Luôn ở cuối */}
            <Box sx={{
              display: 'flex',
              justifyContent: { xs: 'flex-start', md: 'flex-end' },
              alignItems: 'center',
              gap: 1.5,
              mt: 0.5, // Giảm margin top để gần hơn với status
              width: '100%',
              mr: 0,
              pr: 0
            }}>
              <Box sx={{
                display: 'flex',
                justifyContent: { xs: 'flex-start', md: 'flex-end' },
                alignItems: 'center',
                gap: 1.5,
                mt: 0.5,
                width: '100%',
                mr: 0,
                pr: 0
              }}>
                <IconButton
                  size="large"
                  onClick={() => handleEditReview(review)}
                  disabled={!review.isEligible}
                  sx={{
                    color: '#FF9800',
                    background: 'rgba(255, 152, 0, 0.1)',
                    border: '1px solid rgba(255, 152, 0, 0.2)',
                    borderRadius: '10px',
                    width: 46,
                    height: 46,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: 'rgba(255, 152, 0, 0.2)',
                      border: '1px solid rgba(255, 152, 0, 0.3)',
                      transform: 'scale(1.05)',
                    },
                    '&:disabled': {
                      color: '#BDBDBD',
                      background: 'rgba(189, 189, 189, 0.1)',
                      border: '1px solid rgba(189, 189, 189, 0.2)',
                    }
                  }}
                >
                  <AddIcon sx={{ fontSize: '24px' }} />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: '1200px', // Giới hạn chiều rộng tối đa toàn bộ component
      margin: '0 auto', // Căn giữa
      px: { xs: 1, sm: 2, md: 3 } // Padding responsive
    }}>
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
              label={`STI: ${uniqueSTIServices.size}`}
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
              label={`Tư vấn: ${uniqueConsultationServices.size}`}
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
        {paginatedAllReviews.length > 0 ? (
          paginatedAllReviews.map((review, index) => {
            // Kiểm tra xem review có phải từ API myRatings không (có createdAt và rating)
            const isCompletedReview = review.rating !== undefined && review.createdAt;
            const uniqueKey = review.id || review.ratingId || `review_${index}_${review.type || 'unknown'}`;
            return isCompletedReview 
              ? renderCompletedReview(review, uniqueKey) 
              : renderPendingReview(review, uniqueKey);
          })
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
        {allReviews.length > REVIEWS_PER_PAGE && (
          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
              count={Math.ceil(allReviews.length / REVIEWS_PER_PAGE)}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              shape="rounded"
            />
          </Box>
        )}
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        {paginatedCompletedReviews.length > 0 ? (
          paginatedCompletedReviews.map((review, index) => {
            const uniqueKey = review.id || review.ratingId || `completed_${index}_${Date.now()}`;
            return renderCompletedReview(review, uniqueKey);
          })
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
        {completedReviews.length > REVIEWS_PER_PAGE && (
          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
              count={Math.ceil(completedReviews.length / REVIEWS_PER_PAGE)}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              shape="rounded"
            />
          </Box>
        )}
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        {paginatedPendingReviews.length > 0 ? (
          paginatedPendingReviews.map((review, index) => {
            const uniqueKey = review.id || `pending_${index}_${Date.now()}`;
            return renderPendingReview(review, uniqueKey);
          })
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
        {pendingReviews.length > REVIEWS_PER_PAGE && (
          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
              count={Math.ceil(pendingReviews.length / REVIEWS_PER_PAGE)}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              shape="rounded"
            />
          </Box>
        )}
      </TabPanel>

      {/* Review Dialog - Đã tách thành component riêng */}
      <ReviewForm 
        open={reviewDialogOpen}
        onClose={handleCloseReviewDialog}
        review={selectedReview}
        rating={rating}
        setRating={setRating}
        feedback={feedback}
        setFeedback={setFeedback}
        onSubmit={handleSubmitReview}
        isEditMode={isEditMode}
        loading={loading}
      />

        </>
      )}
    </Box>
  );
};

export default ReviewsContent;
