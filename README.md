# 🎵 MixMatch - Professional Audio Mastering

MixMatch is a modern web application that automatically masters your audio tracks to match professional reference tracks. Built with React, FastAPI, and the powerful Matchering library.

![MixMatch](https://img.shields.io/badge/React-18.2-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green) ![Python](https://img.shields.io/badge/Python-3.8+-yellow)

## ✨ Features

- **Drag & Drop Upload**: Intuitive file upload for target and reference tracks
- **Automated Mastering**: Uses the Matchering library for professional audio processing
- **Real-time Progress**: Visual feedback during processing
- **Before/After Comparison**: Toggle between original and mastered versions
- **Waveform Visualization**: See the audio waveform of your processed track
- **One-Click Download**: Export your mastered track instantly
- **Dark Mode UI**: Clean, modern interface with Deep Grey (#1a1a1b) and Vibrant Purple (#8b5cf6)

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern UI library
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool
- **react-dropzone** - Drag & drop file upload
- **Axios** - HTTP client

### Backend
- **FastAPI** - High-performance Python web framework
- **Matchering** - Audio mastering library
- **librosa** - Audio analysis and visualization
- **Uvicorn** - ASGI server

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **Python** (3.8 or higher)
- **pip** (Python package manager)
- **FFmpeg** (required by Matchering for audio processing)

### Installing FFmpeg

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

**Windows:**
Download from [ffmpeg.org](https://ffmpeg.org/download.html) and add to PATH.

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
cd /Users/scripty/LocalDocuments/MixMatch/MixMatch
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment
python3 -m venv venv

# Activate virtual environment
# macOS/Linux:
source venv/bin/activate
# Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create necessary directories
mkdir -p uploads processed
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

## 🎬 Running the Application

### Start the Backend (Terminal 1)

```bash
cd backend
source venv/bin/activate  # Activate virtual environment if not already active
python main.py
```

The backend will start on `http://localhost:8000`

**API Endpoints:**
- `POST /mix` - Upload and process audio files
- `GET /status/{job_id}` - Check processing status
- `GET /download/{filename}` - Download processed file
- `GET /health` - Health check

### Start the Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

Open your browser and navigate to `http://localhost:5173`

## 📖 Usage

1. **Upload Files**
   - Drag & drop or click to select your **Target Track** (unmixed audio)
   - Drag & drop or click to select your **Reference Track** (professional track to mimic)

2. **Start Mastering**
   - Click the "Start Mastering" button
   - Watch the progress bar as your audio is processed

3. **Review Results**
   - Use the Before/After toggle to compare versions
   - View the waveform visualization
   - Play both versions using the built-in audio player

4. **Download**
   - Click the "Download" button to save your mastered track
   - The file will be saved as a WAV file

5. **Master Another Track**
   - Click "Master Another Track" to start over

## 🎵 Supported Audio Formats

- **MP3** (.mp3)
- **WAV** (.wav)
- **FLAC** (.flac)
- **OGG** (.ogg)
- **M4A** (.m4a)

## 🏗️ Project Structure

```
MixMatch/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── audio_processor.py      # Audio processing logic
│   ├── requirements.txt        # Python dependencies
│   ├── uploads/               # Temporary upload directory
│   └── processed/             # Processed files directory
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main application component
│   │   ├── main.jsx           # Entry point
│   │   ├── index.css          # Global styles
│   │   └── components/
│   │       ├── FileDropzone.jsx        # File upload component
│   │       ├── AudioPlayer.jsx         # Audio playback component
│   │       ├── ProgressBar.jsx         # Progress indicator
│   │       └── WaveformVisualizer.jsx  # Waveform display
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── LICENSE
└── README.md
```

## 🔧 Configuration

### Backend Configuration

Edit `backend/main.py` to modify:
- **Port**: Change `uvicorn.run(app, host="0.0.0.0", port=8000)`
- **CORS origins**: Update `allow_origins` list
- **Upload directories**: Modify `UPLOAD_DIR` and `PROCESSED_DIR`

### Frontend Configuration

Edit `frontend/src/App.jsx` to modify:
- **API URL**: Change `API_BASE_URL` constant

## 🎨 Customization

### Theme Colors

The application uses a custom color scheme defined in `tailwind.config.js`:

```javascript
colors: {
  'deep-grey': '#1a1a1b',      // Background color
  'vibrant-purple': '#8b5cf6',  // Accent color
}
```

Modify these values to customize the theme.

## 📝 API Documentation

Once the backend is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## 🐛 Troubleshooting

### Backend Issues

**Error: `matchering` module not found**
```bash
pip install matchering
```

**Error: FFmpeg not found**
- Install FFmpeg following the instructions in Prerequisites

**Error: Port 8000 already in use**
- Change the port in `main.py` or kill the process using port 8000

### Frontend Issues

**Error: Dependencies not installed**
```bash
cd frontend
npm install
```

**Error: Cannot connect to backend**
- Ensure backend is running on `http://localhost:8000`
- Check CORS configuration in `backend/main.py`

**Error: Port 5173 already in use**
- Vite will automatically try the next available port
- Or manually kill the process using port 5173

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Matchering](https://github.com/sergree/matchering) - Audio mastering library
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [React](https://react.dev/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [librosa](https://librosa.org/) - Audio analysis library

## 📧 Support

For issues and questions, please open an issue on the GitHub repository.

---

**Built with ❤️ and 🎵**
