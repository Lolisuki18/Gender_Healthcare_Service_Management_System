import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Tab,
  Tabs,
  TextField,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TimePicker,
  Stack,
  Alert,
  Slider,
  FormGroup,
  Checkbox,
} from "@mui/material";
import {
  LocalizationProvider,
  TimePicker as MuiTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  Settings,
  Schedule,
  Notifications,
  Security,
  Payment,
  Help,
  Edit,
  Save,
  Cancel,
  AccessTime,
  MonetizationOn,
  Language,
  Palette,
  VolumeUp,
  Email,
  Sms,
  Phone,
  VideoCall,
  Shield,
  Lock,
  Visibility,
  VisibilityOff,
  CreditCard,
  AccountBalance,
  Receipt,
  Support,
  Info,
  Warning,
} from "@mui/icons-material";

const SettingsContent = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [editingSchedule, setEditingSchedule] = useState(false);
  const [editingRates, setEditingRates] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    appointments: true,
    payments: true,
    reviews: false,
  });

  const [availability, setAvailability] = useState({
    monday: { enabled: true, start: "09:00", end: "17:00" },
    tuesday: { enabled: true, start: "09:00", end: "17:00" },
    wednesday: { enabled: true, start: "09:00", end: "17:00" },
    thursday: { enabled: true, start: "09:00", end: "17:00" },
    friday: { enabled: true, start: "09:00", end: "17:00" },
    saturday: { enabled: false, start: "10:00", end: "14:00" },
    sunday: { enabled: false, start: "10:00", end: "14:00" },
  });

  const [consultationRates, setConsultationRates] = useState({
    videoCall: 150,
    phoneCall: 120,
    inPerson: 200,
    followUp: 100,
    emergency: 250,
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleNotificationChange = (type) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleAvailabilityChange = (day, field, value) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleRateChange = (type, value) => {
    setConsultationRates((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const renderAvailabilityTab = () => (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6">Working Hours & Availability</Typography>
        <Button
          variant={editingSchedule ? "outlined" : "contained"}
          onClick={() => setEditingSchedule(!editingSchedule)}
          startIcon={editingSchedule ? <Cancel /> : <Edit />}
          sx={{
            background: editingSchedule
              ? "transparent"
              : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            "&:hover": {
              background: editingSchedule
                ? "rgba(16, 185, 129, 0.04)"
                : "linear-gradient(135deg, #059669 0%, #047857 100%)",
            },
          }}
        >
          {editingSchedule ? "Cancel" : "Edit Schedule"}
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Weekly Schedule
            </Typography>
            <Stack spacing={2}>
              {Object.entries(availability).map(([day, schedule]) => (
                <Box
                  key={day}
                  sx={{
                    p: 2,
                    border: "1px solid #e5e7eb",
                    borderRadius: 2,
                    backgroundColor: schedule.enabled ? "#f0fdf4" : "#f9fafb",
                  }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography
                      variant="body1"
                      fontWeight="medium"
                      sx={{ textTransform: "capitalize" }}
                    >
                      {day}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                      {editingSchedule && (
                        <>
                          <TextField
                            type="time"
                            size="small"
                            value={schedule.start}
                            onChange={(e) =>
                              handleAvailabilityChange(
                                day,
                                "start",
                                e.target.value
                              )
                            }
                            disabled={!schedule.enabled}
                            sx={{ width: 120 }}
                          />
                          <Typography variant="body2">to</Typography>
                          <TextField
                            type="time"
                            size="small"
                            value={schedule.end}
                            onChange={(e) =>
                              handleAvailabilityChange(
                                day,
                                "end",
                                e.target.value
                              )
                            }
                            disabled={!schedule.enabled}
                            sx={{ width: 120 }}
                          />
                        </>
                      )}
                      {!editingSchedule && schedule.enabled && (
                        <Typography variant="body2" color="text.secondary">
                          {schedule.start} - {schedule.end}
                        </Typography>
                      )}
                      {!editingSchedule && !schedule.enabled && (
                        <Chip
                          label="Unavailable"
                          size="small"
                          color="default"
                        />
                      )}
                      <Switch
                        checked={schedule.enabled}
                        onChange={(e) =>
                          handleAvailabilityChange(
                            day,
                            "enabled",
                            e.target.checked
                          )
                        }
                        disabled={!editingSchedule}
                        color="success"
                      />
                    </Box>
                  </Box>
                </Box>
              ))}
            </Stack>
            {editingSchedule && (
              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  gap: 2,
                  justifyContent: "flex-end",
                }}
              >
                <Button onClick={() => setEditingSchedule(false)}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={() => setEditingSchedule(false)}
                  sx={{
                    background:
                      "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #059669 0%, #047857 100%)",
                    },
                  }}
                >
                  Save Changes
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Quick Settings
            </Typography>
            <Stack spacing={2}>
              <FormControlLabel
                control={<Switch defaultChecked color="success" />}
                label="Accept Online Consultations"
              />
              <FormControlLabel
                control={<Switch defaultChecked color="success" />}
                label="Emergency Consultations"
              />
              <FormControlLabel
                control={<Switch color="success" />}
                label="Weekend Availability"
              />
              <FormControlLabel
                control={<Switch defaultChecked color="success" />}
                label="Automatic Booking Confirmation"
              />
            </Stack>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Time Zone
            </Typography>
            <FormControl fullWidth size="small">
              <Select defaultValue="utc-5">
                <MenuItem value="utc-5">UTC-5 (Eastern Time)</MenuItem>
                <MenuItem value="utc-6">UTC-6 (Central Time)</MenuItem>
                <MenuItem value="utc-7">UTC-7 (Mountain Time)</MenuItem>
                <MenuItem value="utc-8">UTC-8 (Pacific Time)</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  const renderConsultationRatesTab = () => (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6">Consultation Rates</Typography>
        <Button
          variant={editingRates ? "outlined" : "contained"}
          onClick={() => setEditingRates(!editingRates)}
          startIcon={editingRates ? <Cancel /> : <Edit />}
          sx={{
            background: editingRates
              ? "transparent"
              : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            "&:hover": {
              background: editingRates
                ? "rgba(16, 185, 129, 0.04)"
                : "linear-gradient(135deg, #059669 0%, #047857 100%)",
            },
          }}
        >
          {editingRates ? "Cancel" : "Update Rates"}
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Service Rates (USD)
            </Typography>
            <Grid container spacing={3}>
              {Object.entries(consultationRates).map(([type, rate]) => (
                <Grid item xs={12} sm={6} key={type}>
                  <Card
                    sx={{
                      p: 2,
                      border: "1px solid #e5e7eb",
                      borderRadius: 2,
                      backgroundColor: "#fafafa",
                    }}
                  >
                    <Box display="flex" alignItems="center" mb={2}>
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 2,
                          backgroundColor: "#10b981",
                          color: "white",
                          mr: 2,
                        }}
                      >
                        {type === "videoCall" && <VideoCall />}
                        {type === "phoneCall" && <Phone />}
                        {type === "inPerson" && <Schedule />}
                        {type === "followUp" && <AccessTime />}
                        {type === "emergency" && <Warning />}
                      </Box>
                      <Typography
                        variant="body1"
                        fontWeight="medium"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {type.replace(/([A-Z])/g, " $1").trim()}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        color="#10b981"
                      >
                        $
                      </Typography>
                      {editingRates ? (
                        <TextField
                          type="number"
                          value={rate}
                          onChange={(e) =>
                            handleRateChange(type, parseInt(e.target.value))
                          }
                          size="small"
                          sx={{ ml: 1, width: 100 }}
                        />
                      ) : (
                        <Typography
                          variant="h5"
                          fontWeight="bold"
                          color="#10b981"
                          sx={{ ml: 0.5 }}
                        >
                          {rate}
                        </Typography>
                      )}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ ml: 1 }}
                      >
                        per session
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
            {editingRates && (
              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  gap: 2,
                  justifyContent: "flex-end",
                }}
              >
                <Button onClick={() => setEditingRates(false)}>Cancel</Button>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={() => setEditingRates(false)}
                  sx={{
                    background:
                      "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #059669 0%, #047857 100%)",
                    },
                  }}
                >
                  Save Rates
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Payment Methods
            </Typography>
            <Stack spacing={2}>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Credit/Debit Cards"
              />
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="PayPal"
              />
              <FormControlLabel control={<Checkbox />} label="Bank Transfer" />
              <FormControlLabel
                control={<Checkbox />}
                label="Insurance Direct Billing"
              />
            </Stack>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Cancellation Policy
            </Typography>
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Cancellation Notice</InputLabel>
              <Select defaultValue="24">
                <MenuItem value="12">12 hours</MenuItem>
                <MenuItem value="24">24 hours</MenuItem>
                <MenuItem value="48">48 hours</MenuItem>
                <MenuItem value="72">72 hours</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="body2" color="text.secondary">
              Refund percentage for late cancellations
            </Typography>
            <Slider
              defaultValue={50}
              step={10}
              marks
              min={0}
              max={100}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value}%`}
              sx={{ color: "#10b981" }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  const renderNotificationsTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Notification Preferences
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Email sx={{ color: "#10b981" }} />
              </ListItemIcon>
              <ListItemText
                primary="Email Notifications"
                secondary="Receive notifications via email"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={notifications.email}
                  onChange={() => handleNotificationChange("email")}
                  color="success"
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <Sms sx={{ color: "#06b6d4" }} />
              </ListItemIcon>
              <ListItemText
                primary="SMS Notifications"
                secondary="Receive text message alerts"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={notifications.sms}
                  onChange={() => handleNotificationChange("sms")}
                  color="success"
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <Notifications sx={{ color: "#8b5cf6" }} />
              </ListItemIcon>
              <ListItemText
                primary="Push Notifications"
                secondary="Browser and mobile push notifications"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={notifications.push}
                  onChange={() => handleNotificationChange("push")}
                  color="success"
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Notification Types
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Schedule sx={{ color: "#f59e0b" }} />
              </ListItemIcon>
              <ListItemText
                primary="Appointment Reminders"
                secondary="Get notified about upcoming appointments"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={notifications.appointments}
                  onChange={() => handleNotificationChange("appointments")}
                  color="success"
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <Payment sx={{ color: "#10b981" }} />
              </ListItemIcon>
              <ListItemText
                primary="Payment Updates"
                secondary="Payment confirmations and receipts"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={notifications.payments}
                  onChange={() => handleNotificationChange("payments")}
                  color="success"
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <Help sx={{ color: "#06b6d4" }} />
              </ListItemIcon>
              <ListItemText
                primary="Patient Reviews"
                secondary="New patient reviews and feedback"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={notifications.reviews}
                  onChange={() => handleNotificationChange("reviews")}
                  color="success"
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            You can customize when and how you receive notifications. Important
            security and system notifications cannot be disabled.
          </Typography>
        </Alert>
      </Grid>
    </Grid>
  );

  const renderSecurityTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Password & Security
          </Typography>
          <Stack spacing={2}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Lock />}
              onClick={() => setShowPasswordDialog(true)}
            >
              Change Password
            </Button>
            <Button variant="outlined" fullWidth startIcon={<Shield />}>
              Enable Two-Factor Authentication
            </Button>
            <Button variant="outlined" fullWidth startIcon={<Security />}>
              View Login History
            </Button>
          </Stack>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Privacy Settings
          </Typography>
          <Stack spacing={2}>
            <FormControlLabel
              control={<Switch defaultChecked color="success" />}
              label="Profile visible to patients"
            />
            <FormControlLabel
              control={<Switch defaultChecked color="success" />}
              label="Allow patient reviews"
            />
            <FormControlLabel
              control={<Switch color="success" />}
              label="Show availability in search"
            />
            <FormControlLabel
              control={<Switch defaultChecked color="success" />}
              label="Allow appointment requests"
            />
          </Stack>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Account Information
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Account Email"
              defaultValue="dr.consultant@example.com"
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Phone Number"
              defaultValue="+1 (555) 123-4567"
              fullWidth
              size="small"
            />
            <TextField
              label="Medical License Number"
              defaultValue="ML123456789"
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Account Status
              </Typography>
              <Chip
                label="Verified"
                color="success"
                size="small"
                icon={<Shield />}
              />
            </Box>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#1f2937" }}
      >
        Settings
      </Typography>
      <Typography variant="body1" sx={{ color: "#6b7280", mb: 4 }}>
        Manage your account settings, availability, and preferences
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              minWidth: 0,
              mr: 4,
            },
            "& .Mui-selected": {
              color: "#10b981 !important",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#10b981",
            },
          }}
        >
          <Tab label="Availability" icon={<Schedule />} />
          <Tab label="Consultation Rates" icon={<MonetizationOn />} />
          <Tab label="Notifications" icon={<Notifications />} />
          <Tab label="Security" icon={<Security />} />
        </Tabs>
      </Paper>

      <Box sx={{ mt: 2 }}>
        {activeTab === 0 && renderAvailabilityTab()}
        {activeTab === 1 && renderConsultationRatesTab()}
        {activeTab === 2 && renderNotificationsTab()}
        {activeTab === 3 && renderSecurityTab()}
      </Box>

      {/* Change Password Dialog */}
      <Dialog
        open={showPasswordDialog}
        onClose={() => setShowPasswordDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Current Password"
              type="password"
              fullWidth
              size="small"
            />
            <TextField
              label="New Password"
              type="password"
              fullWidth
              size="small"
            />
            <TextField
              label="Confirm New Password"
              type="password"
              fullWidth
              size="small"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPasswordDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
              },
            }}
          >
            Update Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SettingsContent;
