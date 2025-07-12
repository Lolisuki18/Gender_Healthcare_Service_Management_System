/**
 * stiTestsThunks.js - Redux thunks cho các tác vụ liên quan đến xét nghiệm STI
 *
 * File này cung cấp các thunks để thực hiện các tác vụ bất đồng bộ
 * liên quan đến quản lý xét nghiệm STI
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getStaffTests as fetchStaffTests,
  getPendingTests as fetchPendingTests,
  getConfirmedTests as fetchConfirmedTests,
  confirmTest as confirmTestApi,
  sampleTest as sampleTestApi,
  addTestResults as addTestResultsApi,
  completeTest as completeTestApi,
  cancelSTITest as cancelSTITestApi,
  getTestResultsByTestId as getTestResultsByTestIdApi,
  getPackageTestDetails as getPackageTestDetailsApi,
  getTestPDF as getTestPDFApi,
} from '@/services/stiService';

import {
  setLoading,
  setError,
  setTests,
  updateTest,
} from '@/redux/slices/stiTestsSlice';
import { notify } from '@/utils/notify';

/**
 * Fetch STI tests based on status
 */
export const fetchTests = createAsyncThunk(
  'stiTests/fetchTests',
  async (tabValue, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      let response;
      switch (tabValue) {
        case 0: // All tests
          response = await fetchStaffTests();
          break;
        case 1: // Pending tests
          response = await fetchPendingTests();
          break;
        case 2: // Confirmed tests
          response = await fetchConfirmedTests();
          break;
        case 3: // Sampled tests
        case 4: // Resulted tests
        case 5: // Completed tests
          // Fetch all tests and filter by status in the component
          response = await fetchStaffTests();
          break;
        default:
          response = await fetchStaffTests();
      }

      if (response && response.status === 'SUCCESS') {
        const testsData = response.data || [];
        dispatch(setTests(testsData));
      } else if (response && response.data) {
        const testsData = response.data || [];
        dispatch(setTests(testsData));
      } else {
        dispatch(
          setError(response?.message || 'Không thể lấy danh sách xét nghiệm')
        );
      }
    } catch (err) {
      const errorMsg =
        'Đã xảy ra lỗi khi tải dữ liệu: ' +
        (err.message || 'Lỗi không xác định');
      dispatch(setError(errorMsg));
      console.error('Error fetching tests:', err);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

/**
 * Confirm an STI test
 */
export const confirmTest = createAsyncThunk(
  'stiTests/confirmTest',
  async (testId, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await confirmTestApi(testId);
      if (response.status === 'SUCCESS') {
        dispatch(updateTest(response.data));
        notify({
          type: 'success',
          message: 'Xác nhận xét nghiệm thành công',
        });
        return response.data;
      } else {
        dispatch(setError(response.message || 'Không thể xác nhận xét nghiệm'));
        notify({
          type: 'error',
          message: response.message || 'Không thể xác nhận xét nghiệm',
        });
        return null;
      }
    } catch (err) {
      const errorMsg =
        'Lỗi khi xác nhận xét nghiệm: ' + (err.message || 'Lỗi không xác định');
      dispatch(setError(errorMsg));
      notify({
        type: 'error',
        message: errorMsg,
      });
      console.error('Error confirming test:', err);
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

/**
 * Sample an STI test
 */
export const sampleTest = createAsyncThunk(
  'stiTests/sampleTest',
  async (testId, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await sampleTestApi(testId);
      if (response.status === 'SUCCESS') {
        dispatch(updateTest(response.data));
        notify({
          type: 'success',
          message: 'Cập nhật trạng thái lấy mẫu thành công',
        });
        return response.data;
      } else {
        dispatch(
          setError(response.message || 'Không thể cập nhật trạng thái lấy mẫu')
        );
        notify({
          type: 'error',
          message: response.message || 'Không thể cập nhật trạng thái lấy mẫu',
        });
        return null;
      }
    } catch (err) {
      const errorMsg =
        'Lỗi khi cập nhật trạng thái lấy mẫu: ' +
        (err.message || 'Lỗi không xác định');
      dispatch(setError(errorMsg));
      notify({
        type: 'error',
        message: errorMsg,
      });
      console.error('Error sampling test:', err);
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

/**
 * Add results to an STI test
 */
export const addTestResults = createAsyncThunk(
  'stiTests/addTestResults',
  async ({ testId, resultData }, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      // Format according to TestResultRequest
      const formattedResults = resultData.map((result) => ({
        componentId: result.componentId,
        resultValue: result.resultValue,
        normalRange: result.normalRange,
        unit: result.unit,
      }));

      const response = await addTestResultsApi(testId, {
        status: 'RESULTED',
        results: formattedResults,
      });

      if (response.status === 'SUCCESS') {
        dispatch(updateTest(response.data));
        notify({
          type: 'success',
          message: 'Cập nhật kết quả xét nghiệm thành công',
        });
        return response.data;
      } else {
        dispatch(
          setError(response.message || 'Không thể cập nhật kết quả xét nghiệm')
        );
        notify({
          type: 'error',
          message: response.message || 'Không thể cập nhật kết quả xét nghiệm',
        });
        return null;
      }
    } catch (err) {
      const errorMsg =
        'Lỗi khi cập nhật kết quả: ' + (err.message || 'Lỗi không xác định');
      dispatch(setError(errorMsg));
      notify({
        type: 'error',
        message: errorMsg,
      });
      console.error('Error adding results:', err);
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

/**
 * Complete an STI test
 */
export const completeTest = createAsyncThunk(
  'stiTests/completeTest',
  async (testId, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await completeTestApi(testId);
      if (response.status === 'SUCCESS') {
        dispatch(updateTest(response.data));
        notify({
          type: 'success',
          message: 'Hoàn thành xét nghiệm thành công',
        });
        return response.data;
      } else {
        dispatch(
          setError(response.message || 'Không thể hoàn thành xét nghiệm')
        );
        notify({
          type: 'error',
          message: response.message || 'Không thể hoàn thành xét nghiệm',
        });
        return null;
      }
    } catch (err) {
      const errorMsg =
        'Lỗi khi hoàn thành xét nghiệm: ' +
        (err.message || 'Lỗi không xác định');
      dispatch(setError(errorMsg));
      notify({
        type: 'error',
        message: errorMsg,
      });
      console.error('Error completing test:', err);
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

/**
 * Cancel an STI test
 */
export const cancelTest = createAsyncThunk(
  'stiTests/cancelTest',
  async (testId, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await cancelSTITestApi(testId);
      if (response.status === 'SUCCESS') {
        dispatch(updateTest(response.data));
        notify({
          type: 'success',
          message: 'Hủy xét nghiệm thành công',
        });
        return response.data;
      } else {
        dispatch(setError(response.message || 'Không thể hủy xét nghiệm'));
        notify({
          type: 'error',
          message: response.message || 'Không thể hủy xét nghiệm',
        });
        return null;
      }
    } catch (err) {
      const errorMsg =
        'Lỗi khi hủy xét nghiệm: ' + (err.message || 'Lỗi không xác định');
      dispatch(setError(errorMsg));
      notify({
        type: 'error',
        message: errorMsg,
      });
      console.error('Error canceling test:', err);
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

/**
 * Get test results by test ID
 */
export const getTestResults = createAsyncThunk(
  'stiTests/getTestResults',
  async (testId, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await getTestResultsByTestIdApi(testId);
      if (response && (response.status === 'SUCCESS' || response.data)) {
        const results = response.data || response;
        return results;
      }
      return null;
    } catch (err) {
      console.error('Error fetching test results:', err);
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

/**
 * Get package test details
 */
export const getPackageTestDetails = createAsyncThunk(
  'stiTests/getPackageTestDetails',
  async (testId, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await getPackageTestDetailsApi(testId);
      if (response && (response.status === 'SUCCESS' || response.data)) {
        const packageData = response.data || response;
        return packageData;
      }
      return null;
    } catch (err) {
      console.error('Error fetching package details:', err);
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

/**
 * Export test results to PDF
 */
export const exportTestResultsToPDF = createAsyncThunk(
  'stiTests/exportTestResultsToPDF',
  async (testId, { dispatch, getState }) => {
    dispatch(setLoading(true));
    try {
      // Implementation will depend on your API
      // This is a placeholder
      notify({
        type: 'success',
        message: `Đã xuất kết quả xét nghiệm #${testId} thành công!`,
      });
      return true;
    } catch (err) {
      const errorMsg =
        'Lỗi khi xuất kết quả xét nghiệm: ' +
        (err.message || 'Lỗi không xác định');
      dispatch(setError(errorMsg));
      notify({
        type: 'error',
        message: errorMsg,
      });
      console.error('Error exporting test results to PDF:', err);
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }
);
