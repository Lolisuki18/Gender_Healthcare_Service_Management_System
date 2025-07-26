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
import { notify } from '../../../utils/notify';
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
  const [consultants, setConsultants] = useState([]);
  const [selectedConsultantId, setSelectedConsultantId] = useState('');
  const [assigningConsultant, setAssigningConsultant] = useState(false);
  const [assignSuccess, setAssignSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);

  // Debug log when modal opens
  useEffect(() => {
    if (open) {
      console.group('=== TestResultInputModal Debug ===');
      console.log('Modal opened with test:', test);
      console.log('Test results raw:', test?.testResults);

      // Handle different data structures for debugging
      let testResultsArray = [];
      if (test?.testResults) {
        if (Array.isArray(test.testResults)) {
          testResultsArray = test.testResults;
          console.log('Test results format: Direct array');
        } else if (
          test.testResults.data &&
          Array.isArray(test.testResults.data.results)
        ) {
          testResultsArray = test.testResults.data.results;
          console.log(
            'Test results format: API response { data: { results: [...] } }'
          );
        } else if (
          test.testResults.results &&
          Array.isArray(test.testResults.results)
        ) {
          testResultsArray = test.testResults.results;
          console.log('Test results format: Alternative { results: [...] }');
        }
      }
      console.log('Processed test results array:', testResultsArray);

      console.log('Components:', components);
      console.log('Is package:', isPackage);
      console.log('Package services:', packageServices);
      console.log('Selected service:', selectedService);
      console.groupEnd();
    }
  }, [open, test, components, isPackage, packageServices, selectedService]);

  // Load conclusion options
  useEffect(() => {
    const loadConclusionOptions = async () => {
      try {
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

      // Handle different data structures for test results
      let testResultsArray = [];
      if (test?.testResults) {
        if (Array.isArray(test.testResults)) {
          // Direct array format
          testResultsArray = test.testResults;
        } else if (
          test.testResults.data &&
          Array.isArray(test.testResults.data.results)
        ) {
          // API response format: { data: { results: [...] } }
          testResultsArray = test.testResults.data.results;
        } else if (
          test.testResults.results &&
          Array.isArray(test.testResults.results)
        ) {
          // Alternative format: { results: [...] }
          testResultsArray = test.testResults.results;
        }
      }

      // Build map for quick lookup (for single tests)
      testResultsArray.forEach((res) => {
        if (res.componentId != null) {
          existingResultsMap.set(res.componentId, res);
        }
      });

      let newResults;
      if (isPackage && serviceId && resultsMap[serviceId]) {
        // Nếu đã có dữ liệu nhập tạm thời thì ưu tiên lấy lại
        newResults = resultsMap[serviceId];
        console.log(
          'Using existing results from resultsMap for serviceId:',
          serviceId,
          newResults
        );
      } else {
        newResults = componentsToMap.map((comp) => {
          const componentId = comp.componentId || comp.id;

          // For package tests, find existing result matching both componentId and serviceId
          let existingResult = null;
          if (isPackage && serviceId) {
            existingResult = testResultsArray.find(
              (res) =>
                res.componentId === componentId && res.serviceId === serviceId
            );
          } else {
            existingResult = existingResultsMap.get(componentId);
          }

          // Log để debug - detailed logging
          console.log('Processing component:', {
            componentIndex: componentsToMap.indexOf(comp),
            component: comp,
            componentId,
            componentName: comp.componentName || comp.testName,
            serviceId,
            existingResult,
            testResultsArrayLength: testResultsArray.length,
            // Check if we're finding the right results
            matchingResults: testResultsArray.filter(
              (res) => res.serviceId === serviceId
            ),
            allComponentIds: testResultsArray.map((res) => res.componentId),
            allServiceIds: testResultsArray.map((res) => res.serviceId),
          });

          const newResult = {
            componentId: componentId,
            resultValue: existingResult?.resultValue || comp.resultValue || '',
            unit: existingResult?.unit || comp.unit || '',
            normalRange:
              existingResult?.normalRange ||
              comp.normalRange ||
              comp.referenceRange ||
              '',
            conclusion: existingResult?.conclusion || '',
          };

          console.log(
            'Created result for component',
            componentId,
            ':',
            newResult
          );
          return newResult;
        });

        console.log(
          'Created new results for serviceId:',
          serviceId,
          'results:',
          newResults
        );
        console.log('Components used for mapping:', componentsToMap);
        console.log('Existing API test results:', testResultsArray);
      }

      if (isPackage) {
        setResultsMap((prev) => {
          const updated = { ...prev, [serviceId]: newResults };
          console.log('Updating resultsMap - Previous:', prev);
          console.log(
            'Updating resultsMap - New entry for serviceId',
            serviceId,
            ':',
            newResults
          );
          console.log('Updating resultsMap - Updated map:', updated);
          return updated;
        });
        setTouchedMap((prev) => ({ ...prev, [serviceId]: {} }));

        // Log the results map for debugging
        console.log('Package - Setting results map for serviceId:', serviceId);
        console.log('Package - New results:', newResults);
      } else {
        setResults(newResults);
        setTouched({});

        // Log the results for debugging
        console.log('Single test - Setting results:', newResults);
        console.log('Single test - Existing test results:', test?.testResults);
      }
    };

    if (isPackage && selectedService && selectedService.id) {
      initializeState(selectedService.id, components);
    } else if (!isPackage && components && components.length > 0) {
      initializeState(null, components);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [components, open, isPackage, selectedService, test]);

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
    // Clear validation errors khi user thay đổi dữ liệu
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }

    if (isPackage && selectedService && selectedService.id) {
      const svcId = selectedService.id;
      setResultsMap((prev) => {
        // Initialize array for this service if it doesn't exist
        if (!prev[svcId] || prev[svcId].length === 0) {
          // Get test results array directly from API data
          let testResultsArray = [];
          if (test?.testResults?.data?.results) {
            testResultsArray = test.testResults.data.results;
          } else if (test?.testResults?.results) {
            testResultsArray = test.testResults.results;
          } else if (Array.isArray(test?.testResults)) {
            testResultsArray = test.testResults;
          }

          // Create initial array based on components
          const initialResults = components.map((comp, compIdx) => {
            const componentId = comp.componentId || comp.id;
            const existingResult = testResultsArray.find(
              (res) =>
                res.componentId === componentId && res.serviceId === svcId
            );

            return {
              componentId: componentId,
              resultValue: existingResult?.resultValue || '',
              unit: existingResult?.unit || comp.unit || '',
              normalRange:
                existingResult?.normalRange ||
                comp.normalRange ||
                comp.referenceRange ||
                '',
              conclusion: existingResult?.conclusion || '',
            };
          });

          prev[svcId] = initialResults;
        }

        return {
          ...prev,
          [svcId]: prev[svcId].map((r, i) =>
            i === idx ? { ...r, [field]: value } : r
          ),
        };
      });
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

  // Hàm kiểm tra xem đã nhập đầy đủ kết quả chưa
  const isAllResultsCompleted = () => {
    if (isPackage) {
      // Với package, kiểm tra tất cả service trong package
      if (!packageServices || packageServices.length === 0) return false;

      return packageServices.every((service) => {
        const serviceResults = resultsMap[service.id];
        if (!serviceResults || serviceResults.length === 0) return false;

        return serviceResults.every(
          (result) =>
            result.resultValue &&
            result.resultValue.trim() !== '' &&
            result.conclusion &&
            result.conclusion.trim() !== ''
        );
      });
    } else {
      // Với single test, kiểm tra tất cả components
      if (!results || results.length === 0) return false;

      return results.every(
        (result) =>
          result.resultValue &&
          result.resultValue.trim() !== '' &&
          result.conclusion &&
          result.conclusion.trim() !== ''
      );
    }
  };

  // Hàm kiểm tra xem đã có đầy đủ consultant notes chưa
  const isAllConsultantNotesCompleted = () => {
    if (isPackage) {
      // Với package, kiểm tra tất cả service trong package có notes chưa
      if (!packageServices || packageServices.length === 0) return false;
      if (!Array.isArray(test?.testServiceConsultantNotes)) return false;

      return packageServices.every((service) => {
        const serviceNote = test.testServiceConsultantNotes.find(
          (n) => n.serviceId === service.id
        );
        return (
          serviceNote && serviceNote.note && serviceNote.note.trim() !== ''
        );
      });
    } else {
      // Với single test, kiểm tra consultant notes
      return test?.consultantNotes && test.consultantNotes.trim() !== '';
    }
  };

  // Hàm kiểm tra và trả về thông báo lỗi cụ thể
  const validateResultsForSaving = () => {
    const errors = [];

    if (isPackage) {
      packageServices.forEach((service) => {
        const serviceResults = resultsMap[service.id];
        if (!serviceResults || serviceResults.length === 0) return;

        serviceResults.forEach((result, resultIndex) => {
          const hasResult =
            result.resultValue && result.resultValue.trim() !== '';
          const hasConclusion =
            result.conclusion && result.conclusion.trim() !== '';

          if (hasResult && !hasConclusion) {
            const componentName =
              components[resultIndex]?.componentName ||
              components[resultIndex]?.testName ||
              `Thành phần ${resultIndex + 1}`;
            errors.push(
              `${service.name || service.serviceName} - ${componentName}: Đã nhập kết quả nhưng chưa chọn kết luận`
            );
          }
        });
      });
    } else {
      results.forEach((result, index) => {
        const hasResult =
          result.resultValue && result.resultValue.trim() !== '';
        const hasConclusion =
          result.conclusion && result.conclusion.trim() !== '';

        if (hasResult && !hasConclusion) {
          const componentName =
            components[index]?.componentName ||
            components[index]?.testName ||
            `Thành phần ${index + 1}`;
          errors.push(
            `${componentName}: Đã nhập kết quả nhưng chưa chọn kết luận`
          );
        }
      });
    }

    return errors;
  };

  const handleSaveAll = () => {
    // Kiểm tra validation trước khi lưu
    const errors = validateResultsForSaving();
    if (errors.length > 0) {
      setValidationErrors(errors);
      notify.error('Lỗi lưu kết quả', 'Vui lòng kiểm tra các lỗi bên dưới');
      return;
    }

    // Clear validation errors nếu không có lỗi
    setValidationErrors([]);

    if (onSaveAll) {
      let finalResults = [];
      if (isPackage) {
        // Gộp toàn bộ kết quả của mọi service trong package
        packageServices.forEach((service) => {
          const serviceResults = resultsMap[service.id] || [];
          serviceResults.forEach((result) => {
            if (result.componentId) {
              finalResults.push({
                ...result,
                serviceId: service.id,
              });
            }
          });
        });
      } else {
        finalResults = results;
      }

      // Safeguard: Đảm bảo không có componentId trùng lặp được gửi đi
      const uniqueResults = Array.from(
        finalResults
          .reduce((map, item) => {
            const key = isPackage
              ? `${item.componentId}-${item.serviceId}`
              : item.componentId;
            return map.set(key, item);
          }, new Map())
          .values()
      );

      console.log('Saving all results:', uniqueResults);

      onSaveAll({
        status: 'RESULTED',
        results: uniqueResults,
      });

      // Hiển thị thông báo thành công
      notify.success('Thành công', 'Lưu kết quả xét nghiệm thành công!');
    }
  };

  const handleComplete = () => {
    // Kiểm tra validation trước khi hoàn tất
    const errors = validateResultsForSaving();
    if (errors.length > 0) {
      setValidationErrors(errors);
      notify.error('Lỗi lưu kết quả', 'Vui lòng kiểm tra các lỗi bên dưới');
      return;
    }

    // Clear validation errors nếu không có lỗi
    setValidationErrors([]);

    if (onComplete) {
      let finalResults = [];
      if (isPackage) {
        // Tổng hợp tất cả kết quả của mọi service trong package
        packageServices.forEach((service) => {
          const serviceResults = resultsMap[service.id] || [];
          serviceResults.forEach((result) => {
            if (result.componentId && result.resultValue && result.conclusion) {
              finalResults.push({
                ...result,
                serviceId: service.id,
              });
            }
          });
        });
      } else {
        finalResults = results.filter(
          (result) =>
            result.componentId && result.resultValue && result.conclusion
        );
      }

      // Safeguard: Đảm bảo không có componentId trùng lặp được gửi đi
      const uniqueResults = Array.from(
        finalResults
          .reduce((map, item) => {
            const key = isPackage
              ? `${item.componentId}-${item.serviceId}`
              : item.componentId;
            return map.set(key, item);
          }, new Map())
          .values()
      );

      console.log('Completing test with results:', uniqueResults);

      onComplete({
        status: 'COMPLETED',
        results: uniqueResults,
      });

      // Hiển thị thông báo thành công
      notify.success('Thành công', 'Hoàn tất xét nghiệm thành công!');
    }
  };

  const handleSelectService = (svc) => {
    if (isPackage && selectedService && selectedService.id) {
      // Lưu lại kết quả đang nhập cho service hiện tại vào resultsMap
      // Sử dụng current resultsMap values thay vì results cũ
      const currentResults = resultsMap[selectedService.id] || [];
      setResultsMap((prev) => ({
        ...prev,
        [selectedService.id]: currentResults,
      }));

      console.log('Switching service from', selectedService.id, 'to', svc.id);
      console.log(
        'Saving current results for service',
        selectedService.id,
        ':',
        currentResults
      );
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

      // Hiển thị thông báo thành công
      notify.success('Thành công', 'Gán tư vấn viên thành công!');
    } catch (err) {
      alert('Gán consultant thất bại!');
      notify.error('Lỗi', 'Gán tư vấn viên thất bại!');
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
            {isPackage && selectedService && components.length > 0
              ? components.map((comp, idx) => {
                  // Hàm helper để lấy dữ liệu API test results
                  const getApiTestResults = () => {
                    if (test?.testResults?.data?.results) {
                      return test.testResults.data.results;
                    }
                    if (test?.testResults?.results) {
                      return test.testResults.results;
                    }
                    if (Array.isArray(test?.testResults)) {
                      return test.testResults;
                    }
                    return [];
                  };

                  // Lấy componentId và serviceId
                  const componentId = comp.componentId || comp.id;
                  const serviceId = selectedService.id;

                  // Tìm kết quả từ API cho component và service này
                  const apiResults = getApiTestResults();
                  const existingApiResult = apiResults.find(
                    (res) =>
                      res.componentId === componentId &&
                      res.serviceId === serviceId
                  );

                  // Hàm helper để lấy giá trị hiện tại để hiển thị
                  const getCurrentDisplayValue = (field) => {
                    // 1. Ưu tiên: Nếu user đã thay đổi trong resultsMap, dùng giá trị đó
                    const currentServiceResults = resultsMap[serviceId] || [];
                    const currentResult = currentServiceResults[idx];
                    if (
                      currentResult &&
                      currentResult[field] !== undefined &&
                      currentResult[field] !== ''
                    ) {
                      return currentResult[field];
                    }

                    // 2. Fallback: Dùng dữ liệu từ API nếu có
                    if (
                      existingApiResult &&
                      existingApiResult[field] !== undefined
                    ) {
                      return existingApiResult[field];
                    }

                    // 3. Default: Trả về empty string hoặc giá trị mặc định từ component
                    if (field === 'unit') {
                      return comp.unit || '';
                    }
                    if (field === 'normalRange') {
                      return comp.normalRange || comp.referenceRange || '';
                    }
                    return '';
                  };

                  // Log debug cho component đầu tiên của mỗi service
                  if (idx === 0) {
                    console.log(
                      `🔍 Package Service ${serviceId} - Component ${componentId}:`,
                      {
                        componentName: comp.componentName || comp.testName,
                        existingApiResult,
                        currentResultValue:
                          getCurrentDisplayValue('resultValue'),
                        currentConclusion: getCurrentDisplayValue('conclusion'),
                        resultsMapForService: resultsMap[serviceId],
                        totalApiResults: apiResults.length,
                        componentsLength: components.length,
                        isPackageFlag: isPackage,
                        selectedServiceId: selectedService?.id,
                      }
                    );
                  }

                  return (
                    <TableRow key={componentId}>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {comp.componentName || comp.testName}
                      </TableCell>
                      <TableCell>
                        <TextField
                          variant="outlined"
                          size="small"
                          value={getCurrentDisplayValue('resultValue')}
                          onChange={(e) =>
                            handleChange(idx, 'resultValue', e.target.value)
                          }
                          error={
                            touchedMap[serviceId]?.[idx] &&
                            !getCurrentDisplayValue('resultValue')
                          }
                          helperText={
                            touchedMap[serviceId]?.[idx] &&
                            !getCurrentDisplayValue('resultValue')
                              ? 'Không được để trống'
                              : ''
                          }
                          fullWidth
                          disabled={loading}
                          placeholder="Nhập kết quả xét nghiệm"
                        />
                      </TableCell>
                      <TableCell>
                        {comp.unit || existingApiResult?.unit || ''}
                      </TableCell>
                      <TableCell>
                        {comp.normalRange ||
                          comp.referenceRange ||
                          existingApiResult?.normalRange ||
                          ''}
                      </TableCell>
                      <TableCell>
                        <FormControl fullWidth size="small">
                          <Select
                            value={getCurrentDisplayValue('conclusion')}
                            onChange={(e) =>
                              handleChange(idx, 'conclusion', e.target.value)
                            }
                            disabled={
                              loading ||
                              !getCurrentDisplayValue('resultValue') ||
                              getCurrentDisplayValue('resultValue').trim() ===
                                ''
                            }
                            displayEmpty
                          >
                            <MenuItem value="" disabled>
                              {!getCurrentDisplayValue('resultValue') ||
                              getCurrentDisplayValue('resultValue').trim() ===
                                ''
                                ? 'Vui lòng nhập kết quả trước'
                                : 'Chọn kết luận'}
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
                  );
                })
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
                          disabled={
                            loading ||
                            !results[idx]?.resultValue ||
                            results[idx]?.resultValue.trim() === ''
                          }
                          displayEmpty
                        >
                          <MenuItem value="" disabled>
                            {!results[idx]?.resultValue ||
                            results[idx]?.resultValue.trim() === ''
                              ? 'Vui lòng nhập kết quả trước'
                              : 'Chọn kết luận'}
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
        {validationErrors.length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Lỗi lưu kết quả:
            </Typography>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {validationErrors.map((error, index) => (
                <li key={index} style={{ marginBottom: '4px' }}>
                  {error}
                </li>
              ))}
            </ul>
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

            {/* Hiển thị cảnh báo nếu chưa nhập đầy đủ kết quả */}
            {!isAllResultsCompleted() && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Vui lòng nhập đầy đủ kết quả và kết luận cho tất cả các thành
                phần trước khi chọn tư vấn viên.
              </Alert>
            )}

            {/* Hiển thị cảnh báo nếu chưa có đầy đủ consultant notes */}
            {test?.status === 'RESULTED' &&
              isAllResultsCompleted() &&
              !isAllConsultantNotesCompleted() && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  {isPackage
                    ? 'Cần có kết luận từ Tư Vấn Viên cho tất cả các dịch vụ trong gói trước khi hoàn tất.'
                    : 'Cần có kết luận từ Tư Vấn Viên trước khi hoàn tất.'}
                </Alert>
              )}

            <Grid container spacing={2} alignItems="center">
              <Grid item size={12} xs={12} md={12}>
                {/* Nếu là package, hiển thị note của service được chọn */}
                {isPackage &&
                selectedService &&
                Array.isArray(test?.testServiceConsultantNotes) ? (
                  <Box>
                    {test.testServiceConsultantNotes
                      .filter((n) => n.serviceId === selectedService.id)
                      .map((n) => (
                        <Box key={n.serviceId} sx={{ mb: 2 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600, mb: 0.5 }}
                          >
                            {n.serviceName ||
                              selectedService.name ||
                              selectedService.serviceName ||
                              `Dịch vụ #${n.serviceId}`}
                          </Typography>
                          <TextField
                            label="Kết luận từ Tư Vấn Viên"
                            value={n.note || ''}
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
                                fontStyle: n.note ? 'normal' : 'italic',
                                color: n.note ? '#222' : 'red',
                              },
                            }}
                          />
                        </Box>
                      ))}
                    {/* Nếu không tìm thấy note cho service được chọn */}
                    {test.testServiceConsultantNotes.filter(
                      (n) => n.serviceId === selectedService.id
                    ).length === 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600, mb: 0.5 }}
                        >
                          {selectedService.name || selectedService.serviceName}
                        </Typography>
                        <TextField
                          label="Kết luận từ Tư Vấn Viên"
                          value=""
                          placeholder="Chưa có kết luận từ Tư Vấn Viên cho service này"
                          multiline
                          minRows={3}
                          maxRows={6}
                          fullWidth
                          InputProps={{ readOnly: true }}
                          sx={{
                            background: '#fff',
                            borderRadius: 1,
                            '& .MuiInputBase-input': {
                              fontStyle: 'italic',
                              color: 'red',
                            },
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                ) : isPackage && !selectedService ? (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Vui lòng chọn một dịch vụ để xem kết luận từ Tư Vấn Viên.
                  </Alert>
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

              {/* Phần chọn tư vấn viên được di chuyển xuống dưới */}
              <Grid item size={12} xs={12} md={12}>
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel id="consultant-select-label">
                    {isAllResultsCompleted()
                      ? 'Chọn Tư Vấn Viên'
                      : 'Hoàn tất kết quả trước khi chọn tư vấn viên'}
                  </InputLabel>
                  <Select
                    labelId="consultant-select-label"
                    value={selectedConsultantId}
                    onChange={(e) => setSelectedConsultantId(e.target.value)}
                    label={
                      isAllResultsCompleted()
                        ? 'Chọn consultant'
                        : 'Hoàn tất kết quả trước khi chọn tư vấn viên'
                    }
                    sx={{
                      background: '#fff',
                      borderRadius: 1,
                      opacity: isAllResultsCompleted() ? 1 : 0.6,
                    }}
                    disabled={!isAllResultsCompleted()}
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
                    background: isAllResultsCompleted()
                      ? MEDICAL_GRADIENT
                      : '#9e9e9e',
                    color: '#fff',
                    fontWeight: 600,
                    boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
                  }}
                  onClick={handleAssignConsultant}
                  disabled={
                    !selectedConsultantId ||
                    assigningConsultant ||
                    !isAllResultsCompleted()
                  }
                  fullWidth
                >
                  {assigningConsultant
                    ? 'Đang gán...'
                    : !isAllResultsCompleted()
                      ? 'Hoàn tất kết quả trước'
                      : 'Chọn consultant này'}
                </Button>
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
              !isAllResultsCompleted() ||
              !isAllConsultantNotesCompleted()
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
