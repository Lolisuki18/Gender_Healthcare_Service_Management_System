// Dữ liệu demo cho xét nghiệm lẻ
export const demoSingleTests = [
  {
    id: 1,
    name: 'Công Thức Máu',
    price: 85000,
    description: 'Xét nghiệm công thức máu (CBC) là một xét nghiệm được sử dụng để sàng lọc nhiều bệnh lý...',
    referenceRange: 'Hồng cầu: 4.5-5.5 T/L\nBạch cầu: 4.0-10.0 G/L\nTiểu cầu: 150-450 G/L'
  },
  {
    id: 2,
    name: 'ALT',
    price: 26000,
    description: 'Xét nghiệm ALT (Alanine Aminotransferase) là xét nghiệm máu đo nồng độ enzyme ALT trong máu...',
    referenceRange: 'Nam: 10-40 U/L\nNữ: 7-35 U/L'
  },
  {
    id: 3,
    name: 'AST',
    price: 26000,
    description: 'Xét nghiệm AST (Aspartate Aminotransferase) giúp đánh giá chức năng gan...',
    referenceRange: 'Nam: 10-40 U/L\nNữ: 7-35 U/L'
  },
  {
    id: 4,
    name: 'Định lượng Glucose lúc đói [Huyết Tương]',
    price: 25000,
    description: 'Xét nghiệm đo lượng đường huyết lúc đói để phát hiện nguy cơ đái tháo đường...',
    referenceRange: 'Bình thường: 3.9-5.6 mmol/L\nTiền đái tháo đường: 5.6-6.9 mmol/L\nĐái tháo đường: ≥ 7.0 mmol/L'
  },
  {
    id: 5,
    name: 'HPV',
    price: 180000,
    description: 'Xét nghiệm HPV giúp phát hiện virus gây ung thư cổ tử cung.',
    referenceRange: 'Âm tính: Không phát hiện DNA HPV\nDương tính: Phát hiện DNA HPV'
  },
  {
    id: 6,
    name: 'Herpes',
    price: 150000,
    description: 'Xét nghiệm Herpes giúp phát hiện virus HSV gây mụn rộp sinh dục.',
    referenceRange: 'Âm tính: Không phát hiện HSV\nDương tính: Phát hiện HSV'
  },
  {
    id: 7,
    name: 'Chlamydia',
    price: 150000,
    description: 'Xét nghiệm Chlamydia để phát hiện bệnh Chlamydia.',
    referenceRange: 'Âm tính: < 0.9 COI\nDương tính: ≥ 1.0 COI\nKhông xác định: 0.9 - 1.0 COI'
  },
  {
    id: 8,
    name: 'Viem gan B',
    price: 170000,
    description: 'Xét nghiệm Viêm gan B giúp phát hiện virus HBV.',
    referenceRange: 'Âm tính: Không phát hiện HBsAg\nDương tính: Phát hiện HBsAg'
  },
  {
    id: 9,
    name: 'HSV',
    price: 150000,
    description: 'Xét nghiệm HSV giúp phát hiện virus Herpes Simplex.',
    referenceRange: 'Âm tính: Không phát hiện HSV\nDương tính: Phát hiện HSV'
  },
  {
    id: 10,
    name: 'HCV',
    price: 170000,
    description: 'Xét nghiệm HCV giúp phát hiện virus viêm gan C.',
    referenceRange: 'Âm tính: Không phát hiện HCV\nDương tính: Phát hiện HCV'
  },
  {
    id: 11,
    name: 'Lau',
    price: 150000,
    description: 'Xét nghiệm lậu (Gonorrhea) để phát hiện bệnh lậu.',
    referenceRange: 'Âm tính: < 0.9 COI\nDương tính: ≥ 1.0 COI\nKhông xác định: 0.9 - 1.0 COI'
  },
  {
    id: 12,
    name: 'HIV',
    price: 200000,
    description: 'Xét nghiệm HIV để phát hiện virus gây suy giảm miễn dịch ở người.',
    referenceRange: 'Âm tính: < 0.9 COI\nDương tính: ≥ 1.0 COI\nKhông xác định: 0.9 - 1.0 COI'
  },
  {
    id: 13,
    name: 'Syphilis',
    price: 150000,
    description: 'Xét nghiệm Syphilis để phát hiện bệnh giang mai.',
    referenceRange: 'Âm tính: < 0.9 COI\nDương tính: ≥ 1.0 COI\nKhông xác định: 0.9 - 1.0 COI'
  },
  {
    id: 14,
    name: 'Gonorrhea',
    price: 150000,
    description: 'Xét nghiệm Gonorrhea để phát hiện bệnh lậu.',
    referenceRange: 'Âm tính: < 0.9 COI\nDương tính: ≥ 1.0 COI\nKhông xác định: 0.9 - 1.0 COI'
  }
];

// Mảng ảnh demo cho các gói package
export const packageImages = [
  'https://cdn.diag.vn/2023/09/Goixetnghiem_momau.png',
  'https://cdn.diag.vn/2023/09/Goixetnghiem_tongquat.png',
  'https://cdn.diag.vn/2023/09/Goixetnghiem_daithaoduong.png',
  'https://cdn.diag.vn/2023/09/Goixetnghiem_stds.png'
];

// Dữ liệu demo quy trình xét nghiệm
export const testProcedures = {
  'HIV': {
    steps: [
      'Tư vấn trước xét nghiệm về HIV/AIDS',
      'Lấy mẫu máu tĩnh mạch',
      'Xét nghiệm sàng lọc HIV bằng phương pháp ELISA',
      'Nếu kết quả dương tính, thực hiện xét nghiệm khẳng định Western Blot',
      'Tư vấn sau xét nghiệm và giải thích kết quả'
    ],
    preparation: [
      'Không cần nhịn đói',
      'Có thể uống nước bình thường',
      'Thông báo với nhân viên y tế nếu đang dùng thuốc'
    ],
    time: '15-30 phút',
    results: '1-3 ngày làm việc',
    referenceRange: 'Âm tính: < 0.9 COI\nDương tính: ≥ 1.0 COI\nKhông xác định: 0.9 - 1.0 COI',
    price: '200.000 VNĐ',
    description: 'Xét nghiệm HIV để phát hiện virus gây suy giảm miễn dịch ở người.'
  },
  'Syphilis': {
    steps: [
      'Tư vấn trước xét nghiệm về Syphilis',
      'Lấy mẫu máu tĩnh mạch',
      'Xét nghiệm sàng lọc Syphilis bằng phương pháp RPR',
      'Nếu kết quả dương tính, thực hiện xét nghiệm khẳng định TPHA',
      'Tư vấn sau xét nghiệm và giải thích kết quả'
    ],
    preparation: [
      'Không cần nhịn đói',
      'Có thể uống nước bình thường',
      'Thông báo với nhân viên y tế nếu đang dùng thuốc'
    ],
    time: '15-30 phút',
    results: '1-3 ngày làm việc',
    referenceRange: 'Âm tính: < 0.9 COI\nDương tính: ≥ 1.0 COI\nKhông xác định: 0.9 - 1.0 COI',
    price: '150.000 VNĐ',
    description: 'Xét nghiệm Syphilis để phát hiện bệnh giang mai.'
  },
  'Gonorrhea': {
    steps: [
      'Tư vấn trước xét nghiệm về Gonorrhea',
      'Lấy mẫu máu tĩnh mạch',
      'Xét nghiệm sàng lọc Gonorrhea bằng phương pháp PCR',
      'Nếu kết quả dương tính, thực hiện xét nghiệm khẳng định Culture',
      'Tư vấn sau xét nghiệm và giải thích kết quả'
    ],
    preparation: [
      'Không cần nhịn đói',
      'Có thể uống nước bình thường',
      'Thông báo với nhân viên y tế nếu đang dùng thuốc'
    ],
    time: '15-30 phút',
    results: '1-3 ngày làm việc',
    referenceRange: 'Âm tính: < 0.9 COI\nDương tính: ≥ 1.0 COI\nKhông xác định: 0.9 - 1.0 COI',
    price: '150.000 VNĐ',
    description: 'Xét nghiệm Gonorrhea để phát hiện bệnh lậu.'
  },
  'Chlamydia': {
    steps: [
      'Tư vấn trước xét nghiệm về Chlamydia',
      'Lấy mẫu máu tĩnh mạch',
      'Xét nghiệm sàng lọc Chlamydia bằng phương pháp PCR',
      'Nếu kết quả dương tính, thực hiện xét nghiệm khẳng định Culture',
      'Tư vấn sau xét nghiệm và giải thích kết quả'
    ],
    preparation: [
      'Không cần nhịn đói',
      'Có thể uống nước bình thường',
      'Thông báo với nhân viên y tế nếu đang dùng thuốc'
    ],
    time: '15-30 phút',
    results: '1-3 ngày làm việc',
    referenceRange: 'Âm tính: < 0.9 COI\nDương tính: ≥ 1.0 COI\nKhông xác định: 0.9 - 1.0 COI',
    price: '150.000 VNĐ',
    description: 'Xét nghiệm Chlamydia để phát hiện bệnh Chlamydia.'
  }
};

// Banner slider demo
export const bannerImages = [
  'https://img.freepik.com/free-photo/medical-banner-with-doctor-working-hospital_23-2149611193.jpg',
  'https://img.freepik.com/free-photo/medical-banner-with-doctor-stethoscope_23-2149611202.jpg',
  'https://img.freepik.com/free-photo/medical-banner-with-doctor-protective-mask_23-2149611200.jpg'
];

// Danh sách tư vấn viên demo (nếu còn dùng)
export const counselors = [
  { id: 1, name: 'BS. Nguyễn Thị Minh Tâm', specialization: 'Chuyên gia Sức khỏe Sinh sản' },
  { id: 2, name: 'BS. Trần Văn Hoàng', specialization: 'Chuyên khoa Nam học' },
  { id: 3, name: 'BS. Lê Thị Thanh Hương', specialization: 'Chuyên gia Phụ khoa' },
  { id: 4, name: 'BS. Phạm Minh Đức', specialization: 'Chuyên gia STI & HIV/AIDS' },
  { id: 5, name: 'BS. Võ Thị Mai Anh', specialization: 'Chuyên khoa Kế hoạch hóa gia đình' },
  { id: 6, name: 'BS. Đặng Quốc Bảo', specialization: 'Chuyên gia Xét nghiệm STI' },
  { id: 7, name: 'BS. Hoàng Thị Lan', specialization: 'Tư vấn Sức khỏe Giới tính' },
  { id: 8, name: 'BS. Bùi Văn Minh', specialization: 'Chuyên gia Y tế Công cộng' },
  { id: 9, name: 'BS. Trương Thị Hồng', specialization: 'Chuyên khoa Nội tiết' },
  { id: 10, name: 'BS. Ngô Thanh Tùng', specialization: 'Chuyên gia Tham vấn Tâm lý' }
];

// Quy trình xét nghiệm chung
export const generalProcedureSteps = [
  {
    title: 'Đăng ký xét nghiệm',
    description: 'Đăng ký online cho lấy mẫu xét nghiệm tại nhà hoặc đến các điểm lấy mẫu của Diag'
  },
  {
    title: 'Lấy mẫu xét nghiệm',
    description: 'Điều dưỡng sẽ lấy mẫu xét nghiệm'
  },
  {
    title: 'Trả kết quả',
    description: 'Kết quả xét nghiệm sẽ được gửi cho khách hàng bằng SMS hoặc Zalo'
  },
  {
    title: 'Bác sĩ tư vấn miễn phí',
    description: 'Nhận tư vấn từ xa miễn phí hoặc theo dõi kết quả với bác sĩ riêng của bạn'
  }
];

export const demoPackages = [
  {
    id: 1,
    name: 'Gói Xét Nghiệm Tổng Quát',
    price: 500000,
    description: 'Gói xét nghiệm tổng quát bao gồm các xét nghiệm cơ bản để đánh giá sức khỏe tổng thể.',
    testComponents: [
      {
        testName: 'Công Thức Máu',
        price: 85000,
        description: 'Xét nghiệm công thức máu (CBC) là một xét nghiệm được sử dụng để sàng lọc nhiều bệnh lý...',
        referenceRange: 'Hồng cầu: 4.5-5.5 T/L\nBạch cầu: 4.0-10.0 G/L\nTiểu cầu: 150-450 G/L'
      },
      {
        testName: 'ALT',
        price: 26000,
        description: 'Xét nghiệm ALT (Alanine Aminotransferase) là xét nghiệm máu đo nồng độ enzyme ALT trong máu...',
        referenceRange: 'Nam: 10-40 U/L\nNữ: 7-35 U/L'
      },
      {
        testName: 'AST',
        price: 26000,
        description: 'Xét nghiệm AST (Aspartate Aminotransferase) giúp đánh giá chức năng gan...',
        referenceRange: 'Nam: 10-40 U/L\nNữ: 7-35 U/L'
      },
      {
        testName: 'Định lượng Glucose lúc đói [Huyết Tương]',
        price: 25000,
        description: 'Xét nghiệm đo lượng đường huyết lúc đói để phát hiện nguy cơ đái tháo đường...',
        referenceRange: 'Bình thường: 3.9-5.6 mmol/L\nTiền đái tháo đường: 5.6-6.9 mmol/L\nĐái tháo đường: ≥ 7.0 mmol/L'
      }
    ]
  },
  {
    id: 2,
    name: 'Gói Toàn Diện',
    price: 1200000,
    description: 'Xét nghiệm toàn bộ bệnh STI.',
    testComponents: [
      {
        testName: 'HIV',
        price: 200000,
        description: 'Xét nghiệm HIV để phát hiện virus gây suy giảm miễn dịch ở người.',
        referenceRange: 'Âm tính: < 0.9 COI\nDương tính: ≥ 1.0 COI\nKhông xác định: 0.9 - 1.0 COI'
      },
      {
        testName: 'Syphilis',
        price: 150000,
        description: 'Xét nghiệm Syphilis để phát hiện bệnh giang mai.',
        referenceRange: 'Âm tính: < 0.9 COI\nDương tính: ≥ 1.0 COI\nKhông xác định: 0.9 - 1.0 COI'
      },
      {
        testName: 'Lau',
        price: 150000,
        description: 'Xét nghiệm lậu (Gonorrhea) để phát hiện bệnh lậu.',
        referenceRange: 'Âm tính: < 0.9 COI\nDương tính: ≥ 1.0 COI\nKhông xác định: 0.9 - 1.0 COI'
      },
      {
        testName: 'Chlamydia',
        price: 150000,
        description: 'Xét nghiệm Chlamydia để phát hiện bệnh Chlamydia.',
        referenceRange: 'Âm tính: < 0.9 COI\nDương tính: ≥ 1.0 COI\nKhông xác định: 0.9 - 1.0 COI'
      },
      {
        testName: 'HPV',
        price: 180000,
        description: 'Xét nghiệm HPV giúp phát hiện virus gây ung thư cổ tử cung.',
        referenceRange: 'Âm tính: Không phát hiện DNA HPV\nDương tính: Phát hiện DNA HPV'
      },
      {
        testName: 'Herpes',
        price: 150000,
        description: 'Xét nghiệm Herpes giúp phát hiện virus HSV gây mụn rộp sinh dục.',
        referenceRange: 'Âm tính: Không phát hiện HSV\nDương tính: Phát hiện HSV'
      },
      {
        testName: 'Viem gan B',
        price: 170000,
        description: 'Xét nghiệm Viêm gan B giúp phát hiện virus HBV.',
        referenceRange: 'Âm tính: Không phát hiện HBsAg\nDương tính: Phát hiện HBsAg'
      },
      {
        testName: 'HCV',
        price: 170000,
        description: 'Xét nghiệm HCV giúp phát hiện virus viêm gan C.',
        referenceRange: 'Âm tính: Không phát hiện HCV\nDương tính: Phát hiện HCV'
      }
    ]
  }
];

// Thêm dữ liệu chi tiết xét nghiệm
export const testDetails = {
  'HIV': {
    biologicalIndicators: [
      { name: 'HIV Antibody', normalRange: 'Âm tính', unit: 'N/A' },
      { name: 'HIV Antigen', normalRange: 'Âm tính', unit: 'N/A' }
    ],
    testComponents: [
      'Xét nghiệm máu tĩnh mạch',
      'Xét nghiệm sàng lọc HIV bằng phương pháp ELISA',
      'Xét nghiệm khẳng định Western Blot (nếu cần)'
    ],
    patientNotes: [
      'Không cần nhịn đói',
      'Có thể uống nước bình thường',
      'Thông báo với nhân viên y tế nếu đang dùng thuốc',
      'Kết quả sẽ có sau 1-3 ngày làm việc'
    ]
  },
  'Syphilis': {
    biologicalIndicators: [
      { name: 'RPR', normalRange: 'Âm tính', unit: 'N/A' },
      { name: 'TPHA', normalRange: 'Âm tính', unit: 'N/A' }
    ],
    testComponents: [
      'Xét nghiệm máu tĩnh mạch',
      'Xét nghiệm sàng lọc RPR',
      'Xét nghiệm khẳng định TPHA (nếu cần)'
    ],
    patientNotes: [
      'Không cần nhịn đói',
      'Có thể uống nước bình thường',
      'Thông báo với nhân viên y tế nếu đang dùng thuốc',
      'Kết quả sẽ có sau 1-3 ngày làm việc'
    ]
  },
  'Gonorrhea': {
    biologicalIndicators: [
      { name: 'PCR', normalRange: 'Âm tính', unit: 'N/A' },
      { name: 'Culture', normalRange: 'Âm tính', unit: 'N/A' }
    ],
    testComponents: [
      'Xét nghiệm máu tĩnh mạch',
      'Xét nghiệm dịch tiết (nếu có)',
      'Xét nghiệm PCR',
      'Nuôi cấy vi khuẩn (nếu cần)'
    ],
    patientNotes: [
      'Không cần nhịn đói',
      'Có thể uống nước bình thường',
      'Thông báo với nhân viên y tế nếu đang dùng thuốc',
      'Kết quả sẽ có sau 1-3 ngày làm việc'
    ]
  },
  'Chlamydia': {
    biologicalIndicators: [
      { name: 'PCR', normalRange: 'Âm tính', unit: 'N/A' },
      { name: 'Culture', normalRange: 'Âm tính', unit: 'N/A' }
    ],
    testComponents: [
      'Xét nghiệm máu tĩnh mạch',
      'Xét nghiệm dịch tiết (nếu có)',
      'Xét nghiệm PCR',
      'Nuôi cấy vi khuẩn (nếu cần)'
    ],
    patientNotes: [
      'Không cần nhịn đói',
      'Có thể uống nước bình thường',
      'Thông báo với nhân viên y tế nếu đang dùng thuốc',
      'Kết quả sẽ có sau 1-3 ngày làm việc'
    ]
  },
  'HPV': {
    biologicalIndicators: [
      { name: 'HPV DNA', normalRange: 'Âm tính', unit: 'N/A' },
      { name: 'HPV Type', normalRange: 'Không phát hiện', unit: 'N/A' }
    ],
    testComponents: [
      'Xét nghiệm dịch tiết cổ tử cung',
      'Xét nghiệm PCR phát hiện DNA HPV',
      'Xác định type HPV (nếu cần)'
    ],
    patientNotes: [
      'Không quan hệ tình dục 24-48 giờ trước xét nghiệm',
      'Không thụt rửa âm đạo 24 giờ trước xét nghiệm',
      'Không đặt thuốc âm đạo 24 giờ trước xét nghiệm',
      'Kết quả sẽ có sau 3-5 ngày làm việc'
    ]
  },
  'Herpes': {
    biologicalIndicators: [
      { name: 'HSV-1 IgG', normalRange: 'Âm tính', unit: 'N/A' },
      { name: 'HSV-2 IgG', normalRange: 'Âm tính', unit: 'N/A' }
    ],
    testComponents: [
      'Xét nghiệm máu tĩnh mạch',
      'Xét nghiệm dịch tiết từ vết loét (nếu có)',
      'Xét nghiệm PCR phát hiện HSV'
    ],
    patientNotes: [
      'Không cần nhịn đói',
      'Có thể uống nước bình thường',
      'Thông báo với nhân viên y tế nếu đang dùng thuốc',
      'Kết quả sẽ có sau 2-3 ngày làm việc'
    ]
  },
  'Viem gan B': {
    biologicalIndicators: [
      { name: 'HBsAg', normalRange: 'Âm tính', unit: 'N/A' },
      { name: 'Anti-HBs', normalRange: 'Âm tính', unit: 'N/A' },
      { name: 'HBeAg', normalRange: 'Âm tính', unit: 'N/A' }
    ],
    testComponents: [
      'Xét nghiệm máu tĩnh mạch',
      'Xét nghiệm huyết thanh học',
      'Định lượng virus (nếu cần)'
    ],
    patientNotes: [
      'Nhịn ăn 8 giờ trước khi xét nghiệm',
      'Có thể uống nước lọc',
      'Thông báo với nhân viên y tế nếu đang dùng thuốc',
      'Kết quả sẽ có sau 1-2 ngày làm việc'
    ]
  },
  'HCV': {
    biologicalIndicators: [
      { name: 'Anti-HCV', normalRange: 'Âm tính', unit: 'N/A' },
      { name: 'HCV RNA', normalRange: 'Âm tính', unit: 'N/A' }
    ],
    testComponents: [
      'Xét nghiệm máu tĩnh mạch',
      'Xét nghiệm huyết thanh học',
      'Định lượng virus (nếu cần)'
    ],
    patientNotes: [
      'Nhịn ăn 8 giờ trước khi xét nghiệm',
      'Có thể uống nước lọc',
      'Thông báo với nhân viên y tế nếu đang dùng thuốc',
      'Kết quả sẽ có sau 1-2 ngày làm việc'
    ]
  },
  'Lau': {
    biologicalIndicators: [
      { name: 'PCR', normalRange: 'Âm tính', unit: 'N/A' },
      { name: 'Culture', normalRange: 'Âm tính', unit: 'N/A' }
    ],
    testComponents: [
      'Xét nghiệm máu tĩnh mạch',
      'Xét nghiệm dịch tiết (nếu có)',
      'Xét nghiệm PCR',
      'Nuôi cấy vi khuẩn (nếu cần)'
    ],
    patientNotes: [
      'Không cần nhịn đói',
      'Có thể uống nước bình thường',
      'Thông báo với nhân viên y tế nếu đang dùng thuốc',
      'Kết quả sẽ có sau 1-3 ngày làm việc'
    ]
  }
}; 