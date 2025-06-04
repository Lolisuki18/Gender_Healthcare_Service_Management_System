import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  Card,
  CardContent,
} from "@mui/material";

const stiPackages = [
  {
    id: "basic",
    name: "Gói xét nghiệm cơ bản",
    description: "Kiểm tra các bệnh truyền nhiễm phổ biến như lậu, giang mai.",
    price: "500,000 VND",
    services: [
      "Xét nghiệm lậu (Gonorrhea)",
      "Xét nghiệm giang mai (Syphilis)",
      "Xét nghiệm chlamydia",
    ],
  },
  {
    id: "full",
    name: "Gói xét nghiệm toàn diện",
    description: "Xét nghiệm toàn bộ các loại bệnh lây truyền qua đường tình dục.",
    price: "1,200,000 VND",
    services: [
      "Tất cả dịch vụ trong gói cơ bản",
      "Xét nghiệm HIV",
      "Xét nghiệm viêm gan B & C",
      "Xét nghiệm herpes simplex virus (HSV)",
      "Tư vấn với chuyên gia sức khỏe tình dục",
    ],
  },
];


const StiPage = () => {
  const [selectedPackage, setSelectedPackage] = useState("");

  const handleChange = (e) => {
    setSelectedPackage(e.target.value);
  };

  const handleRegister = () => {
    // if (!selectedPackage) {
    //   alert("Vui lòng chọn gói xét nghiệm trước khi đăng ký.");
    //   return;
    // }
    // const pkg = stiPackages.find((p) => p.id === selectedPackage);
    // alert(`Bạn đã đăng ký gói: ${pkg?.name}`);
  };

  return (
    <Box>
      {/* Banner Header */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "#fff",
          py: 10,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Đăng ký xét nghiệm STI
          </Typography>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Bảo vệ sức khỏe của bạn và người thân yêu
          </Typography>
          <Button variant="contained" color="secondary" size="large">
            Đặt lịch ngay
          </Button>
        </Container>
      </Box>

      {/* Giới thiệu & Hình ảnh */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={5} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1588776814546-ec7ee2f8e7d4?auto=format&fit=crop&w=800&q=80"
              alt="STI illustration"
              sx={{
                width: "100%",
                borderRadius: 3,
                boxShadow: 6,
                maxHeight: 400,
                objectFit: "cover",
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Tại sao cần xét nghiệm STI?
            </Typography>
            <Typography variant="body1" paragraph>
              Các bệnh lây qua đường tình dục như HIV, giang mai, lậu thường không có triệu chứng rõ ràng ban đầu nhưng có thể gây hậu quả nghiêm trọng nếu không phát hiện sớm.
            </Typography>
            <Typography variant="body1">
              Xét nghiệm định kỳ giúp phát hiện và điều trị sớm, bảo vệ sức khỏe cá nhân và cộng đồng.
            </Typography>
          </Grid>
        </Grid>
      </Container>

      {/* Chọn gói xét nghiệm */}
      <Container maxWidth="lg" sx={{ pb: 8 }}>
        <Typography variant="h4" textAlign="center" fontWeight="bold" gutterBottom>
          Các gói xét nghiệm STI
        </Typography>

        <RadioGroup value={selectedPackage} onChange={handleChange}>
          <Grid container spacing={4} justifyContent="center">
            {stiPackages.map(({ id, name, description, price }) => (
              <Grid item xs={12} sm={6} md={4} key={id}>
                <Card
                  onClick={() => setSelectedPackage(id)}
                  sx={{
                    cursor: "pointer",
                    border:
                      selectedPackage === id ? "2px solid #1976d2" : "1px solid #ddd",
                    boxShadow: selectedPackage === id ? 6 : 2,
                    transition: "0.3s",
                    borderRadius: 3,
                    "&:hover": {
                      boxShadow: 6,
                      border: "2px solid #1976d2",
                    },
                  }}
                >
                  <CardContent>
                    <FormControlLabel
                      value={id}
                      control={<Radio />}
                      label={
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
                          {description}
                        </Typography>

                        {/* Danh sách dịch vụ chi tiết */}
                        <Box component="ul" sx={{ pl: 2, mb: 1 }}>
                          {stiPackages.find(p => p.id === id)?.services.map((service, index) => (
                            <li key={index}>
                              <Typography variant="body2">{service}</Typography>
                            </li>
                          ))}
                        </Box>

                        <Typography variant="subtitle1" color="primary">
                          {price}
                        </Typography>
                      </Box>
                    }
                      sx={{ alignItems: "flex-start", width: "100%", m: 0 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </RadioGroup>

        {/* Button đăng ký */}
        <Box textAlign="center" mt={6}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleRegister}
          >
            Đăng ký gói xét nghiệm
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default StiPage;
