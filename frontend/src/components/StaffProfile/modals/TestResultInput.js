import React from 'react';
import { Box, TextField, Grid, Typography } from '@mui/material';

const TestResultInput = ({ resultComponent, onResultChange, disabled }) => {
  // Handler for updating individual fields in the component
  const handleChange = (field, value) => {
    onResultChange({
      ...resultComponent,
      [field]: value,
    });
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Thông tin kết quả xét nghiệm:
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            id="test-result-value"
            label="Giá trị kết quả"
            placeholder="Nhập kết quả xét nghiệm"
            fullWidth
            variant="outlined"
            value={resultComponent?.resultValue || ''}
            onChange={(e) => handleChange('resultValue', e.target.value)}
            disabled={disabled}
            required
            helperText={
              disabled ? 'Không thể chỉnh sửa trong trạng thái này' : 'Bắt buộc'
            }
            size="medium"
            error={disabled ? false : !resultComponent?.resultValue}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            id="test-result-unit"
            label="Đơn vị đo"
            placeholder="Ví dụ: mg/dL, mmol/L"
            fullWidth
            variant="outlined"
            value={resultComponent?.unit || ''}
            onChange={(e) => handleChange('unit', e.target.value)}
            disabled={disabled}
            required
            helperText="Đơn vị đo lường kết quả"
            size="medium"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            id="test-result-range"
            label="Khoảng tham chiếu"
            placeholder="Ví dụ: 70-100 mg/dL"
            fullWidth
            variant="outlined"
            value={
              resultComponent?.normalRange ||
              resultComponent?.referenceRange ||
              ''
            }
            onChange={(e) => handleChange('normalRange', e.target.value)}
            disabled={disabled}
            helperText="Khoảng giá trị bình thường"
            size="medium"
          />
        </Grid>

        {resultComponent?.description && (
          <Grid item xs={12}>
            <TextField
              id="test-result-notes"
              label="Ghi chú"
              placeholder="Ghi chú về kết quả xét nghiệm"
              fullWidth
              variant="outlined"
              multiline
              rows={2}
              value={resultComponent?.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              disabled={disabled}
              helperText="Thông tin bổ sung về kết quả"
              size="medium"
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default TestResultInput;
