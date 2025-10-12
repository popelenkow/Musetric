import subprocess

import numpy as np


def readAudioFile(audioFilePath: str, sampleRate: int, channels: int) -> np.ndarray:
    ffmpegCommand = [
        "ffmpeg",
        "-i",
        audioFilePath,
        "-ar",
        str(sampleRate),
        "-ac",
        str(channels),
        "-f",
        "f32le",
        "-acodec",
        "pcm_f32le",
        "-",
    ]

    try:
        result = subprocess.run(
            ffmpegCommand,
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
    except subprocess.CalledProcessError as error:
        stderrOutput = (error.stderr or b"").decode("utf-8", errors="ignore").strip()
        detail = f": {stderrOutput}" if stderrOutput else ""
        raise RuntimeError(f"ffmpeg failed to read audio{detail}") from error

    rawBytes = result.stdout
    if not rawBytes:
        raise RuntimeError("ffmpeg produced no audio data")

    samples = np.frombuffer(rawBytes, dtype=np.float32)
    if samples.size % channels != 0:
        numFrames = samples.size // channels
        samples = samples[: numFrames * channels]
    numFrames = samples.size // channels
    audioChannelsFirst = samples.reshape(numFrames, channels).T

    return np.ascontiguousarray(audioChannelsFirst, dtype=np.float32)
