import React from 'react';

// Nhận role qua props hoặc context nếu cần
const MyBlogPage = ({ role }) => {
  // Dữ liệu blog mẫu
  const blogs = [
    {
      id: 1,
      title: 'Blog đầu tiên của tôi',
      date: '2024-07-06',
      status: 'Đã đăng',
    },
    {
      id: 2,
      title: 'Kinh nghiệm sử dụng dịch vụ',
      date: '2024-07-05',
      status: 'Nháp',
    },
  ];

  // Hàm xử lý tạo blog mới (placeholder)
  const handleCreateBlog = () => {
    alert('Chức năng tạo blog mới!');
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <h2>Blog của tôi</h2>
      {/* Hiển thị role nếu có */}
      {role && (
        <div style={{ marginBottom: 16 }}>
          Role: <b>{role}</b>
        </div>
      )}
      <button onClick={handleCreateBlog} style={{ marginBottom: 24 }}>
        Tạo blog mới
      </button>
      <div>
        {blogs.length === 0 ? (
          <div>Bạn chưa có blog nào.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th
                  style={{
                    borderBottom: '1px solid #ccc',
                    textAlign: 'left',
                    padding: 8,
                  }}
                >
                  Tiêu đề
                </th>
                <th
                  style={{
                    borderBottom: '1px solid #ccc',
                    textAlign: 'left',
                    padding: 8,
                  }}
                >
                  Ngày tạo
                </th>
                <th
                  style={{
                    borderBottom: '1px solid #ccc',
                    textAlign: 'left',
                    padding: 8,
                  }}
                >
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id}>
                  <td style={{ padding: 8 }}>{blog.title}</td>
                  <td style={{ padding: 8 }}>{blog.date}</td>
                  <td style={{ padding: 8 }}>{blog.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MyBlogPage;
