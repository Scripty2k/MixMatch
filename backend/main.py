from fastapi import FastAPI, UploadFile, File, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import os
import uuid
import hashlib
from pathlib import Path
from audio_processor import process_audio, generate_waveform_data
import shutil

app = FastAPI(title="MixMatch API")

# Configure CORS for local development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://scripty2k.github.io",
        "https://scripty2k.github.io/MixMatch"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Maximum file size: 100MB
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB in bytes

# Create necessary directories
UPLOAD_DIR = Path("uploads")
PROCESSED_DIR = Path("processed")
UPLOAD_DIR.mkdir(exist_ok=True)
PROCESSED_DIR.mkdir(exist_ok=True)

# Mount processed files directory for serving
app.mount("/files", StaticFiles(directory="processed"), name="files")

# Store job status in memory (use Redis or DB for production)
job_status = {}


async def process_audio_task(job_id: str, target_path: str, reference_path: str, output_path: str):
    """Background task to process audio files."""
    try:
        job_status[job_id] = {"status": "processing", "progress": 0}
        
        # Process the audio files using matchering
        process_audio(target_path, reference_path, output_path)
        
        job_status[job_id]["progress"] = 80
        
        # Generate waveform data for visualization
        waveform_data = generate_waveform_data(output_path)
        
        job_status[job_id] = {
            "status": "completed",
            "progress": 100,
            "file_url": f"/files/{Path(output_path).name}",
            "waveform_data": waveform_data
        }
        
        # Clean up uploaded files
        os.remove(target_path)
        os.remove(reference_path)
        
    except Exception as e:
        job_status[job_id] = {
            "status": "failed",
            "error": str(e)
        }


@app.post("/mix")
async def mix_audio(
    background_tasks: BackgroundTasks,
    target: UploadFile = File(...),
    reference: UploadFile = File(...)
):
    """
    Mix the target audio file to match the reference audio file.
    
    Args:
        target: The unmixed song to be processed
        reference: The professional track to mimic
    
    Returns:
        JSON with job_id for tracking processing status
    """
    # Validate file types
    allowed_extensions = {".wav", ".mp3", ".flac", ".ogg", ".m4a"}
    
    target_ext = Path(target.filename).suffix.lower()
    reference_ext = Path(reference.filename).suffix.lower()
    
    if target_ext not in allowed_extensions or reference_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(allowed_extensions)}"
        )
    
    # Generate unique job ID
    job_id = str(uuid.uuid4())
    
    # Save uploaded files with unique names
    target_filename = f"{job_id}_target{target_ext}"
    reference_filename = f"{job_id}_reference{reference_ext}"
    output_filename = f"{job_id}_processed.wav"
    
    target_path = UPLOAD_DIR / target_filename
    reference_path = UPLOAD_DIR / reference_filename
    output_path = PROCESSED_DIR / output_filename
    
    # Save uploaded files with size validation
    try:
        # Save target file and compute hash
        target_size = 0
        target_hash = hashlib.md5()
        with open(target_path, "wb") as buffer:
            while True:
                chunk = await target.read(8192)  # Read in 8KB chunks
                if not chunk:
                    break
                target_size += len(chunk)
                target_hash.update(chunk)
                if target_size > MAX_FILE_SIZE:
                    os.remove(target_path)
                    raise HTTPException(
                        status_code=413,
                        detail=f"Target file too large. Maximum size: {MAX_FILE_SIZE // (1024*1024)}MB"
                    )
                buffer.write(chunk)
        
        # Save reference file and compute hash
        reference_size = 0
        reference_hash = hashlib.md5()
        with open(reference_path, "wb") as buffer:
            while True:
                chunk = await reference.read(8192)  # Read in 8KB chunks
                if not chunk:
                    break
                reference_size += len(chunk)
                reference_hash.update(chunk)
                if reference_size > MAX_FILE_SIZE:
                    os.remove(target_path)
                    os.remove(reference_path)
                    raise HTTPException(
                        status_code=413,
                        detail=f"Reference file too large. Maximum size: {MAX_FILE_SIZE // (1024*1024)}MB"
                    )
                buffer.write(chunk)
        
        # Verify files are different
        target_digest = target_hash.hexdigest()
        reference_digest = reference_hash.hexdigest()
        
        print(f"File hashes - Target: {target_digest}, Reference: {reference_digest}")
        print(f"File sizes - Target: {target_size} bytes, Reference: {reference_size} bytes")
        
        if target_digest == reference_digest:
            os.remove(target_path)
            os.remove(reference_path)
            raise HTTPException(
                status_code=400,
                detail="Target and reference files are identical. Please upload two different audio files."
            )
    except HTTPException:
        raise
    except Exception as e:
        # Clean up any partially saved files
        if target_path.exists():
            os.remove(target_path)
        if reference_path.exists():
            os.remove(reference_path)
        raise HTTPException(status_code=500, detail=f"Error saving files: {str(e)}")
    
    # Initialize job status
    job_status[job_id] = {"status": "queued", "progress": 0}
    
    # Add processing task to background
    background_tasks.add_task(
        process_audio_task,
        job_id,
        str(target_path),
        str(reference_path),
        str(output_path)
    )
    
    return {
        "job_id": job_id,
        "message": "Processing started"
    }


@app.get("/status/{job_id}")
async def get_status(job_id: str):
    """Get the processing status of a job."""
    if job_id not in job_status:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return job_status[job_id]


@app.get("/download/{filename}")
async def download_file(filename: str):
    """Download the processed audio file."""
    file_path = PROCESSED_DIR / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(
        path=file_path,
        media_type="audio/wav",
        filename=filename
    )


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
