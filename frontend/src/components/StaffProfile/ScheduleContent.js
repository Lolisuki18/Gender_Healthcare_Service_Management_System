/**
 * ScheduleContent.js - Staff Schedule Management
 */

import React from "react";
import { Box, Card, CardContent, Typography, Grid, Chip } from "@mui/material";

const ScheduleContent = () => {
  const schedules = [
    { day: "Thứ 2", time: "08:00 - 17:00", status: "active" },
    { day: "Thứ 3", time: "08:00 - 17:00", status: "active" },
    { day: "Thứ 4", time: "08:00 - 17:00", status: "active" },
    { day: "Thứ 5", time: "08:00 - 17:00", status: "active" },
    { day: "Thứ 6", time: "08:00 - 17:00", status: "active" },
    { day: "Thứ 7", time: "Nghỉ", status: "off" },
    { day: "Chủ nhật", time: "Nghỉ", status: "off" },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: "#2D3748", mb: 1 }}
        >
          Lịch làm việc
        </Typography>
        <Typography variant="body1" sx={{ color: "#64748B" }}>
          Lịch trình làm việc trong tuần
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {schedules.map((schedule, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card
              sx={{
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(74, 144, 226, 0.08)",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
              }}
            >
              <CardContent sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {schedule.day}
                </Typography>
                <Typography variant="body1" sx={{ color: "#64748B", mb: 2 }}>
                  {schedule.time}
                </Typography>
                <Chip
                  label={schedule.status === "active" ? "Làm việc" : "Nghỉ"}
                  size="small"
                  sx={{
                    background:
                      schedule.status === "active" ? "#10B98120" : "#6B728020",
                    color: schedule.status === "active" ? "#10B981" : "#6B7280",
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ScheduleContent;
