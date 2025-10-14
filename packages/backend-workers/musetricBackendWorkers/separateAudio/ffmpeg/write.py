import os

import numpy as np

from musetricBackendWorkers.separateAudio.ffmpeg.runner import runFfmpeg


def writeAudioFile(
    outputPath: str, audioTimeChannels: np.ndarray, sampleRate: int, outputFormat: str
) -> None:
    if audioTimeChannels.dtype != np.float32:
        audioTimeChannels = audioTimeChannels.astype(np.float32, order="C")

    ffmpegCommand = [
        "ffmpeg",
        "-f",
        "f32le",
        "-ar",
        str(sampleRate),
        "-ac",
        str(audioTimeChannels.shape[1]),
        "-i",
        "-",
    ]

    if outputFormat == "flac":
        ffmpegCommand += ["-c:a", "flac", "-sample_fmt", "s32"]
    elif outputFormat == "wav":
        ffmpegCommand += ["-c:a", "pcm_f32le"]

    ffmpegCommand += ["-f", outputFormat, "-y", outputPath]

    pcmInterleavedBytes = audioTimeChannels.tobytes(order="C")

    os.makedirs(os.path.dirname(outputPath), exist_ok=True)

    runFfmpeg(
        ffmpegCommand,
        inputBytes=pcmInterleavedBytes,
        captureStdout=False,
        context="ffmpeg failed to write audio",
    )
