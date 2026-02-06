import { useState, useEffect } from 'react';
import axios from 'axios';
import FileDropzone from './components/FileDropzone';
import ProgressBar from './components/ProgressBar';
import AudioPlayer from './components/AudioPlayer';
import WaveformVisualizer from './components/WaveformVisualizer';

const API_BASE_URL = 'http://localhost:8000';

function App() {
  const [targetFile, setTargetFile] = useState(null);
  const [referenceFile, setReferenceFile] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null);
  const [progress, setProgress] = useState(0);
  const [processedFileUrl, setProcessedFileUrl] = useState(null);
  const [originalFileUrl, setOriginalFileUrl] = useState(null);
  const [waveformData, setWaveformData] = useState(null);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Poll for job status
  useEffect(() => {
    if (!jobId || status === 'completed' || status === 'failed') return;

    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/status/${jobId}`);
        const data = response.data;
        
        setStatus(data.status);
        setProgress(data.progress || 0);

        if (data.status === 'completed') {
          setProcessedFileUrl(`${API_BASE_URL}${data.file_url}`);
          setWaveformData(data.waveform_data);
          setIsProcessing(false);
        } else if (data.status === 'failed') {
          setError(data.error || 'Processing failed');
          setIsProcessing(false);
        }
      } catch (err) {
        console.error('Error fetching status:', err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [jobId, status]);

  const handleSubmit = async () => {
    if (!targetFile || !referenceFile) {
      setError('Please select both target and reference files');
      return;
    }

    setError(null);
    setIsProcessing(true);
    setStatus('queued');
    setProgress(0);

    // Create object URL for original file
    const originalUrl = URL.createObjectURL(targetFile);
    setOriginalFileUrl(originalUrl);

    const formData = new FormData();
    formData.append('target', targetFile);
    formData.append('reference', referenceFile);

    try {
      const response = await axios.post(`${API_BASE_URL}/mix`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setJobId(response.data.job_id);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to start processing');
      setIsProcessing(false);
      setStatus(null);
    }
  };

  const handleDownload = async () => {
    if (!processedFileUrl) return;

    const filename = processedFileUrl.split('/').pop();
    const response = await fetch(processedFileUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setTargetFile(null);
    setReferenceFile(null);
    setJobId(null);
    setStatus(null);
    setProgress(0);
    setProcessedFileUrl(null);
    setOriginalFileUrl(null);
    setWaveformData(null);
    setError(null);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-deep-grey">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-vibrant-purple rounded-lg flex items-center justify-center mr-3 glow-purple-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white">
                Mix<span className="text-vibrant-purple">Match</span>
              </h1>
            </div>
            <a 
              href="https://github.com/Scripty2k" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 text-sm hidden sm:flex hover:text-vibrant-purple transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              Scripty2k on GitHub
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!processedFileUrl ? (
          <div className="max-w-4xl mx-auto">
            {/* Description */}
            <div className="text-center mb-12">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Transform Your Audio to Match Professional Standards
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Upload your unmixed track and a professional reference track. 
                MixMatch will automatically master your audio to match the reference's sonic characteristics.
              </p>
            </div>

            {/* File Upload Section */}
            <div className="relative">
              {/* Strobing glow background */}
              <div className="absolute inset-0 bg-vibrant-purple rounded-xl blur-2xl opacity-20 animate-pulse"></div>
              
              <div className="relative bg-gray-900 rounded-xl p-8 shadow-xl mb-6 glow-purple-sm">
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <FileDropzone
                    label="Target Track"
                    onFileSelect={setTargetFile}
                    acceptedFile={targetFile}
                  />
                  <FileDropzone
                    label="Reference Track"
                    onFileSelect={setReferenceFile}
                    acceptedFile={referenceFile}
                  />
                </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-900 bg-opacity-20 border border-red-500 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Progress Bar */}
              {isProcessing && (
                <div className="mb-6">
                  <ProgressBar progress={progress} status={status} />
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!targetFile || !referenceFile || isProcessing}
                className={`
                  w-full py-4 px-6 rounded-lg font-semibold text-white
                  transition-all duration-200 transform
                  ${targetFile && referenceFile && !isProcessing
                    ? 'bg-vibrant-purple hover:bg-purple-600 hover:scale-[1.02] active:scale-[0.98] hover-glow-purple glow-purple-sm'
                    : 'bg-gray-700 cursor-not-allowed opacity-50'
                  }
                `}
              >
                {isProcessing ? 'Processing...' : 'Start Mastering'}
              </button>
            </div>
            </div>

            {/* Info Cards */}
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover-glow-purple">
                <div className="w-12 h-12 bg-vibrant-purple bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-vibrant-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Fast Processing</h3>
                <p className="text-gray-400 text-sm">
                  Automated mastering in minutes, not hours
                </p>
              </div>

              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover-glow-purple">
                <div className="w-12 h-12 bg-vibrant-purple bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-vibrant-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Professional Quality</h3>
                <p className="text-gray-400 text-sm">
                  Match industry-standard sonic characteristics
                </p>
              </div>

              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover-glow-purple">
                <div className="w-12 h-12 bg-vibrant-purple bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-vibrant-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Compare Results</h3>
                <p className="text-gray-400 text-sm">
                  A/B test your before and after audio
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Success Message */}
            <div className="bg-green-900 bg-opacity-20 border border-green-500 rounded-lg p-6 mb-8">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-green-400">Mastering Complete!</h3>
                  <p className="text-green-300 text-sm">Your audio has been successfully processed</p>
                </div>
              </div>
            </div>

            {/* Waveform Visualization */}
            {waveformData && (
              <div className="mb-6">
                <WaveformVisualizer waveformData={waveformData} />
              </div>
            )}

            {/* Audio Player */}
            <div className="mb-6">
              <AudioPlayer
                beforeUrl={originalFileUrl}
                afterUrl={processedFileUrl}
                onDownload={handleDownload}
              />
            </div>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="w-full py-3 px-6 rounded-lg font-medium text-white bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              Master Another Track
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            Powered by Matchering • Built by{' '}
            <a 
              href="https://scripty2k.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-vibrant-purple transition-colors"
            >
              scripty2k.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
