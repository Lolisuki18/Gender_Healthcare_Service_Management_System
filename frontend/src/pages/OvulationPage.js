import { Container, Box, Typography, Card, CardContent, Grid, Avatar, Button, Link, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';
import ovulationAuthService from '../services/ovulationAuthService';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import React, { useState, useEffect } from 'react';
import { CalendarToday, AccessTime, Timeline, CheckCircle, Add } from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { List, ListItem, ListItemText, Alert } from '@mui/material';
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
  AlertTriangle
} from 'lucide-react';

const OvulationPage = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const checkLogin = async () => {
      const userData = await ovulationAuthService.getCurrentUser();
      if (userData) {
        setIsLoggedIn(true);
        setUser(userData);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };
  
    checkLogin();
    window.addEventListener('storage', checkLogin);
    return () => {
      window.removeEventListener('storage', checkLogin);
    };
  }, []);

  const [menstrualCycles, setMenstrualCycles] = React.useState([]);

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
        pointBackgroundColor: '#E91E63'
      },
      {
        label: 'Trung bình',
        data: [28, 28, 28, 28, 28],
        borderColor: '#9C27B0',
        backgroundColor: '#9C27B0',
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#9C27B0'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
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
            size: 12
          }
        },
        grid: {
          color: 'rgba(0,0,0,0.05)',
          drawBorder: false
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#666',
          font: {
            size: 12
          }
        }
      }
    }
  };

  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const benefits = [
    {
      icon: <Heart className="h-6 w-6 text-pink-600" />,
      title: "Hiểu rõ cơ thể",
      description: "Biết được chu kỳ kinh nguyệt có đều không",
      details: ["Theo dõi triệu chứng như đau bụng, nổi mụn, mệt mỏi…"]
    },
    {
      icon: <Calendar className="h-6 w-6 text-purple-600" />,
      title: "Lập kế hoạch tốt hơn",
      description: "Dễ dàng sắp xếp công việc, du lịch, vận động thể thao",
      details: ["Tránh rơi vào tình huống bất ngờ do kinh đến đột ngột"]
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-indigo-600" />,
      title: "Cải thiện sức khỏe sinh sản",
      description: "Dự đoán thời điểm rụng trứng (hữu ích khi tránh thai hoặc mong muốn có con)",
      details: ["Phát hiện sớm dấu hiệu rối loạn nội tiết"]
    },
    {
      icon: <Brain className="h-6 w-6 text-green-600" />,
      title: "Tăng cường sức khỏe tinh thần",
      description: "Nhận biết mối liên hệ giữa tâm trạng và chu kỳ",
      details: ["Chủ động chăm sóc bản thân đúng thời điểm (nghỉ ngơi, giảm stress)"]
    },
    {
      icon: <Stethoscope className="h-6 w-6 text-blue-600" />,
      title: "Hỗ trợ bác sĩ khi cần",
      description: "Ghi chép đầy đủ giúp bác sĩ dễ chẩn đoán nếu có bất thường",
      details: ["Tiết kiệm thời gian và điều trị hiệu quả hơn"]
    }
  ];

  const carePhases = [
    {
      phase: "Trước kỳ kinh",
      icon: <Clock className="h-5 w-5 text-orange-600" />,
      tips: [
        "Ăn uống lành mạnh, tránh đường & caffeine",
        "Vận động nhẹ nhàng, ngủ đủ giấc"
      ],
      color: "orange"
    },
    {
      phase: "Trong kỳ kinh",
      icon: <Shield className="h-5 w-5 text-red-600" />,
      tips: [
        "Thay băng vệ sinh 4–6 tiếng/lần",
        "Ăn thực phẩm giàu sắt (rau xanh, thịt đỏ)",
        "Dùng túi chườm ấm hoặc thuốc giảm đau nếu cần"
      ],
      color: "red"
    },
    {
      phase: "Sau kỳ kinh",
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      tips: [
        "Tập thể dục nhẹ, bổ sung dinh dưỡng",
        "Theo dõi và ghi nhận bất thường"
      ],
      color: "green"
    }
  ];

  const warningSignals = [
    "Kinh quá nhiều, kéo dài >7 ngày",
    "Đau bụng dữ dội, trễ kinh thường xuyên",
    "Khí hư có mùi lạ hoặc màu bất thường"
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
      <Container maxWidth="lg" className={styles.container}>
        {isLoggedIn ? (
          <>
            {/* Stats Cards */}
            <Grid container className={styles.statsGrid}>
              {/* Card 1: Chu kỳ trung bình */}
              <Grid item>
                <Card className={styles.statCard}>
                  <Box className={styles.statHeader}>
                    <Box className={`${styles.iconWrapper} ${styles.iconPink}`}>
                      <CalendarToday className={styles.icon} />
                    </Box>
                    <span className={styles.statTitle}>Chu kỳ trung bình</span>
                  </Box>
                  <div className={styles.statValue}>28 ngày</div>
                  <div className={styles.statSubtext}>5 chu kỳ đã ghi nhận</div>
                </Card>
              </Grid>

              {/* Card 2: Kỳ kinh trung bình */}
              <Grid item>
                <Card className={styles.statCard}>
                  <Box className={styles.statHeader}>
                    <Box className={`${styles.iconWrapper} ${styles.iconPurple}`}>
                      <AccessTime className={styles.icon} />
                    </Box>
                    <span className={styles.statTitle}>Kỳ kinh trung bình</span>
                  </Box>
                  <div className={styles.statValue}>5 ngày</div>
                  <div className={styles.statSubtext}>Độ dài kỳ kinh</div>
                </Card>
              </Grid>

              {/* Card 3: Dự đoán kỳ tới */}
              <Grid item>
                <Card className={styles.statCard}>
                  <Box className={styles.statHeader}>
                    <Box className={`${styles.iconWrapper} ${styles.iconBlue}`}>
                      <Timeline className={styles.icon} />
                    </Box>
                    <span className={styles.statTitle}>Dự đoán kỳ tới</span>
                  </Box>
                  <div className={styles.statValue}>3/6/2024</div>
                  <div className={styles.statSubtext}>Ngày dự kiến</div>
                </Card>
              </Grid>

              {/* Card 4: Tính đều đặn */}
              <Grid item>
                <Card className={styles.statCard}>
                  <Box className={styles.statHeader}>
                    <Box className={`${styles.iconWrapper} ${styles.iconGreen}`}>
                      <CheckCircle className={styles.icon} />
                    </Box>
                    <span className={styles.statTitle}>Tính đều đặn</span>
                  </Box>
                  <div className={styles.statValue}>Đều đặn</div>
                  <div className={styles.statSubtext}>Đánh giá chu kỳ</div>
                </Card>
              </Grid>
            </Grid>

            {/* Chart Section */}
            <Grid container spacing={3}>
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
                    <Box className={styles.legendDot} style={{ backgroundColor: '#E91E63' }} />
                    <Typography className={styles.legendText}>
                      Chu kỳ thực tế
                    </Typography>
                  </Box>
                  <Box className={styles.legendItem}>
                    <Box className={styles.legendDot} style={{ backgroundColor: '#9C27B0' }} />
                    <Typography className={styles.legendText}>
                      Trung bình
                    </Typography>
                  </Box>
                </Box>

                <Box className={styles.chartContainer}>
                  <Line data={chartData} options={chartOptions} className={styles.chartCanvas} />
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
            </Grid>

            {/* Health Advice Section */}
            <Box className={styles.healthAdviceSection}>
              <Card className={styles.healthAdviceCard}>
                <Box className={styles.healthAdviceHeader}>
                  <Box className={styles.healthAdviceIconWrapper}>
                    <FavoriteBorderIcon className={styles.healthAdviceIcon} />
                  </Box>
                  <Box>
                    <Typography variant="h6" className={styles.healthAdviceTitle}>Lời khuyên sức khỏe</Typography>
                    <Typography className={styles.healthAdviceSubtitle}>Dựa trên dữ liệu chu kỳ của bạn</Typography>
                  </Box>
                </Box>

                {/* Card: Chu kỳ đều đặn */}
                <Card className={styles.adviceCardRegular}>
                  <Box className={styles.adviceCardHeader}>
                    <Box className={styles.adviceCardIconRegular}>
                      <FavoriteBorderIcon className={styles.adviceCardIconRegularIcon} />
                    </Box>
                    <Typography variant="subtitle1" className={styles.adviceCardTitleRegular}>Chu kỳ đều đặn</Typography>
                  </Box>
                  <Typography className={styles.adviceCardTextRegular}>Chu kỳ của bạn rất đều đặn! Hãy duy trì lối sống lành mạnh hiện tại.</Typography>
                  <List className={styles.adviceCardList}>
                    <ListItem className={styles.adviceCardListItem}>Tiếp tục duy trì chế độ ăn uống cân bằng</ListItem>
                    <ListItem className={styles.adviceCardListItem}>Tập thể dục đều đặn</ListItem>
                    <ListItem className={styles.adviceCardListItem}>Ngủ đủ 7-8 tiếng mỗi ngày</ListItem>
                  </List>
                </Card>

                {/* Card: Lời khuyên chung */}
                <Card className={styles.adviceCardGeneral}>
                  <Box className={styles.adviceCardHeader}>
                    <Box className={styles.adviceCardIconGeneral}>
                      <FavoriteBorderIcon className={styles.adviceCardIconGeneralIcon} />
                    </Box>
                    <Typography variant="subtitle1" className={styles.adviceCardTitleGeneral}>Lời khuyên chung</Typography>
                  </Box>
                  <Typography className={styles.adviceCardTextGeneral}>Những thói quen tốt để duy trì sức khỏe sinh sản.</Typography>
                  <List className={styles.adviceCardList}>
                    <ListItem className={styles.adviceCardListItem}>Uống đủ 2-3 lít nước mỗi ngày</ListItem>
                    <ListItem className={styles.adviceCardListItem}>Ăn nhiều rau xanh và trái cây</ListItem>
                    <ListItem className={styles.adviceCardListItem}>Tập thể dục nhẹ nhàng trong kỳ kinh</ListItem>
                    <ListItem className={styles.adviceCardListItem}>Theo dõi và ghi chép đều đặn</ListItem>
                  </List>
                </Card>

                {/* Lưu ý */}
                <Box className={styles.healthAdviceNote}>
                  <b>Lưu ý:</b> Những lời khuyên này chỉ mang tính chất tham khảo. Nếu có bất thường hoặc lo lắng, hãy tham khảo ý kiến bác sĩ chuyên khoa.
                </Box>
              </Card>
            </Box>

            {/* Add New Cycle Button */}
            <Box className={styles.addButtonCard}>
              <Button
                variant="contained"
                startIcon={<Add />}
                className={styles.addButton}
              >
                Ghi nhận chu kỳ mới
              </Button>
            </Box>
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
                        <p className={styles.benefitDescription}>{benefit.description}</p>
                        {benefit.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className={styles.benefitDetail}>
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
                  <h3 className={styles.sectionTitle}>Chăm Sóc Bản Thân Theo Từng Giai Đoạn</h3>
                  <div className={`${styles.chevronIcon} ${expandedSection === 'care' ? styles.expanded : ''}`}>
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
                      <div key={index} className={`${styles.carePhaseCard} ${styles[phase.color]}`}>
                        <div className={styles.carePhaseHeader}>
                          <div className={styles.carePhaseIcon}>
                            {phase.icon}
                          </div>
                          <h4 className={styles.carePhaseTitle}>{phase.phase}</h4>
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
                  <h3 className={`${styles.sectionTitle} flex items-center space-x-2`}>
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span>Khi Nào Nên Đi Khám?</span>
                  </h3>
                  <div className={`${styles.chevronIcon} ${expandedSection === 'warning' ? styles.expanded : ''}`}>
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
                        <strong className={styles.warningNoteHighlight}>Lưu ý:</strong> Nếu gặp bất kỳ triệu chứng nào ở trên, 
                        hãy tham khảo ý kiến bác sĩ chuyên khoa để được tư vấn và điều trị kịp thời.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Button chuyển đến trang đăng nhập */}
              <button
                className={styles.loginButton}
                onClick={() => window.location.href = '/login'}
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
