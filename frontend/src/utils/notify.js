import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const notify = {
  success: (title = 'Thành công', message = '') =>
    toast.success(`${title ? title + ': ' : ''}${message}`),
  error: (title = 'Lỗi', message = '') =>
    toast.error(`${title ? title + ': ' : ''}${message}`),
  info: (title = 'Thông tin', message = '') =>
    toast.info(`${title ? title + ': ' : ''}${message}`),
  warning: (title = 'Cảnh báo', message = '') =>
    toast.warning(`${title ? title + ': ' : ''}${message}`),
};
