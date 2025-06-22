import React, { useState, useEffect } from 'react';
import { Science as ScienceIcon } from '@mui/icons-material';
import ResultModal from './ResultModal';
import TestResultsModalContent from './TestResultsModalContent';

/**
 * TestResults - Component hiển thị modal kết quả xét nghiệm STI
 *
 * @param {Object} props
 * @param {string|number} props.testId - ID của xét nghiệm cần hiển thị
 * @param {Function} [props.onClose] - Callback được gọi khi đóng modal (tùy chọn)
 * @returns {JSX.Element} Modal hiển thị kết quả xét nghiệm
 */
const TestResults = ({ testId, onClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (testId) {
      setIsModalOpen(true);
    }
  }, [testId]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (onClose) {
      onClose();
    }
  };
  return (
    <ResultModal
      open={isModalOpen}
      onClose={handleCloseModal}
      title="Kết quả xét nghiệm STI"
      icon={<ScienceIcon />}
    >
      <TestResultsModalContent testId={testId} onClose={handleCloseModal} />
    </ResultModal>
  );
};

export default TestResults;
