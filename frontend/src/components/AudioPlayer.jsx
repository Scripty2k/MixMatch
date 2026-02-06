import React, { useRef, useState, useEffect } from 'react';

const AudioPlayer = ({ beforeUrl, afterUrl, onDownload }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showAfter, setShowAfter] = useState(false);
  
  const beforeAudioRef = useRef(null);
  const afterAudioRef = useRef(null);

  const currentAudioRef = showAfter ? afterAudioRef : beforeAudioRef;

  useEffect(() => {
    const audio = currentAudioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [showAfter]);

  const togglePlayPause = () => {
    const audio = currentAudioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const audio = currentAudioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleVersion = () => {
    const wasPlaying = isPlaying;
    const currentTimeValue = currentTime;
    
    if (wasPlaying) {
      currentAudioRef.current?.pause();
    }

    setShowAfter(!showAfter);

    // Sync the time on the new audio
    setTimeout(() => {
      const newAudio = showAfter ? beforeAudioRef.current : afterAudioRef.current;
      if (newAudio) {
        newAudio.currentTime = currentTimeValue;
        if (wasPlaying) {
          newAudio.play();
        }
      }
    }, 0);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-gray-800 rounded-lg p-6 shadow-lg glow-purple-sm">
      {/* Hidden audio elements */}
      <audio ref={beforeAudioRef} src={beforeUrl} />
      <audio ref={afterAudioRef} src={afterUrl} />

      {/* Toggle Switch */}
      <div className="flex items-center justify-center mb-6">
        <span className={`text-sm font-medium mr-3 ${!showAfter ? 'text-vibrant-purple' : 'text-gray-400'}`}>
          Before
        </span>
        <button
          onClick={toggleVersion}
          className="relative inline-flex h-8 w-16 items-center rounded-full bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-vibrant-purple focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-vibrant-purple transition-transform ${
              showAfter ? 'translate-x-9' : 'translate-x-1'
            }`}
          />
        </button>
        <span className={`text-sm font-medium ml-3 ${showAfter ? 'text-vibrant-purple' : 'text-gray-400'}`}>
          After
        </span>
      </div>

      {/* Current Version Label */}
      <div className="text-center mb-4">
        <span className="text-lg font-semibold text-vibrant-purple">
          {showAfter ? 'Processed Version' : 'Original Version'}
        </span>
      </div>

      {/* Progress Bar */}
      <div
        className="w-full h-2 bg-gray-700 rounded-full cursor-pointer mb-4 group"
        onClick={handleSeek}
      >
        <div
          className="h-full bg-vibrant-purple rounded-full relative transition-all"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        >
          <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-vibrant-purple rounded-full opacity-0 group-hover:opacity-100 transition-opacity glow-purple-sm"></div>
        </div>
      </div>

      {/* Time Display */}
      <div className="flex justify-between text-sm text-gray-400 mb-6">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={togglePlayPause}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-vibrant-purple hover:bg-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-vibrant-purple focus:ring-offset-2 focus:ring-offset-gray-800 glow-purple-md hover-glow-purple"
        >
          {isPlaying ? (
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <button
          onClick={onDownload}
          className="flex items-center justify-center px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-vibrant-purple focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="font-medium">Download</span>
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer;
