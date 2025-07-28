import React from 'react';
import { Plus, Calendar, Clock, Check, X, ChevronLeft, ChevronRight, Edit, Shield, Heart, Star, Pill, Trash } from 'lucide-react';
import styles from '../../styles/PillReminderPage.module.css';
import PillIcon from './PillIcon';
import { Link } from 'react-router-dom';

export function PillReminderHomeScreen({ onAddSchedule, isAuthenticated }) {
  return (
    <div className={styles.pageBg}>
      <div className={styles.container}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 96, height: 96, background: 'linear-gradient(to right, #44c0c9, #2aa4bc)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Pill style={{ width: 48, height: 48, color: '#fff' }} />
          </div><div style={{ textAlign: 'center', marginBottom: 8 }}>
            <h1 style={{ 
              fontSize: 32, 
              fontWeight: 800, 
              fontFamily: 'Inter, sans-serif',
              background: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 60%, #9B59B6 100%)', 
              backgroundClip: 'text', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent', 
              marginBottom: 0,
              letterSpacing: '-1.5px',
              lineHeight: 1.13,
              textShadow: '0 4px 24px rgba(0,0,0,0.1), 0 1.5px 0px rgba(0,0,0,0.1)',
              display: 'inline-block'
            }}>Lịch Nhắc Nhở uống thuốc tránh thai</h1>
            <div style={{
              width: '110px',
              height: '7px',
              background: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 60%, #9B59B6 100%)',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(74,144,226,0.13)',
              margin: '18px auto 0 auto'
            }}></div>
          </div>
          <p style={{ color: '#666' }}>Uống thuốc tránh thai đúng giờ</p>
        </div>
        {/* Main Action Button */}
        <div className={styles.card}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ 
              width: 64, 
              height: 64, 
              background: 'linear-gradient(135deg, #f3e5f5 0%, #ffffff 100%)', 
              borderRadius: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 16px',
              boxShadow: '0 4px 12px rgba(162,89,230,0.1)'
            }}>
              <Calendar style={{ width: 32, height: 32, color: '#9c27b0' }} />
            </div>
            <h2 className={styles.cardTitle}>Bắt đầu theo dõi</h2>
            <p className={styles.cardDescription}>Tạo lịch uống thuốc cá nhân của bạn</p>
          </div>
          {isAuthenticated ? (
            <button
              onClick={onAddSchedule}
              style={{ width: '100%', background: 'linear-gradient(to right, #44c0c9, #2aa4bc)', color: '#fff', padding: '16px 24px', borderRadius: 16, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: 'none', fontSize: 18, cursor: 'pointer', boxShadow: '0 2px 8px rgba(162,89,230,0.10)' }}
            >
              <Plus style={{ width: 20, height: 20 }} />
              Thêm lịch uống thuốc
            </button>
          ) : (
            <Link to="/login" style={{ textDecoration: 'none', width: '100%' }}>
              <button
                style={{ width: '100%', background: 'linear-gradient(to right, #1C9695, #35B4A6)', color: '#fff', padding: '16px 24px', borderRadius: 16, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: 'none', fontSize: 18, cursor: 'pointer', boxShadow: '0 2px 8px rgba(162,89,230,0.10)' }}
              >
                <Plus style={{ width: 20, height: 20 }} />
                Đăng nhập để tạo lịch nhắc nhở
              </button>
            </Link>
          )}
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
}

export function PillReminderFormScreen({ formData, onFormChange, onFormSubmit, onBackClick, isEditing }) {
  return (
    <div className={styles.formCard} style={{ borderRadius: '16px', padding: 0, overflow: 'hidden' }}>
      <div className={styles.formHeader} style={{ background: 'linear-gradient(to right, #44c0c9, #2aa4bc)', borderRadius: '16px 16px 0 0', padding: '24px', margin: 0, position: 'relative', zIndex: 1 }}>
        <div className={styles.formIcon} style={{ background: 'rgba(255, 255, 255, 0.2)', borderRadius: '50%', padding: '8px' }}><Calendar size={28} color="#fff" /></div>
        <div>
          <h2 className={styles.formTitle} style={{ color: '#fff', margin: '8px 0 4px 0' }}>{isEditing ? 'Chỉnh sửa lịch uống thuốc' : 'Tạo lịch uống thuốc'}</h2>
          <p className={styles.formSubtitle} style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>{isEditing ? 'Cập nhật thông tin chu kỳ của bạn' : 'Điền thông tin chu kỳ của bạn'}</p>
        </div>
      </div>
      <form onSubmit={onFormSubmit} style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}><Calendar size={18} style={{ marginRight: 4, verticalAlign: 'middle', color: '#44c0c9' }} /> Ngày bắt đầu uống thuốc</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={e => onFormChange('startDate', e.target.value)}
            className={styles.formInput}
            required
            aria-label="Ngày bắt đầu uống thuốc"
            placeholder="mm/dd/yyyy"
            min={new Date().toISOString().split('T')[0]}
            style={{
              padding: '12px 16px',
              fontSize: '14px',
              borderRadius: '8px',
              border: '1px solid #ffe2ec',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              backgroundColor: '#fff',
              color: '#333',
              width: '100%',
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#44c0c9';
              e.target.style.boxShadow = '0 4px 12px rgba(68, 192, 201, 0.15)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#ffe2ec';
              e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
            }}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}><Clock size={18} style={{ marginRight: 4, verticalAlign: 'middle', color: '#44c0c9' }} /> Thời gian nhắc nhở</label>
          <input
            type="time"
            value={formData.reminderTime}
            onChange={e => onFormChange('reminderTime', e.target.value)}
            className={styles.formInput}
            required
            aria-label="Thời gian nhắc nhở"
            placeholder="Chọn thời gian nhắc nhở"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}><Pill size={18} style={{ marginRight: 4, verticalAlign: 'middle', color: '#44c0c9' }} /> Chọn loại thuốc</label>
          <select
            value={formData.pillType}
            onChange={e => {
              const selectedPillType = e.target.value;
              onFormChange('pillType', selectedPillType);
              if (selectedPillType === 'TYPE_21_7') {
                onFormChange('pillDays', 21);
                onFormChange('breakDays', 7);
              } else if (selectedPillType === 'TYPE_28') {
                onFormChange('pillDays', 28);
                onFormChange('breakDays', 0);
              } else {
                // onFormChange('pillDays', ''); // Reset when 'Khác' is selected
                // onFormChange('breakDays', ''); // Reset when 'Khác' is selected
              }
            }}
            className={styles.formInput}
            required
            aria-label="Chọn loại thuốc"
            style={{
              padding: '12px 16px',
              fontSize: '14px',
              borderRadius: '8px',
              border: '1px solid #ffe2ec',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              backgroundColor: '#fff',
              color: '#333',
              width: '100%',
              outline: 'none',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#44c0c9';
              e.target.style.boxShadow = '0 4px 12px rgba(68, 192, 201, 0.15)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#ffe2ec';
              e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
            }}
          >
            <option value="">-- Chọn loại thuốc --</option>
            <option value="TYPE_21_7">Thuốc 21/7 (21 ngày uống, 7 ngày nghỉ)</option>
            <option value="TYPE_28">Thuốc 28 viên (Uống liên tục)</option>
            <option value="CUSTOM">Khác</option>
          </select>
        </div>

        {formData.pillType === 'CUSTOM' && (
          <>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Số ngày uống thuốc</label>
              <input
                type="number"
                value={formData.pillDays}
                onChange={e => onFormChange('pillDays', Number(e.target.value))}
                className={styles.formInput}
                min="1"
                max="30"
                required
                aria-label="Số ngày uống thuốc"
                placeholder="Nhập số ngày"
                style={{
                  padding: '12px 16px',
                  fontSize: '14px',
                  borderRadius: '8px',
                  border: '1px solid #e1e5e9',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  backgroundColor: '#fff',
                  color: '#333',
                  width: '100%',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#44c0c9';
                  e.target.style.boxShadow = '0 4px 12px rgba(68, 192, 201, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e1e5e9';
                  e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                }}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Số ngày nghỉ</label>
              <input
                type="number"
                value={formData.breakDays}
                onChange={e => onFormChange('breakDays', Number(e.target.value))}
                className={styles.formInput}
                min="0"
                max="14"
                required
                aria-label="Số ngày nghỉ"
                placeholder="Nhập số ngày"
                style={{
                  padding: '12px 16px',
                  fontSize: '14px',
                  borderRadius: '8px',
                  border: '1px solid #e1e5e9',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  backgroundColor: '#fff',
                  color: '#333',
                  width: '100%',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#44c0c9';
                  e.target.style.boxShadow = '0 4px 12px rgba(68, 192, 201, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e1e5e9';
                  e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                }}
              />
            </div>
          </>
        )}
        <div className={styles.formActions}>
          <button
            type="button"
            onClick={onBackClick}
            className={styles.btnGray}
          >
            {isEditing ? 'Hủy' : 'Quay lại'}
          </button>
          <button
            type="submit"
            className={styles.btnGradient}
            style={{ 
              background: 'linear-gradient(to right, #44c0c9, #2aa4bc)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            {isEditing ? 'Cập nhật lịch' : 'Tạo lịch'}
          </button>
        </div>
        </div>
      </form>
    </div>
  );
}

export function PillReminderCalendarScreen({ schedule, currentMonthIndex, setCurrentMonthIndex, generateCalendarData, handleDateClick, handleEditClick, onDeleteSchedule }) {
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
        <div className={styles.calendarLegend} style={{ display: 'flex', gap: 64, justifyContent: 'center', margin: '24px 0' }}>
          <div className={styles.legendItem} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 28, height: 28, borderRadius: '50%', background: '#2ecc40', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PillIcon status="pill" />
            </span>
            Đã uống
          </div>
          <div className={styles.legendItem} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 28, height: 28, borderRadius: '50%', background: '#e53935', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PillIcon status="missed" />
            </span>
            Bỏ lỡ
          </div>
          <div className={styles.legendItem} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 28, height: 28, borderRadius: '50%', background: '#2979ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PillIcon status="future" />
            </span>
            Sắp tới
          </div>
          <div className={styles.legendItem} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 28, height: 28, borderRadius: '50%', background: '#a0a4ad', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={16} color="#fff" />
            </span>
            Ngày nghỉ
          </div>
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
              <PillIcon status={dayInfo.status} />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.settingsCard}>
        <div className={styles.settingsTitle}>Cài đặt lịch</div>
        <div className={styles.settingsText}>Chu kỳ hiện tại: {schedule.pillDays} ngày uống, {schedule.breakDays} ngày nghỉ</div>
        <div className={styles.settingsText} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Clock size={18} style={{ marginRight: 4, verticalAlign: 'middle' , color: '#44c0c9'}} /> Thời gian nhắc nhở: {schedule.reminderTime}</div>
        <div className={styles.settingsText}>Ngày bắt đầu: {schedule.startDate ? new Date(schedule.startDate).toLocaleDateString('vi-VN') : ''}</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px', alignItems: 'stretch' }}>
          <button
            onClick={handleEditClick}
            className={styles.btnEditSchedule}
          >
            <Edit style={{ width: 20, height: 20 }} />
            Chỉnh sửa lịch
          </button>
          <button
            onClick={onDeleteSchedule}
            className={styles.btnDeleteSchedule}
          >
            <Trash style={{ width: 20, height: 20 }} />
            Xóa lịch
          </button>
        </div>
      </div>
    </div>
  );
}

export function PillReminderConfirmModal({ showConfirmModal, selectedDayInfo, onCancel, onConfirm, isLoading }) {
  if (!showConfirmModal || !selectedDayInfo) {
    return null;
  }

  const { date, isCheckedIn } = selectedDayInfo;
  const formattedDate = `Ngày ${date.getDate()}/${date.getMonth() + 1}`;
  const message = isCheckedIn ? 'Bạn có chắc muốn hủy check-in?' : 'Xác nhận uống thuốc cho ngày này?';

  let buttonText = isCheckedIn ? 'Hủy Check-in' : 'Check-in';
  if (isLoading) {
    buttonText = isCheckedIn ? 'Đang hủy...' : 'Đang check-in...';
  }
  const buttonClass = isCheckedIn ? styles.btnGray : styles.btnGradient;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalIcon}><Pill size={36} /></div>
        <h3 className={styles.modalTitle}>{formattedDate}</h3>
        <p className={styles.modalMessage}>{message}</p>
        <div className={styles.modalActions}>
          <button onClick={onCancel} className={styles.btnModalCancel} disabled={isLoading}>
            Hủy
          </button>
          <button onClick={onConfirm} className={styles.btnModalConfirm} disabled={isLoading}>
            {isLoading && <div className={styles.loader}></div>}
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

export function PillReminderDeleteConfirmModal({ showDeleteConfirmModal, onCancelDelete, onConfirmDelete }) {
  if (!showDeleteConfirmModal) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(60,60,80,0.32)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ background: '#fff', borderRadius: 24, padding: '40px 32px', minWidth: 360, boxShadow: '0 4px 32px rgba(0,0,0,0.10)', textAlign: 'center', position: 'relative' }}>
        <div style={{ width: 72, height: 72, background: 'linear-gradient(to right, #44c0c9, #2aa4bc)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <Pill style={{ width: 36, height: 36, color: '#fff' }} />
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Xác nhận xóa</div>
        <div style={{ fontSize: 18, color: '#444', marginBottom: 24 }}>Bạn có chắc chắn muốn xóa lịch uống thuốc này không? Hành động này không thể hoàn tác.</div>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <button
            onClick={onCancelDelete}
            className={styles.btnModalCancel}
          >
            Hủy
          </button>
          <button
            onClick={onConfirmDelete}
            className={styles.btnModalConfirmDelete}
          >
            <span style={{ marginRight: 6 }}></span> Xác nhận xóa
          </button>
        </div>
      </div>
    </div>
  );
} 