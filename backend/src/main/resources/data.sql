

-- Dữ liệu mẫu cho bảng [user]
SET IDENTITY_INSERT [user] ON;
INSERT INTO [user] (id, full_name, birth_day, gender, phone, email, username, password, address, avatar, is_active, role_id, provider, provider_id, created_date) VALUES
  (2, N'Nguyễn Văn A', '1990-01-01', 'MALE', '0909123456', 'admin@email.com', 'admin', 'admin123', N'Hà Nội', NULL, 1, 1, 'LOCAL', NULL, GETDATE()),
  (3, N'Trần Thị B', '1995-05-10', 'FEMALE', '0912345678', 'user1@email.com', 'user1', 'user123', N'Hồ Chí Minh', NULL, 1, 2, 'GOOGLE', 'google-uid-1', GETDATE()),
  (4, N'Phạm Văn C', '1988-12-20', 'MALE', '0987654321', 'consultant@email.com', 'consultant', 'consultant123', N'Đà Nẵng', NULL, 1, 3, 'LOCAL', NULL, GETDATE()),
  (5, N'Lê Thị D', '2000-07-15', 'FEMALE', '0978123456', 'user2@email.com', 'user2', 'user456', N'Hải Phòng', NULL, 1, 2, 'FACEBOOK', 'fb-uid-2', GETDATE());
SET IDENTITY_INSERT [user] OFF;

-- Dữ liệu mẫu cho bảng categories
SET IDENTITY_INSERT categories ON;
INSERT INTO categories (category_id, name, description, is_active) VALUES
  (1, N'Sức khỏe sinh sản', N'Chuyên mục về sức khỏe sinh sản', 1),
  (2, N'Bệnh lây truyền qua đường tình dục', N'Chuyên mục về các bệnh STIs', 1),
  (3, N'Tư vấn tâm lý', N'Chuyên mục tư vấn tâm lý', 1),
  (4, N'Dinh dưỡng', N'Chuyên mục về dinh dưỡng', 1),
  (5, N'Vận động', N'Chuyên mục về vận động', 1);
SET IDENTITY_INSERT categories OFF;

-- Dữ liệu mẫu cho bảng category_questions
SET IDENTITY_INSERT category_questions ON;
INSERT INTO category_questions (category_question_id, name, description, is_active) VALUES
  (1, N'Chu kỳ kinh nguyệt', N'Các câu hỏi về chu kỳ kinh nguyệt', 1),
  (2, N'Quan hệ an toàn', N'Các câu hỏi về quan hệ an toàn', 1),
  (3, N'Các bệnh STIs', N'Các câu hỏi về bệnh lây truyền', 1),
  (4, N'Chế độ ăn uống', N'Các câu hỏi về dinh dưỡng', 1),
  (5, N'Tập luyện', N'Các câu hỏi về vận động', 1);
SET IDENTITY_INSERT category_questions OFF;

-- Dữ liệu mẫu cho bảng blog_posts
SET IDENTITY_INSERT blog_posts ON;
INSERT INTO blog_posts (post_id, title, content, thumbnail_image, category_id, author_id, created_at, status) VALUES
  (1, N'Bí quyết chăm sóc sức khỏe sinh sản', N'Nội dung bài viết 1...', NULL, 1, 2, GETDATE(), 'PROCESSING'),
  (2, N'Nhận biết các dấu hiệu STIs', N'Nội dung bài viết 2...', NULL, 2, 4, GETDATE(), 'CONFIRMED'),
  (3, N'Giải tỏa tâm lý khi gặp vấn đề sức khỏe', N'Nội dung bài viết 3...', NULL, 3, 4, GETDATE(), 'CANCELED'),
  (4, N'Chế độ ăn uống hợp lý', N'Nội dung bài viết 4...', NULL, 4, 5, GETDATE(), 'PROCESSING'),
  (5, N'Bài tập thể dục tại nhà', N'Nội dung bài viết 5...', NULL, 5, 5, GETDATE(), 'CONFIRMED');
SET IDENTITY_INSERT blog_posts OFF;

-- Dữ liệu mẫu cho bảng payments
SET IDENTITY_INSERT payments ON;
INSERT INTO payments (payment_id, user_id, service_type, service_id, payment_method, payment_status, amount, currency, created_at, updated_at) VALUES
  (1, 3, 'STI_SERVICE', 1, 'VISA', 'COMPLETED', 500000, 'VND', GETDATE(), GETDATE()),
  (2, 3, 'STI_PACKAGE', 1, 'QR_CODE', 'PENDING', 1200000, 'VND', GETDATE(), GETDATE()),
  (3, 4, 'CONSULTATION', 1, 'COD', 'COMPLETED', 300000, 'VND', GETDATE(), GETDATE()),
  (4, 5, 'STI_SERVICE', 2, 'VISA', 'FAILED', 700000, 'VND', GETDATE(), GETDATE()),
  (5, 5, 'CONSULTATION', 2, 'QR_CODE', 'COMPLETED', 350000, 'VND', GETDATE(), GETDATE());
SET IDENTITY_INSERT payments OFF;

-- Dữ liệu mẫu cho bảng sti_packages
SET IDENTITY_INSERT sti_packages ON;
INSERT INTO sti_packages (package_id, package_name, description, package_price, is_active, created_at, updated_at) VALUES
  (1, N'Gói xét nghiệm tổng quát', N'Kiểm tra tổng quát các bệnh STIs', 1200000, 1, GETDATE(), GETDATE()),
  (2, N'Gói xét nghiệm HIV', N'Chuyên biệt cho HIV', 800000, 1, GETDATE(), GETDATE()),
  (3, N'Gói xét nghiệm tổng hợp', N'Kiểm tra tổng hợp các bệnh', 1500000, 1, GETDATE(), GETDATE()),
  (4, N'Gói xét nghiệm nhanh', N'Xét nghiệm nhanh các chỉ số', 600000, 1, GETDATE(), GETDATE());
SET IDENTITY_INSERT sti_packages OFF;

-- Dữ liệu mẫu cho bảng sti_services
SET IDENTITY_INSERT sti_services ON;
INSERT INTO sti_services (service_id, name, description, price, is_active, created_at, updated_at) VALUES
  (1, N'HIV Test', N'Xét nghiệm HIV', 500000, 1, GETDATE(), GETDATE()),
  (2, N'HPV Test', N'Xét nghiệm HPV', 700000, 1, GETDATE(), GETDATE()),
  (3, N'Syphilis Test', N'Xét nghiệm giang mai', 400000, 1, GETDATE(), GETDATE()),
  (4, N'Gonorrhea Test', N'Xét nghiệm lậu', 450000, 1, GETDATE(), GETDATE());
SET IDENTITY_INSERT sti_services OFF;

-- Dữ liệu mẫu cho bảng consultant_profiles
SET IDENTITY_INSERT consultant_profiles ON;
INSERT INTO consultant_profiles (profile_id, user_id, qualifications, experience, bio, created_at) VALUES
  (1, 4, N'Bác sĩ chuyên khoa I', N'10 năm kinh nghiệm', N'Tư vấn viên tận tâm', GETDATE()),
  (2, 5, N'Bác sĩ chuyên khoa II', N'8 năm kinh nghiệm', N'Chuyên gia dinh dưỡng', GETDATE()),
  (3, 5, N'Chuyên viên tâm lý', N'5 năm kinh nghiệm', N'Tư vấn tâm lý trẻ em', GETDATE());
SET IDENTITY_INSERT consultant_profiles OFF;

-- Dữ liệu mẫu cho bảng notifications
SET IDENTITY_INSERT notifications ON;
INSERT INTO notifications (id, user_id, title, content, type, scheduled_at, status) VALUES
  (1, 3, N'Nhắc uống thuốc', N'Đã đến giờ uống thuốc tránh thai', 'PILL_REMINDER', GETDATE(), 'SCHEDULED'),
  (2, 3, N'Nhắc ngày rụng trứng', N'Hôm nay là ngày rụng trứng', 'OVULATION', GETDATE(), 'SENT'),
  (3, 5, N'Nhắc xác suất mang thai', N'Xác suất mang thai cao', 'PREGNANCY_PROBABILITY', GETDATE(), 'FAILED'),
  (4, 5, N'Nhắc tập thể dục', N'Đã đến giờ tập luyện', 'PILL_REMINDER', GETDATE(), 'SCHEDULED'),
  (5, 5, N'Nhắc uống nước', N'Bạn nên uống đủ nước mỗi ngày', 'OVULATION', GETDATE(), 'SENT');
SET IDENTITY_INSERT notifications OFF;

-- Dữ liệu mẫu cho bảng payment_info
SET IDENTITY_INSERT payment_info ON;
INSERT INTO payment_info (payment_info_id, user_id, card_number, card_holder_name, expiry_month, expiry_year, cvv, card_type, is_default, is_active, nickname, created_at, updated_at) VALUES
  (1, 3, '4111111111111111', N'Trần Thị B', '12', '2026', '123', 'VISA', 1, 1, N'Thẻ chính', GETDATE(), GETDATE()),
  (2, 4, '5555555555554444', N'Phạm Văn C', '06', '2025', '456', 'MASTERCARD', 0, 1, N'Thẻ phụ', GETDATE(), GETDATE()),
  (3, 5, '4000123412341234', N'Ngô Minh E', '09', '2027', '789', 'VISA', 1, 1, N'Thẻ MOD', GETDATE(), GETDATE()),
  (4, 5, '6011000990139424', N'Đặng Thị F', '03', '2028', '321', 'DISCOVER', 0, 1, N'Thẻ GUEST', GETDATE(), GETDATE());
SET IDENTITY_INSERT payment_info OFF;

-- Dữ liệu mẫu cho bảng control_pills
SET IDENTITY_INSERT control_pills ON;
INSERT INTO control_pills (pills_id, start_date, is_active, remind_time, number_days_drinking, number_days_off, updated_at, created_at, placebo, user_id) VALUES
  (1, '2024-01-01', 1, '07:00:00', 21, 7, GETDATE(), GETDATE(), 0, 3),
  (2, '2024-02-01', 1, '08:00:00', 28, 0, GETDATE(), GETDATE(), 1, 5),
  (3, '2024-03-01', 1, '06:30:00', 21, 7, GETDATE(), GETDATE(), 0, 5),
  (4, '2024-04-01', 1, '09:00:00', 28, 0, GETDATE(), GETDATE(), 1, 5);
SET IDENTITY_INSERT control_pills OFF;

-- Dữ liệu mẫu cho bảng pill_logs
SET IDENTITY_INSERT pill_logs ON;
INSERT INTO pill_logs (log_id, control_pills_id, check_in, created_at, updated_at, status, log_date) VALUES
  (1, 1, '2024-01-02 07:05:00', GETDATE(), GETDATE(), 1, '2024-01-02'),
  (2, 1, '2024-01-03 07:10:00', GETDATE(), GETDATE(), 1, '2024-01-03'),
  (3, 2, '2024-02-02 08:01:00', GETDATE(), GETDATE(), 1, '2024-02-02'),
  (4, 3, '2024-03-02 06:35:00', GETDATE(), GETDATE(), 1, '2024-03-02'),
  (5, 4, '2024-04-02 09:05:00', GETDATE(), GETDATE(), 1, '2024-04-02');
SET IDENTITY_INSERT pill_logs OFF;

-- Dữ liệu mẫu cho bảng menstrual_cycle
SET IDENTITY_INSERT menstrual_cycle ON;
INSERT INTO menstrual_cycle (cycle_id, user_id, start_date, number_of_days, cycle_length, ovulation_date, created_at) VALUES
  (1, 2, '2024-01-01', 5, 28, '2024-01-14', GETDATE()),
  (2, 4, '2024-02-01', 6, 30, '2024-02-16', GETDATE()),
  (3, 5, '2024-03-01', 4, 27, '2024-03-13', GETDATE()),
  (4, 5, '2024-04-01', 5, 29, '2024-04-15', GETDATE());
SET IDENTITY_INSERT menstrual_cycle OFF;

-- Dữ liệu mẫu cho bảng notification_preference
SET IDENTITY_INSERT notification_preference ON;
INSERT INTO notification_preference (noti_id, user_id, type, enabled) VALUES
  (1, 3, 'PILL_REMINDER', 1),
  (2, 3, 'OVULATION', 1),
  (3, 5, 'PREGNANCY_PROBABILITY', 0),
  (4, 5, 'PILL_REMINDER', 1),
  (5, 5, 'OVULATION', 0);
SET IDENTITY_INSERT notification_preference OFF;

-- Dữ liệu mẫu cho bảng blog_sections
SET IDENTITY_INSERT blog_sections ON;
INSERT INTO blog_sections (section_id, post_id, section_title, section_content, section_image, display_order) VALUES
  (1, 1, N'Giới thiệu', N'Nội dung phần 1...', NULL, 1),
  (2, 1, N'Lời khuyên', N'Nội dung phần 2...', NULL, 2),
  (3, 2, N'Nguyên nhân', N'Nội dung phần 3...', NULL, 1),
  (4, 4, N'Bổ sung dinh dưỡng', N'Nội dung phần 4...', NULL, 1),
  (5, 5, N'Bài tập mẫu', N'Nội dung phần 5...', NULL, 1);
SET IDENTITY_INSERT blog_sections OFF;

-- Dữ liệu mẫu cho bảng consultations
SET IDENTITY_INSERT consultations ON;
INSERT INTO consultations (consultation_id, customer_id, consultant_id, start_time, end_time, status, meet_url, created_at, updated_at, notes, reason) VALUES
  (1, 2, 4, '2024-03-01 09:00:00', '2024-03-01 09:30:00', 'COMPLETED', 'https://meet1', GETDATE(), GETDATE(), N'Tư vấn sức khỏe', NULL),
  (2, 4, 4, '2024-03-02 10:00:00', '2024-03-02 10:30:00', 'CONFIRMED', 'https://meet2', GETDATE(), GETDATE(), N'Tư vấn tâm lý', NULL),
  (3, 5, 4, '2024-04-01 11:00:00', '2024-04-01 11:30:00', 'CANCELED', 'https://meet3', GETDATE(), GETDATE(), N'Khách hủy lịch', N'Bận việc'),
  (4, 5, 4, '2024-04-02 12:00:00', '2024-04-02 12:30:00', 'PENDING', 'https://meet4', GETDATE(), GETDATE(), NULL, NULL);
SET IDENTITY_INSERT consultations OFF;

-- Dữ liệu mẫu cho bảng questions
SET IDENTITY_INSERT questions ON;
INSERT INTO questions (question_id, customer_id, category_question_id, content, answer, status, updater_id, replier_id, created_at, updated_at, rejection_reason) VALUES
  (1, 2, 1, N'Làm sao để theo dõi chu kỳ kinh nguyệt?', N'Bạn có thể dùng app...', 'ANSWERED', NULL, 4, GETDATE(), GETDATE(), NULL),
  (2, 4, 2, N'Quan hệ an toàn là gì?', NULL, 'PROCESSING', NULL, NULL, GETDATE(), GETDATE(), NULL),
  (3, 5, 4, N'Chế độ ăn uống nào tốt?', N'Nên ăn nhiều rau xanh...', 'CONFIRMED', NULL, 5, GETDATE(), GETDATE(), NULL),
  (4, 5, 5, N'Tập luyện bao nhiêu là đủ?', NULL, 'PROCESSING', NULL, NULL, GETDATE(), GETDATE(), NULL);
SET IDENTITY_INSERT questions OFF;

-- Dữ liệu mẫu cho bảng sti_tests
SET IDENTITY_INSERT sti_tests ON;
INSERT INTO sti_tests (test_id, customer_id, service_id, package_id, staff_id, consultant_id, appointment_date, total_price, customer_notes, consultant_notes, result_date, status, cancel_reason, created_at, updated_at) VALUES
  (1, 2, 1, 1, 4, 4, '2024-03-05 08:00:00', 1200000, N'Khách muốn kiểm tra tổng quát', NULL, '2024-03-10 10:00:00', 'COMPLETED', NULL, GETDATE(), GETDATE()),
  (2, 4, 2, 2, 4, 4, '2024-03-06 09:00:00', 800000, N'Kiểm tra HPV', NULL, NULL, 'PENDING', NULL, GETDATE(), GETDATE()),
  (3, 5, 3, 3, 5, 4, '2024-04-05 08:00:00', 1500000, N'Kiểm tra tổng hợp', NULL, NULL, 'CANCELED', N'Khách hủy', GETDATE(), GETDATE()),
  (4, 5, 4, 4, 5, 4, '2024-04-06 09:00:00', 600000, N'Xét nghiệm nhanh', NULL, NULL, 'PENDING', NULL, GETDATE(), GETDATE());
SET IDENTITY_INSERT sti_tests OFF;

-- Dữ liệu mẫu cho bảng test_results
SET IDENTITY_INSERT test_results ON;
INSERT INTO test_results (result_id, test_id, component_id, service_id, result_value, unit, normal_range, conclusion, reviewed_by, reviewed_at, created_at, updated_at) VALUES
  (1, 1, 1, 1, N'Âm tính', N'copies/mL', N'< 20', 'NOT_INFECTED', 4, GETDATE(), GETDATE(), GETDATE()),
  (2, 2, 2, 2, N'Dương tính', N'copies/mL', N'< 20', 'INFECTED', 4, GETDATE(), GETDATE(), GETDATE()),
  (3, 3, 3, 3, N'Bình thường', N'copies/mL', N'< 20', 'ABNORMAL', 5, GETDATE(), GETDATE(), GETDATE()),
  (4, 4, 4, 4, N'Âm tính', N'copies/mL', N'< 20', 'NOT_INFECTED', 5, GETDATE(), GETDATE(), GETDATE());
SET IDENTITY_INSERT test_results OFF;

-- Dữ liệu mẫu cho bảng package_services
SET IDENTITY_INSERT package_services ON;
INSERT INTO package_services (id, package_id, service_id, created_at) VALUES
  (1, 1, 1, GETDATE()),
  (2, 2, 2, GETDATE()),
  (3, 3, 3, GETDATE()),
  (4, 4, 4, GETDATE());
SET IDENTITY_INSERT package_services OFF;

-- Dữ liệu mẫu cho bảng ratings
SET IDENTITY_INSERT ratings ON;
INSERT INTO ratings (rating_id, user_id, target_type, target_id, rating, comment, staff_reply, replied_by, replied_at, consultation_id, sti_test_id, is_active, created_at, updated_at) VALUES
  (1, 3, 'CONSULTANT', 4, 5, N'Rất hài lòng', NULL, NULL, NULL, 1, NULL, 1, GETDATE(), GETDATE()),
  (2, 4, 'STI_SERVICE', 1, 4, N'Dịch vụ tốt', NULL, NULL, NULL, NULL, 1, 1, GETDATE(), GETDATE()),
  (3, 5, 'CONSULTANT', 4, 3, N'Bình thường', NULL, NULL, NULL, 3, NULL, 1, GETDATE(), GETDATE()),
  (4, 5, 'STI_SERVICE', 3, 2, N'Chưa hài lòng', NULL, NULL, NULL, NULL, 3, 1, GETDATE(), GETDATE());
SET IDENTITY_INSERT ratings OFF;

-- Dữ liệu mẫu cho bảng rating_summary
SET IDENTITY_INSERT rating_summary ON;
INSERT INTO rating_summary (summary_id, target_type, target_id, total_ratings, average_rating, five_star_count, four_star_count, three_star_count, two_star_count, one_star_count, last_updated) VALUES
  (1, 'CONSULTANT', 4, 1, 5.0, 1, 0, 0, 0, 0, GETDATE()),
  (2, 'STI_SERVICE', 1, 1, 4.0, 0, 1, 0, 0, 0, GETDATE()),
  (3, 'CONSULTANT', 5, 1, 3.0, 0, 0, 1, 0, 0, GETDATE()),
  (4, 'STI_SERVICE', 3, 1, 2.0, 0, 0, 0, 1, 0, GETDATE());
SET IDENTITY_INSERT rating_summary OFF;

-- Dữ liệu mẫu cho bảng pregnancy_prob_log
SET IDENTITY_INSERT pregnancy_prob_log ON;
INSERT INTO pregnancy_prob_log (log_id, menstrual_cycle_id, predicted_date, pregnancy_probability) VALUES
  (1, 1, '2024-01-15', 10.5),
  (2, 2, '2024-02-17', 15.0),
  (3, 3, '2024-03-15', 12.0),
  (4, 4, '2024-04-16', 18.5);
SET IDENTITY_INSERT pregnancy_prob_log OFF; 