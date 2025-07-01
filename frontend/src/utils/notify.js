import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const notify = {
  success: (title, message) => toast.success(`${title ? title + ': ' : ''}${message}`),
  error: (title, message) => toast.error(`${title ? title + ': ' : ''}${message}`),
  info: (title, message) => toast.info(`${title ? title + ': ' : ''}${message}`),
  warning: (title, message) => toast.warning(`${title ? title + ': ' : ''}${message}`),
};
