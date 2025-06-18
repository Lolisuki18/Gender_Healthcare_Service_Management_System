/**
 * dateUtils.js - Date formatting utility functions
 *
 * Chức năng chính:
 * - Chuyển đổi ngày tháng giữa các format khác nhau
 * - Xử lý nhiều định dạng input khác nhau
 * - Validation và error handling
 * - Hỗ trợ format cho input field và display
 *
 * Supported input formats:
 * - Chuỗi số: "2025613", "20250613", "250613"
 * - ISO format: "2025-06-13"
 * - DD/MM/YYYY: "13/06/2025"
 * - Date objects
 *
 * Output formats:
 * - formatDateForInput: YYYY-MM-DD (HTML input date)
 * - formatDateDisplay: DD/MM/YYYY (Vietnamese display)
 */

/**
 * ✅ Format date for HTML input field - Convert to YYYY-MM-DD format
 *
 * @param {string|Date|number} dateString - Input date in various formats
 * @returns {string} Date in YYYY-MM-DD format for HTML input, or empty string if invalid
 *
 * @example
 * formatDateForInput("2025613") // "2025-06-13"
 * formatDateForInput("20250613") // "2025-06-13"
 * formatDateForInput("13/06/2025") // "2025-06-13"
 * formatDateForInput(new Date()) // "2025-06-11"
 */
export const formatDateForInput = (dateString) => {
  if (!dateString) return '';

  try {
    let date;
    const str = dateString.toString();

    console.log(
      '🔍 Debug formatDateForInput input:',
      dateString,
      'type:',
      typeof dateString
    );

    // ✅ Case 1: Chuỗi số thuần như "2025613"
    if (/^\d+$/.test(str)) {
      if (str.length === 7) {
        // Format: YYYYMDD - 2025613 = 2025-6-13
        const year = parseInt(str.substring(0, 4));
        const month = parseInt(str.substring(4, 5));
        const day = parseInt(str.substring(5, 7));
        date = new Date(year, month - 1, day);
      } else if (str.length === 8) {
        // Format: YYYYMMDD - 20250613 = 2025-06-13
        const year = parseInt(str.substring(0, 4));
        const month = parseInt(str.substring(4, 6));
        const day = parseInt(str.substring(6, 8));
        date = new Date(year, month - 1, day);
      } else if (str.length === 6) {
        // Format: YYMMDD - 250613 = 25-06-13
        let year = parseInt(str.substring(0, 2));
        year = year < 50 ? 2000 + year : 1900 + year;
        const month = parseInt(str.substring(2, 4));
        const day = parseInt(str.substring(4, 6));
        date = new Date(year, month - 1, day);
      } else {
        date = new Date(dateString);
      }
    }
    // ✅ Case 2: Already in YYYY-MM-DD format
    else if (str.includes('-') && str.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return str; // Already in correct format
    }
    // ✅ Case 3: Other formats with separators
    else if (str.includes('-')) {
      date = new Date(dateString);
    } else if (str.includes('/')) {
      const parts = str.split('/');
      if (parts.length === 3) {
        // Assume DD/MM/YYYY format
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        const year = parseInt(parts[2]);
        date = new Date(year, month - 1, day);
      }
    } else {
      date = new Date(dateString);
    }

    // ✅ Validate date
    if (isNaN(date.getTime())) {
      console.warn('⚠️ Invalid date after parsing:', dateString);
      return '';
    }

    // ✅ Format for input: YYYY-MM-DD
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    const result = `${year}-${month}-${day}`;
    console.log('✅ Formatted date for input:', result);

    return result;
  } catch (error) {
    console.error(
      '❌ Error formatting date for input:',
      error,
      'Input:',
      dateString
    );
    return '';
  }
};

/**
 * ✅ Format date for display - Convert to DD/MM/YYYY format (Vietnamese)
 *
 * @param {string|Date|number} dateString - Input date in various formats
 * @returns {string} Date in DD/MM/YYYY format for display, or error message if invalid
 *
 * @example
 * formatDateDisplay("2025613") // "13/06/2025"
 * formatDateDisplay("2025-06-13") // "13/06/2025"
 * formatDateDisplay(null) // "Chưa cập nhật"
 * formatDateDisplay("invalid") // "Lỗi định dạng ngày"
 */
export const formatDateDisplay = (dateString) => {
  if (!dateString) return 'Chưa cập nhật';

  try {
    let date;
    const str = dateString.toString();

    console.log(
      '🔍 Debug formatDateDisplay input:',
      dateString,
      'type:',
      typeof dateString
    ); // ✅ Case 1: SQL DateTime format with milliseconds (2025-06-18 13:20:24.8233330)
    if (str.includes('-') && str.includes(':')) {
      console.log('📅 Parsing SQL DateTime format:', str);

      // Trích xuất chỉ phần ngày từ chuỗi SQL DateTime
      const datePart = str.split(' ')[0]; // Lấy "2025-06-18" từ "2025-06-18 13:20:24.8233330"

      if (datePart && datePart.includes('-')) {
        const [year, month, day] = datePart
          .split('-')
          .map((part) => parseInt(part, 10));
        console.log('📅 Extracted date parts:', year, month, day);

        if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
          // Tạo Date object từ các phần đã trích xuất
          date = new Date(year, month - 1, day);
          console.log('📅 Created date object:', date);
        } else {
          // Nếu parse không thành công, thử cách tiếp cận khác
          date = new Date(datePart);
        }
      } else {
        // Fallback nếu không thể tách phần ngày
        date = new Date(str);
      }
    }
    // ✅ Case 2: Already in YYYY-MM-DD format (from input)
    else if (str.includes('-') && str.match(/^\d{4}-\d{2}-\d{2}$/)) {
      date = new Date(str);
    }
    // ✅ Case 3: Chuỗi số thuần như "2025613"
    else if (/^\d+$/.test(str)) {
      console.log('📅 Parsing number string:', str, 'length:', str.length);

      if (str.length === 7) {
        // Format: YYYYMDD - 2025613 = 2025-6-13
        const year = parseInt(str.substring(0, 4)); // 2025
        const month = parseInt(str.substring(4, 5)); // 6
        const day = parseInt(str.substring(5, 7)); // 13

        console.log('📅 Parsed:', { year, month, day });
        date = new Date(year, month - 1, day); // month - 1 vì Date object dùng 0-indexed
      } else if (str.length === 8) {
        // Format: YYYYMMDD - 20250613 = 2025-06-13
        const year = parseInt(str.substring(0, 4)); // 2025
        const month = parseInt(str.substring(4, 6)); // 06
        const day = parseInt(str.substring(6, 8)); // 13

        console.log('📅 Parsed:', { year, month, day });
        date = new Date(year, month - 1, day);
      } else if (str.length === 6) {
        // Format: YYMMDD - 250613 = 25-06-13
        let year = parseInt(str.substring(0, 2)); // 25
        year = year < 50 ? 2000 + year : 1900 + year; // 2025
        const month = parseInt(str.substring(2, 4)); // 06
        const day = parseInt(str.substring(4, 6)); // 13

        console.log('📅 Parsed:', { year, month, day });
        date = new Date(year, month - 1, day);
      } else {
        // Fallback cho length khác
        date = new Date(dateString);
      }
    }
    // ✅ Case 3: String có dấu phân cách
    else if (str.includes('-')) {
      // Format: YYYY-MM-DD hoặc DD-MM-YYYY
      date = new Date(dateString);
    } else if (str.includes('/')) {
      // Format: DD/MM/YYYY hoặc MM/DD/YYYY
      const parts = str.split('/');
      if (parts.length === 3) {
        // Giả sử format DD/MM/YYYY
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        const year = parseInt(parts[2]);
        date = new Date(year, month - 1, day);
      }
    }
    // ✅ Case 4: Fallback
    else {
      date = new Date(dateString);
    }

    // ✅ Validate date
    if (isNaN(date.getTime())) {
      console.warn('⚠️ Invalid date after parsing:', dateString);
      return 'Ngày không hợp lệ';
    }

    // ✅ Format output: DD/MM/YYYY
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    const result = `${day}/${month}/${year}`;
    console.log('✅ Final formatted date:', result);

    return result;
  } catch (error) {
    console.error('❌ Error formatting date:', error, 'Input:', dateString);
    return 'Lỗi định dạng ngày';
  }
};

/**
 * ✅ Format current date to YYYY-MM-DD for default input values
 *
 * @returns {string} Current date in YYYY-MM-DD format
 *
 * @example
 * getCurrentDateForInput() // "2025-06-11"
 */
export const getCurrentDateForInput = () => {
  return formatDateForInput(new Date());
};

/**
 * ✅ Format current date to DD/MM/YYYY for display
 *
 * @returns {string} Current date in DD/MM/YYYY format
 *
 * @example
 * getCurrentDateDisplay() // "11/06/2025"
 */
export const getCurrentDateDisplay = () => {
  return formatDateDisplay(new Date());
};

/**
 * ✅ Check if a date string is valid
 *
 * @param {string|Date|number} dateString - Input date to validate
 * @returns {boolean} True if date is valid, false otherwise
 *
 * @example
 * isValidDate("2025-06-13") // true
 * isValidDate("invalid") // false
 * isValidDate("") // false
 */
export const isValidDate = (dateString) => {
  if (!dateString) return false;

  try {
    const formatted = formatDateForInput(dateString);
    return formatted !== '';
  } catch (error) {
    return false;
  }
};

/**
 * ✅ Convert date to ISO string for API calls
 *
 * @param {string|Date|number} dateString - Input date in various formats
 * @returns {string} Date in ISO format or empty string if invalid
 *
 * @example
 * formatDateForAPI("13/06/2025") // "2025-06-13T00:00:00.000Z"
 */
export const formatDateForAPI = (dateString) => {
  if (!dateString) return '';

  try {
    const inputFormat = formatDateForInput(dateString);
    if (!inputFormat) return '';

    const date = new Date(inputFormat);
    return date.toISOString();
  } catch (error) {
    console.error('❌ Error formatting date for API:', error);
    return '';
  }
};

/**
 * ✅ Format ISO datetime to DD/MM/YYYY HH:MM format for display
 *
 * @param {string|Date} dateTimeString - Input datetime (ISO or Date object)
 * @returns {string} Formatted datetime in DD/MM/YYYY HH:MM format
 *
 * @example
 * formatDateTime("2025-06-13T14:30:00.000Z") // "13/06/2025 21:30"
 * formatDateTime(new Date()) // "11/06/2025 15:45"
 */
export const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return 'Chưa cập nhật';

  try {
    const date = new Date(dateTimeString);

    // Validate date
    if (isNaN(date.getTime())) {
      console.warn('⚠️ Invalid datetime after parsing:', dateTimeString);
      return 'Thời gian không hợp lệ';
    }

    // Format date part: DD/MM/YYYY
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    // Format time part: HH:MM
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch (error) {
    console.error(
      '❌ Error formatting datetime:',
      error,
      'Input:',
      dateTimeString
    );
    return 'Lỗi định dạng thời gian';
  }
};
