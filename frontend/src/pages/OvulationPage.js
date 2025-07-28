import { Container, Box, Typography, Card } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';
import ovulationService from '../services/ovulationService';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { CheckCircle } from '@mui/icons-material';
import 'chart.js/auto';
import { List, ListItem } from '@mui/material';
import styles from '../styles/OvulationPage.module.css';
import { confirmDialog } from '@/utils/confirmDialog';
import {
  Heart,
  Calendar,
  TrendingUp,
  Brain,
  Stethoscope,
  ChevronDown,
  ChevronUp,
  Clock,
  Shield,
  AlertTriangle,
  AlertCircle,
  Activity,
  Zap,
  Lightbulb,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react';
import MenstrualCycleForm from '../components/MenstrualCycle/MenstrualCycleForm.js';
import MenstrualCycleCalendar from '../components/MenstrualCycleCalendar';
import { notify } from '../utils/notify';

// const defaultStats = {
//   averageCycleLength: 28,
//   totalCycles: 10,
//   averagePeriodLength: 5,
//   nextPredictedPeriod: '2025-07-01',
//   consistency: 'irregular',
// };

const OvulationPage = ({ stats }) => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);

  // Tất cả chu kỳ kinh nguyệt
  const [menstrualCycles, setMenstrualCycles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Hàm fetch dữ liệu chu kỳ kinh nguyệt
  const fetchMenstrualCycles = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) {
        setIsRefetching(true);
      } else {
        setIsLoading(true);
      }

      const response = await ovulationService.getAllMenstrualCycles();

      console.log('🔍 Raw response từ API:', response);

      // Kiểm tra nhiều trường hợp có thể xảy ra
      let data = response;

      // Nếu response có property data
      if (response && response.data) {
        data = response.data;
      }

      // Nếu response có property result hoặc items
      if (response && response.result) {
        data = response.result;
      }

      if (response && response.items) {
        data = response.items;
      }

      console.log('🔍 Data sau khi extract:', data);

      // Kiểm tra data có phải là mảng không
      if (Array.isArray(data)) {
        // Convert date arrays to Date objects
        const processedData = data.map((cycle) => ({
          ...cycle,
          startDate: new Date(
            cycle.startDate[0],
            cycle.startDate[1] - 1,
            cycle.startDate[2]
          ),
          ovulationDate: new Date(
            cycle.ovulationDate[0],
            cycle.ovulationDate[1] - 1,
            cycle.ovulationDate[2]
          ),
        }));

        setMenstrualCycles(processedData);
        console.log('🩸 Data đã xử lý:', processedData);
        return processedData;
      } else {
        console.warn('❌ Data không phải là mảng:', data);
        console.warn('❌ Type của data:', typeof data);
        setMenstrualCycles([]);
        return [];
      }
    } catch (err) {
      console.error('❌ Lỗi khi lấy dữ liệu chu kỳ:', err);
      setMenstrualCycles([]);
      return [];
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  };

  // Kiểm tra trạng thái đăng nhập khi component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setIsCheckingAuth(true);
        const loggedIn = await ovulationService.isLoggedIn();
        setIsLoggedIn(loggedIn);

        if (loggedIn) {
          await fetchMenstrualCycles();
        }
      } catch (error) {
        console.error('❌ Lỗi khi kiểm tra trạng thái đăng nhập:', error);
        setIsLoggedIn(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthStatus();

    // Thêm event listener để refresh khi focus lại trang
    const handleFocus = () => {
      if (!isCheckingAuth) {
        refreshAuthStatus();
      }
    };

    window.addEventListener('focus', handleFocus);

    // Thêm interval để kiểm tra trạng thái đăng nhập định kỳ (mỗi 30 giây)
    const authCheckInterval = setInterval(() => {
      if (!isCheckingAuth && !isLoggedIn) {
        refreshAuthStatus();
      }
    }, 30000); // 30 giây

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(authCheckInterval);
    };
  }, []);

  // Độ dài chu kỳ trung bình
  const getAverageCycleLength = (menstrualCycles) => {
    if (!Array.isArray(menstrualCycles) || menstrualCycles.length === 0)
      return null;

    try {
      const total = menstrualCycles.reduce(
        (sum, cycle) => sum + (cycle.cycleLength || 0),
        0
      );
      const average = total / menstrualCycles.length;
      return Math.round(average);
    } catch (error) {
      console.error('Lỗi khi tính average cycle length:', error);
      return null;
    }
  };

  const averageLengthCycles = getAverageCycleLength(menstrualCycles);

  // Độ dài kỳ kinh trung bình
  const getAveragePeriodLength = (menstrualCycles) => {
    if (!Array.isArray(menstrualCycles) || menstrualCycles.length === 0)
      return null;

    try {
      const total = menstrualCycles.reduce(
        (sum, cycle) => sum + (cycle.numberOfDays || 0),
        0
      );
      const average = total / menstrualCycles.length;
      return Math.round(average);
    } catch (error) {
      console.error('Lỗi khi tính average period length:', error);
      return null;
    }
  };

  const averagePeriodLength = getAveragePeriodLength(menstrualCycles);

  // Chu kỳ kinh nguyệt tiếp theo
  const getNextCycle = (menstrualCycles) => {
    if (!Array.isArray(menstrualCycles) || menstrualCycles.length === 0)
      return null;

    try {
      const lastCycle = menstrualCycles[0];
      const cycleLength = lastCycle.cycleLength;

      let nextCycleStart = new Date(lastCycle.startDate);
      const today = new Date();

      // Lặp cho đến khi nextCycleStart vượt qua hôm nay
      while (nextCycleStart <= today) {
        nextCycleStart.setDate(nextCycleStart.getDate() + cycleLength);
      }

      return nextCycleStart;
    } catch (error) {
      console.error('Lỗi khi tính toán chu kỳ tiếp theo:', error);
      return null;
    }
  };

  const nextCycle = getNextCycle(menstrualCycles);

  const getAverageCycleLengthOfCurrentCycles = (menstrualCycles) => {
    if (!Array.isArray(menstrualCycles) || menstrualCycles.length === 0)
      return null;

    try {
      // Lấy 3 chu kỳ gần nhất để đánh giá
      const recentCycles = menstrualCycles.slice(0, 3);
      const total = recentCycles.reduce(
        (sum, cycle) => sum + (cycle.cycleLength || 0),
        0
      );
      const average = total / recentCycles.length;
      return Math.round(average);
    } catch (error) {
      console.error('Lỗi khi tính average cycle length:', error);
      return null;
    }
  };

  const averageCycleLengthOfCurrentCycles =
    getAverageCycleLengthOfCurrentCycles(menstrualCycles);

  const getConsistency = (menstrualCycles) => {
    console.log('🔍 [getConsistency] Input data:', menstrualCycles);

    if (!Array.isArray(menstrualCycles) || menstrualCycles.length === 0) {
      console.log(
        '❌ [getConsistency] Không đủ dữ liệu. Hiện có:',
        menstrualCycles?.length || 0
      );
      return 'unknown';
    }

    try {
      // Lấy 3 chu kỳ gần nhất để đánh giá
      const recentCycles = menstrualCycles.slice(0, 3);
      console.log('📊 [getConsistency] 3 chu kỳ gần nhất:', recentCycles);

      // Kiểm tra tính hợp lệ của dữ liệu
      for (const cycle of recentCycles) {
        console.log('🔍 [getConsistency] Kiểm tra chu kỳ:', {
          numberOfDays: cycle.numberOfDays,
          cycleLength: cycle.cycleLength,
          startDate: cycle.startDate,
        });

        // Kiểm tra số ngày kinh nguyệt (2-8 ngày là bình thường)
        if (
          !cycle.numberOfDays ||
          cycle.numberOfDays < 2 ||
          cycle.numberOfDays > 8
        ) {
          console.log(
            '❌ [getConsistency] Chu kỳ không đều - số ngày kinh không hợp lệ:',
            cycle.numberOfDays
          );
          return 'irregular';
        } else if (
          // Kiểm tra độ dài chu kỳ (24-38 ngày là bình thường)
          !cycle.cycleLength ||
          cycle.cycleLength < 24 ||
          cycle.cycleLength > 38
        ) {
          console.log(
            '❌ [getConsistency] Chu kỳ không bình thường - độ dài chu kỳ không hợp lệ:',
            cycle.cycleLength
          );
          return 'irregular';
        }

        // Kiểm tra độ dài chu kỳ có tồn tại
        if (!cycle.cycleLength) {
          console.log(
            '❌ [getConsistency] Dữ liệu không đầy đủ - thiếu cycleLength:',
            cycle.cycleLength
          );
          return 'regular';
        }
      }

      // Kiểm tra sự đồng đều của độ dài chu kỳ
      const cycleLengths = recentCycles.map((cycle) => cycle.cycleLength);
      console.log('📏 [getConsistency] Độ dài các chu kỳ:', cycleLengths);

      let maxDifference = 0;

      for (let i = 0; i < cycleLengths.length - 1; i++) {
        const difference = Math.abs(cycleLengths[i] - cycleLengths[i + 1]);
        console.log(
          `🔢 [getConsistency] So sánh chu kỳ ${i} và ${i + 1}: ${cycleLengths[i]} vs ${cycleLengths[i + 1]} = chênh lệch ${difference} ngày`
        );
        if (difference > maxDifference) {
          maxDifference = difference;
        }
      }

      console.log(
        '📈 [getConsistency] Chênh lệch tối đa:',
        maxDifference,
        'ngày'
      );

      // Nếu chênh lệch tối đa > 7 ngày thì được coi là không bình thường
      const result = maxDifference <= 7 ? 'regular' : 'irregular';
      console.log('✅ [getConsistency] Kết quả cuối cùng:', result);

      return result;
    } catch (error) {
      console.error('💥 [getConsistency] Lỗi khi tính consistency:', error);
      return 'regular';
    }
  };

  const consistency = getConsistency(menstrualCycles);
  console.log('🎯 [Main] Kết quả consistency đã tính:', consistency);

  // Hàm phân tích lý do chu kỳ không bình thường
  const getIrregularReasons = (menstrualCycles) => {
    const reasons = [];
    
    if (!Array.isArray(menstrualCycles) || menstrualCycles.length === 0) {
      return ['Không đủ dữ liệu để phân tích'];
    }

    try {
      // Lấy 3 chu kỳ gần nhất để đánh giá
      const recentCycles = menstrualCycles.slice(0, Math.min(3, menstrualCycles.length));
      
      // Phân tích số ngày kinh nguyệt
      const periodLengths = recentCycles.map(cycle => cycle.numberOfDays).filter(days => days);
      if (periodLengths.length > 0) {
        const minPeriod = Math.min(...periodLengths);
        const maxPeriod = Math.max(...periodLengths);
        
        if (minPeriod < 3) {
          reasons.push(`Kỳ kinh quá ngắn (${minPeriod} ngày) - có thể do stress, rối loạn hormone, hoặc mất cân nặng đột ngột`);
        }
        if (maxPeriod > 7) {
          reasons.push(`Kỳ kinh kéo dài (${maxPeriod} ngày) - có thể do u xơ tử cung, polyp nội mạc tử cung, hoặc rối loạn đông máu`);
        }
        if (maxPeriod - minPeriod > 3) {
          reasons.push(`Độ dài kỳ kinh không ổn định (từ ${minPeriod} đến ${maxPeriod} ngày) - có thể do stress hoặc thay đổi hormone`);
        }
      }

      // Phân tích độ dài chu kỳ
      const cycleLengths = recentCycles.map(cycle => cycle.cycleLength).filter(length => length);
      if (cycleLengths.length > 0) {
        const minCycle = Math.min(...cycleLengths);
        const maxCycle = Math.max(...cycleLengths);
        
        if (minCycle < 21) {
          reasons.push(`Chu kỳ quá ngắn (${minCycle} ngày) - có thể do stress, tập thể dục quá mức, thiếu hụt dinh dưỡng, hoặc cận mãn kinh`);
        }
        if (maxCycle > 35) {
          reasons.push(`Chu kỳ quá dài (${maxCycle} ngày) - có thể do hội chứng buồng trứng đa nang (PCOS), rối loạn tuyến giáp, hoặc stress`);
        }
        
        // Kiểm tra sự biến thiên của chu kỳ
        if (cycleLengths.length >= 2) {
          let maxDifference = 0;
          for (let i = 0; i < cycleLengths.length - 1; i++) {
            const difference = Math.abs(cycleLengths[i] - cycleLengths[i + 1]);
            if (difference > maxDifference) {
              maxDifference = difference;
            }
          }
          
          if (maxDifference > 7) {
            reasons.push(`Chu kỳ biến thiên lớn (chênh lệch ${maxDifference} ngày) - có thể do stress, thay đổi cân nặng, rối loạn giấc ngủ, hoặc thay đổi lối sống`);
          }
        }
        
        // Phân tích xu hướng
        if (cycleLengths.length >= 3) {
          const isIncreasing = cycleLengths[0] > cycleLengths[1] && cycleLengths[1] > cycleLengths[2];
          const isDecreasing = cycleLengths[0] < cycleLengths[1] && cycleLengths[1] < cycleLengths[2];
          
          if (isIncreasing) {
            reasons.push('Chu kỳ có xu hướng ngày càng dài - có thể cần kiểm tra hormone hoặc tình trạng stress');
          } else if (isDecreasing) {
            reasons.push('Chu kỳ có xu hướng ngày càng ngắn - có thể do stress, giảm cân, hoặc tập thể dục quá mức');
          }
        }
      }

      // Đánh giá tổng thể
      if (recentCycles.length < 3) {
        reasons.push('Dữ liệu còn ít - khuyến nghị theo dõi thêm để có đánh giá chính xác hơn');
      }

      // Nếu không tìm thấy vấn đề cụ thể nhưng được đánh giá là irregular
      if (reasons.length === 0 && consistency === 'irregular') {
        reasons.push('Chu kỳ có dấu hiệu không đều đặn nhẹ - có thể do các yếu tố lối sống hoặc stress tạm thời');
      }

      // Nếu hoàn toàn không có vấn đề
      if (reasons.length === 0) {
        return ['Chu kỳ tương đối bình thường dựa trên dữ liệu hiện tại'];
      }

      return reasons;
    } catch (error) {
      console.error('Lỗi khi phân tích lý do chu kỳ không bình thường:', error);
      return ['Không thể phân tích do lỗi dữ liệu - vui lòng kiểm tra lại thông tin chu kỳ'];
    }
  };

  const irregularReasons = getIrregularReasons(menstrualCycles);

  const [expandedSection, setExpandedSection] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [calculationResult, setCalculationResult] = useState(null);
  const [isRefetching, setIsRefetching] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Hàm refresh trạng thái đăng nhập
  const refreshAuthStatus = async () => {
    try {
      setIsCheckingAuth(true);
      const loggedIn = await ovulationService.isLoggedIn();

      // Nếu trước đó chưa đăng nhập nhưng bây giờ đã đăng nhập
      if (!isLoggedIn && loggedIn) {
        notify.success(
          'Chào mừng!',
          'Đăng nhập thành công. Đang tải dữ liệu của bạn...'
        );
      }

      // Nếu trước đó đã đăng nhập nhưng bây giờ đã đăng xuất
      if (isLoggedIn && !loggedIn) {
        notify.info('Đã đăng xuất', 'Bạn đã đăng xuất khỏi hệ thống.');
        setMenstrualCycles([]);
        setCalculationResult(null);
        setShowForm(false);
        setShowEditForm(false);
        setEditingCycle(null);
      }

      setIsLoggedIn(loggedIn);

      if (loggedIn) {
        await fetchMenstrualCycles();
      }
    } catch (error) {
      console.error('❌ Lỗi khi refresh trạng thái đăng nhập:', error);
      setIsLoggedIn(false);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  // Edit cycle states
  const [editingCycle, setEditingCycle] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  
  // View cycle detail states
  const [selectedCycleForDetail, setSelectedCycleForDetail] = useState(null);
  const [showCycleDetail, setShowCycleDetail] = useState(false);
  
  // Calendar modal states
  const [selectedCycleForCalendar, setSelectedCycleForCalendar] = useState(null);
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const benefits = [
    {
      icon: <Heart className="h-6 w-6 text-pink-600" />,
      title: 'Hiểu rõ cơ thể',
      description: 'Biết được chu kỳ kinh nguyệt có đều không',
      details: ['Theo dõi triệu chứng như đau bụng, nổi mụn, mệt mỏi…'],
    },
    {
      icon: <Calendar className="h-6 w-6 text-purple-600" />,
      title: 'Lập kế hoạch tốt hơn',
      description: 'Dễ dàng sắp xếp công việc, du lịch, vận động thể thao',
      details: ['Tránh rơi vào tình huống bất ngờ do kinh đến đột ngột'],
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-indigo-600" />,
      title: 'Cải thiện sức khỏe sinh sản',
      description:
        'Dự đoán thời điểm rụng trứng (hữu ích khi tránh thai hoặc mong muốn có con)',
      details: ['Phát hiện sớm dấu hiệu rối loạn nội tiết'],
    },
    {
      icon: <Brain className="h-6 w-6 text-green-600" />,
      title: 'Tăng cường sức khỏe tinh thần',
      description: 'Nhận biết mối liên hệ giữa tâm trạng và chu kỳ',
      details: [
        'Chủ động chăm sóc bản thân đúng thời điểm (nghỉ ngơi, giảm stress)',
      ],
    },
    {
      icon: <Stethoscope className="h-6 w-6 text-blue-600" />,
      title: 'Hỗ trợ bác sĩ khi cần',
      description: 'Ghi chép đầy đủ giúp bác sĩ dễ chẩn đoán nếu có bất thường',
      details: ['Tiết kiệm thời gian và điều trị hiệu quả hơn'],
    },
  ];

  const carePhases = [
    {
      phase: 'Trước kỳ kinh',
      icon: <Clock className="h-5 w-5 text-orange-600" />,
      tips: [
        'Ăn uống lành mạnh, tránh đường & caffeine',
        'Vận động nhẹ nhàng, ngủ đủ giấc',
      ],
      color: 'orange',
    },
    {
      phase: 'Trong kỳ kinh',
      icon: <Shield className="h-5 w-5 text-red-600" />,
      tips: [
        'Thay băng vệ sinh 4–6 tiếng/lần',
        'Ăn thực phẩm giàu sắt (rau xanh, thịt đỏ)',
        'Dùng túi chườm ấm hoặc thuốc giảm đau nếu cần',
      ],
      color: 'red',
    },
    {
      phase: 'Sau kỳ kinh',
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      tips: [
        'Tập thể dục nhẹ, bổ sung dinh dưỡng',
        'Theo dõi và ghi nhận bất thường',
      ],
      color: 'green',
    },
  ];

  const warningSignals = [
    'Kinh quá nhiều, kéo dài >7 ngày',
    'Đau bụng dữ dội, trễ kinh thường xuyên',
    'Khí hư có mùi lạ hoặc màu bất thường',
  ];

  const getConsistencyClass = (consistency) => {
    switch (consistency) {
      case 'regular':
        return styles.regular;
      case 'irregular':
        return styles.irregular;
      case 'unknown':
        return styles.unknown;
      default:
        return styles.unknown;
    }
  };

  const getConsistencyText = (consistency) => {
    switch (consistency) {
      case 'regular':
        return 'Bình thường';
      case 'irregular':
        return 'Không bình thường';
      case 'unknown':
        return 'Chưa có thông tin';
      default:
        return 'Chưa có thông tin';
    }
  };

  const formatDate = (dateInput) => {
    // Kiểm tra null/undefined trước
    if (!dateInput) {
      return 'Không có dữ liệu';
    }

    let date;

    try {
      if (Array.isArray(dateInput)) {
        // Convert from [year, month, day] format
        date = new Date(dateInput[0], dateInput[1] - 1, dateInput[2]);
      } else if (typeof dateInput === 'string') {
        date = new Date(dateInput);
      } else if (dateInput instanceof Date) {
        date = dateInput;
      } else {
        // Nếu không phải các kiểu trên, thử convert
        date = new Date(dateInput);
      }

      // Kiểm tra date có hợp lệ không
      if (isNaN(date.getTime())) {
        return 'Ngày không hợp lệ';
      }

      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (error) {
      console.error('Lỗi format date:', error, 'Input:', dateInput);
      return 'Lỗi định dạng ngày';
    }
  };

  const dashboardCards = [
    {
      icon: <Calendar className={`${styles.icon} ${styles.pink}`} />,
      iconWrapper: `${styles.iconWrapper} ${styles.pink}`,
      label: 'Chu kỳ trung bình',
      mainValue: averageLengthCycles
        ? `${averageLengthCycles} ngày`
        : 'Không có dữ liệu',
      subValue: menstrualCycles.length
        ? `${menstrualCycles.length} chu kỳ đã ghi nhận`
        : '0 chu kỳ đã ghi nhận',
      id: 'average-cycle',
    },
    {
      icon: <Clock className={`${styles.icon} ${styles.purple}`} />,
      iconWrapper: `${styles.iconWrapper} ${styles.purple}`,
      label: 'Kỳ kinh trung bình',
      mainValue: averagePeriodLength
        ? `${averagePeriodLength} ngày`
        : 'Không có dữ liệu',
      subValue: 'Độ dài kỳ kinh',
      id: 'average-period',
    },
    {
      icon: <TrendingUp className={`${styles.icon} ${styles.indigo}`} />,
      iconWrapper: `${styles.iconWrapper} ${styles.indigo}`,
      label: 'Dự đoán kỳ tới',
      mainValue: nextCycle ? formatDate(nextCycle) : 'Không có dữ liệu',
      subValue: 'Ngày dự kiến',
      id: 'next-prediction',
      isSpecial: true,
    },
    {
      icon: <AlertCircle className={`${styles.icon} ${styles.green}`} />,
      iconWrapper: `${styles.iconWrapper} ${styles.green}`,
      label: 'Tính đều đặn',
      mainValue: null,
      subValue: consistency === 'irregular' && irregularReasons.length > 0 
        ? `${irregularReasons.length} vấn đề được phát hiện` 
        : 'Đánh giá chu kỳ',
      id: 'consistency',
      customContent: (
        <div className="mb-2">
          <span
            className={`${styles.consistencyBadge} ${getConsistencyClass(consistency)}`}
          >
            {getConsistencyText(consistency)}
          </span>
        </div>
      ),
    },
  ];

  const getAdvice = () => {
    const advice = [];

    if (consistency === 'regular') {
      advice.push({
        icon: <Heart className="h-6 w-6 text-green-600" />,
        title: 'Chu kỳ bình thường',
        description:
          'Chu kỳ của bạn rất đều đặn! Hãy duy trì lối sống lành mạnh hiện tại.',
        tips: [
          'Tiếp tục duy trì chế độ ăn uống cân bằng',
          'Tập thể dục đều đặn',
          'Ngủ đủ 7-8 tiếng mỗi ngày',
        ],
        color: 'green',
      });
    } else if (consistency === 'irregular') {
      // Thêm card hiển thị lý do cụ thể
      advice.push({
        icon: <AlertCircle className="h-6 w-6 text-red-600" />,
        title: 'Lý do chu kỳ không bình thường',
        description: 'Phân tích dựa trên dữ liệu chu kỳ của bạn:',
        tips: irregularReasons,
        color: 'red',
      });

      advice.push({
        icon: <Activity className="h-6 w-6 text-yellow-600" />,
        title: 'Cách cải thiện chu kỳ không đều',
        description:
          'Những biện pháp có thể giúp cải thiện tình trạng chu kỳ không đều.',
        tips: [
          'Giảm stress thông qua yoga, thiền hoặc tập thở sâu',
          'Duy trì cân nặng ổn định và tránh giảm cân đột ngột',
          'Ngủ đủ giấc và giữ giờ giấc đều đặn',
          'Hạn chế caffeine và rượu bia',
          'Ăn đủ chất dinh dưỡng, đặc biệt là sắt và vitamin B',
          'Tập thể dục nhẹ nhàng, tránh vận động quá sức',
          'Tham khảo ý kiến bác sĩ để kiểm tra hormone',
        ],
        color: 'yellow',
      });
    } else if (consistency === 'unknown') {
      advice.push({
        icon: <AlertCircle className="h-6 w-6 text-gray-600" />,
        title: 'Cần thêm dữ liệu',
        description:
          'Bạn cần ghi nhận thêm chu kỳ để có thể đánh giá tính đều đặn.',
        tips: [
          'Ghi chép ít nhất 3 chu kỳ để có đánh giá chính xác',
          'Theo dõi ngày bắt đầu và kết thúc kỳ kinh',
          'Ghi chú các triệu chứng và cảm giác',
        ],
        color: 'gray',
      });
    }

    if (
      averageCycleLengthOfCurrentCycles < 24 &&
      averageCycleLengthOfCurrentCycles !== null
    ) {
      advice.push({
        icon: <Zap className="h-6 w-6 text-red-600" />,
        title: 'Chu kỳ ngắn',
        description: 'Chu kỳ ngắn hơn 24 ngày có thể cần được kiểm tra y tế.',
        tips: [
          'Theo dõi kỹ hơn các triệu chứng',
          'Ghi chú về stress và thay đổi lối sống',
          'Nên thăm khám bác sĩ',
        ],
        color: 'red',
      });
    } else if (averageCycleLengthOfCurrentCycles > 38) {
      advice.push({
        icon: <Lightbulb className="h-6 w-6 text-blue-600" />,
        title: 'Chu kỳ dài',
        description:
          'Chu kỳ dài hơn 38 ngày có thể do nhiều nguyên nhân khác nhau.',
        tips: [
          'Kiểm tra hormone nếu có thể',
          'Duy trì chế độ ăn giàu dinh dưỡng',
          'Tham khảo chuyên gia sức khỏe',
        ],
        color: 'blue',
      });
    }

    // General advice
    advice.push({
      icon: <Heart className="h-6 w-6 text-pink-600" />,
      title: 'Lời khuyên chung',
      description: 'Những thói quen tốt để duy trì sức khỏe sinh sản.',
      tips: [
        'Uống đủ 2-3 lít nước mỗi ngày',
        'Ăn nhiều rau xanh và trái cây',
        'Tập thể dục nhẹ nhàng trong kỳ kinh',
        'Theo dõi và ghi chép đều đặn',
      ],
      color: 'pink',
    });

    return advice;
  };

  const advice = getAdvice();

  // Pagination logic
  const sortedCycles = menstrualCycles.sort(
    (a, b) => new Date(b.startDate) - new Date(a.startDate)
  );

  const ortherSortedCycles = [...menstrualCycles].sort(
    (a, b) => new Date(a.startDate) - new Date(b.startDate)
  );
  const totalPages = Math.ceil(sortedCycles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCycles = sortedCycles.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to cycle list section
    setTimeout(() => {
      const cycleListElement = document.querySelector(
        '[data-section="cycle-list"]'
      );
      if (cycleListElement) {
        cycleListElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Reset pagination when cycles change
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [menstrualCycles.length, currentPage, totalPages]);

  const handleSubmitCycle = async (data) => {
    try {
      // Chỉ tính toán và hiển thị kết quả
      const calculatedData = calculateCycleData(data);
      setCalculationResult(calculatedData);
      setShowForm(false);
      // Scroll to result section
      setTimeout(() => {
        const resultElement = document.getElementById('calculation-result');
        if (resultElement) {
          resultElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (error) {
      console.error('Lỗi khi xử lý chu kỳ:', error);
      notify.error('Lỗi', 'Tính toán thất bại!');
    }
  };

  // Hàm tính toán dữ liệu chu kỳ
  const calculateCycleData = (data) => {
    const startDate = new Date(data.startDate);
    const nextPeriodDate = new Date(startDate);
    nextPeriodDate.setDate(startDate.getDate() + data.cycleLength);

    const ovulationDate = new Date(startDate);
    ovulationDate.setDate(
      startDate.getDate() + Math.floor(data.cycleLength) - 14
    );

    const fertilityWindowStart = new Date(ovulationDate);
    fertilityWindowStart.setDate(ovulationDate.getDate() - 5);

    const fertilityWindowEnd = new Date(ovulationDate);
    fertilityWindowEnd.setDate(ovulationDate.getDate() + 1);

    return {
      startDate: startDate,
      endDate: new Date(
        startDate.getTime() + (data.numberOfDays - 1) * 24 * 60 * 60 * 1000
      ),
      nextPeriodDate: nextPeriodDate,
      ovulationDate: ovulationDate,
      fertilityWindow: {
        start: fertilityWindowStart,
        end: fertilityWindowEnd,
      },
      cycleLength: data.cycleLength,
      periodLength: data.numberOfDays,
    };
  };

  // Hàm lấy chu kỳ gần nhất sau chu kỳ được nhập vào
  const getNextCycleAfterInput = (inputCycle) => {
    if (!inputCycle || !ortherSortedCycles.length) return null;

    const inputStartDate = new Date(inputCycle.startDate);

    for (const cycle of ortherSortedCycles) {
      const cycleStartDate = new Date(cycle.startDate);

      if (cycleStartDate > inputStartDate) {
        return cycle;
      }
    }

    return null;
  };
  
  // Hàm lấy chu kỳ gần nhất trước chu kỳ được nhập vào
  const getLastCycleBeforeInput = (inputCycle) => {
    if (!inputCycle || !sortedCycles.length) return null;

    const inputStartDate = new Date(inputCycle.startDate);

    for (const cycle of sortedCycles) {
      const cycleStartDate = new Date(cycle.startDate);

      if (cycleStartDate < inputStartDate) {
        return cycle;
      }
    }

    return null;
  };


  // Hàm so sánh chu kỳ đã nhập với chu kỳ sau gần nhất
  const compareCycleWithNext = (inputCycle) => {
    const nextCycle = getNextCycleAfterInput(inputCycle);
    if (!nextCycle) return null;

    // So sánh độ dài chu kỳ của chu kỳ sau gần nhất và khoảng cách thực tế so với đã nhập
    const nextCycleLength = nextCycle.cycleLength;
    const actualCycleLength =
      (new Date(nextCycle.startDate) - new Date(inputCycle.startDate)) /
      (1000 * 60 * 60 * 24);

    if (nextCycleLength !== actualCycleLength) {
      // Nếu độ dài chu kỳ không khớp, có thể cần điều chỉnh
      console.warn('Độ dài chu kỳ không khớp:', {
        nextCycleLength,
        actualCycleLength,
        nextCycle
      });
    }

    return {
      nextCycle,
      nextCycleLength,
      actualCycleLength,
    };
  };

  const compareCycleResultWithNext = compareCycleWithNext(calculationResult);

  // Hàm so sánh chu kỳ đã nhập với chu kỳ trước gần nhất
  const compareCycleWithLast = (inputCycle) => {
    const lastCycle = getLastCycleBeforeInput(inputCycle);
    if (!lastCycle) return null;

    // So sánh độ dài chu kỳ của chu kỳ trước gần nhất và khoảng cách thực tế so với đã nhập
    const lastCycleLength = lastCycle.cycleLength;
    const actualCycleLength =
      (new Date(inputCycle.startDate) - new Date(lastCycle.startDate)) /
      (1000 * 60 * 60 * 24);

    if (lastCycleLength !== actualCycleLength) {
      // Nếu độ dài chu kỳ không khớp, có thể cần điều chỉnh
      console.warn('Độ dài chu kỳ không khớp:', {
        lastCycleLength,
        actualCycleLength,
        lastCycle
      });
    }

    return {
      lastCycle,
      lastCycleLength,
      actualCycleLength,
    };
  };

  const compareCycleResultWithLast = compareCycleWithLast(calculationResult);

  // Hàm xử lý xem chi tiết chu kỳ
  const handleViewCycleDetail = (cycle) => {
    setSelectedCycleForCalendar(cycle);
    setShowCalendarModal(true);
  };

  // Hàm đóng modal calendar
  const handleCloseCalendarModal = () => {
    setSelectedCycleForCalendar(null);
    setShowCalendarModal(false);
  };

  // Hàm đóng modal chi tiết chu kỳ
  const handleCloseCycleDetail = () => {
    setSelectedCycleForDetail(null);
    setShowCycleDetail(false);
  };

  // Hàm xử lý edit chu kỳ
  const handleEditCycle = (cycle) => {
    setEditingCycle(cycle);
    setShowEditForm(true);
    setShowForm(false);
    setCalculationResult(null);
  };

  // Hàm xử lý submit khi edit chu kỳ
  const handleSubmitEditCycle = async (data) => {
    const result = await confirmDialog.info(
      'Bạn có chắc chắn muốn cập nhật chu kỳ này?',
      {
        title: 'Cập nhật chu kỳ kinh nguyệt',
        confirmText: 'Cập nhật',
        cancelText: 'Hủy',
        message:
          'Thông tin chu kỳ sẽ được cập nhật và có thể ảnh hưởng đến các dự đoán chu kỳ tiếp theo.',
      }
    );

    if (!result) return;

    try {
      await ovulationService.updateMenstrualCycle(editingCycle.id, data);

      // Refetch dữ liệu để cập nhật UI
      await fetchMenstrualCycles(true);

      setShowEditForm(false);
      setEditingCycle(null);

      notify.success('Thành công', 'Cập nhật chu kỳ thành công!');

      // Scroll to top để người dùng thấy dữ liệu đã cập nhật
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Lỗi khi cập nhật chu kỳ:', error);
      notify.error('Lỗi', 'Cập nhật chu kỳ thất bại!');
    }
  };

  // Hàm xử lý xóa chu kỳ
  const handleDeleteCycle = async (cycle) => {
    const cycleNumber = menstrualCycles.length - menstrualCycles.indexOf(cycle);

    const result = await confirmDialog.danger(
      `Bạn có chắc chắn muốn xóa chu kỳ #${cycleNumber} không?`,
      {
        title: 'Xóa chu kỳ kinh nguyệt',
        confirmText: 'Xóa',
        cancelText: 'Hủy bỏ',
        message: `Hành động này sẽ xóa vĩnh viễn chu kỳ #${cycleNumber} khỏi hệ thống và không thể hoàn tác.`,
      }
    );

    if (result) {
      try {
        await ovulationService.deleteMenstrualCycle(cycle.id);

        // Refetch dữ liệu để cập nhật UI
        await fetchMenstrualCycles(true);

        // Adjust current page if necessary
        const newTotalPages = Math.ceil(
          (menstrualCycles.length - 1) / itemsPerPage
        );
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }

        notify.success('Thành công', 'Xóa chu kỳ thành công!');
      } catch (error) {
        console.error('Lỗi khi xóa chu kỳ:', error);
        notify.error('Lỗi', 'Xóa chu kỳ thất bại!');
      }
    }
  };

  // Hàm cancel edit
  const handleCancelEdit = async () => {
    const result = await confirmDialog.warning(
      'Bạn có chắc chắn muốn hủy chỉnh sửa?',
      {
        title: 'Hủy chỉnh sửa',
        confirmText: 'Hủy chỉnh sửa',
        cancelText: 'Tiếp tục chỉnh sửa',
        message: 'Mọi thay đổi chưa được lưu sẽ bị mất.',
      }
    );

    if (result) {
      setShowEditForm(false);
      setEditingCycle(null);
    }
  };

  // Hàm cancel add form
  const handleCancelAddForm = async () => {
    const result = await confirmDialog.warning(
      'Bạn có chắc chắn muốn hủy thêm chu kỳ mới?',
      {
        title: 'Hủy thêm chu kỳ',
        confirmText: 'Hủy',
        cancelText: 'Tiếp tục nhập',
        message: 'Mọi thông tin đã nhập sẽ bị mất.',
      }
    );

    if (result) {
      setShowForm(false);
      setCalculationResult(null);
    }
  };

  // Hàm xử lý lưu chu kỳ đã tính toán vào database
  const handleSaveCycleToDatabase = async () => {
    if (!calculationResult) return;

    const result = await confirmDialog.success(
      'Bạn có muốn lưu chu kỳ này vào hệ thống không?',
      {
        title: 'Lưu chu kỳ kinh nguyệt',
        confirmText: 'Lưu',
        cancelText: 'Hủy',
        message:
          'Chu kỳ sẽ được lưu vào dữ liệu cá nhân của bạn và có thể được sử dụng để theo dõi và dự đoán các chu kỳ tiếp theo.',
      }
    );

    if (!result) return;

    try {
      // Chuẩn bị dữ liệu từ calculationResult
      const cycleData = {
        startDate: calculationResult.startDate,
        numberOfDays: calculationResult.periodLength,
        cycleLength: calculationResult.cycleLength,
      };

      // Gọi API để lưu vào database
      await ovulationService.createMenstrualCycle(cycleData);

      // Refetch dữ liệu để cập nhật UI
      await fetchMenstrualCycles(true);

      // Reset về trang đầu để hiển thị chu kỳ mới nhất
      setCurrentPage(1);

      notify.success('Thành công', 'Lưu chu kỳ thành công!');
      setCalculationResult(null); // Clear calculation result

      // Scroll to top để người dùng thấy dữ liệu mới
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Lỗi khi lưu chu kỳ:', error);
      notify.error('Lỗi', 'Lưu chu kỳ thất bại!');
    }
  };

  // Hàm xử lý đóng kết quả tính toán
  const handleClearCalculationResult = async () => {
    const result = await confirmDialog.warning(
      'Bạn có chắc chắn muốn đóng kết quả tính toán?',
      {
        title: 'Đóng kết quả',
        confirmText: 'Đóng',
        cancelText: 'Hủy',
        message:
          'Kết quả tính toán sẽ bị mất và bạn cần phải tính toán lại nếu muốn.',
      }
    );

    if (result) {
      setCalculationResult(null);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
      <Container maxWidth="lg" className={styles.container}>
        {isCheckingAuth ? (
          <Box
            sx={{
              textAlign: 'center',
              padding: '60px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <Box
              sx={{
                width: '50px',
                height: '50px',
                border: '4px solid #f3f4f6',
                borderTop: '4px solid #43a6ef',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }}
            />
            <Typography
              variant="h6"
              sx={{
                color: '#6b7280',
                fontWeight: 500,
                fontSize: '1.1rem',
                letterSpacing: '0.5px',
              }}
            >
              Đang kiểm tra trạng thái đăng nhập...
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#9ca3af',
                fontStyle: 'italic',
                fontSize: '0.9rem',
              }}
            >
              Vui lòng đợi trong giây lát
            </Typography>
          </Box>
        ) : isLoggedIn ? (
          <>
            {isLoading ? (
              <Box
                sx={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                <Box
                  sx={{
                    width: '50px',
                    height: '50px',
                    border: '4px solid #f3f4f6',
                    borderTop: '4px solid #43a6ef',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' },
                    },
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    color: '#6b7280',
                    fontWeight: 500,
                    fontSize: '1.1rem',
                    letterSpacing: '0.5px',
                  }}
                >
                  Đang tải dữ liệu...
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#9ca3af',
                    fontStyle: 'italic',
                    fontSize: '0.9rem',
                  }}
                >
                  Vui lòng đợi trong giây lát
                </Typography>
              </Box>
            ) : (
              <>
                {/* Refetching indicator */}
                {isRefetching && (
                  <Box className={styles.refetchOverlay}>
                    <div className={styles.spinner}></div>
                    <Typography className={styles.refetchText}>
                      Đang cập nhật dữ liệu...
                    </Typography>
                  </Box>
                )}

                {/* Stats Cards */}
                <div className={styles.dashboard}>
                  {dashboardCards.map((card, index) => (
                    <div
                      key={card.id}
                      className={styles.card}
                      role="article"
                      aria-labelledby={`card-${card.id}-title`}
                      tabIndex={0}
                    >
                      <div className={styles.cardHeader}>
                        <div className={card.iconWrapper}>{card.icon}</div>
                        <span
                          className={styles.cardLabel}
                          id={`card-${card.id}-title`}
                        >
                          {card.label}
                        </span>
                      </div>

                      {card.customContent ? (
                        card.customContent
                      ) : (
                        <div className={styles.mainValue}>{card.mainValue}</div>
                      )}

                      <div className={styles.subValue}>{card.subValue}</div>
                    </div>
                  ))}
                </div>

                {/* Danh sách chu kỳ kinh nguyệt */}
                <Box sx={{ marginBottom: 4 }} data-section="cycle-list">
                  <Card className={styles.cycleListCard}>
                    <Box className={styles.cycleListHeader}>
                      <Box className={styles.cycleListIconWrapper}>
                        <Calendar className={styles.cycleListIcon} />
                      </Box>
                      <Box>
                        <Typography
                          variant="h6"
                          className={styles.cycleListTitle}
                        >
                          Lịch sử chu kỳ kinh nguyệt
                        </Typography>
                        <Typography className={styles.cycleListSubtitle}>
                          {menstrualCycles.length} chu kỳ đã được ghi nhận
                          {menstrualCycles.length > itemsPerPage && (
                            <span>
                              {' '}
                              • Trang {currentPage}/{totalPages}
                            </span>
                          )}
                        </Typography>
                      </Box>
                    </Box>

                    {menstrualCycles.length > 0 ? (
                      <>
                        <Box className={styles.cycleListContainer}>
                          {currentCycles.map((cycle, index) => (
                            <Card
                              key={startIndex + index}
                              className={styles.cycleItem}
                            >
                              <Box className={styles.cycleItemHeader}>
                                <Box className={styles.cycleItemIconWrapper}>
                                  <Calendar className={styles.cycleItemIcon} />
                                </Box>
                                <Box className={styles.cycleItemInfo}>
                                  <Typography className={styles.cycleItemTitle}>
                                    Chu kỳ #
                                    {menstrualCycles.length -
                                      (startIndex + index)}
                                  </Typography>
                                  <Typography className={styles.cycleItemDate}>
                                    {formatDate(cycle.startDate)}
                                  </Typography>
                                </Box>

                                {/* View Detail, Edit and Delete buttons */}
                                <Box className={styles.cycleItemActions}>
                                  <button
                                    className={styles.viewButton}
                                    onClick={() => handleViewCycleDetail(cycle)}
                                    title="Xem chi tiết chu kỳ"
                                  >
                                    <Eye className={styles.actionIcon} />
                                  </button>
                                  <button
                                    className={styles.editButton}
                                    onClick={() => handleEditCycle(cycle)}
                                    title="Chỉnh sửa chu kỳ"
                                  >
                                    <Edit className={styles.actionIcon} />
                                  </button>
                                  <button
                                    className={styles.deleteButton}
                                    onClick={() => handleDeleteCycle(cycle)}
                                    title="Xóa chu kỳ"
                                  >
                                    <Trash2 className={styles.actionIcon} />
                                  </button>
                                </Box>
                              </Box>

                              <Box className={styles.cycleItemDetails}>
                                <Box className={styles.cycleDetailItem}>
                                  <Typography
                                    className={styles.cycleDetailLabel}
                                  >
                                    Số ngày hành kinh:
                                  </Typography>
                                  <Typography
                                    className={styles.cycleDetailValue}
                                  >
                                    {cycle.numberOfDays} ngày
                                  </Typography>
                                </Box>

                                <Box className={styles.cycleDetailItem}>
                                  <Typography
                                    className={styles.cycleDetailLabel}
                                  >
                                    Độ dài chu kỳ:
                                  </Typography>
                                  <Typography
                                    className={styles.cycleDetailValue}
                                  >
                                    {cycle.cycleLength} ngày
                                  </Typography>
                                </Box>

                                <Box className={styles.cycleDetailItem}>
                                  <Typography
                                    className={styles.cycleDetailLabel}
                                  >
                                    Ngày rụng trứng dự kiến:
                                  </Typography>
                                  <Typography
                                    className={styles.cycleDetailValue}
                                  >
                                    {formatDate(cycle.ovulationDate)}
                                  </Typography>
                                </Box>
                              </Box>
                            </Card>
                          ))}
                        </Box>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                          <Box className={styles.paginationContainer}>
                            <Box className={styles.paginationInfo}>
                              <Typography className={styles.paginationText}>
                                Hiển thị {startIndex + 1}-
                                {Math.min(endIndex, menstrualCycles.length)}
                                trong tổng số {menstrualCycles.length} chu kỳ
                              </Typography>
                            </Box>

                            <Box className={styles.paginationControls}>
                              <button
                                className={`${styles.paginationButton} ${currentPage === 1 ? styles.disabled : ''}`}
                                onClick={() =>
                                  handlePageChange(currentPage - 1)
                                }
                                disabled={currentPage === 1}
                              >
                                <ChevronUp
                                  className={styles.paginationIcon}
                                  style={{ transform: 'rotate(-90deg)' }}
                                />
                                Trước
                              </button>

                              <Box className={styles.pageNumbers}>
                                {Array.from(
                                  { length: totalPages },
                                  (_, i) => i + 1
                                ).map((page) => (
                                  <button
                                    key={page}
                                    className={`${styles.pageNumber} ${currentPage === page ? styles.active : ''}`}
                                    onClick={() => handlePageChange(page)}
                                  >
                                    {page}
                                  </button>
                                ))}
                              </Box>

                              <button
                                className={`${styles.paginationButton} ${currentPage === totalPages ? styles.disabled : ''}`}
                                onClick={() =>
                                  handlePageChange(currentPage + 1)
                                }
                                disabled={currentPage === totalPages}
                              >
                                Sau
                                <ChevronUp
                                  className={styles.paginationIcon}
                                  style={{ transform: 'rotate(90deg)' }}
                                />
                              </button>
                            </Box>
                          </Box>
                        )}
                      </>
                    ) : (
                      <Box className={styles.emptyCycleList}>
                        <Calendar className={styles.emptyCycleIcon} />
                        <Typography className={styles.emptyCycleTitle}>
                          Chưa có chu kỳ nào được ghi nhận
                        </Typography>
                        <Typography className={styles.emptyCycleDescription}>
                          Hãy bấm nút "Khai báo chu kỳ mới" để thêm chu kỳ đầu
                          tiên của bạn
                        </Typography>
                      </Box>
                    )}
                  </Card>
                </Box>

                {/* Button khai báo chu kỳ mới */}
                {!showForm && !calculationResult && !showEditForm && (
                  <Box className={styles.addCycleButtonContainer}>
                    <button
                      className={styles.addCycleButton}
                      onClick={() => {
                        setShowForm(true);
                        setCalculationResult(null);
                      }}
                    >
                      <Calendar className={styles.addCycleButtonIcon} />
                      Khai báo chu kỳ mới
                    </button>
                  </Box>
                )}

                {/* Form tạo chu kỳ mới */}
                <MenstrualCycleForm
                  open={showForm}
                  onSubmit={handleSubmitCycle}
                  onCancel={handleCancelAddForm}
                />

                {/* Form chỉnh sửa chu kỳ */}
                <MenstrualCycleForm
                  open={showEditForm && !!editingCycle}
                  onSubmit={handleSubmitEditCycle}
                  onCancel={handleCancelEdit}
                  initialData={editingCycle}
                  isEditMode={true}
                />

                {/* Kết quả tính toán */}
                {calculationResult && (
                  <Box id="calculation-result" sx={{ marginBottom: 4 }}>
                    <Card className={styles.healthAdviceCard}>
                      <Box className={styles.healthAdviceHeader}>
                        <Box className={styles.healthAdviceIconWrapper}>
                          <Calendar className={styles.healthAdviceIcon} />
                        </Box>
                        <Box>
                          <Typography
                            variant="h6"
                            className={styles.healthAdviceTitle}
                          >
                            Kết quả tính toán chu kỳ
                          </Typography>
                          <Typography className={styles.healthAdviceSubtitle}>
                            Dự đoán dựa trên thông tin bạn cung cấp
                          </Typography>
                        </Box>
                      </Box>

                      

                      <Box className={styles.form}>
                        {/* Thông tin chu kỳ hiện tại */}
                        <Card
                          className={`${styles.adviceCardRegular} ${styles.adviceCardBlue}`}
                        >
                          <Box className={styles.adviceCardHeader}>
                            <Box className={styles.adviceCardIconRegular}>
                              <Calendar
                                className={styles.adviceCardIconRegularIcon}
                              />
                            </Box>
                            <Typography
                              variant="subtitle1"
                              className={styles.adviceCardTitleRegular}
                            >
                              Chu kỳ hiện tại
                            </Typography>
                          </Box>
                          <Typography className={styles.adviceCardTextRegular}>
                            Thông tin về kỳ kinh nguyệt đang diễn ra
                          </Typography>
                          <List className={styles.adviceCardList}>
                            <ListItem className={styles.adviceCardListItem}>
                              Ngày bắt đầu:{' '}
                              {formatDate(calculationResult.startDate)}
                            </ListItem>
                            <ListItem className={styles.adviceCardListItem}>
                              Ngày kết thúc dự kiến:{' '}
                              {formatDate(calculationResult.endDate)}
                            </ListItem>
                            <ListItem className={styles.adviceCardListItem}>
                              Độ dài kỳ kinh: {calculationResult.periodLength}{' '}
                              ngày
                            </ListItem>
                            <ListItem className={styles.adviceCardListItem}>
                              Độ dài chu kỳ: {calculationResult.cycleLength}{' '}
                              ngày
                            </ListItem>
                          </List>
                        </Card>

                        {/* Dự đoán chu kỳ tiếp theo */}
                        <Card
                          className={`${styles.adviceCardRegular} ${styles.adviceCardPink}`}
                        >
                          <Box className={styles.adviceCardHeader}>
                            <Box className={styles.adviceCardIconRegular}>
                              <TrendingUp
                                className={styles.adviceCardIconRegularIcon}
                              />
                            </Box>
                            <Typography
                              variant="subtitle1"
                              className={styles.adviceCardTitleRegular}
                            >
                              Dự đoán chu kỳ tiếp theo
                            </Typography>
                          </Box>
                          <Typography className={styles.adviceCardTextRegular}>
                            Thời điểm dự kiến cho kỳ kinh nguyệt tiếp theo
                          </Typography>
                          <List className={styles.adviceCardList}>
                            <ListItem className={styles.adviceCardListItem}>
                              Ngày bắt đầu dự kiến:{' '}
                              {formatDate(calculationResult.nextPeriodDate)}
                            </ListItem>
                            <ListItem className={styles.adviceCardListItem}>
                              Còn khoảng:{' '}
                              {Math.ceil(
                                (calculationResult.nextPeriodDate -
                                  new Date()) /
                                  (1000 * 60 * 60 * 24)
                              )}{' '}
                              ngày
                            </ListItem>
                            
                          </List>
                        </Card>

                        {/* Thời kỳ rụng trứng */}
                        <Card
                          className={`${styles.adviceCardRegular} ${styles.adviceCardGreen}`}
                        >
                          <Box className={styles.adviceCardHeader}>
                            <Box className={styles.adviceCardIconRegular}>
                              <Heart
                                className={styles.adviceCardIconRegularIcon}
                              />
                            </Box>
                            <Typography
                              variant="subtitle1"
                              className={styles.adviceCardTitleRegular}
                            >
                              Thời kỳ rụng trứng và thụ thai
                            </Typography>
                          </Box>
                          <Typography className={styles.adviceCardTextRegular}>
                            Thời điểm có khả năng thụ thai cao nhất
                          </Typography>
                          <List className={styles.adviceCardList}>
                            <ListItem className={styles.adviceCardListItem}>
                              Ngày rụng trứng dự kiến:{' '}
                              {formatDate(calculationResult.ovulationDate)}
                            </ListItem>
                            <ListItem className={styles.adviceCardListItem}>
                              Thời kỳ thụ thai:{' '}
                              {formatDate(
                                calculationResult.fertilityWindow.start
                              )}{' '}
                              -{' '}
                              {formatDate(
                                calculationResult.fertilityWindow.end
                              )}
                            </ListItem>
                            <ListItem className={styles.adviceCardListItem}>
                              Thời gian thụ thai kéo dài:{' '}
                              {Math.ceil(
                                (calculationResult.fertilityWindow.end -
                                  calculationResult.fertilityWindow.start) /
                                  (1000 * 60 * 60 * 24)
                              ) + 1}{' '}
                              ngày
                            </ListItem>
                          </List>
                        </Card>

                        {/* Nếu chu kỳ tiếp theo không khớp với chu kỳ đã nhập */}
                        {((compareCycleResultWithNext !== null && compareCycleResultWithNext.nextCycleLength !== compareCycleResultWithNext.actualCycleLength)
                         || (compareCycleResultWithLast !== null && compareCycleResultWithLast.lastCycleLength !== compareCycleResultWithLast.actualCycleLength)) && (
                          <Card
                            sx={{
                              background: '#F5F5DC',
                              border: '1.5px solid #f59e0b',
                              borderRadius: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2,
                              padding: '18px 20px',
                              margin: '36px 36px',
                              boxShadow: '0 2px 8px 0 rgba(239,68,68,0.08)',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', marginRight: 16 }}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                                style={{ color: '#f59e0b', flexShrink: 0 }}
                              >
                                <circle cx="12" cy="12" r="10" stroke="#f59e0b" strokeWidth="2" fill="#F5F5DC" />
                                <path d="M12 8v4" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                                <circle cx="12" cy="16" r="1" fill="#f59e0b" />
                              </svg>
                            </div>
                            <div style={{ flex: 1 }}>
                              <Typography
                                sx={{
                                  color: '#f59e0b',
                                  fontWeight: 700,
                                  fontSize: '1.08rem',
                                  letterSpacing: '0.5px',
                                  lineHeight: 1.5,
                                }}
                              >
                                Cảnh báo: Độ dài chu kỳ không khớp!
                              </Typography>

                              {(compareCycleResultWithLast !== null && compareCycleResultWithLast.lastCycleLength !== compareCycleResultWithLast.actualCycleLength) && (
                                <Typography
                                  sx={{
                                    color: '#f59e0b',
                                    fontSize: '0.97rem',
                                    marginTop: '2px',
                                    lineHeight: 2,
                                  }}
                                >
                                  Chu kỳ trước ({compareCycleResultWithLast?.lastCycle?.startDate && formatDate(compareCycleResultWithLast.lastCycle.startDate)},
                                   dài {compareCycleResultWithLast.lastCycleLength} ngày)
                                   cách chu kỳ được nhập: {compareCycleResultWithLast.actualCycleLength.toFixed(0)} ngày.
                                  <br />
                                </Typography>
                              )}
                              {(compareCycleResultWithNext !== null && compareCycleResultWithNext.nextCycleLength !== compareCycleResultWithNext.actualCycleLength) && (
                              <Typography
                                sx={{
                                  color: '#f59e0b',
                                  fontSize: '0.97rem',
                                  marginTop: '2px',
                                  lineHeight: 2,
                                }}
                              >
                                Chu kỳ sau ({compareCycleResultWithNext?.nextCycle?.startDate && formatDate(compareCycleResultWithNext.nextCycle.startDate)},
                                 dài {compareCycleResultWithNext.nextCycleLength} ngày)
                                 cách chu kỳ được nhập:  {compareCycleResultWithNext.actualCycleLength.toFixed(0)} ngày.
                                <br />
                              </Typography>
                              )}

                              <Typography
                                sx={{
                                  color: '#f59e0b',
                                  fontSize: '0.97rem',
                                  marginTop: '2px',
                                  lineHeight: 2,
                                }}
                              >
                                Hãy chắc chắn rằng bạn đã nhập đúng thông tin về chu kỳ kinh nguyệt của mình trước khi lưu thông tin vào hồ sơ để dữ liệu được tính toán chính xác hơn.
                              </Typography>
                            </div>
                          </Card>
                        )}
                        

                      </Box>

                      {/* Button actions */}
                      <Box sx={{ textAlign: 'center', marginTop: 3 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: '12px',
                            gap: '12px',
                            flexWrap: { xs: 'wrap', sm: 'nowrap' },
                          }}
                        >
                          <button
                            className={styles.addCycleButton}
                            onClick={() => {
                              setCalculationResult(null);
                              setShowForm(true);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              style={{ marginRight: '8px' }}
                            >
                              <path d="M21 12a9 9 0 01-9 9"></path>
                              <path d="M3 12a9 9 0 009-9"></path>
                              <path d="M12 7l-3-3 3-3"></path>
                              <path d="M12 17l3 3-3 3"></path>
                            </svg>
                            Tính toán lại
                          </button>
                          {isLoggedIn && (
                            <button
                              className={styles.saveButton}
                              onClick={handleSaveCycleToDatabase}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ marginRight: '8px' }}
                              >
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                <polyline points="7 3 7 8 15 8"></polyline>
                              </svg>
                              Lưu chu kỳ vào hồ sơ
                            </button>
                          )}
                        </Box>
                        <button
                          className={styles.resetButton}
                          onClick={handleClearCalculationResult}
                        >
                          Đóng kết quả
                        </button>
                      </Box>

                      {/* Lưu ý */}
                      <Box className={styles.healthAdviceNote}>
                        <b>Lưu ý:</b> Đây chỉ là kết quả tính toán dự đoán. Kết
                        quả thực tế có thể khác do nhiều yếu tố ảnh hưởng.
                        {isLoggedIn && (
                          <span>
                            {' '}
                            Bạn có thể lưu kết quả tính toán này vào hồ sơ bằng
                            cách bấm nút "Lưu chu kỳ vào hồ sơ".
                          </span>
                        )}
                        {!isLoggedIn && (
                          <span>
                            {' '}
                            Đăng nhập để lưu chu kỳ vào hồ sơ cá nhân của bạn.
                          </span>
                        )}
                      </Box>
                    </Card>
                  </Box>
                )}

                {/* Health Advice Section */}
                <Box className={styles.healthAdviceSection}>
                  <Card className={styles.healthAdviceCard}>
                    <Box className={styles.healthAdviceHeader}>
                      <Box className={styles.healthAdviceIconWrapper}>
                        <FavoriteBorderIcon
                          className={styles.healthAdviceIcon}
                        />
                      </Box>
                      <Box>
                        <Typography
                          variant="h6"
                          className={styles.healthAdviceTitle}
                        >
                          Lời khuyên sức khỏe
                        </Typography>
                        <Typography className={styles.healthAdviceSubtitle}>
                          Dựa trên dữ liệu chu kỳ của bạn
                        </Typography>
                      </Box>
                    </Box>

                    <Box>
                      {advice.map((item, index) => (
                        <Card
                          key={index}
                          className={`${styles.adviceCardRegular} ${styles[`adviceCard${item.color.charAt(0).toUpperCase() + item.color.slice(1)}`]}`}
                        >
                          <Box className={styles.adviceCardHeader}>
                            <Box className={styles.adviceCardIconRegular}>
                              {item.icon}
                            </Box>
                            <Box>
                              <Typography
                                className={styles.adviceCardTitleRegular}
                              >
                                {item.title}
                              </Typography>
                              <Typography
                                className={styles.adviceCardTextRegular}
                              >
                                {item.description}
                              </Typography>
                            </Box>
                          </Box>
                          <List className={styles.adviceCardList}>
                            {item.tips.map((tip, tipIndex) => (
                              <ListItem
                                key={tipIndex}
                                className={styles.adviceCardListItem}
                              >
                                {tip}
                              </ListItem>
                            ))}
                          </List>
                        </Card>
                      ))}
                    </Box>

                    {/* Lưu ý */}
                    <Box className={styles.healthAdviceNote}>
                      <b>Lưu ý:</b> Những lời khuyên này chỉ mang tính chất tham
                      khảo. Nếu có bất thường hoặc lo lắng, hãy tham khảo ý kiến
                      bác sĩ chuyên khoa.
                    </Box>
                  </Card>
                </Box>
              </>
            )}
          </>
        ) : (
          <div className={styles.introduction}>
            {/* Header */}
            <div className={styles.header}>
              <div className="text-center">
                <h2 className={styles.headerTitle}>
                  Lợi Ích Của Việc Theo Dõi Chu Kỳ & Chăm Sóc Bản Thân
                </h2>
                <p className={styles.headerSubtitle}>
                  Hiểu rõ cơ thể để chăm sóc bản thân tốt hơn
                </p>
              </div>
            </div>

            <div className={styles.content}>
              {/* Benefits Grid */}
              <div className={styles.benefitsGrid}>
                {benefits.map((benefit, index) => (
                  <div key={index} className={styles.benefitCard}>
                    <div className="flex items-start space-x-3">
                      <div className={styles.benefitIconWrapper}>
                        {benefit.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className={styles.benefitTitle}>{benefit.title}</h4>
                        <p className={styles.benefitDescription}>
                          {benefit.description}
                        </p>
                        {benefit.details.map((detail, detailIndex) => (
                          <div
                            key={detailIndex}
                            className={styles.benefitDetail}
                          >
                            <div className={styles.benefitBullet}></div>
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Care Phases Section */}
              <div>
                <button
                  onClick={() => toggleSection('care')}
                  className={`${styles.sectionButton} ${styles.careButton}`}
                >
                  <h3 className={styles.sectionTitle}>
                    Chăm Sóc Bản Thân Theo Từng Giai Đoạn
                  </h3>
                  <div
                    className={`${styles.chevronIcon} ${expandedSection === 'care' ? styles.expanded : ''}`}
                  >
                    {expandedSection === 'care' ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </button>

                {expandedSection === 'care' && (
                  <div className={styles.careGrid}>
                    {carePhases.map((phase, index) => (
                      <div
                        key={index}
                        className={`${styles.carePhaseCard} ${styles[phase.color]}`}
                      >
                        <div className={styles.carePhaseHeader}>
                          <div className={styles.carePhaseIcon}>
                            {phase.icon}
                          </div>
                          <h4 className={styles.carePhaseTitle}>
                            {phase.phase}
                          </h4>
                        </div>
                        <ul className={styles.careTipsList}>
                          {phase.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className={styles.careTip}>
                              <div className={styles.tipBullet}></div>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Warning Signs Section */}
              <div>
                <button
                  onClick={() => toggleSection('warning')}
                  className={`${styles.sectionButton} ${styles.warningButton}`}
                >
                  <h3
                    className={`${styles.sectionTitle} flex items-center space-x-2`}
                  >
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span>Khi Nào Nên Đi Khám?</span>
                  </h3>
                  <div
                    className={`${styles.chevronIcon} ${expandedSection === 'warning' ? styles.expanded : ''}`}
                  >
                    {expandedSection === 'warning' ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </button>

                {expandedSection === 'warning' && (
                  <div className={styles.warningContent}>
                    <ul className={styles.warningList}>
                      {warningSignals.map((signal, index) => (
                        <li key={index} className={styles.warningItem}>
                          <AlertTriangle className={styles.warningIcon} />
                          <span>{signal}</span>
                        </li>
                      ))}
                    </ul>
                    <div className={styles.warningNote}>
                      <p className={styles.warningNoteText}>
                        <strong className={styles.warningNoteHighlight}>
                          Lưu ý:
                        </strong>{' '}
                        Nếu gặp bất kỳ triệu chứng nào ở trên, hãy tham khảo ý
                        kiến bác sĩ chuyên khoa để được tư vấn và điều trị kịp
                        thời.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className={styles.authButtons}>
                <button
                  className={styles.loginButton}
                  onClick={() => {
                    window.location.href = '/#/login';
                  }}
                >
                  Đăng nhập để sử dụng đầy đủ tính năng
                </button>
                <button
                  className={styles.refreshButton}
                  onClick={refreshAuthStatus}
                  disabled={isCheckingAuth}
                >
                  {isCheckingAuth
                    ? 'Đang kiểm tra...'
                    : 'Kiểm tra lại trạng thái đăng nhập'}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Modal chi tiết chu kỳ */}
        {showCycleDetail && selectedCycleForDetail && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '20px'
            }}
            onClick={handleCloseCycleDetail}
          >
            <Box
              sx={{
                backgroundColor: 'white',
                borderRadius: '16px',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '80vh',
                overflow: 'auto',
                padding: '24px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: '600', color: '#1f2937' }}>
                  Chi tiết chu kỳ #{menstrualCycles.length - menstrualCycles.indexOf(selectedCycleForDetail)}
                </Typography>
                <button
                  onClick={handleCloseCycleDetail}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#6b7280',
                    padding: '4px'
                  }}
                >
                  ×
                </button>
              </Box>

              {/* Thông tin cơ bản */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#374151', fontWeight: '600' }}>
                  📅 Thông tin cơ bản
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <Box sx={{ p: 2, backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                    <Typography sx={{ fontSize: '14px', color: '#6b7280', mb: 1 }}>Ngày bắt đầu</Typography>
                    <Typography sx={{ fontWeight: '600', color: '#1f2937' }}>
                      {formatDate(selectedCycleForDetail.startDate)}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2, backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                    <Typography sx={{ fontSize: '14px', color: '#6b7280', mb: 1 }}>Số ngày hành kinh</Typography>
                    <Typography sx={{ fontWeight: '600', color: '#1f2937' }}>
                      {selectedCycleForDetail.numberOfDays} ngày
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2, backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                    <Typography sx={{ fontSize: '14px', color: '#6b7280', mb: 1 }}>Độ dài chu kỳ</Typography>
                    <Typography sx={{ fontWeight: '600', color: '#1f2937' }}>
                      {selectedCycleForDetail.cycleLength} ngày
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2, backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                    <Typography sx={{ fontSize: '14px', color: '#6b7280', mb: 1 }}>Ngày rụng trứng dự kiến</Typography>
                    <Typography sx={{ fontWeight: '600', color: '#1f2937' }}>
                      {formatDate(selectedCycleForDetail.ovulationDate)}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Phân tích chi tiết */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#374151', fontWeight: '600' }}>
                  🔍 Phân tích chi tiết
                </Typography>
                <Box sx={{ display: 'grid', gap: 2 }}>
                  {/* Đánh giá độ dài chu kỳ */}
                  <Box sx={{ p: 3, border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                    <Typography sx={{ fontWeight: '600', mb: 1, color: '#374151' }}>
                      Đánh giá độ dài chu kỳ
                    </Typography>
                    <Typography sx={{ fontSize: '14px', color: '#6b7280', mb: 2 }}>
                      {selectedCycleForDetail.cycleLength < 21 
                        ? '🔴 Chu kỳ ngắn (dưới 21 ngày)' 
                        : selectedCycleForDetail.cycleLength > 35 
                          ? '🔴 Chu kỳ dài (trên 35 ngày)' 
                          : '🟢 Chu kỳ bình thường (21-35 ngày)'}
                    </Typography>
                    {selectedCycleForDetail.cycleLength < 21 && (
                      <Typography sx={{ fontSize: '13px', color: '#ef4444', fontStyle: 'italic' }}>
                        Chu kỳ ngắn có thể do stress, tập thể dục quá mức, hoặc thiếu hụt dinh dưỡng.
                      </Typography>
                    )}
                    {selectedCycleForDetail.cycleLength > 35 && (
                      <Typography sx={{ fontSize: '13px', color: '#ef4444', fontStyle: 'italic' }}>
                        Chu kỳ dài có thể do PCOS, rối loạn tuyến giáp, hoặc stress.
                      </Typography>
                    )}
                    {selectedCycleForDetail.cycleLength >= 21 && selectedCycleForDetail.cycleLength <= 35 && (
                      <Typography sx={{ fontSize: '13px', color: '#16a34a', fontStyle: 'italic' }}>
                        Độ dài chu kỳ trong khoảng bình thường, điều này rất tốt!
                      </Typography>
                    )}
                  </Box>

                  {/* Đánh giá kỳ kinh */}
                  <Box sx={{ p: 3, border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                    <Typography sx={{ fontWeight: '600', mb: 1, color: '#374151' }}>
                      Đánh giá kỳ kinh
                    </Typography>
                    <Typography sx={{ fontSize: '14px', color: '#6b7280', mb: 2 }}>
                      {selectedCycleForDetail.numberOfDays < 3 
                        ? '🔴 Kỳ kinh ngắn (dưới 3 ngày)' 
                        : selectedCycleForDetail.numberOfDays > 7 
                          ? '🔴 Kỳ kinh dài (trên 7 ngày)' 
                          : '🟢 Kỳ kinh bình thường (3-7 ngày)'}
                    </Typography>
                    {selectedCycleForDetail.numberOfDays < 3 && (
                      <Typography sx={{ fontSize: '13px', color: '#ef4444', fontStyle: 'italic' }}>
                        Kỳ kinh ngắn có thể do rối loạn hormone hoặc stress.
                      </Typography>
                    )}
                    {selectedCycleForDetail.numberOfDays > 7 && (
                      <Typography sx={{ fontSize: '13px', color: '#ef4444', fontStyle: 'italic' }}>
                        Kỳ kinh dài có thể do u xơ tử cung, polyp, hoặc rối loạn đông máu.
                      </Typography>
                    )}
                    {selectedCycleForDetail.numberOfDays >= 3 && selectedCycleForDetail.numberOfDays <= 7 && (
                      <Typography sx={{ fontSize: '13px', color: '#16a34a', fontStyle: 'italic' }}>
                        Độ dài kỳ kinh trong khoảng bình thường.
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>

              {/* Thời gian quan trọng */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#374151', fontWeight: '600' }}>
                  ⏰ Thời gian quan trọng trong chu kỳ này
                </Typography>
                <Box sx={{ display: 'grid', gap: 2 }}>
                  <Box sx={{ p: 3, backgroundColor: '#fef3c7', borderRadius: '8px', border: '1px solid #fbbf24' }}>
                    <Typography sx={{ fontWeight: '600', mb: 1, color: '#92400e' }}>
                      🥚 Thời kỳ rụng trứng
                    </Typography>
                    <Typography sx={{ fontSize: '14px', color: '#92400e' }}>
                      Ngày {formatDate(selectedCycleForDetail.ovulationDate)} (khoảng ngày thứ {selectedCycleForDetail.cycleLength - 14} của chu kỳ)
                    </Typography>
                  </Box>
                  
                  <Box sx={{ p: 3, backgroundColor: '#fce7f3', borderRadius: '8px', border: '1px solid #f472b6' }}>
                    <Typography sx={{ fontWeight: '600', mb: 1, color: '#be185d' }}>
                      💕 Thời kỳ thụ thai
                    </Typography>
                    <Typography sx={{ fontSize: '14px', color: '#be185d' }}>
                      Từ 5 ngày trước đến 1 ngày sau ngày rụng trứng (khả năng thụ thai cao nhất)
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Lưu ý */}
              <Box sx={{ p: 3, backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #0ea5e9' }}>
                <Typography sx={{ fontWeight: '600', mb: 1, color: '#0c4a6e', fontSize: '14px' }}>
                  💡 Lưu ý quan trọng
                </Typography>
                <Typography sx={{ fontSize: '13px', color: '#0c4a6e', lineHeight: 1.5 }}>
                  Thông tin này chỉ mang tính chất tham khảo. Mỗi người có chu kỳ kinh nguyệt khác nhau và có thể thay đổi theo thời gian.
                  Nếu có bất kỳ lo ngại nào, hãy tham khảo ý kiến bác sĩ chuyên khoa.
                </Typography>
              </Box>

              {/* Action buttons */}
              <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
                <button
                  onClick={() => {
                    handleCloseCycleDetail();
                    handleEditCycle(selectedCycleForDetail);
                  }}
                  style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Edit style={{ width: '16px', height: '16px' }} />
                  Chỉnh sửa
                </button>
                <button
                  onClick={handleCloseCycleDetail}
                  style={{
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Đóng
                </button>
              </Box>
            </Box>
          </Box>
        )}

        {/* Modal Calendar */}
        {showCalendarModal && selectedCycleForCalendar && (
          <MenstrualCycleCalendar
            cycle={selectedCycleForCalendar}
            onClose={handleCloseCalendarModal}
          />
        )}
      </Container>
    </LocalizationProvider>
  );
};
export default OvulationPage;
