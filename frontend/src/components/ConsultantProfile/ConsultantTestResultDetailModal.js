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
}) => {
  const [consultantNote, setConsultantNote] = useState(
    test?.consultantNotes || ''
  );
  const [saving, setSaving] = useState(false);

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

  // Helper: Việt hóa kết luận
  const getConclusionLabel = (conclusion) => {
    switch (conclusion) {
      case 'INFECTED':
        return 'Bị nhiễm';
      case 'NOT_INFECTED':
        return 'Không bị nhiễm';
      case 'ABNORMAL':
        return 'Bất thường';
      case 'INCONCLUSIVE':
        return 'Không xác định';
      default:
        return conclusion || '';
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
            <TableRow key={comp.componentId || comp.id || idx}>
              <TableCell>{comp.componentName || comp.testName}</TableCell>
              <TableCell>{comp.resultValue}</TableCell>
              <TableCell>{comp.unit}</TableCell>
              <TableCell>{comp.normalRange || comp.referenceRange}</TableCell>
              <TableCell>{getConclusionLabel(comp.conclusion)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // Render bảng kết quả cho package hoặc service đơn
  const renderResults = () => {
    if (isPackage && packageServices.length > 0) {
      return (
        <Box>
          <Box sx={{ mb: 2 }}>
            <Tabs
              value={
                selectedService ? selectedService.id : packageServices[0].id
              }
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
          {selectedService && components && components.length > 0 ? (
            <>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                {selectedService.name || selectedService.serviceName}
              </Typography>
              {renderComponentTable(components)}
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Không có thành phần xét nghiệm cho dịch vụ này.
            </Typography>
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
          <Typography variant="body2" color="text.secondary">
            Không có thành phần xét nghiệm.
          </Typography>
        )}
      </Box>
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

          {/* Hiển thị kết luận đã có */}
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

          {/* TextField để chỉnh sửa/thêm kết luận */}
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
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onClose} color="secondary">
          Đóng
        </Button>
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
      </DialogActions>
    </Dialog>
  );
};

export default ConsultantTestResultDetailModal;
