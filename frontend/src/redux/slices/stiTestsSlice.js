/**
 * stiTestsSlice.js - Quản lý state xét nghiệm STI với Redux Toolkit
 *
 * File này định nghĩa một slice trong Redux store để quản lý trạng thái
 * của các xét nghiệm STI, bao gồm danh sách xét nghiệm, trạng thái loading,
 * lọc và phân trang.
 *
 * Lý do tạo file:
 * - Tách biệt logic quản lý state xét nghiệm STI khỏi các thành phần UI
 * - Áp dụng cách tiếp cận "slice" của Redux Toolkit để giảm boilerplate code
 * - Đồng bộ hóa trạng thái xét nghiệm STI giữa các component
 */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tests: [],
  filteredTests: [],
  selectedTest: null,
  loading: false,
  error: null,
  pendingCount: 0,
  filters: {
    statusFilter: "ALL",
    paymentFilter: "ALL",
    searchTerm: "",
    dateFilter: "",
    tabValue: 0,
  },
  pagination: {
    page: 0,
    rowsPerPage: 10,
  },
};

const stiTestsSlice = createSlice({
  name: "stiTests",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setTests: (state, action) => {
      state.tests = action.payload;
      // Recalculate pending count
      state.pendingCount = action.payload.filter(
        (test) => test && test.status === "PENDING"
      ).length;
    },
    setFilteredTests: (state, action) => {
      state.filteredTests = action.payload;
    },
    setSelectedTest: (state, action) => {
      state.selectedTest = action.payload;
    },
    updateTest: (state, action) => {
      const updatedTest = action.payload;
      if (!updatedTest || !updatedTest.testId) return;

      // Update in tests array
      state.tests = state.tests.map((test) =>
        test && test.testId === updatedTest.testId ? updatedTest : test
      );

      // Update in filteredTests array
      state.filteredTests = state.filteredTests.map((test) =>
        test && test.testId === updatedTest.testId ? updatedTest : test
      );

      // Recalculate pending count
      state.pendingCount = state.tests.filter(
        (test) => test && test.status === "PENDING"
      ).length;
    },
    setStatusFilter: (state, action) => {
      state.filters.statusFilter = action.payload;
    },
    setPaymentFilter: (state, action) => {
      state.filters.paymentFilter = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.filters.searchTerm = action.payload;
    },
    setDateFilter: (state, action) => {
      state.filters.dateFilter = action.payload;
    },
    setTabValue: (state, action) => {
      state.filters.tabValue = action.payload;
    },
    resetFilters: (state) => {
      state.filters = {
        statusFilter: "ALL",
        paymentFilter: "ALL",
        searchTerm: "",
        dateFilter: "",
        tabValue: state.filters.tabValue, // Keep the current tab
      };
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    setRowsPerPage: (state, action) => {
      state.pagination.rowsPerPage = action.payload;
      state.pagination.page = 0; // Reset to first page when changing rows per page
    },
  },
});

export const {
  setLoading,
  setError,
  setTests,
  setFilteredTests,
  setSelectedTest,
  updateTest,
  setStatusFilter,
  setPaymentFilter,
  setSearchTerm,
  setDateFilter,
  setTabValue,
  resetFilters,
  setPage,
  setRowsPerPage,
} = stiTestsSlice.actions;

// Selectors
export const selectTests = (state) => state.stiTests.tests;
export const selectFilteredTests = (state) => state.stiTests.filteredTests;
export const selectSelectedTest = (state) => state.stiTests.selectedTest;
export const selectLoading = (state) => state.stiTests.loading;
export const selectError = (state) => state.stiTests.error;
export const selectPendingCount = (state) => state.stiTests.pendingCount;
export const selectFilters = (state) => state.stiTests.filters;
export const selectPagination = (state) => state.stiTests.pagination;

export default stiTestsSlice.reducer;
