import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Badge,
} from "@mui/material";
import {
  MedicalServices as MedicalIcon,
  Psychology as PsychologyIcon,
  HealthAndSafety as HealthIcon,
  MonitorHeart as MonitorIcon,
  Vaccines as VaccinesIcon,
  LocalHospital as HospitalIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  AttachMoney as MoneyIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(20px)",
  borderRadius: "20px",
  border: "1px solid rgba(16, 185, 129, 0.15)",
  boxShadow: "0 8px 32px rgba(16, 185, 129, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 12px 48px rgba(16, 185, 129, 0.15)",
  },
}));

const ServiceCard = styled(Card)(({ theme }) => ({
  background:
    "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9))",
  border: "1px solid rgba(16, 185, 129, 0.1)",
  borderRadius: "16px",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 32px rgba(16, 185, 129, 0.15)",
  },
}));

const MedicalServicesContent = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [openServiceDialog, setOpenServiceDialog] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    name: "",
    category: "",
    duration: "",
    price: "",
    description: "",
    availability: true,
  });

  const tabLabels = [
    "Dịch vụ sẵn có",
    "Lịch trình dịch vụ",
    "Doanh thu",
    "Cài đặt",
  ];

  const services = {
    available: [
      {
        id: 1,
        name: "Tư vấn chuyển đổi giới tính",
        category: "Tư vấn tâm lý",
        duration: "60 phút",
        price: "500,000 VNĐ",
        description: "Tư vấn toàn diện về quá trình chuyển đổi giới tính",
        icon: <PsychologyIcon />,
        color: "#3b82f6",
        bookings: 25,
        rating: 4.8,
        availability: true,
      },
      {
        id: 2,
        name: "Khám sức khỏe tổng quát",
        category: "Khám tổng quát",
        duration: "45 phút",
        price: "300,000 VNĐ",
        description: "Khám sức khỏe định kỳ và tư vấn sức khỏe",
        icon: <HealthIcon />,
        color: "#10b981",
        bookings: 42,
        rating: 4.9,
        availability: true,
      },
      {
        id: 3,
        name: "Theo dõi hormone therapy",
        category: "Điều trị hormone",
        duration: "30 phút",
        price: "400,000 VNĐ",
        description: "Theo dõi và điều chỉnh liệu pháp hormone",
        icon: <MonitorIcon />,
        color: "#8b5cf6",
        bookings: 18,
        rating: 4.7,
        availability: true,
      },
      {
        id: 4,
        name: "Tư vấn trước phẫu thuật",
        category: "Tư vấn phẫu thuật",
        duration: "90 phút",
        price: "800,000 VNĐ",
        description: "Tư vấn chuẩn bị cho phẫu thuật chuyển đổi giới tính",
        icon: <MedicalIcon />,
        color: "#f59e0b",
        bookings: 12,
        rating: 4.9,
        availability: false,
      },
    ],
    schedule: [
      {
        id: 1,
        date: "2024-12-20",
        service: "Tư vấn chuyển đổi giới tính",
        patient: "Nguyễn Thị Mai",
        time: "09:00 - 10:00",
        status: "confirmed",
      },
      {
        id: 2,
        date: "2024-12-20",
        service: "Khám sức khỏe tổng quát",
        patient: "Trần Văn Nam",
        time: "10:30 - 11:15",
        status: "pending",
      },
      {
        id: 3,
        date: "2024-12-20",
        service: "Theo dõi hormone therapy",
        patient: "Lê Thị Hoa",
        time: "14:00 - 14:30",
        status: "confirmed",
      },
    ],
    revenue: {
      today: 2100000,
      thisWeek: 14500000,
      thisMonth: 58000000,
      services: [
        {
          name: "Tư vạn chuyển đổi giới tính",
          revenue: 25000000,
          bookings: 50,
        },
        { name: "Khám sức khỏe tổng quát", revenue: 18600000, bookings: 62 },
        { name: "Theo dõi hormone therapy", revenue: 10800000, bookings: 27 },
        { name: "Tư vấn trước phẫu thuật", revenue: 3600000, bookings: 4 },
      ],
    },
  };

  const handleServiceEdit = (service) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      category: service.category,
      duration: service.duration,
      price: service.price,
      description: service.description,
      availability: service.availability,
    });
    setOpenServiceDialog(true);
  };

  const handleServiceSave = () => {
    // Handle save logic here
    setOpenServiceDialog(false);
    setEditingService(null);
    setServiceForm({
      name: "",
      category: "",
      duration: "",
      price: "",
      description: "",
      availability: true,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const renderAvailableServices = () => (
    <Grid container spacing={3}>
      {services.available.map((service) => (
        <Grid item xs={12} md={6} lg={4} key={service.id}>
          <ServiceCard>
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    background: `linear-gradient(45deg, ${service.color}, ${service.color}dd)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                  }}
                >
                  {service.icon}
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleServiceEdit(service)}
                  >
                    <EditIcon />
                  </IconButton>
                  <Switch checked={service.availability} size="small" />
                </Box>
              </Box>

              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#1e293b", mb: 1 }}
              >
                {service.name}
              </Typography>

              <Chip
                label={service.category}
                size="small"
                sx={{
                  mb: 2,
                  background: `${service.color}20`,
                  color: service.color,
                }}
              />

              <Typography variant="body2" sx={{ color: "#64748b", mb: 2 }}>
                {service.description}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ color: "#6b7280" }}>
                    Thời gian
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {service.duration}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="body2" sx={{ color: "#6b7280" }}>
                    Giá
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, color: service.color }}
                  >
                    {service.price}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <StarIcon sx={{ fontSize: 16, color: "#fbbf24" }} />
                  <Typography variant="body2">{service.rating}</Typography>
                </Box>
                <Typography variant="body2" sx={{ color: "#6b7280" }}>
                  {service.bookings} lượt đặt
                </Typography>
              </Box>
            </CardContent>
          </ServiceCard>
        </Grid>
      ))}

      {/* Add New Service Card */}
      <Grid item xs={12} md={6} lg={4}>
        <ServiceCard
          sx={{
            border: "2px dashed rgba(16, 185, 129, 0.3)",
            cursor: "pointer",
            "&:hover": {
              borderColor: "rgba(16, 185, 129, 0.5)",
            },
          }}
          onClick={() => setOpenServiceDialog(true)}
        >
          <CardContent
            sx={{
              p: 3,
              textAlign: "center",
              minHeight: 250,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <AddIcon sx={{ fontSize: 48, color: "#10b981", mb: 2 }} />
            <Typography variant="h6" sx={{ color: "#10b981", fontWeight: 600 }}>
              Thêm dịch vụ mới
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", mt: 1 }}>
              Tạo dịch vụ y tế mới cho bệnh nhân
            </Typography>
          </CardContent>
        </ServiceCard>
      </Grid>
    </Grid>
  );

  const renderSchedule = () => (
    <StyledPaper sx={{ p: 3 }}>
      <Typography
        variant="h6"
        sx={{ fontWeight: 600, color: "#1e293b", mb: 3 }}
      >
        Lịch trình dịch vụ hôm nay
      </Typography>
      <List>
        {services.schedule.map((appointment, index) => (
          <React.Fragment key={appointment.id}>
            <ListItem sx={{ px: 0 }}>
              <ListItemAvatar>
                <Avatar
                  sx={{
                    background: "linear-gradient(45deg, #10b981, #059669)",
                  }}
                >
                  <ScheduleIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {appointment.service}
                    </Typography>
                    <Chip
                      label={
                        appointment.status === "confirmed"
                          ? "Đã xác nhận"
                          : "Chờ xác nhận"
                      }
                      color={getStatusColor(appointment.status)}
                      size="small"
                    />
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                      Bệnh nhân: {appointment.patient}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#6b7280" }}>
                      <AccessTimeIcon
                        sx={{ fontSize: 14, mr: 0.5, verticalAlign: "middle" }}
                      />
                      {appointment.time}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            {index < services.schedule.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </StyledPaper>
  );

  const renderRevenue = () => (
    <Grid container spacing={3}>
      {/* Revenue Cards */}
      <Grid item xs={12} sm={6} md={3}>
        <StyledPaper sx={{ p: 3, textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "#10b981", mb: 1 }}
          >
            {formatCurrency(services.revenue.today)}
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Doanh thu hôm nay
          </Typography>
        </StyledPaper>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <StyledPaper sx={{ p: 3, textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "#3b82f6", mb: 1 }}
          >
            {formatCurrency(services.revenue.thisWeek)}
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Doanh thu tuần này
          </Typography>
        </StyledPaper>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <StyledPaper sx={{ p: 3, textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "#8b5cf6", mb: 1 }}
          >
            {formatCurrency(services.revenue.thisMonth)}
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Doanh thu tháng này
          </Typography>
        </StyledPaper>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <StyledPaper sx={{ p: 3, textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "#f59e0b", mb: 1 }}
          >
            143
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Tổng lượt đặt
          </Typography>
        </StyledPaper>
      </Grid>

      {/* Revenue by Service */}
      <Grid item xs={12}>
        <StyledPaper sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "#1e293b", mb: 3 }}
          >
            Doanh thu theo dịch vụ
          </Typography>
          <Grid container spacing={2}>
            {services.revenue.services.map((service, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Box
                  sx={{
                    p: 2,
                    border: "1px solid rgba(16, 185, 129, 0.1)",
                    borderRadius: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {service.name}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ color: "#10b981", fontWeight: 700 }}
                    >
                      {formatCurrency(service.revenue)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    {service.bookings} lượt đặt
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </StyledPaper>
      </Grid>
    </Grid>
  );

  const renderSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <StyledPaper sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "#1e293b", mb: 3 }}
          >
            Cài đặt dịch vụ
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Cho phép đặt lịch trực tuyến"
                secondary="Bệnh nhân có thể đặt lịch trực tiếp qua website"
              />
              <Switch defaultChecked />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Tự động xác nhận lịch hẹn"
                secondary="Lịch hẹn sẽ được xác nhận tự động"
              />
              <Switch defaultChecked />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Thông báo email cho bệnh nhân"
                secondary="Gửi email xác nhận và nhắc nhở"
              />
              <Switch defaultChecked />
            </ListItem>
          </List>
        </StyledPaper>
      </Grid>

      <Grid item xs={12} md={6}>
        <StyledPaper sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "#1e293b", mb: 3 }}
          >
            Thời gian làm việc
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Giờ bắt đầu</InputLabel>
              <Select defaultValue="08:00" label="Giờ bắt đầu">
                <MenuItem value="07:00">07:00</MenuItem>
                <MenuItem value="08:00">08:00</MenuItem>
                <MenuItem value="09:00">09:00</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Giờ kết thúc</InputLabel>
              <Select defaultValue="17:00" label="Giờ kết thúc">
                <MenuItem value="16:00">16:00</MenuItem>
                <MenuItem value="17:00">17:00</MenuItem>
                <MenuItem value="18:00">18:00</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Thời gian nghỉ trưa</InputLabel>
              <Select defaultValue="12:00-13:00" label="Thời gian nghỉ trưa">
                <MenuItem value="12:00-13:00">12:00 - 13:00</MenuItem>
                <MenuItem value="11:30-12:30">11:30 - 12:30</MenuItem>
                <MenuItem value="13:00-14:00">13:00 - 14:00</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </StyledPaper>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: "#1e293b", mb: 1 }}
        >
          Dịch vụ y tế
        </Typography>
        <Typography variant="body1" sx={{ color: "#64748b" }}>
          Quản lý các dịch vụ y tế và lịch trình khám bệnh
        </Typography>
      </Box>

      {/* Tabs */}
      <StyledPaper sx={{ mb: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={(e, newValue) => setSelectedTab(newValue)}
          sx={{
            "& .MuiTab-root": {
              fontWeight: 600,
              textTransform: "none",
            },
            "& .Mui-selected": {
              color: "#10b981 !important",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#10b981",
            },
          }}
        >
          {tabLabels.map((label, index) => (
            <Tab key={index} label={label} />
          ))}
        </Tabs>
      </StyledPaper>

      {/* Content */}
      <Box>
        {selectedTab === 0 && renderAvailableServices()}
        {selectedTab === 1 && renderSchedule()}
        {selectedTab === 2 && renderRevenue()}
        {selectedTab === 3 && renderSettings()}
      </Box>

      {/* Service Dialog */}
      <Dialog
        open={openServiceDialog}
        onClose={() => setOpenServiceDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingService ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="Tên dịch vụ"
              value={serviceForm.name}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, name: e.target.value })
              }
            />
            <FormControl fullWidth>
              <InputLabel>Danh mục</InputLabel>
              <Select
                value={serviceForm.category}
                label="Danh mục"
                onChange={(e) =>
                  setServiceForm({ ...serviceForm, category: e.target.value })
                }
              >
                <MenuItem value="Tư vấn tâm lý">Tư vấn tâm lý</MenuItem>
                <MenuItem value="Khám tổng quát">Khám tổng quát</MenuItem>
                <MenuItem value="Điều trị hormone">Điều trị hormone</MenuItem>
                <MenuItem value="Tư vấn phẫu thuật">Tư vấn phẫu thuật</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Thời gian (phút)"
              value={serviceForm.duration}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, duration: e.target.value })
              }
            />
            <TextField
              fullWidth
              label="Giá (VNĐ)"
              value={serviceForm.price}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, price: e.target.value })
              }
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Mô tả"
              value={serviceForm.description}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, description: e.target.value })
              }
            />
            <FormControlLabel
              control={
                <Switch
                  checked={serviceForm.availability}
                  onChange={(e) =>
                    setServiceForm({
                      ...serviceForm,
                      availability: e.target.checked,
                    })
                  }
                />
              }
              label="Có sẵn"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenServiceDialog(false)}>Hủy</Button>
          <Button
            onClick={handleServiceSave}
            variant="contained"
            sx={{
              background: "linear-gradient(45deg, #10b981, #059669)",
              "&:hover": {
                background: "linear-gradient(45deg, #059669, #047857)",
              },
            }}
          >
            {editingService ? "Cập nhật" : "Thêm mới"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MedicalServicesContent;
