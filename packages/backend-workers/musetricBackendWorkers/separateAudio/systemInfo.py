import logging
import subprocess

import torch


def ensureFfmpeg() -> None:
    try:
        subprocess.run(["ffmpeg", "-version"], capture_output=True, check=True)
    except Exception:
        logging.error(
            "FFmpeg not found in PATH. Please install and add ...\\ffmpeg\\bin to PATH."
        )
        raise


def printAccelerationInfo() -> None:
    logging.debug("=== Acceleration info ===")
    logging.debug(f"PyTorch: {torch.__version__}")

    cudaAvailable = torch.cuda.is_available()
    logging.debug(f"CUDA available: {cudaAvailable}")

    if cudaAvailable:
        deviceName = torch.cuda.get_device_name(torch.cuda.current_device())
        logging.debug(f"CUDA device name: {deviceName}")
    else:
        logging.warning("PyTorch built without CUDA or drivers/CUDA incompatible.")

    logging.debug("=========================")


def setupTorchOptimization() -> None:
    try:
        torch.set_float32_matmul_precision("high")
    except Exception:
        pass

    try:
        torch.backends.cuda.enable_flash_sdp(True)
        flashEnabled = torch.backends.cuda.flash_sdp_enabled()
        logging.debug(f"Flash SDP enabled: {flashEnabled}")
    except Exception as e:
        logging.warning(f"Could not enable Flash SDP: {e}")
