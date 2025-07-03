import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BlogCard.module.css';
import { getBlogImageUrl, getAvatarUrl } from '../../utils/imageUrl';

function formatDateVN(date) {
  if (!date) return '';
  let d = date;
  if (Array.isArray(d) && d.length >= 3) {
    // [YYYY, MM, DD, hh, mm, ss, ms] (tháng trong JS là 0-based)
    d = new Date(d[0], d[1] - 1, d[2], d[3] || 0, d[4] || 0, d[5] || 0, d[6] || 0);
  } else if (!(d instanceof Date)) {
    d = new Date(d);
  }
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' });
}

const BlogCard = ({ post, truncateContent = 120 }) => {
  const navigate = useNavigate();
  if (!post) return null;

  const handleReadMore = () => navigate(`/blog/${post.id}`);

  const getCleanContentPreview = (content, maxLength) => {
    if (!content) return '';
    const cleanText = content.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    return cleanText.length > maxLength ? cleanText.substring(0, maxLength) + '...' : cleanText;
  };

  const getBlogStatusBadge = (status) => {
    const statusMap = {
      'CONFIRMED': { text: 'Đã duyệt', class: 'confirmed' },
      'PROCESSING': { text: 'Đang xử lý', class: 'processing' },
      'CANCELED': { text: 'Đã hủy', class: 'canceled' }
    };
    return statusMap[status] || { text: status, class: 'default' };
  };

  return (
    <article className={styles.blogCard} onClick={handleReadMore}>
      <div className={styles.blogCardImage}>
        <img
          src={getBlogImageUrl(post.thumbnailImage || post.existingThumbnail)}
          alt={post.title || 'Blog thumbnail'}
          onError={e => { e.target.src = getBlogImageUrl('/img/blog/default.jpg'); }}
        />
        {post.status && post.status !== 'CONFIRMED' && (
          <div className={`${styles.statusBadge} ${styles[getBlogStatusBadge(post.status).class]}`}>
            <div className={styles.statusIcon}>
              {post.status === 'PROCESSING' && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>
              )}
              {post.status === 'CANCELED' && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
              )}
            </div>
            {getBlogStatusBadge(post.status).text}
          </div>
        )}
        <div className={styles.imageOverlay}>
          <div className={styles.overlayContent}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            <span>Xem chi tiết</span>
          </div>
        </div>
      </div>
      <div className={styles.blogCardContent}>
        <div className={styles.blogCardMeta}>
          <span className={styles.category}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
            {post.categoryName}
          </span>
          <span className={styles.date}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            {formatDateVN(post.createdAt)}
          </span>
        </div>
        <h3 className={styles.blogCardTitle} title={post.title}>{post.title}</h3>
        <p className={styles.blogCardExcerpt}>{getCleanContentPreview(post.content, truncateContent)}</p>
        <div className={styles.blogCardFooter}>
          <div className={styles.authorInfo}>
            <div className={styles.authorAvatarWrapper}>
              <img
                src={getAvatarUrl(post.authorAvatar)}
                alt={post.authorName || 'Tác giả'}
                className={styles.authorAvatar}
                onError={e => { e.target.src = getAvatarUrl('/img/avatar/default.jpg'); }}
              />
              <div className={styles.authorStatus}></div>
            </div>
            <div className={styles.authorDetails}>
              <span className={styles.authorName}>{post.authorName || 'Admin'}</span>
              <span className={styles.authorRole}>Tác giả</span>
            </div>
          </div>
          <button
            onClick={e => { e.stopPropagation(); handleReadMore(); }}
            className={styles.readMoreBtn}
            aria-label={`Đọc thêm bài viết: ${post.title}`}
          >
            <span>Đọc thêm</span>
            <div className={styles.btnIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17l9.2-9.2M17 17V7H7"></path></svg>
            </div>
          </button>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
