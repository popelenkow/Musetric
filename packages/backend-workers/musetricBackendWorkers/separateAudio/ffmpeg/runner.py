import logging
import subprocess
from typing import Iterable, Sequence

errorKeywords: tuple[str, ...] = (
    "error",
    "fail",
    "invalid",
    "unable",
    "could not",
    "not found",
    "illegal",
)
warningKeywords: tuple[str, ...] = ("warn", "deprecated", "non monotone")


def _iterLines(output: str) -> Iterable[str]:
    for rawLine in output.splitlines():
        line = rawLine.strip()
        if line:
            yield line


def _logFfmpegOutput(stderrText: str) -> tuple[str | None, str | None]:
    logger = logging.getLogger(__name__)
    lastError: str | None = None
    lastWarning: str | None = None

    for line in _iterLines(stderrText):
        lowerLine = line.lower()
        if any(keyword in lowerLine for keyword in errorKeywords):
            logger.error("ffmpeg: %s", line)
            lastError = line
        elif any(keyword in lowerLine for keyword in warningKeywords):
            logger.warning("ffmpeg: %s", line)
            lastWarning = line
        else:
            logger.debug("ffmpeg: %s", line)

    return lastError, lastWarning


def runFfmpeg(
    command: Sequence[str],
    *,
    inputBytes: bytes | None = None,
    captureStdout: bool = False,
    context: str,
) -> bytes:
    process = subprocess.run(
        command,
        input=inputBytes,
        stdout=subprocess.PIPE if captureStdout else subprocess.DEVNULL,
        stderr=subprocess.PIPE,
        check=False,
    )

    stderrBytes = process.stderr or b""
    stderrText = stderrBytes.decode("utf-8", errors="ignore")
    lastError, lastWarning = _logFfmpegOutput(stderrText)

    if process.returncode != 0:
        summary = lastError or lastWarning
        if not summary:
            summary = f"Process exited with code {process.returncode}"
        raise RuntimeError(f"{context}: {summary}")

    return process.stdout if captureStdout else b""
