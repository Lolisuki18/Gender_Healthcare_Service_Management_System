import React from 'react';
import { Pill, X } from 'lucide-react';

function PillIcon({ status }) {
  const getPillColor = (s) => {
    switch (s) {
      case 'pill': return '#2ecc40';
      case 'missed': return '#e53935';
      case 'future': return '#2979ff';
      case 'break': return '#a0a4ad';
      default: return '#a0a4ad';
    }
  };

  return (
    <div style={{
      width: 28,
      height: 28,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto',
      background: getPillColor(status)
    }}>
      {status === 'break' ? (
        <X size={16} color="#fff" />
      ) : (
        <Pill size={16} color="#fff" />
      )}
    </div>
  );
}

export default PillIcon; 