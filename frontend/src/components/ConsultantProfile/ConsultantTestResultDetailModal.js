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
  Alert,
} from '@mui/material';
import confirmDialog from '../../utils/confirmDialog';

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
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSave = async () => {
    // Hiện dialog xác nhận
    const ok = await confirmDialog.info(
      `Bạn có chắc chắn muốn lưu kết luận này cho bệnh nhân ${test?.customerName || ''}?`
    );
    if (!ok) return;
    setSaving(true);
    setError('');
    try {
      await onSaveNote(consultantNote);
      setSuccess('Lưu kết luận thành công!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (e) {
      setError('Lưu kết luận thất bại!');
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
          <TextField
            label="Nhập kết luận/chú thích cho bệnh nhân"
            value={consultantNote}
            onChange={(e) => setConsultantNote(e.target.value)}
            placeholder="Nhập kết luận/chú thích cho bệnh nhân..."
            multiline
            minRows={3}
            maxRows={6}
            fullWidth
            disabled={saving}
          />
        </Box>
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
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
          {saving ? 'Đang lưu...' : 'Lưu kết luận'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConsultantTestResultDetailModal;
