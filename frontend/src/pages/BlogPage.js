import React, { useEffect, useState } from 'react';
import BlogCard from '../components/common/BlogCard';
import blogService from '../services/blogService';
import { useNavigate } from 'react-router-dom';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await blogService.getConfirmedBlogs(0, 100);
      setBlogs(res || []);
    } catch (e) {
      setError('Không thể tải danh sách blog.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    setError(null);
    try {
      const res = await blogService.searchBlogs(search);
      setBlogs(res || []);
    } catch (e) {
      setError('Không thể tìm kiếm blog.');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fafbfc', padding: '40px 0' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontWeight: 800, fontSize: 48, color: '#1e297b', marginBottom: 8, letterSpacing: -2 }}>
          <span style={{ color: '#1e297b' }}>Kiến Thức Y Khoa</span>
        </h1>
        <div style={{ color: '#64748b', fontSize: 18, marginBottom: 24 }}>
          Cập nhật thông tin y khoa mới nhất từ đội ngũ chuyên gia hàng đầu
        </div>
        <button
          style={{
            background: '#1976d2', color: 'white', fontWeight: 700, border: 'none', borderRadius: 8,
            padding: '12px 32px', fontSize: 18, marginBottom: 32, cursor: 'pointer', boxShadow: '0 2px 8px #e3f2fd'
          }}
          onClick={() => navigate('/blog/create')}
        >
          Tạo bài viết mới
        </button>
        <form onSubmit={handleSearch} style={{ maxWidth: 400, margin: '0 auto 32px auto', display: 'flex', alignItems: 'center', background: 'white', borderRadius: 8, boxShadow: '0 1px 4px #e3e8f0', border: '1px solid #e3e8f0' }}>
          <span style={{ marginLeft: 16, color: '#b0b8c1' }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, padding: '14px 12px', background: 'transparent' }}
          />
          <button type="submit" style={{ display: 'none' }}>Tìm</button>
        </form>
        {loading || searching ? (
          <div style={{ margin: '60px 0', color: '#1976d2', fontWeight: 600, fontSize: 20 }}>Đang tải...</div>
        ) : error ? (
          <div style={{ margin: '60px 0', color: '#ef4444', fontWeight: 600, fontSize: 18 }}>{error}</div>
        ) : blogs.length === 0 ? (
          <div style={{ margin: '60px 0', color: '#64748b', fontWeight: 500, fontSize: 18 }}>Chưa có bài viết nào.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, marginTop: 24 }}>
            {blogs.map(blog => (
              <BlogCard key={blog.id} post={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
