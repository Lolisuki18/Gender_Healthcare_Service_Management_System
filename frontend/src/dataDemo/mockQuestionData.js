/**
 * mockQuestionData.js - Dữ liệu mẫu cho các câu hỏi bác sĩ
 */

// Mock data cho các câu hỏi
const mockQuestions = [
  {
    id: 1,
    blogId: 1,
    userId: 1,
    userName: "Nguyễn Thị Mai",
    userAvatar: null,
    question: "Xin chào bác sĩ, con tôi 16 tuổi rồi nhưng kinh nguyệt vẫn chưa đều. Có khi 2 tháng mới có 1 lần. Tình trạng này có bình thường không ạ?",
    createdAt: "2024-12-15T10:30:00Z",
    status: "answered", // pending, answered, archived
    doctorReply: {
      doctorName: "BS. Nguyễn Văn A",
      doctorTitle: "Bác sĩ Sản Phụ khoa",
      content: "Chào chị Mai. Ở độ tuổi 16, chu kỳ kinh nguyệt không đều là khá phổ biến do hệ thống hormone chưa ổn định hoàn toàn. Tuy nhiên, nếu tình trạng này kéo dài quá 2 năm kể từ lần đầu có kinh hoặc có các triệu chứng bất thường khác, chị nên đưa con đến khám để được tư vấn cụ thể hơn.",
      repliedAt: "2024-12-15T14:20:00Z"
    }
  },
  {
    id: 2,
    blogId: 1,
    userId: 2,
    userName: "Trần Văn Hùng",
    userAvatar: null,
    question: "Bác sĩ ơi, vợ tôi đang mang thai 3 tháng, có nên tiêm vaccine ngừa COVID-19 không? Có ảnh hưởng gì đến thai nhi không ạ?",
    createdAt: "2024-12-14T15:45:00Z",
    status: "answered",
    doctorReply: {
      doctorName: "BS. Lê Thị Hoa",
      doctorTitle: "Bác sĩ Sản Phụ khoa",
      content: "Chào anh Hùng. Theo khuyến cáo hiện tại, phụ nữ mang thai có thể tiêm vaccine COVID-19 từ tam cá nguyệt thứ 2 (sau 12 tuần). Vaccine giúp bảo vệ cả mẹ và bé, đặc biệt quan trọng vì COVID-19 có thể gây biến chứng nghiêm trọng ở bà bầu. Tuy nhiên, anh nên tham khảo ý kiến bác sĩ sản khoa đang theo dõi để được tư vấn phù hợp.",
      repliedAt: "2024-12-14T18:30:00Z"
    }
  },
  {
    id: 3,
    blogId: 2,
    userId: 3,
    userName: "Phạm Thị Lan",
    userAvatar: null,
    question: "Bác sĩ ơi, em đang bị viêm âm đạo tái phát nhiều lần. Mỗi lần điều trị xong lại tái phát sau 1-2 tháng. Em phải làm sao để chữa dứt điểm ạ?",
    createdAt: "2024-12-13T09:15:00Z",
    status: "answered",
    doctorReply: {
      doctorName: "BS. Hoàng Thị Kim",
      doctorTitle: "Bác sĩ Sản Phụ khoa",
      content: "Chào em Lan. Viêm âm đạo tái phát có nhiều nguyên nhân như: thay đổi hormone, vệ sinh không đúng cách, stress, đái tháo đường, hoặc kháng thuốc. Em nên đi khám để xác định chính xác loại vi khuẩn/nấm gây bệnh, điều trị đúng thuốc và liều lượng, đồng thời cải thiện lối sống và vệ sinh cá nhân.",
      repliedAt: "2024-12-13T16:45:00Z"
    }
  },
  {
    id: 4,
    blogId: 3,
    userId: 4,
    userName: "Lê Văn Tùng",
    userAvatar: null,
    question: "Bác sĩ ơi, vợ tôi sinh con được 6 tháng rồi nhưng vẫn chưa có kinh nguyệt trở lại. Vợ tôi đang cho con bú hoàn toàn bằng sữa mẹ. Tình trạng này có bình thường không ạ?",
    createdAt: "2024-12-12T11:20:00Z",
    status: "pending"
  },
  {
    id: 5,
    blogId: 4,
    userId: 5,
    userName: "Đỗ Thị Hương",
    userAvatar: null,
    question: "Em 25 tuổi, chưa kết hôn. Gần đây em thấy có những cục nhỏ ở ngực, di động được khi sờ. Em rất lo lắng, không biết có phải là khối u không? Em nên đi khám ở đâu ạ?",
    createdAt: "2024-12-11T14:30:00Z",
    status: "answered",
    doctorReply: {
      doctorName: "BS. Vũ Minh Đức",
      doctorTitle: "Bác sĩ Phẫu thuật Vú",
      content: "Chào em Hương. Ở độ tuổi 25, những cục nhỏ di động ở ngực thường là u xơ tuyến vú lành tính, rất phổ biến ở phụ nữ trẻ. Tuy nhiên, để yên tâm hoàn toàn, em nên đến khám tại khoa Ngoại tổng quát hoặc chuyên khoa Vú để được siêu âm và thăm khám cụ thể.",
      repliedAt: "2024-12-11T17:10:00Z"
    }
  },
  {
    id: 6,
    blogId: 5,
    userId: 6,
    userName: "Ngô Thị Bích",
    userAvatar: null,
    question: "Bác sĩ ơi, em bị đau bụng kinh rất dữ dội mỗi tháng, có khi phải nghỉ làm. Em đã uống thuốc giảm đau nhưng không hiệu quả. Có cách nào điều trị triệt để không ạ?",
    createdAt: "2024-12-10T08:45:00Z",
    status: "answered",
    doctorReply: {
      doctorName: "BS. Nguyễn Văn A",
      doctorTitle: "Bác sĩ Sản Phụ khoa",
      content: "Chào em Bích. Đau bụng kinh dữ dội có thể do nhiều nguyên nhân như lạc nội mạc tử cung, u xơ tử cung, hoặc viêm nhiễm. Em nên đi khám để xác định nguyên nhân cụ thể qua siêu âm và xét nghiệm. Có nhiều phương pháp điều trị hiệu quả như thuốc hormone, thuốc chống viêm, hoặc phẫu thuật nội soi nếu cần thiết.",
      repliedAt: "2024-12-10T15:20:00Z"
    }
  },
  {
    id: 7,
    blogId: 6,
    userId: 7,
    userName: "Hoàng Văn Nam",
    userAvatar: null,
    question: "Vợ tôi vừa sinh xong 2 tuần, hiện tại có hiện tượng sốt nhẹ và đau vùng bụng dưới. Tôi có nên đưa vợ đi khám ngay không ạ?",
    createdAt: "2024-12-09T19:30:00Z",
    status: "answered",
    doctorReply: {
      doctorName: "BS. Trần Thị Mai",
      doctorTitle: "Bác sĩ Sản Phụ khoa",
      content: "Chào anh Nam. Sốt và đau bụng sau sinh có thể là dấu hiệu của nhiễm trùng sau sinh, đây là tình trạng cần được xử lý kịp thời. Anh nên đưa vợ đến bệnh viện ngay để được khám và điều trị, đặc biệt nếu sốt trên 38°C hoặc có các triệu chứng khác như ra máu nhiều, khí hư có mùi hôi.",
      repliedAt: "2024-12-09T20:15:00Z"
    }
  },
  {
    id: 8,
    blogId: 7,
    userId: 8,
    userName: "Lý Thị Thu",
    userAvatar: null,
    question: "Em 30 tuổi, cố gắng có con được 1 năm rồi nhưng chưa có tin vui. Kinh nguyệt em đều đặn, chồng em cũng khỏe mạnh. Chúng em nên làm những xét nghiệm gì ạ?",
    createdAt: "2024-12-08T13:15:00Z",
    status: "pending"
  }
];

// Utility functions để làm việc với mock data
export const getQuestionsByBlogId = (blogId, limit = null) => {
  const filtered = mockQuestions.filter(q => q.blogId === parseInt(blogId));
  return limit ? filtered.slice(0, limit) : filtered;
};

export const getQuestionById = (questionId) => {
  return mockQuestions.find(q => q.id === parseInt(questionId));
};

export const getAllQuestions = (limit = null) => {
  return limit ? mockQuestions.slice(0, limit) : mockQuestions;
};

export const getQuestionsByStatus = (status, limit = null) => {
  const filtered = mockQuestions.filter(q => q.status === status);
  return limit ? filtered.slice(0, limit) : filtered;
};

export const submitQuestion = async (blogId, questionText, userId = null, userName = "Người dùng ẩn danh") => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const newQuestion = {
        id: mockQuestions.length + 1,
        blogId: parseInt(blogId),
        userId: userId || mockQuestions.length + 1,
        userName,
        userAvatar: null,
        question: questionText,
        createdAt: new Date().toISOString(),
        status: "pending"
      };
      
      mockQuestions.unshift(newQuestion); // Add to beginning
      resolve(newQuestion);
    }, 1500);
  });
};

export const addDoctorReply = async (questionId, doctorReply) => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const question = mockQuestions.find(q => q.id === parseInt(questionId));
      if (question) {
        question.doctorReply = {
          ...doctorReply,
          repliedAt: new Date().toISOString()
        };
        question.status = "answered";
        resolve(question);
      } else {
        reject(new Error("Question not found"));
      }
    }, 1000);
  });
};

export default mockQuestions;
