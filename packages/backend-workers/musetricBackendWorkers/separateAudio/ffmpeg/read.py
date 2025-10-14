import numpy as np

from musetricBackendWorkers.separateAudio.ffmpeg.runner import runFfmpeg


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

    rawBytes = runFfmpeg(
        ffmpegCommand,
        captureStdout=True,
        context="ffmpeg failed to read audio",
    )
    if not rawBytes:
        raise RuntimeError("ffmpeg produced no audio data")

    samples = np.frombuffer(rawBytes, dtype=np.float32)
    if samples.size % channels != 0:
        numFrames = samples.size // channels
        samples = samples[: numFrames * channels]
    numFrames = samples.size // channels
    audioChannelsFirst = samples.reshape(numFrames, channels).T

    return np.ascontiguousarray(audioChannelsFirst, dtype=np.float32)
