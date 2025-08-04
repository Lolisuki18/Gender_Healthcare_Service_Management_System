export const formatTextToHtml = (text) => {
  if (!text) return '';
  
  return text
    // Escape HTML characters để tránh XSS
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    // Chuyển đổi line breaks thành HTML
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n\n+/g, '</p><p>')
    .replace(/\n/g, '<br>')
    // Wrap trong paragraph tags
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
};

export const processBlogContent = (content) => {
  if (!content) return '';
  
  let processedContent = content;

  processedContent = processedContent
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  
  // Normalize line breaks
  processedContent = processedContent
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');
  
  // Chuyển đổi markdown-style formatting cơ bản
  processedContent = processedContent
    // Bold text: **text** -> <strong>text</strong>
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic text: *text* -> <em>text</em>
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Underline: __text__ -> <u>text</u>
    .replace(/__(.*?)__/g, '<u>$1</u>')
    // Headers: ### text -> <h3>text</h3>
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    // Bullet points: - text -> <li>text</li>
    .replace(/^- (.*$)/gm, '<li>$1</li>');
  
  // Wrap consecutive list items in <ul> tags
  processedContent = wrapListItems(processedContent);
  
  // Xử lý line breaks và paragraphs cuối cùng
  processedContent = processedContent
    // Chuyển đổi double line breaks thành paragraph breaks
    .replace(/\n\n+/g, '</p><p>')
    // Chuyển đổi single line breaks thành <br>
    .replace(/\n/g, '<br>')
    // Wrap toàn bộ content trong paragraph tags
    .replace(/^(.+)$/, '<p>$1</p>');
  
  return processedContent;
};

const wrapListItems = (content) => {
  // Tách content thành các dòng để xử lý
  const lines = content.split('\n');
  const result = [];
  let inList = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isListItem = line.trim().startsWith('<li>') && line.trim().endsWith('</li>');
    
    if (isListItem && !inList) {
      // Bắt đầu một list mới
      result.push('<ul>');
      result.push(line);
      inList = true;
    } else if (isListItem && inList) {
      // Tiếp tục list hiện tại
      result.push(line);
    } else if (!isListItem && inList) {
      // Kết thúc list hiện tại
      result.push('</ul>');
      result.push(line);
      inList = false;
    } else {
      // Dòng bình thường
      result.push(line);
    }
  }
  
  // Nếu vẫn đang trong list thì đóng nó
  if (inList) {
    result.push('</ul>');
  }
  
  return result.join('\n');
};

export const getCleanTextPreview = (htmlContent, maxLength = 150) => {
  if (!htmlContent) return '';
  
  // Loại bỏ HTML tags
  const plainText = htmlContent
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
  
  if (plainText.length <= maxLength) return plainText;
  
  // Cắt tại từ cuối cùng để tránh cắt giữa từ
  const truncated = plainText.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > maxLength * 0.8) {
    return truncated.substring(0, lastSpaceIndex) + '...';
  }
  
  return truncated + '...';
};

export const validateBlogContent = (content) => {
  if (!content || !content.trim()) {
    return {
      isValid: false,
      message: 'Nội dung không được để trống'
    };
  }
  
  if (content.length > 10000) {
    return {
      isValid: false,
      message: 'Nội dung không được vượt quá 10,000 ký tự'
    };
  }
  
  return {
    isValid: true,
    message: 'Nội dung hợp lệ'
  };
};

export const createExcerpt = (content, length = 200) => {
  if (!content) return '';
  
  // Lấy đoạn đầu tiên (trước dấu xuống dòng kép đầu tiên)
  const firstParagraph = content.split('\n\n')[0] || content;
  
  return getCleanTextPreview(firstParagraph, length);
};

export const countWords = (content) => {
  if (!content) return 0;
  
  const plainText = content.replace(/<[^>]*>/g, '').trim();
  if (!plainText) return 0;
  
  return plainText.split(/\s+/).length;
};

export const estimateReadingTime = (content) => {
  const wordCount = countWords(content);
  const readingTime = Math.ceil(wordCount / 200);
  return Math.max(1, readingTime);
};

export const highlightKeyword = (text, keyword) => {
  if (!text || !keyword) return text;
  
  const regex = new RegExp(`(${keyword})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

export const createSlug = (title) => {
  if (!title) return '';
  
  return title
    .toLowerCase()
    .trim()
    // Chuyển ký tự có dấu thành không dấu
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Thay thế ký tự đặc biệt bằng dấu gạch ngang
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export default {
  formatTextToHtml,
  processBlogContent,
  getCleanTextPreview,
  validateBlogContent,
  createExcerpt,
  countWords,
  estimateReadingTime,
  highlightKeyword,
  createSlug
};
