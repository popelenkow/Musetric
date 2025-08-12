import subprocess
import sys

import torch

try:
    import onnxruntime as ort
except Exception:
    ort = None


def ensureFfmpeg() -> None:
    try:
        subprocess.run(
            ["ffmpeg", "-version"],
            capture_output=True,
            text=True,
            check=True,
        )
    except Exception:
        print(
            "FFmpeg not found in PATH. Please install and add ...\\ffmpeg\\bin to PATH.",
            file=sys.stderr,
        )
        raise


def printAccelerationInfo() -> None:
    print("=== Acceleration info ===")
    print(f"PyTorch: {torch.__version__}")
    print(f"CUDA available: {torch.cuda.is_available()}")

    if torch.cuda.is_available():
        print(f"CUDA device count: {torch.cuda.device_count()}")
        print(f"CUDA current device: {torch.cuda.current_device()}")
        print(f"CUDA device name: {torch.cuda.get_device_name(0)}")
    else:
        print("WARNING: PyTorch built without CUDA or drivers/CUDA incompatible.")

    if ort:
        try:
            print(f"ONNX Runtime: {ort.__version__}")
            print(f"ONNX device: {ort.get_device()}")
            print(f"ONNX providers: {ort.get_available_providers()}")
        except Exception as e:
            print(f"ONNX Runtime info error: {e}")

    print("=========================")


def setupTorchOptimization() -> None:
    try:
        torch.set_float32_matmul_precision("high")
    except Exception:
        pass
