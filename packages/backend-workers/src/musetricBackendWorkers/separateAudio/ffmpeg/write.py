import subprocess

import numpy as np


def writeAudioFile(
    outputPath: str, audioTimeChannels: np.ndarray, sampleRate: int, outputFormat: str
) -> None:
    if audioTimeChannels.dtype != np.float32:
        audioTimeChannels = audioTimeChannels.astype(np.float32, order="C")

    outputFormatLower = (outputFormat or "").strip().lower()
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

    if outputFormatLower == "flac":
        ffmpegCommand += ["-c:a", "flac", "-sample_fmt", "s32"]
    elif outputFormatLower == "wav":
        ffmpegCommand += ["-c:a", "pcm_f32le"]

    ffmpegCommand += ["-y", outputPath]

    pcmInterleavedBytes = audioTimeChannels.tobytes(order="C")

    subprocess.run(
        ffmpegCommand,
        input=pcmInterleavedBytes,
        stdout=None,
        stderr=None,
        check=True,
    )
