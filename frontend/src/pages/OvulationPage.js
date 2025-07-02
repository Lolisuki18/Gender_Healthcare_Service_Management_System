import { Container, Box, Typography, Card, Grid } from '@mui/material';
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
  Bell,
  BellOff,
  Pause,
} from 'lucide-react';
import MenstrualCycleForm from '../components/MenstrualCycle/MenstrualCycleForm.js';

// const defaultStats = {
//   averageCycleLength: 28,
//   totalCycles: 10,
//   averagePeriodLength: 5,
//   nextPredictedPeriod: '2025-07-01',
//   consistency: 'irregular',
// };

const OvulationPage = ({ stats }) => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    const checkLogin = async () => {
      const userData = await ovulationService.getCurrentUser();
      if (userData) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLogin();
    window.addEventListener('storage', checkLogin);
    return () => {
      window.removeEventListener('storage', checkLogin);
    };
  }, []);

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

  useEffect(() => {
    if (isLoggedIn) {
      fetchMenstrualCycles();
    }
  }, [isLoggedIn]);

  // Tỉ lệ mang thai
  const [pregnancyProb, setPregnancyProb] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data =
          await ovulationService.getAllMenstrualCyclesWithPregnancyProb();
        setPregnancyProb(data);
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu tỉ lệ mang thai:', err);
      }
    };
    fetchData();
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

  // Tính độ đồng đều
  // const getConsistency = (menstrualCycles) => {
  //   if (!menstrualCycles.length) return null;

  //   let consistency = 'unknown';
  //   if (menstrualCycles.length >= 3) {
  //     const variance = menstrualCycles.reduce((sum, length) => sum + Math.pow(length - averagePeriodLength, 2), 0) / menstrualCycles.length;
  //     consistency = variance <= 4 ? 'regular' : 'irregular';
  //   }

  //   return consistency;
  // };
  const getConsistency = (menstrualCycles) => {
    console.log('🔍 [getConsistency] Input data:', menstrualCycles);

    if (!Array.isArray(menstrualCycles) || menstrualCycles.length < 3) {
      console.log(
        '❌ [getConsistency] Không đủ dữ liệu, cần ít nhất 3 chu kỳ. Hiện có:',
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

        // Kiểm tra số ngày kinh nguyệt (2-7 ngày là bình thường)
        if (
          !cycle.numberOfDays ||
          cycle.numberOfDays <= 2 ||
          cycle.numberOfDays > 7
        ) {
          console.log(
            '❌ [getConsistency] Chu kỳ không đều - số ngày kinh không hợp lệ:',
            cycle.numberOfDays
          );
          return 'irregular';
        }

        // Kiểm tra độ dài chu kỳ có tồn tại
        if (!cycle.cycleLength || typeof cycle.cycleLength !== 'number') {
          console.log(
            '❌ [getConsistency] Dữ liệu không đầy đủ - thiếu cycleLength:',
            cycle.cycleLength
          );
          return 'unknown';
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

      // Nếu chênh lệch tối đa > 7 ngày thì được coi là không đều
      const result = maxDifference <= 7 ? 'regular' : 'irregular';
      console.log('✅ [getConsistency] Kết quả cuối cùng:', result);

      return result;
    } catch (error) {
      console.error('💥 [getConsistency] Lỗi khi tính consistency:', error);
      return 'unknown';
    }
  };

  // Hàm lấy thông tin trạng thái nhắc nhở
  const getReminderStatusInfo = (cycle) => {
    if (!cycle.reminderEnabled) {
      return {
        icon: <BellOff className={styles.reminderIcon} />,
        text: 'Không có nhắc nhở',
        className: styles.reminderDisabled,
      };
    }

    const status = cycle.reminderStatus || 'active';
    switch (status) {
      case 'active':
        return {
          icon: <Bell className={styles.reminderIcon} />,
          text: 'Nhắc nhở đang hoạt động',
          className: styles.reminderActive,
        };
      case 'paused':
        return {
          icon: <Pause className={styles.reminderIcon} />,
          text: 'Nhắc nhở tạm dừng',
          className: styles.reminderPaused,
        };
      case 'disabled':
        return {
          icon: <BellOff className={styles.reminderIcon} />,
          text: 'Nhắc nhở đã tắt',
          className: styles.reminderDisabled,
        };
      default:
        return {
          icon: <Bell className={styles.reminderIcon} />,
          text: 'Nhắc nhở đang hoạt động',
          className: styles.reminderActive,
        };
    }
  };

  const consistency = getConsistency(menstrualCycles);
  console.log('🎯 [Main] Kết quả consistency đã tính:', consistency);

  // Data cho biểu đồ
  const chartData = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5'],
    datasets: [
      {
        label: 'Chu kỳ thực tế',
        data: [28, 29, 28, 28, 28],
        borderColor: '#E91E63',
        backgroundColor: '#E91E63',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#E91E63',
      },
      {
        label: 'Trung bình',
        data: [28, 28, 28, 28, 28],
        borderColor: '#9C27B0',
        backgroundColor: '#9C27B0',
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#9C27B0',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 20,
        max: 35,
        ticks: {
          stepSize: 2,
          color: '#666',
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(0,0,0,0.05)',
          drawBorder: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#666',
          font: {
            size: 12,
          },
        },
      },
    },
  };

  const [expandedSection, setExpandedSection] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [calculationResult, setCalculationResult] = useState(null);
  const [isRefetching, setIsRefetching] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Edit cycle states
  const [editingCycle, setEditingCycle] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

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
      default:
        return styles.unknown;
    }
  };

  const getConsistencyText = (consistency) => {
    switch (consistency) {
      case 'regular':
        return 'Đều đặn';
      case 'irregular':
        return 'Không đều';
      default:
        return 'Chưa đủ dữ liệu';
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
      subValue: 'Đánh giá chu kỳ',
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
        title: 'Chu kỳ đều đặn',
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
      advice.push({
        icon: <Activity className="h-6 w-6 text-yellow-600" />,
        title: 'Chu kỳ không đều',
        description:
          'Chu kỳ có thể bị ảnh hưởng bởi stress, thay đổi cân nặng hoặc lối sống.',
        tips: [
          'Giảm stress thông qua yoga hoặc thiền',
          'Duy trì cân nặng ổn định',
          'Tham khảo ý kiến bác sĩ nếu cần',
        ],
        color: 'yellow',
      });
    }

    if (
      getAverageCycleLength(menstrualCycles) < 21 &&
      getAverageCycleLength(menstrualCycles) !== null
    ) {
      advice.push({
        icon: <Zap className="h-6 w-6 text-red-600" />,
        title: 'Chu kỳ ngắn',
        description: 'Chu kỳ ngắn hơn 21 ngày có thể cần được kiểm tra y tế.',
        tips: [
          'Theo dõi kỹ hơn các triệu chứng',
          'Ghi chú về stress và thay đổi lối sống',
          'Nên thăm khám bác sĩ',
        ],
        color: 'red',
      });
    } else if (getAverageCycleLength(menstrualCycles) > 35) {
      advice.push({
        icon: <Lightbulb className="h-6 w-6 text-blue-600" />,
        title: 'Chu kỳ dài',
        description:
          'Chu kỳ dài hơn 35 ngày có thể do nhiều nguyên nhân khác nhau.',
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
      if (data.saveToDatabase) {
        // Lưu vào database
        await ovulationService.createMenstrualCycle(data);

        // Refetch dữ liệu để cập nhật UI
        await fetchMenstrualCycles(true);

        // Reset về trang đầu để hiển thị chu kỳ mới nhất
        setCurrentPage(1);

        setShowForm(false);
        setCalculationResult(null); // Clear calculation result

        // Show success message
        const successMessage = document.createElement('div');
        successMessage.innerHTML = '✅ Đã cập nhật dữ liệu thành công!';
        successMessage.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          z-index: 10000;
          font-weight: 600;
          animation: slideInRight 0.3s ease-out;
        `;
        document.body.appendChild(successMessage);

        // Remove success message after 3 seconds
        setTimeout(() => {
          if (document.body.contains(successMessage)) {
            successMessage.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
              if (document.body.contains(successMessage)) {
                document.body.removeChild(successMessage);
              }
            }, 300);
          }
        }, 3000);

        alert('Ghi nhận chu kỳ mới thành công!');

        // Scroll to top để người dùng thấy dữ liệu mới
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
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
      }
    } catch (error) {
      console.error('Lỗi khi xử lý chu kỳ:', error);
      alert(
        data.saveToDatabase
          ? 'Ghi nhận chu kỳ thất bại!'
          : 'Tính toán thất bại!'
      );
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

  // Hàm xử lý edit chu kỳ
  const handleEditCycle = (cycle) => {
    setEditingCycle(cycle);
    setShowEditForm(true);
    setShowForm(false);
    setCalculationResult(null);
  };

  // Hàm xử lý submit khi edit chu kỳ
  const handleSubmitEditCycle = async (data) => {
    try {
      await ovulationService.updateMenstrualCycle(editingCycle.id, data);

      // Refetch dữ liệu để cập nhật UI
      await fetchMenstrualCycles(true);

      setShowEditForm(false);
      setEditingCycle(null);

      // Show success message
      const successMessage = document.createElement('div');
      successMessage.innerHTML = '✅ Cập nhật chu kỳ thành công!';
      successMessage.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        z-index: 10000;
        font-weight: 600;
        animation: slideInRight 0.3s ease-out;
      `;
      document.body.appendChild(successMessage);

      // Remove success message after 3 seconds
      setTimeout(() => {
        if (document.body.contains(successMessage)) {
          successMessage.style.animation = 'slideOutRight 0.3s ease-in';
          setTimeout(() => {
            if (document.body.contains(successMessage)) {
              document.body.removeChild(successMessage);
            }
          }, 300);
        }
      }, 3000);

      alert('Cập nhật chu kỳ thành công!');

      // Scroll to top để người dùng thấy dữ liệu đã cập nhật
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Lỗi khi cập nhật chu kỳ:', error);
      alert('Cập nhật chu kỳ thất bại!');
    }
  };

  // Hàm xử lý xóa chu kỳ
  const handleDeleteCycle = async (cycle) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa chu kỳ #${menstrualCycles.length - menstrualCycles.indexOf(cycle)} không? Hành động này không thể hoàn tác.`
      )
    ) {
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

        // Show success message
        const successMessage = document.createElement('div');
        successMessage.innerHTML = '✅ Xóa chu kỳ thành công!';
        successMessage.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
          z-index: 10000;
          font-weight: 600;
          animation: slideInRight 0.3s ease-out;
        `;
        document.body.appendChild(successMessage);

        // Remove success message after 3 seconds
        setTimeout(() => {
          if (document.body.contains(successMessage)) {
            successMessage.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
              if (document.body.contains(successMessage)) {
                document.body.removeChild(successMessage);
              }
            }, 300);
          }
        }, 3000);

        alert('Xóa chu kỳ thành công!');
      } catch (error) {
        console.error('Lỗi khi xóa chu kỳ:', error);
        alert('Xóa chu kỳ thất bại!');
      }
    }
  };

  // Hàm cancel edit
  const handleCancelEdit = () => {
    setShowEditForm(false);
    setEditingCycle(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
      <Container maxWidth="lg" className={styles.container}>
        {isLoggedIn ? (
          <>
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Typography>Đang tải dữ liệu...</Typography>
              </div>
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

                                {/* Edit and Delete buttons */}
                                <Box className={styles.cycleItemActions}>
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

                                {/* Reminder status */}
                                <Box className={styles.cycleDetailItem}>
                                  <Typography
                                    className={styles.cycleDetailLabel}
                                  >
                                    Trạng thái nhắc nhở:
                                  </Typography>
                                  <Typography
                                    className={styles.cycleDetailValue}
                                  >
                                    {getReminderStatusInfo(cycle).text}
                                  </Typography>
                                </Box>

                                {/* Reminder status badge */}
                                <Box
                                  className={`${styles.cycleReminderBadge} ${getReminderStatusInfo(cycle).className}`}
                                >
                                  {getReminderStatusInfo(cycle).icon}
                                  <Typography
                                    className={styles.cycleReminderText}
                                  >
                                    {getReminderStatusInfo(cycle).text}
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
                {showForm && (
                  <Box sx={{ marginBottom: 4 }}>
                    <MenstrualCycleForm
                      onSubmit={handleSubmitCycle}
                      onCancel={() => setShowForm(false)}
                    />
                  </Box>
                )}

                {/* Form chỉnh sửa chu kỳ */}
                {showEditForm && editingCycle && (
                  <Box sx={{ marginBottom: 4 }}>
                    <MenstrualCycleForm
                      onSubmit={handleSubmitEditCycle}
                      onCancel={handleCancelEdit}
                      initialData={editingCycle}
                      isEditMode={true}
                    />
                  </Box>
                )}

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
                      </Box>

                      {/* Button actions */}
                      <Box sx={{ textAlign: 'center', marginTop: 3 }}>
                        <button
                          className={styles.addCycleButton}
                          onClick={() => {
                            setCalculationResult(null);
                            setShowForm(true);
                          }}
                          style={{ marginRight: '12px' }}
                        >
                          Tính toán lại
                        </button>
                        <button
                          className={styles.resetButton}
                          onClick={() => setCalculationResult(null)}
                        >
                          Đóng kết quả
                        </button>
                      </Box>

                      {/* Lưu ý */}
                      <Box className={styles.healthAdviceNote}>
                        <b>Lưu ý:</b> Đây chỉ là kết quả tính toán dự đoán. Kết
                        quả thực tế có thể khác do nhiều yếu tố ảnh hưởng. Để có
                        dữ liệu chính xác hơn, hãy chọn "Bạn đang tính chỉ số
                        cho chính mình?" và lưu thông tin vào hồ sơ.
                      </Box>
                    </Card>
                  </Box>
                )}

                {/* Chart Section */}
                {/* <Grid container spacing={3}>
                <Card className={styles.chartCard}>
                  <Box className={styles.chartHeader}>
                    <Typography variant="h6" className={styles.chartTitle}>
                      Biểu đồ chu kỳ
                    </Typography>
                    <Typography className={styles.chartSubtitle}>
                      Thống kê 5 chu kỳ gần nhất
                    </Typography>
                  </Box>

                  <Box className={styles.legendContainer}>
                    <Box className={styles.legendItem}>
                      <Box
                        className={styles.legendDot}
                        style={{ backgroundColor: '#E91E63' }}
                      />
                      <Typography className={styles.legendText}>
                        Chu kỳ thực tế
                      </Typography>
                    </Box>
                    <Box className={styles.legendItem}>
                      <Box
                        className={styles.legendDot}
                        style={{ backgroundColor: '#9C27B0' }}
                      />
                      <Typography className={styles.legendText}>
                        Trung bình
                      </Typography>
                    </Box>
                  </Box>

                  <Box className={styles.chartContainer}>
                    <Line
                      data={chartData}
                      options={chartOptions}
                      className={styles.chartCanvas}
                    />
                  </Box>

                  <Box className={styles.statsFooterWrapper}>
                    <Box className={styles.statsFooter}>
                      <Box className={styles.statsFooterCard}>
                        <Typography className={styles.statSubtext}>
                          Chu kỳ ngắn nhất
                        </Typography>
                        <Typography variant="h6" className={styles.statValue}>
                          28 ngày
                        </Typography>
                      </Box>
                      <Box className={styles.statsFooterCard}>
                        <Typography className={styles.statSubtext}>
                          Chu kỳ dài nhất
                        </Typography>
                        <Typography variant="h6" className={styles.statValue}>
                          28 ngày
                        </Typography>
                      </Box>
                      <Box className={styles.statsFooterCard}>
                        <Typography className={styles.statSubtext}>
                          Chênh lệch
                        </Typography>
                        <Typography variant="h6" className={styles.statValue}>
                          0 ngày
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              </Grid> */}

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

                    {/* Card: Chu kỳ đều đặn */}
                    {/* <Card className={styles.adviceCardRegular}>
                    <Box className={styles.adviceCardHeader}>
                      <Box className={styles.adviceCardIconRegular}>
                        <FavoriteBorderIcon
                          className={styles.adviceCardIconRegularIcon}
                        />
                      </Box>
                      <Typography
                        variant="subtitle1"
                        className={styles.adviceCardTitleRegular}
                      >
                        Chu kỳ đều đặn
                      </Typography>
                    </Box>
                    <Typography className={styles.adviceCardTextRegular}>
                      Chu kỳ của bạn rất đều đặn! Hãy duy trì lối sống lành mạnh
                      hiện tại.
                    </Typography>
                    <List className={styles.adviceCardList}>
                      <ListItem className={styles.adviceCardListItem}>
                        Tiếp tục duy trì chế độ ăn uống cân bằng
                      </ListItem>
                      <ListItem className={styles.adviceCardListItem}>
                        Tập thể dục đều đặn
                      </ListItem>
                      <ListItem className={styles.adviceCardListItem}>
                        Ngủ đủ 7-8 tiếng mỗi ngày
                      </ListItem>
                    </List>
                  </Card> */}

                    {/* Card: Lời khuyên chung */}
                    {/* <Card className={styles.adviceCardGeneral}>
                    <Box className={styles.adviceCardHeader}>
                      <Box className={styles.adviceCardIconGeneral}>
                        <FavoriteBorderIcon
                          className={styles.adviceCardIconGeneralIcon}
                        />
                      </Box>
                      <Typography
                        variant="subtitle1"
                        className={styles.adviceCardTitleGeneral}
                      >
                        Lời khuyên chung
                      </Typography>
                    </Box>
                    <Typography className={styles.adviceCardTextGeneral}>
                      Những thói quen tốt để duy trì sức khỏe sinh sản.
                    </Typography>
                    <List className={styles.adviceCardList}>
                      <ListItem className={styles.adviceCardListItem}>
                        Uống đủ 2-3 lít nước mỗi ngày
                      </ListItem>
                      <ListItem className={styles.adviceCardListItem}>
                        Ăn nhiều rau xanh và trái cây
                      </ListItem>
                      <ListItem className={styles.adviceCardListItem}>
                        Tập thể dục nhẹ nhàng trong kỳ kinh
                      </ListItem>
                      <ListItem className={styles.adviceCardListItem}>
                        Theo dõi và ghi chép đều đặn
                      </ListItem>
                    </List>
                  </Card> */}

                    {advice.map((item, index) => (
                      <Card
                        key={index}
                        className={`${styles.adviceCardRegular} ${styles[`adviceCard${item.color.charAt(0).toUpperCase() + item.color.slice(1)}`]}`}
                      >
                        <Box className={styles.adviceCardHeader}>
                          <Box className={styles.adviceCardIconRegular}>
                            {item.icon}
                          </Box>
                          <Typography
                            variant="subtitle1"
                            className={styles.adviceCardTitleRegular}
                          >
                            {item.title}
                          </Typography>
                        </Box>
                        <Typography className={styles.adviceCardTextRegular}>
                          {item.description}
                        </Typography>
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

              {/* Button chuyển đến trang đăng nhập */}
              <button
                className={styles.loginButton}
                onClick={() => (window.location.href = '/login')}
              >
                Đăng nhập để sử dụng đầy đủ tính năng
              </button>
            </div>
          </div>
        )}
      </Container>
    </LocalizationProvider>
  );
};
export default OvulationPage;
