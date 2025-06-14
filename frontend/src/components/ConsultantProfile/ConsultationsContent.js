import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Badge,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  VideoCall as VideoCallIcon,
  Chat as ChatIcon,
  Psychology as PsychologyIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  MoreVert as MoreVertIcon,
  Phone as PhoneIcon,
  Message as MessageIcon,
  Star as StarIcon,
  History as HistoryIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  CallEnd as CallEndIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
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

const ConsultationCard = styled(Card)(({ theme }) => ({
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

const VideoCallCard = styled(Card)(({ theme }) => ({
  background: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
  borderRadius: "16px",
  color: "#fff",
  overflow: "hidden",
  position: "relative",
}));

const ConsultationsContent = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [openNoteDialog, setOpenNoteDialog] = useState(false);
  const [openVideoDialog, setOpenVideoDialog] = useState(false);
  const [consultationNotes, setConsultationNotes] = useState("");
  const [videoCallState, setVideoCallState] = useState({
    isActive: false,
    duration: 0,
    micEnabled: true,
    videoEnabled: true,
  });

  const tabLabels = ["Đang chờ", "Đang tư vấn", "Đã hoàn thành", "Chat hỗ trợ"];

  const consultations = {
    pending: [
      {
        id: 1,
        patient: "Nguyễn Thị Mai",
        time: "14:30",
        type: "Video Call",
        subject: "Tư vấn hormone therapy",
        priority: "high",
        avatar: "M",
        phone: "+84 901234567",
        status: "waiting",
      },
      {
        id: 2,
        patient: "Trần Văn Nam",
        time: "15:00",
        type: "Chat",
        subject: "Hỏi về quy trình phẫu thuật",
        priority: "medium",
        avatar: "N",
        phone: "+84 987654321",
        status: "scheduled",
      },
    ],
    active: [
      {
        id: 3,
        patient: "Lê Thị Hoa",
        time: "13:30",
        type: "Video Call",
        subject: "Theo dõi sau phẫu thuật",
        priority: "high",
        avatar: "H",
        phone: "+84 912345678",
        status: "in-progress",
        duration: "25:30",
      },
    ],
    completed: [
      {
        id: 4,
        patient: "Phạm Minh Tuấn",
        time: "10:00",
        type: "Video Call",
        subject: "Tư vấn chuyển đổi giới tính",
        priority: "medium",
        avatar: "T",
        phone: "+84 923456789",
        status: "completed",
        rating: 5,
        notes: "Bệnh nhân đã hiểu rõ quy trình điều trị",
      },
      {
        id: 5,
        patient: "Hoàng Thị Lan",
        time: "11:30",
        type: "Chat",
        subject: "Hỏi về tác dụng phụ thuốc",
        priority: "low",
        avatar: "L",
        phone: "+84 934567890",
        status: "completed",
        rating: 4,
        notes: "Đã giải thích chi tiết về tác dụng phụ",
      },
    ],
    chat: [
      {
        id: 6,
        patient: "Đỗ Văn Khoa",
        lastMessage: "Cảm ơn bác sĩ đã tư vấn",
        time: "2 phút trước",
        unread: 0,
        avatar: "K",
        status: "online",
      },
      {
        id: 7,
        patient: "Bùi Thị Thu",
        lastMessage: "Tôi có thể đặt lịch hẹn không?",
        time: "10 phút trước",
        unread: 2,
        avatar: "T",
        status: "offline",
      },
    ],
  };

  const handleMenuClick = (event, consultation) => {
    setAnchorEl(event.currentTarget);
    setSelectedConsultation(consultation);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedConsultation(null);
  };

  const handleStartVideoCall = (consultation) => {
    setSelectedConsultation(consultation);
    setOpenVideoDialog(true);
    setVideoCallState({
      ...videoCallState,
      isActive: true,
    });
    handleMenuClose();
  };

  const handleAddNotes = (consultation) => {
    setSelectedConsultation(consultation);
    setOpenNoteDialog(true);
    handleMenuClose();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "waiting":
        return "warning";
      case "scheduled":
        return "info";
      case "in-progress":
        return "success";
      case "completed":
        return "default";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  const renderConsultationsList = (consultationsList) => (
    <Grid container spacing={3}>
      {consultationsList.map((consultation) => (
        <Grid item xs={12} key={consultation.id}>
          <ConsultationCard>
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <Badge
                    color="error"
                    variant="dot"
                    invisible={consultation.priority !== "high"}
                  >
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        background: `linear-gradient(45deg, ${getPriorityColor(
                          consultation.priority
                        )}, ${getPriorityColor(consultation.priority)}dd)`,
                        fontWeight: 600,
                        fontSize: "20px",
                        mr: 3,
                      }}
                    >
                      {consultation.avatar}
                    </Avatar>
                  </Badge>

                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: "#1e293b" }}
                      >
                        {consultation.patient}
                      </Typography>
                      <Chip
                        label={consultation.type}
                        color={
                          consultation.type === "Video Call"
                            ? "primary"
                            : "secondary"
                        }
                        size="small"
                        icon={
                          consultation.type === "Video Call" ? (
                            <VideoCallIcon />
                          ) : (
                            <ChatIcon />
                          )
                        }
                      />
                      {consultation.status && (
                        <Chip
                          label={
                            consultation.status === "in-progress"
                              ? "Đang tư vấn"
                              : consultation.status === "waiting"
                              ? "Đang chờ"
                              : consultation.status === "scheduled"
                              ? "Đã lên lịch"
                              : "Hoàn thành"
                          }
                          color={getStatusColor(consultation.status)}
                          size="small"
                        />
                      )}
                    </Box>

                    <Typography
                      variant="body1"
                      sx={{ color: "#374151", mb: 1, fontWeight: 500 }}
                    >
                      {consultation.subject}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#6b7280",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        {consultation.time}
                        {consultation.duration && ` (${consultation.duration})`}
                      </Typography>

                      {consultation.phone && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#6b7280",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <PhoneIcon sx={{ fontSize: 16, mr: 0.5 }} />
                          {consultation.phone}
                        </Typography>
                      )}

                      {consultation.rating && (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <StarIcon
                            sx={{ fontSize: 16, color: "#fbbf24", mr: 0.5 }}
                          />
                          <Typography variant="body2" sx={{ color: "#6b7280" }}>
                            {consultation.rating}/5
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>

                <IconButton
                  onClick={(e) => handleMenuClick(e, consultation)}
                  sx={{ color: "#6b7280" }}
                >
                  <MoreVertIcon />
                </IconButton>
              </Box>
            </CardContent>
          </ConsultationCard>
        </Grid>
      ))}
    </Grid>
  );

  const renderChatList = (chatList) => (
    <Grid container spacing={2}>
      {chatList.map((chat) => (
        <Grid item xs={12} key={chat.id}>
          <ConsultationCard>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Badge
                  color="success"
                  variant="dot"
                  invisible={chat.status !== "online"}
                >
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      background: "linear-gradient(45deg, #10b981, #059669)",
                      mr: 2,
                    }}
                  >
                    {chat.avatar}
                  </Avatar>
                </Badge>

                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, color: "#1e293b" }}
                  >
                    {chat.patient}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#6b7280", mb: 0.5 }}
                  >
                    {chat.lastMessage}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                    {chat.time}
                  </Typography>
                </Box>

                {chat.unread > 0 && (
                  <Badge
                    badgeContent={chat.unread}
                    color="error"
                    sx={{ mr: 2 }}
                  />
                )}

                <Button
                  variant="contained"
                  size="small"
                  startIcon={<MessageIcon />}
                  sx={{
                    background: "linear-gradient(45deg, #10b981, #059669)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #059669, #047857)",
                    },
                  }}
                >
                  Trả lời
                </Button>
              </Box>
            </CardContent>
          </ConsultationCard>
        </Grid>
      ))}
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
          Tư vấn trực tuyến
        </Typography>
        <Typography variant="body1" sx={{ color: "#64748b" }}>
          Quản lý các cuộc tư vấn video call và chat với bệnh nhân
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StyledPaper sx={{ p: 3, textAlign: "center" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <VideoCallIcon sx={{ fontSize: 40, color: "#3b82f6", mr: 1 }} />
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "#1e293b" }}
              >
                12
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Video calls hôm nay
            </Typography>
          </StyledPaper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StyledPaper sx={{ p: 3, textAlign: "center" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <ChatIcon sx={{ fontSize: 40, color: "#10b981", mr: 1 }} />
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "#1e293b" }}
              >
                28
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Tin nhắn chưa đọc
            </Typography>
          </StyledPaper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StyledPaper sx={{ p: 3, textAlign: "center" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <AccessTimeIcon sx={{ fontSize: 40, color: "#f59e0b", mr: 1 }} />
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "#1e293b" }}
              >
                4.2h
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Thời gian tư vấn
            </Typography>
          </StyledPaper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StyledPaper sx={{ p: 3, textAlign: "center" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <StarIcon sx={{ fontSize: 40, color: "#fbbf24", mr: 1 }} />
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "#1e293b" }}
              >
                4.8
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Đánh giá trung bình
            </Typography>
          </StyledPaper>
        </Grid>
      </Grid>

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
        {selectedTab === 0 && renderConsultationsList(consultations.pending)}
        {selectedTab === 1 && renderConsultationsList(consultations.active)}
        {selectedTab === 2 && renderConsultationsList(consultations.completed)}
        {selectedTab === 3 && renderChatList(consultations.chat)}
      </Box>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleStartVideoCall(selectedConsultation)}>
          <VideoCallIcon sx={{ mr: 1 }} />
          Bắt đầu video call
        </MenuItem>
        <MenuItem onClick={() => handleAddNotes(selectedConsultation)}>
          <MessageIcon sx={{ mr: 1 }} />
          Thêm ghi chú
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <HistoryIcon sx={{ mr: 1 }} />
          Xem lịch sử
        </MenuItem>
      </Menu>

      {/* Notes Dialog */}
      <Dialog
        open={openNoteDialog}
        onClose={() => setOpenNoteDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Ghi chú tư vấn</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Nội dung ghi chú"
            value={consultationNotes}
            onChange={(e) => setConsultationNotes(e.target.value)}
            variant="outlined"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNoteDialog(false)}>Hủy</Button>
          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(45deg, #10b981, #059669)",
              "&:hover": {
                background: "linear-gradient(45deg, #059669, #047857)",
              },
            }}
          >
            Lưu ghi chú
          </Button>
        </DialogActions>
      </Dialog>

      {/* Video Call Dialog */}
      <Dialog
        open={openVideoDialog}
        onClose={() => setOpenVideoDialog(false)}
        maxWidth="lg"
        fullWidth
        fullScreen
      >
        <VideoCallCard>
          <CardContent sx={{ p: 0, height: "100vh", position: "relative" }}>
            <Box
              sx={{
                position: "absolute",
                top: 20,
                left: 20,
                zIndex: 10,
                background: "rgba(0, 0, 0, 0.5)",
                borderRadius: "12px",
                p: 2,
              }}
            >
              <Typography variant="h6" sx={{ color: "#fff", mb: 1 }}>
                {selectedConsultation?.patient}
              </Typography>
              <Typography variant="body2" sx={{ color: "#e5e7eb" }}>
                {selectedConsultation?.subject}
              </Typography>
            </Box>

            <Box
              sx={{
                position: "absolute",
                bottom: 20,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 2,
                zIndex: 10,
              }}
            >
              <IconButton
                sx={{
                  background: videoCallState.micEnabled
                    ? "rgba(255, 255, 255, 0.2)"
                    : "#ef4444",
                  color: "#fff",
                  "&:hover": {
                    background: videoCallState.micEnabled
                      ? "rgba(255, 255, 255, 0.3)"
                      : "#dc2626",
                  },
                }}
                onClick={() =>
                  setVideoCallState({
                    ...videoCallState,
                    micEnabled: !videoCallState.micEnabled,
                  })
                }
              >
                {videoCallState.micEnabled ? <MicIcon /> : <MicOffIcon />}
              </IconButton>

              <IconButton
                sx={{
                  background: videoCallState.videoEnabled
                    ? "rgba(255, 255, 255, 0.2)"
                    : "#ef4444",
                  color: "#fff",
                  "&:hover": {
                    background: videoCallState.videoEnabled
                      ? "rgba(255, 255, 255, 0.3)"
                      : "#dc2626",
                  },
                }}
                onClick={() =>
                  setVideoCallState({
                    ...videoCallState,
                    videoEnabled: !videoCallState.videoEnabled,
                  })
                }
              >
                {videoCallState.videoEnabled ? (
                  <VideocamIcon />
                ) : (
                  <VideocamOffIcon />
                )}
              </IconButton>

              <IconButton
                sx={{
                  background: "#ef4444",
                  color: "#fff",
                  "&:hover": {
                    background: "#dc2626",
                  },
                }}
                onClick={() => setOpenVideoDialog(false)}
              >
                <CallEndIcon />
              </IconButton>
            </Box>

            {/* Video content area */}
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
              }}
            >
              <Typography variant="h5" sx={{ color: "#fff", opacity: 0.7 }}>
                Video Call Interface
              </Typography>
            </Box>
          </CardContent>
        </VideoCallCard>
      </Dialog>
    </Box>
  );
};

export default ConsultationsContent;
