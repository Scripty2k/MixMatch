import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const FileDropzone = ({ onFileSelect, label, acceptedFile }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.flac', '.ogg', '.m4a']
    },
    multiple: false,
    maxFiles: 1
  });

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragActive 
            ? 'border-vibrant-purple bg-vibrant-purple bg-opacity-10 glow-purple-md' 
            : 'border-gray-600 hover:border-vibrant-purple'
          }
          ${acceptedFile ? 'bg-vibrant-purple bg-opacity-5 glow-purple-sm' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {acceptedFile ? (
          <div className="flex flex-col items-center">
            <svg
              className="w-12 h-12 text-vibrant-purple mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
            <p className="text-vibrant-purple font-medium">{acceptedFile.name}</p>
            <p className="text-gray-400 text-sm mt-1">
              {(acceptedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <p className="text-gray-500 text-xs mt-2">Click or drag to replace</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <svg
              className="w-12 h-12 text-gray-400 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            {isDragActive ? (
              <p className="text-vibrant-purple font-medium">Drop the file here</p>
            ) : (
              <>
                <p className="text-gray-300 font-medium mb-1">
                  Drag & drop an audio file here
                </p>
                <p className="text-gray-400 text-sm">or click to browse</p>
                <p className="text-gray-500 text-xs mt-2">
                  Supports MP3, WAV, FLAC, OGG, M4A
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileDropzone;
