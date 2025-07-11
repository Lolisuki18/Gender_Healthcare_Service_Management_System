import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import questionService from '@/services/questionService';
import { toast } from 'react-toastify';

/**
 * AskQuestionDialog - Modal dùng chung để đặt câu hỏi
 * Props:
 *   - open: boolean
 *   - onClose: function
 *   - onSuccess: function (optional, gọi khi gửi thành công)
 *   - defaultCategory: string (optional)
 *   - title: string (optional)
 */
const AskQuestionDialog = ({
  open,
  onClose,
  onSuccess,
  defaultCategory = '',
  title = 'Đặt câu hỏi mới',
}) => {
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState(defaultCategory);

  // Lấy danh mục khi mở dialog
  useEffect(() => {
    if (open) {
      setQuestion('');
      setCategory(defaultCategory);
      setCategoryLoading(true);
      questionService
        .getCategories()
        .then((res) => setCategories(res.data.data || []))
        .catch(() => setCategories([]))
        .finally(() => setCategoryLoading(false));
    }
  }, [open, defaultCategory]);

  // Gửi câu hỏi
  const handleSubmit = async () => {
    if (!question) {
      toast.warn('Vui lòng nhập câu hỏi.');
      return;
    }
    if (!category) {
      toast.warn('Vui lòng chọn danh mục.');
      return;
    }
    setSubmitLoading(true);
    try {
      const response = await questionService.createQuestion({
        content: question,
        categoryQuestionId: category,
      });
      // toast.success('Câu hỏi đã được gửi thành công!'); // Đã chuyển sang QuestionsContent.js
      if (onSuccess) onSuccess(response);
      onClose();
    } catch (err) {
      toast.error('Gửi câu hỏi thất bại. Vui lòng thử lại.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
          boxShadow: '0 8px 40px 0 rgba(74, 144, 226, 0.18)',
          p: 0,
          overflow: 'visible',
          background: 'linear-gradient(135deg, #fafdff 80%, #e0f7fa 100%)',
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          fontSize: '1.25rem',
          background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          pb: 0,
          pt: 3,
          pl: 3,
        }}
      >
        <HelpOutlineIcon sx={{ fontSize: 22, color: '#4A90E2', mr: 1 }} />
        {title}
      </DialogTitle>
      <DialogContent
        dividers={false}
        sx={{
          px: { xs: 3, sm: 5 },
          pt: 2,
          pb: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
        }}
      >
        <TextField
          fullWidth
          name="question"
          label={
            <span style={{ fontWeight: 600, color: '#357ABD' }}>
              Câu hỏi của bạn *
            </span>
          }
          multiline
          rows={4}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          variant="outlined"
          placeholder="Nhập câu hỏi của bạn ở đây..."
          sx={{
            background: '#fff',
            borderRadius: 2,
            mt: 1,
            mb: 0.5,
            '& .MuiInputBase-input': {
              color: '#2D3748',
              fontSize: '1rem',
              lineHeight: '1.6',
            },
            '& .MuiInputLabel-root': {
              color: '#357ABD',
              fontWeight: 600,
            },
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '& fieldset': { borderColor: '#b3d4fc' },
              '&:hover fieldset': {
                borderColor: '#4A90E2',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1ABC9C',
                borderWidth: '2px',
              },
            },
          }}
        />
        <FormControl
          fullWidth
          variant="outlined"
          sx={{ background: '#fff', borderRadius: 2, mb: 0.5 }}
          disabled={categoryLoading}
        >
          <InputLabel id="category-label">Danh mục *</InputLabel>
          <Select
            labelId="category-label"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Danh mục *"
          >
            <MenuItem value="" disabled>
              {categoryLoading ? (
                <CircularProgress size={18} />
              ) : (
                'Chọn danh mục'
              )}
            </MenuItem>
            {categories.map((cat) => (
              <MenuItem
                key={cat.categoryQuestionId}
                value={cat.categoryQuestionId}
              >
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions
        sx={{
          background: '#fafdff',
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          px: { xs: 3, sm: 5 },
          py: 2.5,
          mt: 0,
          justifyContent: 'flex-end',
          gap: 2,
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            color: '#F50057',
            fontWeight: 600,
            borderRadius: 2,
            px: 3,
            fontSize: '1rem',
          }}
        >
          HỦY
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!question || !category || submitLoading}
          sx={{
            background: 'linear-gradient(90deg, #4A90E2 60%, #1ABC9C 100%)',
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '1rem',
            px: 4,
            py: 1.5,
            boxShadow: '0 4px 16px rgba(74, 144, 226, 0.15)',
            opacity: !question || !category || submitLoading ? 0.5 : 1,
            transition: 'all 0.2s',
            '&:hover': {
              background: 'linear-gradient(90deg, #357ABD 60%, #16A085 100%)',
              boxShadow: '0 8px 24px rgba(74, 144, 226, 0.22)',
            },
          }}
        >
          {submitLoading ? 'Đang gửi...' : 'Gửi câu hỏi'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AskQuestionDialog;
