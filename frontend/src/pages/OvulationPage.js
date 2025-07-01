import { Container, Box, Typography, Card, Grid, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';
import ovulationService from '../services/ovulationService';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { CheckCircle, Add } from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await ovulationService.getAllMenstrualCycles();
        
        console.log("🔍 Raw response từ API:", response);
        
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
        
        console.log("🔍 Data sau khi extract:", data);
        
        // Kiểm tra data có phải là mảng không
        if (Array.isArray(data)) {
          // Convert date arrays to Date objects
          const processedData = data.map(cycle => ({
            ...cycle,
            startDate: new Date(cycle.startDate[0], cycle.startDate[1] - 1, cycle.startDate[2]),
            ovulationDate: new Date(cycle.ovulationDate[0], cycle.ovulationDate[1] - 1, cycle.ovulationDate[2])
          }));
          
          setMenstrualCycles(processedData);
          console.log("🩸 Data đã xử lý:", processedData);
        } else {
          console.warn("❌ Data không phải là mảng:", data);
          console.warn("❌ Type của data:", typeof data);
          setMenstrualCycles([]);
        }
      } catch (err) {
        console.error('❌ Lỗi khi lấy dữ liệu chu kỳ:', err);
        setMenstrualCycles([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  // Tỉ lệ mang thai
  const [pregnancyProb, setPregnancyProb] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await ovulationService.getAllMenstrualCyclesWithPregnancyProb();
        setPregnancyProb(data);
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu tỉ lệ mang thai:', err);
      }
    };
    fetchData();
  }, []);

  // Độ dài chu kỳ trung bình
  const getAverageCycleLength = (menstrualCycles) => {
    if (!Array.isArray(menstrualCycles) || menstrualCycles.length === 0) return null;

    try {
      const total = menstrualCycles.reduce((sum, cycle) => sum + (cycle.cycleLength || 0), 0);
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
    if (!Array.isArray(menstrualCycles) || menstrualCycles.length === 0) return null;

    try {
      const total = menstrualCycles.reduce((sum, cycle) => sum + (cycle.numberOfDays || 0), 0);
      const average = total / menstrualCycles.length;
      return Math.round(average);
    } catch (error) {
      console.error('Lỗi khi tính average period length:', error);
      return null;
    }
  };

  const averagePeriodLength = getAveragePeriodLength(menstrualCycles);

  // Chu kỳ kinh nguyệt tiếp theo
  const [nextCycle, setNextCycle] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const data = await ovulationService.predictNextCycle(menstrualCycles);
      setNextCycle(data);
    };
    fetchData();
  }, [menstrualCycles]);

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
    if (!Array.isArray(menstrualCycles) || menstrualCycles.length < 3) {
      return 'unknown';
    }

    try {
      const cycleLengths = menstrualCycles.map(cycle => cycle.cycleLength).filter(length => typeof length === 'number');
      
      if (cycleLengths.length < 3) {
        return 'unknown';
      }
      
      const average = cycleLengths.reduce((sum, length) => sum + length, 0) / cycleLengths.length;
      const variance = cycleLengths.reduce((sum, length) => sum + Math.pow(length - average, 2), 0) / cycleLengths.length;
      
      return variance <= 4 ? 'regular' : 'irregular';
    } catch (error) {
      console.error('Lỗi khi tính consistency:', error);
      return 'unknown';
    }
  };

  const consistency = getConsistency(menstrualCycles);




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
      mainValue: averageLengthCycles ? `${averageLengthCycles} ngày` : 'Không có dữ liệu',
      subValue: menstrualCycles.length ? `${menstrualCycles.length} chu kỳ đã ghi nhận` : '0 chu kỳ đã ghi nhận',
      id: 'average-cycle',
    },
    {
      icon: <Clock className={`${styles.icon} ${styles.purple}`} />,
      iconWrapper: `${styles.iconWrapper} ${styles.purple}`,
      label: 'Kỳ kinh trung bình',
      mainValue: averagePeriodLength ? `${averagePeriodLength} ngày` : 'Không có dữ liệu',
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

    if (getAverageCycleLength(menstrualCycles) < 21) {
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

  const [openCycleForm, setOpenCycleForm] = useState(false);

  const handleOpenCycleForm = () => setOpenCycleForm(true);
  const handleCloseCycleForm = () => setOpenCycleForm(false);

  const handleSubmitCycle = async (data) => {
    try {
      const newCycle = await ovulationService.createMenstrualCycle(data);
      setMenstrualCycles((prev) => [...prev, newCycle]);
      setOpenCycleForm(false);
      alert('Ghi nhận chu kỳ mới thành công!');
    } catch (error) {
      console.error('Lỗi khi ghi nhận chu kỳ:', error);
      alert('Ghi nhận chu kỳ thất bại!');
    }
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

              {/* Add New Cycle Button */}
              <Box className={styles.addButtonCard}>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  className={styles.addButton}
                  onClick={handleOpenCycleForm}
                >
                  Ghi nhận chu kỳ mới
                </Button>
              </Box>

              {/* Health Advice Section */}
              <Box className={styles.healthAdviceSection}>
                <Card className={styles.healthAdviceCard}>
                  <Box className={styles.healthAdviceHeader}>
                    <Box className={styles.healthAdviceIconWrapper}>
                      <FavoriteBorderIcon className={styles.healthAdviceIcon} />
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
                    <Card key={index} className={styles.adviceCardRegular}>
                      <Box className={styles.adviceCardHeader}>
                        <Box className={styles.adviceCardIconRegular}>
                          {item.icon}
                        </Box>
                        <Typography variant="subtitle1" className={styles.adviceCardTitleRegular}>
                          {item.title}
                        </Typography>
                      </Box>
                      <Typography className={styles.adviceCardTextRegular}>
                        {item.description}
                      </Typography>
                      <List className={styles.adviceCardList}>
                        {item.tips.map((tip, tipIndex) => (
                          <ListItem key={tipIndex} className={styles.adviceCardListItem}>
                            {tip}
                          </ListItem>
                        ))}
                      </List>
                    </Card>
                  ))}


                  {/* Lưu ý */}
                  <Box className={styles.healthAdviceNote}>
                    <b>Lưu ý:</b> Những lời khuyên này chỉ mang tính chất tham
                    khảo. Nếu có bất thường hoặc lo lắng, hãy tham khảo ý kiến bác
                    sĩ chuyên khoa.
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
      <MenstrualCycleForm
        open={openCycleForm}
        onClose={handleCloseCycleForm}
        onSubmit={handleSubmitCycle}
      />
    </LocalizationProvider>
  );
};
export default OvulationPage;
