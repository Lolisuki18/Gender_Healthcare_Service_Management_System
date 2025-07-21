import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { getConclusionOptions } from '../../../services/stiService';
import api from '../../../services/api';

const MEDICAL_GRADIENT = 'linear-gradient(45deg, #4A90E2, #1ABC9C)';
const FONT_FAMILY = '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif';

const TestResultInputModal = ({
  open,
  onClose,
  test,
  components = [],
  onSaveAll,
  onComplete,
  loading = false,
  error = null,
  success = null,
  isPackage = false,
  packageServices = [],
  selectedService = null,
  onSelectService = () => {},
}) => {
  const [resultsMap, setResultsMap] = useState({});
  const [touchedMap, setTouchedMap] = useState({});
  const [results, setResults] = useState([]);
  const [touched, setTouched] = useState({});
  const [conclusionOptions, setConclusionOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [consultants, setConsultants] = useState([]);
  const [selectedConsultantId, setSelectedConsultantId] = useState('');
  const [assigningConsultant, setAssigningConsultant] = useState(false);
  const [assignSuccess, setAssignSuccess] = useState('');

  // Load conclusion options
  useEffect(() => {
    const loadConclusionOptions = async () => {
      try {
        setLoadingOptions(true);
        const response = await getConclusionOptions();
        if (response.success && response.data) {
          setConclusionOptions(response.data);
        }
      } catch (error) {
        console.error('Error loading conclusion options:', error);
        // Fallback to default options
        setConclusionOptions([
          { value: 'INFECTED', label: 'Bị nhiễm' },
          { value: 'NOT_INFECTED', label: 'Không bị nhiễm' },
          { value: 'ABNORMAL', label: 'Bất thường' },
        ]);
      } finally {
        setLoadingOptions(false);
      }
    };

    if (open) {
      loadConclusionOptions();
    }
  }, [open]);

  useEffect(() => {
    const initializeState = (serviceId, componentsToMap) => {
      // Create a map of existing results by componentId for quick lookup
      const existingResultsMap = new Map();
      if (test?.testResults && Array.isArray(test.testResults)) {
        test.testResults.forEach((res) => {
          if (res.componentId != null) {
            existingResultsMap.set(res.componentId, res);
          }
        });
      }

      let newResults;
      if (isPackage && serviceId && resultsMap[serviceId]) {
        // Nếu đã có dữ liệu nhập tạm thời thì ưu tiên lấy lại
        newResults = resultsMap[serviceId];
      } else {
        newResults = componentsToMap.map((comp) => {
          const componentId = comp.componentId || comp.id;
          const existingResult = existingResultsMap.get(componentId);
          return {
            componentId: componentId,
            resultValue: existingResult?.resultValue || comp.resultValue || '',
            unit: comp.unit || '',
            normalRange: comp.normalRange || comp.referenceRange || '',
            conclusion:
              existingResult && typeof existingResult.conclusion === 'string'
                ? existingResult.conclusion
                : '',
          };
        });
      }

      if (isPackage) {
        setResultsMap((prev) => ({ ...prev, [serviceId]: newResults }));
        setTouchedMap((prev) => ({ ...prev, [serviceId]: {} }));
      } else {
        setResults(newResults);
        setTouched({});
      }
    };

    if (isPackage && selectedService && selectedService.id) {
      initializeState(selectedService.id, components);
    } else if (!isPackage && components && components.length > 0) {
      initializeState(null, components);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [components, open, isPackage, selectedService, test?.testResults]);

  // Lấy danh sách consultant khi mở modal nếu cần
  useEffect(() => {
    if (open && test?.status === 'RESULTED') {
      api.get('/consultants').then((res) => {
        setConsultants(res.data?.data || []);
        // Nếu đã có consultantId thì set luôn
        if (test?.consultantId) {
          setSelectedConsultantId(test.consultantId);
        }
      });
    }
  }, [open, test]);

  const handleChange = (idx, field, value) => {
    if (isPackage && selectedService && selectedService.id) {
      const svcId = selectedService.id;
      setResultsMap((prev) => ({
        ...prev,
        [svcId]: prev[svcId].map((r, i) =>
          i === idx ? { ...r, [field]: value } : r
        ),
      }));
      setTouchedMap((prev) => ({
        ...prev,
        [svcId]: { ...prev[svcId], [idx]: true },
      }));
    } else {
      setResults((prev) =>
        prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r))
      );
      setTouched((prev) => ({ ...prev, [idx]: true }));
    }
  };

  const handleSaveAll = () => {
    if (onSaveAll) {
      let finalResults = [];
      if (isPackage) {
        // Gộp toàn bộ kết quả của mọi service trong package
        Object.values(resultsMap).forEach((serviceResults) => {
          finalResults = finalResults.concat(serviceResults);
        });
      } else {
        finalResults = results;
      }

      // Safeguard: Đảm bảo không có componentId trùng lặp được gửi đi
      const uniqueResults = Array.from(
        finalResults
          .reduce((map, item) => map.set(item.componentId, item), new Map())
          .values()
      );

      // if (isPackage && selectedService && selectedService.id) {
      //   onSaveAll({
      //     status: 'RESULTED',
      //     results: uniqueResults,
      //     serviceId: selectedService.id,
      //   });
      // } else {
      //   onSaveAll({
      //     status: 'RESULTED',
      //     results: uniqueResults,
      //   });
      // }
      onSaveAll({
        status: 'RESULTED',
        results: uniqueResults,
      });
    }
  };

  const handleComplete = () => {
    if (onComplete) {
      let finalResults = [];
      if (isPackage) {
        // Tổng hợp tất cả kết quả của mọi service trong package
        Object.values(resultsMap).forEach((serviceResults) => {
          finalResults = finalResults.concat(serviceResults);
        });
      } else {
        finalResults = results;
      }

      // Safeguard: Đảm bảo không có componentId trùng lặp được gửi đi
      const uniqueResults = Array.from(
        finalResults
          .reduce((map, item) => map.set(item.componentId, item), new Map())
          .values()
      );

      if (isPackage) {
        onComplete({
          status: 'COMPLETED',
          results: uniqueResults,
        });
      } else {
        onComplete({
          status: 'COMPLETED',
          results: uniqueResults,
        });
      }
    }
  };

  const handleSelectService = (svc) => {
    if (isPackage && selectedService && selectedService.id) {
      // Lưu lại kết quả đang nhập cho service hiện tại vào resultsMap
      setResultsMap((prev) => ({
        ...prev,
        [selectedService.id]: resultsMap[selectedService.id] || results,
      }));
    }
    onSelectService(svc);
  };

  // Hàm gán consultant cho test
  const handleAssignConsultant = async () => {
    if (!selectedConsultantId) return;
    setAssigningConsultant(true);
    try {
      await api.put(`/sti-services/tests/${test.testId}/assign-consultant`, {
        consultantId: selectedConsultantId,
      });
      // Cập nhật lại test.consultantId trong state, không reload trang
      if (onClose) {
        // Nếu muốn đóng modal sau khi chọn, gọi onClose()
        // onClose();
      }
      // Cập nhật lại test trong modal để phản ánh consultant mới
      test.consultantId = selectedConsultantId;
      setSelectedConsultantId(selectedConsultantId);
      setAssignSuccess('Đã chọn Tư Vấn Viên thành công!');
      setTimeout(() => setAssignSuccess(''), 2500);
    } catch (err) {
      alert('Gán consultant thất bại!');
    } finally {
      setAssigningConsultant(false);
    }
  };

  const renderServiceCards = () => {
    if (!isPackage || !packageServices || packageServices.length === 0)
      return null;
    return (
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}
        >
          Chọn dịch vụ trong gói
        </Typography>
        <Grid container spacing={2}>
          {packageServices.map((svc) => {
            const isSelected = selectedService && selectedService.id === svc.id;
            return (
              <Grid item xs={12} sm={6} md={4} key={svc.id}>
                <Card
                  elevation={isSelected ? 8 : 1}
                  sx={{
                    borderRadius: 2,
                    border: isSelected
                      ? `2px solid ${MEDICAL_GRADIENT}`
                      : '1px solid #e2e8f0',
                    boxShadow: isSelected
                      ? '0 6px 20px rgba(74,144,226,0.2)'
                      : 'none',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    },
                  }}
                  onClick={() => handleSelectService(svc)}
                >
                  <CardActionArea sx={{ p: 2 }}>
                    <CardContent sx={{ p: 0 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: isSelected ? '#4A90E2' : '#1e293b',
                          fontFamily: FONT_FAMILY,
                        }}
                      >
                        {svc.name || svc.serviceName}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  };

  const renderContent = () => {
    if (isPackage && !selectedService) {
      return (
        <Alert severity="info" sx={{ mt: 2 }}>
          Vui lòng chọn một dịch vụ từ danh sách trên để nhập kết quả.
        </Alert>
      );
    }
    return (
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(74,144,226,0.10)',
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ background: MEDICAL_GRADIENT }}>
              <TableCell
                sx={{
                  color: '#fff',
                  fontWeight: 700,
                  fontFamily: FONT_FAMILY,
                }}
              >
                Tên thành phần
              </TableCell>
              <TableCell
                sx={{
                  color: '#fff',
                  fontWeight: 700,
                  fontFamily: FONT_FAMILY,
                }}
              >
                Kết quả
              </TableCell>
              <TableCell
                sx={{
                  color: '#fff',
                  fontWeight: 700,
                  fontFamily: FONT_FAMILY,
                }}
              >
                Đơn vị
              </TableCell>
              <TableCell
                sx={{
                  color: '#fff',
                  fontWeight: 700,
                  fontFamily: FONT_FAMILY,
                }}
              >
                Khoảng bình thường
              </TableCell>
              <TableCell
                sx={{
                  color: '#fff',
                  fontWeight: 700,
                  fontFamily: FONT_FAMILY,
                }}
              >
                Kết luận
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isPackage &&
            selectedService &&
            resultsMap[selectedService.id] &&
            components.length > 0
              ? components.map((comp, idx) => (
                  <TableRow key={comp.componentId || comp.id}>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {comp.componentName || comp.testName}
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="outlined"
                        size="small"
                        value={
                          resultsMap[selectedService.id][idx]?.resultValue || ''
                        }
                        onChange={(e) =>
                          handleChange(idx, 'resultValue', e.target.value)
                        }
                        error={
                          touchedMap[selectedService.id]?.[idx] &&
                          !resultsMap[selectedService.id][idx]?.resultValue
                        }
                        helperText={
                          touchedMap[selectedService.id]?.[idx] &&
                          !resultsMap[selectedService.id][idx]?.resultValue
                            ? 'Không được để trống'
                            : ''
                        }
                        fullWidth
                        disabled={loading}
                      />
                    </TableCell>
                    <TableCell>{comp.unit}</TableCell>
                    <TableCell>
                      {comp.normalRange || comp.referenceRange}
                    </TableCell>
                    <TableCell>
                      <FormControl fullWidth size="small">
                        <Select
                          value={
                            resultsMap[selectedService.id][idx]?.conclusion ||
                            ''
                          }
                          onChange={(e) =>
                            handleChange(idx, 'conclusion', e.target.value)
                          }
                          disabled={loading}
                          displayEmpty
                        >
                          <MenuItem value="" disabled>
                            Chọn kết luận
                          </MenuItem>
                          {conclusionOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))
              : !isPackage &&
                components.map((comp, idx) => (
                  <TableRow key={comp.componentId || comp.id}>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {comp.componentName || comp.testName}
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="outlined"
                        size="small"
                        value={results[idx]?.resultValue || ''}
                        onChange={(e) =>
                          handleChange(idx, 'resultValue', e.target.value)
                        }
                        error={touched[idx] && !results[idx]?.resultValue}
                        helperText={
                          touched[idx] && !results[idx]?.resultValue
                            ? 'Không được để trống'
                            : ''
                        }
                        fullWidth
                        disabled={loading}
                      />
                    </TableCell>
                    <TableCell>{comp.unit}</TableCell>
                    <TableCell>
                      {comp.normalRange || comp.referenceRange}
                    </TableCell>
                    <TableCell>
                      <FormControl fullWidth size="small">
                        <Select
                          value={results[idx]?.conclusion || ''}
                          onChange={(e) =>
                            handleChange(idx, 'conclusion', e.target.value)
                          }
                          disabled={loading}
                          displayEmpty
                        >
                          <MenuItem value="" disabled>
                            Chọn kết luận
                          </MenuItem>
                          {conclusionOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          background: MEDICAL_GRADIENT,
          color: '#fff',
          fontWeight: 700,
          fontSize: 22,
          fontFamily: FONT_FAMILY,
          py: 2,
          px: 3,
        }}
      >
        {isPackage
          ? `Gói xét nghiệm: ${test?.serviceName}`
          : 'Nhập kết quả xét nghiệm'}
      </DialogTitle>
      <DialogContent sx={{ background: '#f7f9fb', p: 3 }}>
        {isPackage && renderServiceCards()}

        <Box
          sx={{
            my: 2,
            p: 2,
            background: '#fff',
            borderRadius: 2,
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, color: '#1e293b', mb: 1.5 }}
          >
            Thông tin chung
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2">
                <b>Mã XN:</b> #{test?.testId}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="body2">
                <b>Khách hàng:</b> {test?.customerName}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">
                <b>Dịch vụ được chọn:</b>{' '}
                <Box component="span" sx={{ fontWeight: 500 }}>
                  {isPackage
                    ? selectedService?.name ||
                      selectedService?.serviceName ||
                      'Chưa chọn'
                    : test?.serviceName}
                </Box>
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {renderContent()}

        {/* Hiển thị dropdown chọn consultant luôn khi RESULTED */}
        {test?.status === 'RESULTED' && (
          <Box sx={{ my: 2 }}>
            {assignSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {assignSuccess}
              </Alert>
            )}
            <Grid container spacing={2} alignItems="center">
              <Grid item size={12} xs={12} md={6}>
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel id="consultant-select-label">
                    Chọn Tư Vấn Viên
                  </InputLabel>
                  <Select
                    labelId="consultant-select-label"
                    value={selectedConsultantId}
                    onChange={(e) => setSelectedConsultantId(e.target.value)}
                    label="Chọn consultant"
                    sx={{ background: '#fff', borderRadius: 1 }}
                  >
                    {consultants.map((c) => (
                      <MenuItem key={c.userId || c.id} value={c.userId || c.id}>
                        {c.fullName || c.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  sx={{
                    mt: 1,
                    background: MEDICAL_GRADIENT,
                    color: '#fff',
                    fontWeight: 600,
                    boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
                  }}
                  onClick={handleAssignConsultant}
                  disabled={!selectedConsultantId || assigningConsultant}
                  fullWidth
                >
                  {assigningConsultant ? 'Đang gán...' : 'Chọn consultant này'}
                </Button>
              </Grid>
              <Grid item size={12} xs={12} md={6}>
                {/* Nếu là package, hiển thị note từng service */}
                {isPackage && Array.isArray(test?.testServiceConsultantNotes) ? (
                  <Box>
                    {test.testServiceConsultantNotes.map((n) => (
                      <Box key={n.serviceId} sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {n.serviceName || `Dịch vụ #${n.serviceId}`}
                        </Typography>
                        <TextField
                          label="Kết luận từ Tư Vấn Viên"
                          value={n.note || ''}
                          placeholder="Chưa có kết luận từ Tư Vấn Viên"
                          multiline
                          minRows={2}
                          maxRows={4}
                          fullWidth
                          InputProps={{ readOnly: true }}
                          sx={{
                            background: '#fff',
                            borderRadius: 1,
                            '& .MuiInputBase-input': {
                              fontStyle: n.note ? 'normal' : 'italic',
                              color: n.note ? '#222' : 'red',
                            },
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <TextField
                    label="Kết luận từ Tư Vấn Viên"
                    value={test?.consultantNotes || ''}
                    placeholder="Chưa có kết luận từ Tư Vấn Viên"
                    multiline
                    minRows={3}
                    maxRows={6}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    sx={{
                      background: '#fff',
                      borderRadius: 1,
                      '& .MuiInputBase-input': {
                        fontStyle: test?.consultantNotes ? 'normal' : 'italic',
                        color: test?.consultantNotes ? '#222' : 'red',
                      },
                    }}
                  />
                )}
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onClose} color="secondary">
          Hủy
        </Button>
        <Button
          onClick={handleSaveAll}
          variant="outlined"
          disabled={loading}
          sx={{
            fontWeight: 600,
            borderColor: '#4A90E2',
            color: '#4A90E2',
            '&:hover': {
              backgroundColor: 'rgba(74, 144, 226, 0.04)',
            },
          }}
        >
          {test?.status === 'RESULTED' ? 'Cập nhật kết quả' : 'Lưu kết quả'}
        </Button>
        {/* Alert cảnh báo và nút hoàn tất */}
        {test?.status === 'RESULTED' && (
          <Button
            onClick={handleComplete}
            variant="contained"
            disabled={
              loading ||
              (
                isPackage
                  ? !(
                      Array.isArray(test?.testServiceConsultantNotes) &&
                      test.testServiceConsultantNotes.length > 0 &&
                      test.testServiceConsultantNotes.every(n => n.note && n.note.trim() !== '')
                    )
                  : !test?.consultantNotes || test.consultantNotes.trim() === ''
              )
            }
            sx={{
              background: MEDICAL_GRADIENT,
              color: '#fff',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
            }}
          >
            Lưu & Hoàn tất
          </Button>
        )}
        {/* Đã thay Alert cảnh báo bằng TextField ở trên */}
        {loading && (
          <CircularProgress
            size={24}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        )}
      </DialogActions>
    </Dialog>
  );
};

export default TestResultInputModal;
