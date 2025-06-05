/**
 * ServicesContent.js - Staff Services Management
 */

import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Avatar,
} from "@mui/material";
import {
  LocalHospital as HospitalIcon,
  Healing as HealingIcon,
  Psychology as PsychologyIcon,
} from "@mui/icons-material";

const ServicesContent = () => {
  const services = [
    {
      id: 1,
      name: "Khám tổng quát",
      description: "Khám sức khỏe định kỳ và tư vấn",
      price: "200,000 VNĐ",
      status: "active",
      icon: HospitalIcon,
    },
    {
      id: 2,
      name: "Siêu âm thai",
      description: "Siêu âm theo dõi thai nhi",
      price: "300,000 VNĐ",
      status: "active",
      icon: HealingIcon,
    },
    {
      id: 3,
      name: "Tư vấn tâm lý",
      description: "Tư vấn sức khỏe tâm lý",
      price: "250,000 VNĐ",
      status: "active",
      icon: PsychologyIcon,
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: "#2D3748", mb: 1 }}
        >
          Dịch vụ y tế
        </Typography>
        <Typography variant="body1" sx={{ color: "#64748B" }}>
          Danh sách các dịch vụ y tế có sẵn
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {services.map((service) => (
          <Grid item xs={12} md={6} lg={4} key={service.id}>
            <Card
              sx={{
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(74, 144, 226, 0.08)",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    sx={{
                      background: "linear-gradient(135deg, #4A90E2, #1ABC9C)",
                      mr: 2,
                    }}
                  >
                    <service.icon />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "#2D3748" }}
                    >
                      {service.name}
                    </Typography>
                    <Chip
                      label="Đang hoạt động"
                      size="small"
                      sx={{
                        background: "#10B98120",
                        color: "#10B981",
                        mt: 0.5,
                      }}
                    />
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: "#64748B", mb: 2 }}>
                  {service.description}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: "#4A90E2", fontWeight: 600 }}
                >
                  {service.price}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ServicesContent;
