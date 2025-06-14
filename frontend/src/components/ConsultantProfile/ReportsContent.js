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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
  Stack,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Assessment,
  Download,
  Print,
  Visibility,
  TrendingUp,
  People,
  LocalHospital,
  MonetizationOn,
  DateRange,
  FilterList,
  FileDownload,
  Share,
  Analytics,
  PieChart as PieChartIcon,
  Timeline,
  Assignment,
  Person,
  MedicalServices,
  Schedule,
} from "@mui/icons-material";

const ReportsContent = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedReport, setSelectedReport] = useState("");
  const [reportDialog, setReportDialog] = useState(false);
  const [reportData, setReportData] = useState(null);

  // Sample data for reports
  const consultationData = [
    { month: "Jan", consultations: 45, revenue: 4500 },
    { month: "Feb", consultations: 52, revenue: 5200 },
    { month: "Mar", consultations: 48, revenue: 4800 },
    { month: "Apr", consultations: 61, revenue: 6100 },
    { month: "May", consultations: 55, revenue: 5500 },
    { month: "Jun", consultations: 58, revenue: 5800 },
  ];

  const serviceDistribution = [
    { name: "Hormone Therapy", value: 35, color: "#10b981" },
    { name: "Gender Counseling", value: 28, color: "#06b6d4" },
    { name: "Surgical Consultation", value: 22, color: "#8b5cf6" },
    { name: "Mental Health", value: 15, color: "#f59e0b" },
  ];

  const patientReports = [
    {
      id: 1,
      patientName: "Sarah Johnson",
      age: 28,
      condition: "Gender Dysphoria",
      lastVisit: "2024-06-01",
      treatmentPlan: "Hormone Therapy",
      status: "Active",
      progress: "Good",
    },
    {
      id: 2,
      patientName: "Alex Chen",
      age: 24,
      condition: "Gender Identity Disorder",
      lastVisit: "2024-05-28",
      treatmentPlan: "Counseling + Hormone Therapy",
      status: "Active",
      progress: "Excellent",
    },
    {
      id: 3,
      patientName: "Morgan Davis",
      age: 31,
      condition: "Post-Surgical Care",
      lastVisit: "2024-05-25",
      treatmentPlan: "Follow-up Care",
      status: "Monitoring",
      progress: "Stable",
    },
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleGenerateReport = (type) => {
    setSelectedReport(type);
    setReportDialog(true);
  };

  const renderOverviewTab = () => (
    <Grid container spacing={3}>
      {/* Key Metrics Cards */}
      <Grid item xs={12} md={3}>
        <Card
          sx={{
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "white",
            height: "100%",
          }}
        >
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <People sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  156
                </Typography>
                <Typography variant="body2">Total Patients</Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              +12% from last month
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card
          sx={{
            background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
            color: "white",
            height: "100%",
          }}
        >
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <LocalHospital sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  284
                </Typography>
                <Typography variant="body2">Consultations</Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              +8% from last month
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card
          sx={{
            background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
            color: "white",
            height: "100%",
          }}
        >
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <MonetizationOn sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  $28.4K
                </Typography>
                <Typography variant="body2">Revenue</Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              +15% from last month
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card
          sx={{
            background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            color: "white",
            height: "100%",
          }}
        >
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <TrendingUp sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  94%
                </Typography>
                <Typography variant="body2">Satisfaction</Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              +2% from last month
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Charts */}
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 3, height: 400 }}>
          <Typography variant="h6" gutterBottom>
            Consultation Trends
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={consultationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="consultations"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, height: 400 }}>
          <Typography variant="h6" gutterBottom>
            Service Distribution
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={serviceDistribution}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {serviceDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderPatientReportsTab = () => (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6">Patient Reports</Typography>
        <Box display="flex" gap={2}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Period</InputLabel>
            <Select
              value={selectedPeriod}
              label="Period"
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="quarterly">Quarterly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={() => handleGenerateReport("patient")}
            sx={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
              },
            }}
          >
            Generate Report
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f8fafc" }}>
              <TableCell>Patient</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Condition</TableCell>
              <TableCell>Last Visit</TableCell>
              <TableCell>Treatment Plan</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patientReports.map((patient) => (
              <TableRow key={patient.id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ mr: 2, bgcolor: "#10b981" }}>
                      {patient.patientName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </Avatar>
                    <Typography variant="body2" fontWeight="medium">
                      {patient.patientName}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.condition}</TableCell>
                <TableCell>{patient.lastVisit}</TableCell>
                <TableCell>{patient.treatmentPlan}</TableCell>
                <TableCell>
                  <Chip
                    label={patient.status}
                    size="small"
                    sx={{
                      backgroundColor:
                        patient.status === "Active" ? "#dcfce7" : "#fef3c7",
                      color:
                        patient.status === "Active" ? "#166534" : "#92400e",
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={patient.progress}
                    size="small"
                    sx={{
                      backgroundColor:
                        patient.progress === "Excellent"
                          ? "#dcfce7"
                          : patient.progress === "Good"
                          ? "#dbeafe"
                          : "#f3f4f6",
                      color:
                        patient.progress === "Excellent"
                          ? "#166534"
                          : patient.progress === "Good"
                          ? "#1e40af"
                          : "#374151",
                    }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small" color="primary">
                    <Visibility />
                  </IconButton>
                  <IconButton size="small" color="primary">
                    <Print />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderAnalyticsTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, height: 400 }}>
          <Typography variant="h6" gutterBottom>
            Revenue Trends
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={consultationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, height: 400 }}>
          <Typography variant="h6" gutterBottom>
            Performance Metrics
          </Typography>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Box sx={{ p: 2, borderRadius: 2, backgroundColor: "#f0fdf4" }}>
              <Typography variant="body2" color="text.secondary">
                Average Consultation Duration
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="#166534">
                45 minutes
              </Typography>
            </Box>
            <Box sx={{ p: 2, borderRadius: 2, backgroundColor: "#eff6ff" }}>
              <Typography variant="body2" color="text.secondary">
                Patient Satisfaction Score
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="#1e40af">
                4.8/5.0
              </Typography>
            </Box>
            <Box sx={{ p: 2, borderRadius: 2, backgroundColor: "#faf5ff" }}>
              <Typography variant="body2" color="text.secondary">
                Treatment Success Rate
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="#7c3aed">
                92%
              </Typography>
            </Box>
            <Box sx={{ p: 2, borderRadius: 2, backgroundColor: "#fffbeb" }}>
              <Typography variant="body2" color="text.secondary">
                Follow-up Rate
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="#d97706">
                87%
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderCustomReportsTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Custom Report Generator
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Quick Reports
            </Typography>
            <List>
              <ListItem
                button
                onClick={() => handleGenerateReport("monthly")}
                sx={{ borderRadius: 2, mb: 1 }}
              >
                <ListItemIcon>
                  <Assessment sx={{ color: "#10b981" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Monthly Summary Report"
                  secondary="Comprehensive monthly performance overview"
                />
                <IconButton>
                  <FileDownload />
                </IconButton>
              </ListItem>
              <ListItem
                button
                onClick={() => handleGenerateReport("financial")}
                sx={{ borderRadius: 2, mb: 1 }}
              >
                <ListItemIcon>
                  <MonetizationOn sx={{ color: "#06b6d4" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Financial Report"
                  secondary="Revenue and billing analysis"
                />
                <IconButton>
                  <FileDownload />
                </IconButton>
              </ListItem>
              <ListItem
                button
                onClick={() => handleGenerateReport("patient-outcomes")}
                sx={{ borderRadius: 2, mb: 1 }}
              >
                <ListItemIcon>
                  <People sx={{ color: "#8b5cf6" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Patient Outcomes Report"
                  secondary="Treatment effectiveness and patient progress"
                />
                <IconButton>
                  <FileDownload />
                </IconButton>
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Report Builder
            </Typography>
            <Stack spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Report Type</InputLabel>
                <Select label="Report Type">
                  <MenuItem value="consultation">Consultation Report</MenuItem>
                  <MenuItem value="patient">Patient Report</MenuItem>
                  <MenuItem value="financial">Financial Report</MenuItem>
                  <MenuItem value="performance">Performance Report</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Time Period</InputLabel>
                <Select label="Time Period">
                  <MenuItem value="last-week">Last Week</MenuItem>
                  <MenuItem value="last-month">Last Month</MenuItem>
                  <MenuItem value="last-quarter">Last Quarter</MenuItem>
                  <MenuItem value="last-year">Last Year</MenuItem>
                  <MenuItem value="custom">Custom Range</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Report Name"
                placeholder="Enter report name"
              />
              <Button
                variant="contained"
                fullWidth
                startIcon={<Assessment />}
                sx={{
                  background:
                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #059669 0%, #047857 100%)",
                  },
                }}
              >
                Generate Custom Report
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#1f2937" }}
      >
        Reports & Analytics
      </Typography>
      <Typography variant="body1" sx={{ color: "#6b7280", mb: 4 }}>
        Comprehensive reporting and analytics for your practice
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
          <Tab label="Overview" icon={<Analytics />} />
          <Tab label="Patient Reports" icon={<People />} />
          <Tab label="Analytics" icon={<Timeline />} />
          <Tab label="Custom Reports" icon={<Assignment />} />
        </Tabs>
      </Paper>

      <Box sx={{ mt: 2 }}>
        {activeTab === 0 && renderOverviewTab()}
        {activeTab === 1 && renderPatientReportsTab()}
        {activeTab === 2 && renderAnalyticsTab()}
        {activeTab === 3 && renderCustomReportsTab()}
      </Box>

      {/* Report Generation Dialog */}
      <Dialog
        open={reportDialog}
        onClose={() => setReportDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Generate {selectedReport} Report</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Your report is being generated. This may take a few moments.
          </Typography>
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Report will be available for download shortly...
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportDialog(false)}>Cancel</Button>
          <Button variant="contained" startIcon={<Download />}>
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportsContent;
