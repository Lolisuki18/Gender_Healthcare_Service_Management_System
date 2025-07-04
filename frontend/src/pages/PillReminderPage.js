import React, { useState } from 'react';
import { Plus, Calendar, Clock, Pill, Check, X, ChevronLeft, ChevronRight, Edit, Shield, Heart, Star } from 'lucide-react';
import styles from '../styles/PillReminderPage.module.css';

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
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({
    pillDays: 21,
    breakDays: 7,
    startDate: '',
    reminderTime: '09:00'
  });

  const generateCalendarData = (schedule, monthOffset) => {
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
      const daysSinceStart = Math.floor((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceStart >= 0) {
        const cycleLength = schedule.pillDays + schedule.breakDays;
        const dayInCycle = daysSinceStart % cycleLength;
        const dateString = date.toISOString().split('T')[0];
        const isCheckedIn = schedule.checkedInDates.has(dateString);
        let status;
        let isClickable = false;
        if (dayInCycle < schedule.pillDays) {
          isClickable = true;
          if (date > today) {
            status = 'future';
          } else if (isCheckedIn) {
            status = 'pill';
          } else {
            status = 'missed';
          }
        } else {
          status = 'break';
          isClickable = false;
        }
        data.push({
          date,
          status,
          isCheckedIn,
          isClickable
        });
      } else {
        data.push({
          date,
          status: 'break',
          isCheckedIn: false,
          isClickable: false
        });
      }
    }
    return data;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newSchedule = {
      id: Date.now().toString(),
      startDate: new Date(formData.startDate),
      pillDays: formData.pillDays,
      breakDays: formData.breakDays,
      reminderTime: formData.reminderTime,
      checkedInDates: new Set()
    };
    setSchedule(newSchedule);
    setCurrentScreen('calendar');
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!schedule) return;
    const updatedSchedule = {
      ...schedule,
      startDate: new Date(formData.startDate),
      pillDays: formData.pillDays,
      breakDays: formData.breakDays,
      reminderTime: formData.reminderTime,
      checkedInDates: schedule.checkedInDates
    };
    setSchedule(updatedSchedule);
    setCurrentScreen('calendar');
  };

  const handleEditClick = () => {
    if (!schedule) return;
    setFormData({
      pillDays: schedule.pillDays,
      breakDays: schedule.breakDays,
      startDate: schedule.startDate.toISOString().split('T')[0],
      reminderTime: schedule.reminderTime
    });
    setCurrentScreen('edit');
  };

  const handleCheckIn = (date) => {
    if (!schedule) return;
    const dateString = date.toISOString().split('T')[0];
    const newCheckedInDates = new Set(schedule.checkedInDates);
    if (newCheckedInDates.has(dateString)) {
      newCheckedInDates.delete(dateString);
    } else {
      newCheckedInDates.add(dateString);
    }
    setSchedule({
      ...schedule,
      checkedInDates: newCheckedInDates
    });
    setSelectedDate(null);
  };

  const handleDateClick = (dayInfo) => {
    if (dayInfo.isClickable) {
      setSelectedDate(dayInfo.date);
    }
  };

  const getPillColor = (status) => {
    switch (status) {
      case 'pill': return 'bg-blue-500';
      case 'missed': return 'bg-red-500';
      case 'future': return 'bg-green-500';
      case 'break': return 'bg-gray-400';
      default: return 'bg-gray-300';
    }
  };

  const renderHomeScreen = () => (
    <div className={styles.pageBg}>
      <div className={styles.container}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 96, height: 96, background: 'linear-gradient(90deg, #e57399, #a259e6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Pill style={{ width: 48, height: 48, color: '#fff' }} />
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: '#181c32', marginBottom: 8 }}>Lịch Nhắc Nhở</h1>
          <p style={{ color: '#666' }}>Uống thuốc tránh thai đúng giờ</p>
        </div>
        {/* Main Action Button */}
        <div className={styles.card}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <h2 className={styles.cardTitle}>Bắt đầu theo dõi</h2>
            <p className={styles.cardDescription}>Tạo lịch uống thuốc cá nhân của bạn</p>
          </div>
          <button
            onClick={() => setCurrentScreen('form')}
            style={{ width: '100%', background: 'linear-gradient(90deg, #e57399, #a259e6)', color: '#fff', padding: '16px 24px', borderRadius: 16, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: 'none', fontSize: 18, cursor: 'pointer', boxShadow: '0 2px 8px rgba(162,89,230,0.10)' }}
          >
            <Plus style={{ width: 20, height: 20 }} />
            Thêm lịch uống thuốc
          </button>
        </div>
        {/* Benefits Section */}
        <div className={styles.card}>
          <div className={styles.benefitHeaderRow}>
            <div className={styles.benefitHeaderIcon}><Shield size={40} /></div>
            <div className={styles.benefitHeaderTitle}>Lợi ích của thuốc tránh thai</div>
          </div>
          <div className={styles.benefitListRow}>
            <div className={styles.benefitItemRow}>
              <div className={`${styles.benefitIconRow} ${styles.pink}`}><Check size={24} /></div>
              <div>
                <div className={styles.benefitTitleRow}>Ngăn ngừa thai ngoài ý muốn</div>
                <div className={styles.benefitDescRow}>Hiệu quả lên đến 99% khi sử dụng đúng cách</div>
              </div>
            </div>
            <div className={styles.benefitItemRow}>
              <div className={`${styles.benefitIconRow} ${styles.purple}`}><Heart size={24} /></div>
              <div>
                <div className={styles.benefitTitleRow}>Điều hòa chu kỳ kinh nguyệt</div>
                <div className={styles.benefitDescRow}>Giúp chu kỳ đều đặn và giảm đau bụng kinh</div>
              </div>
            </div>
            <div className={styles.benefitItemRow}>
              <div className={`${styles.benefitIconRow} ${styles.blue}`}><Star size={24} /></div>
              <div>
                <div className={styles.benefitTitleRow}>Cải thiện làn da</div>
                <div className={styles.benefitDescRow}>Giảm mụn trứng cá và cân bằng hormone</div>
              </div>
            </div>
          </div>
        </div>
        {/* Additional Benefits Section */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle} style={{ textAlign: 'center', marginBottom: 24 }}>Tác dụng khác của thuốc tránh thai</h2>
          <div className={styles.effectGrid}>
            <div className={`${styles.effectCard} ${styles.effectPink}`}>
              <div className={`${styles.effectIcon} ${styles.pink}`}><Shield size={36} /></div>
              <div className={styles.effectTitle}>Giảm nguy cơ ung thư</div>
              <div className={styles.effectDesc}>Giảm nguy cơ ung thư buồng trứng và nội mạc tử cung</div>
            </div>
            <div className={`${styles.effectCard} ${styles.effectPurple}`}>
              <div className={`${styles.effectIcon} ${styles.purple}`}><Heart size={36} /></div>
              <div className={styles.effectTitle}>Giảm thiếu máu</div>
              <div className={styles.effectDesc}>Giảm lượng máu mất trong chu kỳ kinh nguyệt</div>
            </div>
            <div className={`${styles.effectCard} ${styles.effectBlue}`}>
              <div className={`${styles.effectIcon} ${styles.blue}`}><Star size={36} /></div>
              <div className={styles.effectTitle}>Giảm u nang buồng trứng</div>
              <div className={styles.effectDesc}>Ngăn ngừa hình thành u nang buồng trứng mới</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFormScreen = () => (
    <div className={styles.pageBg}>
      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <div className={styles.formIcon}><Calendar size={28} /></div>
          <div>
            <h2 className={styles.formTitle}>Tạo lịch uống thuốc</h2>
            <p className={styles.formSubtitle}>Điền thông tin chu kỳ của bạn</p>
          </div>
        </div>
        <form onSubmit={handleFormSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Số ngày uống thuốc</label>
            <input
              type="number"
              value={formData.pillDays}
              onChange={e => setFormData({ ...formData, pillDays: parseInt(e.target.value) })}
              className={styles.formInput}
              min="1"
              max="30"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Số ngày nghỉ</label>
            <input
              type="number"
              value={formData.breakDays}
              onChange={e => setFormData({ ...formData, breakDays: parseInt(e.target.value) })}
              className={styles.formInput}
              min="1"
              max="14"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Ngày bắt đầu uống thuốc</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={e => setFormData({ ...formData, startDate: e.target.value })}
              className={styles.formInput}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}><Clock size={18} style={{ marginRight: 4, verticalAlign: 'middle' }} /> Thời gian nhắc nhở</label>
            <input
              type="time"
              value={formData.reminderTime}
              onChange={e => setFormData({ ...formData, reminderTime: e.target.value })}
              className={styles.formInput}
              required
            />
          </div>
          <div className={styles.formActions}>
            <button
              type="button"
              onClick={() => setCurrentScreen(schedule ? 'calendar' : 'home')}
              className={styles.btnGray}
            >
              Quay lại
            </button>
            <button
              type="submit"
              className={styles.btnGradient}
            >
              Tạo lịch
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderEditScreen = () => (
    <div className={styles.pageBg}>
      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <div className={styles.formIcon}><Edit size={28} /></div>
          <div>
            <h2 className={styles.formTitle}>Chỉnh sửa lịch uống thuốc</h2>
            <p className={styles.formSubtitle}>Cập nhật thông tin chu kỳ của bạn</p>
          </div>
        </div>
        <form onSubmit={handleEditSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Số ngày uống thuốc</label>
            <input
              type="number"
              value={formData.pillDays}
              onChange={e => setFormData({ ...formData, pillDays: parseInt(e.target.value) })}
              className={styles.formInput}
              min="1"
              max="30"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Số ngày nghỉ</label>
            <input
              type="number"
              value={formData.breakDays}
              onChange={e => setFormData({ ...formData, breakDays: parseInt(e.target.value) })}
              className={styles.formInput}
              min="1"
              max="14"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Ngày bắt đầu uống thuốc</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={e => setFormData({ ...formData, startDate: e.target.value })}
              className={styles.formInput}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}><Clock size={18} style={{ marginRight: 4, verticalAlign: 'middle' }} /> Thời gian nhắc nhở</label>
            <input
              type="time"
              value={formData.reminderTime}
              onChange={e => setFormData({ ...formData, reminderTime: e.target.value })}
              className={styles.formInput}
              required
            />
          </div>
          <div className={styles.importantNote} style={{ marginBottom: 16 }}>
            <div className={styles.importantIcon}>!</div>
            <div>
              <p className={styles.importantText} style={{ marginBottom: 4 }}>Lưu ý quan trọng</p>
              <div>
                Việc thay đổi lịch sẽ không ảnh hưởng đến các ngày đã check-in trước đó. Tuy nhiên, chu kỳ mới sẽ được áp dụng từ ngày bắt đầu mới.
              </div>
            </div>
          </div>
          <div className={styles.formActions}>
            <button
              type="button"
              onClick={() => setCurrentScreen('calendar')}
              className={styles.btnGray}
            >
              Hủy
            </button>
            <button
              type="submit"
              className={styles.btnGradient}
            >
              Cập nhật lịch
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderCalendarScreen = () => {
    if (!schedule) return null;
    const currentMonth = new Date(schedule.startDate.getFullYear(), schedule.startDate.getMonth() + currentMonthIndex, 1);
    const calendarData = generateCalendarData(schedule, currentMonthIndex);
    const canGoPrevious = currentMonthIndex > 0;
    const canGoNext = currentMonthIndex < 11;
    return (
      <div className={styles.pageBg}>
        <div className={styles.calendarCard}>
          <div className={styles.calendarHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div className={styles.formIcon}><Calendar size={24} /></div>
              <div>
                <div className={styles.calendarTitle}>Lịch uống thuốc</div>
                <div style={{ color: '#888', fontSize: 15 }}>Theo dõi tiến trình hàng ngày</div>
              </div>
            </div>
          </div>
          <div className={styles.calendarLegend}>
            <div className={styles.legendItem}><span className={`${styles.legendDot} ${styles.dotBlue}`}></span> Đã uống</div>
            <div className={styles.legendItem}><span className={`${styles.legendDot} ${styles.dotRed}`}></span> Bỏ lỡ</div>
            <div className={styles.legendItem}><span className={`${styles.legendDot} ${styles.dotGreen}`}></span> Sắp tới</div>
            <div className={styles.legendItem}><span className={`${styles.legendDot} ${styles.dotGray}`}></span> Ngày nghỉ</div>
          </div>
        </div>
        <div className={styles.calendarCard}>
          <div className={styles.calendarHeader}>
            <button
              onClick={() => setCurrentMonthIndex(prev => Math.max(0, prev - 1))}
              disabled={!canGoPrevious}
              className={styles.monthNavBtn}
            >
              <ChevronLeft size={20} />
            </button>
            <div className={styles.calendarTitle} style={{ textAlign: 'center' }}>
              tháng {currentMonth.getMonth() + 1} năm {currentMonth.getFullYear()}
            </div>
            <button
              onClick={() => setCurrentMonthIndex(prev => Math.min(11, prev + 1))}
              disabled={!canGoNext}
              className={styles.monthNavBtn}
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <div className={styles.calendarGrid} style={{ marginBottom: 16 }}>
            {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
              <div key={day} style={{ textAlign: 'center', fontWeight: 500, color: '#888', fontSize: 15 }}>{day}</div>
            ))}
          </div>
          <div className={styles.calendarGrid}>
            {/* Empty cells for days before month start */}
            {Array.from({ length: currentMonth.getDay() }).map((_, i) => (
              <div key={i}></div>
            ))}
            {calendarData.map((dayInfo, dayIndex) => (
              <div
                key={dayIndex}
                className={
                  styles.calendarDayCell +
                  (dayInfo.isClickable ? ' ' + styles.clickable : '')
                }
                onClick={() => dayInfo.isClickable && handleDateClick(dayInfo)}
              >
                <div className={styles.dayNumber}>{dayInfo.date.getDate()}</div>
                <div
                  className={
                    styles.pillDot + ' ' +
                    (dayInfo.status === 'pill' ? styles.pillBlue :
                      dayInfo.status === 'missed' ? styles.pillRed :
                        dayInfo.status === 'future' ? styles.pillGreen :
                          styles.pillGray)
                  }
                >
                  {dayInfo.isCheckedIn && dayInfo.status === 'pill' && (
                    <Check size={16} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.settingsCard}>
          <div className={styles.settingsTitle}>Cài đặt lịch</div>
          <div className={styles.settingsText}>Chu kỳ hiện tại: {schedule.pillDays} ngày uống, {schedule.breakDays} ngày nghỉ</div>
          <div className={styles.settingsText}>Thời gian nhắc nhở: {schedule.reminderTime}</div>
          <div className={styles.settingsText}>Ngày bắt đầu: {schedule.startDate ? new Date(schedule.startDate).toLocaleDateString('vi-VN') : ''}</div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
            <button
              onClick={handleEditClick}
              className={styles.btnEdit}
            >
              <Edit size={20} style={{ marginRight: 6 }} />
              Chỉnh sửa lịch
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="font-sans">
      {currentScreen === 'home' && renderHomeScreen()}
      {currentScreen === 'form' && renderFormScreen()}
      {currentScreen === 'edit' && renderEditScreen()}
      {currentScreen === 'calendar' && renderCalendarScreen()}
    </div>
  );
}

export default PillReminderPage;
// --- END COMPONENT CODE --- 