import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Alert,
  Typography,
} from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { uploadUserAvatar } from "@/redux/thunks/userThunks";
import { selectAvatar } from "@/redux/slices/authSlice";
import localStorageUtil from "@/utils/localStorage";
import imageUrl from "@/utils/imageUrl";
import { notify } from "@/utils/notify";

// Styled component cho input file
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

/**
 * Component để tải lên avatar
 * @param {Object} props - Component props
 * @param {Function} props.onUploadSuccess - Callback khi upload thành công, nhận vào URL avatar mới
 * @param {Function} props.onUploadError - Callback khi có lỗi
 * @returns {JSX.Element} Avatar upload component
 */
function AvatarUpload({
  currentImage,
  onUploadSuccess,
  onUploadError,
  onClose,
  ...props
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Xử lý khi chọn file
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Kiểm tra loại file
    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chọn một file hình ảnh (JPG, PNG, etc.)");
      return;
    }

    // Kiểm tra kích thước file (giới hạn 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError("Kích thước file quá lớn. Vui lòng chọn file nhỏ hơn 5MB");
      return;
    }

    setSelectedFile(file);
    setError("");
  };
  // Xử lý upload file sử dụng Redux
  const dispatch = useDispatch();
  const avatarFromStore = useSelector(selectAvatar);
  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Vui lòng chọn một file hình ảnh");
      return;
    }

    // Kiểm tra đăng nhập qua localStorage
    const tokenData = localStorageUtil.get("token");
    if (!tokenData) {
      setError("Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Sử dụng Redux thunk để upload avatar
      const resultAction = await dispatch(uploadUserAvatar(selectedFile));

      // Kiểm tra kết quả từ thunk action
      if (uploadUserAvatar.fulfilled.match(resultAction)) {
        const avatarPath = resultAction.payload;

        console.log("Avatar uploaded successfully:", avatarPath);

        // Reset file selection state
        setSelectedFile(null);

        // Kích hoạt callback nếu có
        if (onUploadSuccess) {
          onUploadSuccess(avatarPath);
          console.log("onUploadSuccess callback executed with:", avatarPath);
        }

        // Đóng modal nếu có
        onClose?.();

        // Không cần reload trang, Redux sẽ cập nhật UI
        console.log("UI sẽ được cập nhật qua Redux dispatcher");
      } else if (uploadUserAvatar.rejected.match(resultAction)) {
        // Xử lý lỗi từ thunk
        throw resultAction.error;
      }
    } catch (error) {
      console.error("Lỗi khi tải avatar:", error);

      // Xử lý lỗi token hết hạn
      if (error.response?.status === 401) {
        const errorMessage =
          "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
        setError(errorMessage);

        // Chuyển hướng đến trang login sau 2 giây
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);

        // Hiển thị thông báo lỗi
        notify.error("Lỗi xác thực", errorMessage, { duration: 3000 });

        if (onUploadError) {
          onUploadError(errorMessage);
        }

        setIsLoading(false);
        return;
      }

      const errorMessage = error.message || "Không thể tải avatar lên";
      setError(errorMessage);

      // Gọi callback lỗi nếu có
      if (onUploadError) {
        onUploadError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Preview file đã chọn
  const filePreview = selectedFile ? (
    <Box sx={{ mt: 2, textAlign: "center" }}>
      <Typography variant="body2" gutterBottom>
        File đã chọn: {selectedFile.name} (
        {(selectedFile.size / 1024).toFixed(2)} KB)
      </Typography>
      {selectedFile.type.startsWith("image/") && (
        <Box
          component="img"
          src={URL.createObjectURL(selectedFile)}
          alt="Preview"
          sx={{
            maxWidth: "100%",
            maxHeight: "200px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            mt: 1,
          }}
        />
      )}
    </Box>
  ) : null;
  return (
    <Box sx={{ py: 2 }} {...props}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Show current image if available */}
      {currentImage && !selectedFile && (
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <Typography variant="body2" gutterBottom>
            Ảnh đại diện hiện tại:
          </Typography>
          <Box
            component="img"
            src={imageUrl.getFullImageUrl(currentImage)}
            alt="Current Avatar"
            sx={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              objectFit: "cover",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              mb: 2,
              border: "4px solid white",
            }}
          />
        </Box>
      )}

      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          sx={{ mb: 2 }}
          disabled={isLoading}
        >
          Chọn file ảnh
          <VisuallyHiddenInput
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </Button>{" "}
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={!selectedFile || isLoading}
            sx={{ minWidth: "120px" }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Tải lên"
            )}
          </Button>

          {onClose && (
            <Button
              variant="outlined"
              color="inherit"
              onClick={onClose}
              disabled={isLoading}
            >
              Huỷ
            </Button>
          )}
        </Box>
        {filePreview}
      </Box>
    </Box>
  );
}

export default AvatarUpload;
