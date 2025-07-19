import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, Check, X, ChevronLeft, ChevronRight, Edit, Shield, Heart, Star } from 'lucide-react';
import styles from '../styles/PillReminderPage.module.css';
import pillReminderService from '../services/pillReminderService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PillReminderHomeScreen, PillReminderFormScreen, PillReminderCalendarScreen, PillReminderConfirmModal, PillReminderDeleteConfirmModal } from '../components/PillReminder/PillReminderScreens';
import { useUser } from '../context/UserContext';
import { tr } from 'date-fns/locale';
// import Portal from '../components/common/Portal'; // Import Portal component

/**
 * @typedef {Object} PillSchedule
 * @property {string} id - ID của lịch uống thuốc
 * @property {Date} startDate - Ngày bắt đầu của chu kỳ uống thuốc
 * @property {number} pillDays - Số ngày uống thuốc trong một chu kỳ
 * @property {number} breakDays - Số ngày nghỉ trong một chu kỳ
 * @property {string} reminderTime - Thời gian nhắc nhở hàng ngày (ví dụ: "HH:MM")
 * @property {Set<string>} checkedInDates - Tập hợp các ngày đã được check-in
 */

/**
 * @typedef {Object} DayInfo
 * @property {Date} date - Đối tượng ngày cho ngày cụ thể
 * @property {'pill' | 'break' | 'future' | 'missed' | 'pending_today'} status - Trạng thái của ngày ('pill', 'break', 'future', 'missed', 'pending_today')
 * @property {boolean} isCheckedIn - Cờ cho biết ngày đã được check-in hay chưa
 * @property {boolean} isClickable - Cờ cho biết ngày có thể nhấp để check-in/hủy check-in hay không
 * @property {string} logId - ID của log uống thuốc cho ngày này, nếu có
 */

function PillReminderPage() {
  console.log("[DEBUG] PillReminderPage mounted");
  const [currentScreen, setCurrentScreen] = useState('home');
  const [schedule, setSchedule] = useState(null);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [selectedDayInfo, setSelectedDayInfo] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false); // Trạng thái mới cho modal xóa
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated, token: contextToken } = useUser(); // Thêm token từ context
  const [formData, setFormData] = useState({
    pillDays: 21,
    breakDays: 7,
    startDate: '',
    reminderTime: '09:00',
    pillType: '',
  });
  const [showFormModal, setShowFormModal] = useState(false); // State để kiểm soát hiển thị form modal
  const [isEditingForm, setIsEditingForm] = useState(false); // State để kiểm soát chế độ chỉnh sửa

  // Helper function to determine if an error should be silent
  const isSilentError = (msg) => {
    const trimmedMsg = (msg || '').trim();
    return trimmedMsg === 'Không tìm thấy lịch uống thuốc đang hoạt động cho người dùng này.' ||
           trimmedMsg === 'Bạn không có quyền truy cập lịch uống thuốc này.' ||
           trimmedMsg === 'Không tìm thấy lịch uống thuốc' ||
           trimmedMsg === 'Lỗi: Bạn không có quyền truy cập lịch uống thuốc này.'; // Thêm chính xác lỗi này
  };

  console.log("[DEBUG] Before useEffect in PillReminderPage");
  useEffect(() => {
    try {
      console.log("[DEBUG] useEffect in PillReminderPage triggered");
      const initializeSchedule = async () => {
        const storedScheduleId = localStorage.getItem('pillScheduleId');
        let token = contextToken;
        if (!token) {
          // Lấy accessToken từ localStorage dạng object
          const tokenObj = JSON.parse(localStorage.getItem('token'));
          token = tokenObj && tokenObj.accessToken ? tokenObj.accessToken : null;
          console.log("[DEBUG] contextToken null, lấy accessToken từ localStorage token object:", token);
        } else {
          console.log("[DEBUG] contextToken lấy từ context:", token);
        }
        // Không cần setIsAuthenticated ở đây nữa vì isAuthenticated được quản lý bởi context

        if (token) {
          try {
            // Fetch active schedule for current user
            const response = await pillReminderService.getActivePillSchedule();
            console.log("[DEBUG] API getActivePillSchedule response:", response);
            if (response.success && response.data) {
              const fetchedSchedule = response.data;
              // Log giá trị startDate nhận về từ backend
              console.log("[DEBUG] startDate từ backend:", fetchedSchedule.startDate);
              const scheduleObj = {
                id: fetchedSchedule.pillsId,
                // Đảm bảo set về 0h00 để so sánh chính xác
                startDate: (() => { const d = new Date(fetchedSchedule.startDate); d.setHours(0,0,0,0); return d; })(),
                pillDays: fetchedSchedule.numberDaysDrinking,
                breakDays: fetchedSchedule.numberDaysOff,
                reminderTime: `${String(fetchedSchedule.remindTime[0]).padStart(2, '0')}:${String(fetchedSchedule.remindTime[1]).padStart(2, '0')}`,
                pillType: fetchedSchedule.pillType,
                checkedInDates: new Set(),
                pillLogDataMap: new Map()
              };
              console.log("[DEBUG] setSchedule with:", scheduleObj);
              setSchedule(scheduleObj);
              fetchScheduleAndLogs(fetchedSchedule.pillsId);
            } else {
              console.log("Không tìm thấy lịch uống thuốc đang hoạt động.");
              setSchedule(null);
              // Tùy chọn: nếu có lỗi nhưng không phải lỗi không tìm thấy lịch, hiển thị toast
              if (response.message && response.message !== "Không tìm thấy lịch uống thuốc đang hoạt động cho người dùng này.") {
                toast.error(response.message);
              }
            }
          } catch (error) {
            console.error("Lỗi khi tải lịch uống thuốc đang hoạt động:", error);
            setSchedule(null);
            const errorMessage = (error.response?.data?.message || error.message || '').trim();
            if (
              errorMessage.includes("getActiveControlPillsForCurrentUser") ||
              errorMessage.includes("undefined for the type ControlPillsService")
            ) {
              toast.error('Chức năng lấy lịch uống thuốc chưa được hỗ trợ trên hệ thống. Vui lòng liên hệ quản trị viên để bổ sung backend!');
            } else if (errorMessage && errorMessage !== "Không tìm thấy lịch uống thuốc đang hoạt động cho người dùng này.") {
                toast.error('Lỗi khi tải lịch uống thuốc: ' + errorMessage);
            }
          }
        } else {
          setSchedule(null); // Không có token, không có lịch
        }
      };

      initializeSchedule();
    } catch (err) {
      console.error("[DEBUG] Error in useEffect PillReminderPage:", err);
    }
  }, []);

  const fetchScheduleAndLogs = async (id) => {
    console.log("Debug: fetchScheduleAndLogs được gọi với ID:", id);
    setIsLoading(true);
    setError(null); // Đảm bảo lỗi được reset khi fetch logs
    try {
      const [responseTrue, responseFalse] = await Promise.all([
        pillReminderService.getPillLogsByStatus(id, true),
        pillReminderService.getPillLogsByStatus(id, false)
      ]);
      console.log("[DEBUG] responseTrue:", responseTrue);
      console.log("[DEBUG] responseFalse:", responseFalse);

      let fetchedSchedule = null;
      let combinedPillLogs = [];
      let success = false;
      let message = '';

      if (responseTrue.success && responseTrue.data) {
        fetchedSchedule = responseTrue.data.controlPills;
        if (Array.isArray(responseTrue.data.pillLogs)) {
          combinedPillLogs = combinedPillLogs.concat(responseTrue.data.pillLogs);
        }
        success = true;
        message = responseTrue.message;
      }

      if (responseFalse.success && responseFalse.data) {
        // Prefer schedule from responseTrue, but if it's null, use from responseFalse
        if (!fetchedSchedule) {
            fetchedSchedule = responseFalse.data.controlPills;
        }
        if (Array.isArray(responseFalse.data.pillLogs)) {
          combinedPillLogs = combinedPillLogs.concat(responseFalse.data.pillLogs);
        }
        success = true;
        message = message || responseFalse.message; // Use responseFalse message if responseTrue didn't set one
      }
      console.log("[DEBUG] combinedPillLogs:", combinedPillLogs);
      
      if (success && fetchedSchedule) {
        // Helper: chuẩn hóa ngày về 0h00 và lấy yyyy-mm-dd
        const normalizeDateString = (dateObj) => {
          // Lấy năm, tháng, ngày theo local time, không dùng toISOString để tránh lệch múi giờ
          const year = dateObj.getFullYear();
          const month = String(dateObj.getMonth() + 1).padStart(2, '0');
          const day = String(dateObj.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };
        const pillLogDataMap = new Map();
        combinedPillLogs.forEach(log => {
            const logDateArray = log.logDate; 
            const logDate = new Date(logDateArray[0], logDateArray[1] - 1, logDateArray[2]);
            logDate.setHours(0, 0, 0, 0);
            const dateString = normalizeDateString(logDate);
            // Nếu đã có log cho ngày này, ưu tiên log có status true
            const existingLog = pillLogDataMap.get(dateString);
            if (!existingLog || (log.status && !existingLog.status)) {
                pillLogDataMap.set(dateString, log);
            }
        });
        // Debug: log ra các key và value của pillLogDataMap để kiểm tra mapping
        console.log("[DEBUG] pillLogDataMap keys:", Array.from(pillLogDataMap.keys()));
        console.log("[DEBUG] pillLogDataMap values:", Array.from(pillLogDataMap.values()));
        setSchedule(prevSchedule => {
          const newSchedule = {
            ...prevSchedule, 
            id: fetchedSchedule.pillsId, 
            // Đảm bảo set về 0h00 để so sánh chính xác
            startDate: (() => { const d = new Date(fetchedSchedule.startDate); d.setHours(0,0,0,0); return d; })(),
            pillDays: Number(fetchedSchedule.numberDaysDrinking),
            breakDays: Number(fetchedSchedule.numberDaysOff),
            reminderTime: `${String(fetchedSchedule.remindTime[0]).padStart(2, '0')}:${String(fetchedSchedule.remindTime[1]).padStart(2, '0')}`,
            pillType: fetchedSchedule.pillType || '',
            checkedInDates: new Set(), 
            pillLogDataMap: pillLogDataMap
          };
          console.log("[DEBUG] newSchedule set vào state:", newSchedule);
          return newSchedule;
        });
        // setCurrentScreen('calendar'); // Không cần thiết khi dùng modal
      } else {
        const errorMessage = (responseTrue.message || responseFalse.message || 'Lỗi khi tải lịch uống thuốc.').trim();
        setSchedule(null); // Đảm bảo schedule là null nếu tải thất bại
        // setCurrentScreen('home'); // Không cần thiết khi dùng modal
        if (isSilentError(errorMessage)) {
          setError(null);
        } else {
          toast.error(errorMessage);
          setError(errorMessage); 
        }
      }
    } catch (err) {
      console.error('Lỗi khi tìm nạp lịch và log:', err);
      setSchedule(null); // Đảm bảo schedule là null nếu tải thất bại
      // setCurrentScreen('home'); // Không cần thiết khi dùng modal
      const errorMessage = (err.response?.data?.message || err.message || '').trim();
      if (isSilentError(errorMessage)) {
        setError(null);
      } else {
        toast.error('Lỗi khi tải lịch uống thuốc: ' + errorMessage);
        setError(errorMessage); 
      }
    } finally {
      setIsLoading(false);
    }
  };

  const generateCalendarData = (schedule, monthOffset) => {
    if (!schedule || !schedule.pillLogDataMap) {
      return [];
    }
    const data = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(schedule.startDate);
    startDate.setHours(0, 0, 0, 0);
    const currentMonth = new Date(startDate.getFullYear(), startDate.getMonth() + monthOffset, 1);
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    // Đảm bảo pillDays và breakDays là số hợp lệ
    let pillDays = Number(schedule.pillDays);
    let breakDays = Number(schedule.breakDays);
    if (!Number.isFinite(pillDays) || pillDays <= 0) pillDays = 21;
    if (!Number.isFinite(breakDays) || breakDays < 0) breakDays = 7
    const cycleLength = pillDays + breakDays;
    console.log('DEBUG pillDays:', pillDays, 'breakDays:', breakDays, 'cycleLength:', cycleLength, 'startDate:', startDate.toISOString());

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      date.setHours(0, 0, 0, 0);
      const dateString = date.toLocaleDateString('sv-SE'); // yyyy-mm-dd
      const log = schedule.pillLogDataMap.get(dateString);
      const startDateString = startDate.toLocaleDateString('sv-SE');

      // Chỉ log các ngày từ ngày bắt đầu trở đi
      if (dateString >= startDateString) {
        console.log('GEN CAL:', dateString, 'log:', log, 'log.status:', log && log.status);
      }

      let status;
      let isClickable = false;
      let logId = log ? log.logId : null;
      let dayClass = '';

      // Sửa đoạn này: Các ngày trước ngày bắt đầu luôn là break, không hiển thị missed/future/pill
      if (dateString < startDateString) {
        status = 'break';
        isClickable = false;
        data.push({
          date,
          status,
          isCheckedIn: false,
          isClickable,
          logId,
          dayClass
        });
        continue;
      }

      // Tính số ngày từ ngày bắt đầu
      const daysSinceStart = Math.floor((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const dayInCycle = daysSinceStart % cycleLength;

      // Kiểm tra xem ngày có phải là ngày uống thuốc hay không
      const isPillDay = dayInCycle < pillDays;

      if (!isPillDay) {
        // Ngày nghỉ
        status = 'break';
        isClickable = false;
      } else if (date.getTime() === today.getTime()) {
        // Hôm nay: phân biệt theo giờ nhắc
        const reminderHour = parseInt(schedule.reminderTime.split(':')[0], 10);
        const reminderMinute = parseInt(schedule.reminderTime.split(':')[1], 10);
        const now = new Date();
        const reminderDateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), reminderHour, reminderMinute, 0);
        
        if (now.getTime() < reminderDateTime.getTime()) {
          // Chưa đến giờ nhắc
          status = (log && log.status) ? 'pill' : 'future';
        } else {
          // Đã qua giờ nhắc
          status = (log && log.status) ? 'pill' : 'missed';
        }
        isClickable = true;
      } else if (date.getTime() > today.getTime()) {
        // Ngày tương lai
        status = 'future';
        isClickable = false;
      } else {
        // Ngày quá khứ
        status = (log && log.status) ? 'pill' : 'missed';
        isClickable = !!log;
      }

      data.push({
        date,
        status,
        isCheckedIn: status === 'pill',
        isClickable,
        logId,
        dayClass
      });
    }
    return data;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const requestData = {
        numberDaysDrinking: Number(formData.pillDays),
        numberDaysOff: Number(formData.breakDays),
        // Đảm bảo gửi đúng format YYYY-MM-DD, không có giờ/phút/giây
        startDate: formData.startDate ? new Date(formData.startDate).toISOString().slice(0, 10) : '',
        remindTime: formData.reminderTime,
        isActive: true, // Luôn đúng theo yêu cầu
        pillType: formData.pillType,
      };
      console.log("Debug: Đang gửi dữ liệu tạo lịch:", requestData);
      const response = await pillReminderService.createPillSchedule(requestData);
      if (response.success) {
        const newSchedule = response.data;
        localStorage.setItem('pillScheduleId', newSchedule.pillsId);
        // Gọi fetchScheduleAndLogs để lấy toàn bộ dữ liệu, bao gồm cả logs
        await fetchScheduleAndLogs(newSchedule.pillsId);
        setShowFormModal(false); // Đóng modal sau khi tạo và fetch thành công
        toast.success('Lịch uống thuốc đã được tạo thành công!');
      } else {
        const errorMessage = (response.message || 'Lỗi khi tạo lịch uống thuốc.').trim();
        toast.error(errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Lỗi khi tạo lịch:', err);
      console.error('Phản hồi lỗi đầy đủ từ backend:', err.response?.data);
      const errorMessage = (err.response?.data?.message || err.message || '').trim();
      toast.error('Lỗi khi tạo lịch uống thuốc: ' + errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!schedule || !schedule.id) return; // Đảm bảo schedule và schedule.id tồn tại
    setIsLoading(true);
    setError(null);
    try {
      const requestData = {
        numberDaysDrinking: Number(formData.pillDays),
        numberDaysOff: Number(formData.breakDays),
        startDate: formData.startDate,
        remindTime: formData.reminderTime,
        pillType: formData.pillType,
      };
      console.log("Debug: Đang gửi yêu cầu cập nhật lịch cho ID:", schedule.id, "với dữ liệu:", requestData);
      const response = await pillReminderService.updatePillSchedule(schedule.id, requestData);
      if (response.success) {
        const updatedBackendSchedule = response.data;
        // Fetch lại logs mới nhất sau khi cập nhật lịch và cập nhật schedule từ backend
        await fetchScheduleAndLogs(updatedBackendSchedule.pillsId);
        // Đảm bảo schedule đã được cập nhật xong mới đóng modal
        setTimeout(() => {
          setShowFormModal(false); // Đóng modal sau khi cập nhật thành công
        }, 100); // Đợi 1 chút để state cập nhật xong
        toast.success('Lịch uống thuốc đã được cập nhật thành công!');
      } else {
        const errorMessage = (response.message || 'Failed to update schedule.').trim();
        toast.error(errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Lỗi khi cập nhật lịch:', err);
      const errorMessage = (err.response?.data?.message || err.message || '').trim();
      toast.error('Lỗi khi cập nhật lịch uống thuốc: ' + errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddScheduleClick = () => {
    setFormData({
      pillDays: 21,
      breakDays: 7,
      startDate: '',
      reminderTime: '09:00',
      pillType: '',
    });
    setIsEditingForm(false);
    setShowFormModal(true);
  };

  const handleEditClick = () => {
    if (!schedule) return;
    setFormData({
      pillDays: schedule.pillDays || 21,
      breakDays: schedule.breakDays || 7,
      // Đảm bảo format YYYY-MM-DD
      startDate: schedule.startDate ? new Date(schedule.startDate).toISOString().slice(0, 10) : '',
      reminderTime: schedule.reminderTime || '09:00',
      pillType: schedule.pillType || '',
    });
    setIsEditingForm(true);
    setShowFormModal(true);
  };

  const handleBackFromForm = () => {
    setShowFormModal(false);
  };

  const handleCheckIn = async (dayInfo) => {
    if (!schedule || !dayInfo.logId) return; // Ensure logId exists
    setIsLoading(true);
    setError(null);

    try {
      // Send logId to backend
      const response = await pillReminderService.updateCheckIn(dayInfo.logId);
      console.log('Check-in Response:', response); // Debug log
      if (response.success) {
        // Nếu bỏ check-in (status = false), cập nhật lại log tương ứng trong pillLogDataMap
        if (response.data && response.data.status === false && schedule.pillLogDataMap) {
          // Tìm ngày tương ứng với logId
          for (const [dateKey, log] of schedule.pillLogDataMap.entries()) {
            if (log.logId === dayInfo.logId) {
              log.checkIn = null;
              log.status = false;
              schedule.pillLogDataMap.set(dateKey, log);
              break;
            }
          }
        }
        // Thêm delay 500ms trước khi fetch lại logs để backend kịp cập nhật
        await new Promise(resolve => setTimeout(resolve, 500));
        await fetchScheduleAndLogs(schedule.id);
        // Sửa lại logic toast: dựa vào trạng thái trước khi gọi API
        if (dayInfo.isCheckedIn) {
          toast.success('Đã hủy check-in cho ngày này.');
        } else {
          toast.success('Đã check-in thành công!');
        }
      } else {
        const errorMessage = (response.message || 'Lỗi khi check-in.').trim();
        toast.error(errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Lỗi trong quá trình check-in:', err);
      const errorMessage = (err.response?.data?.message || err.message || '').trim();
      toast.error('Lỗi khi check-in: ' + errorMessage);
      setError(errorMessage);
    } finally {
      setShowConfirmModal(false);
      setIsLoading(false);
    }
  };

  const handleDateClick = (dayInfo) => {
    // Cho phép check-in cho ngày hiện tại và các ngày đã qua (nếu có log)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dayInfo.isClickable && dayInfo.date.getTime() <= today.getTime()) {
      setSelectedDayInfo(dayInfo);
      setShowConfirmModal(true);
    }
  };

  const handleDeleteSchedule = () => {
    setShowDeleteConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!schedule || !schedule.id) return; // Đảm bảo schedule và schedule.id tồn tại
    setIsLoading(true);
    setError(null);
    try {
      const response = await pillReminderService.deleteControlPills(schedule.id);
      if (response.success) {
        localStorage.removeItem('pillScheduleId');
        setSchedule(null);
        setCurrentScreen('home'); // Điều hướng trở lại màn màn hình chính sau khi xóa
        toast.success('Lịch uống thuốc đã được xóa thành công!');
      } else {
        const errorMessage = (response.message || 'Failed to delete schedule.').trim();
        // Vẫn hiển thị toast và set error cho lỗi xóa lịch
        toast.error(errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Lỗi khi xóa lịch:', err);
      const errorMessage = (err.response?.data?.message || err.message || '').trim();
      // Vẫn hiển thị toast và set error cho lỗi xóa lịch
      toast.error('Lỗi khi xóa lịch uống thuốc: ' + errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setShowDeleteConfirmModal(false);
    }
  };

  return (
    <div className="font-sans">
      {isLoading && <div className={styles.loadingOverlay}></div>}
      {error && !isSilentError(error) && <div className={styles.errorOverlay}>Lỗi: {error}</div>}

      {schedule ? (
        <PillReminderCalendarScreen
          schedule={schedule}
          currentMonthIndex={currentMonthIndex}
          setCurrentMonthIndex={setCurrentMonthIndex}
          generateCalendarData={generateCalendarData}
          handleDateClick={isLoading ? () => {} : handleDateClick} // Disable check-in khi loading
          handleEditClick={isLoading ? () => {} : handleEditClick} // Disable edit khi loading
          onDeleteSchedule={isLoading ? () => {} : handleDeleteSchedule} // Disable delete khi loading
          isLoading={isLoading} // Truyền prop này xuống
        />
      ) : (
        <PillReminderHomeScreen onAddSchedule={handleAddScheduleClick} isAuthenticated={isAuthenticated} />
      )}

      {showFormModal && (
        <div className={styles.fullScreenFormContainer}>
          {console.log("Debug: formData in PillReminderPage before passing to form screen:", formData)}
          <PillReminderFormScreen
            formData={formData}
            onFormChange={(field, value) => {
              console.log(`Debug: Updating field '${field}' with value '${value}'`); // Add this log
              setFormData(prevData => ({ ...prevData, [field]: value }));
            }}
            onFormSubmit={isEditingForm ? handleEditSubmit : handleFormSubmit}
            onBackClick={handleBackFromForm}
            isEditing={isEditingForm}
          />
        </div>
      )}

      <PillReminderConfirmModal
        showConfirmModal={showConfirmModal}
        selectedDayInfo={selectedDayInfo}
        onCancel={() => { setShowConfirmModal(false); setSelectedDayInfo(null); }}
        onConfirm={() => { handleCheckIn(selectedDayInfo); setShowConfirmModal(false); }}
      />
      <PillReminderDeleteConfirmModal
        showDeleteConfirmModal={showDeleteConfirmModal}
        onCancelDelete={() => setShowDeleteConfirmModal(false)}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
}

export default PillReminderPage;