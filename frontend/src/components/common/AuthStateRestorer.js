/**
 * AuthStateRestorer.js - Component khôi phục auth state từ localStorage
 * 
 * Component này chạy khi app khởi động để khôi phục trạng thái đăng nhập
 * từ localStorage, đảm bảo user không bị logout khi reload trang.
 */

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { restoreAuthState } from '@/redux/slices/authSlice';

const AuthStateRestorer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Khôi phục auth state từ localStorage khi app khởi động
    dispatch(restoreAuthState());
  }, [dispatch]);

  return children;
};

export default AuthStateRestorer;
