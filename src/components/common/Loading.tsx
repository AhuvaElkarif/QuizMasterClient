import React from 'react';
import { Loader } from '../../styles/Theme';

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = 'טוען...' }) => {
  return (
    <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
      <Loader />
      <p>{message}</p>
    </div>
  );
};

export default Loading;