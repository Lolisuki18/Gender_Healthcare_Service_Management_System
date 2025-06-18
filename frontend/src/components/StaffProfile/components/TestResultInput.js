import React from 'react';
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  InputAdornment,
  Chip,
  Grid,
  Paper,
  Tooltip,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

/**
 * Modern component for inputting and displaying test results
 * Supports positive/negative/indeterminate results with visual indicators
 * Includes fields for measurement values, units, and notes
 */
const TestResultInput = ({
  result,
  onChange,
  readOnly = false,
  showMeasurementFields = true,
}) => {
  // Handle changes to result properties
  const handleChange = (field) => (event) => {
    if (readOnly) return;

    const value = event.target.value;
    onChange({
      ...result,
      [field]: value,
    });
  };

  // Handle changes to result type (positive/negative/indeterminate)
  const handleResultTypeChange = (event) => {
    if (readOnly) return;

    const value = event.target.value;
    onChange({
      ...result,
      resultType: value,
      // Auto-set isPositive based on the result type
      isPositive: value === 'positive',
    });
  };

  // Define the result options and their display properties
  const resultOptions = [
    {
      value: 'positive',
      label: 'Dương tính',
      color: 'error',
      icon: <CloseIcon />,
      description: 'Kết quả xét nghiệm dương tính',
    },
    {
      value: 'negative',
      label: 'Âm tính',
      color: 'success',
      icon: <CheckIcon />,
      description: 'Kết quả xét nghiệm âm tính',
    },
    {
      value: 'indeterminate',
      label: 'Không xác định',
      color: 'warning',
      icon: <QuestionMarkIcon />,
      description: 'Kết quả xét nghiệm không xác định hoặc cần xét nghiệm lại',
    },
  ];

  // Get the current result type (default to indeterminate if not set)
  const resultType =
    result?.resultType ||
    (result?.isPositive === true
      ? 'positive'
      : result?.isPositive === false
        ? 'negative'
        : 'indeterminate');

  // Find the selected result option for display properties
  const selectedOption =
    resultOptions.find((option) => option.value === resultType) ||
    resultOptions[2];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: readOnly ? 'rgba(0,0,0,0.02)' : 'background.paper',
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Kết quả xét nghiệm
        </Typography>

        {/* Result Type Selection with Radio Buttons and Indicator Chips */}
        <FormControl component="fieldset" fullWidth disabled={readOnly}>
          <RadioGroup
            row
            name="resultType"
            value={resultType}
            onChange={handleResultTypeChange}
          >
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {resultOptions.map((option) => (
                <Grid item xs={12} sm={4} key={option.value}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      border: '1px solid',
                      borderColor:
                        resultType === option.value
                          ? `${option.color}.main`
                          : 'divider',
                      borderRadius: 2,
                      bgcolor:
                        resultType === option.value
                          ? `${option.color}.50`
                          : 'background.paper',
                      opacity:
                        readOnly && resultType !== option.value ? 0.5 : 1,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <FormControlLabel
                        value={option.value}
                        control={
                          <Radio
                            sx={{
                              color: `${option.color}.main`,
                              '&.Mui-checked': {
                                color: `${option.color}.main`,
                              },
                            }}
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body1" fontWeight={500}>
                              {option.label}
                            </Typography>
                            <Chip
                              icon={option.icon}
                              label={option.label}
                              size="small"
                              color={option.color}
                              sx={{
                                ml: 1,
                                display: { xs: 'none', sm: 'flex' },
                              }}
                            />
                          </Box>
                        }
                        sx={{ width: '100%' }}
                      />
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Display result indicator chip for the selected result */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
        <Tooltip title={selectedOption.description}>
          <Chip
            icon={selectedOption.icon}
            label={selectedOption.label}
            color={selectedOption.color}
            size="medium"
            sx={{
              px: 2,
              py: 2.5,
              fontSize: '1rem',
              '& .MuiChip-icon': { fontSize: '1.2rem' },
              fontWeight: 500,
            }}
          />
        </Tooltip>
      </Box>

      {/* Measurement Fields */}
      {showMeasurementFields && (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Giá trị đo"
              placeholder="Nhập giá trị số (nếu có)"
              value={result?.measurementValue || ''}
              onChange={handleChange('measurementValue')}
              InputProps={{
                readOnly: readOnly,
                endAdornment: result?.measurementUnit && (
                  <InputAdornment position="end">
                    {result.measurementUnit}
                  </InputAdornment>
                ),
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Đơn vị đo"
              placeholder="Ví dụ: mg/dL, mmol/L"
              value={result?.measurementUnit || ''}
              onChange={handleChange('measurementUnit')}
              InputProps={{
                readOnly: readOnly,
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phạm vi tham chiếu"
              placeholder="Ví dụ: 70-99 mg/dL"
              value={result?.referenceRange || ''}
              onChange={handleChange('referenceRange')}
              InputProps={{
                readOnly: readOnly,
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phương pháp xét nghiệm"
              placeholder="Ví dụ: Phương pháp PCR"
              value={result?.testingMethod || ''}
              onChange={handleChange('testingMethod')}
              InputProps={{
                readOnly: readOnly,
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nhận xét"
              placeholder="Nhận xét thêm về kết quả xét nghiệm"
              value={result?.comments || ''}
              onChange={handleChange('comments')}
              InputProps={{
                readOnly: readOnly,
              }}
              multiline
              rows={3}
              variant="outlined"
            />
          </Grid>
        </Grid>
      )}
    </Paper>
  );
};

export default TestResultInput;
