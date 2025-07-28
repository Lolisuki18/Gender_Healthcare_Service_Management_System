import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Grid,
} from '@mui/material';
import confirmDialog from '../../utils/confirmDialog';
import { notify } from '../../utils/notify';
import { updateConsultantNoteForService } from '../../services/stiService';

const MEDICAL_GRADIENT = 'linear-gradient(45deg, #4A90E2, #1ABC9C)';
const FONT_FAMILY = '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif';

const ConsultantTestResultDetailModal = ({
  open,
  onClose,
  test,
  onSaveNote,
  isPackage = false,
  packageServices = [],
  selectedService = null,
  onSelectService = () => {},
  components = [],
  consultantId = null,
}) => {
  const [consultantNote, setConsultantNote] = useState(
    test?.consultantNotes || ''
  );
  const [saving, setSaving] = useState(false);
  // State cho note từng service nếu là package
  const [serviceNotes, setServiceNotes] = useState({});
  const [savingServiceNote, setSavingServiceNote] = useState({});

  // Đồng bộ consultantNote với test.consultantNotes khi test thay đổi
  React.useEffect(() => {
    setConsultantNote(test?.consultantNotes || '');
  }, [test?.consultantNotes]);

  // Khi mở modal, load note từng service nếu là package
  React.useEffect(() => {
    if (isPackage && packageServices.length > 0 && test?.testId) {
      // Đồng bộ lại note từng service từ testServiceConsultantNotes
      const notesMap = {};
      if (
        test?.testServiceConsultantNotes &&
        Array.isArray(test.testServiceConsultantNotes)
      ) {
        test.testServiceConsultantNotes.forEach((n) => {
          notesMap[n.serviceId] = n.note || '';
        });
      }
      setServiceNotes(notesMap);
    }
  }, [
    isPackage,
    packageServices,
    test?.testId,
    test?.testServiceConsultantNotes,
  ]);

  // Khi selectedService thay đổi, load note cho service đó vào TextField
  React.useEffect(() => {
    if (selectedService && test?.testServiceConsultantNotes) {
      const savedNote = test.testServiceConsultantNotes.find(
        (note) => note.serviceId === selectedService.id
      );
      if (savedNote && savedNote.note) {
        setServiceNotes((prev) => ({
          ...prev,
          [selectedService.id]: savedNote.note,
        }));
      }
    }
  }, [selectedService, test?.testServiceConsultantNotes]);

  // Debug effect để kiểm tra dữ liệu
  React.useEffect(() => {
    if (open) {
      console.log('=== ConsultantTestResultDetailModal Debug ===');
      console.log('isPackage:', isPackage);
      console.log('packageServices:', packageServices);
      console.log('selectedService:', selectedService);
      console.log('components:', components);
      console.log('test:', test);
    }
  }, [open, isPackage, packageServices, selectedService, components, test]);

  // Hàm lưu note cho từng service
  const handleSaveServiceNote = async (serviceId) => {
    if (!test?.testId || !serviceId) return;
    setSavingServiceNote((prev) => ({ ...prev, [serviceId]: true }));
    try {
      await updateConsultantNoteForService(
        test.testId,
        serviceId,
        consultantId,
        serviceNotes[serviceId] || ''
      );

      // Cập nhật lại dữ liệu note trong test object để hiển thị ngay lập tức
      if (test && test.testServiceConsultantNotes) {
        const noteIndex = test.testServiceConsultantNotes.findIndex(
          (note) => note.serviceId === serviceId
        );

        if (noteIndex >= 0) {
          // Cập nhật note đã có
          test.testServiceConsultantNotes[noteIndex].note =
            serviceNotes[serviceId] || '';
          test.testServiceConsultantNotes[noteIndex].consultantId =
            consultantId;
        } else {
          // Thêm note mới nếu chưa có
          test.testServiceConsultantNotes.push({
            serviceId: serviceId,
            note: serviceNotes[serviceId] || '',
            consultantId: consultantId,
            consultantName: null, // Có thể cập nhật sau nếu cần
          });
        }
      }

      notify.success('Thành công', 'Đã lưu kết luận cho dịch vụ!');
    } catch (e) {
      notify.error('Lỗi', 'Lưu kết luận thất bại!');
    } finally {
      setSavingServiceNote((prev) => ({ ...prev, [serviceId]: false }));
    }
  };

  const handleSave = async () => {
    // Hiện dialog xác nhận
    const action =
      test?.consultantNotes && test.consultantNotes.trim() ? 'cập nhật' : 'lưu';
    const ok = await confirmDialog.info(
      `Bạn có chắc chắn muốn ${action} kết luận này cho bệnh nhân ${test?.customerName || ''}?`
    );
    if (!ok) return;
    setSaving(true);
    try {
      await onSaveNote(consultantNote);
      const action =
        test?.consultantNotes && test.consultantNotes.trim()
          ? 'Cập nhật'
          : 'Lưu';
      notify.success('Thành công', `${action} kết luận thành công!`);
    } catch (e) {
      const action =
        test?.consultantNotes && test.consultantNotes.trim()
          ? 'Cập nhật'
          : 'Lưu';
      notify.error('Lỗi', `${action} kết luận thất bại!`);
    } finally {
      setSaving(false);
    }
  };

  // Helper: Việt hóa kết luận và trả về màu sắc
  const getConclusionLabel = (conclusion) => {
    switch (conclusion) {
      case 'INFECTED':
        return { text: 'Bị nhiễm', color: '#d32f2f' }; // Màu đỏ
      case 'NOT_INFECTED':
        return { text: 'Không bị nhiễm', color: '#2e7d32' }; // Màu xanh lá
      case 'ABNORMAL':
        return { text: 'Bất thường', color: '#f57c00' }; // Màu vàng cam
      case 'INCONCLUSIVE':
        return { text: 'Không xác định', color: '#757575' }; // Màu xám
      default:
        return { text: conclusion || '', color: '#757575' };
    }
  };

  // Helper: render bảng thành phần
  const renderComponentTable = (comps = []) => (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(74,144,226,0.10)',
        mb: 2,
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ background: MEDICAL_GRADIENT }}>
            <TableCell sx={{ color: '#fff', fontWeight: 700 }}>
              Tên thành phần
            </TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 700 }}>
              Kết quả
            </TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 700 }}>
              Đơn vị
            </TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 700 }}>
              Khoảng bình thường
            </TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 700 }}>
              Kết luận
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {comps.map((comp, idx) => (
            <TableRow key={comp.componentId || comp.resultId || comp.id || idx}>
              <TableCell>{comp.componentName || comp.testName}</TableCell>
              <TableCell>{comp.resultValue || 'Chưa có'}</TableCell>
              <TableCell>{comp.unit || ''}</TableCell>
              <TableCell>
                {comp.normalRange || comp.referenceRange || ''}
              </TableCell>
              <TableCell>
                {comp.conclusion ? (
                  (() => {
                    const conclusionData = getConclusionLabel(comp.conclusion);
                    return (
                      <Typography
                        variant="body2"
                        sx={{
                          color: conclusionData.color,
                          fontWeight: 600,
                          fontSize: '0.875rem',
                        }}
                      >
                        {conclusionData.text}
                      </Typography>
                    );
                  })()
                ) : (
                  <Typography
                    variant="body2"
                    sx={{ color: '#757575', fontStyle: 'italic' }}
                  >
                    Chưa có kết luận
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // Render bảng kết quả cho package hoặc service đơn
  const renderResults = () => {
    if (isPackage && packageServices.length > 0) {
      // Xác định service nào được chọn
      const currentService = selectedService || packageServices[0];

      // Lấy components cho service hiện tại
      const getComponentsForService = (serviceId) => {
        // Kiểm tra cấu trúc dữ liệu từ API
        let resultsArray = [];

        if (
          test?.testResults?.results &&
          Array.isArray(test.testResults.results)
        ) {
          // API structure: { results: [...] } - NEW FORMAT
          resultsArray = test.testResults.results;
        } else if (
          test?.testResults?.data?.results &&
          Array.isArray(test.testResults.data.results)
        ) {
          // API structure: { data: { results: [...] } } - OLD FORMAT
          resultsArray = test.testResults.data.results;
        } else if (test?.testResults && Array.isArray(test.testResults)) {
          // Direct array structure
          resultsArray = test.testResults;
        } else {
          return [];
        }

        // Lọc components theo serviceId
        return resultsArray.filter((result) => result.serviceId === serviceId);
      };

      const currentComponents = currentService
        ? getComponentsForService(currentService.id)
        : [];

      return (
        <Box>
          <Box sx={{ mb: 2 }}>
            <Tabs
              value={currentService ? currentService.id : packageServices[0].id}
              onChange={(e, val) => {
                const svc = packageServices.find((s) => s.id === val);
                if (svc) onSelectService(svc);
              }}
              variant="scrollable"
              scrollButtons="auto"
            >
              {packageServices.map((svc) => (
                <Tab
                  key={svc.id}
                  label={svc.name || svc.serviceName}
                  value={svc.id}
                />
              ))}
            </Tabs>
          </Box>

          {/* Debug: Hiển thị thông tin để debug
          {process.env.NODE_ENV === 'development' && (
            <Box
              sx={{ mb: 2, p: 1, backgroundColor: '#f0f0f0', fontSize: '12px' }}
            >
              <div>
                Selected Service: {currentService ? currentService.id : 'None'}
              </div>
              <div>Current Components Length: {currentComponents.length}</div>
              <div>
                Test Results Structure:{' '}
                {test?.testResults
                  ? JSON.stringify(Object.keys(test.testResults))
                  : 'undefined'}
              </div>
              <div>Package Services: {packageServices.length}</div>
              <div>Test ID: {test?.testId}</div>
              {currentComponents.length > 0 && (
                <div>
                  Component Service IDs:{' '}
                  {currentComponents.map((c) => c.serviceId).join(', ')}
                </div>
              )}
              {test?.testResults?.data?.results && (
                <div>Total Results: {test.testResults.data.results.length}</div>
              )}
            </Box>
          )} */}

          {currentService && (
            <>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                {currentService.name || currentService.serviceName}
              </Typography>
              {currentComponents && currentComponents.length > 0 ? (
                renderComponentTable(currentComponents)
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Không có kết quả xét nghiệm cho dịch vụ này.
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, display: 'block' }}
                  >
                    Có thể kết quả chưa được cập nhật hoặc dịch vụ chưa được
                    thực hiện.
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Box>
      );
    }
    // Service đơn lẻ
    return (
      <Box>
        {components && components.length > 0 ? (
          renderComponentTable(components)
        ) : (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Không có kết quả xét nghiệm.
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: 'block' }}
            >
              Kết quả có thể chưa được cập nhật.
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  // Thay thế phần render kết luận consultant:
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          background: MEDICAL_GRADIENT,
          color: '#fff',
          fontWeight: 700,
          fontSize: 22,
          py: 2,
          px: 3,
        }}
      >
        Chi tiết kết quả xét nghiệm
      </DialogTitle>
      <DialogContent sx={{ background: '#f7f9fb', p: 3 }}>
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
                <b>Dịch vụ:</b>{' '}
                <Box component="span" sx={{ fontWeight: 500 }}>
                  {test?.serviceName}
                </Box>
              </Typography>
            </Grid>
          </Grid>
        </Box>
        {/* Bảng kết quả xét nghiệm */}
        {renderResults()}
        <Box sx={{ my: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}
          >
            Kết luận từ consultant
          </Typography>
          {isPackage && packageServices.length > 0 ? (
            <Box>
              {/* Chỉ hiển thị ô nhập kết luận cho service đang được chọn */}
              {selectedService && (
                <Box
                  sx={{
                    mb: 3,
                    p: 2,
                    background: '#fff',
                    borderRadius: 2,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, mb: 1 }}
                  >
                    Kết luận cho:{' '}
                    {selectedService.name || selectedService.serviceName}
                  </Typography>

                  {/* Hiển thị kết luận đã lưu nếu có */}
                  {test?.testServiceConsultantNotes &&
                    (() => {
                      const savedNote = test.testServiceConsultantNotes.find(
                        (note) => note.serviceId === selectedService.id
                      );

                      return savedNote &&
                        savedNote.note &&
                        savedNote.note.trim() ? (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            Kết luận đã lưu:
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              mt: 1,
                              p: 2,
                              backgroundColor: '#e8f5e8',
                              borderRadius: 1,
                              border: '1px solid #c8e6c9',
                              whiteSpace: 'pre-wrap',
                              color: '#2e7d32',
                              fontWeight: 500,
                            }}
                          >
                            {savedNote.note}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mt: 1, display: 'block' }}
                          >
                            Bạn có thể chỉnh sửa kết luận này bên dưới
                          </Typography>
                        </Box>
                      ) : (
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Chưa có kết luận cho dịch vụ này
                          </Typography>
                        </Box>
                      );
                    })()}

                  <TextField
                    label={(() => {
                      const savedNote = test?.testServiceConsultantNotes?.find(
                        (note) => note.serviceId === selectedService.id
                      );
                      return savedNote &&
                        savedNote.note &&
                        savedNote.note.trim()
                        ? 'Chỉnh sửa kết luận/ghi chú cho dịch vụ này'
                        : 'Kết luận/ghi chú cho dịch vụ này';
                    })()}
                    value={serviceNotes[selectedService.id] || ''}
                    onChange={(e) =>
                      setServiceNotes((prev) => ({
                        ...prev,
                        [selectedService.id]: e.target.value,
                      }))
                    }
                    placeholder={(() => {
                      const savedNote = test?.testServiceConsultantNotes?.find(
                        (note) => note.serviceId === selectedService.id
                      );
                      return savedNote &&
                        savedNote.note &&
                        savedNote.note.trim()
                        ? 'Chỉnh sửa kết luận hiện tại...'
                        : 'Nhập kết luận/ghi chú cho dịch vụ...';
                    })()}
                    multiline
                    minRows={2}
                    maxRows={5}
                    fullWidth
                    disabled={savingServiceNote[selectedService.id]}
                    sx={{ mb: 1 }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleSaveServiceNote(selectedService.id)}
                    disabled={
                      savingServiceNote[selectedService.id] ||
                      !(
                        serviceNotes[selectedService.id] &&
                        serviceNotes[selectedService.id].trim()
                      )
                    }
                    sx={{
                      background: MEDICAL_GRADIENT,
                      color: '#fff',
                      fontWeight: 600,
                    }}
                  >
                    {savingServiceNote[selectedService.id]
                      ? 'Đang lưu...'
                      : (() => {
                          const savedNote =
                            test?.testServiceConsultantNotes?.find(
                              (note) => note.serviceId === selectedService.id
                            );
                          return savedNote &&
                            savedNote.note &&
                            savedNote.note.trim()
                            ? 'Cập nhật kết luận'
                            : 'Lưu kết luận';
                        })()}
                  </Button>
                </Box>
              )}
            </Box>
          ) : (
            <>
              {/* Logic cũ cho test lẻ */}
              {test?.consultantNotes && test.consultantNotes.trim() ? (
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                      color: '#2e7d32',
                      fontWeight: 500,
                      backgroundColor: '#e8f5e8',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #c8e6c9',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {test.consultantNotes}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#2e7d32',
                      mt: 1,
                      display: 'block',
                      fontStyle: 'italic',
                    }}
                  >
                    Kết luận đã được lưu
                  </Typography>
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  sx={{
                    color: '#f57c00',
                    fontStyle: 'italic',
                    mb: 2,
                    padding: '8px 12px',
                    backgroundColor: '#fff3e0',
                    borderRadius: '4px',
                    border: '1px solid #ffcc02',
                  }}
                >
                  Chưa có kết luận từ consultant
                </Typography>
              )}
              <TextField
                label={
                  test?.consultantNotes && test.consultantNotes.trim()
                    ? 'Chỉnh sửa kết luận/chú thích cho bệnh nhân'
                    : 'Nhập kết luận/chú thích cho bệnh nhân'
                }
                value={consultantNote}
                onChange={(e) => setConsultantNote(e.target.value)}
                placeholder={
                  test?.consultantNotes && test.consultantNotes.trim()
                    ? 'Chỉnh sửa kết luận hiện tại...'
                    : 'Nhập kết luận/chú thích cho bệnh nhân...'
                }
                multiline
                minRows={3}
                maxRows={6}
                fullWidth
                disabled={saving}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor:
                      test?.consultantNotes && test.consultantNotes.trim()
                        ? '#f8f9fa'
                        : '#fff',
                  },
                }}
              />
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onClose} color="secondary">
          Đóng
        </Button>
        {!isPackage && (
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={saving || !consultantNote.trim()}
            sx={{
              background: MEDICAL_GRADIENT,
              color: '#fff',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
            }}
          >
            {saving
              ? 'Đang lưu...'
              : test?.consultantNotes && test.consultantNotes.trim()
                ? 'Cập nhật kết luận'
                : 'Lưu kết luận'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ConsultantTestResultDetailModal;
