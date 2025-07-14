import React, { useState, useEffect } from 'react';
import styles from '../styles/PillReminderPage.module.css';
import pillReminderService from '../services/pillReminderService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  PillReminderHomeScreen,
  PillReminderFormScreen,
  PillReminderCalendarScreen,
  PillReminderConfirmModal,
  PillReminderDeleteConfirmModal,
} from '../components/PillReminder/PillReminderScreens';
import { useUser } from '../context/UserContext';

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
  const [currentScreen, setCurrentScreen] = useState('home');
  const [schedule, setSchedule] = useState(null);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [selectedDayInfo, setSelectedDayInfo] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false); // Trạng thái mới cho modal xóa
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useUser();
  const [formData, setFormData] = useState({
    pillDays: 21,
    breakDays: 7,
    startDate: '',
    reminderTime: '09:00',
    placebo: false, // Thêm placebo vào dữ liệu form
  });

  useEffect(() => {
    const initializeSchedule = async () => {
      setIsLoading(true);
      let scheduleIdToFetch = localStorage.getItem('pillScheduleId');

      if (
        !scheduleIdToFetch ||
        scheduleIdToFetch === 'undefined' ||
        scheduleIdToFetch === 'null'
      ) {
        console.log(
          'Debug: Không tìm thấy pillScheduleId hợp lệ trong localStorage. Đang cố gắng lấy lịch hoạt động từ backend...'
        );
        try {
          const response = await pillReminderService.getActivePillSchedule(); // Gọi API mới
          if (response.success && response.data && response.data.controlPills) {
            scheduleIdToFetch = response.data.controlPills.pillsId; // Lấy ID từ phản hồi
            localStorage.setItem('pillScheduleId', scheduleIdToFetch); // Lưu vào localStorage
            console.log(
              'Debug: Đã tìm thấy lịch hoạt động từ backend. ID:',
              scheduleIdToFetch
            );
          } else {
            console.log(
              'Debug: Không tìm thấy lịch hoạt động từ backend.',
              response.message
            );
          }
        } catch (err) {
          console.error('Lỗi khi lấy lịch hoạt động từ backend:', err);
        }
      }

      if (
        scheduleIdToFetch &&
        scheduleIdToFetch !== 'undefined' &&
        scheduleIdToFetch !== 'null'
      ) {
        setCurrentScreen('calendar');
        fetchScheduleAndLogs(scheduleIdToFetch);
      } else {
        console.log(
          'Debug: Không tìm thấy pillScheduleId hợp lệ sau khi kiểm tra localStorage và backend. Chuyển về màn hình home.'
        );
        setCurrentScreen('home');
        setIsLoading(false); // Đảm bảo isLoading được đặt thành false ngay cả khi không có lịch
      }
    };

    initializeSchedule();
  }, []);

  const fetchScheduleAndLogs = async (id) => {
    console.log('Debug: fetchScheduleAndLogs được gọi với ID:', id);
    setIsLoading(true);
    setError(null);
    try {
      const response = await pillReminderService.getPillLogs(id);
      console.log('Debug: Phản hồi API đầy đủ cho getPillLogs:', response);

      if (response.success && response.data) {
        const fetchedSchedule = response.data.controlPills;
        const fetchedPillLogs = response.data.pillLogs;

        console.log('Debug: fetchedSchedule từ phản hồi API:', fetchedSchedule);
        console.log('Debug: fetchedPillLogs từ phản hồi API:', fetchedPillLogs);

        if (!fetchedSchedule) {
          console.error('Lịch đã tìm nạp là null hoặc không xác định.');
          setCurrentScreen('home');
          toast.error('Lỗi: Không tìm thấy thông tin lịch uống thuốc.');
          return;
        }

        const pillLogDataMap = new Map();
        if (fetchedPillLogs && Array.isArray(fetchedPillLogs)) {
          fetchedPillLogs.forEach((log) => {
            // Chuyển đổi logDate từ [năm, tháng, ngày] sang đối tượng Date
            // Trừ đi 1 từ tháng vì JavaScript đếm tháng từ 0 (tháng 0 là tháng 1)
            const logDateArray = log.logDate;
            const logDate = new Date(
              logDateArray[0],
              logDateArray[1] - 1,
              logDateArray[2]
            );
            logDate.setHours(0, 0, 0, 0);
            // Sử dụng định dạng YYYY-MM-DD cục bộ để đảm bảo khớp với cách tạo dateString trong generateCalendarData
            const dateString = logDate.toISOString().split('T')[0];

            // Lấy log hiện có cho ngày này, nếu có
            const existingLog = pillLogDataMap.get(dateString);

            // Nếu không có log hiện có HOẶC log mới đã check-in và log hiện có chưa check-in
            if (!existingLog || (log.status && !existingLog.status)) {
              pillLogDataMap.set(dateString, log);
            }
          });
          console.log(
            'Debug: pillLogDataMap sau khi xử lý log:',
            pillLogDataMap
          );
          console.log(
            'Debug: pillLogDataMap cho ngày 2025-07-12:',
            pillLogDataMap.get('2025-07-12')
          );
        } else {
          console.warn(
            'Log uống thuốc đã tìm nạp trống hoặc không phải là một mảng.'
          );
          console.log(
            'Debug: fetchedPillLogs gây ra cảnh báo:',
            fetchedPillLogs
          );
        }

        setSchedule({
          id: fetchedSchedule.pillsId, // Đổi từ .id thành .pillsId để khớp với API
          startDate: new Date(fetchedSchedule.startDate),
          pillDays: fetchedSchedule.pillDays,
          breakDays: fetchedSchedule.breakDays,
          reminderTime: `${String(fetchedSchedule.remindTime[0]).padStart(2, '0')}:${String(fetchedSchedule.remindTime[1]).padStart(2, '0')}`,
          placebo: fetchedSchedule.placebo || false,
          checkedInDates: new Set(),
          pillLogDataMap: pillLogDataMap,
        });
        setCurrentScreen('calendar');
      } else {
        setCurrentScreen('home');
        setError(response.message || 'Failed to fetch schedule and logs.');
        toast.error(response.message || 'Lỗi khi tải lịch uống thuốc.');
      }
    } catch (err) {
      console.error('Lỗi khi tìm nạp lịch và log:', err);
      setError('Lỗi khi tìm nạp lịch và log.');
      toast.error(
        'Lỗi khi tải lịch uống thuốc: ' +
          (err.response?.data?.message || err.message)
      );
      setCurrentScreen('home');
    } finally {
      setIsLoading(false);
    }
  };

  const generateCalendarData = (schedule, monthOffset) => {
    // Thêm kiểm tra phòng ngừa cho lịch và pillLogDataMap
    if (!schedule || !schedule.pillLogDataMap) {
      console.warn(
        'Lịch hoặc pillLogDataMap không xác định, trả về dữ liệu lịch trống.'
      );
      console.log('Debug: schedule tại generateCalendarData', schedule);
      return [];
    }

    console.log(
      'Debug: schedule.pillLogDataMap tại generateCalendarData',
      schedule.pillLogDataMap
    );
    const data = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(schedule.startDate);
    startDate.setHours(0, 0, 0, 0);
    const currentMonth = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + monthOffset,
      1
    );
    const daysInMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      date.setHours(0, 0, 0, 0);
      const dateString = date.toISOString().split('T')[0];
      console.log('Debug: Đang xử lý ngày:', dateString);
      const log = schedule.pillLogDataMap.get(dateString); // Lấy toàn bộ log cho ngày này
      console.log('Debug: Log cho ngày', dateString, ':', log);

      let status;
      let isClickable = false;
      let logId = log ? log.logId : null; // Lấy logId nếu log tồn tại

      if (log) {
        // Ngày này có một mục log tương ứng
        isClickable = true; // Tất cả các ngày có log đều có thể nhấp để check-in/hủy check-in

        if (date.getTime() < today.getTime()) {
          // Các ngày trong quá khứ
          status = log.status ? 'pill' : 'missed';
        } else if (date.getTime() === today.getTime()) {
          // Hôm nay
          const reminderHour = parseInt(
            schedule.reminderTime.split(':')[0],
            10
          );
          const reminderMinute = parseInt(
            schedule.reminderTime.split(':')[1],
            10
          );
          const now = new Date();
          const reminderDateTime = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            reminderHour,
            reminderMinute,
            0
          );

          if (log.status) {
            // Đã check-in
            status = 'pill';
          } else {
            // Chưa check-in
            if (now.getTime() < reminderDateTime.getTime()) {
              // Là hôm nay, là ngày uống thuốc, chưa check-in, và trước thời gian nhắc nhở
              status = 'pending_today'; // Trạng thái mới
            } else {
              // Là hôm nay, là ngày uống thuốc, chưa check-in, và sau hoặc tại thời gian nhắc nhở
              status = 'missed';
            }
          }
        } else {
          // Các ngày trong tương lai
          status = 'future';
        }
      } else {
        // Ngày này không có mục log tương ứng (có thể là ngày nghỉ hoặc trước ngày bắt đầu)
        // Xác định xem đó có phải là ngày nghỉ dựa trên logic chu kỳ liên quan đến startDate
        const daysSinceStart = Math.floor(
          (date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysSinceStart >= 0) {
          const cycleLength = schedule.pillDays + schedule.breakDays;
          const dayInCycle = daysSinceStart % cycleLength;
          if (dayInCycle >= schedule.pillDays) {
            // Đây là một ngày nghỉ được tính toán
            status = 'break';
          } else {
            // Điều này ngụ ý một ngày uống thuốc không có mục log. Điều này không nên xảy ra nếu generatePillLogs hoạt động chính xác.
            // Để an toàn, đánh dấu là tương lai hoặc đã bỏ lỡ nếu trước/sau ngày hôm nay
            if (date.getTime() < today.getTime()) {
              status = 'missed'; // Một ngày uống thuốc đáng lẽ phải có log nhưng không có và đã ở trong quá khứ
            } else {
              status = 'future'; // Một ngày uống thuốc đáng lẽ phải có log nhưng không có và ở trong tương lai
            }
          }
        } else {
          status = 'break'; // Các ngày trước ngày bắt đầu được coi là ngày nghỉ
        }
        isClickable = false; // Các ngày không có mục log rõ ràng thì không thể nhấp để check-in
      }

      data.push({
        date,
        status,
        isCheckedIn: log ? log.status : false, // Phản ánh trạng thái check-in thực tế từ log
        isClickable,
        logId, // Bao gồm logId cho các hành động check-in
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
        isActive: true, // Luôn đúng theo yêu cầu
        placebo: formData.placebo, // Gửi giá trị placebo từ form
      };
      const response =
        await pillReminderService.createPillSchedule(requestData);
      if (response.success) {
        const newSchedule = response.data;
        localStorage.setItem('pillScheduleId', newSchedule.pillsId);
        setSchedule({
          id: newSchedule.pillsId,
          startDate: new Date(newSchedule.startDate),
          pillDays: newSchedule.pillDays,
          breakDays: newSchedule.breakDays,
          reminderTime: `${String(newSchedule.remindTime[0]).padStart(2, '0')}:${String(newSchedule.remindTime[1]).padStart(2, '0')}`,
          checkedInDates: new Set(), // Lịch mới, chưa có check-in nào cho các ngày đã check-in cũ
          pillLogDataMap: new Map(), // Khởi tạo pillLogDataMap là một Map trống cho lịch mới
        });
        setCurrentScreen('calendar');
        toast.success('Lịch uống thuốc đã được tạo thành công!');
      } else {
        setError(response.message || 'Failed to create schedule.');
        toast.error(response.message || 'Lỗi khi tạo lịch uống thuốc.');
      }
    } catch (err) {
      console.error('Lỗi khi tạo lịch:', err);
      console.error('Phản hồi lỗi đầy đủ từ backend:', err.response?.data);
      setError('Lỗi khi tạo lịch.');
      toast.error(
        'Lỗi khi tạo lịch uống thuốc: ' +
          (err.response?.data?.message || err.message)
      );
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
        placebo: formData.placebo, // Đảm bảo placebo cũng được gửi
      };
      console.log(
        'Debug: Đang gửi yêu cầu cập nhật lịch cho ID:',
        schedule.id,
        'với dữ liệu:',
        requestData
      );
      const response = await pillReminderService.updatePillSchedule(
        schedule.id,
        requestData
      );
      if (response.success) {
        const updatedBackendSchedule = response.data;
        setSchedule({
          ...schedule,
          startDate: new Date(updatedBackendSchedule.startDate),
          pillDays: updatedBackendSchedule.pillDays,
          breakDays: updatedBackendSchedule.breakDays,
          reminderTime: `${String(updatedBackendSchedule.remindTime[0]).padStart(2, '0')}:${String(updatedBackendSchedule.remindTime[1]).padStart(2, '0')}`,
          // checkedInDates nên giữ nguyên, vì cập nhật backend không trực tiếp thay đổi nó
        });
        setCurrentScreen('calendar');
        toast.success('Lịch uống thuốc đã được cập nhật thành công!');
      } else {
        setError(response.message || 'Failed to update schedule.');
        toast.error(response.message || 'Lỗi khi cập nhật lịch uống thuốc.');
      }
    } catch (err) {
      console.error('Lỗi khi cập nhật lịch:', err);
      setError('Lỗi khi cập nhật lịch.');
      toast.error(
        'Lỗi khi cập nhật lịch uống thuốc: ' +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = () => {
    if (!schedule) return;
    setFormData({
      pillDays: schedule.pillDays || 21, // Cung cấp giá trị mặc định
      breakDays: schedule.breakDays || 7, // Cung cấp giá trị mặc định
      startDate: schedule.startDate
        ? schedule.startDate.toISOString().split('T')[0]
        : '',
      reminderTime: schedule.reminderTime || '09:00',
      placebo: schedule.placebo || false,
    });
    setCurrentScreen('edit');
  };

  const handleCheckIn = async (dayInfo) => {
    if (!schedule || !dayInfo.logId) return; // Đảm bảo logId tồn tại
    setIsLoading(true);
    setError(null);
    const dateString = dayInfo.date.toISOString().split('T')[0];
    const newPillLogDataMap = new Map(schedule.pillLogDataMap);

    try {
      // Truyền logId cụ thể đến backend
      const response = await pillReminderService.updateCheckIn(dayInfo.logId);
      if (response.success) {
        const updatedLog = response.data; // Backend nên trả về log đã cập nhật
        console.log('Debug: Đã nhận updatedLog từ backend:', updatedLog);
        newPillLogDataMap.set(dateString, updatedLog);

        setSchedule((prevSchedule) => ({
          ...prevSchedule,
          pillLogDataMap: newPillLogDataMap,
        }));
        console.log(
          'Debug: Trạng thái lịch đã được cập nhật với pillLogDataMap mới.'
        );
        toast.success(
          updatedLog.status
            ? 'Đã check-in thành công!'
            : 'Đã hủy check-in cho ngày này.'
        );
      } else {
        toast.error(response.message || 'Lỗi khi check-in.');
      }
    } catch (err) {
      console.error('Lỗi trong quá trình check-in:', err);
      setError('Lỗi trong quá trình check-in.');
      toast.error(
        'Lỗi khi check-in: ' + (err.response?.data?.message || err.message)
      );
    } finally {
      setShowConfirmModal(false);
      setIsLoading(false);
    }
  };

  const handleDateClick = (dayInfo) => {
    if (dayInfo.isClickable) {
      setSelectedDayInfo(dayInfo);
      setShowConfirmModal(true); // Luôn hiển thị modal xác nhận cho các ngày có thể nhấp
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
      const response = await pillReminderService.deletePillSchedule(
        schedule.id
      );
      if (response.success) {
        localStorage.removeItem('pillScheduleId');
        setSchedule(null);
        setCurrentScreen('home'); // Điều hướng trở lại màn hình chính sau khi xóa
        toast.success('Lịch uống thuốc đã được xóa thành công!');
      } else {
        setError(response.message || 'Failed to delete schedule.');
        toast.error(response.message || 'Lỗi khi xóa lịch uống thuốc.');
      }
    } catch (err) {
      console.error('Lỗi khi xóa lịch:', err);
      setError('Lỗi khi xóa lịch.');
      toast.error(
        'Lỗi khi xóa lịch uống thuốc: ' +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setIsLoading(false);
      setShowDeleteConfirmModal(false);
    }
  };

  return (
    <div className="font-sans">
      {isLoading && <div className={styles.loadingOverlay}>Đang tải...</div>}
      {error && <div className={styles.errorOverlay}>Lỗi: {error}</div>}
      {currentScreen === 'home' && (
        <PillReminderHomeScreen
          onAddSchedule={() => setCurrentScreen('form')}
          isAuthenticated={isAuthenticated}
        />
      )}
      {currentScreen === 'form' && (
        <PillReminderFormScreen
          formData={formData}
          onFormChange={(field, value) =>
            setFormData({ ...formData, [field]: value })
          }
          onFormSubmit={handleFormSubmit}
          onBackClick={() => setCurrentScreen(schedule ? 'calendar' : 'home')}
          isEditing={false}
        />
      )}
      {currentScreen === 'edit' && (
        <PillReminderFormScreen
          formData={formData}
          onFormChange={(field, value) =>
            setFormData({ ...formData, [field]: value })
          }
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
          onDeleteSchedule={handleDeleteSchedule} // Truyền trình xử lý xóa
        />
      )}
      <PillReminderConfirmModal
        showConfirmModal={showConfirmModal}
        selectedDayInfo={selectedDayInfo}
        onCancel={() => {
          setShowConfirmModal(false);
          setSelectedDayInfo(null);
        }}
        onConfirm={() => {
          handleCheckIn(selectedDayInfo);
          setShowConfirmModal(false);
        }}
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
