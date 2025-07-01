/**
 * mockBlogData.js - Dữ liệu mẫu cho blog
 */

export const mockBlogs = [
  {
    id: 1,
    title: "Tầm quan trọng của việc xét nghiệm STI định kỳ",
    content: `
      <p>Các bệnh lây truyền qua đường tình dục (STI) là một vấn đề sức khỏe nghiêm trọng mà nhiều người thường bỏ qua. Việc xét nghiệm định kỳ không chỉ giúp phát hiện sớm các bệnh lý mà còn bảo vệ sức khỏe của bạn và người thân.</p>
      
      <h3>Tại sao cần xét nghiệm STI định kỳ?</h3>
      <p>Nhiều STI có thể không có triệu chứng rõ ràng trong giai đoạn đầu, nhưng nếu không được điều trị kịp thời có thể gây ra những biến chứng nghiêm trọng như vô sinh, ung thư cổ tử cung, hoặc các vấn đề về tim mạch.</p>
      
      <h3>Ai nên xét nghiệm?</h3>
      <ul>
        <li>Những người có quan hệ tình dục không an toàn</li>
        <li>Những người có nhiều bạn tình</li>
        <li>Phụ nữ có thai hoặc đang chuẩn bị có thai</li>
        <li>Những người có triệu chứng nghi ngờ STI</li>
      </ul>
      
      <p>Hãy liên hệ với chúng tôi để được tư vấn và thực hiện xét nghiệm một cách an toàn và bảo mật.</p>
    `,
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop",
    category: "Xét nghiệm STI",
    author: "BS. Nguyễn Văn A",
    views: 1234,
    createdAt: "2024-12-15T10:30:00Z",
    updatedAt: "2024-12-15T10:30:00Z"
  },
  {
    id: 2,
    title: "Hiểu về chu kỳ rụng trứng và cách theo dõi",
    content: `
      <p>Chu kỳ rụng trứng là một phần tự nhiên của hệ thống sinh sản nữ giới. Hiểu rõ về chu kỳ này giúp phụ nữ có thể theo dõi sức khỏe sinh sản và lập kế hoạch gia đình hiệu quả.</p>
      
      <h3>Chu kỳ rụng trứng là gì?</h3>
      <p>Chu kỳ rụng trứng thường kéo dài từ 21-35 ngày, được tính từ ngày đầu của kỳ kinh nguyệt này đến ngày đầu của kỳ kinh nguyệt tiếp theo. Thời điểm rụng trứng thường xảy ra vào giữa chu kỳ.</p>
      
      <h3>Dấu hiệu rụng trứng</h3>
      <ul>
        <li>Thay đổi chất nhờn cổ tử cung</li>
        <li>Đau nhẹ một bên bụng dưới</li>
        <li>Tăng nhẹ thân nhiệt</li>
        <li>Tăng ham muốn tình dục</li>
      </ul>
      
      <blockquote>Việc theo dõi chu kỳ rụng trứng giúp phụ nữ hiểu rõ hơn về cơ thể mình và có những quyết định sáng suốt về sức khỏe sinh sản.</blockquote>
    `,
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
    category: "Sức khỏe phụ nữ",
    author: "BS. Trần Thị B",
    views: 2156,
    createdAt: "2024-12-10T14:20:00Z",
    updatedAt: "2024-12-10T14:20:00Z"
  },
  {
    id: 3,
    title: "7 thói quen tốt cho sức khỏe sinh sản",
    content: `
      <p>Sức khỏe sinh sản không chỉ quan trọng đối với việc sinh con mà còn ảnh hưởng đến sức khỏe tổng thể. Dưới đây là 7 thói quen đơn giản mà bạn có thể áp dụng hàng ngày.</p>
      
      <h3>1. Duy trì chế độ ăn uống cân bằng</h3>
      <p>Chế độ ăn giàu vitamin, khoáng chất và axit folic giúp cải thiện chất lượng trứng và tinh trùng.</p>
      
      <h3>2. Tập thể dục đều đặn</h3>
      <p>Vận động giúp cải thiện tuần hoàn máu, giảm stress và duy trì cân nặng lý tưởng.</p>
      
      <h3>3. Quản lý stress hiệu quả</h3>
      <p>Stress có thể ảnh hưởng đến hormone sinh sản. Hãy thử yoga, thiền hoặc các hoạt động thư giãn.</p>
      
      <h3>4. Ngủ đủ giấc</h3>
      <p>Giấc ngủ chất lượng giúp cơ thể sản xuất hormone một cách tối ưu.</p>
      
      <h3>5. Tránh thuốc lá và rượu bia</h3>
      <p>Các chất kích thích này có thể làm giảm khả năng sinh sản ở cả nam và nữ.</p>
      
      <h3>6. Bảo vệ khỏi STI</h3>
      <p>Sử dụng biện pháp bảo vệ an toàn và xét nghiệm định kỳ.</p>
      
      <h3>7. Kiểm tra sức khỏe định kỳ</h3>
      <p>Thăm khám định kỳ giúp phát hiện sớm các vấn đề và can thiệp kịp thời.</p>
    `,
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
    category: "Lối sống khỏe mạnh",
    author: "BS. Lê Văn C",
    views: 3421,
    createdAt: "2024-12-08T09:15:00Z",
    updatedAt: "2024-12-08T09:15:00Z"
  },
  {
    id: 4,
    title: "Vai trò của dinh dưỡng trong sức khỏe sinh sản",
    content: `
      <p>Dinh dưỡng đóng vai trò quan trọng trong việc duy trì sức khỏe sinh sản. Một chế độ ăn cân bằng không chỉ giúp cải thiện khả năng sinh sản mà còn hỗ trợ thai kỳ khỏe mạnh.</p>
      
      <h3>Các chất dinh dưỡng quan trọng</h3>
      
      <h4>Axit Folic</h4>
      <p>Axit folic rất quan trọng cho phụ nữ trong độ tuổi sinh đẻ. Nó giúp ngăn ngừa các dị tật ống thần kinh ở thai nhi.</p>
      
      <h4>Sắt</h4>
      <p>Thiếu sắt có thể ảnh hưởng đến chu kỳ kinh nguyệt và khả năng rụng trứng.</p>
      
      <h4>Omega-3</h4>
      <p>Các axit béo omega-3 giúp cải thiện chất lượng trứng và hỗ trợ sự phát triển của thai nhi.</p>
      
      <h4>Kẽm</h4>
      <p>Kẽm quan trọng cho sự phát triển và chức năng của tinh trùng ở nam giới.</p>
      
      <h3>Thực phẩm nên bổ sung</h3>
      <ul>
        <li>Rau lá xanh đậm màu</li>
        <li>Các loại quả mọng</li>
        <li>Cá hồi và các loại cá giàu omega-3</li>
        <li>Các loại hạt và quả khô</li>
        <li>Ngũ cốc nguyên hạt</li>
      </ul>
    `,
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=400&fit=crop",
    category: "Dinh dưỡng",
    author: "BS. Phạm Thị D",
    views: 1876,
    createdAt: "2024-12-05T16:45:00Z",
    updatedAt: "2024-12-05T16:45:00Z"
  },
  {
    id: 5,
    title: "Stress và ảnh hưởng đến sức khỏe sinh sản",
    content: `
      <p>Stress là một phần không thể tránh khỏi trong cuộc sống hiện đại, nhưng ít người biết rằng stress có thể ảnh hưởng nghiêm trọng đến sức khỏe sinh sản của cả nam và nữ giới.</p>
      
      <h3>Stress ảnh hưởng như thế nào?</h3>
      <p>Khi cơ thể căng thẳng, nó sản xuất hormone cortisol. Mức cortisol cao có thể:</p>
      <ul>
        <li>Làm rối loạn chu kỳ kinh nguyệt</li>
        <li>Ảnh hưởng đến quá trình rụng trứng</li>
        <li>Giảm chất lượng tinh trùng ở nam giới</li>
        <li>Làm giảm ham muốn tình dục</li>
      </ul>
      
      <h3>Cách quản lý stress hiệu quả</h3>
      
      <h4>1. Thiền và mindfulness</h4>
      <p>Dành 10-15 phút mỗi ngày để thiền giúp giảm mức cortisol trong cơ thể.</p>
      
      <h4>2. Yoga</h4>
      <p>Yoga kết hợp giữa vận động nhẹ nhàng và thở sâu, giúp thư giãn cả thể chất lẫn tinh thần.</p>
      
      <h4>3. Tập thể dục</h4>
      <p>Vận động giúp giải phóng endorphin - hormone hạnh phúc tự nhiên của cơ thể.</p>
      
      <h4>4. Duy trì kết nối xã hội</h4>
      <p>Chia sẻ với bạn bè, gia đình giúp giảm bớt gánh nặng tâm lý.</p>
    `,
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=400&fit=crop",
    category: "Sức khỏe tâm thần",
    author: "BS. Hoàng Văn E",
    views: 2934,
    createdAt: "2024-12-02T11:30:00Z",
    updatedAt: "2024-12-02T11:30:00Z"
  },
  {
    id: 6,
    title: "Hướng dẫn sử dụng que thử thai chính xác",
    content: `
      <p>Que thử thai là công cụ đơn giản và tiện lợi để phát hiện thai kỳ sớm. Tuy nhiên, để có kết quả chính xác nhất, bạn cần biết cách sử dụng đúng.</p>
      
      <h3>Khi nào nên thử thai?</h3>
      <p>Thời điểm tốt nhất để thử thai là sau khi trễ kinh 1-2 ngày. Nếu chu kỳ kinh nguyệt không đều, hãy đợi ít nhất 3 tuần sau quan hệ không bảo vệ.</p>
      
      <h3>Cách thực hiện</h3>
      <ol>
        <li>Sử dụng nước tiểu buổi sáng để có nồng độ hCG cao nhất</li>
        <li>Đọc kỹ hướng dẫn trên bao bì</li>
        <li>Nhúng que thử vào nước tiểu hoặc cho nước tiểu nhỏ giọt lên que</li>
        <li>Đợi thời gian quy định (thường là 3-5 phút)</li>
        <li>Đọc kết quả đúng thời gian, không đọc sau thời gian quy định</li>
      </ol>
      
      <h3>Giải thích kết quả</h3>
      <ul>
        <li><strong>Một vạch:</strong> Âm tính (không có thai)</li>
        <li><strong>Hai vạch:</strong> Dương tính (có thai)</li>
        <li><strong>Không có vạch nào:</strong> Que thử bị lỗi</li>
      </ul>
      
      <h3>Lưu ý quan trọng</h3>
      <p>Kết quả dương tính giả có thể xảy ra trong một số trường hợp như sử dụng thuốc chứa hCG hoặc mắc một số bệnh lý. Hãy đến cơ sở y tế để xét nghiệm máu xác nhận.</p>
    `,
    imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=400&fit=crop",
    category: "Thai kỳ",
    author: "BS. Nguyễn Thị F",
    views: 4521,
    createdAt: "2024-11-28T13:20:00Z",
    updatedAt: "2024-11-28T13:20:00Z"
  },
  {
    id: 7,
    title: "Những điều cần biết về sức khỏe nam giới",
    content: `
      <p>Sức khỏe nam giới thường bị bỏ qua do nhiều nam giới ngại thăm khám hoặc không có thói quen chăm sóc sức khỏe định kỳ. Tuy nhiên, việc theo dõi và chăm sóc sức khỏe sinh sản là cực kỳ quan trọng.</p>
      
      <h3>Các vấn đề sức khỏe phổ biến ở nam giới</h3>
      
      <h4>1. Rối loạn cương dương</h4>
      <p>Có thể do nhiều nguyên nhân như stress, bệnh lý mạch máu, tiểu đường, hoặc tác dụng phụ của thuốc.</p>
      
      <h4>2. Giảm testosterone</h4>
      <p>Nồng độ testosterone giảm dần theo tuổi, ảnh hưởng đến ham muốn tình dục và sức khỏe tổng thể.</p>
      
      <h4>3. Vô sinh nam</h4>
      <p>Có thể do chất lượng tinh trùng kém, tắc nghẽn, hoặc các vấn đề về hormone.</p>
      
      <h3>Cách duy trì sức khỏe sinh sản</h3>
      <ul>
        <li>Duy trì cân nặng khỏe mạnh</li>
        <li>Tập thể dục đều đặn</li>
        <li>Tránh hút thuốc và uống rượu bia</li>
        <li>Quản lý stress</li>
        <li>Có chế độ ăn giàu chất chống oxy hóa</li>
        <li>Tránh tiếp xúc với nhiệt độ cao ở vùng kín</li>
      </ul>
      
      <h3>Khi nào cần đi khám?</h3>
      <p>Hãy đến gặp bác sĩ nếu bạn gặp phải:</p>
      <ul>
        <li>Khó khăn trong việc có con sau 6-12 tháng cố gắng</li>
        <li>Vấn đề về cương dương kéo dài</li>
        <li>Đau hoặc khó chịu ở vùng kín</li>
        <li>Thay đổi về ham muốn tình dục</li>
      </ul>
    `,
    imageUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&h=400&fit=crop",
    category: "Sức khỏe nam giới",
    author: "BS. Đỗ Văn G",
    views: 1654,
    createdAt: "2024-11-25T08:45:00Z",
    updatedAt: "2024-11-25T08:45:00Z"
  },
  {
    id: 8,
    title: "Tầm quan trọng của vaccine HPV",
    content: `
      <p>Virus HPV (Human Papillomavirus) là một trong những virus lây truyền qua đường tình dục phổ biến nhất. May mắn là chúng ta có vaccine để phòng ngừa các biến chứng nghiêm trọng do HPV gây ra.</p>
      
      <h3>HPV là gì?</h3>
      <p>HPV bao gồm hơn 100 chủng virus khác nhau. Một số chủng có thể gây ra mụn cóc sinh dục, trong khi những chủng khác có thể dẫn đến ung thư cổ tử cung, âm đạo, âm hộ, hậu môn, dương vật và họng.</p>
      
      <h3>Ai nên tiêm vaccine HPV?</h3>
      <ul>
        <li>Trẻ em gái và trai từ 9-14 tuổi (2 liều)</li>
        <li>Thanh thiếu niên và người trẻ tuổi 15-26 tuổi (3 liều)</li>
        <li>Một số người lớn 27-45 tuổi sau tham khảo ý kiến bác sĩ</li>
      </ul>
      
      <h3>Lợi ích của vaccine HPV</h3>
      <p>Vaccine có thể ngăn ngừa:</p>
      <ul>
        <li>90% các trường hợp ung thư cổ tử cung</li>
        <li>90% các trường hợp mụn cóc sinh dục</li>
        <li>Các loại ung thư khác liên quan đến HPV</li>
      </ul>
      
      <h3>Tác dụng phụ</h3>
      <p>Vaccine HPV rất an toàn. Tác dụng phụ thường gặp là:</p>
      <ul>
        <li>Đau nhẹ tại chỗ tiêm</li>
        <li>Sốt nhẹ</li>
        <li>Chóng mặt ngắn</li>
      </ul>
      
      <blockquote>Vaccine HPV là một trong những tiến bộ quan trọng nhất trong y học dự phòng, giúp bảo vệ hàng triệu người khỏi ung thư.</blockquote>
    `,
    imageUrl: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&h=400&fit=crop",
    category: "Phòng ngừa",
    author: "BS. Vũ Thị H",
    views: 2187,
    createdAt: "2024-11-22T15:10:00Z",
    updatedAt: "2024-11-22T15:10:00Z"
  }
];

// Function để get blog theo ID
export const getBlogById = (id) => {
  return mockBlogs.find(blog => blog.id === parseInt(id));
};

// Function để lọc blog theo category
export const getBlogsByCategory = (category) => {
  return mockBlogs.filter(blog => blog.category === category);
};

// Function để search blog
export const searchBlogs = (searchTerm) => {
  const term = searchTerm.toLowerCase();
  return mockBlogs.filter(blog => 
    blog.title.toLowerCase().includes(term) ||
    blog.content.toLowerCase().includes(term) ||
    blog.category.toLowerCase().includes(term)
  );
};

// Function để get blog liên quan
export const getRelatedBlogs = (currentBlogId, limit = 3) => {
  const currentBlog = getBlogById(currentBlogId);
  if (!currentBlog) return [];
  
  return mockBlogs
    .filter(blog => 
      blog.id !== currentBlogId && 
      (blog.category === currentBlog.category || blog.author === currentBlog.author)
    )
    .slice(0, limit);
};

export default mockBlogs;
