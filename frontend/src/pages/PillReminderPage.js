import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, Check, X, ChevronLeft, ChevronRight, Edit, Shield, Heart, Star } from 'lucide-react';
import styles from '../styles/PillReminderPage.module.css';
import pillReminderService from '../services/pillReminderService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PillReminderHomeScreen, PillReminderFormScreen, PillReminderCalendarScreen, PillReminderConfirmModal, PillReminderDeleteConfirmModal } from '../components/PillReminder/PillReminderScreens';
import { useUser } from '../context/UserContext';

/**
 * @typedef {Object} PillSchedule
 * @property {string} id
 * @property {Date} startDate
 * @property {number} pillDays
 * @property {number} breakDays
 * @property {string} reminderTime
 * @property {Set<string>} checkedInDates
 */

/**
 * @typedef {Object} DayInfo
 * @property {Date} date
 * @property {'pill' | 'break' | 'future' | 'missed'} status
 * @property {boolean} isCheckedIn
 * @property {boolean} isClickable
 */

function PillReminderPage() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [schedule, setSchedule] = useState(null);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [selectedDayInfo, setSelectedDayInfo] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false); // New state for delete modal
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useUser();
  const [formData, setFormData] = useState({
    pillDays: 21,
    breakDays: 7,
    startDate: '',
    reminderTime: '09:00',
    placebo: false // Add placebo to form data
  });

  useEffect(() => {
    const savedScheduleId = localStorage.getItem('pillScheduleId');
    if (savedScheduleId && savedScheduleId !== 'undefined' && savedScheduleId !== 'null') {
      // Optimistically set to calendar. If fetch fails, fetchScheduleAndLogs will revert to 'home'.
      setCurrentScreen('calendar');
      fetchScheduleAndLogs(savedScheduleId);
    } else {
      // If no valid ID, ensure we are on the home screen to allow creation
      setCurrentScreen('home');
    }
  }, []);

  const fetchScheduleAndLogs = async (id) => {
    console.log("Debug: fetchScheduleAndLogs called with ID:", id);
    setIsLoading(true);
    setError(null);
    try {
      const response = await pillReminderService.getPillLogs(id);
      console.log("Debug: Full API response for getPillLogs:", response);

      if (response.success && response.data) {
        const fetchedSchedule = response.data.controlPills;
        const fetchedPillLogs = response.data.pillLogs;

        console.log("Debug: fetchedSchedule from API response:", fetchedSchedule);
        console.log("Debug: fetchedPillLogs from API response:", fetchedPillLogs);

        if (!fetchedSchedule) {
            console.error("Fetched schedule is null or undefined.");
            setCurrentScreen('home');
            toast.error('Lỗi: Không tìm thấy thông tin lịch uống thuốc.');
            return;
        }

        const pillLogDataMap = new Map();
        if (fetchedPillLogs && Array.isArray(fetchedPillLogs)) {
            fetchedPillLogs.forEach(log => {
                const logDate = new Date(log.logDate);
                logDate.setHours(0, 0, 0, 0);
                const dateString = logDate.toISOString().split('T')[0];
                pillLogDataMap.set(dateString, log);
            });
            console.log("Debug: pillLogDataMap after processing logs:", pillLogDataMap);
        } else {
            console.warn("Fetched pill logs are empty or not an array.");
            console.log("Debug: fetchedPillLogs that caused warning:", fetchedPillLogs);
        }
        
        setSchedule({
          id: fetchedSchedule.pillsId, // Sửa từ .id thành .pillsId
          startDate: new Date(fetchedSchedule.startDate),
          pillDays: fetchedSchedule.pillDays,
          breakDays: fetchedSchedule.breakDays,
          reminderTime: `${String(fetchedSchedule.remindTime[0]).padStart(2, '0')}:${String(fetchedSchedule.remindTime[1]).padStart(2, '0')}`,
          placebo: fetchedSchedule.placebo || false,
          checkedInDates: new Set(), 
          pillLogDataMap: pillLogDataMap
        });
        setCurrentScreen('calendar');
        toast.success('Lịch uống thuốc đã được tải thành công!');
      } else {
        setCurrentScreen('home');
        setError(response.message || 'Failed to fetch schedule and logs.');
        toast.error(response.message || 'Lỗi khi tải lịch uống thuốc.');
      }
    } catch (err) {
      console.error('Error fetching schedule and logs:', err);
      setError('Error fetching schedule and logs.');
      toast.error('Lỗi khi tải lịch uống thuốc: ' + (err.response?.data?.message || err.message));
      setCurrentScreen('home');
    } finally {
      setIsLoading(false);
    }
  };

  const generateCalendarData = (schedule, monthOffset) => {
    // Add a defensive check for schedule and pillLogDataMap
    if (!schedule || !schedule.pillLogDataMap) {
      console.warn("Schedule or pillLogDataMap is undefined, returning empty calendar data.");
      console.log("Debug: schedule at generateCalendarData", schedule);
      return [];
    }

    console.log("Debug: schedule.pillLogDataMap at generateCalendarData", schedule.pillLogDataMap);
    const data = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(schedule.startDate);
    startDate.setHours(0, 0, 0, 0);
    const currentMonth = new Date(startDate.getFullYear(), startDate.getMonth() + monthOffset, 1);
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      date.setHours(0, 0, 0, 0);
      const dateString = date.toISOString().split('T')[0];
      const log = schedule.pillLogDataMap.get(dateString); // Get the full log for this date

      let status;
      let isClickable = false;
      let logId = log ? log.logId : null; // Get logId if log exists

      if (log) { // This day has a corresponding log entry
        isClickable = true; // All days with logs are clickable for check-in/un-check-in

        if (date.getTime() < today.getTime()) { // Past days
          status = log.status ? 'pill' : 'missed';
        } else if (date.getTime() === today.getTime()) { // Today
          status = log.status ? 'pill' : 'missed';
        } else { // Future days
          status = 'future';
        }
      } else { // This day does not have a corresponding log entry (likely a break day or before start date)
        // Determine if it's a break day based on the cycle logic relative to startDate
        const daysSinceStart = Math.floor((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceStart >= 0) {
          const cycleLength = schedule.pillDays + schedule.breakDays;
          const dayInCycle = daysSinceStart % cycleLength;
          if (dayInCycle >= schedule.pillDays) { // This is a calculated break day
            status = 'break';
          } else {
            // This implies a pill day without a log entry. This shouldn't happen if generatePillLogs works correctly.
            // For safety, mark as future or missed if before/after today
            if (date.getTime() < today.getTime()) {
              status = 'missed'; // A pill day that should have had a log but didn't and is in the past
            } else {
              status = 'future'; // A pill day that should have had a log but didn't and is in the future
            }
          }
        } else {
          status = 'break'; // Days before the start date are treated as break days
        }
        isClickable = false; // Days without explicit log entries are not clickable for check-in
      }

      data.push({
        date,
        status,
        isCheckedIn: log ? log.status : false, // Reflect actual check-in status from log
        isClickable,
        logId // Include logId for check-in actions
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
        numberDaysDrinking: formData.pillDays,
        numberDaysOff: formData.breakDays,
        startDate: formData.startDate, // YYYY-MM-DD
        remindTime: formData.reminderTime, // HH:MM
        isActive: true, // Always true as per requirement
        placebo: formData.placebo // Send placebo value from form
      };
      const response = await pillReminderService.createPillSchedule(requestData);
      if (response.success) {
        const newSchedule = response.data;
        localStorage.setItem('pillScheduleId', newSchedule.pillsId);
        setSchedule({
          id: newSchedule.pillsId,
          startDate: new Date(newSchedule.startDate),
          pillDays: newSchedule.pillDays,
          breakDays: newSchedule.breakDays,
          reminderTime: `${String(newSchedule.remindTime[0]).padStart(2, '0')}:${String(newSchedule.remindTime[1]).padStart(2, '0')}`,
          checkedInDates: new Set(), // New schedule, no check-ins yet for old checkedInDates
          pillLogDataMap: new Map() // Initialize pillLogDataMap as an empty Map for a new schedule
        });
        setCurrentScreen('calendar');
        toast.success('Lịch uống thuốc đã được tạo thành công!');
      } else {
        setError(response.message || 'Failed to create schedule.');
        toast.error(response.message || 'Lỗi khi tạo lịch uống thuốc.');
      }
    } catch (err) {
      console.error('Error creating schedule:', err);
      console.error('Full error response from backend:', err.response?.data);
      setError('Error creating schedule.');
      toast.error('Lỗi khi tạo lịch uống thuốc: ' + (err.response?.data?.message || err.message));
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
        numberDaysDrinking: formData.pillDays,
        numberDaysOff: formData.breakDays,
        startDate: formData.startDate,
        remindTime: formData.reminderTime,
        placebo: formData.placebo // Đảm bảo placebo cũng được gửi
      };
      console.log("Debug: Sending update schedule request for ID:", schedule.id, "with data:", requestData);
      const response = await pillReminderService.updatePillSchedule(schedule.id, requestData);
      if (response.success) {
        const updatedBackendSchedule = response.data;
        setSchedule({
          ...schedule,
          startDate: new Date(updatedBackendSchedule.startDate),
          pillDays: updatedBackendSchedule.pillDays,
          breakDays: updatedBackendSchedule.breakDays,
          reminderTime: `${String(updatedBackendSchedule.remindTime[0]).padStart(2, '0')}:${String(updatedBackendSchedule.remindTime[1]).padStart(2, '0')}`,
          // checkedInDates should remain as is, as backend update doesn't change it directly
        });
        setCurrentScreen('calendar');
        toast.success('Lịch uống thuốc đã được cập nhật thành công!');
      } else {
        setError(response.message || 'Failed to update schedule.');
        toast.error(response.message || 'Lỗi khi cập nhật lịch uống thuốc.');
      }
    } catch (err) {
      console.error('Error updating schedule:', err);
      setError('Error updating schedule.');
      toast.error('Lỗi khi cập nhật lịch uống thuốc: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = () => {
    if (!schedule) return;
    setFormData({
      pillDays: schedule.pillDays || 21, // Cung cấp giá trị mặc định
      breakDays: schedule.breakDays || 7, // Cung cấp giá trị mặc định
      startDate: schedule.startDate ? schedule.startDate.toISOString().split('T')[0] : '',
      reminderTime: schedule.reminderTime || '09:00',
      placebo: schedule.placebo || false
    });
    setCurrentScreen('edit');
  };

  const handleCheckIn = async (dayInfo) => {
    if (!schedule || !dayInfo.logId) return; // Ensure logId exists
    setIsLoading(true);
    setError(null);
    const dateString = dayInfo.date.toISOString().split('T')[0];
    const newPillLogDataMap = new Map(schedule.pillLogDataMap);

    try {
      // Pass the specific logId to the backend
      const response = await pillReminderService.updateCheckIn(dayInfo.logId);
      if (response.success) {
        const updatedLog = response.data; // Backend should return the updated log
        console.log("Debug: Received updatedLog from backend:", updatedLog);
        newPillLogDataMap.set(dateString, updatedLog);

        setSchedule(prevSchedule => ({
          ...prevSchedule,
          pillLogDataMap: newPillLogDataMap,
        }));
        console.log("Debug: schedule state updated with new pillLogDataMap.");
        toast.success(updatedLog.status ? 'Đã check-in thành công!' : 'Đã hủy check-in cho ngày này.');
      } else {
        toast.error(response.message || 'Lỗi khi check-in.');
      }
    } catch (err) {
      console.error('Error during check-in:', err);
      setError('Error during check-in.');
      toast.error('Lỗi khi check-in: ' + (err.response?.data?.message || err.message));
    } finally {
      setShowConfirmModal(false);
      setIsLoading(false);
    }
  };

  const handleDateClick = (dayInfo) => {
    if (dayInfo.isClickable) {
      setSelectedDayInfo(dayInfo);
      setShowConfirmModal(true); // Always show confirm modal for clickable dates
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
      const response = await pillReminderService.deletePillSchedule(schedule.id);
      if (response.success) {
        localStorage.removeItem('pillScheduleId');
        setSchedule(null);
        setCurrentScreen('home'); // Navigate back to home screen after deletion
        toast.success('Lịch uống thuốc đã được xóa thành công!');
      } else {
        setError(response.message || 'Failed to delete schedule.');
        toast.error(response.message || 'Lỗi khi xóa lịch uống thuốc.');
      }
    } catch (err) {
      console.error('Error deleting schedule:', err);
      setError('Error deleting schedule.');
      toast.error('Lỗi khi xóa lịch uống thuốc: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
      setShowDeleteConfirmModal(false);
    }
  };

  return (
    <div className="font-sans">
      {isLoading && <div className={styles.loadingOverlay}>Đang tải...</div>}
      {error && <div className={styles.errorOverlay}>Lỗi: {error}</div>}
      {currentScreen === 'home' && <PillReminderHomeScreen onAddSchedule={() => setCurrentScreen('form')} isAuthenticated={isAuthenticated} />}
      {currentScreen === 'form' && (
        <PillReminderFormScreen
          formData={formData}
          onFormChange={(field, value) => setFormData({ ...formData, [field]: value })}
          onFormSubmit={handleFormSubmit}
          onBackClick={() => setCurrentScreen(schedule ? 'calendar' : 'home')}
          isEditing={false}
        />
      )}
      {currentScreen === 'edit' && (
        <PillReminderFormScreen
          formData={formData}
          onFormChange={(field, value) => setFormData({ ...formData, [field]: value })}
          onFormSubmit={handleEditSubmit}
          onBackClick={() => setCurrentScreen('calendar')}
          isEditing={true}
        />
      )}
      {currentScreen === 'calendar' && (
        <PillReminderCalendarScreen
          schedule={schedule}
          currentMonthIndex={currentMonthIndex}
          setCurrentMonthIndex={setCurrentMonthIndex}
          generateCalendarData={generateCalendarData}
          handleDateClick={handleDateClick}
          handleEditClick={handleEditClick}
          onDeleteSchedule={handleDeleteSchedule} // Pass delete handler
        />
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