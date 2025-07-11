import React, { useState } from "react";
import { 
  Box, 
  Button, 
  TextField, 
  Typography,
  Divider
} from "@mui/material";
import { makeStyles } from '@mui/styles';
import { CalendarToday, Timer, Loop } from '@mui/icons-material';

const useStyles = makeStyles({
  formContainer: {
    maxWidth: '100%',
    margin: '0',
    borderRadius: 20,
    boxShadow: '0 4px 24px rgba(162,89,230,0.08)',
    overflow: 'hidden',
    background: '#fff',
    border: '1px solid #f3f4f6',
    transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
    '&:hover': {
      boxShadow: '0 6px 28px rgba(162,89,230,0.1)',
      transform: 'translateY(-1px)',
    },
    '&:active': {
      transform: 'translateY(0px)',
    },
  },
  formHeader: {
    padding: '32px 32px 24px 32px',
    background: 'linear-gradient(135deg, #43a6ef 0%, #2ec7b8 100%)',
    color: '#fff',
    textAlign: 'center',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
    },
  },
  titleText: {
    fontWeight: 800,
    fontSize: '1.3rem',
    letterSpacing: 0.5,
    margin: 0,
    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },
  titleSubtext: {
    fontSize: '1rem',
    opacity: 0.95,
    marginTop: 8,
    fontWeight: 400,
    letterSpacing: 0.25,
  },
  formContent: {
    padding: '32px',
    background: '#fff',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  fieldWrapper: {
    position: 'relative',
    marginBottom: 4,
  },
  fieldLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
    fontSize: '0.97rem',
    fontWeight: 500,
    color: '#757575',
    letterSpacing: 0.1,
  },
  labelIcon: {
    fontSize: '1.25rem',
    color: '#e57399',
    filter: 'drop-shadow(0 2px 4px rgba(229, 115, 153, 0.2))',
  },
  textField: {
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#fff',
      borderRadius: 16,
      transition: 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
      border: '2px solid transparent',
      boxShadow: '0 2px 8px rgba(162,89,230,0.05)',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(162,89,230,0.1)',
        '& fieldset': {
          borderColor: 'rgba(229, 115, 153, 0.3)',
        },
      },
      '&.Mui-focused': {
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 30px rgba(162,89,230,0.15)',
        backgroundColor: '#fff',
        '& fieldset': {
          borderColor: '#e57399',
          borderWidth: 2,
        },
      },
      '& fieldset': {
        borderColor: 'rgba(229, 115, 153, 0.15)',
        transition: 'border-color 0.22s ease',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#757575',
      fontWeight: 500,
      '&.Mui-focused': {
        color: '#e57399',
        fontWeight: 600,
      },
    },
    '& .MuiOutlinedInput-input': {
      padding: '16px 18px',
      fontSize: '1rem',
      fontWeight: 400,
    },
  },
  checkboxWrapper: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: '20px',
    border: '2px solid rgba(229, 115, 153, 0.1)',
    transition: 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 2px 8px rgba(162,89,230,0.05)',
    '&:hover': {
      borderColor: 'rgba(229, 115, 153, 0.2)',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 16px rgba(162,89,230,0.08)',
    },
  },
  checkboxLabel: {
    margin: 0,
    '& .MuiCheckbox-root': {
      color: '#e57399',
      padding: '12px',
      '&.Mui-checked': {
        color: '#e57399',
      },
      '& .MuiSvgIcon-root': {
        fontSize: '1.5rem',
      },
    },
    '& .MuiFormControlLabel-label': {
      fontSize: '1rem',
      fontWeight: 500,
      color: '#757575',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      letterSpacing: 0.1,
    },
  },
  notificationIcon: {
    fontSize: '1.25rem',
    color: '#e57399',
    filter: 'drop-shadow(0 2px 4px rgba(229, 115, 153, 0.2))',
  },
  actions: {
    padding: '24px 32px 32px 32px',
    justifyContent: 'center',
    background: '#fff',
    borderTop: '1px solid #f3f4f6',
    display: 'flex',
    flexWrap: 'wrap',
    gap: 16,
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      '& button': {
        width: '100%',
      },
    },
  },
  submitButton: {
    background: 'linear-gradient(135deg, #43a6ef 0%, #2ec7b8 100%)',
    color: '#fff',
    fontWeight: 700,
    borderRadius: 14,
    padding: '16px 40px',
    fontSize: '1.1rem',
    textTransform: 'none',
    boxShadow: '0 6px 20px rgba(162,89,230,0.25)',
    transition: 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
    minWidth: 180,
    letterSpacing: 0.5,
    border: 'none',
    '&:hover': {
      background: 'linear-gradient(135deg, #43a6ef 0%, #2ec7b8 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 28px rgba(162,89,230,0.35)',
    },
    '&:active': {
      transform: 'translateY(0px)',
      boxShadow: '0 6px 20px rgba(162,89,230,0.25)',
    },
  },
  resetButton: {
    color: '#757575',
    backgroundColor: '#fff',
    fontWeight: 600,
    padding: '16px 40px',
    borderRadius: 14,
    textTransform: 'none',
    fontSize: '1.1rem',
    border: '2px solid rgba(229, 115, 153, 0.2)',
    minWidth: 180,
    letterSpacing: 0.5,
    transition: 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 16px rgba(162,89,230,0.08)',
    '&:hover': {
      backgroundColor: 'rgba(229, 115, 153, 0.05)',
      borderColor: '#e57399',
      color: '#e57399',
      transform: 'translateY(-1px)',
      boxShadow: '0 6px 20px rgba(162,89,230,0.12)',
    },
  },
  cancelButton: {
    color: '#6b7280',
    backgroundColor: '#f9fafb',
    fontWeight: 600,
    padding: '16px 40px',
    borderRadius: 14,
    textTransform: 'none',
    fontSize: '1.1rem',
    border: '2px solid #e5e7eb',
    minWidth: 180,
    letterSpacing: 0.5,
    transition: 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 16px rgba(162,89,230,0.08)',
    '&:hover': {
      backgroundColor: '#f3f4f6',
      borderColor: '#d1d5db',
      color: '#374151',
      transform: 'translateY(-1px)',
      boxShadow: '0 6px 20px rgba(162,89,230,0.12)',
    },
  },
  divider: {
    margin: '20px 0',
    background: 'linear-gradient(90deg, transparent 0%, rgba(229, 115, 153, 0.3) 20%, rgba(229, 115, 153, 0.6) 50%, rgba(229, 115, 153, 0.3) 80%, transparent 100%)',
    height: 2,
    border: 'none',
    borderRadius: 1,
  },
  helpText: {
    fontSize: '0.875rem',
    color: '#757575',
    marginTop: 8,
    fontStyle: 'italic',
    fontWeight: 400,
    letterSpacing: 0.1,
    lineHeight: 1.4,
  },
  warningText: {
    fontSize: '0.875rem',
    color: '#f59e0b',
    marginTop: 8,
    fontWeight: 500,
    letterSpacing: 0.1,
    lineHeight: 1.4,
    padding: '8px 12px',
    backgroundColor: '#fffbeb',
    border: '1px solid #fed7aa',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
});

const MenstrualCycleForm = ({ onSubmit, onCancel, initialData = null, isEditMode = false }) => {
  const classes = useStyles();
  const [form, setForm] = useState({
    startDate: "",
    numberOfDays: "",
    cycleLength: "",
  });
  const [dateError, setDateError] = useState("");
  const [warnings, setWarnings] = useState({
    numberOfDays: "",
    cycleLength: "",
  });

  // Initialize form with initialData when in edit mode
  React.useEffect(() => {
    if (isEditMode && initialData) {
      // Format date for input field (YYYY-MM-DD)
      const formatDateForInput = (date) => {
        if (date instanceof Date) {
          return date.toISOString().split('T')[0];
        }
        return "";
      };

      setForm({
        startDate: formatDateForInput(initialData.startDate),
        numberOfDays: initialData.numberOfDays || "",
        cycleLength: initialData.cycleLength || "",
      });
      
      // Check for warnings with initial data
      if (initialData.numberOfDays && initialData.cycleLength) {
        checkAllWarnings(initialData.numberOfDays, initialData.cycleLength);
      }
    }
  }, [isEditMode, initialData]);

  // Hàm kiểm tra dữ liệu bất thường cho cả hai field
  const checkAllWarnings = (numberOfDaysValue, cycleLengthValue) => {
    const newWarnings = {
      numberOfDays: "",
      cycleLength: "",
    };
    
    const days = Number(numberOfDaysValue);
    const length = Number(cycleLengthValue);
    
    // Kiểm tra số ngày hành kinh
    if (days > 0) {
      if (days === 1) {
        newWarnings.numberOfDays = "⚠️ Kỳ kinh chỉ 1 ngày là rất bất thường, nên tham khảo bác sĩ";
      } else if (days < 3) {
        newWarnings.numberOfDays = "⚠️ Kỳ kinh ngắn hơn 3 ngày có thể không bình thường";
      } else if (days > 7) {
        newWarnings.numberOfDays = "⚠️ Kỳ kinh dài hơn 7 ngày có thể không bình thường";
      }
    }
    
    // Kiểm tra độ dài chu kỳ
    if (length > 0) {
      if (length < 15) {
        newWarnings.cycleLength = "⚠️ Chu kỳ quá ngắn, có thể không đúng hoặc cần khám bác sĩ";
      } else if (length < 21) {
        newWarnings.cycleLength = "⚠️ Chu kỳ ngắn hơn 21 ngày có thể không bình thường";
      } else if (length > 35 && length <= 90) {
        newWarnings.cycleLength = "⚠️ Chu kỳ dài hơn 35 ngày có thể không bình thường";
      } else if (length > 90) {
        newWarnings.cycleLength = "⚠️ Chu kỳ quá dài, có thể không đúng hoặc cần khám bác sĩ";
      }
    }
    
    // Kiểm tra cross-field validation
    if (days > 0 && length > 0 && days > length) {
      newWarnings.numberOfDays = "⚠️ Số ngày hành kinh không thể dài hơn chu kỳ";
    }
    
    setWarnings(newWarnings);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Validate start date - chỉ cho phép nhập ngày trong quá khứ, không cho phép ngày hôm nay
    if (name === "startDate" && value) {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to beginning of today for comparison
      
      if (selectedDate >= today) {
        setDateError("Ngày bắt đầu chu kỳ chỉ có thể là ngày trong quá khứ");
        return; // Don't update form if date is invalid
      } else {
        setDateError(""); // Clear error if date is valid
      }
    }
    
    // Update form first
    const updatedForm = {
      ...form,
      [name]: type === "checkbox" ? checked : value,
    };
    
    setForm(updatedForm);
    
    // Kiểm tra cảnh báo cho dữ liệu bất thường chỉ khi thay đổi numberOfDays hoặc cycleLength
    if (name === "numberOfDays" || name === "cycleLength") {
      // Use the updated values to check warnings
      const numberOfDaysValue = name === "numberOfDays" ? value : updatedForm.numberOfDays;
      const cycleLengthValue = name === "cycleLength" ? value : updatedForm.cycleLength;
      
      checkAllWarnings(numberOfDaysValue, cycleLengthValue);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prevent submission if there's a date error
    if (dateError) {
      return;
    }
    
    onSubmit({
      ...form,
      numberOfDays: Number(form.numberOfDays),
      cycleLength: Number(form.cycleLength),
    });
    setForm({
      startDate: "",
      numberOfDays: "",
      cycleLength: "",
    });
    setDateError(""); // Clear error on successful submit
    setWarnings({
      numberOfDays: "",
      cycleLength: "",
    }); // Clear warnings on successful submit
  };

  const handleReset = () => {
    setForm({
      startDate: "",
      numberOfDays: "",
      cycleLength: "",
    });
    setDateError(""); // Clear date error when resetting
    setWarnings({
      numberOfDays: "",
      cycleLength: "",
    }); // Clear warnings when resetting
  };

  return (
    <Box className={classes.formContainer}>
      {/* Header */}
      <Box className={classes.formHeader}>
        <Typography className={classes.titleText}>
          {isEditMode ? 'Cập nhật chu kỳ' : 'Ghi nhận chu kỳ mới'}
        </Typography>
        <Typography className={classes.titleSubtext}>
          {isEditMode ? 'Chỉnh sửa thông tin chu kỳ kinh nguyệt' : 'Cập nhật thông tin chu kỳ kinh nguyệt của bạn'}
        </Typography>
      </Box>

      {/* Form Content */}
      <form onSubmit={handleSubmit}>
        <Box className={classes.formContent}>
          <Box className={classes.form}>
            {/* Ngày bắt đầu */}
            <Box className={classes.fieldWrapper}>
              <Typography className={classes.fieldLabel}>
                <CalendarToday className={classes.labelIcon} />
                Ngày bắt đầu chu kỳ
              </Typography>
              <TextField
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                fullWidth
                required
                className={classes.textField}
                placeholder="Chọn ngày bắt đầu"
                inputProps={{ 
                  max: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Chỉ cho phép chọn ngày trước hôm nay
                }}
                error={!!dateError}
                helperText={dateError}
              />
              {!dateError && (
                <Typography className={classes.helpText}>
                  Ngày đầu tiên của kỳ kinh nguyệt (chỉ có thể chọn ngày trong quá khứ)
                </Typography>
              )}
            </Box>

            <Divider className={classes.divider} />

            {/* Số ngày hành kinh */}
            <Box className={classes.fieldWrapper}>
              <Typography className={classes.fieldLabel}>
                <Timer className={classes.labelIcon} />
                Số ngày hành kinh
              </Typography>
              <TextField
                type="number"
                name="numberOfDays"
                value={form.numberOfDays}
                onChange={handleChange}
                fullWidth
                required
                inputProps={{ min: 1, max: 30 }}
                className={classes.textField}
                placeholder="Ví dụ: 5"
              />
              {warnings.numberOfDays ? (
                <Typography className={classes.warningText}>
                  {warnings.numberOfDays}
                </Typography>
              ) : (
                <Typography className={classes.helpText}>
                  Thường từ 3-7 ngày
                </Typography>
              )}
            </Box>

            {/* Độ dài chu kỳ */}
            <Box className={classes.fieldWrapper}>
              <Typography className={classes.fieldLabel}>
                <Loop className={classes.labelIcon} />
                Độ dài chu kỳ (ngày)
              </Typography>
              <TextField
                type="number"
                name="cycleLength"
                value={form.cycleLength}
                onChange={handleChange}
                fullWidth
                required
                inputProps={{ min: 1, max: 90 }}
                className={classes.textField}
                placeholder="Ví dụ: 28"
              />
              {warnings.cycleLength ? (
                <Typography className={classes.warningText}>
                  {warnings.cycleLength}
                </Typography>
              ) : (
                <Typography className={classes.helpText}>
                  Khoảng cách từ ngày đầu kỳ này đến ngày đầu kỳ trước
                </Typography>
              )}
            </Box>

            <Divider className={classes.divider} />


        </Box>

        {/* Thông báo tổng hợp về dữ liệu bất thường */}
        {(warnings.numberOfDays || warnings.cycleLength) && (
          <Box 
            sx={{
              marginTop: 3,
              padding: '16px',
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '12px',
              color: '#856404',
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                fontSize: '1rem', 
                fontWeight: 600, 
                marginBottom: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              ⚠️ Lưu ý về dữ liệu
            </Typography>
            <Typography sx={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
              Dữ liệu bạn nhập có một số điểm bất thường. Điều này có thể bình thường đối với một số người, 
              nhưng nếu bạn lo lắng, hãy tham khảo ý kiến bác sĩ chuyên khoa để được tư vấn chính xác.
            </Typography>
          </Box>
        )}
      </Box>

        {/* Actions */}
        <Box className={classes.actions}>
          {onCancel && (
            <Button 
              onClick={onCancel}
              className={classes.cancelButton}
              variant="outlined"
            >
              Hủy
            </Button>
          )}
          <Button 
            onClick={handleReset} 
            className={classes.resetButton}
            variant="outlined"
          >
            Đặt lại
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            className={classes.submitButton}
          >
            {isEditMode ? 'Cập nhật chu kỳ' : 'Tính toán'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default MenstrualCycleForm;