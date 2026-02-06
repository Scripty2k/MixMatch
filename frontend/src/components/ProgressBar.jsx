import React from 'react';

const ProgressBar = ({ progress, status, uploadProgress }) => {
  const getStatusText = () => {
    switch (status) {
      case 'uploading':
        return 'Uploading files...';
      case 'queued':
        return 'Queued for processing...';
      case 'processing':
        return 'Processing audio...';
      case 'completed':
        return 'Processing complete!';
      case 'failed':
        return 'Processing failed';
      default:
        return 'Waiting...';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'uploading':
        return 'bg-blue-500';
      case 'processing':
        return 'bg-vibrant-purple';
      case 'completed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-600';
    }
  };

  // Show upload progress when uploading, otherwise show processing progress
  const displayProgress = status === 'uploading' ? uploadProgress : progress;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-300">
          {getStatusText()}
        </span>
        <span className="text-sm font-medium text-vibrant-purple">
          {displayProgress}%
        </span>
      </div>
      
      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ease-out ${getStatusColor()} glow-purple-sm`}
          style={{ width: `${displayProgress}%` }}
        >
          {(status === 'processing' || status === 'uploading') && (
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
          )}
        </div>
      </div>

      {(status === 'processing' || status === 'uploading') && (
        <div className="flex items-center justify-center mt-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-vibrant-purple rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-vibrant-purple rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-vibrant-purple rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
