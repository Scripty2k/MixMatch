import React, { useEffect, useRef } from 'react';

const WaveformVisualizer = ({ waveformData }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!waveformData || waveformData.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Find max amplitude for normalization
    const maxAmplitude = Math.max(...waveformData.map(d => d.amplitude));

    // Draw waveform
    const barWidth = width / waveformData.length;
    
    waveformData.forEach((data, index) => {
      const barHeight = (data.amplitude / maxAmplitude) * (height / 2);
      const x = index * barWidth;
      const y = height / 2;

      // Create gradient for bars
      const gradient = ctx.createLinearGradient(0, y - barHeight, 0, y + barHeight);
      gradient.addColorStop(0, '#8b5cf6');
      gradient.addColorStop(0.5, '#a78bfa');
      gradient.addColorStop(1, '#8b5cf6');

      ctx.fillStyle = gradient;
      
      // Draw bar (mirrored top and bottom)
      ctx.fillRect(x, y - barHeight, barWidth - 1, barHeight);
      ctx.fillRect(x, y, barWidth - 1, barHeight);
    });
  }, [waveformData]);

  if (!waveformData || waveformData.length === 0) {
    return (
      <div className="w-full h-32 bg-gray-800 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No waveform data available</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-800 rounded-lg p-4 glow-purple-sm">
      <h3 className="text-sm font-medium text-gray-300 mb-3">Waveform Visualization</h3>
      <canvas
        ref={canvasRef}
        width={800}
        height={120}
        className="w-full h-32 bg-gray-900 rounded"
      />
    </div>
  );
};

export default WaveformVisualizer;
