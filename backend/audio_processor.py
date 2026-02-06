import matchering as mg
import librosa
import numpy as np
from typing import List, Dict
import os


def process_audio(target_path: str, reference_path: str, output_path: str):
    """
    Process the target audio to match the reference using Matchering.
    
    Args:
        target_path: Path to the target (unmixed) audio file
        reference_path: Path to the reference (professional) audio file
        output_path: Path where the processed audio will be saved
    """
    # Verify files exist and are different
    if not os.path.exists(target_path):
        raise FileNotFoundError(f"Target file not found: {target_path}")
    if not os.path.exists(reference_path):
        raise FileNotFoundError(f"Reference file not found: {reference_path}")
    
    # Get file sizes for debugging
    target_size = os.path.getsize(target_path)
    reference_size = os.path.getsize(reference_path)
    
    print(f"Processing audio:")
    print(f"  Target: {target_path} ({target_size} bytes)")
    print(f"  Reference: {reference_path} ({reference_size} bytes)")
    
    # Verify files are different sizes or content
    if target_size == reference_size:
        # Check if content is identical
        with open(target_path, 'rb') as f1, open(reference_path, 'rb') as f2:
            if f1.read() == f2.read():
                raise ValueError("Target and reference files have identical content")
    
    # Use matchering to process the audio
    # The mg.process function handles all the audio matching magic
    mg.process(
        target=target_path,
        reference=reference_path,
        results=[
            mg.pcm16(output_path)
        ]
    )


def generate_waveform_data(audio_path: str, num_points: int = 500) -> List[Dict[str, float]]:
    """
    Generate waveform visualization data from an audio file.
    
    Args:
        audio_path: Path to the audio file
        num_points: Number of data points to generate for visualization
    
    Returns:
        List of dictionaries with time and amplitude values
    """
    # Load the audio file
    y, sr = librosa.load(audio_path, sr=None)
    
    # Convert stereo to mono if needed
    if len(y.shape) > 1:
        y = np.mean(y, axis=0)
    
    # Calculate the duration
    duration = len(y) / sr
    
    # Downsample to get the desired number of points
    samples_per_point = len(y) // num_points
    
    waveform_data = []
    for i in range(num_points):
        start_idx = i * samples_per_point
        end_idx = min(start_idx + samples_per_point, len(y))
        
        if start_idx < len(y):
            # Get the RMS (root mean square) amplitude for this segment
            segment = y[start_idx:end_idx]
            amplitude = np.sqrt(np.mean(segment**2))
            
            waveform_data.append({
                "time": (i / num_points) * duration,
                "amplitude": float(amplitude)
            })
    
    return waveform_data


def get_audio_duration(audio_path: str) -> float:
    """
    Get the duration of an audio file in seconds.
    
    Args:
        audio_path: Path to the audio file
    
    Returns:
        Duration in seconds
    """
    y, sr = librosa.load(audio_path, sr=None)
    return len(y) / sr
