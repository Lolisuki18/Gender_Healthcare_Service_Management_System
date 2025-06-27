import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Alert,
} from '@mui/material';
import { bookSTITest } from '@/services/stiService';

// ===== COMPONENT THANH TOÁN VÀ ĐẶT LỊCH =====
// Component này xử lý việc chọn phương thức thanh toán và gửi yêu cầu đặt lịch khám
const PaymentSection = ({
  selectedService,  // Dịch vụ được chọn
  selectedDate,     // Ngày khám được chọn
  selectedTime,     // Giờ khám được chọn
  note,            // Ghi chú từ người dùng
  onSuccess,       // Callback khi đặt lịch thành công
}) => {
  // ===== CÁC STATE QUẢN LÝ TRẠNG THÁI COMPONENT =====
  const [paymentMethod, setPaymentMethod] = useState('cash'); // Phương thức thanh toán được chọn (mặc định: tiền mặt)
  
  // State cho thông tin thẻ Visa/Master
  const [visaInfo, setVisaInfo] = useState({
    cardNumber: '',  // Số thẻ (16 chữ số)
    cardName: '',    // Tên chủ thẻ
    expiry: '',      // Ngày hết hạn (MM/YY)
    cvv: '',         // Mã CVV (3-4 chữ số)
  });
  
  const [visaErrors, setVisaErrors] = useState({}); // Lỗi validation cho thông tin thẻ
  const [openVisaDialog, setOpenVisaDialog] = useState(false); // Điều khiển dialog nhập thông tin thẻ
  const [openBankDialog, setOpenBankDialog] = useState(false); // Điều khiển dialog thông tin chuyển khoản
  const [loading, setLoading] = useState(false); // Trạng thái đang xử lý booking
  const [error, setError] = useState(''); // Thông báo lỗi khi booking thất bại

  // ===== HÀM XỬ LÝ THAY ĐỔI PHƯƠNG THỨC THANH TOÁN =====
  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
    
    // Mở dialog tương ứng khi chọn phương thức cần nhập thông tin
    if (event.target.value === 'visa') {
      setOpenVisaDialog(true); // Mở dialog nhập thông tin thẻ
    } else if (event.target.value === 'bank') {
      setOpenBankDialog(true); // Mở dialog thông tin chuyển khoản
    }
  };

  // ===== HÀM VALIDATION THÔNG TIN THẺ VISA =====
  // Kiểm tra tính hợp lệ của các thông tin thẻ tín dụng
  const validateVisaInfo = () => {
    const errors = {};
    
    // Kiểm tra số thẻ: phải là 16 chữ số
    if (!/^[0-9]{16}$/.test(visaInfo.cardNumber)) {
      errors.cardNumber = 'Số thẻ không hợp lệ (phải có 16 chữ số)';
    }
    
    // Kiểm tra tên chủ thẻ: không được để trống
    if (!visaInfo.cardName.trim()) {
      errors.cardName = 'Vui lòng nhập tên chủ thẻ';
    }
    
    // Kiểm tra ngày hết hạn: định dạng MM/YY
    if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(visaInfo.expiry)) {
      errors.expiry = 'Định dạng MM/YY không hợp lệ (ví dụ: 12/25)';
    }
    
    // Kiểm tra mã CVV: 3-4 chữ số
    if (!/^[0-9]{3,4}$/.test(visaInfo.cvv)) {
      errors.cvv = 'CVV không hợp lệ (3-4 chữ số)';
    }
    
    return errors;
  };

  // ===== HÀM XỬ LÝ SUBMIT THÔNG TIN THẺ VISA =====
  const handleVisaSubmit = () => {
    const errors = validateVisaInfo(); // Validate thông tin thẻ
    
    if (Object.keys(errors).length === 0) {
      // Nếu không có lỗi, đóng dialog và tiến hành booking
      setOpenVisaDialog(false);
      handleBooking('VISA');
    } else {
      // Nếu có lỗi, hiển thị thông báo lỗi
      setVisaErrors(errors);
    }
  };

  // ===== HÀM XỬ LÝ XÁC NHẬN CHUYỂN KHOẢN =====
  const handleBankConfirm = () => {
    setOpenBankDialog(false); // Đóng dialog
    handleBooking('BANK_TRANSFER'); // Tiến hành booking với phương thức chuyển khoản
  };

  // ===== HÀM XỬ LÝ ĐẶT LỊCH CHÍNH =====
  // Hàm này gửi yêu cầu đặt lịch khám lên server
  const handleBooking = async (paymentMethodApi) => {
    try {
      setLoading(true); // Bật trạng thái loading
      setError(''); // Reset lỗi cũ

      // ===== CHUẨN BỊ DỮ LIỆU GỬI LÊN SERVER =====
      const bookingData = {
        serviceId: selectedService.id,           // ID dịch vụ
        date: selectedDate.toISOString(),        // Ngày khám (chuyển sang ISO string)
        time: selectedTime,                      // Giờ khám
        note,                                    // Ghi chú
        paymentMethod: paymentMethodApi,         // Phương thức thanh toán
        // Chỉ gửi thông tin thẻ khi thanh toán bằng VISA
        ...(paymentMethodApi === 'VISA' && { visaInfo }),
      };

      // ===== GỬI REQUEST LÊN SERVER =====
      const response = await bookSTITest(bookingData);
      
      if (response.success) {
        // Nếu thành công, gọi callback onSuccess
        onSuccess(response.message);
      } else {
        // Nếu thất bại, hiển thị thông báo lỗi
        setError(response.message || 'Đã có lỗi xảy ra khi đặt lịch');
      }
    } catch (err) {
      // Xử lý lỗi khi gọi API
      console.error('Booking error:', err);
      setError(err.message || 'Đã có lỗi xảy ra khi đặt lịch');
    } finally {
      setLoading(false); // Tắt trạng thái loading
    }
  };

  // ===== GIAO DIỆN COMPONENT =====
  return (
    <Box sx={{ 
      backgroundColor: '#f8faff', // Nền xanh rất nhạt
      borderRadius: 3, // Bo góc 24px
      p: 3 // Padding 24px
    }}>
      
      {/* ===== TIÊU ĐỀ PHẦN THANH TOÁN ===== */}
      <Typography 
        variant="h5" 
        sx={{ 
          mb: 4, // Margin bottom 32px
          fontWeight: 600,
          color: 'primary.main', // Màu chủ đạo của theme
          textAlign: 'center'
        }}
      >
        Chọn phương thức thanh toán
      </Typography>

      {/* ===== HIỂN THỊ THÔNG BÁO LỖI ===== */}
      {/* Chỉ hiển thị khi có lỗi xảy ra */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: 2, // Bo góc 16px
            '& .MuiAlert-icon': {
              fontSize: '1.5rem' // Icon lớn hơn
            }
          }}
        >
          {error}
        </Alert>
      )}

      {/* ===== KHUNG CHỨA CÁC OPTION THANH TOÁN ===== */}
      <Box sx={{ 
        backgroundColor: 'white', // Nền trắng
        borderRadius: 2, // Bo góc 16px
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)', // Đổ bóng nhẹ
        p: 3 // Padding 24px
      }}>
        
        {/* ===== RADIO GROUP CÁC PHƯƠNG THỨC THANH TOÁN ===== */}
        <RadioGroup 
          value={paymentMethod} 
          onChange={handlePaymentMethodChange}
          sx={{
            // Style cho từng FormControlLabel
            '& .MuiFormControlLabel-root': {
              mb: 2, // Margin bottom giữa các option
              mx: 1, // Margin horizontal
              '&:last-child': {
                mb: 0 // Option cuối không có margin bottom
              }
            },
            // Style cho radio button
            '& .MuiRadio-root': {
              color: 'primary.main', // Màu chủ đạo
              '&.Mui-checked': {
                color: 'primary.main' // Màu khi được chọn
              }
            }
          }}
        >
          {/* ===== OPTION 1: TIỀN MẶT ===== */}
          <FormControlLabel 
            value="cash" 
            control={<Radio />} 
            label={
              <Typography sx={{ fontWeight: 500 }}>
                💵 Thanh toán tiền mặt tại phòng khám
              </Typography>
            } 
          />
          
          {/* ===== OPTION 2: THẺ TÍN DỤNG ===== */}
          <FormControlLabel 
            value="visa" 
            control={<Radio />} 
            label={
              <Typography sx={{ fontWeight: 500 }}>
                💳 Thanh toán bằng thẻ Visa/Master
              </Typography>
            }
          />
          
          {/* ===== OPTION 3: CHUYỂN KHOẢN ===== */}
          <FormControlLabel 
            value="bank" 
            control={<Radio />} 
            label={
              <Typography sx={{ fontWeight: 500 }}>
                🏦 Chuyển khoản ngân hàng
              </Typography>
            }
          />
        </RadioGroup>
      </Box>

      {/* ===== DIALOG NHẬP THÔNG TIN THẺ VISA ===== */}
      {/* Dialog này mở khi người dùng chọn thanh toán bằng thẻ */}
      <Dialog open={openVisaDialog} onClose={() => setOpenVisaDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 600 }}>
          💳 Nhập thông tin thẻ tín dụng
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            
            {/* ===== FIELD SỐ THẺ ===== */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Số thẻ *"
                placeholder="1234 5678 9012 3456"
                value={visaInfo.cardNumber}
                onChange={(e) => {
                  // Chỉ cho phép nhập số và giới hạn 16 ký tự
                  const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                  setVisaInfo({ ...visaInfo, cardNumber: value });
                }}
                error={!!visaErrors.cardNumber}
                helperText={visaErrors.cardNumber}
                inputProps={{ maxLength: 16 }}
              />
            </Grid>
            
            {/* ===== FIELD TÊN CHỦ THẺ ===== */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên chủ thẻ *"
                placeholder="NGUYEN VAN A"
                value={visaInfo.cardName}
                onChange={(e) => setVisaInfo({ ...visaInfo, cardName: e.target.value.toUpperCase() })}
                error={!!visaErrors.cardName}
                helperText={visaErrors.cardName}
              />
            </Grid>
            
            {/* ===== FIELD NGÀY HẾT HẠN ===== */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Hạn thẻ *"
                placeholder="MM/YY"
                value={visaInfo.expiry}
                onChange={(e) => {
                  // Format tự động MM/YY
                  let value = e.target.value.replace(/\D/g, '');
                  if (value.length >= 2) {
                    value = value.slice(0, 2) + '/' + value.slice(2, 4);
                  }
                  setVisaInfo({ ...visaInfo, expiry: value });
                }}
                error={!!visaErrors.expiry}
                helperText={visaErrors.expiry}
                inputProps={{ maxLength: 5 }}
              />
            </Grid>
            
            {/* ===== FIELD CVV ===== */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="CVV *"
                placeholder="123"
                value={visaInfo.cvv}
                onChange={(e) => {
                  // Chỉ cho phép nhập số và giới hạn 4 ký tự
                  const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setVisaInfo({ ...visaInfo, cvv: value });
                }}
                error={!!visaErrors.cvv}
                helperText={visaErrors.cvv}
                inputProps={{ maxLength: 4 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => {
              setOpenVisaDialog(false);
              setPaymentMethod('cash'); // Reset về tiền mặt nếu hủy
            }}
          >
            Hủy
          </Button>
          <Button onClick={handleVisaSubmit} variant="contained">
            Xác nhận thanh toán
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== DIALOG THÔNG TIN CHUYỂN KHOẢN NGÂN HÀNG ===== */}
      {/* Dialog này hiển thị thông tin tài khoản để người dùng chuyển khoản */}
      <Dialog 
        open={openBankDialog} 
        onClose={() => {
          setOpenBankDialog(false);
          setPaymentMethod('cash'); // Reset về tiền mặt nếu đóng dialog
        }}
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 600 }}>
          🏦 Thông tin chuyển khoản ngân hàng
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {/* Hướng dẫn chuyển khoản */}
          <Typography variant="body1" gutterBottom sx={{ fontWeight: 500, color: 'primary.main' }}>
            Vui lòng chuyển khoản theo thông tin sau:
          </Typography>
          
          {/* ===== THÔNG TIN TÀI KHOẢN NGÂN HÀNG ===== */}
          <Box sx={{ 
            backgroundColor: '#f8faff', 
            borderRadius: 2, 
            p: 2, 
            mt: 2,
            border: '1px solid rgba(33, 150, 243, 0.2)'
          }}>
            <Typography variant="body2" sx={{ lineHeight: 2, fontFamily: 'monospace' }}>
              <strong>🏛️ Ngân hàng:</strong> VietinBank
              <br />
              <strong>💳 Số tài khoản:</strong> 123456789
              <br />
              <strong>👤 Chủ tài khoản:</strong> CÔNG TY TNHH DỊCH VỤ Y TẾ ABC
              <br />
              <strong>📝 Nội dung:</strong> XN_[Họ tên]_[Số điện thoại]
            </Typography>
          </Box>
          
          {/* Lưu ý quan trọng */}
          <Typography variant="caption" sx={{ 
            mt: 2, 
            display: 'block', 
            color: 'error.main',
            fontStyle: 'italic' 
          }}>
            ⚠️ Lưu ý: Vui lòng ghi đúng nội dung chuyển khoản để chúng tôi có thể xác nhận thanh toán nhanh chóng
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => {
              setOpenBankDialog(false);
              setPaymentMethod('cash'); // Reset về tiền mặt nếu hủy
            }}
          >
            Hủy
          </Button>
          <Button onClick={handleBankConfirm} variant="contained">
            ✅ Tôi đã chuyển khoản
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== NÚT XÁC NHẬN ĐẶT LỊCH ===== */}
      {/* Nút chính để hoàn tất quá trình đặt lịch khám */}
      <Button
        variant="contained"
        onClick={() => handleBooking(
          // Chuyển đổi giá trị paymentMethod sang format API
          paymentMethod === 'cash' ? 'CASH' :           // Tiền mặt
          paymentMethod === 'visa' ? 'VISA' :           // Thẻ tín dụng  
          'BANK_TRANSFER'                               // Chuyển khoản
        )}
        disabled={loading} // Vô hiệu hóa khi đang xử lý
        sx={{ 
          mt: 3, // Margin top 24px
          width: '100%', // Chiếm toàn bộ chiều rộng
          py: 1.5, // Padding vertical để nút cao hơn
          fontSize: '1.1rem', // Chữ lớn hơn
          fontWeight: 600,
          borderRadius: 2, // Bo góc 16px
          boxShadow: loading ? 'none' : '0 4px 12px rgba(33, 150, 243, 0.3)', // Đổ bóng khi không loading
          '&:hover': {
            boxShadow: loading ? 'none' : '0 6px 16px rgba(33, 150, 243, 0.4)', // Đổ bóng đậm hơn khi hover
          }
        }}
      >
        {/* Text thay đổi tùy theo trạng thái loading */}
        {loading ? '⏳ Đang xử lý...' : '🎯 Xác nhận đặt lịch khám'}
      </Button>
    </Box>
  );
};

// ===== ĐỊNH NGHĨA PROP TYPES =====
// Xác định kiểu dữ liệu cho các props để đảm bảo tính chính xác và dễ debug
PaymentSection.propTypes = {
  selectedService: PropTypes.object.isRequired,       // Dịch vụ được chọn (bắt buộc, object)
  selectedDate: PropTypes.instanceOf(Date).isRequired, // Ngày khám (bắt buộc, Date object)
  selectedTime: PropTypes.string.isRequired,           // Giờ khám (bắt buộc, string như "14:30")
  note: PropTypes.string.isRequired,                   // Ghi chú (bắt buộc, có thể là string rỗng)
  onSuccess: PropTypes.func.isRequired,                // Callback khi đặt lịch thành công (bắt buộc, function)
};

// Export component để sử dụng ở các file khác
export default PaymentSection;
