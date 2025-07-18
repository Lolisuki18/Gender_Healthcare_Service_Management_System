import React from 'react';
import { Pill, X } from 'lucide-react';

function PillIcon({ status }) {
  const getPillColor = (s) => {
    switch (s) {
      case 'pill': return '#66BB8A';
      case 'missed': return '#EF5350';
      case 'future': return '#42A5F5';
      case 'break': return '#BDBDBD';
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