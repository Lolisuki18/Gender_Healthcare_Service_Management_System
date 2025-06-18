import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
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
  FormControlLabel,
  InputAdornment,
  Card,
  CardContent,
  CardActions,
  Divider,
  CircularProgress,
  Chip,
} from "@mui/material";
import stiService from "../services/stiService";
import { useNavigate } from "react-router-dom";
import EventIcon from "@mui/icons-material/Event";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BiotechIcon from "@mui/icons-material/Biotech";
import PaidIcon from "@mui/icons-material/Paid";
import InfoIcon from "@mui/icons-material/Info";
import SearchIcon from "@mui/icons-material/Search";
import useAuthCheck from "@/hooks/useAuthCheck";
import notify from "@/utils/notification";
import { userService } from "@/services/userService";
import {
  testProcedures,
  generalProcedureSteps,
  testDetails,
} from "../dataDemo/demoData";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import vi from "date-fns/locale/vi";
import PersonIcon from "@mui/icons-material/Person";
import PaymentIcon from "@mui/icons-material/Payment";

const packageImages = [
  "https://cdn.diag.vn/2023/09/Goixetnghiem_momau.png",
  "https://cdn.diag.vn/2023/09/Goixetnghiem_tongquat.png",
  "https://cdn.diag.vn/2023/09/Goixetnghiem_daithaoduong.png",
  "https://cdn.diag.vn/2023/09/Goixetnghiem_stds.png",
];

// Using imported stiService module directly

const getIconColor = (status) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "#4CAF50";
    case "pending":
      return "#FFC107";
    case "completed":
      return "#2196F3";
    case "cancelled":
      return "#F44336";
    default:
      return "#9E9E9E";
  }
};

const iconComponents = [BiotechIcon, MedicalServicesIcon];

function getTestComponentCount(service) {
  if (!service || !Array.isArray(service.testComponents)) return 0;
  return service.testComponents.length;
}

export default function STITestPage() {
  const { isLoggedIn } = useAuthCheck();
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [singleTests, setSingleTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  const [currentPackageDetail, setCurrentPackageDetail] = useState(null);
  const [userInfo, setUserInfo] = useState({
    date: "",
    time: "",
    notes: "",
  });
  const [patientInfo, setPatientInfo] = useState({
    fullName: "",
    phone: "",
    email: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [qrPayment, setQrPayment] = useState(null);
  const [selectedPackageInfo, setSelectedPackageInfo] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [previousPackageId, setPreviousPackageId] = useState(null);
  const [registerSingleTest, setRegisterSingleTest] = useState(null);
  const [openSingleDetailDialog, setOpenSingleDetailDialog] = useState(false);
  const [currentSingleTest, setCurrentSingleTest] = useState(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    fade: true,
    cssEase: "linear",
  };

  const [activeTab, setActiveTab] = useState("single");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servicesResponse, packagesResponse] = await Promise.all([
          stiService.getAllSTIServices(),
          stiService.getAllSTIPackages(),
        ]);

        if (servicesResponse.success) {
          setSingleTests(servicesResponse.data);
        }
        if (packagesResponse.success) {
          setPackages(packagesResponse.data);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch data");
        notify.error("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredSingleTests = singleTests.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );
  const filteredPackages = packages.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleOpenDetailDialog = (id, type, pkgId = null) => {
    let detail = null;
    let procedure = [];
    let specificDetails = {};

    if (type === "package") {
      detail = packages.find((pkg) => pkg.id === id || pkg.id === Number(id));
      setPreviousPackageId(null);
      if (detail) {
        specificDetails.testComponents = detail.testComponents;
      }
    } else if (type === "single") {
      detail = singleTests.find(
        (test) => test.id === id || test.id === Number(id)
      );
      setPreviousPackageId(pkgId);
      if (detail) {
        specificDetails = testDetails[detail.name] || {
          biologicalIndicators: [
            {
              name: detail.name,
              normalRange: detail.referenceRange,
              unit: "N/A",
            },
          ],
          testComponents: ["Xét nghiệm máu tĩnh mạch"],
          patientNotes: [
            "Không cần nhịn đói",
            "Có thể uống nước bình thường",
            "Thông báo với nhân viên y tế nếu đang dùng thuốc",
          ],
        };
        procedure = testProcedures[detail.name] || generalProcedureSteps;
      }
    }

    if (!detail) {
      notify.error("Không thể tải chi tiết xét nghiệm.");
      return;
    }

    setCurrentPackageDetail({
      ...detail,
      type: type,
      biologicalIndicators: specificDetails.biologicalIndicators || [],
      testComponents: specificDetails.testComponents || [],
      patientNotes: specificDetails.patientNotes || [],
      procedure: procedure || [],
    });
    setOpenDetailDialog(true);
  };

  const handleRegister = (packageId) => {
    const selectedPkg = packages.find(
      (pkg) => pkg.id === packageId || pkg.id === Number(packageId)
    );
    if (!selectedPkg) {
      notify.error("Không tìm thấy thông tin gói xét nghiệm");
      return;
    }
    setSelectedPackage(packageId);
    setSelectedPackageInfo(selectedPkg);
    setRegisterSingleTest(null);
    setOpenRegisterDialog(true);
  };

  const handleConfirmRegister = async () => {
    try {
      if (!userInfo.date || !userInfo.time) {
        notify.warning("Vui lòng chọn ngày giờ hẹn");
        return;
      }
      const appointmentDate = new Date(userInfo.date);
      const today = new Date();
      if (appointmentDate < today) {
        notify.warning("Ngày hẹn không thể là ngày trong quá khứ");
        return;
      }
      const bookingData = registerSingleTest
        ? {
            type: "single",
            testId: registerSingleTest.id,
            testName: registerSingleTest.name,
            price: registerSingleTest.price,
            appointmentDate: userInfo.date,
            appointmentTime: userInfo.time,
            notes: userInfo.notes || "",
            paymentMethod: paymentMethod,
          }
        : {
            type: "package",
            serviceId: selectedPackage,
            packageName: selectedPackageInfo?.name,
            price: selectedPackageInfo?.price,
            appointmentDate: userInfo.date,
            appointmentTime: userInfo.time,
            notes: userInfo.notes || "",
            paymentMethod: paymentMethod,
          };
      console.log("Demo booking:", bookingData);
      setBookings((prev) => [...prev, bookingData]);
      notify.success("Đặt lịch xét nghiệm thành công (demo)!");
      setOpenRegisterDialog(false);
      resetForm();
    } catch (error) {
      notify.error("Đặt lịch thất bại. Vui lòng thử lại");
    }
  };

  const resetForm = () => {
    setUserInfo({
      date: "",
      time: "",
      notes: "",
    });
    setPaymentMethod("COD");
    setQrPayment(null);
    setSelectedPackage("");
    setSelectedPackageInfo(null);
    setRegisterSingleTest(null);
  };

  const handleRetry = async () => {
    try {
      const response = await stiService.getAllSTIServices();
      const pkgData = response.data;
      const pkgsWithIcon = pkgData.map((pkg, index) => {
        const IconComponent =
          iconComponents[index] || iconComponents[iconComponents.length - 1];
        return {
          ...pkg,
          id: String(pkg.serviceId),
          icon: (
            <IconComponent
              fontSize="large"
              sx={{
                color: getIconColor(index),
                transition: "all 0.3s",
              }}
            />
          ),
        };
      });
      setPackages(pkgsWithIcon);
    } catch (error) {
      notify.error("Lấy danh sách gói xét nghiệm thất bại. Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    if (!openRegisterDialog || !isLoggedIn) return;
    async function fetchUser() {
      try {
        const userResponse = await userService.getCurrentUser();
        if (userResponse && userResponse.success) {
          setPatientInfo({
            fullName: userResponse.data.fullName || "",
            phone: userResponse.data.phone || "",
            email: userResponse.data.email || "",
          });
        } else {
          setPatientInfo({ fullName: "", phone: "", email: "" });
        }
      } catch {
        setPatientInfo({ fullName: "", phone: "", email: "" });
      }
    }
    fetchUser();
  }, [openRegisterDialog, isLoggedIn]);

  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  const cardStyle = {
    borderRadius: 4,
    boxShadow: "0 4px 24px rgba(33,150,243,0.10)",
    bgcolor: "#fff",
    mb: 2,
    display: "flex",
    flexDirection: "column",
    height: 260,
    width: 370,
    justifyContent: "space-between",
    overflow: "hidden",
    transition: "box-shadow 0.2s, transform 0.2s",
    "&:hover": {
      boxShadow: "0 8px 32px rgba(33,150,243,0.18)",
      transform: "translateY(-4px) scale(1.02)",
    },
  };

  const buttonStyle = {
    borderRadius: 3,
    px: 2.5,
    py: 1,
    fontWeight: 700,
    fontSize: "0.9rem",
    textTransform: "uppercase",
    boxShadow: "0 2px 8px rgba(33,150,243,0.10)",
  };

  const headerStyle = {
    mt: 4,
    mb: 3,
    color: "#0D47A1",
    letterSpacing: 0.5,
    textAlign: "center",
    borderBottom: "2px solid #E3F2FD",
    pb: 1,
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3f0fc 0%, #f8fbff 100%)",
        py: 6,
        position: "relative",
      }}
    >
      <Container maxWidth={false} disableGutters>
        <Box sx={{ maxWidth: 1100, mx: "auto", pt: 4, pb: 4 }}>
          {/* Banner slider */}
          <Box sx={{ mb: 4 }}>
            <Slider
              dots={true}
              infinite={true}
              speed={500}
              slidesToShow={1}
              slidesToScroll={1}
              autoplay={true}
              autoplaySpeed={3000}
              pauseOnHover={true}
              arrows={false}
              cssEase="linear"
            >
              {packageImages.map((img, idx) => (
                <Box key={idx}>
                  <Box
                    component="img"
                    src={img}
                    alt={`Banner ${idx + 1}`}
                    sx={{
                      width: "100%",
                      height: 180,
                      objectFit: "cover",
                      borderRadius: 4,
                      boxShadow: "0 4px 16px rgba(33,150,243,0.10)",
                    }}
                  />
                </Box>
              ))}
            </Slider>
          </Box>
          {/* Tiêu đề lớn cho trang */}
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            textAlign="center"
            sx={{
              background: "linear-gradient(45deg, #1976D2, #00BFA5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 4,
              fontSize: { xs: "2rem", md: "2.5rem" },
              letterSpacing: 1,
              textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            Đăng ký xét nghiệm
          </Typography>
          {/* Thanh tìm kiếm và tab chuyển đổi */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 3,
              maxWidth: 600,
              mx: "auto",
            }}
          >
            <TextField
              variant="outlined"
              placeholder="Tìm"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#757575" }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 3,
                  bgcolor: "white",
                  minWidth: 400,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                },
              }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button
              variant="contained"
              sx={{
                ml: 2,
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontWeight: 700,
                fontSize: "1.1rem",
                background: "linear-gradient(45deg, #2196F3, #00BFA5)",
                textTransform: "uppercase",
                boxShadow: "0 2px 8px rgba(33,150,243,0.10)",
                "&:hover": {
                  background: "linear-gradient(45deg, #1976D2, #00897B)",
                  boxShadow: "0 4px 12px rgba(33,150,243,0.20)",
                },
              }}
              onClick={() => {}}
            >
              Tìm
            </Button>
          </Box>
          {/* Tab chuyển đổi giữa Xét nghiệm lẻ và Gói xét nghiệm */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                fontWeight: 600,
                fontSize: "1.25rem",
                color: activeTab === "single" ? "#1565C0" : "#757575",
                borderBottom:
                  activeTab === "single" ? "3px solid #2979FF" : "none",
                cursor: "pointer",
                mr: 3,
                pb: 0.5,
                letterSpacing: 0.5,
                transition: "color 0.3s, border-bottom 0.3s",
              }}
              onClick={() => setActiveTab("single")}
            >
              Xét nghiệm lẻ
            </Box>
            <Box
              sx={{
                fontWeight: 600,
                fontSize: "1.25rem",
                color: activeTab === "package" ? "#1565C0" : "#757575",
                borderBottom:
                  activeTab === "package" ? "3px solid #2979FF" : "none",
                cursor: "pointer",
                pb: 0.5,
                letterSpacing: 0.5,
                transition: "color 0.3s, border-bottom 0.3s",
              }}
              onClick={() => setActiveTab("package")}
            >
              Gói xét nghiệm
            </Box>
          </Box>
          {/* Hiển thị danh sách theo tab */}
          {searchText &&
            (filteredSingleTests.length > 0 || filteredPackages.length > 0) && (
              <Typography
                variant="h6"
                sx={{ textAlign: "center", mb: 3, color: "#424242" }}
              >
                Hiển thị {filteredSingleTests.length + filteredPackages.length}{" "}
                kết quả cho "{searchText}"
              </Typography>
            )}

          {searchText &&
          filteredSingleTests.length === 0 &&
          filteredPackages.length === 0 ? (
            <Typography
              variant="h6"
              sx={{ textAlign: "center", mt: 4, color: "#D32F2F" }}
            >
              Không tìm thấy kết quả nào cho "{searchText}"
            </Typography>
          ) : (
            <>
              {searchText ? (
                <>
                  {/* Xét nghiệm lẻ */}
                  <Typography variant="h5" fontWeight="bold" sx={headerStyle}>
                    Xét nghiệm lẻ
                  </Typography>
                  {filteredSingleTests.length > 0 ? (
                    <Grid
                      container
                      spacing={3}
                      sx={{ mb: 4, justifyContent: "center" }}
                    >
                      {filteredSingleTests.map((test) => (
                        <Grid
                          item
                          key={test.id}
                          xs={12}
                          sm={6}
                          md={4}
                          display="flex"
                        >
                          <Card sx={cardStyle}>
                            <CardContent
                              sx={{
                                flexGrow: 1,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                              }}
                            >
                              <Box>
                                <Typography
                                  variant="h6"
                                  component="div"
                                  fontWeight="bold"
                                  gutterBottom
                                  sx={{ color: "#1565C0" }}
                                >
                                  {test.name}
                                </Typography>
                                <Typography
                                  variant="body1"
                                  color="text.secondary"
                                  sx={{
                                    mb: 2,
                                    color: "#00897B",
                                    fontWeight: 700,
                                  }}
                                >
                                  {(test.price || 0).toLocaleString("vi-VN")} đ
                                </Typography>
                              </Box>
                              <Typography
                                variant="body2"
                                sx={{ color: "#546E7A", fontStyle: "italic" }}
                              >
                                {test.description}
                              </Typography>
                            </CardContent>
                            <CardActions
                              sx={{
                                justifyContent: "space-around",
                                p: 2,
                                borderTop: "1px solid #E0E0E0",
                              }}
                            >
                              <Button
                                variant="outlined"
                                sx={{
                                  ...buttonStyle,
                                  color: "#1976D2",
                                  borderColor: "#1976D2",
                                  "&:hover": {
                                    borderColor: "#1565C0",
                                    bgcolor: "#E3F2FD",
                                  },
                                }}
                                onClick={() => {
                                  setCurrentSingleTest(test);
                                  setOpenSingleDetailDialog(true);
                                }}
                              >
                                Chi tiết
                              </Button>
                              <Button
                                variant="contained"
                                sx={{
                                  ...buttonStyle,
                                  background:
                                    "linear-gradient(45deg, #1976D2 30%, #00BFA5 90%)",
                                  "&:hover": {
                                    background:
                                      "linear-gradient(45deg, #1565C0 30%, #00897B 90%)",
                                  },
                                }}
                                onClick={() => {
                                  setRegisterSingleTest(test);
                                  setOpenRegisterDialog(true);
                                }}
                              >
                                Đặt lịch hẹn
                              </Button>
                            </CardActions>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography
                      variant="body1"
                      sx={{
                        textAlign: "center",
                        mt: 2,
                        mb: 4,
                        color: "#D32F2F",
                      }}
                    >
                      Không tìm thấy kết quả nào trong mục "Xét nghiệm lẻ".
                    </Typography>
                  )}

                  {/* Gói xét nghiệm */}
                  <Typography variant="h5" fontWeight="bold" sx={headerStyle}>
                    Gói xét nghiệm
                  </Typography>
                  {filteredPackages.length > 0 ? (
                    <Grid container spacing={4} justifyContent="center">
                      {filteredPackages.map((pkg) => (
                        <Grid
                          item
                          key={pkg.id}
                          xs={12}
                          sm={6}
                          md={4}
                          display="flex"
                        >
                          <Card sx={cardStyle}>
                            <CardContent
                              sx={{
                                flexGrow: 1,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                              }}
                            >
                              <Box>
                                <Typography
                                  variant="h6"
                                  component="div"
                                  fontWeight="bold"
                                  gutterBottom
                                  sx={{ color: "#1565C0" }}
                                >
                                  {pkg.name}
                                </Typography>
                                <Typography
                                  variant="body1"
                                  color="text.secondary"
                                  sx={{
                                    mb: 2,
                                    color: "#00897B",
                                    fontWeight: 700,
                                  }}
                                >
                                  {(pkg.price || 0).toLocaleString("vi-VN")} đ
                                </Typography>
                              </Box>
                              <Typography
                                variant="body2"
                                sx={{ color: "#546E7A", fontStyle: "italic" }}
                              >
                                {pkg.description}
                              </Typography>
                            </CardContent>
                            <CardActions
                              sx={{
                                justifyContent: "space-around",
                                p: 2,
                                borderTop: "1px solid #E0E0E0",
                              }}
                            >
                              <Button
                                variant="outlined"
                                sx={{
                                  ...buttonStyle,
                                  color: "#1976D2",
                                  borderColor: "#1976D2",
                                  "&:hover": {
                                    borderColor: "#1565C0",
                                    bgcolor: "#E3F2FD",
                                  },
                                }}
                                onClick={() =>
                                  handleOpenDetailDialog(pkg.id, "package")
                                }
                              >
                                Chi tiết
                              </Button>
                              <Button
                                variant="contained"
                                sx={{
                                  ...buttonStyle,
                                  background:
                                    "linear-gradient(45deg, #1976D2 30%, #00BFA5 90%)",
                                  "&:hover": {
                                    background:
                                      "linear-gradient(45deg, #1565C0 30%, #00897B 90%)",
                                  },
                                }}
                                onClick={() => handleRegister(pkg.id)}
                              >
                                Đặt lịch hẹn
                              </Button>
                            </CardActions>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography
                      variant="body1"
                      sx={{
                        textAlign: "center",
                        mt: 2,
                        mb: 4,
                        color: "#D32F2F",
                      }}
                    >
                      Không tìm thấy kết quả nào trong mục "Gói xét nghiệm".
                    </Typography>
                  )}
                </>
              ) : (
                <>
                  {activeTab === "single" && (
                    <>
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        sx={headerStyle}
                      >
                        Xét nghiệm lẻ
                      </Typography>
                      {singleTests.length > 0 ? (
                        <Grid
                          container
                          spacing={3}
                          sx={{ mb: 4, justifyContent: "center" }}
                        >
                          {singleTests.map((test) => (
                            <Grid
                              item
                              key={test.id}
                              xs={12}
                              sm={6}
                              md={4}
                              display="flex"
                            >
                              <Card sx={cardStyle}>
                                <CardContent
                                  sx={{
                                    flexGrow: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Box>
                                    <Typography
                                      variant="h6"
                                      component="div"
                                      fontWeight="bold"
                                      gutterBottom
                                      sx={{ color: "#1565C0" }}
                                    >
                                      {test.name}
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      color="text.secondary"
                                      sx={{
                                        mb: 2,
                                        color: "#00897B",
                                        fontWeight: 700,
                                      }}
                                    >
                                      {(test.price || 0).toLocaleString(
                                        "vi-VN"
                                      )}{" "}
                                      đ
                                    </Typography>
                                  </Box>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: "#546E7A",
                                      fontStyle: "italic",
                                    }}
                                  >
                                    {test.description}
                                  </Typography>
                                </CardContent>
                                <CardActions
                                  sx={{
                                    justifyContent: "space-around",
                                    p: 2,
                                    borderTop: "1px solid #E0E0E0",
                                  }}
                                >
                                  <Button
                                    variant="outlined"
                                    sx={{
                                      ...buttonStyle,
                                      color: "#1976D2",
                                      borderColor: "#1976D2",
                                      "&:hover": {
                                        borderColor: "#1565C0",
                                        bgcolor: "#E3F2FD",
                                      },
                                    }}
                                    onClick={() => {
                                      setCurrentSingleTest(test);
                                      setOpenSingleDetailDialog(true);
                                    }}
                                  >
                                    Chi tiết
                                  </Button>
                                  <Button
                                    variant="contained"
                                    sx={{
                                      ...buttonStyle,
                                      background:
                                        "linear-gradient(45deg, #1976D2 30%, #00BFA5 90%)",
                                      "&:hover": {
                                        background:
                                          "linear-gradient(45deg, #1565C0 30%, #00897B 90%)",
                                      },
                                    }}
                                    onClick={() => {
                                      setRegisterSingleTest(test);
                                      setOpenRegisterDialog(true);
                                    }}
                                  >
                                    Đặt lịch hẹn
                                  </Button>
                                </CardActions>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      ) : (
                        <Typography
                          variant="body1"
                          sx={{
                            textAlign: "center",
                            mt: 2,
                            mb: 4,
                            color: "#D32F2F",
                          }}
                        >
                          Không có xét nghiệm lẻ nào để hiển thị.
                        </Typography>
                      )}
                    </>
                  )}
                  {activeTab === "package" && (
                    <>
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        sx={headerStyle}
                      >
                        Gói xét nghiệm
                      </Typography>
                      {packages.length > 0 ? (
                        <Grid container spacing={4} justifyContent="center">
                          {packages.map((pkg) => (
                            <Grid
                              item
                              key={pkg.id}
                              xs={12}
                              sm={6}
                              md={4}
                              display="flex"
                            >
                              <Card sx={cardStyle}>
                                <CardContent
                                  sx={{
                                    flexGrow: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Box>
                                    <Typography
                                      variant="h6"
                                      component="div"
                                      fontWeight="bold"
                                      gutterBottom
                                      sx={{ color: "#1565C0" }}
                                    >
                                      {pkg.name}
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      color="text.secondary"
                                      sx={{
                                        mb: 2,
                                        color: "#00897B",
                                        fontWeight: 700,
                                      }}
                                    >
                                      {(pkg.price || 0).toLocaleString("vi-VN")}{" "}
                                      đ
                                    </Typography>
                                  </Box>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: "#546E7A",
                                      fontStyle: "italic",
                                    }}
                                  >
                                    {pkg.description}
                                  </Typography>
                                </CardContent>
                                <CardActions
                                  sx={{
                                    justifyContent: "space-around",
                                    p: 2,
                                    borderTop: "1px solid #E0E0E0",
                                  }}
                                >
                                  <Button
                                    variant="outlined"
                                    sx={{
                                      ...buttonStyle,
                                      color: "#1976D2",
                                      borderColor: "#1976D2",
                                      "&:hover": {
                                        borderColor: "#1565C0",
                                        bgcolor: "#E3F2FD",
                                      },
                                    }}
                                    onClick={() =>
                                      handleOpenDetailDialog(pkg.id, "package")
                                    }
                                  >
                                    Chi tiết
                                  </Button>
                                  <Button
                                    variant="contained"
                                    sx={{
                                      ...buttonStyle,
                                      background:
                                        "linear-gradient(45deg, #1976D2 30%, #00BFA5 90%)",
                                      "&:hover": {
                                        background:
                                          "linear-gradient(45deg, #1565C0 30%, #00897B 90%)",
                                      },
                                    }}
                                    onClick={() => handleRegister(pkg.id)}
                                  >
                                    Đặt lịch hẹn
                                  </Button>
                                </CardActions>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      ) : (
                        <Typography
                          variant="body1"
                          sx={{
                            textAlign: "center",
                            mt: 2,
                            mb: 4,
                            color: "#D32F2F",
                          }}
                        >
                          Không có gói xét nghiệm nào để hiển thị.
                        </Typography>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
          {/* Hiển thị danh sách booking demo */}
          {bookings.length > 0 && (
            <Box sx={{ mt: 6, mb: 4 }}>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{
                  mb: 2,
                  color: "#1565C0",
                  textAlign: "center",
                  letterSpacing: 0.5,
                }}
              >
                Lịch hẹn đã đặt (demo)
              </Typography>
              <Grid container spacing={3} justifyContent="center">
                {bookings.map((b, idx) => (
                  <Grid item key={idx}>
                    <Box
                      sx={{
                        p: 4,
                        borderRadius: 4,
                        boxShadow: "0 4px 24px rgba(33,150,243,0.10)",
                        bgcolor: "#fff",
                        minWidth: 320,
                        maxWidth: 400,
                        mb: 2,
                      }}
                    >
                      <Typography
                        fontWeight="bold"
                        sx={{
                          color: "#1976D2",
                          mb: 1,
                          fontSize: "1.1rem",
                          letterSpacing: 0.5,
                        }}
                      >
                        {b.type === "single" ? b.testName : b.packageName}
                      </Typography>
                      <Typography sx={{ mb: 0.5 }}>
                        Ngày hẹn: <b>{b.appointmentDate}</b>
                      </Typography>
                      <Typography sx={{ mb: 0.5 }}>
                        Giờ hẹn: <b>{b.appointmentTime}</b>
                      </Typography>
                      <Typography sx={{ mb: 0.5 }}>
                        Giá: <b>{(b.price || 0).toLocaleString("vi-VN")} đ</b>
                      </Typography>
                      <Typography sx={{ mb: 0.5 }}>
                        Phương thức thanh toán: <b>{b.paymentMethod}</b>
                      </Typography>
                      {b.notes && (
                        <Typography
                          sx={{ mt: 1, fontStyle: "italic", color: "#757575" }}
                        >
                          Ghi chú: {b.notes}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      </Container>
      {/* Dialog chi tiết xét nghiệm lẻ */}
      <Dialog
        open={openSingleDetailDialog}
        onClose={() => setOpenSingleDetailDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: { xs: "1.3rem", md: "1.7rem" },
            background: "linear-gradient(45deg, #1976D2, #00BFA5)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: 1,
            py: 3,
          }}
        >
          {currentSingleTest?.name || "Chi tiết xét nghiệm"}
        </DialogTitle>
        <DialogContent
          sx={{
            bgcolor: "#fff",
            p: { xs: 2, md: 4 },
            "&.MuiDialogContent-root": {
              pt: 3,
            },
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{ color: "#1976D2", fontWeight: 600, mb: 2 }}
            >
              Thông tin cơ bản
            </Typography>
            <Box
              sx={{
                p: 3,
                bgcolor: "#F5F9FF",
                borderRadius: 3,
                border: "1px solid #E3F2FD",
              }}
            >
              <Typography sx={{ mb: 2, color: "#37474F", fontSize: "1rem" }}>
                {currentSingleTest?.description}
              </Typography>
              <Typography
                sx={{
                  color: "#00BFA5",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <PaidIcon /> Giá:{" "}
                {currentSingleTest?.price?.toLocaleString("vi-VN")} đ
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{ color: "#1976D2", fontWeight: 600, mb: 2 }}
            >
              Giá trị tham chiếu
            </Typography>
            {currentSingleTest?.components &&
            currentSingleTest.components.length > 0 ? (
              <TableContainer
                sx={{
                  borderRadius: 3,
                  bgcolor: "#F5F9FF",
                  border: "1px solid #E3F2FD",
                }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, color: "#1976D2" }}>
                        Thành phần
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#1976D2" }}>
                        Giá trị bình thường
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#1976D2" }}>
                        Đơn vị
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#1976D2" }}>
                        Mô tả
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentSingleTest.components.map((comp, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{comp.componentName}</TableCell>
                        <TableCell>
                          {comp.normalRange && comp.normalRange !== "null"
                            ? comp.normalRange
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {comp.unit && comp.unit !== "null" ? comp.unit : "-"}
                        </TableCell>
                        <TableCell>{comp.description || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box
                sx={{
                  p: 3,
                  bgcolor: "#F5F9FF",
                  borderRadius: 3,
                  border: "1px solid #E3F2FD",
                }}
              >
                <Typography
                  component="pre"
                  sx={{
                    whiteSpace: "pre-wrap",
                    fontSize: "0.95rem",
                    color: "#37474F",
                    m: 0,
                  }}
                >
                  {currentSingleTest?.referenceRange || "Không có thông tin."}
                </Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{ color: "#1976D2", fontWeight: 600, mb: 2 }}
            >
              Quy trình xét nghiệm
            </Typography>
            <Box
              sx={{
                p: 3,
                bgcolor: "#F5F9FF",
                borderRadius: 3,
                border: "1px solid #E3F2FD",
              }}
            >
              {generalProcedureSteps.map((step, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    mb: 2,
                    "&:last-child": { mb: 0 },
                  }}
                >
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      bgcolor: "#1976D2",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      mr: 2,
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Box>
                    <Typography
                      fontWeight="bold"
                      sx={{ color: "#37474F", fontSize: "1.1rem" }}
                    >
                      {step.title}
                    </Typography>
                    <Typography sx={{ color: "#546E7A", fontSize: "0.9rem" }}>
                      {step.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          <DialogActions
            sx={{
              justifyContent: previousPackageId ? "space-between" : "center",
              p: 2,
              mt: 2,
            }}
          >
            <Button
              onClick={() =>
                previousPackageId
                  ? handleOpenDetailDialog(previousPackageId, "package")
                  : setOpenSingleDetailDialog(false)
              }
              variant="outlined"
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: "none",
                borderColor: "#1976D2",
                color: "#1976D2",
                "&:hover": {
                  borderColor: "#1565C0",
                  bgcolor: "#E3F2FD",
                },
              }}
            >
              {previousPackageId ? "Quay lại" : "Đóng"}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      {/* Dialog chi tiết gói xét nghiệm */}
      <Dialog
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: { xs: "1.3rem", md: "1.7rem" },
            background: "linear-gradient(45deg, #1976D2, #00BFA5)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: 1,
            py: 3,
          }}
        >
          {currentPackageDetail?.name || "Chi tiết gói xét nghiệm"}
        </DialogTitle>
        <DialogContent
          sx={{
            bgcolor: "#fff",
            p: { xs: 2, md: 4 },
            "&.MuiDialogContent-root": {
              pt: 3,
            },
          }}
        >
          {currentPackageDetail &&
            (currentPackageDetail.type === "package" ? (
              <Box>
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{ color: "#1976D2", fontWeight: 600, mb: 2 }}
                  >
                    Thông tin cơ bản
                  </Typography>
                  <Box
                    sx={{
                      p: 3,
                      bgcolor: "#F5F9FF",
                      borderRadius: 3,
                      border: "1px solid #E3F2FD",
                    }}
                  >
                    <Typography
                      sx={{ mb: 2, color: "#37474F", fontSize: "1rem" }}
                    >
                      {currentPackageDetail?.description}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#00BFA5",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <PaidIcon /> Giá:{" "}
                      {currentPackageDetail?.price?.toLocaleString("vi-VN")} đ
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{ color: "#1976D2", fontWeight: 600, mb: 2 }}
                  >
                    Danh sách xét nghiệm
                  </Typography>
                  <TableContainer
                    sx={{
                      borderRadius: 3,
                      boxShadow: "0 2px 12px rgba(33,150,243,0.08)",
                      border: "1px solid #E3F2FD",
                    }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#F5F9FF" }}>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              color: "#1976D2",
                              fontSize: "1rem",
                            }}
                          >
                            Tên xét nghiệm
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              color: "#1976D2",
                              fontSize: "1rem",
                            }}
                          >
                            Giá
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              color: "#1976D2",
                              fontSize: "1rem",
                            }}
                          >
                            Chi tiết
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(currentPackageDetail?.testComponents || []).map(
                          (test, idx) => {
                            const detail = singleTests.find(
                              (t) => t.name === test.testName
                            );
                            return (
                              <TableRow
                                key={idx}
                                sx={{
                                  "&:nth-of-type(odd)": { bgcolor: "#F5F9FF" },
                                }}
                              >
                                <TableCell sx={{ fontWeight: 600 }}>
                                  {detail?.name || test.testName}
                                </TableCell>
                                <TableCell
                                  sx={{ color: "#00BFA5", fontWeight: 700 }}
                                >
                                  {detail?.price?.toLocaleString("vi-VN") ||
                                    test.price?.toLocaleString("vi-VN") ||
                                    ""}{" "}
                                  đ
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() =>
                                      handleOpenDetailDialog(
                                        detail?.id || test.id,
                                        "single",
                                        currentPackageDetail.id
                                      )
                                    }
                                    sx={{
                                      textTransform: "none",
                                      fontSize: "0.8rem",
                                      py: 0.5,
                                      px: 1.5,
                                      borderRadius: 2,
                                      borderColor: "#1976D2",
                                      color: "#1976D2",
                                      "&:hover": {
                                        borderColor: "#1565C0",
                                        bgcolor: "#E3F2FD",
                                      },
                                    }}
                                  >
                                    Xem chi tiết
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          }
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{ color: "#1976D2", fontWeight: 600, mb: 2 }}
                  >
                    Quy trình xét nghiệm
                  </Typography>
                  <Box
                    sx={{
                      p: 3,
                      bgcolor: "#F5F9FF",
                      borderRadius: 3,
                      border: "1px solid #E3F2FD",
                    }}
                  >
                    {generalProcedureSteps.map((step, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          mb: 2,
                          "&:last-child": { mb: 0 },
                        }}
                      >
                        <Box
                          sx={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            bgcolor: "#1976D2",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            mr: 2,
                            flexShrink: 0,
                          }}
                        >
                          {index + 1}
                        </Box>
                        <Box>
                          <Typography
                            fontWeight="bold"
                            sx={{ color: "#37474F", fontSize: "1.1rem" }}
                          >
                            {step.title}
                          </Typography>
                          <Typography
                            sx={{ color: "#546E7A", fontSize: "0.9rem" }}
                          >
                            {step.description}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>

                <DialogActions
                  sx={{
                    justifyContent: "center",
                    p: 2,
                    mt: 2,
                  }}
                >
                  <Button
                    onClick={() => setOpenDetailDialog(false)}
                    variant="outlined"
                    sx={{
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: "none",
                      borderColor: "#1976D2",
                      color: "#1976D2",
                      "&:hover": {
                        borderColor: "#1565C0",
                        bgcolor: "#E3F2FD",
                      },
                    }}
                  >
                    Đóng
                  </Button>
                </DialogActions>
              </Box>
            ) : (
              <Box sx={{ p: 2 }}>
                {/* Test Name and Description */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}
                  >
                    {currentPackageDetail?.name}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "text.secondary", mb: 2 }}
                  >
                    {currentPackageDetail?.description}
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "primary.light",
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <PaidIcon sx={{ color: "primary.main" }} />
                    <Typography
                      variant="h6"
                      sx={{ color: "primary.main", fontWeight: "bold" }}
                    >
                      Giá:{" "}
                      {currentPackageDetail?.price?.toLocaleString("vi-VN")} VNĐ
                    </Typography>
                  </Box>
                </Box>

                {/* Reference Range Section */}
                {currentPackageDetail?.referenceRange && (
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}
                    >
                      Giá trị tham chiếu:
                    </Typography>
                    <Typography
                      component="pre"
                      sx={{
                        whiteSpace: "pre-wrap",
                        fontSize: "1rem",
                        color: "text.secondary",
                      }}
                    >
                      {currentPackageDetail?.referenceRange}
                    </Typography>
                  </Box>
                )}

                {/* Biological Indicators Section */}
                {currentPackageDetail?.biologicalIndicators &&
                  currentPackageDetail.biologicalIndicators.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "bold",
                          mb: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <BiotechIcon color="primary" />
                        Chỉ số sinh học
                      </Typography>
                      <TableContainer
                        sx={{
                          borderRadius: 2,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      >
                        <Table size="small">
                          <TableHead>
                            <TableRow sx={{ bgcolor: "primary.light" }}>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                Chỉ số
                              </TableCell>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                Giá trị bình thường
                              </TableCell>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                Đơn vị
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {currentPackageDetail.biologicalIndicators.map(
                              (indicator, index) => (
                                <TableRow
                                  key={index}
                                  sx={{
                                    "&:nth-of-type(odd)": {
                                      bgcolor: "action.hover",
                                    },
                                  }}
                                >
                                  <TableCell>{indicator.name}</TableCell>
                                  <TableCell>{indicator.normalRange}</TableCell>
                                  <TableCell>{indicator.unit}</TableCell>
                                </TableRow>
                              )
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  )}

                {/* Test Components Section (if applicable, for single tests this might be less relevant) */}
                {currentPackageDetail?.testComponents &&
                  currentPackageDetail.testComponents.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "bold",
                          mb: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <MedicalServicesIcon color="primary" />
                        Xét nghiệm bao gồm
                      </Typography>
                      <Box
                        sx={{
                          p: 2,
                          bgcolor: "background.paper",
                          borderRadius: 2,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      >
                        {currentPackageDetail.testComponents.map(
                          (component, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 1,
                                "&:last-child": { mb: 0 },
                              }}
                            >
                              <CheckCircleIcon
                                sx={{
                                  color: "success.main",
                                  mr: 1,
                                  fontSize: "1.2rem",
                                }}
                              />
                              <Typography>{component}</Typography>
                            </Box>
                          )
                        )}
                      </Box>
                    </Box>
                  )}

                {/* Patient Notes Section */}
                {currentPackageDetail?.patientNotes &&
                  currentPackageDetail.patientNotes.length > 0 && (
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "bold",
                          mb: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <InfoIcon color="primary" />
                        Lưu ý cho bệnh nhân
                      </Typography>
                      <Box
                        sx={{
                          p: 2,
                          bgcolor: "background.paper",
                          borderRadius: 2,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      >
                        {currentPackageDetail.patientNotes.map(
                          (note, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                mb: 1.5,
                                "&:last-child": { mb: 0 },
                              }}
                            >
                              <Typography
                                sx={{
                                  color: "warning.main",
                                  mr: 1,
                                  fontSize: "1.2rem",
                                  lineHeight: 1.2,
                                }}
                              >
                                •
                              </Typography>
                              <Typography sx={{ color: "text.secondary" }}>
                                {note}
                              </Typography>
                            </Box>
                          )
                        )}
                      </Box>
                    </Box>
                  )}

                {/* Test Procedure Section for single tests (will also use generalProcedureSteps for consistency) */}
                <Box sx={{ mt: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <EventIcon color="primary" />
                    Quy trình xét nghiệm
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "background.paper",
                      borderRadius: 2,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    {generalProcedureSteps.map((step, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          mb: 1.5,
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            bgcolor: "primary.main",
                            color: "white",
                            borderRadius: "50%",
                            width: 24,
                            height: 24,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mr: 1,
                            flexShrink: 0,
                            fontSize: "0.8rem",
                            fontWeight: "bold",
                          }}
                        >
                          {index + 1}
                        </Typography>
                        <Box>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "bold" }}
                          >
                            {step.title}
                          </Typography>
                          <Typography sx={{ color: "text.secondary" }}>
                            {step.description}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>

                {/* DialogActions for single test detail view when coming from a package */}
                <DialogActions
                  sx={{
                    justifyContent: previousPackageId
                      ? "space-between"
                      : "center",
                    p: 2,
                  }}
                >
                  <Button
                    onClick={() =>
                      previousPackageId
                        ? handleOpenDetailDialog(previousPackageId, "package")
                        : setOpenDetailDialog(false)
                    }
                    variant="outlined"
                    sx={{
                      borderRadius: 3,
                      px: 4,
                      fontWeight: 600,
                      textTransform: "none",
                    }}
                  >
                    {previousPackageId ? "Quay lại" : "Đóng"}
                  </Button>
                </DialogActions>
              </Box>
            ))}
        </DialogContent>
      </Dialog>
      {/* Dialog đặt lịch cho xét nghiệm lẻ hoặc gói */}
      <Dialog
        open={openRegisterDialog}
        onClose={() => setOpenRegisterDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: { xs: "1.5rem", md: "2rem" },
            background: "linear-gradient(45deg, #1976D2, #00BFA5)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: 1,
            py: 3,
          }}
        >
          <Box>
            {registerSingleTest ? (
              <>
                Đặt lịch xét nghiệm:
                <Box
                  component="span"
                  display="block"
                  sx={{ fontSize: "1.2rem", mt: 1 }}
                >
                  {registerSingleTest.name}
                </Box>
              </>
            ) : selectedPackageInfo ? (
              <>
                Đặt lịch gói xét nghiệm:
                <Box
                  component="span"
                  display="block"
                  sx={{ fontSize: "1.2rem", mt: 1 }}
                >
                  {selectedPackageInfo.name}
                </Box>
              </>
            ) : (
              "Đặt lịch xét nghiệm"
            )}
          </Box>
        </DialogTitle>
        <DialogContent
          sx={{
            bgcolor: "#fff",
            p: { xs: 2, md: 4 },
            "&.MuiDialogContent-root": {
              pt: 3,
            },
          }}
        >
          <Box
            sx={{
              mb: 4,
              textAlign: "center",
              p: 3,
              bgcolor: "#F5F9FF",
              borderRadius: 3,
              border: "1px solid #E3F2FD",
            }}
          >
            <Typography variant="h6" fontWeight="bold" color="primary">
              {registerSingleTest?.name || selectedPackageInfo?.name}
            </Typography>
            <Typography
              sx={{
                mt: 1,
                fontSize: "1.1rem",
                fontWeight: 600,
                color: "#00BFA5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
            >
              <PaidIcon /> Giá:{" "}
              {(
                registerSingleTest?.price || selectedPackageInfo?.price
              )?.toLocaleString("vi-VN")}{" "}
              đ
            </Typography>
            {selectedPackageInfo && (
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "#1976D2", fontWeight: 600, mb: 1 }}
                >
                  Danh sách xét nghiệm trong gói:
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    justifyContent: "center",
                    mt: 1,
                  }}
                >
                  {selectedPackageInfo.testComponents?.map((test, index) => (
                    <Chip
                      key={index}
                      label={test.name}
                      sx={{
                        bgcolor: "#E3F2FD",
                        color: "#1976D2",
                        fontWeight: 500,
                        "&:hover": {
                          bgcolor: "#BBDEFB",
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>

          <Grid container spacing={3}>
            {/* Thông tin cá nhân */}
            <Grid item xs={12}>
              <Box
                sx={{
                  p: 3,
                  bgcolor: "#F5F9FF",
                  borderRadius: 3,
                  border: "1px solid #E3F2FD",
                  mb: 3,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "#1976D2",
                    fontWeight: 600,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <PersonIcon /> Thông tin cá nhân
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Họ và tên"
                      fullWidth
                      value={patientInfo.fullName}
                      InputProps={{
                        readOnly: !!patientInfo.fullName,
                        sx: {
                          borderRadius: 2,
                          bgcolor: "#fff",
                        },
                      }}
                      onChange={(e) =>
                        setPatientInfo({
                          ...patientInfo,
                          fullName: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Số điện thoại"
                      fullWidth
                      value={patientInfo.phone}
                      InputProps={{
                        readOnly: !!patientInfo.phone,
                        sx: {
                          borderRadius: 2,
                          bgcolor: "#fff",
                        },
                      }}
                      onChange={(e) =>
                        setPatientInfo({
                          ...patientInfo,
                          phone: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Email"
                      fullWidth
                      value={patientInfo.email}
                      InputProps={{
                        readOnly: !!patientInfo.email,
                        sx: {
                          borderRadius: 2,
                          bgcolor: "#fff",
                        },
                      }}
                      onChange={(e) =>
                        setPatientInfo({
                          ...patientInfo,
                          email: e.target.value,
                        })
                      }
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Thời gian xét nghiệm */}
            <Grid item xs={12}>
              <Box
                sx={{
                  p: 3,
                  bgcolor: "#F5F9FF",
                  borderRadius: 3,
                  border: "1px solid #E3F2FD",
                  mb: 3,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "#1976D2",
                    fontWeight: 600,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <EventIcon /> Thời gian xét nghiệm
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 3 }}>
                      <LocalizationProvider
                        dateAdapter={AdapterDateFns}
                        adapterLocale={vi}
                      >
                        <DatePicker
                          label="Chọn ngày"
                          value={userInfo.date ? new Date(userInfo.date) : null}
                          onChange={(date) => {
                            setUserInfo({
                              ...userInfo,
                              date: date ? date.toISOString().slice(0, 10) : "",
                            });
                            setUserInfo((prev) => ({ ...prev, time: "" }));
                          }}
                          shouldDisableDate={(date) => {
                            const dateStr = date.toISOString().slice(0, 10);
                            const bookedTimes = bookings
                              .filter((b) => b.appointmentDate === dateStr)
                              .map((b) => b.appointmentTime);
                            return bookedTimes.length >= timeSlots.length;
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                  bgcolor: "#fff",
                                },
                              }}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </Box>
                    <Typography
                      fontWeight="bold"
                      sx={{ mb: 2, color: "#1976D2" }}
                    >
                      Chọn khung giờ:
                    </Typography>
                    <Grid container spacing={1}>
                      {timeSlots.map((slot) => {
                        const isBooked = bookings.some(
                          (b) =>
                            b.appointmentDate === userInfo.date &&
                            b.appointmentTime === slot
                        );
                        return (
                          <Grid item xs={4} sm={3} key={slot}>
                            <Button
                              variant={
                                userInfo.time === slot
                                  ? "contained"
                                  : "outlined"
                              }
                              disabled={!userInfo.date || isBooked}
                              onClick={() =>
                                setUserInfo({ ...userInfo, time: slot })
                              }
                              sx={{
                                minWidth: 80,
                                borderRadius: 2,
                                bgcolor:
                                  userInfo.time === slot
                                    ? "linear-gradient(45deg, #2196F3, #00BFA5)"
                                    : "#fff",
                                color:
                                  userInfo.time === slot ? "#fff" : "#1976D2",
                                fontWeight: 600,
                                boxShadow:
                                  userInfo.time === slot
                                    ? "0 2px 8px rgba(33,150,243,0.10)"
                                    : "none",
                                borderColor: "#1976D2",
                                mb: 1,
                                "&:hover": {
                                  bgcolor:
                                    userInfo.time === slot
                                      ? "linear-gradient(45deg, #1976D2, #00897B)"
                                      : "#E3F2FD",
                                },
                              }}
                            >
                              {slot}
                            </Button>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Ghi chú"
                      fullWidth
                      multiline
                      minRows={4}
                      value={userInfo.notes}
                      onChange={(e) =>
                        setUserInfo({ ...userInfo, notes: e.target.value })
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          bgcolor: "#fff",
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Thanh toán */}
            <Grid item xs={12}>
              <Box
                sx={{
                  p: 3,
                  bgcolor: "#F5F9FF",
                  borderRadius: 3,
                  border: "1px solid #E3F2FD",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "#1976D2",
                    fontWeight: 600,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <PaymentIcon /> Phương thức thanh toán
                </Typography>
                <RadioGroup
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  row
                  sx={{ gap: 2 }}
                >
                  <FormControlLabel
                    value="COD"
                    control={<Radio />}
                    label="Thanh toán khi nhận dịch vụ"
                    sx={{
                      bgcolor:
                        paymentMethod === "COD" ? "#E3F2FD" : "transparent",
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      transition: "all 0.2s",
                    }}
                  />
                  <FormControlLabel
                    value="VISA"
                    control={<Radio />}
                    label="Thẻ VISA"
                    sx={{
                      bgcolor:
                        paymentMethod === "VISA" ? "#E3F2FD" : "transparent",
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      transition: "all 0.2s",
                    }}
                  />
                  <FormControlLabel
                    value="TRANSFER"
                    control={<Radio />}
                    label="Chuyển khoản"
                    sx={{
                      bgcolor:
                        paymentMethod === "TRANSFER"
                          ? "#E3F2FD"
                          : "transparent",
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      transition: "all 0.2s",
                    }}
                  />
                </RadioGroup>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
            p: 3,
            gap: 2,
          }}
        >
          <Button
            onClick={() => setOpenRegisterDialog(false)}
            variant="outlined"
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontWeight: 600,
              textTransform: "none",
              borderColor: "#1976D2",
              color: "#1976D2",
              "&:hover": {
                borderColor: "#1565C0",
                bgcolor: "#E3F2FD",
              },
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirmRegister}
            variant="contained"
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontWeight: 700,
              textTransform: "none",
              background: "linear-gradient(45deg, #2196F3, #00BFA5)",
              "&:hover": {
                background: "linear-gradient(45deg, #1976D2, #00897B)",
              },
            }}
          >
            Đặt lịch
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
